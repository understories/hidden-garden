# Team A Phase 2 & Phase 3 Summary

**For Team B: Quick Ramp-Up Guide**

This document summarizes Team A's work on the AztecBat learning pathway system, including the quest infrastructure, Noir circuits, and core game logic. Use this as a reference when building the UI, UX, and additional tooling.

---

## High-Level Architecture

### Repository Structure

```
hidden-garden/
├── docs/
│   ├── aztecbat_curriculum.md          # ⭐ CANONICAL SPEC - Source of truth for all puzzles
│   ├── aztec-integration.md            # Aztec Protocol integration guide
│   └── teamA_phase2_phase3_summary.md  # This document
│
├── packages/common/src/
│   ├── quests/                         # Quest logic interface layer
│   │   ├── types.ts                    # Core quest types & interfaces
│   │   ├── mapping.ts                  # Quest→Tier mappings, category hashes
│   │   ├── registry.ts                 # Quest registry (19 quests, validation stubs)
│   │   └── index.ts                    # Re-exports
│   ├── contracts.ts                    # Contract addresses, ABIs, chain configs
│   ├── leaderboardClient.ts            # Indexer API client
│   ├── api.ts                          # API types for indexer integration
│   └── index.ts                        # Main package exports
│
├── zk/private_skill_tree/
│   ├── src/main.nr                     # ⭐ Noir contract: PrivateIdentityGarden
│   └── tests/
│       └── prove_aztec_builder_tier_test.nr  # Tier proof circuit tests
│
└── apps/web/
    └── app/dev/aztecbat-status/
        └── page.tsx                    # Dev UI for testing quest validation
```

### System Flow

```
User Submission
    ↓
[Team B UI] → Quest Validation (stubbed, needs implementation)
    ↓
ValidationResult (success, score 0-100)
    ↓
[Team B] → Call Aztec SDK: add_quest_completion(quest_id_hash, score)
    ↓
[Aztec Contract] → Stores QuestNote in private vault
    ↓
[Team B] → User completes all quests for a tier
    ↓
[Team B] → Call Aztec SDK: prove_aztec_builder_tier(minTier, minAverageScore)
    ↓
[Noir Circuit] → Generates ZK proof + public inputs
    ↓
[Team B] → Submit proof to L1: submitAztecBuilderTierWithProof()
    ↓
[L1 Contract] → Verifies proof, emits event
    ↓
[Indexer] → Indexes tier reveal, updates leaderboard
```

---

## Main Public APIs / Interfaces

### 1. Quest System (`@hidden-garden/common/quests`)

**Location:** `packages/common/src/quests/`

#### Core Types

```typescript
// Quest identifiers
type QuestId = string;  // e.g., "aztec_concept_quiz"
type QuestIdHash = `0x${string}`;
type TierNumber = 1 | 2 | 3 | 4;
type CategoryId = "aztec_builder";

// Puzzle types
type PuzzleType = 
  | "multiple_choice"
  | "numeric_input"
  | "structured_text"
  | "devnet_tx"
  | "puzzle_logic";

// Submissions
type QuestSubmission = 
  | MultipleChoiceSubmission
  | NumericInputSubmission
  | StructuredTextSubmission
  | DevnetTxSubmission
  | PuzzleLogicSubmission;

// Validation result
interface ValidationResult {
  success: boolean;
  score: number;  // 0-100
  feedback?: string;
}
```

#### Quest Definition Interface

```typescript
interface QuestDefinition {
  questId: QuestId;
  questIdHash: QuestIdHash;
  tier: TierNumber;
  category: CategoryId;
  type: PuzzleType;
  name: string;
  prompt: string;
  expectedAnswerDescription?: string;
  dependencies?: QuestId[];
  
  // ⚠️ CURRENTLY STUBBED - Team B needs to implement
  validate(submission: QuestSubmission): Promise<ValidationResult> | ValidationResult;
}
```

#### Registry Functions

```typescript
// Get quest by ID
getQuestDefinition(questId: QuestId): QuestDefinition | undefined;

// List quests by tier
listQuestsByTier(tier: TierNumber): QuestDefinition[];

// List all quests
listAllQuests(): QuestDefinition[];

// Get tier for quest
getTierForQuest(questId: QuestId): TierNumber | undefined;

// Get quests for tier
getQuestsForTier(tier: TierNumber): QuestId[];
```

#### Quest Mapping Constants

