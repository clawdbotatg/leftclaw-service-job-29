// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC4626 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { AssetRegistry } from "./AssetRegistry.sol";
import { IAggregatorV3 } from "./interfaces/IAggregatorV3.sol";

interface ICLAWDFeeDistributor {
    function distributeFees(uint256 usdcAmount) external;
}

/// @title IndexVault - ERC-4626 vault for a category-specific token index
/// @notice Users deposit USDC, vault holds basket of tokens at target weights
/// @dev NAV calculated from Chainlink feeds. Users can always exit (pause only affects rebalancing).
///      Deposits accept USDC which sits until next rebalance allocates it.
///      Withdrawals are capped at available USDC — executor must maintain a USDC buffer.
contract IndexVault is ERC4626, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Math for uint256;

    address public guardian;
    AssetRegistry public immutable registry;
    address public executor;

    string public category;
    uint256 public indexId;

    uint16 public managementFeeBPS;
    uint16 public performanceFeeBPS;
    uint16 public immutable maxFeeBPS;
    address public feeRecipient;

    address[] public constituents;
    mapping(address => bool) public isConstituent;
    mapping(address => uint16) public targetWeightBPS;

    uint256 public highWaterMark;
    uint256 public lastFeeHarvest;

    event FeesHarvested(uint256 managementFee, uint256 performanceFee);
    event WeightsUpdated(address[] tokens, uint16[] weights);
    event ExecutorUpdated(address indexed newExecutor);

    modifier onlyGuardian() {
        require(msg.sender == guardian, "Not guardian");
        _;
    }

    modifier onlyExecutor() {
        require(msg.sender == executor, "Not executor");
        _;
    }

    constructor(
        IERC20 _usdc,
        string memory _name,
        string memory _symbol,
        string memory _category,
        uint256 _indexId,
        address _guardian,
        address _registry,
        address _feeRecipient,
        uint16 _maxFeeBPS
    ) ERC4626(_usdc) ERC20(_name, _symbol) {
        require(_guardian != address(0), "Zero guardian");
        require(_registry != address(0), "Zero registry");

        guardian = _guardian;
        registry = AssetRegistry(_registry);
        category = _category;
        indexId = _indexId;
        feeRecipient = _feeRecipient;
        maxFeeBPS = _maxFeeBPS;

        managementFeeBPS = 100;
        performanceFeeBPS = 1000;
        lastFeeHarvest = block.timestamp;
    }

    function _decimalsOffset() internal pure override returns (uint8) {
        return 6;
    }

    /// @notice Max assets a user can withdraw — capped at available USDC in vault
    function maxWithdraw(address owner) public view override returns (uint256) {
        uint256 usdcAvailable = IERC20(asset()).balanceOf(address(this));
        uint256 ownerMaxAssets = convertToAssets(balanceOf(owner));
        return usdcAvailable < ownerMaxAssets ? usdcAvailable : ownerMaxAssets;
    }

    /// @notice Max shares a user can redeem — capped by available USDC in vault
    function maxRedeem(address owner) public view override returns (uint256) {
        uint256 usdcAvailable = IERC20(asset()).balanceOf(address(this));
        uint256 maxAssets = convertToAssets(balanceOf(owner));
        if (usdcAvailable >= maxAssets) {
            return balanceOf(owner);
        }
        return convertToShares(usdcAvailable);
    }

    function totalAssets() public view override returns (uint256) {
        IERC20 usdc = IERC20(asset());
        uint256 total = usdc.balanceOf(address(this));

        for (uint256 i = 0; i < constituents.length; i++) {
            address token = constituents[i];
            uint256 tokenBalance = IERC20(token).balanceOf(address(this));
            if (tokenBalance == 0) continue;

            AssetRegistry.TokenInfo memory info = registry.getTokenInfo(token);
            if (info.priceFeed == address(0)) continue;

            uint256 usdValue = _getTokenValueInUSDC(token, tokenBalance, info);
            total += usdValue;
        }

        return total;
    }

    function _getTokenValueInUSDC(address, uint256 amount, AssetRegistry.TokenInfo memory info)
        internal
        view
        returns (uint256)
    {
        IAggregatorV3 feed = IAggregatorV3(info.priceFeed);
        (, int256 price,, uint256 updatedAt,) = feed.latestRoundData();

        require(block.timestamp - updatedAt < 7200, "Stale price feed");
        require(price > 0, "Invalid price");

        uint256 exponent = uint256(info.tokenDecimals) + uint256(info.priceFeedDecimals);
        require(exponent >= 6, "Decimal underflow");

        uint256 value = (amount * uint256(price)) / (10 ** (exponent - 6));

        return value;
    }

    function updateWeights(address[] calldata tokens, uint16[] calldata weights) external onlyExecutor {
        require(tokens.length == weights.length, "Length mismatch");

        for (uint256 i = 0; i < constituents.length; i++) {
            targetWeightBPS[constituents[i]] = 0;
            isConstituent[constituents[i]] = false;
        }
        delete constituents;

        uint256 totalWeight = 0;
        for (uint256 i = 0; i < tokens.length; i++) {
            require(registry.isWhitelisted(tokens[i]), "Token not whitelisted");
            require(!isConstituent[tokens[i]], "Duplicate token");

            constituents.push(tokens[i]);
            isConstituent[tokens[i]] = true;
            targetWeightBPS[tokens[i]] = weights[i];
            totalWeight += weights[i];
        }
        require(totalWeight == 10000, "Weights must sum to 10000");

        emit WeightsUpdated(tokens, weights);
    }

    function harvestFees() external onlyExecutor returns (uint256 totalFee) {
        uint256 currentTotalAssets = totalAssets();
        uint256 currentShares = totalSupply();
        if (currentShares == 0 || currentTotalAssets == 0) return 0;

        uint256 timeDelta = block.timestamp - lastFeeHarvest;
        uint256 mgmtFee = (currentTotalAssets * managementFeeBPS * timeDelta) / (10000 * 365 days);

        uint256 navPerShare = (currentTotalAssets * 1e18) / currentShares;
        uint256 perfFee = 0;
        if (navPerShare > highWaterMark && highWaterMark > 0) {
            uint256 gain = ((navPerShare - highWaterMark) * currentShares) / 1e18;
            perfFee = (gain * performanceFeeBPS) / 10000;
            highWaterMark = navPerShare;
        } else if (highWaterMark == 0) {
            highWaterMark = navPerShare;
        }

        totalFee = mgmtFee + perfFee;
        lastFeeHarvest = block.timestamp;

        if (totalFee > 0 && feeRecipient != address(0)) {
            IERC20 usdc = IERC20(asset());
            uint256 available = usdc.balanceOf(address(this));
            if (totalFee > available) totalFee = available;
            if (totalFee > 0) {
                usdc.forceApprove(feeRecipient, totalFee);
                ICLAWDFeeDistributor(feeRecipient).distributeFees(totalFee);
            }
        }

        emit FeesHarvested(mgmtFee, perfFee);
    }

    function approveExecutor(address token, uint256 amount) external onlyExecutor {
        IERC20(token).forceApprove(executor, amount);
    }

    function setExecutor(address _executor) external onlyGuardian {
        executor = _executor;
        emit ExecutorUpdated(_executor);
    }

    function setManagementFee(uint16 newFee) external onlyGuardian {
        require(newFee <= maxFeeBPS, "Exceeds max fee");
        managementFeeBPS = newFee;
    }

    function setPerformanceFee(uint16 newFee) external onlyGuardian {
        require(newFee <= maxFeeBPS, "Exceeds max fee");
        performanceFeeBPS = newFee;
    }

    function setFeeRecipient(address _feeRecipient) external onlyGuardian {
        feeRecipient = _feeRecipient;
    }

    function transferGuardian(address newGuardian) external onlyGuardian {
        require(newGuardian != address(0), "Zero address");
        guardian = newGuardian;
    }

    function getConstituents() external view returns (address[] memory) {
        return constituents;
    }

    function getConstituentCount() external view returns (uint256) {
        return constituents.length;
    }

    function getCurrentWeights() external view returns (address[] memory tokens, uint16[] memory weights) {
        uint256 nav = totalAssets();
        tokens = constituents;
        weights = new uint16[](constituents.length);

        if (nav == 0) return (tokens, weights);

        for (uint256 i = 0; i < constituents.length; i++) {
            address token = constituents[i];
            uint256 tokenBalance = IERC20(token).balanceOf(address(this));
            if (tokenBalance == 0) continue;

            AssetRegistry.TokenInfo memory info = registry.getTokenInfo(token);
            uint256 tokenValue = _getTokenValueInUSDC(token, tokenBalance, info);
            weights[i] = uint16((tokenValue * 10000) / nav);
        }
    }
}
