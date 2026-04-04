# PLAN.md — ClawDex: AI-Governed Base Ecosystem Index

## Overview

ClawDex is an ERC-4626 index vault system on Base where users deposit USDC to gain diversified exposure to Base ecosystem tokens. LarvAI autonomously determines portfolio weights via EIP-712 signed messages verified onchain. Safety rails constrain all AI decisions within governance-set bounds. CLAWD token captures value through fee burns and staker distribution.

**Client:** `0x2e67ce77a6e6bc4a3c06e7ea284b4b27a81e7c03`
**Chain:** Base (8453)
**Job:** LeftClaw Services Job #29

---

## Architecture

### Smart Contracts (Foundry)

The system uses 8 core contracts + 1 adapter:

1. **AssetRegistry** — Whitelisted tokens with Chainlink feeds, deployer groups, liquidity thresholds. Guardian-only add/remove. Index tagging for multi-vault sharing.

2. **SafetyModule** — Allocation caps (25% max single token, 35% max deployer group), rebalance constraints (max delta 2000 BPS/cycle, 24h cooldown), circuit breakers (TVL drop, oracle deviation, stale signatures). Pause only affects rebalancing, never user exits.

3. **WeightVerifier** — Validates LarvAI's EIP-712 signed weight vectors. Sequential nonce, 90-min staleness window, weights must sum to 10000 BPS. Two-step commit-reveal key rotation with 24h delay.

4. **RouterRegistry** — Maps router IDs to ISwapRouter adapter addresses. Global default + per-token overrides. Guardian-only management.

5. **AerodromeAdapter** — Implements ISwapRouter, wraps Aerodrome Router on Base.

6. **CLAWDFeeDistributor** — Receives fees from vaults. Burns 60% CLAWD, distributes 40% to stakers.

7. **IndexVault (ERC-4626)** — Per-category vault. Deposits USDC, swaps into constituent tokens. Virtual shares for inflation attack mitigation. Users can always exit.

8. **IndexFactory** — Deploys new IndexVault instances sharing common infrastructure.

9. **RebalanceExecutor** — Orchestrates rebalance: reads verified weights, validates via SafetyModule, executes swaps.

### External Integrations

- USDC on Base: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Chainlink Price Feeds on Base
- Aerodrome Router: `0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43`
- CLAWD Token: `0x9f860bF488C6528FDe522e08da3B98f498caD6b07`

### Frontend (Next.js + SE2)

Pages: Dashboard, Deposit/Redeem, Allocations, CLAWD Staking, Admin/Guardian

### Deployment

- Contracts: Base mainnet, verified on Basescan
- Frontend: BGIPFS (static export)
