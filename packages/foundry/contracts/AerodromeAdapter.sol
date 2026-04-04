// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ISwapRouter} from "./interfaces/ISwapRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title IAerodromeRouter - Minimal Aerodrome Router interface
interface IAerodromeRouter {
    struct Route {
        address from;
        address to;
        bool stable;
        address factory;
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        Route[] calldata routes,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function defaultFactory() external view returns (address);
}

/// @title AerodromeAdapter - ISwapRouter adapter wrapping Aerodrome on Base
/// @notice Primary swap router for ClawDex rebalancing. Supports stable + volatile pools.
/// @dev extraData encodes: abi.encode(bool stable) — whether to use stable or volatile pool
contract AerodromeAdapter is ISwapRouter {
    using SafeERC20 for IERC20;

    IAerodromeRouter public immutable aerodromeRouter;
    address public immutable factory;

    constructor(address _aerodromeRouter) {
        require(_aerodromeRouter != address(0), "Zero router");
        aerodromeRouter = IAerodromeRouter(_aerodromeRouter);
        factory = IAerodromeRouter(_aerodromeRouter).defaultFactory();
    }

    /// @notice Swap tokenIn for tokenOut via Aerodrome
    /// @param tokenIn Input token address
    /// @param tokenOut Output token address
    /// @param amountIn Amount of tokenIn to swap
    /// @param minAmountOut Minimum acceptable output (slippage protection)
    /// @param extraData abi.encode(bool stable) — true for stable pool, false for volatile
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        bytes calldata extraData
    ) external override returns (uint256 amountOut) {
        require(amountIn > 0, "Zero amount");

        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        bool stable = false;
        if (extraData.length >= 32) {
            stable = abi.decode(extraData, (bool));
        }

        IAerodromeRouter.Route[] memory routes = new IAerodromeRouter.Route[](1);
        routes[0] = IAerodromeRouter.Route({
            from: tokenIn,
            to: tokenOut,
            stable: stable,
            factory: factory
        });

        IERC20(tokenIn).forceApprove(address(aerodromeRouter), amountIn);

        uint256[] memory amounts = aerodromeRouter.swapExactTokensForTokens(
            amountIn,
            minAmountOut,
            routes,
            msg.sender,
            block.timestamp
        );

        amountOut = amounts[amounts.length - 1];
    }
}
