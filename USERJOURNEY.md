# USERJOURNEY.md — ClawDex User Flows

## Flow 1: Deposit USDC into an Index Vault

### Happy Path
1. User opens ClawDex dashboard at the IPFS URL
2. User sees available index vaults listed (e.g., "Base Blue Chip Index") with NAV, TVL, performance metrics
3. User clicks "Deposit" on a vault
4. **No wallet connected:** App shows "Connect Wallet" button. User clicks, RainbowKit modal opens, user connects MetaMask/WalletConnect
5. **Wrong network:** App shows "Switch to Base" button. User clicks, wallet prompts network switch. Only after switching does the deposit form appear
6. User enters USDC amount (e.g., "100")
   - App shows estimated shares to receive based on current NAV per share
   - App shows fee breakdown (management fee BPS, performance fee BPS)
   - App shows current index allocations (token weights)
7. **Insufficient USDC balance:** Deposit button disabled, shows "Insufficient USDC balance"
8. **Step 1 — Approve:** User clicks "Approve USDC". Wallet prompts approval for the exact deposit amount. Transaction confirms
9. **Step 2 — Deposit:** After approval confirms, button changes to "Deposit". User clicks. Wallet prompts deposit tx. Loading spinner shown
10. Transaction confirms. Success notification. Share balance updates. Dashboard reflects new TVL

### Edge Cases
- **Zero amount:** Deposit button disabled
- **Amount exceeds balance:** Button disabled with message
- **Transaction reverted:** Error notification with human-readable message
- **Wallet disconnects mid-flow:** Returns to "Connect Wallet" state
- **Pending approval but user navigates away:** On return, checks allowance and skips approve if sufficient

---

## Flow 2: Redeem Shares for USDC

### Happy Path
1. User navigates to their vault position or clicks "Redeem" on dashboard
2. App shows current share balance and estimated USDC redemption value
3. User enters number of shares to redeem (or clicks "Max")
4. App shows estimated USDC to receive (based on NAV)
5. User clicks "Redeem". Wallet prompts transaction
6. Transaction confirms. USDC balance updates. Share balance decreases

### Edge Cases
- **No shares:** Redeem section shows "No position in this vault"
- **Vault paused:** Redemptions ALWAYS work even when paused (by design). UI should confirm this
- **Slippage on underlying swaps:** UI shows minimum USDC output
- **Zero shares entered:** Button disabled

---

## Flow 3: View Allocations & Rebalance History

### Happy Path
1. User navigates to "Allocations" page
2. Sees current allocation pie chart with token weights and USD values
3. Sees target weights (from LarvAI's last signed vector) vs actual weights
4. Sees last rebalance timestamp and next eligible rebalance window
5. Scrolls to see historical weight changes over time (event log)
6. Each rebalance entry shows: timestamp, before/after weights, attestation hash

### Edge Cases
- **No rebalance yet:** Shows "Awaiting first rebalance" with initial equal weights
- **Stale weights:** Shows warning banner if last weight submission > 90 min ago

---

## Flow 4: Stake CLAWD for Fee Share

### Happy Path
1. User navigates to "Staking" page
2. Sees current staking APY, total staked, their staked balance, unclaimed rewards
3. User enters CLAWD amount to stake
4. **Step 1 — Approve CLAWD:** User approves CLAWD token for the fee distributor
5. **Step 2 — Stake:** User clicks "Stake". Transaction confirms. Balance updates
6. User can later click "Claim Rewards" to harvest accumulated fee share
7. User can "Unstake" to withdraw CLAWD

### Edge Cases
- **No CLAWD tokens:** Staking section shows link to acquire CLAWD
- **No rewards yet:** Claim button disabled, shows "No rewards to claim"
- **Zero amount:** Stake button disabled

---

## Flow 5: Guardian Admin Functions

### Happy Path (guardian-only)
1. Guardian connects wallet, sees "Admin" tab (hidden for non-guardians)
2. **Whitelist Token:** Enters token address, Chainlink feed, deployer group, liquidity threshold. Submits tx
3. **Adjust Safety Parameters:** Updates max allocation cap, max delta, slippage limits (within immutable ceilings)
4. **Pause/Unpause Rebalancing:** Toggle button. Does NOT affect user deposits/withdrawals
5. **Deploy New Vault:** Enters category name, share token name/symbol. Factory deploys new vault

### Edge Cases
- **Non-guardian wallet:** Admin tab not visible
- **Parameter exceeds ceiling:** Transaction reverts with "Exceeds immutable ceiling" error
- **Paused state:** Clear banner on all pages showing "Rebalancing paused — deposits and withdrawals remain active"

---

## Universal Edge Cases

- **RPC failure:** App shows "Network error — please try again"
- **Transaction stuck:** Loading state with "Transaction pending..." message
- **Mobile:** All flows work on mobile viewport with responsive layout
- **No wallet extension:** RainbowKit shows WalletConnect QR for mobile wallets
