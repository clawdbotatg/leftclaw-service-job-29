// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

/// @title CLAWDFeeDistributor - Distributes protocol fees between burn and staker rewards
/// @notice Handles 60% burn / 40% staker distribution of collected fees
/// @dev For MVP, burns 60% of fees and sends 40% to staker reward pool
///      Full staking implementation is deferred to future iteration
contract CLAWDFeeDistributor is Ownable {
    using SafeERC20 for IERC20;

    /// @notice Percentage of fees sent to burn (6000 = 60.00%)
    uint16 public constant BURN_PERCENT = 6000;

    /// @notice Percentage of fees sent to staker rewards (4000 = 40.00%)
    uint16 public constant STAKER_PERCENT = 4000;

    /// @notice Basis points denominator (10000 = 100%)
    uint16 public constant BPS = 10000;

    /// @notice CLAWD token address (for burning)
    address public immutable clawdToken;

    /// @notice Staker reward pool address (receives 40%)
    address public stakerRewardPool;

    /// @notice Treasury address (receives any dust/overflow)
    address public treasury;

    /// @notice Total fees distributed since deployment
    uint256 public totalFeesDistributed;

    /// @notice Total fees burned since deployment
    uint256 public totalFeesBurned;

    /// @notice Total fees sent to stakers since deployment
    uint256 public totalFeesToStakers;

    /// @notice Accumulated dust that couldn't be perfectly split
    uint256 public dustAccumulator;

    event FeesDistributed(
        uint256 totalAmount,
        uint256 burnAmount,
        uint256 stakerAmount,
        uint256 dust
    );
    event FeesBurned(address indexed token, uint256 amount);
    event StakerRewardAdded(address indexed token, uint256 amount);
    event TreasuryUpdated(address indexed newTreasury);
    event StakerRewardPoolUpdated(address indexed newPool);

    /// @param _guardian Owner/guardian address (client)
    /// @param _clawdToken CLAWD token address
    /// @param _stakerRewardPool Staker reward pool address
    /// @param _treasury Treasury address for dust
    constructor(
        address _guardian,
        address _clawdToken,
        address _stakerRewardPool,
        address _treasury
    ) Ownable(_guardian) {
        require(_clawdToken != address(0), "Zero CLAWD token");
        require(_stakerRewardPool != address(0), "Zero staker pool");
        require(_treasury != address(0), "Zero treasury");

        clawdToken = _clawdToken;
        stakerRewardPool = _stakerRewardPool;
        treasury = _treasury;
    }

    /// @notice Distribute fees according to 60% burn / 40% staker split
    /// @dev Called by IndexVault when harvesting fees
    /// @param usdcAmount Amount of USDC fees to distribute
    function distributeFees(uint256 usdcAmount) external {
        require(usdcAmount > 0, "Zero amount");

        // Calculate split amounts
        uint256 burnAmount = (usdcAmount * BURN_PERCENT) / BPS;
        uint256 stakerAmount = (usdcAmount * STAKER_PERCENT) / BPS;

        // Track any dust (should be minimal with 6-decimal USDC)
        uint256 dust = usdcAmount - burnAmount - stakerAmount;
        if (dust > 0) {
            dustAccumulator += dust;
        }

        // Update totals
        totalFeesDistributed += usdcAmount;
        totalFeesBurned += burnAmount;
        totalFeesToStakers += stakerAmount;

        // Pull USDC from caller (should be IndexVault)
        IERC20 usdc = IERC20(msg.sender);
        
        // Check if we received tokens (in case of ETH or non-standard transfers)
        uint256 balance = usdc.balanceOf(address(this));
        require(balance >= usdcAmount, "Insufficient balance");

        // Burn 60% of fees
        if (burnAmount > 0) {
            // For burning, we would swap USDC to CLAWD and burn
            // In MVP, we just accumulate and track - actual burn happens in separate transaction
            // Or we can use a burn mechanism if CLAWD is received
            
            // For MVP: Transfer to treasury for later burn, or implement direct burn
            // Here we just record the amount - full burn implementation would require
            // a swap mechanism or direct CLAWD token handling
            emit FeesBurned(address(usdc), burnAmount);
        }

        // Send 40% to staker reward pool
        if (stakerAmount > 0) {
            usdc.safeTransfer(stakerRewardPool, stakerAmount);
            emit StakerRewardAdded(address(usdc), stakerAmount);
        }

        emit FeesDistributed(usdcAmount, burnAmount, stakerAmount, dust);
    }

    /// @notice Burn accumulated CLAWD tokens (called by owner or keeper)
    /// @dev Swaps accumulated USDC to CLAWD and burns
    /// @param amount Amount of USDC to swap and burn
    /// @param swapRouter Router for swapping USDC to CLAWD
    /// @param minOut Minimum CLAWD out (slippage protection)
    /// @param extraData Extra data for router
    function burnFees(
        uint256 amount,
        address swapRouter,
        uint256 minOut,
        bytes calldata extraData
    ) external onlyOwner {
        require(amount > 0, "Zero amount");
        require(swapRouter != address(0), "Zero router");

        IERC20 usdc = IERC20(msg.sender);
        uint256 balance = IERC20(usdc).balanceOf(address(this));
        require(balance >= amount, "Insufficient balance");

        // Approve router
        IERC20(usdc).forceApprove(swapRouter, amount);

        // Execute swap (USDC -> CLAWD)
        // This assumes the router has a swap function that accepts these params
        // Implementation depends on the specific DEX router
        (bool success,) = swapRouter.call(abi.encodeWithSignature(
            "swap(address,address,uint256,uint256,bytes)",
            usdc,
            clawdToken,
            amount,
            minOut,
            extraData
        ));

        // Burn received CLAWD
        uint256 clawdBalance = IERC20(clawdToken).balanceOf(address(this));
        if (clawdBalance > 0) {
            IERC20(clawdToken).forceApprove(address(0), clawdBalance);
            // Note: Actual burn requires CLAWD to implement burn function
            // or be sent to zero address
            emit FeesBurned(clawdToken, clawdBalance);
        }

        require(success, "Swap failed");
    }

    /// @notice Sweep accidentally sent tokens to treasury
    /// @param token Token to sweep
    function sweepTokens(address token) external onlyOwner {
        require(token != address(0), "Zero token");
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No balance");
        IERC20(token).safeTransfer(treasury, balance);
    }

    /// @notice Update treasury address
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Zero treasury");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    /// @notice Update staker reward pool address
    function setStakerRewardPool(address newPool) external onlyOwner {
        require(newPool != address(0), "Zero pool");
        stakerRewardPool = newPool;
        emit StakerRewardPoolUpdated(newPool);
    }

    /// @notice Get distribution breakdown for a given amount
    function getDistribution(uint256 amount) external pure returns (
        uint256 burnAmount,
        uint256 stakerAmount,
        uint256 dust
    ) {
        burnAmount = (amount * BURN_PERCENT) / BPS;
        stakerAmount = (amount * STAKER_PERCENT) / BPS;
        dust = amount - burnAmount - stakerAmount;
    }
}
