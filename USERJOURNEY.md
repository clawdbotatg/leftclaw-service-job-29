# USERJOURNEY.md — ClawDex: AI-Governed Base Ecosystem Index

## Actors

- **User** — deposits USDC, holds index shares, redeems
- **Staker** — stakes CLAWD to earn fee revenue
- **Guardian** — client's multisig (admin of all contracts)

---

## Journey 1: User Deposits USDC into an Index Vault

### Happy Path

1. **Land on Dashboard (/)** — sees "🦞 ClawDex" heading, active vaults count, CLAWD staked, total burned. "How It Works" section at the bottom. If no vaults deployed yet, sees "No vaults deployed yet" message.
2. **Navigate to Deposit/Redeem (/vault)** — sees vault stats: TVL, NAV/Share, Management Fee %, Performance Fee %.
3. **Not connected** — sees "Connect your wallet to deposit or redeem."
4. **Connect wallet** (RainbowKit) — wallet modal opens. User picks MetaMask/WalletConnect/Coinbase Wallet.
5. **Wrong network** — sees "Please switch to the correct network" + "Switch Network" button. Clicks it → wallet prompts chain switch to Base.
6. **Correct network, Deposit tab active** — sees USDC amount input. Types amount (e.g., "100"). Below the input, sees estimated shares calculation.
7. **Approve USDC** — note below input says "You will need to approve USDC first if allowance is insufficient." User must approve USDC before deposit can succeed.
8. **Click "Deposit"** — button shows "Depositing..." while pending. Wallet prompts tx confirmation. On success: "Deposit successful!" toast. Amount clears. Vault stats update (TVL increases, new share balance).
9. **Verify** — user can check block explorer for the tx. Index shares (e.g., cBASE) appear in wallet as ERC-20 token.

### Edge Cases

- **Insufficient USDC balance** → tx reverts, "Insufficient USDC balance" error toast
- **Zero amount** → Deposit button stays disabled
- **User rejects tx** → "Transaction rejected" error toast
- **No vaults** → "No vaults deployed yet. Guardian must create one first." card shown, no deposit UI

---

## Journey 2: User Redeems Shares for USDC

### Happy Path

1. **Navigate to Deposit/Redeem (/vault)** — click "Redeem" tab.
2. **Enter shares to redeem** — estimated USDC shown below (shares × NAV/share).
3. **Click "Redeem"** — button shows "Redeeming..." while pending. Wallet confirms. On success: "Redeem successful!" toast. Shares burned, USDC returned.
4. **Verify** — USDC balance increases in wallet. Share balance decreases.

### Edge Cases

- **Redemption always works** — even when rebalancing is paused. This is a core safety guarantee.
- **Zero shares** → Redeem button stays disabled
- **More shares than owned** → tx reverts with error

---

## Journey 3: View Current Allocations

### Happy Path

1. **Navigate to Allocations (/allocations)** — no wallet required.
2. **Sees Total NAV** — total USD value of vault holdings.
3. **LarvAI Nonce** — number of weight submissions processed.
4. **Current Allocations** — color bar showing proportional weights, table with token addresses and percentages.
5. **Safety Rails** — max single token (25%), max delta/cycle (15%), max deployer group (35%).
6. **LarvAI Signer** — the registered signer address with info about EIP-712 verification and 90-min staleness window.

### Edge Cases

- **No constituents yet** → "No constituents yet — awaiting first rebalance from LarvAI" shown
- **Stale LarvAI data** → Nonce and weights shown as last valid state. Circuit breaker would prevent bad rebalances.

---

## Journey 4: Stake CLAWD for Fee Revenue

### Happy Path

1. **Navigate to Staking (/staking)** — sees total CLAWD staked, burn ratio (60%), user's stake, pending rewards.
2. **Connect wallet** if not connected.
3. **Switch network** if wrong chain.
4. **Enter CLAWD amount** → click "Stake" → approve CLAWD if needed → wallet confirms → "Staked successfully!" toast.
5. **See updated stats** — your stake increases, total staked increases.
6. **Accumulate rewards** — as vault management fees are harvested, 40% goes to stakers (in USDC).
7. **Claim rewards** — click "Claim $X.XXXX" button → wallet confirms → "Rewards claimed!" toast. USDC received.
8. **Unstake** — enter amount → click "Unstake" → wallet confirms → "Unstaked successfully!". CLAWD returned, no lockup.

### Edge Cases

- **No CLAWD balance** → stake tx reverts
- **No rewards** → Claim button shows "No rewards to claim" and is disabled
- **Not connected** → "Connect your wallet to stake CLAWD" shown

---

## Journey 5: Guardian Admin Operations

### Happy Path

1. **Navigate to Admin (/admin)** — must be connected with guardian wallet.
2. **System Status** — shows rebalancing status (ACTIVE/PAUSED), active vaults, whitelisted tokens, guardian address.
3. **Pause/Unpause** — click "Pause Rebalancing" or "Unpause Rebalancing" → wallet confirms → status updates. Note: pause only affects rebalancing, user deposits/withdrawals stay active.
4. **Deploy New Vault** — enter share name, symbol, category → click "Deploy Vault" → wallet confirms → vault created. Appears in vault list and on dashboard.
5. **Whitelist Token** — enter token address, Chainlink price feed, deployer group, min liquidity → click "Whitelist Token" → wallet confirms. Token available for index inclusion.
6. **View whitelisted tokens** — list shown with addresses.

### Edge Cases

- **Not guardian** → "⛔ Not Guardian" with message "Only the guardian address can access admin functions" and the guardian address shown.
- **Not connected** → "Connect your wallet to access admin functions"
- **Wrong network** → Switch Network button shown

---

## Post-Deploy Guardian Setup (After contract deployment)

These steps are done by the guardian (client) via the Debug Contracts page or direct contract calls:

1. Set RebalanceExecutor as authorized caller in SafetyModule
2. Register AerodromeAdapter in RouterRegistry + set as default
3. Whitelist tokens in AssetRegistry with Chainlink price feeds
4. Deploy a vault via Admin page or IndexFactory
5. Set executor on the vault (IndexVault.setExecutor)
6. Authorize vault in RebalanceExecutor
7. Authorize vault in CLAWDFeeDistributor
8. Configure real LarvAI signer in WeightVerifier

---

## Error States (Global)

| State | What User Sees |
|-------|---------------|
| No wallet installed | RainbowKit shows wallet install options |
| Wrong network | "Switch Network" button on all action pages |
| TX pending | Button shows loading text, is disabled |
| TX reverted | Human-readable error toast |
| No vaults exist | Dashboard shows "No vaults deployed yet" |
| Contract paused | Admin shows warning banner; deposits/redeems still work |
