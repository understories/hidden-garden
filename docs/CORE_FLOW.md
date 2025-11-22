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

1. **Start the app:**
   ```bash
   pnpm dev:web
   ```

2. **Navigate to quest:**
   - Go to: `http://localhost:3000/quests/aztec_concept_quiz`
   - Or click quest name in dev UI: `http://localhost:3000/dev/aztecbat-status`

3. **Complete the quiz:**
   - Enter answer: `{"selectedOptionId": "0"}`
   - Click "Validate Answer"
   - Should see: ✅ Correct! Score: 100%

4. **Store in Aztec:**
   - Click "🔒 Store Privately in Aztec"
   - Should see: ✅ Stored in Private Vault

5. **Generate & Publish Proof:**
   - Connect wallet (if not already)
   - Click "🔓 Generate & Publish Tier Proof"
   - Proof is generated and submitted to L1
   - Should see: ✅ Tier proof published!

## Current Status

✅ **Implemented:**
- Quest validation (first quest working)
- Quest ID hash computation
- Aztec client interface (with mock implementation)
- Complete UI flow for quest → Aztec → L1
- L1 contract integration (wagmi)

⚠️ **Mock Implementation:**
- Aztec SDK calls are mocked (`MockAztecClient`)
- Real Aztec SDK integration needed for production
- Proof generation is simulated

## Next Steps

1. **Replace MockAztecClient** with real Aztec SDK integration
2. **Deploy contracts** to testnet/mainnet
3. **Set up indexer** to track tier proofs
4. **Implement remaining quests** (18 more to go)
5. **Add leaderboard UI** to display published tiers

## The Core Innovation

**Selective Skill Sharing:**
- You prove **competence** (Tier 3) without revealing **credentials** (which courses, which scores)
- Community-defined paths (not brand-defined)
- Aggregated across sources (not single-source)
- User-controlled identity (you choose when to publish)

This is the anti-credentialism, pro-competence, privacy-first learning system.

