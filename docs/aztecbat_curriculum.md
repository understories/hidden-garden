# AztecBat Curriculum — Private Learning Pathway for Noir & Aztec

(A Source of Truth for the App, Circuits, and Game Logic)

## Overview

AztecBat is a micro-learning pathway for Noir/Aztec fundamentals, inspired by CodingBat's approach to incremental skill building. Each puzzle is tiny, auto-gradable, and logged privately in the Aztec identity vault as a `QuestNote`.

The system operates on a privacy-first model: individual puzzle completions and scores are stored as private notes in the user's Aztec identity vault. A Noir circuit (`prove_aztec_builder_tier`) compresses puzzle completions and scores into mastery tiers. The public chain only sees a *tier proof* — never individual puzzle results, scores, or completion timestamps.

This curriculum document serves as the authoritative specification for:
- Puzzle definitions and auto-grading logic
- QuestNote structure and storage
- Noir circuit implementation for tier proofs
- Public contract integration for proof verification
- UI/UX flow and leaderboard display

All implementations (frontend, backend, circuits, contracts) must reference this document as the source of truth.

---

## 1. Learning Philosophy

### Competency > Credentials

AztecBat measures what you can *do*, not what you claim. Each puzzle requires active demonstration of understanding through code, logic, or reasoning. Mastery is proven through ZK proofs that demonstrate competency without revealing the learning journey.

### Privacy-First Learning

Learning is personal. Your mistakes, attempts, and progress are private. Only the aggregate proof of mastery (tier) is published. This protects learners from credentialism, discrimination, and the pressure of public failure.

### Tiny Auto-Gradable Puzzles

Each puzzle is designed to be:
- **Completable in 2-5 minutes** — no marathon sessions
- **Auto-gradable** — instant feedback without human review
- **Focused on a single concept** — clear learning objective
- **Progressive** — builds on previous puzzles

### Private Transcripts + Public Threshold Proofs

Your complete learning transcript (all puzzles, scores, timestamps) lives in your private Aztec vault. You can prove mastery thresholds (e.g., "I've achieved Tier 3") without revealing:
- Which specific puzzles you completed
- Your scores on individual puzzles
- How many attempts you made
- When you completed each puzzle

### Anti-Credentialism

AztecBat publishes *ability*, not *pedigree*. Your tier proof demonstrates competency without revealing your background, education, or identity. This levels the playing field and focuses on what matters: can you build with Noir and Aztec?

### Fun, Safe, AI-Assisted but Not AI-Replaceable

Puzzles are designed to be engaging and approachable. AI tools can help you learn, but the puzzles require genuine understanding of Noir/Aztec concepts. The ZK proofs ensure that mastery is real, not just copied solutions.

---

## 2. Tier Structure

### Tier 1 — Aztec Explorer (Conceptual Fundamentals)

**Learning Objective:** Understand the core concepts of Aztec Protocol, privacy-preserving blockchains, and zero-knowledge proofs at a conceptual level.

**Mastery Indicators:**
- Can explain what Aztec Protocol is and how it differs from other L2s
- Understands the concept of private notes and encrypted state
- Knows the difference between public and private transactions
- Can identify basic privacy guarantees

**Required Puzzles:** 5 puzzles covering Aztec concepts, privacy basics, and protocol fundamentals.

**Tier Proof Threshold:** All 5 puzzles completed with score >= 60%.

---

### Tier 2 — Noir Novice (Constraint Reasoning + Syntax)

**Learning Objective:** Write basic Noir circuits, understand constraint systems, and reason about zero-knowledge proofs at the code level.

**Mastery Indicators:**
- Can write simple Noir functions with correct syntax
- Understands how to express constraints (assertions)
- Can identify and fix common Noir compilation errors
- Understands the difference between public and private inputs/outputs

**Required Puzzles:** 5 puzzles covering Noir syntax, constraint writing, input/output handling, and basic circuit logic.

**Tier Proof Threshold:** Tier 1 completed + all 5 Tier 2 puzzles with score >= 60%.

---

### Tier 3 — Private State Scribe (Applied Aztec Knowledge)

**Learning Objective:** Work with Aztec's private state system, understand note management, and implement basic private smart contract patterns.

**Mastery Indicators:**
- Can identify what should be private vs. public in an Aztec contract
- Understands how private notes work and when to use them
- Can reason about privacy leaks and information disclosure
- Can implement basic private state updates

**Required Puzzles:** 5 puzzles covering private state, note management, privacy analysis, and first private transaction.

**Tier Proof Threshold:** Tier 2 completed + all 5 Tier 3 puzzles with score >= 60%.

---

### Tier 4 — Identity Architect (Integration of ZK, Identity, and Privacy Primitives)

**Learning Objective:** Design and implement ZK-based identity proofs, understand public output design, and integrate privacy primitives into real-world patterns.

**Mastery Indicators:**
- Can design minimal identity proofs that reveal only necessary information
- Understands how to structure public outputs for L1 verification
- Can design ZK threshold proofs for skill/credential verification
- Can integrate tier proofs with public contracts

