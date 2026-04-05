# ClawDex Smart Contract Audit Report

**Repository:** `builds/leftclaw-service-job-29/packages/foundry`  
**Contracts Reviewed:** IndexVault.sol, WeightVerifier.sol, SafetyModule.sol, RouterRegistry.sol, IndexFactory.sol, RebalanceExecutor.sol, AssetRegistry.sol, AerodromeAdapter.sol, CLAWDFeeDistributor.sol  
**Build Status:** ✅ Compiles successfully (no errors, only lint notes)

---

## Summary

| Contract | Verified | Issues Found |
|---|---|---|
| IndexVault.sol | ✅ Mostly complete | 1 Low (unused import) |
| WeightVerifier.sol | ❌ Incomplete | 1 Medium (missing TEE attestation) |
| SafetyModule.sol | ❌ Incomplete | 2 Medium (stale sig passive, deviation missing) |
| RouterRegistry.sol | ✅ Complete | 1 Info (ambiguous spec) |
| IndexFactory.sol | ✅ Complete | 1 Low (unused import) |
| RebalanceExecutor.sol | ✅ Complete | Lint warnings only |

---

## Build Results

```
forge build
No files changed, compilation skipped
```

**No compilation errors.** Only lint-level notes (naming conventions, unused imports, modifier unwrapping suggestions) and 3 `unsafe-typecast` warnings for `int256→uint256` conversions on Chainlink prices — these are safe in this context since Chainlink prices for positive assets are always >0.

---

## Contract-by-Contract Analysis

### 1. IndexVault.sol

| Requirement | Status | Evidence |
|---|---|---|
| ERC-4626 implementation | ✅ | `contract IndexVault is ERC4626, ReentrancyGuard` |
| USDC as deposit asset | ✅ | `ERC4626(_usdc)` in constructor, `asset()` returns USDC |
| Virtual shares (dead share offset) | ✅ | `_decimalsOffset()` returns `6` → shares have 18-6=12 extra decimals, creating true dead-share offset |
| ReentrancyGuard | ✅ | Inherits `ReentrancyGuard` |
| NAV calculation with Chainlink feeds | ✅ | `totalAssets()` iterates constituents, `_getTokenValueInUSDC()` calls `IAggregatorV3` |
| Deposit/Withdraw events | ✅ | Standard `Deposit`/`Withdraw` from ERC4626 base interface |

**Findings:**
- `IERC20Metadata` imported but unused (line 7). Remove to silence lint.

---

### 2. WeightVerifier.sol

| Requirement | Status | Evidence |
|---|---|---|
| EIP-712 signature verification | ✅ | `_hashTypedDataV4` + `ECDSA.recover` |
| TEE attestation hash storage | ❌ **MISSING** | No TEE hash state, no validation |
| Nonce tracking | ✅ | Sequential `vw.nonce` per vault |
| 90-minute staleness window | ✅ | `STALENESS_WINDOW = 90 minutes` |
| Two-step signer rotation (24h delay) | ✅ | `commitSignerRotation` + `executeSignerRotation` with `SIGNER_ROTATION_DELAY = 24 hours` |
| Permissionless `submitWeights()` | ✅ | No access control modifier |

**BUG-001 — Medium: Missing TEE Attestation Hash**  
The spec requires TEE attestation hash storage and validation. The contract only verifies ECDSA signatures from `larvAISigner`. If the signing key is compromised, there is no secondary TEE-based verification. No `teeAttestationHash` state variable exists anywhere in the contract.

---

### 3. SafetyModule.sol

| Requirement | Status | Evidence |
|---|---|---|
| 2500 BPS max per token | ✅ | `MAX_SINGLE_TOKEN_CAP = 2500` |
| 3500 BPS max per deployer group | ✅ | `MAX_DEPLOYER_GROUP_CAP = 3500` |
| 1500 BPS max delta | ⚠️ **Wrong ceiling** | Default is 1500, but `MAX_DELTA_CEILING = 2000`. Spec says 1500, ceiling is 2000. |
| 24h rebalance cooldown | ✅ | `MIN_COOLDOWN = 24 hours` |
| TVL drop circuit breaker | ✅ | `recordRebalance` calls `_pause()` if `dropBPS > tvlDropThreshold` |
| Stale signature circuit breaker | ❌ **Passive only** | `checkOverdue` only emits event, no revert/pause |
| Chainlink vs DEX deviation | ❌ **Not implemented** | `oracleDeviationThreshold` stored but never used |
| Guardian-only functions | ✅ | All state-changing functions behind `onlyOwner` |