```typescript
// Quest→Tier mapping (19 quests total)
QUEST_TIER_MAP: Record<QuestId, TierNumber>

// Tier→Quest IDs mapping
TIER_QUEST_MAP: Record<TierNumber, QuestId[]>

// Required quests per tier (excluding optional)
TIER_REQUIRED_QUESTS: Record<TierNumber, QuestId[]>
```

**Quest Registry Status:**
- ✅ 19 quests defined (4 tiers, 4-5 quests per tier)
- ✅ Metadata complete (name, prompt, type, tier)
- ⚠️ Validation functions are stubbed (throw errors)
- ⚠️ Quest ID hashes are placeholders (`0xPLACEHOLDER`)

---

### 2. Noir Contract (`zk/private_skill_tree/src/main.nr`)

**Contract Name:** `PrivateIdentityGarden`

#### Quest Completion Function

```noir
#[external("private")]
pub fn add_quest_completion(
    owner: AztecAddress,
    quest_id_hash: Field,
    score: u8  // 0-100
)
```

**What it does:**
- Validates score <= 100
- Creates `QuestNote` with:
  - `quest_id_hash`: Hash of quest identifier
  - `category_hash`: Hash of "aztec_builder"
  - `score`: Completion score (0-100)
  - `timestamp`: 0 (placeholder, not easily accessible in private functions)
- Stores in private storage (keeps best score if quest already exists)
- Creates private note for quest completion

**Team B Integration:**
- Call via Aztec SDK after validating quest submission
- Requires: `quest_id_hash` (computed from quest ID), `score` (from validation)

#### Tier Proof Function

```noir
#[external("private")]
pub fn prove_aztec_builder_tier(
    owner: AztecAddress,      // Public input
    min_tier: u8,             // Public input (1-4)
    min_average_score: u8     // Public input (0-100)
) -> AztecAddress            // Public output
```

**What it does:**
- Queries private storage for quest scores
- Hardcoded quest→tier mapping:
  - Tier 1: `hash("aztec_concept_quiz")`
  - Tier 2: `hash("noir_basic_puzzle")`
  - Tier 3: `hash("first_private_tx")`
  - Tier 4: `hash("identity_architect_scenario")`
- Computes achieved tier (max tier where all prerequisites met)
- Computes average score across completed quests
- Asserts: `achieved_tier >= min_tier` and `average_score >= min_average_score`
- Returns owner address as public output

**Public Outputs (for L1 verification):**
- `owner`: User's Aztec address
- `min_tier`: Minimum tier proven
- `min_average_score`: Minimum average score proven
- `path_hash`: Hash of "aztec_builder_path" (computed in circuit)

**Team B Integration:**
- Call via Aztec SDK when user wants to prove tier
- Returns: ZK proof + public inputs
- Submit to L1 contract: `submitAztecBuilderTierWithProof()`

---

### 3. Contract Integration (`packages/common/src/contracts.ts`)

#### Contract Addresses

```typescript
// Get address by chain ID
getSelfHumanSBTAddress(chainId: SupportedChainId): Address | undefined;
getSkillLeaderboardAddress(chainId: SupportedChainId): Address | undefined;

// Default addresses (local Hardhat)
SELF_HUMAN_SBT_ADDRESS: Address;
SKILL_LEADERBOARD_ADDRESS: Address;

// Chain configurations
CHAINS: Record<SupportedChainId, ChainConfig>;
```

#### Contract ABIs

```typescript
// SelfHumanSBT ABI
SelfHumanSBTAbi: readonly AbiFunction[];

// SkillLeaderboard ABI
SkillLeaderboardAbi: readonly AbiFunction[];
```

**Key L1 Functions:**
- `submitSkillTier(skillHash, tier)`: Plain submission (v1)
- `submitSkillTierWithProof(skillHash, minLevel, proof, publicInputs)`: ZK proof submission (v2)

---

### 4. Leaderboard Client (`packages/common/src/leaderboardClient.ts`)

```typescript
class LeaderboardClient {
  constructor(config: LeaderboardClientConfig);
  
  // Get leaderboard for a skill hash
  getLeaderboard(skillHash: SkillHash): Promise<LeaderboardEntry[]>;
  
  // Get all skills for a user
  getUserSkills(address: Address): Promise<UserSkill[]>;
}

// Helper for Aztec Builder pathway
getAztecBuilderLeaderboard(client: LeaderboardClient): Promise<LeaderboardEntry[]>;
```

**Team B Usage:**
- Initialize with indexer API base URL
- Query leaderboards and user skills
- Display in UI

---

### 5. Dev UI (`apps/web/app/dev/aztecbat-status/page.tsx`)

**Location:** `/dev/aztecbat-status`