**Required Puzzles:** 4 puzzles covering identity proof design, public output specification, ZK threshold proofs, and tier proof publishing.

**Tier Proof Threshold:** Tier 3 completed + all 4 Tier 4 puzzles with score >= 60%.

---

## 3. Quest & Puzzle Definitions (CodingBat-style)

Each puzzle in AztecBat follows a strict specification format to ensure consistent implementation across frontend, backend, and circuit logic.

### Puzzle Specification Format

```text
### Puzzle X.Y — {Name}

**quest_id:** `hash("...")`  
**Tier:** 1/2/3/4  
**Type:** (multiple_choice | numeric_input | structured_text | devnet_tx | puzzle_logic)  
**Prompt:**  
> Describe the puzzle exactly as the user sees it.  
**User Submission:** What input the user provides.  
**Validation Logic:** How to auto-grade it in JS or with devnet RPC.  
**Success Criteria:** Boolean or threshold.  
**Score:** integer 0–100 or boolean.  
**Remarks for Noir Vault:** What private note will be recorded.
```

### Puzzle Types

- **multiple_choice:** User selects from predefined options. Auto-graded by comparing selection to correct answer index.
- **numeric_input:** User enters a number or field value. Auto-graded by comparing to expected value(s).
- **structured_text:** User provides structured text (e.g., code snippet, JSON). Auto-graded by parsing and validating structure/logic.
- **devnet_tx:** User must submit a transaction to Aztec devnet. Auto-graded by querying devnet state or transaction receipt.
- **puzzle_logic:** User must reason through a logic puzzle and provide explanation. Auto-graded by keyword matching or structured response parsing.

---

## 4. Full Puzzle List

### Tier 1 Puzzles

#### Puzzle 1.1 — SumTo7

**quest_id:** `hash("aztec_concept_quiz")`  
**Tier:** 1  
**Type:** multiple_choice  
**Prompt:**  
> What is Aztec Protocol?  
> A) A privacy-focused Layer 2 blockchain  
> B) A DeFi protocol  
> C) A wallet application  
> D) A token standard  

**User Submission:** Integer index (0-3) representing selected option.  
**Validation Logic:** `submission === 0`  
**Success Criteria:** Exact match to correct answer index.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Records completion of conceptual understanding quiz. Score represents percentage of correct answers in multi-question quiz.

---

#### Puzzle 1.2 — SmallSquare

**quest_id:** `hash("aztec_privacy_basics")`  
**Tier:** 1  
**Type:** multiple_choice  
**Prompt:**  
> What makes Aztec different from other Layer 2 solutions?  
> A) It uses zero-knowledge proofs for privacy  
> B) It has lower transaction fees  
> C) It supports more token types  
> D) It has faster block times  

**User Submission:** Integer index (0-3).  
**Validation Logic:** `submission === 0`  
**Success Criteria:** Exact match.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Tests understanding of Aztec's core privacy value proposition.

---

#### Puzzle 1.3 — FixThisCircuit

**quest_id:** `hash("aztec_notes_concept")`  
**Tier:** 1  
**Type:** multiple_choice  
**Prompt:**  
> What is a private note in Aztec?  
> A) An encrypted piece of data only the owner can decrypt  
> B) A public transaction record  
> C) A smart contract function  
> D) A token type  

**User Submission:** Integer index (0-3).  
**Validation Logic:** `submission === 0`  
**Success Criteria:** Exact match.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Validates understanding of Aztec's note-based private state model.

---

#### Puzzle 1.4 — WhichAssertionFails

**quest_id:** `hash("aztec_public_vs_private")`  
**Tier:** 1  
**Type:** multiple_choice  
**Prompt:**  
> What is the difference between a public and private transaction in Aztec?  
> A) Public transactions are visible to everyone; private transactions encrypt inputs/outputs  
> B) Public transactions are faster  
> C) Private transactions cost more  
> D) There is no difference  

**User Submission:** Integer index (0-3).  
**Validation Logic:** `submission === 0`  
**Success Criteria:** Exact match.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Tests fundamental understanding of Aztec's dual transaction model.

---

#### Puzzle 1.5 — NoirSyntaxBug (Optional)

**quest_id:** `hash("aztec_protocol_overview")`  
**Tier:** 1  
**Type:** multiple_choice  
**Prompt:**  
> Which of the following is a privacy guarantee of Aztec?  
> A) Individual transaction details are encrypted  
> B) All transactions are public  
> C) Only validators can see transactions  
> D) Transactions are stored off-chain  

**User Submission:** Integer index (0-3).  
**Validation Logic:** `submission === 0`  
**Success Criteria:** Exact match.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Optional puzzle for extra credit. Tests understanding of Aztec's privacy model.

---

### Tier 2 Puzzles

#### Puzzle 2.1 — NoirInputPuzzle