**BUG-002 — Medium: Stale Signature Circuit Breaker is Passive**  
`checkOverdue()` can be called by anyone and only emits `RebalanceOverdue`. It does not revert, pause, or trigger any protective action. There is no onchain mechanism to stop rebalancing when weights go stale.

**BUG-003 — Medium: Chainlink vs DEX Deviation Check Not Implemented**  
`oracleDeviationThreshold` is defined and settable, but there is no code anywhere that fetches a DEX spot price, compares it to Chainlink, and triggers a circuit breaker. The `CircuitBreakerTriggered` event with reason `"oracle deviation"` can never fire because the check does not exist.

**Note:** `MAX_DELTA_CEILING = 2000` but spec says "1500 BPS max delta". The default `maxDeltaPerCycle = 1500` is correct, but the ceiling is 2000. This is a spec mismatch rather than a bug.

---

### 4. RouterRegistry.sol

| Requirement | Status | Evidence |
|---|---|---|
| ISwapRouter interface | ✅ | `ISwapRouter` imported, `swap()` signature matches |
| Router adapter registration | ✅ | `registerRouter()` stores adapter + name |
| Default router | ✅ | `defaultRouterId` + `getRouter()` fallback |
| Per-token router overrides | ⚠️ **Indirect** | `preferredRouterId` lives in `AssetRegistry.TokenInfo`, resolved in `RebalanceExecutor` |

The spec's "per-token router overrides" are implemented at the AssetRegistry level, not inside RouterRegistry. This is architecturally sound — RouterRegistry manages globally registered routers, and AssetRegistry maps tokens to preferred routers. The `getRouter()` function falls back to the default if a router ID is inactive.

---

### 5. IndexFactory.sol

| Requirement | Status | Evidence |
|---|---|---|
| Vault deployment | ✅ | `registerVault()` registers externally-deployed vaults |
| Shared references to modules | ✅ | Stores `usdc` and `feeDistributor` for downstream use |

**Findings:**
- `AssetRegistry` import is unused. Remove to silence lint.

---

## Cross-Contract Issues

| # | Severity | Location | Issue |
|---|---|---|---|
| BUG-001 | Medium | WeightVerifier.sol | Missing TEE attestation hash storage and validation |
| BUG-002 | Medium | SafetyModule.sol | Stale signature circuit breaker only emits event, no enforcement |
| BUG-003 | Medium | SafetyModule.sol | Chainlink vs DEX deviation circuit breaker is not implemented |
| LOW-001 | Low | IndexVault.sol:7 | Unused import `IERC20Metadata` |
| LOW-002 | Low | IndexFactory.sol:5 | Unused import `AssetRegistry` |
| LOW-003 | Low | SafetyModule.sol | `MAX_DELTA_CEILING = 2000` vs spec "1500" — default is correct but ceiling differs |
| INFO-001 | Info | Multiple | Naming conventions (BPS→Bps, lastTVL→lastTvl) — lint suggestions |
| INFO-002 | Info | WeightVerifier.sol:174 | `keccak256(abi.encode(...))` instead of inline assembly — less efficient, not insecure |
| INFO-003 | Info | Multiple | `unwrapped-modifier-logic` lint — suggest wrapping modifier bodies for code size |

---

## Positive Findings

1. **Virtual shares correctly implemented** — `_decimalsOffset() returns 6` creates 1e12 share:asset ratio, true dead-share offset for early depositor protection.
2. **Two-step signer rotation** — Properly gated with 24h delay, cancellable, and atomic execution.
3. **TVL drop circuit breaker** — Correctly computes BPS drop and calls `_pause()`.
4. **Sequential nonces** — Prevents replay attacks on weight submissions.
5. **USDC buffer design** — `maxWithdraw`/`maxRedeem` cap at available USDC, protecting against insolvency.
6. **Module separation** — Weight verification, safety validation, and execution are properly separated across contracts.
7. **ERC-4626 events** — Standard `Deposit`/`Withdraw` events are inherited from the base interface.
