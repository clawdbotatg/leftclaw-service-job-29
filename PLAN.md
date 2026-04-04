# ClawDex — AI-Governed Base Ecosystem Index

## Overview
ERC-4626 index vault system on Base where users deposit USDC to gain diversified exposure to Base ecosystem tokens. LarvAI autonomously determines portfolio weights via TEE-attested EIP-712 signed messages verified on-chain. An IndexFactory enables multiple category-specific indices sharing a common asset registry, safety module, and CLAWD fee infrastructure.

## Architecture

### Core Contracts (packages/foundry/contracts/)
1. **IndexFactory.sol** — Deploys new IndexVault instances per category. All vaults share references to AssetRegistry, SafetyModule, WeightVerifier, CLAWDFeeDistributor, RouterRegistry. Guardian multisig only can deploy new vaults.

2. **IndexVault.sol** — ERC-4626 vault. Deposit asset: USDC. Shares: category-specific index token (e.g., cBASE, cDEFI). Mint: USDC → swaps → shares based on NAV. Redeem: shares → swaps back to USDC. Virtual shares (1e6) for inflation attack mitigation. ReentrancyGuard on all external entry points. CEI pattern.

3. **WeightVerifier.sol** — TEE attestation + EIP-712 signature verification. Schema: RebalanceOrder(address[] tokens, uint16[] weightsBPS, uint256 nonce, uint256 timestamp, bytes32 attestationHash, bytes32 reasonCode). Two-step signer rotation with 24h delay. Permissionless submission.

4. **SafetyModule.sol** — Allocation caps: max 2500 BPS per token, max 3500 BPS per deployer group. Max delta: 1500 BPS per cycle. Min cooldown: 24h. Circuit breakers for TVL drop, stale signatures, Chainlink vs DEX deviation. Guardian (2-of-3 Safe) can pause/unpause, update params. Cannot halt user exits.

5. **AssetRegistry.sol** — Whitelisted tokens with Chainlink price feeds, router IDs, deployer group IDs, liquidity thresholds. Token tagging for multi-vault sharing. On-chain liquidity checks.

6. **RouterRegistry.sol** — Pluggable router layer. ISwapRouter interface. Adapters: FrokSwapAdapter, AerodromeAdapter. Guardian sets default and per-token router overrides.

7. **CLAWDFeeDistributor.sol** — Fee distribution: 60% CLAWD burn, 40% staker distribution. Governance-adjustable within hardcoded bounds.

8. **MockToken.sol** — ERC-20 mock for testing.

### Frontend (packages/nextjs/)
- **Dashboard** — Index NAV chart, current allocations (pie chart), historical performance, live TVL, burn stats
- **Vault** — Deposit/redeem USDC flow, 3-step UX, estimated shares, NAV per share, fee breakdown
- **Allocations** — LarvAI target weights vs actual, last rebalance timestamp, historical weight changes
- **Staking** — Stake CLAWD, earn fee share, show APY, total staked, accumulated rewards
- **Governance** — Links to forum for FDV/liquidity threshold votes

### Key Integrations
- **Chainlink Price Feeds (Base)** — NAV calculation, staleness checks
- **Aerodrome / Frok Swap** — Swap execution via pluggable router
- **LarvAI Nerve Cord API** — Keeper bot for signed weight submission
- **Safe{Core} 2-of-3** — Guardian multisig
- **CLAWD Token** — 0x9f86...6b07 on Base

### Security
- Virtual shares for ERC-4626 inflation attack
- Chainlink as primary oracle, DEX TWAP fallback
- TEE attestation for AI signature verification
- ReentrancyGuard + CEI pattern
- Immutable fee ceilings
- Users can always redeem (pause only affects rebalancing)

## Client
0x2e67ce77a6e6bc4a3c06e7ea284b4b27a81e7c03 — Set as owner/admin on all contracts