**quest_id:** `hash("noir_basic_puzzle")`  
**Tier:** 2  
**Type:** numeric_input  
**Prompt:**  
> Complete this Noir function to return the sum of two inputs:  
> ```noir
> fn add(a: Field, b: Field) -> Field {
>     // Your code here
> }
> ```  
> What value does `add(5, 3)` return?  

**User Submission:** Integer or Field value (as string or number).  
**Validation Logic:** Parse submission as number, check `submission === 8`.  
**Success Criteria:** Exact match to expected value.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Tests basic Noir function writing and arithmetic understanding.

---

#### Puzzle 2.2 — RangeCheckFix

**quest_id:** `hash("noir_constraint_basics")`  
**Tier:** 2  
**Type:** structured_text  
**Prompt:**  
> Fix this Noir function to ensure the result is between 0 and 100:  
> ```noir
> fn bounded_value(x: Field) -> Field {
>     let result = x * 2;
>     // Add assertion here
>     result
> }
> ```  
> Provide the corrected assertion line.  

**User Submission:** String containing Noir assertion code (e.g., `"assert(result >= 0 && result <= 100);"`).  
**Validation Logic:** Parse submission, check for presence of `assert`, `result >= 0`, `result <= 100` (or equivalent logic).  
**Success Criteria:** Contains valid assertion with both bounds checked.  
**Score:** 100 if correct assertion present, 0 otherwise.  
**Remarks for Noir Vault:** Tests understanding of Noir constraint system and assertion syntax.

---

#### Puzzle 2.3 — PrivatePubSplit

**quest_id:** `hash("noir_public_private")`  
**Tier:** 2  
**Type:** multiple_choice  
**Prompt:**  
> In Noir, what is the difference between `pub` and non-`pub` function parameters?  
> A) `pub` parameters are visible in the proof; non-`pub` are private  
> B) `pub` parameters are faster to compute  
> C) Non-`pub` parameters are optional  
> D) There is no difference  

**User Submission:** Integer index (0-3).  
**Validation Logic:** `submission === 0`  
**Success Criteria:** Exact match.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Tests understanding of public vs. private inputs in Noir circuits.

---

#### Puzzle 2.4 — TinyHashCircuit

**quest_id:** `hash("noir_hash_function")`  
**Tier:** 2  
**Type:** structured_text  
**Prompt:**  
> Write a Noir function that hashes a Field value using pedersen_hash:  
> ```noir
> fn hash_value(x: Field) -> Field {
>     // Your code here
> }
> ```  
> Provide the function body.  

**User Submission:** String containing Noir code (e.g., `"hash::pedersen_hash([x])"` or equivalent).  
**Validation Logic:** Parse submission, check for presence of hash function call (pedersen_hash, keccak, etc.) with correct syntax.  
**Success Criteria:** Contains valid hash function call with input parameter.  
**Score:** 100 if correct, 0 otherwise.  
**Remarks for Noir Vault:** Tests ability to use Noir's standard library hash functions.

---

#### Puzzle 2.5 — NoirFirstCircuit (Optional "dev-mode")

**quest_id:** `hash("noir_first_circuit")`  
**Tier:** 2  
**Type:** devnet_tx  
**Prompt:**  
> Deploy a simple Noir circuit to Aztec devnet that proves you know a secret value `x` such that `x * 2 == 10`.  
> Submit the transaction hash of your deployment.  

**User Submission:** Transaction hash string (0x-prefixed hex).  
**Validation Logic:** Query Aztec devnet RPC for transaction receipt. Verify transaction is successful and contract is deployed. Optionally verify contract code matches expected pattern.  
**Success Criteria:** Valid transaction hash with successful receipt.  
**Score:** 100 if transaction succeeds, 0 otherwise.  
**Remarks for Noir Vault:** Optional advanced puzzle. Tests ability to deploy and interact with Aztec devnet.

---

#### Puzzle 2.6 — NoirSyntaxBasics

**quest_id:** `hash("noir_syntax_basics")`  
**Tier:** 2  
**Type:** multiple_choice  
**Prompt:**  
> In Noir, what is the correct way to declare a public function that takes a Field parameter?  
> A) `fn my_function(x: Field) -> Field`  
> B) `pub fn my_function(x: Field) -> Field`  
> C) `public fn my_function(x: Field) -> Field`  
> D) `fn pub my_function(x: Field) -> Field`  

**User Submission:** Integer index (0-3) representing selected option.  
**Validation Logic:** `submission === 1` (option B is correct)  
**Success Criteria:** Exact match to correct answer index.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Tests understanding of Noir function syntax, specifically the `pub` keyword placement.

---

#### Puzzle 2.7 — AztecStorageIntro

**quest_id:** `hash("aztec_storage_intro")`  
**Tier:** 2  
**Type:** multiple_choice  
**Prompt:**  
> What is a private note in Aztec Protocol?  
> A) A public transaction record visible to everyone  
> B) An encrypted piece of data that only the owner can decrypt and spend  
> C) A smart contract function that stores public data  
> D) A token type used for public transactions  

**User Submission:** Integer index (0-3) representing selected option.  
**Validation Logic:** `submission === 1` (option B is correct)  
**Success Criteria:** Exact match to correct answer index.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Tests understanding of Aztec's private note-based storage model.

