# Core ZK-Enabled Selective Skill Sharing Flow

**The Heart of Hidden Garden: Anti-Brand-Worship, Pro-Competence, Pro-User-Controlled Identity**

## Philosophy

Instead of:
> "I took the official Aztec 101 course, here's my NFT cert."

You're saying:
> "Here's a proof I've done enough real work on Aztec/Noir to count as Tier 3 in this path. The path can be community-defined, aggregated across sources, and doesn't expose where or with whom I learned."

## End-to-End Flow

### 1. User Completes Quiz

**Location:** `/quests/[questId]`

- User answers the quiz question
- Click "Validate Answer"
- System validates locally (client-side)
- Returns: `{ success: true, score: 100, feedback: "..." }`

### 2. Store Privately in Aztec

**Action:** Click "🔒 Store Privately in Aztec"

**What Happens:**
- Computes `questIdHash = keccak256("aztec_concept_quiz")`
- Calls Aztec SDK: `add_quest_completion(owner, questIdHash, score)`
- Stores `QuestNote` in private Aztec vault:
  ```noir
  struct QuestNote {
    quest_id_hash: Field,
    category_hash: Field,  // hash("aztec_builder")
    score: u8,              // 0-100
    timestamp: u64,
  }
  ```

**Privacy Guarantee:**
- ✅ Individual quest completions are **private**
- ✅ Scores are **private**
- ✅ Completion timestamps are **private**
- ❌ No one can see your learning journey

### 3. Generate Tier Proof (Selective Sharing)

**Action:** Click "🔓 Generate & Publish Tier Proof"

**What Happens:**
- Calls Aztec SDK: `prove_aztec_builder_tier(owner, minTier=1, minAverageScore=60)`
- Noir circuit:
  1. Queries private storage for quest scores
  2. Checks if Tier 1 quest (`aztec_concept_quiz`) is completed with score >= 60
  3. Computes achieved tier and average score
  4. Asserts: `achieved_tier >= min_tier` AND `average_score >= min_average_score`
  5. Generates ZK proof + public inputs

**Public Outputs (What Gets Revealed):**
- ✅ User's Aztec address
- ✅ Minimum tier proven (e.g., "Tier 1")
- ✅ Minimum average score proven (e.g., "60%")
- ✅ Path hash (`aztec_builder_path`)

**What Stays Private:**
- ❌ Which specific quests were completed
- ❌ Individual quest scores
- ❌ When each quest was completed
- ❌ How many attempts were made

### 4. Publish to L1 (Selective Sharing)

**Action:** Proof is submitted to L1 contract

**What Happens:**
- Calls L1 contract: `submitSkillTierWithProof(skillHash, minLevel, proof, publicInputs)`
- Contract verifies the ZK proof
- Emits event: `TierProven(user, skillHash, tier, timestamp)`
- Indexer picks up the event
- Leaderboard updates: User appears with Tier 1 for "aztec_builder_path"

**On-Chain Visibility:**
- ✅ User has proven Tier 1 in Aztec Builder path
- ✅ Proof is verifiable by anyone
- ❌ No individual quest details are visible

## Key Files

### Core Logic (Team A)
- `packages/core-logic/src/main.nr` - Noir contract with `add_quest_completion` and `prove_aztec_builder_tier`
- `packages/core-logic/src/aztecClient.ts` - TypeScript interface for Aztec SDK
- `packages/core-logic/src/quests/hashing.ts` - Quest ID hash computation (keccak256)

### Game Engine
- `packages/game-engine/src/registry.ts` - Quest registry with validation functions

### UI (Team B)
- `apps/aztecbat-ui/app/quests/[questId]/page.tsx` - Complete quest flow UI
- `apps/aztecbat-ui/app/dev/aztecbat-status/page.tsx` - Dev UI for testing

## Testing the Flow

### Prerequisites

1. **Aztec devnet/sandbox running:**
   ```bash
   # Option 1: Use our script (pins version)
   pnpm aztec:up-devnet
   
   # Option 2: Start sandbox directly
   aztec start --sandbox
   ```
   Wait for it to be ready (check with `aztec status`)

2. **Environment variables set:**
   ```bash
   # In apps/aztecbat-ui/.env.local
   NEXT_PUBLIC_USE_REAL_AZTEC=true
   NEXT_PUBLIC_PXE_URL=http://localhost:8080
   ```

3. **App running:**
   ```bash
   pnpm dev:web
   ```

### UI Flow (Manual Testing)

1. **Navigate to quest:**
   - Go to: `http://localhost:3000/quests/aztec_concept_quiz`
   - **Verify:** You should see "Aztec mode: 🟢 REAL devnet" indicator at the top
   - If you see "🟡 MOCK", check that `NEXT_PUBLIC_USE_REAL_AZTEC=true` is set