**Purpose:** Test interface for quest validation and tier proof flow

**Features:**
- Lists all 19 quests with status (implemented/stubbed/error)
- Test quest validation with custom submissions
- Check tier proof client availability
- Visual status indicators

**Access:** Requires `NEXT_PUBLIC_ENABLE_DEV_UI=true` environment variable

**Team B Note:** This is a dev tool, not production UI. Use as reference for quest validation testing.

---

## What's Stable vs. Still In Flux

### ✅ Stable (Ready for Team B)

1. **Quest Registry Structure**
   - All 19 quests defined with metadata
   - Tier mappings complete
   - Type system fully specified

2. **Noir Contract Interface**
   - `add_quest_completion()` signature stable
   - `prove_aztec_builder_tier()` signature stable
   - Quest→tier mapping hardcoded in circuit

3. **Type System**
   - All TypeScript interfaces defined
   - Quest submission types complete
   - Validation result structure stable

4. **Contract Integration**
   - Contract addresses and ABIs defined
   - Chain configurations ready
   - L1 contract functions documented

5. **Curriculum Specification**
   - `/docs/aztecbat_curriculum.md` is canonical source
   - All puzzle definitions complete
   - Tier requirements specified

### ⚠️ In Flux / Needs Implementation

1. **Quest Validation Functions**
   - **Status:** All stubbed (throw errors)
   - **Team B Task:** Implement `validate()` for each quest type
   - **Reference:** Use curriculum doc for validation logic
   - **Types to implement:**
     - `multiple_choice`: Compare selected option to correct answer
     - `numeric_input`: Compare value to expected
     - `structured_text`: Parse and validate structure/logic
     - `devnet_tx`: Query devnet RPC to verify transaction
     - `puzzle_logic`: Keyword matching or structured parsing

2. **Quest ID Hashes**
   - **Status:** Placeholders (`0xPLACEHOLDER`)
   - **Team B Task:** Compute actual hashes (keccak256 of quest ID string)
   - **Must match:** Noir circuit hardcoded hashes

3. **Aztec SDK Integration**
   - **Status:** Not wired up
   - **Team B Task:** 
     - Wire up `add_quest_completion()` calls
     - Wire up `prove_aztec_builder_tier()` calls
     - Handle proof generation and submission

4. **Tier Proof Client**
   - **Status:** Placeholder check in dev UI
   - **Team B Task:** Implement client for requesting tier proofs
   - **Expected API:** `requestTierProof(minTier, minAverageScore) → { proof, publicInputs }`

5. **Category & Path Hashes**
   - **Status:** Placeholders in mapping.ts
   - **Team B Task:** Compute actual hashes:
     - `AZTEC_BUILDER_CATEGORY_HASH`: keccak256("aztec_builder")
     - `PATH_HASH`: keccak256("aztec_builder_path")
   - **Must match:** Noir circuit computed hashes

6. **Timestamp Handling**
   - **Status:** Set to 0 in Noir contract (not easily accessible)
   - **Team B Consideration:** May need to pass timestamp as parameter or use block timestamp if available

---

## Team B Responsibilities

### 1. Quest Validation Implementation

**Priority: High**

Implement validation functions for all 19 quests in `packages/common/src/quests/registry.ts`.

**Approach:**
- Reference `/docs/aztecbat_curriculum.md` for validation logic
- Implement by puzzle type:
  - Multiple choice: Simple comparison
  - Numeric input: Value comparison
  - Structured text: Parsing and validation
  - Devnet TX: RPC queries
  - Puzzle logic: Keyword/pattern matching

**Testing:**
- Use `/dev/aztecbat-status` page to test each quest
- Verify scores match curriculum expectations

### 2. Quest ID Hash Computation

**Priority: High**

Compute actual quest ID hashes and update:
- `packages/common/src/quests/registry.ts` (questIdHash fields)
- Ensure hashes match Noir circuit hardcoded values

**Method:**
```typescript
import { keccak256, toUtf8Bytes } from 'ethers';
const questIdHash = keccak256(toUtf8Bytes(questId)) as QuestIdHash;
```

### 3. Aztec SDK Integration

**Priority: High**

Wire up Aztec SDK calls for:
- `add_quest_completion(owner, quest_id_hash, score)`
- `prove_aztec_builder_tier(owner, min_tier, min_average_score)`

**Requirements:**
- Handle proof generation
- Submit proofs to L1 contract
- Handle errors and edge cases

### 4. UI/UX Implementation

**Priority: High**