---

### Tier 3 Puzzles

#### Puzzle 3.1 — WhichIsPrivate

**quest_id:** `hash("aztec_private_state_identify")`  
**Tier:** 3  
**Type:** multiple_choice  
**Prompt:**  
> In an Aztec contract, which of the following should be stored as private state?  
> A) User's skill level  
> B) Contract's total supply  
> C) Public event logs  
> D) Contract owner address  

**User Submission:** Integer index (0-3).  
**Validation Logic:** `submission === 0`  
**Success Criteria:** Exact match.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Tests understanding of when to use private vs. public state in Aztec contracts.

---

#### Puzzle 3.2 — PrivacyLeak

**quest_id:** `hash("aztec_privacy_analysis")`  
**Tier:** 3  
**Type:** puzzle_logic  
**Prompt:**  
> Consider this Aztec function:  
> ```noir
> #[private]
> fn update_balance(owner: AztecAddress, new_balance: u64) {
>     storage.balances.at(owner).set(new_balance, owner);
> }
> ```  
> What information is leaked if this function is called?  
> A) The new balance value  
> B) The owner's address  
> C) Both A and B  
> D) Nothing is leaked  

**User Submission:** Integer index (0-3).  
**Validation Logic:** `submission === 1` (owner address is public input, balance is private).  
**Success Criteria:** Exact match.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Tests ability to analyze privacy properties of Aztec contract functions.

---

#### Puzzle 3.3 — StateUpdateCorrectness

**quest_id:** `hash("aztec_note_management")`  
**Tier:** 3  
**Type:** structured_text  
**Prompt:**  
> Write the correct Aztec.nr code to create a private note with a skill level:  
> ```noir
> struct SkillNote {
>     skill_hash: Field,
>     level: u8,
> }
> ```  
> Provide the code to create and store this note.  

**User Submission:** String containing Aztec.nr code (e.g., `"Note::new(SkillNote { skill_hash: hash, level: 5 })"` or equivalent).  
**Validation Logic:** Parse submission, check for Note creation with correct struct initialization.  
**Success Criteria:** Contains valid Note::new call with SkillNote struct.  
**Score:** 100 if correct, 0 otherwise.  
**Remarks for Noir Vault:** Tests understanding of Aztec note creation and private state management.

---

#### Puzzle 3.4 — FirstPrivateTx

**quest_id:** `hash("first_private_tx")`  
**Tier:** 3  
**Type:** devnet_tx  
**Prompt:**  
> Send a private transaction to an Aztec contract that updates your private skill level.  
> Submit the transaction hash.  

**User Submission:** Transaction hash string (0x-prefixed hex).  
**Validation Logic:** Query Aztec devnet RPC for transaction receipt. Verify transaction is private (encrypted) and successful. Optionally verify contract state was updated.  
**Success Criteria:** Valid private transaction hash with successful receipt.  
**Score:** 100 if transaction succeeds, 0 otherwise.  
**Remarks for Noir Vault:** Tests ability to send private transactions on Aztec devnet.

---

#### Puzzle 3.5 — VaultModification (Optional)

**quest_id:** `hash("aztec_vault_update")`  
**Tier:** 3  
**Type:** puzzle_logic  
**Prompt:**  
> Explain in 1-2 sentences: How do you update an existing private note in Aztec?  
> (Hint: Think about nullifiers and new note creation)  

**User Submission:** Free-form text (1-2 sentences).  
**Validation Logic:** Parse text for keywords: "nullifier", "spend", "new note", "create", or equivalent concepts. Check that answer indicates understanding that notes are immutable and updates require nullifying old + creating new.  
**Success Criteria:** Contains key concepts about note immutability and nullifier-based updates.  
**Score:** 100 if key concepts present, 0 otherwise.  
**Remarks for Noir Vault:** Optional advanced puzzle testing deep understanding of Aztec note system.

---

### Tier 4 Puzzles

#### Puzzle 4.1 — MinimalIdentityProof

**quest_id:** `hash("zk_identity_design")`  
**Tier:** 4  
**Type:** puzzle_logic  
**Prompt:**  
> Design a minimal ZK proof that proves you have a skill level >= 5 without revealing the exact level.  
> What should be the public inputs?  
> A) skill_hash, min_level  
> B) skill_hash, exact_level  
> C) user_address, skill_hash, min_level  
> D) user_address, skill_hash, exact_level  

**User Submission:** Integer index (0-3).  
**Validation Logic:** `submission === 2` (user_address for verification, skill_hash for identification, min_level for threshold, but NOT exact_level).  
**Success Criteria:** Exact match.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Tests understanding of minimal disclosure in ZK proof design.

---

#### Puzzle 4.2 — IdentifyPublicOutputs

**quest_id:** `hash("zk_public_outputs")`  
**Tier:** 4  
**Type:** structured_text  
**Prompt:**  
> For a tier proof function `prove_aztec_builder_tier(min_tier, min_average_score)`, list the public outputs that should be emitted for L1 verification.  
> Provide a comma-separated list.  

