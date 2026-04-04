// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ISwapRouter - Pluggable swap router interface
/// @notice All router adapters (Aerodrome, Frok, etc.) implement this
interface ISwapRouter {
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        bytes calldata extraData
    ) external returns (uint256 amountOut);
}
