# ClawDex User Journey

## User Types
1. **Retail User** — Deposits USDC to gain index exposure, stakes CLAWD for fee rewards
2. **LarvAI Keeper** — Monitors LarvAI API, submits signed weight updates
3. **Guardian Multisig** — 2-of-3 Safe, manages safety params and upgrades
4. **Protocol Staker** — Stakes CLAWD, earns 40% of management fees

## User Flows

### Flow 1: Deposit USDC
1. User connects wallet (WalletConnect supported)
2. Navigates to Vault page
3. Enters USDC amount to deposit
4. Dapp shows:
   - Estimated cDEX shares (based on current NAV)
   - Current NAV per share
   - Fee breakdown (0 management, any performance)
   - Gas estimate
5. User clicks "Deposit" → MetaMask popup
6. On confirm: USDC approved → USDC deposited → cDEX minted
7. Success screen with Basescan link + portfolio update

### Flow 2: Redeem Shares
1. User holds cDEX shares
2. Navigates to Vault page → Redeem tab
3. Enters cDEX amount to redeem
4. Dapp shows:
   - USDC received (based on current NAV)
   - Fee deduction if applicable
   - Gas estimate
5. User clicks "Redeem" → MetaMask popup
6. On confirm: cDEX burned → constituent tokens sold → USDC sent
7. Success screen with Basescan link

### Flow 3: View Allocations
1. User navigates to Allocations page
2. Sees current LarvAI target weights (pie chart)
3. Sees actual vault holdings vs targets
4. Sees last rebalance timestamp
5. Sees next eligible rebalance window (24h cooldown)
6. Can view historical weight changes (Subgraph data)
7. Can verify weight authenticity via EIP-712 signature proof

### Flow 4: Stake CLAWD
1. User navigates to Staking page
2. Connects wallet
3. Approves CLAWD token (if not already)
4. Enters CLAWD amount to stake
5. Dapp shows:
   - Current APY (from fee distribution)
   - Total staked by user
   - Accumulated rewards (unclaimed)
6. User stakes → sees updated position
7. Can claim rewards → CLAWD/ETH sent to wallet

### Flow 5: Rebalance Execution (Keeper)
1. Keeper polls LarvAI Nerve Cord API
2. Receives signed RebalanceOrder with TEE attestation
3. Calls WeightVerifier.submitWeights(signature, order, attestationProof)
4. Contract verifies signature + attestation + staleness
5. If valid, new weights stored
6. Keeper calls RebalanceExecutor.execute()
7. SafetyModule validates deltas within bounds
8. RouterRegistry routes swaps via active adapter (Aerodrome/Frok)
9. Vault holdings updated, Rebalanced event emitted
10. Fees harvested to CLAWDFeeDistributor

### Flow 6: Guardian Actions
1. Guardian reviews on-chain alerts (TVL drop, overdue rebalance)
2. Can pause/unpause rebalancing via SafetyModule
3. Can update deployer group mappings
4. Can adjust safety parameters (within ceilings)
5. Can rotate LarvAI signer (24h commit-reveal)
6. Cannot halt user deposits/withdrawals

## Trust Engine Principles
- Every screen answers "is it safe" before "sign this"
- Show LarvAI signature verification status
- Show circuit breaker status prominently
- Show NAV calculation methodology
- Show fee flow (burn vs staker distribution)
- Show historical performance vs benchmarks
