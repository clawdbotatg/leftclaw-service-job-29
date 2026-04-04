# USERJOURNEY.md — ClawDex

## Happy Path: Deposit USDC into Index

### Step 1: Land on Dashboard
- **User sees:** ClawDex header, current NAV (e.g., $1.02/share), TVL, allocation pie chart, performance stats
- **No wallet required yet** — all read-only data loads from onchain
- **Navigation:** Dashboard, Deposit, Allocations, Admin tabs

### Step 2: Navigate to Deposit Page
- **User sees:** Deposit form with USDC input, estimated shares output, current NAV/share, fee breakdown
- **User sees:** "Connect Wallet" button if not connected

### Step 3: Connect Wallet
- **User clicks:** "Connect Wallet" via RainbowKit modal
- **User selects:** MetaMask, Rainbow, WalletConnect, or Coinbase Wallet
- **Success:** Wallet connected, address displayed in header with blockie
- **User sees:** Their USDC balance displayed near deposit input

### Step 4: Switch to Base Network (if needed)
- **If wrong network:** "Switch to Base" button appears, deposit button hidden
- **User clicks:** "Switch to Base"
- **Wallet prompt:** Network switch confirmation
- **Success:** Network switches, deposit form becomes active

### Step 5: Enter Deposit Amount
- **User enters:** USDC amount (e.g., 100)
- **UI shows:** Estimated cDEX shares to receive, current NAV, management fee
- **Validation:** Cannot exceed USDC balance, minimum deposit enforced
- **Zero amount:** Button disabled with "Enter amount" text

### Step 6: Approve USDC
- **User sees:** "Approve USDC" button (if allowance < deposit amount)
- **User clicks:** Approve button
- **Button state:** Loading spinner + "Approving..." text, button disabled
- **Wallet prompt:** USDC approval for exact amount (not infinite)
- **Success:** Button changes to "Deposit"
- **Failure:** Error toast "Approval failed" with reason

### Step 7: Deposit
- **User sees:** "Deposit 100 USDC" button
- **User clicks:** Deposit button
- **Button state:** Loading spinner + "Depositing..." text, button disabled
- **Wallet prompt:** Deposit transaction confirmation
- **Success:** Toast "Deposited 100 USDC — received 98.04 cDEX shares", balance updates
- **Failure:** Error toast with parsed reason (insufficient balance, slippage, etc.)

### Step 8: Verify Position
- **User navigates to:** Dashboard
- **User sees:** Updated share balance, their % of total TVL
- **User sees:** Current allocation breakdown of their position

---

## Happy Path: Redeem Shares for USDC

### Step 1: Navigate to Deposit/Redeem Page
- **User sees:** Toggle between Deposit and Redeem tabs

### Step 2: Switch to Redeem Tab
- **User sees:** cDEX share input, estimated USDC output, current NAV/share
- **User sees:** Their cDEX balance

### Step 3: Enter Redeem Amount
- **User enters:** Number of cDEX shares to redeem
- **UI shows:** Estimated USDC to receive (NAV × shares - fees)
- **"Max" button:** Fills with full cDEX balance

### Step 4: Redeem
- **User clicks:** "Redeem X cDEX" button
- **Button state:** Loading spinner + "Redeeming..." text
- **Wallet prompt:** Redeem transaction
- **Success:** Toast "Redeemed 98.04 cDEX — received 100.20 USDC"
- **Failure:** Error toast with reason

---

## Happy Path: View Allocations

### Step 1: Navigate to Allocations Page
- **User sees:** Current target weights (from LarvAI) vs actual weights
- **User sees:** Pie chart or bar chart of allocations
- **User sees:** Last rebalance timestamp, next eligible rebalance window
- **User sees:** Weight verification badge (checkmark if current weights are EIP-712 verified)

---

## Admin Path: Guardian Functions

### Step 1: Navigate to Admin Page
- **Non-guardian:** Sees "Admin functions require guardian role" message
- **Guardian (job.client):** Sees admin panel

### Step 2: Pause/Unpause Rebalancing
- **User clicks:** "Pause Rebalancing" / "Unpause Rebalancing"
- **Shows:** Current pause state
- **Note:** Pausing does NOT block user deposits/withdrawals

### Step 3: Update LarvAI Signer
- **User enters:** New signer address
- **User clicks:** "Commit Signer Rotation"
- **After 24h:** "Execute Signer Rotation" button becomes active
- **Cancel:** Available anytime before execution

### Step 4: Update Safety Parameters
- **User can adjust:** Max single allocation, max weight delta, slippage limit
- **Bounded by:** Immutable ceilings (cannot exceed hardcoded maximums)

---

## Edge Cases

### No Wallet Connected
- Dashboard loads with all read-only data (NAV, TVL, allocations)
- Deposit/Redeem shows "Connect Wallet" button instead of form actions
- No error states, just graceful prompts

### Wrong Network
- "Switch to Base" button replaces all action buttons
- Read-only data still loads (RPC reads don't require wallet network)

### Insufficient USDC Balance
- Deposit button disabled with "Insufficient USDC balance" text
- Amount input shows red border if exceeds balance

### Insufficient cDEX Balance
- Redeem button disabled with "Insufficient share balance" text

### Transaction Rejected by User
- Toast: "Transaction cancelled"
- Form returns to pre-submission state, no fields cleared

### Transaction Reverted
- Toast with parsed revert reason (e.g., "Rebalancing is paused", "Exceeds max deposit")
- Form returns to pre-submission state

### Vault is Paused
- Deposit/Redeem still work (pause only affects rebalancing)
- Allocations page shows "Rebalancing Paused" warning banner
- Admin page shows pause state prominently

### Stale LarvAI Weights
- Allocations page shows "Weights stale — last update X hours ago" warning
- Rebalance execution will fail (enforced by WeightVerifier)

### Zero TVL / Empty Vault
- Dashboard shows $0 TVL, no allocation data
- First depositor gets shares at 1:1 NAV (minus virtual offset)
