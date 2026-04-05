## BUG-003 — Chainlink vs DEX Deviation Circuit Breaker Not Implemented

**Severity:** Medium  
**Contract:** `contracts/SafetyModule.sol`  
**Type:** Missing functionality / Unreachable circuit breaker

---

### Description

The SafetyModule stores `oracleDeviationThreshold` and has a `CircuitBreakerTriggered("oracle deviation", ...)` event, but **there is no code anywhere that actually computes the deviation between Chainlink and DEX prices, nor any code that triggers the circuit breaker for this reason**.

This means one of the core safety mechanisms — protection against Chainlink prices drifting from market reality — cannot fire because the check does not exist.

### Evidence

```solidity
// SafetyModule.sol — defined but never used:
uint16 public oracleDeviationThreshold;

// SafetyModule.sol — can never fire because the check is absent:
event CircuitBreakerTriggered(string reason, uint256 value);
```

There is no function in SafetyModule, RebalanceExecutor, or any other contract that:
1. Fetches a DEX spot price (e.g., from a Uniswap V2/V3 pool)
2. Fetches the corresponding Chainlink price
3. Computes the percentage deviation
4. Compares against `oracleDeviationThreshold`
5. Triggers `_pause()` if exceeded

### Impact

If Chainlink prices lag significantly behind market (e.g., during low-liquidity periods, flash crashes, or oracle staleness), the index NAV would be calculated based on stale/wrong prices without triggering any safety mechanism. This could lead to incorrect rebalancing that favors one side of a trade.

### Recommendation

Implement the deviation check in `validateWeights()` or a new `checkOracleDeviation()` function. The function needs access to a DEX price source. Example using Uniswap V2:

```solidity
function checkOracleDeviation(
    address token,
    int256 chainlinkPrice,
    uint256 dexPrice,
    uint16 threshold
) internal pure returns (bool breached) {
    if (dexPrice == 0 || chainlinkPrice <= 0) return false;
    
    uint256 chainlink = uint256(chainlinkPrice);
    uint256 deviation = (dexPrice > chainlink)
        ? ((dexPrice - chainlink) * BPS) / chainlink
        : ((chainlink - dexPrice) * BPS) / chainlink;
    
    return deviation > threshold;
}
```

Note: Fetching DEX spot prices adds a dependency on Uniswap V2/V3 pairs. The implementation must handle:
- Tokens with no DEX pool (skip check)
- Tokens with low liquidity (consider minimum liquidity threshold)
- The extra gas cost of reading two price feeds per token per rebalance

Alternatively, use a pre-computed "deviation flag" submitted by keepers, validated against onchain Uniswap TWAPs, as a gas-efficient approach.
