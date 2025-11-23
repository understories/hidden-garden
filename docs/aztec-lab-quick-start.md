# Aztec Lab Quick Start

## Current Status ✅

- **Dev server**: Running at `http://localhost:3000`
- **Hardhat node**: Running at `http://localhost:8545`
- **Contracts deployed**: 
  - SelfHumanSBT: `0x0165878A594ca255338adfa4d48449f69242Eb8F`
  - SkillLeaderboard: `0xa513E6E4b8f2a923D98304ec87F64353C4D5C853`
- **Environment**: Configured for dev mode (chain 31337)

## Quick Test (2 minutes)

### Step 1: Open Aztec Lab UI

Navigate to: **http://localhost:3000/dev/aztec-lab**

### Step 2: Test Skill Profile (No SBT)

1. **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
2. **Chain ID**: `31337`
3. Click **"Load Skill Profile"**

**Expected**: `humanVerified: false` (no SBT yet)

### Step 3: Mint SBT (Optional - for full flow)

To test the complete "Reveal Tier" flow, you need an SBT. Options:

**Option A: Use Playground** (if available)
- Open playground at `http://localhost:3001`
- Connect wallet with test account
- Click "Mint SelfHumanSBT"

**Option B: Use Test Harness** (recommended for demo)
- Deploy test harness contract that exposes `customVerificationHook`
- Call it directly to mint SBT

**Option C: Bypass SBT Check** (for quick demo)
- Temporarily modify `tierPublisher.ts` to skip SBT check in dev mode
- Or use a different test address that already has an SBT

### Step 4: Test Reveal Tier Flow

Once you have an SBT:

1. **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
2. **Chain ID**: `31337`
3. **Min Tier**: `1`
4. **Min Average Score**: `60`
5. Click **"Reveal Tier + Fetch Leaderboard"**

**Expected**: Transaction hash, skill hash, and leaderboard entries

## API Endpoints

### GET /api/dev/skill-profile

```bash
curl "http://localhost:3000/api/dev/skill-profile?address=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266&chainId=31337"
```

### POST /api/dev/publish-and-fetch

```bash
curl -X POST http://localhost:3000/api/dev/publish-and-fetch \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "chainId": 31337,
    "minTier": 1,
    "minAverageScore": 60
  }'
```

## Troubleshooting

### "User must have a valid SelfHumanSBT"

**Solution**: Mint an SBT first (see Step 3 above)

### "Contract not deployed"

**Solution**: 
```bash
cd packages/contracts-public
pnpm deploy:node
```

### Buttons are disabled

**Solution**: Make sure you've entered a valid address in the input field

## Demo Flow

For a complete demo:

1. ✅ **Show Skill Profile (unverified)** → `humanVerified: false`
2. ⏳ **Mint SBT** → Use playground or test harness
3. ✅ **Show Skill Profile (verified)** → `humanVerified: true`
4. ✅ **Reveal Tier** → Full flow with transaction hash
5. ✅ **Show Leaderboard** → User appears in leaderboard

This demonstrates:
- ✅ Private quest completions (Aztec)
- ✅ Human verification (SelfHumanSBT)
- ✅ Selective skill sharing (SBT-gated tier publishing)
- ✅ Public leaderboard (SkillLeaderboard)