**User Submission:** String (e.g., `"user_address, min_tier, min_average_score, path_hash"`).  
**Validation Logic:** Parse submission, check for presence of: user_address (or equivalent), min_tier, min_average_score, path_hash (or category identifier).  
**Success Criteria:** Contains all required public outputs for L1 verification.  
**Score:** 100 if all required outputs present, partial credit for missing non-critical outputs.  
**Remarks for Noir Vault:** Tests understanding of public output design for cross-domain verification.

---

#### Puzzle 4.3 — ZKThresholdDesign

**quest_id:** `hash("zk_threshold_proof")`  
**Tier:** 4  
**Type:** puzzle_logic  
**Prompt:**  
> In the `prove_aztec_builder_tier` circuit, how should the average score be calculated?  
> A) Average of all quest scores (including failed ones)  
> B) Average of only quests that passed the threshold  
> C) Average of all quests in completed tiers  
> D) Maximum score among all quests  

**User Submission:** Integer index (0-3).  
**Validation Logic:** `submission === 2` (average of quests in completed tiers, as tier completion requires passing threshold).  
**Success Criteria:** Exact match.  
**Score:** 100 if correct, 0 if incorrect.  
**Remarks for Noir Vault:** Tests understanding of tier calculation logic and score aggregation.

---

#### Puzzle 4.4 — TierProofPublishing (Integrated Demo Step)

**quest_id:** `hash("identity_architect_scenario")`  
**Tier:** 4  
**Type:** devnet_tx  
**Prompt:**  
> Generate a tier proof for Tier 3 with min_average_score 70, then submit it to the public SkillLeaderboard contract.  
> Submit the L1 transaction hash.  

**User Submission:** Transaction hash string (0x-prefixed hex) on L1 (Ethereum/Sepolia).  
**Validation Logic:** Query L1 RPC for transaction receipt. Verify transaction calls `submitSkillTierWithProof` (or equivalent) on SkillLeaderboard contract. Verify transaction is successful.  
**Success Criteria:** Valid L1 transaction hash with successful receipt calling the correct contract function.  
**Score:** 100 if transaction succeeds, 0 otherwise.  
**Remarks for Noir Vault:** Final integration puzzle. Tests end-to-end flow from Aztec proof generation to L1 contract submission.

---

## 5. QuestNote Specification for Aztec Private Vault

The `QuestNote` struct is the canonical format for storing puzzle completions in the user's private Aztec identity vault.

### QuestNote Structure

```noir
struct QuestNote {
    quest_id_hash: Field,      // hash("quest_id") - unique identifier for the puzzle
    category_hash: Field,       // hash("aztec_builder") - pathway category
    score: u8,                  // 0-100 - completion score
    timestamp: u64,             // Unix timestamp or 0 if not available
}
```

### Quest ID Hashing

Quest IDs are hashed using `pedersen_hash` (or equivalent) of the quest identifier string:

- `quest_id_hash = hash("aztec_concept_quiz")` for Puzzle 1.1
- `quest_id_hash = hash("noir_basic_puzzle")` for Puzzle 2.1
- `quest_id_hash = hash("first_private_tx")` for Puzzle 3.4
- `quest_id_hash = hash("identity_architect_scenario")` for Puzzle 4.4

### Category Hash

All AztecBat puzzles use the same category:

```noir
category_hash = hash("aztec_builder")
```

This allows the tier proof circuit to filter quests by category.

### Score Storage

Scores are stored as `u8` (0-100):
- `0`: Puzzle not attempted or failed
- `1-99`: Partial completion or below passing threshold
- `100`: Perfect score (all correct)

For boolean puzzles (multiple choice), scores are typically 0 or 100.

### Timestamp Handling

- If block timestamp is available in private functions: use `context.block_timestamp()` or equivalent
- Otherwise: use `0` as placeholder
- Timestamps are informational only and not used in tier calculations

### Overwrite Policy

When a user completes the same puzzle multiple times:
- **Record the highest score** — if new score > existing score, update storage
- **Keep attempt history** — in a full implementation, could store multiple notes with different timestamps
- **For tier proofs** — circuit reads the maximum score per quest_id_hash

### Storage Implementation

In the Aztec contract (`PrivateIdentityGarden`), quest scores are stored in private storage:

```noir
#[storage]
struct Storage<Context> {
    quest_scores: Map<AztecAddress, Map<Field, EasyPrivateUint<Context>, Context>, Context>,
}
```

The `add_quest_completion` function:
1. Validates score (0-100)
2. Computes `quest_id_hash` and `category_hash`
3. Stores score in `quest_scores[owner][quest_id_hash]`
4. Keeps maximum score if quest already exists
5. Creates a `QuestNote` and stores as private note

---

## 6. Noir Circuit Specification: `prove_aztec_builder_tier`

The `prove_aztec_builder_tier` function is the core ZK circuit that compresses private quest completions into a public tier proof.

