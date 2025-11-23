# Aztec Lab Demo Guide

This guide walks you through testing the complete Aztec profile builder and selective sharing flow using the Aztec Lab UI.

## Prerequisites

1. **Dev server running**: `pnpm --filter @hidden-garden/aztecbat-ui dev` (should be on port 3000)
2. **Hardhat node**: Local blockchain for contract interactions
3. **Contracts deployed**: SelfHumanSBT and SkillLeaderboard on localhost
4. **(Optional) Indexer**: For leaderboard polling (can use mock mode)

## Quick Start (5 minutes)

### Step 1: Start Hardhat Node

Open **Terminal 1**:

```bash
cd packages/contracts-public
pnpm node
```

Keep this running. You should see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### Step 2: Deploy Contracts

Open **Terminal 2**:

```bash
cd packages/contracts-public
pnpm deploy:node
```

This will deploy:
- `MockIdentityVerificationHubV2` (for SelfHumanSBT)
- `MockAztecVerifier` (for SkillLeaderboard)
- `SelfHumanSBT` (human verification)
- `SkillLeaderboard` (tier submissions)

**Note the deployed addresses** - they should match what's in `packages/core-logic/src/contracts.ts` for chain ID 31337.

### Step 3: Mint SBT to Test Address

We need to mint a SelfHumanSBT to a test address. Use one of the Hardhat default accounts:

**Test Account (from Hardhat):**
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**Mint SBT:**

You can use the playground or a simple script. For now, let's use the playground:

1. Open `http://localhost:3001` (if playground is running)
2. Connect wallet with the test account
3. Click "Mint SelfHumanSBT"

**OR** use the API route we'll create below.

### Step 4: Open Aztec Lab UI

Navigate to: `http://localhost:3000/dev/aztec-lab`

## Testing the Flow

### Test 1: Skill Profile (No SBT)

1. **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
2. **Chain ID**: `31337` (Hardhat local)
3. Click **"Load Skill Profile"**

**Expected Result:**
```json
{
  "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "humanVerified": false,  // ← No SBT yet
  "aztecBuilderTier": null,
  "aztecBuilderSkillHash": "0xca477bf7ade0d6d2886927b32a704aeb3eaa27c72081c4a731922ba200a3a0cd",
  "externalBadges": [...],
  "allowAgents": true
}
```

### Test 2: Mint SBT (if not done)

If you haven't minted an SBT yet, you can use this helper script or the playground.

### Test 3: Skill Profile (With SBT)

After minting SBT, reload the skill profile:

1. Same address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
2. Chain ID: `31337`
3. Click **"Load Skill Profile"**

**Expected Result:**
```json
{
  "humanVerified": true,  // ← Now verified!
  ...
}
```

### Test 4: Reveal Tier (Full Flow)

This tests the complete flow:
1. Aztec proof generation (mock mode)
2. SelfHumanSBT check
3. L1 contract submission
4. Indexer polling

**Steps:**
1. **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
2. **Chain ID**: `31337`
3. **Min Tier**: `1`
4. **Min Average Score**: `60`
5. Click **"Reveal Tier + Fetch Leaderboard"**

**Expected Result:**
```json
{
  "ok": true,
  "txHash": "0x...",
  "skillHash": "0xca477bf7ade0d6d2886927b32a704aeb3eaa27c72081c4a731922ba200a3a0cd",
  "leaderboard": [
    {
      "user_address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "min_level": 1,
      ...
    }
  ]
}
```

## Environment Variables

Make sure `apps/aztecbat-ui/.env.local` has:

```bash
# Self SBT Configuration
NEXT_PUBLIC_SELF_MODE=dev
NEXT_PUBLIC_DEV_SELF_SBT_ADDRESS=<deployed SelfHumanSBT address>

# Indexer (optional for mock mode)
NEXT_PUBLIC_INDEXER_BASE_URL=http://localhost:4000

# Aztec (mock mode for now)
NEXT_PUBLIC_USE_REAL_AZTEC=false
```

## Troubleshooting

### "User must have a valid SelfHumanSBT"

**Solution**: Mint an SBT to the test address first. See Step 3 above.

### "Contract not deployed"

**Solution**: 
1. Make sure Hardhat node is running (Terminal 1)
2. Deploy contracts (Terminal 2)
3. Verify addresses in `packages/core-logic/src/contracts.ts` match deployed addresses

### "indexerBaseUrl is required"

**Solution**: 
- Either set `NEXT_PUBLIC_INDEXER_BASE_URL` in `.env.local`
- Or the API route will use mock mode (won't poll, but will still submit to L1)

### Buttons are disabled

**Solution**: Make sure you've entered a valid address in the input field.

## Next Steps

Once the basic flow works:

1. **Test with Real Aztec Devnet**: Set `NEXT_PUBLIC_USE_REAL_AZTEC=true` and start Aztec sandbox
2. **Test with Indexer**: Start indexer service and verify leaderboard polling works
3. **Test Multiple Tiers**: Try different `minTier` values (1-4)
4. **Test Selective Sharing**: Verify that only verified humans can publish tiers

## Demo Script

For a quick demo, you can use this sequence:

1. **Show Skill Profile (unverified)**: Load profile → show `humanVerified: false`
2. **Mint SBT**: Use playground or script
3. **Show Skill Profile (verified)**: Reload → show `humanVerified: true`
4. **Reveal Tier**: Full flow → show transaction hash and leaderboard entry
5. **Show Selective Sharing**: Try with a different address (no SBT) → should fail

This demonstrates:
- ✅ Private quest completions (Aztec)
- ✅ Human verification (SelfHumanSBT)
- ✅ Selective skill sharing (SBT-gated tier publishing)
- ✅ Public leaderboard (SkillLeaderboard + Indexer)