2. **Answer the quiz:**
   - Question: "What is Aztec Protocol?"
   - Enter answer: `{"selectedOptionId": "0"}`
   - Click "Validate Answer"
   - **Should see:** ✅ Correct! Score: 100%

3. **Store Privately in Aztec:**
   - Click "🔒 Store Privately in Aztec"
   - **What happens:**
     - `RealAztecClient` connects to Aztec devnet (if not already connected)
     - Calls `add_quest_completion(owner, quest_id_hash, score)` on `PrivateIdentityGarden` contract
     - Creates a private `QuestNote` in your Aztec vault
   - **Should see:** ✅ Stored in Private Vault
   - **UI indicator:** "Aztec mode: 🟢 REAL devnet" should still be visible
   - **Transaction hash:** Should be displayed (this is the Aztec transaction, not L1)

4. **Generate & Publish Tier Proof:**
   - Connect your wallet (MetaMask or similar) - required for L1 submission
   - Click "🔓 Generate & Publish Tier Proof"
   - **What happens:**
     - `RealAztecClient` calls `prove_aztec_builder_tier(owner, 1, 60)` on the contract
     - Noir circuit generates ZK proof + public inputs
     - Returns: `{ proof, publicInputs }`
     - Submits to L1 contract: `submitSkillTierWithProof(skillHash, tier, proof, publicInputs)`
   - **Should see:** ✅ Tier proof published!
   - **For demo:** Proof details may be displayed as JSON (expandable section)

### Non-UI Testing (Integration Tests)

Run the full flow without UI:

```bash
# Set environment variable
export AZTEC_PXE_URL=http://localhost:8080

# Run integration tests
pnpm test:integration
```

This tests:
- Quest validation
- Aztec storage
- Tier proof generation
- Privacy guarantees

See `tests/integration/first_quest_aztec_flow.test.ts` for the full test suite.

## Current Status

✅ **Implemented:**
- Quest validation (first quest working)
- Quest ID hash computation
- Aztec client interface with both mock and real implementations
- Complete UI flow for quest → Aztec → L1
- L1 contract integration (wagmi)
- Real Aztec client implementation (`RealAztecClient`)
- Factory function for client creation (`createAztecClient`)

⚠️ **Partial Implementation:**
- **For quest `aztec_concept_quiz`:** Real Aztec devnet integration is implemented
  - `RealAztecClient` connects to Aztec devnet
  - Contract deployment/loading (requires compiled contract artifact)
  - Quest completion storage via `addQuestCompletionByQuestId()`
  - Tier proof generation via `proveAztecBuilderTier()`
- **Mock mode still available:** Use `createAztecClient('mock')` for testing without devnet
- **Contract artifact loading:** Requires contract to be compiled first with `pnpm aztec:compile`

## Next Steps

1. ✅ **Real Aztec client implemented** for `aztec_concept_quiz`
2. **Deploy contracts** to testnet/mainnet
3. **Set up indexer** to track tier proofs
4. **Implement remaining quests** (18 more to go)
5. **Add leaderboard UI** to display published tiers

---

## How to Demo the First Real Quest

This section demonstrates the **privacy-native** flow for `aztec_concept_quiz` using the real Aztec devnet.

### Prerequisites

1. **Aztec devnet running:**
   ```bash
   pnpm aztec:devnet
   ```
   Wait for it to be ready (check with `aztec status`)

2. **Environment variables set:**
   ```bash
   # In apps/aztecbat-ui/.env.local
   NEXT_PUBLIC_USE_REAL_AZTEC=true
   NEXT_PUBLIC_PXE_URL=http://localhost:8080
   ```

3. **App running:**
   ```bash
   pnpm dev:web
   ```

### Demo Steps

1. **Navigate to the quest:**
   - Go to: `http://localhost:3000/quests/aztec_concept_quiz`
   - You should see: "Aztec mode: 🟢 REAL devnet" indicator at the top

2. **Answer the quiz:**
   - Question: "What is Aztec Protocol?"
   - Enter answer: `{"selectedOptionId": "0"}`
   - Click "Validate Answer"
   - Should see: ✅ Correct! Score: 100%

