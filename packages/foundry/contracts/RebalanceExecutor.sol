// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IndexVault} from "./IndexVault.sol";
import {WeightVerifier} from "./WeightVerifier.sol";
import {SafetyModule} from "./SafetyModule.sol";
import {AssetRegistry} from "./AssetRegistry.sol";
import {RouterRegistry} from "./RouterRegistry.sol";
import {ISwapRouter} from "./interfaces/ISwapRouter.sol";
import {IAggregatorV3} from "./interfaces/IAggregatorV3.sol";

/// @title RebalanceExecutor - Orchestrates vault rebalancing
/// @notice Reads verified weights, validates via SafetyModule, executes swaps, harvests fees
contract RebalanceExecutor is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant PRICE_STALENESS_THRESHOLD = 7200;

    WeightVerifier public immutable weightVerifier;
    SafetyModule public immutable safetyModule;
    AssetRegistry public immutable assetRegistry;
    RouterRegistry public immutable routerRegistry;

    mapping(address => bool) public authorizedVaults;
    mapping(address => bool) public authorizedKeepers;

    event RebalanceExecuted(address indexed vault, uint256 timestamp);
    event SwapExecuted(address indexed vault, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event KeeperSet(address indexed keeper, bool authorized);
    event TokenSwept(address indexed token, address indexed to, uint256 amount);

    modifier onlyKeeper() {
        require(authorizedKeepers[msg.sender] || msg.sender == owner(), "Not authorized keeper");
        _;
    }

    constructor(
        address _guardian,
        address _weightVerifier,
        address _safetyModule,
        address _assetRegistry,
        address _routerRegistry
    ) Ownable(_guardian) {
        weightVerifier = WeightVerifier(_weightVerifier);
        safetyModule = SafetyModule(_safetyModule);
        assetRegistry = AssetRegistry(_assetRegistry);
        routerRegistry = RouterRegistry(_routerRegistry);
    }

    function authorizeVault(address vault) external onlyOwner {
        authorizedVaults[vault] = true;
    }

    function deauthorizeVault(address vault) external onlyOwner {
        authorizedVaults[vault] = false;
    }

    function setKeeper(address keeper, bool authorized) external onlyOwner {
        authorizedKeepers[keeper] = authorized;
        emit KeeperSet(keeper, authorized);
    }

    /// @notice Recover stuck tokens from failed swaps or rounding dust
    /// @param token Token address to sweep
    /// @param to Destination address (typically a vault)
    function sweepToken(address token, address to) external onlyOwner {
        require(to != address(0), "Zero address");
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No balance");
        IERC20(token).safeTransfer(to, balance);
        emit TokenSwept(token, to, balance);
    }

    function executeRebalance(address vault, bytes[] calldata swapData) external nonReentrant onlyKeeper {
        require(authorizedVaults[vault], "Not authorized");
        require(weightVerifier.areWeightsFresh(vault), "Stale weights");
        require(safetyModule.canRebalance(vault), "Cooldown not met");

        IndexVault indexVault = IndexVault(vault);

        (address[] memory tokens, uint16[] memory newWeights,) = weightVerifier.getActiveWeights(vault);
        require(tokens.length > 0, "No weights");

        _validateAndUpdate(indexVault, tokens, newWeights);

        indexVault.harvestFees();

        _doSwaps(indexVault, tokens, newWeights, swapData);

        safetyModule.recordRebalance(vault, indexVault.totalAssets());

        emit RebalanceExecuted(vault, block.timestamp);
    }

    function _validateAndUpdate(IndexVault indexVault, address[] memory tokens, uint16[] memory newWeights) internal {
        (, uint16[] memory currentWeights) = indexVault.getCurrentWeights();

        if (currentWeights.length != tokens.length) {
            uint16[] memory paddedCurrent = new uint16[](tokens.length);
            safetyModule.validateWeights(tokens, paddedCurrent, newWeights);
        } else {
            safetyModule.validateWeights(tokens, currentWeights, newWeights);
        }

        indexVault.updateWeights(tokens, newWeights);
    }

    function _doSwaps(
        IndexVault vault,
        address[] memory tokens,
        uint16[] memory targetWeights,
        bytes[] calldata swapData
    ) internal {
        address usdc = vault.asset();
        uint256 nav = vault.totalAssets();
        if (nav == 0) return;

        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 targetValue = (nav * targetWeights[i]) / 10000;
            uint256 currentValue = _getTokenValue(tokens[i], address(vault));

            if (currentValue > targetValue) {
                bytes memory extra = i < swapData.length ? swapData[i] : bytes("");
                _sellToken(vault, tokens[i], usdc, currentValue - targetValue, extra);
            }
        }

        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 targetValue = (nav * targetWeights[i]) / 10000;
            uint256 currentValue = _getTokenValue(tokens[i], address(vault));

            if (currentValue < targetValue) {
                uint256 deficit = targetValue - currentValue;
                uint256 usdcBal = IERC20(usdc).balanceOf(address(vault));
                if (deficit > usdcBal) deficit = usdcBal;
                if (deficit == 0) continue;

                bytes memory extra = i < swapData.length ? swapData[i] : bytes("");
                _buyToken(vault, usdc, tokens[i], deficit, extra);
            }
        }
    }

    function _getTokenValue(address token, address holder) internal view returns (uint256) {
        uint256 balance = IERC20(token).balanceOf(holder);
        if (balance == 0) return 0;

        AssetRegistry.TokenInfo memory info = assetRegistry.getTokenInfo(token);
        if (info.priceFeed == address(0)) return 0;

        (, int256 price,, uint256 updatedAt,) = IAggregatorV3(info.priceFeed).latestRoundData();
        require(price > 0, "Invalid price");
        require(block.timestamp - updatedAt < PRICE_STALENESS_THRESHOLD, "Stale price feed");

        uint256 exponent = uint256(info.tokenDecimals) + uint256(info.priceFeedDecimals);
        require(exponent >= 6, "Decimal underflow");

        return (balance * uint256(price)) / (10 ** (exponent - 6));
    }

    function _sellToken(IndexVault vault, address token, address usdc, uint256 excessValue, bytes memory extraData)
        internal
    {
        AssetRegistry.TokenInfo memory info = assetRegistry.getTokenInfo(token);
        (, int256 price,, uint256 updatedAt,) = IAggregatorV3(info.priceFeed).latestRoundData();
        require(price > 0, "Invalid price");
        require(block.timestamp - updatedAt < PRICE_STALENESS_THRESHOLD, "Stale price feed");

        uint256 exponent = uint256(info.tokenDecimals) + uint256(info.priceFeedDecimals);
        require(exponent >= 6, "Decimal underflow");

        uint256 tokenAmount = (excessValue * (10 ** (exponent - 6))) / uint256(price);

        uint256 balance = IERC20(token).balanceOf(address(vault));
        if (tokenAmount > balance) tokenAmount = balance;
        if (tokenAmount == 0) return;

        uint256 minOut = (excessValue * (10000 - safetyModule.maxSlippageBPS())) / 10000;
        address router = routerRegistry.getRouter(info.preferredRouterId);

        vault.approveExecutor(token, tokenAmount);
        IERC20(token).safeTransferFrom(address(vault), address(this), tokenAmount);
        IERC20(token).forceApprove(router, tokenAmount);

        uint256 amountOut = ISwapRouter(router).swap(token, usdc, tokenAmount, minOut, extraData);
        IERC20(usdc).safeTransfer(address(vault), amountOut);

        emit SwapExecuted(address(vault), token, usdc, tokenAmount, amountOut);
    }

    function _buyToken(IndexVault vault, address usdc, address token, uint256 usdcAmount, bytes memory extraData)
        internal
    {
        AssetRegistry.TokenInfo memory info = assetRegistry.getTokenInfo(token);
        (, int256 price,, uint256 updatedAt,) = IAggregatorV3(info.priceFeed).latestRoundData();
        require(price > 0, "Invalid price");
        require(block.timestamp - updatedAt < PRICE_STALENESS_THRESHOLD, "Stale price feed");

        uint256 exponent = uint256(info.tokenDecimals) + uint256(info.priceFeedDecimals);
        require(exponent >= 6, "Decimal underflow");

        uint256 expectedTokens = (usdcAmount * (10 ** (exponent - 6))) / uint256(price);
        uint256 minTokenOut = (expectedTokens * (10000 - safetyModule.maxSlippageBPS())) / 10000;
        address router = routerRegistry.getRouter(info.preferredRouterId);

        vault.approveExecutor(usdc, usdcAmount);
        IERC20(usdc).safeTransferFrom(address(vault), address(this), usdcAmount);
        IERC20(usdc).forceApprove(router, usdcAmount);

        uint256 amountOut = ISwapRouter(router).swap(usdc, token, usdcAmount, minTokenOut, extraData);
        IERC20(token).safeTransfer(address(vault), amountOut);

        emit SwapExecuted(address(vault), usdc, token, usdcAmount, amountOut);
    }
}
