# Real-Mode Dry Run Guide

**Goal:** Verify the complete end-to-end flow works with real Aztec devnet and real Self SBT before demo.

## Prerequisites

1. ✅ All features work in mock mode
2. ✅ Aztec devnet can be started
3. ✅ Self SBT contract deployed (or use dev address)
4. ✅ Indexer service available (optional but recommended)

## Step 1: Environment Setup

Create or update `apps/aztecbat-ui/.env.local`:

```bash
# Aztec Configuration
NEXT_PUBLIC_USE_REAL_AZTEC=true
NEXT_PUBLIC_PXE_URL=http://localhost:8080

# L1 Chain Configuration
RPC_URL=http://localhost:8545  # Local Hardhat or Sepolia
SERVER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80  # Dev wallet private key

# Indexer (optional but recommended)
NEXT_PUBLIC_INDEXER_BASE_URL=http://localhost:3001
INDEXER_BASE_URL=http://localhost:3001

# Self SBT Configuration
NEXT_PUBLIC_SELF_MODE=dev  # or "real" for production
NEXT_PUBLIC_DEV_SELF_SBT_ADDRESS=0x...  # Your deployed SelfHumanSBT address
```

## Step 2: Start Services

### Terminal 1: Aztec Devnet
```bash
pnpm aztec:devnet
# Or: aztec start
# Wait for: "PXE Service running on http://localhost:8080"
```

### Terminal 2: Hardhat (if using local L1)
```bash
pnpm hardhat node
# Or: npx hardhat node
# Wait for: "Started HTTP and WebSocket JSON-RPC server"
```

### Terminal 3: Indexer (optional)
```bash
cd services/indexer
pnpm dev
# Or: npm run dev
# Wait for: "Server running on port 3001"
```

### Terminal 4: UI
```bash
cd apps/aztecbat-ui
pnpm dev
# Wait for: "Ready on http://localhost:3000"
```

## Step 3: Verify Environment

1. **Check Aztec PXE is reachable:**
   ```bash
   curl http://localhost:8080
   # Should return some response (not 404)
   ```

2. **Check Hardhat RPC is reachable:**
   ```bash
   curl -X POST http://localhost:8545 \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   # Should return block number
   ```

3. **Check Indexer (if running):**
   ```bash
   curl http://localhost:3001/health
   # Should return {"status":"ok"} or similar
   ```

## Step 4: Golden Path Test

### 4.1 Complete Quests (or Seed Completions)

**Option A: Use Quest Testing Section**
1. Navigate to `/dev/aztec-lab`
2. Go to "Section 4: Quest Testing"
3. Select a quest (e.g., `aztec_concept_quiz`)
4. Enter correct answer
5. Click "Validate & Store in Aztec"
6. Verify: "✅ Quest completion stored in Aztec!"

**Option B: Seed Completions (if needed)**
- Use the Aztec client directly to add quest completions
- Or use existing completions if already stored

### 4.2 Use Selective Reveal UI

1. **Go to "Section 2: Select What to Reveal"**
2. **Set parameters:**
   - Address: Your dev wallet (e.g., `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`)
   - Chain ID: `31337` (Hardhat) or `11155111` (Sepolia)
   - Tier: Select Tier 1 or Tier 2
   - Min Average Score: Set slider (e.g., 60%)
   - **Require Self proof of human: ✅ CHECKED** (`requireSelf=true`)

3. **Click "🔓 Reveal Selected Tier"**

4. **Watch for:**
   - Loading state
   - Proof generation (may take 10-30 seconds in real mode)
   - Transaction submission

### 4.3 Confirm Success

**Check 1: Self Check Passes**
- ✅ Should see: "✅ Human-Verified Mode" in result
- ✅ No error about missing SBT
- ✅ If error: Mint SBT for your dev wallet first

**Check 2: Transaction is Mined**
- ✅ Transaction hash appears
- ✅ Click transaction hash → opens explorer
- ✅ Explorer shows transaction as "Success"
- ✅ Transaction includes call to `SkillLeaderboard.submitSkillTierWithProof`

**Check 3: Leaderboard Entry Appears**
- ✅ If indexer running: Entry appears in leaderboard table
- ✅ If indexer not running: See warning "Timed out waiting for indexer..."
- ✅ Transaction hash is still shown (can verify on explorer)

## Step 5: Verify Public Profile

1. **Click on a leaderboard row**
2. **Modal should show:**
   - ✅ Address
   - ✅ Human verified: ✅ Yes (Self SBT)
   - ✅ Revealed Aztec builder tier: [tier number]
   - ✅ Private data section with 🔒 badges

## Troubleshooting

### Issue: "Failed to initialize Aztec client"
- **Check:** Is Aztec devnet running? `curl http://localhost:8080`
- **Fix:** Start devnet: `pnpm aztec:devnet`

### Issue: "SBT check failed" or "User must have a valid SelfHumanSBT"
- **Check:** Does your dev wallet have an SBT?
- **Fix:** Mint SBT using `scripts/mint-sbt-for-demo.ts` or deploy SelfHumanSBT contract

### Issue: "Transaction failed" or "RPC error"
- **Check:** Is Hardhat/Sepolia RPC reachable?
- **Fix:** Start Hardhat: `pnpm hardhat node` or check RPC_URL

### Issue: "Indexer not available"
- **Check:** Is indexer running? `curl http://localhost:3001/health`
- **Fix:** Start indexer: `cd services/indexer && pnpm dev`
- **Note:** This is optional - transaction will still succeed

### Issue: "Proof generation takes too long"
- **Normal:** Real Aztec proofs can take 10-30 seconds
- **Check:** Aztec devnet logs for errors
- **Fix:** Ensure devnet is healthy, restart if needed

## Success Criteria

✅ **All checks pass:**
1. Self check passes (human-verified mode)
2. Transaction is mined successfully
3. Leaderboard entry appears (or at least tx + "waiting for indexer...")
4. Public profile modal works

✅ **Golden path complete:**
- Quest completion → Aztec storage
- Selective reveal → ZK proof generation
- L1 submission → Transaction mined
- Leaderboard → Entry visible

## Post-Demo Freeze

**Once this succeeds once:**
- ✅ Freeze all backend changes
- ✅ Any further refactor is post-demo work
- ✅ Document any known issues for post-demo
- ✅ Focus on UI polish and demo preparation

## Notes

- **Real mode is slower:** Proof generation takes 10-30 seconds vs. instant in mock
- **Indexer is optional:** Transaction will succeed even if indexer is down
- **SBT is required:** For `requireSelf=true`, ensure dev wallet has SBT
- **One successful run is enough:** Don't iterate, just verify it works