Build production UI for:
- Quest selection and display
- Puzzle interaction (multiple choice, text input, etc.)
- Immediate feedback on submissions
- Progress tracking (tier completion)
- Tier proof generation UI
- Leaderboard display

**Reference:**
- Curriculum doc section "UI Flow — Quickstart Mode"
- Dev UI at `/dev/aztecbat-status` for structure

### 5. Category & Path Hash Computation

**Priority: Medium**

Compute and update:
- `AZTEC_BUILDER_CATEGORY_HASH` in `mapping.ts`
- `PATH_HASH` in `mapping.ts`

**Must match:** Noir circuit computed values

### 6. Additional Tools & Meta

**Priority: Medium**

- Game meta (scoring thresholds, tier requirements display)
- Progress visualization
- Badge/achievement system
- Analytics and tracking
- User onboarding flow

### 7. Backend API Integration

**Priority: Medium**

If needed:
- Quest completion recording endpoint
- Tier proof request endpoint
- Integration with indexer API

---

## Key Design Decisions

### Why Quest Validation is Stubbed

Team A focused on:
1. Defining the quest structure and metadata
2. Building the Noir circuit for tier proofs
3. Creating the type system and interfaces

Validation logic was left for Team B because:
- It requires UI/UX decisions (how to present puzzles)
- It needs testing with actual user interactions
- It may need backend services for devnet TX verification

### Why Quest Hashes are Placeholders

Hashes need to be computed consistently across:
- TypeScript code (quest registry)
- Noir circuit (hardcoded quest→tier mapping)
- L1 contract (if needed)

Team B should compute them once and ensure consistency.

### Why Timestamp is 0

Aztec private functions don't easily access block timestamp. Options:
1. Pass timestamp as parameter (from client)
2. Use 0 as placeholder (current approach)
3. Use Aztec's timestamp API if available

Team B can decide based on requirements.

### Why Only 4 Quest IDs in Noir Circuit

The circuit uses a simplified model:
- One quest per tier (the "key" quest)
- Other quests in each tier are optional or for completeness
- This keeps the circuit simple and efficient

Team B can extend this if needed, but must update the circuit.

---

## Testing & Validation

### Quest Validation Testing

Use `/dev/aztecbat-status` page:
1. Select a quest
2. Enter test submission (JSON format)
3. Click "Run validate()"
4. Check result matches expected

### Noir Circuit Testing

```bash
cd zk/private_skill_tree
nargo test
```

Tests cover:
- Tier 3 proof with high scores ✅
- Cannot prove tier 3 without tier 2 ✅
- Low scores fail min_average_score ✅
- Exact min_average_score passes ✅

### Integration Testing

**Not yet implemented.** Team B should:
1. Test full flow: submission → validation → Aztec call → tier proof
2. Test L1 contract submission
3. Test leaderboard updates

---

## Quick Reference

### Quest Count by Tier

- **Tier 1:** 4 required + 1 optional = 5 quests
- **Tier 2:** 4 required + 1 optional = 5 quests
- **Tier 3:** 4 required + 1 optional = 5 quests
- **Tier 4:** 4 required = 4 quests
- **Total:** 19 quests

### Key Quest IDs (for Noir circuit)

- Tier 1: `"aztec_concept_quiz"`
- Tier 2: `"noir_basic_puzzle"`
- Tier 3: `"first_private_tx"`
- Tier 4: `"identity_architect_scenario"`

### Passing Threshold

- Default: Score >= 60% (configurable per quest)
- Tier proof: Average score >= min_average_score (typically 70)

### Category & Path

- Category: `"aztec_builder"`
- Path: `"aztec_builder_path"`

---

## Questions for Team B

1. **Validation Implementation:** Do you need backend services for devnet TX verification, or can this be client-side?
2. **Timestamp:** Should we pass timestamp from client, or keep 0 for now?
3. **Quest Hashes:** Should we compute at build time or runtime?
4. **UI Framework:** What framework are you using? (Next.js is set up, but flexible)
5. **Aztec SDK:** Do you have Aztec SDK integration experience, or need guidance?

---

## Next Steps

1. **Review this document** and the curriculum spec
2. **Explore the codebase** using the dev UI
3. **Implement quest validation** for at least one quest type
4. **Wire up Aztec SDK** for quest completion
5. **Build UI** for quest interaction
6. **Test end-to-end flow** with tier proof generation

---

**Last Updated:** After web branch merge (Nov 2025)  
**Maintained By:** Team A → Team B handoff  
**Questions?** Reference `/docs/aztecbat_curriculum.md` for puzzle details