3. **Store Privately in Aztec:**
   - Click "🔒 Store Privately in Aztec"
   - What happens:
     - `RealAztecClient` connects to Aztec devnet (if not already connected)
     - Calls `add_quest_completion(owner, quest_id_hash, score)` on `PrivateIdentityGarden` contract
     - Creates a private `QuestNote` in your Aztec vault:
       ```noir
       QuestNote {
         quest_id_hash: keccak256("aztec_concept_quiz"),
         category_hash: pedersen_hash("aztec_builder"),
         score: 100,
         timestamp: 0
       }
       ```
     - Stores quest score in private storage: `quest_scores[owner][quest_id_hash] = 100`
   - Should see: ✅ Stored in Private Vault
   - **Privacy guarantee:** No one can see your individual quest completion or score

4. **Generate & Publish Tier Proof:**
   - Connect your wallet (MetaMask or similar)
   - Click "🔓 Generate & Publish Tier Proof"
   - What happens:
     - `RealAztecClient` calls `prove_aztec_builder_tier(owner, 1, 60)` on the contract
     - Noir circuit:
       1. Queries private storage for quest scores
       2. Checks if `aztec_concept_quiz` is completed with score >= 60
       3. Computes achieved tier (1) and average score (100)
       4. Asserts: `achieved_tier >= 1` AND `average_score >= 60`
       5. Generates ZK proof + public inputs
     - Returns: `{ proof, publicInputs }`
     - Submits to L1 contract: `submitSkillTierWithProof(skillHash, tier, proof, publicInputs)`
   - Should see: ✅ Tier proof published!

### What Gets Revealed vs. What Stays Private

**Public (on L1):**
- ✅ Your Aztec address
- ✅ Minimum tier proven: Tier 1
- ✅ Minimum average score: 60%
- ✅ Path hash: `aztec_builder_path`
- ✅ ZK proof (verifiable by anyone)

**Private (never revealed):**
- ❌ Which specific quest you completed (`aztec_concept_quiz`)
- ❌ Your actual score (100%)
- ❌ When you completed it
- ❌ How many attempts you made
- ❌ Any other quest completions

### Why This is Privacy-Native

This flow **cannot be done on a public chain** without leaking per-quest data:

- **On Ethereum/L1:** Every transaction is public. If you stored quest completions on-chain, everyone could see:
  - Which quests you completed
  - Your scores
  - When you completed them
  - Your learning journey

- **On Aztec:** Quest completions are stored in **private notes** (encrypted). Only you can decrypt them. The tier proof is a **zero-knowledge proof** that compresses your private data into a public assertion:
  - "I have achieved Tier 1" (without revealing how)

This is the core innovation: **Selective skill sharing** — prove competence without revealing credentials.

### Judge Checklist

**Can the judge verify:**

1. **Aztec version matches target:**
   ```bash
   pnpm aztec:version
   # Should show: 3.0.0-devnet.5 (or .4)
   # Verify against: https://docs.aztec.network/devnet
   ```

2. **Sandbox is running:**
   ```bash
   aztec status
   # Should show sandbox is running
   ```

3. **Follow the quest flow:**
   - Visit `/quests/aztec_concept_quiz`
   - See "Aztec mode: 🟢 REAL devnet" indicator
   - Complete quiz → validate → store → prove
   - Verify no per-quest data is visible on-chain
   - Verify only tier + path hash are revealed (if L1 submission is wired up)

4. **Check sandbox logs:**
   - Sandbox logs show private transactions
   - No quest-specific data in public logs
   - Only aggregate tier proofs are visible

### Troubleshooting

**"Aztec mode: 🟡 MOCK" instead of REAL:**
- Check that `NEXT_PUBLIC_USE_REAL_AZTEC=true` is set in `.env.local`
- Verify Aztec devnet is running: `aztec status` or `pnpm aztec:devnet`
- Check browser console for connection errors
- Verify PXE URL: Should be `http://localhost:8080`

**"Failed to initialize Aztec client":**
- Make sure devnet is running: `pnpm aztec:devnet`
- Check PXE URL: Should be `http://localhost:8080`
- Wait a few seconds for devnet to fully start
- Check Docker is running (required for sandbox)

**"Contract not deployed":**
- Contract needs to be compiled first: `pnpm aztec:compile`
- Contract will be auto-deployed on first use (or set `PRIVATE_IDENTITY_GARDEN_ADDRESS` if already deployed)

**PXE connection errors:**
- Verify sandbox is accessible: `curl http://localhost:8080` (should return some response)
- Check firewall/network settings
- Try restarting sandbox: `aztec-down` then `pnpm aztec:devnet`

## The Core Innovation

**Selective Skill Sharing:**
- You prove **competence** (Tier 3) without revealing **credentials** (which courses, which scores)
- Community-defined paths (not brand-defined)
- Aggregated across sources (not single-source)
- User-controlled identity (you choose when to publish)

This is the anti-credentialism, pro-competence, privacy-first learning system.

