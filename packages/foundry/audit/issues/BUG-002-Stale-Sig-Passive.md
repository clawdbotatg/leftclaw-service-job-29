## BUG-002 — Stale Signature Circuit Breaker is Passive (No Onchain Enforcement)

**Severity:** Medium  
**Contract:** `contracts/SafetyModule.sol`  
**Type:** Missing enforcement / Passive check only

---

### Description

The SafetyModule has a `checkOverdue()` function that was intended to serve as a stale signature circuit breaker. However, **the function only emits an event — it performs no revert, pause, or any state-changing protective action**.

This means the SafetyModule's spec requirement for a "stale signature" circuit breaker is not actually implemented.

### Current Code

```solidity
// SafetyModule.sol:107-111
function checkOverdue(address vault) external {
    uint256 last = lastRebalanceTime[vault];
    if (last > 0 && block.timestamp > last + MIN_COOLDOWN + OVERDUE_GRACE) {
        emit RebalanceOverdue(vault, last, block.timestamp);
        // ^ No _pause(), no revert, no revert with custom error
    }
}
```

The function is callable by **anyone** (no access control), and the only effect is an event log. Any offchain monitoring system could detect this, but there is no onchain mechanism to stop rebalancing when weights go stale.

### Impact

While `RebalanceExecutor.executeRebalance()` does check `weightVerifier.areWeightsFresh(vault)` (which reverts if weights are older than 90 minutes), the SafetyModule spec requirement for a "stale signature" circuit breaker is unmet. If the WeightVerifier itself has a bug or the freshness check is bypassed at the executor level, the SafetyModule provides no defense.

### Recommendation

Implement active enforcement in `checkOverdue()`:

```solidity
function checkOverdue(address vault) external {
    uint256 last = lastRebalanceTime[vault];
    if (last > 0 && block.timestamp > last + MIN_COOLDOWN + OVERDUE_GRACE) {
        _pause(); // Halt rebalancing
        emit CircuitBreakerTriggered("stale signature", block.timestamp - last);
    }
}
```

Alternatively, add a stale-check in `canRebalance()` or `validateWeights()` that reverts when the last rebalance is overdue beyond the grace period. This would align SafetyModule's behavior with the `areWeightsFresh` check already present in `RebalanceExecutor`.
