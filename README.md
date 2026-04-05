# ClawDex -- AI-Governed Base Ecosystem Index

Deposit USDC for diversified exposure to Base ecosystem tokens. LarvAI determines portfolio weights via EIP-712 signed messages. Onchain safety rails (single-token caps, delta limits, cooldowns) constrain every rebalance.

## Live App

https://bafybeibmwwsimn7jkuf4ixvnkspgxrmjx5l4fy4y4th3focgjifp6bhtbq.ipfs.community.bgipfs.com/

## Deployed Contracts (Base Mainnet, Chain ID 8453)

| Contract | Address |
|---|---|
| AssetRegistry | `0x3264641b19d56a2b5488063d976890d744cac693` |
| RouterRegistry | `0xa458bd089ed50caec0997a814caaf654778eb6e9` |
| SafetyModule | `0x5ad56df56918b09d91d1410881595588e61a2359` |
| WeightVerifier | `0xc7f7679639d64db9a75ab6595c05a239f4c15a3e` |
| CLAWDFeeDistributor | `0xa00588e2772a70e349e2f46a3be49c00b70c5870` |
| IndexFactory | `0x6d27591f496787f175c52b920804bfe6e427bbcf` |
| IndexVault (ERC-20 "Test Index TST") | `0xada99b4f64f88ba657fe85e25c6c3598b87a381d` |

All privileged roles (owner/guardian) are set to `0x2e67CE77a6E6Bc4a3c06E7Ea284B4B27A81E7C03`.

## Architecture

- **IndexVault** is an ERC-4626 vault that accepts USDC deposits and mints shares. Users redeem shares for USDC at any time.
- **WeightVerifier** validates EIP-712 signatures from LarvAI. Anyone can relay signed weight updates (permissionless submission).
- **SafetyModule** enforces single-token caps and max-delta-per-cycle limits on every rebalance.
- **AssetRegistry** and **RouterRegistry** whitelist tokens and DEX routers used during rebalancing.
- **IndexFactory** creates new vault instances.
- **CLAWDFeeDistributor** handles management fee accrual and distribution.
- Swaps route through Aerodrome (via AerodromeAdapter) on Base.

## Running Locally

```bash
cd packages/nextjs
npm install
npm run dev
```

The frontend reads directly from Base mainnet contracts. No local chain needed for the UI.

To run contract tests:

```bash
cd packages/foundry
forge test
```

## Building for IPFS

```bash
cd packages/nextjs
rm -rf .next out
NEXT_PUBLIC_IPFS_BUILD=true NODE_OPTIONS="--require ./polyfill-localstorage.cjs" npx next build
# Upload the 'out' directory to IPFS
```

## Client Ownership Handoff

All contracts have owner/guardian set to `0x2e67CE77a6E6Bc4a3c06E7Ea284B4B27A81E7C03`. As owner you can:

- **AssetRegistry**: `addAsset()` / `removeAsset()` to whitelist tokens
- **RouterRegistry**: `addRouter()` / `removeRouter()` to whitelist DEX routers
- **SafetyModule**: `setSingleTokenCap()` / `setMaxDeltaPerCycle()` to adjust safety parameters
- **WeightVerifier**: `setLarvAISigner()` to change the authorized AI signer
- **IndexVault**: `pause()` / `unpause()` to halt rebalancing (user exits remain open)
- **IndexFactory**: `createVault()` to deploy additional vault instances

No further action is needed to take ownership -- you already control all contracts.