### Function Signature

```noir
#[external("private")]
pub fn prove_aztec_builder_tier(
    owner: AztecAddress,        // Public input: user's Aztec address
    min_tier: u8,                // Public input: minimum tier to prove (1-4)
    min_average_score: u8         // Public input: minimum average score (0-100)
) -> AztecAddress                // Public output: owner address (for L1 verification)
```

### Public Inputs

1. **owner** (`AztecAddress`): The user's Aztec address. Must match the address that owns the quest notes.
2. **min_tier** (`u8`): The minimum tier the user wants to prove (1-4).
3. **min_average_score** (`u8`): The minimum average score across completed quests (0-100).

### Private Scanning Logic

The circuit performs the following steps:

1. **Query Private Storage**: Read quest scores from `storage.quest_scores[owner]` for each required quest.

2. **Hardcoded Quest Mapping**: Use hardcoded quest_id_hash values:
   - Tier 1: `hash("aztec_concept_quiz")`
   - Tier 2: `hash("noir_basic_puzzle")`
   - Tier 3: `hash("first_private_tx")`
   - Tier 4: `hash("identity_architect_scenario")`

3. **Tier Calculation**:
   - Start with `achieved_tier = 0`
   - For each tier (1-4), check if:
     - All prerequisite tiers are completed
     - The quest for this tier exists in storage
     - The quest score >= `min_average_score`
   - If all conditions met, increment `achieved_tier`

4. **Average Score Calculation**:
   - Sum scores of all quests in completed tiers
   - Divide by number of completed quests
   - Round to integer (0-100)

5. **Assertions**:
   - `assert(achieved_tier >= min_tier, "Tier requirement not met")`
   - `assert(average_score >= min_average_score, "Average score requirement not met")`

### Tier Thresholds

- **Tier 1**: Requires quest 1.1 with score >= `min_average_score`
- **Tier 2**: Requires Tier 1 + quest 2.1 with score >= `min_average_score`
- **Tier 3**: Requires Tier 2 + quest 3.4 with score >= `min_average_score`
- **Tier 4**: Requires Tier 3 + quest 4.4 with score >= `min_average_score`

### Average Score Calculation

Average score is computed as:
```noir
total_score = sum of all quest scores in completed tiers
quest_count = number of quests in completed tiers
average_score = if quest_count > 0 { total_score / quest_count } else { 0 }
```

Only quests that contributed to tier completion are included in the average.

### Public Outputs

1. **owner** (`AztecAddress`): Returned as function return value. Used for L1 verification to ensure proof corresponds to correct user.

2. **min_tier** (`u8`): Already a public input (function parameter). Available in proof.

3. **min_average_score** (`u8`): Already a public input (function parameter). Available in proof.

4. **path_hash** (`Field`): Computed as `hash("aztec_builder_path")`. Available as public output in proof.

### Required Hardcoded Quest→Tier Mapping

The circuit must hardcode the following mappings:

```noir
let quest_tier_1_hash = hash("aztec_concept_quiz");
let quest_tier_2_hash = hash("noir_basic_puzzle");
let quest_tier_3_hash = hash("first_private_tx");
let quest_tier_4_hash = hash("identity_architect_scenario");
```

These hashes are computed at compile time and embedded in the circuit.

### Circuit Implementation Notes

- All quest score reads are **private** — actual scores are not revealed in the proof
- Only the boolean result (tier >= min_tier, average >= min_average) is proven
- The circuit enforces sequential tier progression (cannot skip tiers)
- Average score calculation includes only quests that contributed to tier completion

---

## 7. Public Contract Integration

The public `SkillLeaderboard` contract verifies tier proofs and records them on-chain.

### Contract Function: `submitSkillTierWithProof`

```solidity
function submitSkillTierWithProof(
    bytes32 skillHash,           // hash("aztec_builder_path")
    uint8 minLevel,               // min_tier from proof
    bytes calldata proof,         // ZK proof bytes from Aztec circuit
    bytes calldata publicInputs   // Encoded: (address, bytes32, uint8)
) external
```

### ABI Specification

```json
{
  "name": "submitSkillTierWithProof",
  "type": "function",
  "inputs": [
    { "name": "skillHash", "type": "bytes32" },
    { "name": "minLevel", "type": "uint8" },
    { "name": "proof", "type": "bytes" },
    { "name": "publicInputs", "type": "bytes" }
  ],
  "outputs": []
}
```

### IAztecVerifier Usage

The contract uses an `IAztecVerifier` to verify proofs:

```solidity
interface IAztecVerifier {
    function verify(bytes calldata proof, bytes calldata publicInputs) external returns (bool);
}
```

The verifier:
1. Receives the ZK proof bytes from the Aztec circuit
2. Receives encoded public inputs
3. Verifies the proof is valid
4. Returns `true` if proof is valid, `false` otherwise

### publicInputs Decoding

The `publicInputs` are encoded as:

