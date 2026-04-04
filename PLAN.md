# PLAN.md — ClawDex: AI-Governed Base Ecosystem Index

## Overview

An ERC-4626 index vault on Base where users deposit USDC to gain diversified exposure to Base ecosystem tokens. LarvAI determines portfolio weights via signed EIP-712 messages. Onchain safety rails constrain all AI decisions within governance-set bounds. CLAWD token captures economic value through fee burns and staker revenue share.

## Architecture — MVP Scope

The client's full vision includes 8+ contracts. For a shippable MVP, we build the core system that demonstrates the full flow: deposit USDC → get index shares → AI rebalances → redeem for USDC. Advanced features (IndexFactory multi-vault, TEE attestation, CLAWD staking, Subgraph indexing) are stubbed for future iterations.

### Smart Contracts (4 contracts — MVP)

#### 1. `ClawDexVault.sol` (ERC-4626)
- **Deposit asset:** USDC (6 decimals)
- **Share token:** cDEX (18 decimals), pro-rata claim on underlying basket
- **Mint:** User deposits USDC → vault holds USDC until rebalance applies weights → mints shares at NAV
- **Redeem:** User burns shares → vault sells pro-rata basket back to USDC via router → sends USDC
- **NAV:** Sum of (token balance × Chainlink price) for each constituent, in USDC terms
- **Inflation mitigation:** Virtual shares offset (1e6 dead shares)
- **Fees:** managementFeeBPS, immutable maxFeeBPS ceiling. Fee recipient set to client address
- **Pausing:** Pause only affects rebalancing. User deposits/withdrawals ALWAYS open
- **ReentrancyGuard** on all external entry points. CEI pattern throughout
- **Owner:** `job.client` (0x2e67ce77a6e6bc4a3c06e7ea284b4b27a81e7c03)

#### 2. `WeightVerifier.sol`
- Validates LarvAI's signed weight vectors via EIP-712
- Schema: `RebalanceOrder(address[] tokens, uint16[] weightsBPS, uint256 nonce, uint256 timestamp)`
- Verification: recover signer must match registered LarvAI key, sequential nonce, 90-min staleness window, weights sum to 10000 BPS
- Key rotation: two-step commit-reveal with 24h delay, guardian-only
- Permissionless submission: anyone can relay signed payloads
- **Guardian:** `job.client`

#### 3. `SafetyModule.sol`
- Max single token allocation: 2500 BPS (25%)
- Max weight delta per token per cycle: 1500 BPS
- Minimum cooldown between rebalances: 24 hours (hardcoded, immutable)
- Max slippage per swap leg: configurable BPS
- Circuit breakers: TVL drop threshold, stale signature rejection, oracle deviation check
- Guardian pause/unpause (cannot halt user exits)
- **Guardian:** `job.client`

#### 4. `AerodromeAdapter.sol` (ISwapRouter)
- Implements `ISwapRouter` interface for pluggable routing
- Wraps Aerodrome Router on Base for swap execution
- Supports stable and volatile pool routing via `extraData`
- Slippage enforcement built in

### Interfaces & Libraries
- `ISwapRouter.sol` — pluggable router interface
- `AssetRegistry` — simplified: stored inline in vault as a whitelist mapping with Chainlink feeds

### External Contracts (registered in externalContracts.ts)
- USDC on Base: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Aerodrome Router: `0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43`
- Chainlink price feeds (Base): ETH/USD, WBTC/USD, cbETH/USD, etc.

### What's Deferred (Post-MVP)
- IndexFactory (multi-vault deployment) — single vault for MVP
- TEE attestation verification — EIP-712 signature verification only for MVP
- CLAWDFeeDistributor — fees go to client address for MVP
- CLAWD staking — future iteration
- RouterRegistry — single Aerodrome adapter for MVP
- Subgraph indexing — use contract reads for MVP
- Governance (Snapshot + Zodiac) — guardian multisig for MVP

## Frontend

### Pages
1. **Dashboard** — Index NAV, current allocations pie chart, TVL, performance
2. **Deposit/Redeem** — USDC deposit flow (Approve → Deposit → Confirmation). Show estimated shares, NAV/share, fees
3. **Allocations** — Current target weights vs actual weights, last rebalance time, weight history
4. **Admin** — Guardian functions: pause/unpause, update signer, update safety params

### Key Components
- Real-time NAV via `useScaffoldReadContract` polling `totalAssets()`
- Weight verification status showing onchain proof of LarvAI signature
- Three-button flow: Switch Network → Approve USDC → Deposit
- Transaction history with Basescan links
- Mobile responsive, DaisyUI styling

## Integrations
- **Chainlink Price Feeds (Base)** — NAV calculation, staleness checks
- **Aerodrome** — primary swap router for rebalance execution
- **USDC** — deposit asset

## Security Priorities
- ERC-4626 inflation attack: virtual shares offset
- Oracle manipulation: Chainlink only (not DEX spot)
- Reentrancy: ReentrancyGuard + CEI on all externals
- Token decimals: read dynamically, never hardcode
- User exits always open: pause never blocks withdrawals
- Immutable max fee ceiling
- Sequential nonce for weight signatures (replay prevention)
- Access control: guardian = job.client for all admin functions

## Chain
- **Base** (chain ID 8453)
- Deploy contracts to Base mainnet
- Frontend to BGIPFS

## Stack
- Scaffold-ETH 2 (Foundry)
- Solidity 0.8.20+
- OpenZeppelin Contracts
- Next.js + wagmi + viem + RainbowKit
- DaisyUI for styling