```solidity
bytes memory publicInputs = abi.encode(
    userAddress,    // address (20 bytes) - AztecAddress converted to EVM address
    skillHash,      // bytes32 (32 bytes) - must match function argument
    minLevel        // uint8 (1 byte) - must match function argument
);
```

Total length: 53 bytes (when using `abi.encode`).

The contract decodes and validates:

```solidity
(address userAddress, bytes32 decodedSkillHash, uint8 decodedMinLevel) = abi.decode(
    publicInputs,
    (address, bytes32, uint8)
);

require(userAddress == msg.sender, "User address mismatch");
require(decodedSkillHash == skillHash, "Skill hash mismatch");
require(decodedMinLevel == minLevel, "Min level mismatch");
```

### Mapping Updates

On successful proof verification, the contract updates:

```solidity
skillTier[skillHash][msg.sender] = minLevel;
```

This records the user's proven tier for the Aztec Builder pathway.

### Event Emission

The contract emits:

```solidity
event SkillRevealed(address indexed user, bytes32 indexed skillHash, uint8 tier);

emit SkillRevealed(msg.sender, skillHash, minLevel);
```

### Link to Indexer

The indexer service:
1. Listens for `SkillRevealed` events
2. Extracts `user`, `skillHash`, and `tier`
3. Stores in `skill_reveals` table
4. Exposes via `/leaderboard?skillHash=...` endpoint

The indexer uses `skillHash = hash("aztec_builder_path")` to filter Aztec Builder pathway entries.

---

## 8. UI Flow — Quickstart Mode

The quickstart UI guides users through the Aztec Builder pathway step-by-step.

### Step 1: Welcome & Wallet Connection

- Display welcome message: "🌱 Aztec Builder Quickstart"
- Show 4-tier progress indicator (all gray initially)
- Prompt user to connect wallet (MetaMask, WalletConnect, etc.)
- Verify user has SelfHumanSBT (required for contract submission)

### Step 2: Quest Selection & Display

- Show current quest based on `currentStep` (0-3)
- Display quest name, tier number, and description
- Show quest type indicator (multiple choice, code input, etc.)

### Step 3: Puzzle Interaction

**For Multiple Choice:**
- Display question text
- Show 4 radio button options
- User selects one option
- Enable "Submit" button when selection made

**For Code/Text Input:**
- Display puzzle prompt with code snippet (if applicable)
- Show text input or code editor
- User enters solution
- Enable "Submit" button when input non-empty

**For Devnet Transactions:**
- Display instructions for devnet interaction
- Show input field for transaction hash
- User pastes transaction hash
- Enable "Submit" button when hash format valid

### Step 4: Immediate Feedback

- On submission, evaluate answer locally (client-side)
- Calculate score (0-100)
- Display result:
  - ✅ "Correct! Score: 100%" (if passing)
  - ❌ "Incorrect. Score: X%" (if below threshold)
  - Show correct answer explanation (for learning)

### Step 5: Quest Completion Recording

- If score >= passing threshold (typically 60%):
  - Call backend API: `POST /api/quests/complete`
  - Payload: `{ questId: "...", score: 85 }`
  - Backend calls Aztec SDK: `add_quest_completion(owner, quest_id_hash, score)`
  - Update UI: Mark quest as completed ✅
  - Store completion in local state: `questCompletions.push({ questId, score, completed: true })`

- If score < threshold:
  - Show error: "Score X% is below passing threshold. Please try again."
  - Allow user to retry (same quest or different attempt)

### Step 6: Progress to Next Quest

- If not final quest:
  - Increment `currentStep`
  - Show next quest
  - Update progress indicator (highlight current tier)

- If final quest (Tier 4):
  - Show "Compute Tier" button
  - Calculate completed quests and scores
  - Display summary: "You've completed X quests with average score Y%"

### Step 7: Tier Proof Generation

- User clicks "Compute Tier" or "Generate Proof"
- Frontend calculates:
  - `minTier = Math.min(...completedQuests.map(q => q.tier))`
  - `averageScore = Math.round(sum / count)`
- Call backend API: `POST /api/aztec/generate-proof`
- Payload: `{ minTier: 3, minAverageScore: 75, userAddress: "0x..." }`
- Backend:
  1. Connects to Aztec devnet
  2. Calls `prove_aztec_builder_tier(owner, minTier, minAverageScore)` on Aztec contract
  3. Receives proof bytes and public inputs
  4. Returns: `{ proof: "0x...", publicInputs: "0x..." }`

### Step 8: Proof Submission to L1

- Frontend receives proof and public inputs
- Use wagmi to prepare contract call:
  ```typescript
  const pathHash = hashSkillName("aztec_builder_path");
  await writeContract({
    address: SKILL_LEADERBOARD_ADDRESS[chainId],
    abi: SkillLeaderboardAbi,
    functionName: "submitSkillTierWithProof",
    args: [pathHash, minTier, proof, publicInputs],
  });
  ```
- Show transaction pending state
- Wait for transaction confirmation
- Display success message: "✅ Tier proof submitted!"

### Step 9: Redirect to Leaderboard

- On successful submission, redirect to `/leaderboard/aztec-builder`
- Show user's tier badge
- Display leaderboard with other Aztec Builder participants

### Error Handling

- **Wallet not connected**: Show reminder banner
- **Network mismatch**: Prompt to switch to correct network
- **Proof generation fails**: Show error, allow retry
- **Contract call fails**: Show transaction error, allow retry
- **Score below threshold**: Show retry option for quest

---

## 9. Leaderboard Specification

The leaderboard displays Aztec Builder pathway participants ranked by tier and completion time.

### Skill Hash

The leaderboard uses:

```typescript
const skillHash = hashSkillName("aztec_builder_path");
// = keccak256(utf8("aztec_builder_path"))
```

This matches the `skillHash` used in `submitSkillTierWithProof` contract calls.

### Data Source

Leaderboard data comes from the indexer API:

```
GET /leaderboard?skillHash=0x...
```

Returns array of `LeaderboardEntry`:

```typescript
interface LeaderboardEntry {
  id: number;
  user_address: Address;
  skill_hash: SkillHash;
  tier: number;              // 1-4
  block_number: number;
  tx_hash: string;
  timestamp: number;
  created_at: number;
  ensName?: string;          // Optional ENS name
}
```

### Display Format

**Sorting:**
1. Primary: `tier` (descending) — higher tiers first
2. Secondary: `timestamp` (ascending) — earlier completions first (tie-breaker)

**Columns:**
- **Rank**: Sequential number (1, 2, 3, ...)
- **Address**: User's Ethereum address (truncated: `0x1234...5678`)
- **ENS Name**: If available, show ENS name instead of address
- **Tier Badge**: Visual badge showing tier (see below)
- **Completed**: Timestamp of tier proof submission (relative: "2 days ago")

### Tier Badges

**Tier 1 — Aztec Explorer:**
- Badge: 🌱 Explorer
- Color: Green (#4CAF50)
- Description: "Completed Aztec fundamentals"

**Tier 2 — Noir Novice:**
- Badge: 🔷 Novice
- Color: Blue (#2196F3)
- Description: "Mastered Noir basics"

**Tier 3 — Private State Scribe:**
- Badge: 📜 Scribe
- Color: Purple (#9C27B0)
- Description: "Applied Aztec private state"

**Tier 4 — Identity Architect:**
- Badge: 🏛️ Architect
- Color: Gold (#FFC107)
- Description: "Designed ZK identity proofs"

### Leaderboard Page Route

```
/leaderboard/aztec-builder
```

Uses `getAztecBuilderLeaderboard(client)` helper from `@hidden-garden/common`.

### User's Own Entry

If the current user's address appears in the leaderboard:
- Highlight their row
- Show "Your Rank: #X" banner
- Display their tier badge prominently

---

## 10. How to Use This Document

This curriculum document is the **authoritative specification** for the AztecBat learning pathway. All implementations must reference this document.

### For Cursor (AI Assistant)

When generating code for:
- **Frontend puzzles**: Read puzzle specifications from Section 4
- **Backend quest recording**: Use QuestNote structure from Section 5
- **Noir circuit**: Follow circuit specification from Section 6
- **Contract integration**: Use ABI and decoding logic from Section 7
- **UI components**: Follow flow from Section 8
- **Leaderboard**: Use specification from Section 9

**Key Principles:**
- All puzzle IDs must match the hardcoded hashes in Section 6
- QuestNote structure must match Section 5 exactly
- Tier calculation logic must match Section 6
- Contract function signatures must match Section 7

### For Developers

**When adding new puzzles:**
1. Add puzzle specification to Section 4
2. Update quest_id hash in Section 6 (hardcoded mapping)
3. Update tier requirements if needed
4. Update UI flow if puzzle type is new

**When modifying tier structure:**
1. Update Section 2 (tier definitions)
2. Update Section 6 (circuit logic)
3. Update Section 9 (badge names)
4. Update frontend tier display

**When changing QuestNote structure:**
1. Update Section 5 (specification)
2. Update Aztec contract (`PrivateIdentityGarden`)
3. Update circuit reading logic (Section 6)
4. Update backend recording API

### Version Control

This document should be:
- Committed to version control
- Referenced in PR descriptions
- Updated when curriculum changes
- Used as source of truth for all implementations

### Change Propagation

When this document is updated:
1. Update relevant code (circuits, contracts, UI)
2. Update tests to match new specifications
3. Update API documentation
4. Notify team of breaking changes

---

## Appendix: Quest ID Hash Reference

For quick reference, here are the quest_id hashes used in the circuit:

```noir
// Tier 1
let quest_tier_1_hash = hash("aztec_concept_quiz");

// Tier 2
let quest_tier_2_hash = hash("noir_basic_puzzle");

// Tier 3
let quest_tier_3_hash = hash("first_private_tx");

// Tier 4
let quest_tier_4_hash = hash("identity_architect_scenario");
```

All hashes use `pedersen_hash` (or equivalent) of the quest ID string.

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Maintainer:** Hidden Garden Team

