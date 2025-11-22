/**
 * Quest Registry
 * 
 * Central registry of all quest definitions for the AztecBat learning pathway.
 * Each quest entry includes metadata and a validation function.
 * 
 * Validation functions are currently placeholders and will be implemented later.
 * 
 * Based on `/docs/aztecbat_curriculum.md`
 */

import type {
  QuestId,
  QuestDefinition,
  QuestSubmission,
  ValidationResult,
  PuzzleType,
  TierNumber,
} from '@hidden-garden/core-logic';
import {
  getTierForQuest,
  getQuestCategory,
  AZTEC_BUILDER_CATEGORY,
} from '@hidden-garden/core-logic';

/**
 * Quest registry
 * Maps quest IDs to their complete definitions
 * 
 * Note: Validation functions currently throw errors.
 * They will be implemented in a future update.
 */
export const questRegistry: Record<QuestId, QuestDefinition> = {
  // ============================================================================
  // Tier 1 Puzzles
  // ============================================================================
  
  'aztec_concept_quiz': {
    questId: 'aztec_concept_quiz',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("aztec_concept_quiz")
    tier: 1,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'multiple_choice' as PuzzleType,
    name: 'SumTo7',
    prompt: 'What is Aztec Protocol?\nA) A privacy-focused Layer 2 blockchain\nB) A DeFi protocol\nC) A wallet application\nD) A token standard',
    expectedAnswerDescription: 'Integer index (0-3) representing selected option. Correct answer is 0.',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'aztec_privacy_basics': {
    questId: 'aztec_privacy_basics',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("aztec_privacy_basics")
    tier: 1,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'multiple_choice' as PuzzleType,
    name: 'SmallSquare',
    prompt: 'What makes Aztec different from other Layer 2 solutions?\nA) It uses zero-knowledge proofs for privacy\nB) It has lower transaction fees\nC) It supports more token types\nD) It has faster block times',
    expectedAnswerDescription: 'Integer index (0-3) representing selected option. Correct answer is 0.',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'aztec_notes_concept': {
    questId: 'aztec_notes_concept',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("aztec_notes_concept")
    tier: 1,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'multiple_choice' as PuzzleType,
    name: 'FixThisCircuit',
    prompt: 'What is a private note in Aztec?\nA) An encrypted piece of data only the owner can decrypt\nB) A public transaction record\nC) A smart contract function\nD) A token type',
    expectedAnswerDescription: 'Integer index (0-3) representing selected option. Correct answer is 0.',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'aztec_public_vs_private': {
    questId: 'aztec_public_vs_private',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("aztec_public_vs_private")
    tier: 1,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'multiple_choice' as PuzzleType,
    name: 'WhichAssertionFails',
    prompt: 'What is the difference between a public and private transaction in Aztec?\nA) Public transactions are visible to everyone; private transactions encrypt inputs/outputs\nB) Public transactions are faster\nC) Private transactions cost more\nD) There is no difference',
    expectedAnswerDescription: 'Integer index (0-3) representing selected option. Correct answer is 0.',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'aztec_protocol_overview': {
    questId: 'aztec_protocol_overview',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("aztec_protocol_overview")
    tier: 1,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'multiple_choice' as PuzzleType,
    name: 'NoirSyntaxBug',
    prompt: 'Which of the following is a privacy guarantee of Aztec?\nA) Individual transaction details are encrypted\nB) All transactions are public\nC) Only validators can see transactions\nD) Transactions are stored off-chain',
    expectedAnswerDescription: 'Integer index (0-3) representing selected option. Correct answer is 0. (Optional quest)',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  // ============================================================================
  // Tier 2 Puzzles
  // ============================================================================
  
  'noir_basic_puzzle': {
    questId: 'noir_basic_puzzle',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("noir_basic_puzzle")
    tier: 2,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'numeric_input' as PuzzleType,
    name: 'NoirInputPuzzle',
    prompt: 'Complete this Noir function to return the sum of two inputs:\n```noir\nfn add(a: Field, b: Field) -> Field {\n    // Your code here\n}\n```\nWhat value does `add(5, 3)` return?',
    expectedAnswerDescription: 'Integer or Field value. Expected answer: 8',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'noir_constraint_basics': {
    questId: 'noir_constraint_basics',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("noir_constraint_basics")
    tier: 2,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'structured_text' as PuzzleType,
    name: 'RangeCheckFix',
    prompt: 'Fix this Noir function to ensure the result is between 0 and 100:\n```noir\nfn bounded_value(x: Field) -> Field {\n    let result = x * 2;\n    // Add assertion here\n    result\n}\n```\nProvide the corrected assertion line.',
    expectedAnswerDescription: 'String containing Noir assertion code (e.g., "assert(result >= 0 && result <= 100);")',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'noir_public_private': {
    questId: 'noir_public_private',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("noir_public_private")
    tier: 2,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'multiple_choice' as PuzzleType,
    name: 'PrivatePubSplit',
    prompt: 'In Noir, what is the difference between `pub` and non-`pub` function parameters?\nA) `pub` parameters are visible in the proof; non-`pub` are private\nB) `pub` parameters are faster to compute\nC) Non-`pub` parameters are optional\nD) There is no difference',
    expectedAnswerDescription: 'Integer index (0-3) representing selected option. Correct answer is 0.',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'noir_hash_function': {
    questId: 'noir_hash_function',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("noir_hash_function")
    tier: 2,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'structured_text' as PuzzleType,
    name: 'TinyHashCircuit',
    prompt: 'Write a Noir function that hashes a Field value using pedersen_hash:\n```noir\nfn hash_value(x: Field) -> Field {\n    // Your code here\n}\n```\nProvide the function body.',
    expectedAnswerDescription: 'String containing Noir code (e.g., "hash::pedersen_hash([x])" or equivalent)',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'noir_first_circuit': {
    questId: 'noir_first_circuit',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("noir_first_circuit")
    tier: 2,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'devnet_tx' as PuzzleType,
    name: 'NoirFirstCircuit',
    prompt: 'Deploy a simple Noir circuit to Aztec devnet that proves you know a secret value `x` such that `x * 2 == 10`.\nSubmit the transaction hash of your deployment.',
    expectedAnswerDescription: 'Transaction hash string (0x-prefixed hex) from Aztec devnet. (Optional quest)',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  // ============================================================================
  // Tier 3 Puzzles
  // ============================================================================
  
  'aztec_private_state_identify': {
    questId: 'aztec_private_state_identify',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("aztec_private_state_identify")
    tier: 3,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'multiple_choice' as PuzzleType,
    name: 'WhichIsPrivate',
    prompt: 'In an Aztec contract, which of the following should be stored as private state?\nA) User\'s skill level\nB) Contract\'s total supply\nC) Public event logs\nD) Contract owner address',
    expectedAnswerDescription: 'Integer index (0-3) representing selected option. Correct answer is 0.',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'aztec_privacy_analysis': {
    questId: 'aztec_privacy_analysis',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("aztec_privacy_analysis")
    tier: 3,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'puzzle_logic' as PuzzleType,
    name: 'PrivacyLeak',
    prompt: 'Consider this Aztec function:\n```noir\n#[private]\nfn update_balance(owner: AztecAddress, new_balance: u64) {\n    storage.balances.at(owner).set(new_balance, owner);\n}\n```\nWhat information is leaked if this function is called?\nA) The new balance value\nB) The owner\'s address\nC) Both A and B\nD) Nothing is leaked',
    expectedAnswerDescription: 'Integer index (0-3) representing selected option. Correct answer is 1 (owner address is public input, balance is private).',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'aztec_note_management': {
    questId: 'aztec_note_management',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("aztec_note_management")
    tier: 3,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'structured_text' as PuzzleType,
    name: 'StateUpdateCorrectness',
    prompt: 'Write the correct Aztec.nr code to create a private note with a skill level:\n```noir\nstruct SkillNote {\n    skill_hash: Field,\n    level: u8,\n}\n```\nProvide the code to create and store this note.',
    expectedAnswerDescription: 'String containing Aztec.nr code (e.g., "Note::new(SkillNote { skill_hash: hash, level: 5 })" or equivalent)',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'first_private_tx': {
    questId: 'first_private_tx',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("first_private_tx")
    tier: 3,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'devnet_tx' as PuzzleType,
    name: 'FirstPrivateTx',
    prompt: 'Send a private transaction to an Aztec contract that updates your private skill level.\nSubmit the transaction hash.',
    expectedAnswerDescription: 'Transaction hash string (0x-prefixed hex) from Aztec devnet.',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'aztec_vault_update': {
    questId: 'aztec_vault_update',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("aztec_vault_update")
    tier: 3,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'puzzle_logic' as PuzzleType,
    name: 'VaultModification',
    prompt: 'Explain in 1-2 sentences: How do you update an existing private note in Aztec?\n(Hint: Think about nullifiers and new note creation)',
    expectedAnswerDescription: 'Free-form text (1-2 sentences). Should contain key concepts: "nullifier", "spend", "new note", "create", or equivalent concepts about note immutability.',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  // ============================================================================
  // Tier 4 Puzzles
  // ============================================================================
  
  'zk_identity_design': {
    questId: 'zk_identity_design',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("zk_identity_design")
    tier: 4,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'puzzle_logic' as PuzzleType,
    name: 'MinimalIdentityProof',
    prompt: 'Design a minimal ZK proof that proves you have a skill level >= 5 without revealing the exact level.\nWhat should be the public inputs?\nA) skill_hash, min_level\nB) skill_hash, exact_level\nC) user_address, skill_hash, min_level\nD) user_address, skill_hash, exact_level',
    expectedAnswerDescription: 'Integer index (0-3) representing selected option. Correct answer is 2 (user_address for verification, skill_hash for identification, min_level for threshold, but NOT exact_level).',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'zk_public_outputs': {
    questId: 'zk_public_outputs',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("zk_public_outputs")
    tier: 4,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'structured_text' as PuzzleType,
    name: 'IdentifyPublicOutputs',
    prompt: 'For a tier proof function `prove_aztec_builder_tier(min_tier, min_average_score)`, list the public outputs that should be emitted for L1 verification.\nProvide a comma-separated list.',
    expectedAnswerDescription: 'String (e.g., "user_address, min_tier, min_average_score, path_hash"). Should contain: user_address (or equivalent), min_tier, min_average_score, path_hash (or category identifier).',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'zk_threshold_proof': {
    questId: 'zk_threshold_proof',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("zk_threshold_proof")
    tier: 4,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'puzzle_logic' as PuzzleType,
    name: 'ZKThresholdDesign',
    prompt: 'In the `prove_aztec_builder_tier` circuit, how should the average score be calculated?\nA) Average of all quest scores (including failed ones)\nB) Average of only quests that passed the threshold\nC) Average of all quests in completed tiers\nD) Maximum score among all quests',
    expectedAnswerDescription: 'Integer index (0-3) representing selected option. Correct answer is 2 (average of quests in completed tiers, as tier completion requires passing threshold).',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
  
  'identity_architect_scenario': {
    questId: 'identity_architect_scenario',
    questIdHash: '0xPLACEHOLDER' as const, // TODO: Compute hash("identity_architect_scenario")
    tier: 4,
    category: AZTEC_BUILDER_CATEGORY,
    type: 'devnet_tx' as PuzzleType,
    name: 'TierProofPublishing',
    prompt: 'Generate a tier proof for Tier 3 with min_average_score 70, then submit it to the public SkillLeaderboard contract.\nSubmit the L1 transaction hash.',
    expectedAnswerDescription: 'Transaction hash string (0x-prefixed hex) on L1 (Ethereum/Sepolia). Should be a successful transaction calling `submitSkillTierWithProof` (or equivalent) on SkillLeaderboard contract.',
    dependencies: [],
    validate: (_submission: QuestSubmission): ValidationResult => {
      throw new Error('Quest validation not implemented yet.');
    },
  },
};

/**
 * Get quest definition by ID
 * @param questId The quest identifier
 * @returns The quest definition, or undefined if not found
 */
export function getQuestDefinition(questId: QuestId): QuestDefinition | undefined {
  return questRegistry[questId];
}

/**
 * List all quests for a specific tier
 * @param tier The tier number
 * @returns Array of quest definitions for that tier
 */
export function listQuestsByTier(tier: TierNumber): QuestDefinition[] {
  return Object.values(questRegistry).filter(quest => quest.tier === tier);
}

/**
 * List all quests in the registry
 * @returns Array of all quest definitions
 */
export function listAllQuests(): QuestDefinition[] {
  return Object.values(questRegistry);
}

// ============================================================================
// Developer Notes
// ============================================================================

/**
 * CANONICAL SPECIFICATION
 * 
 * The curriculum document `/docs/aztecbat_curriculum.md` is the canonical
 * specification for all quest definitions, tier requirements, and validation
 * logic. This registry must stay in sync with that document.
 * 
 * WORKFLOW FOR CHANGES:
 * 
 * 1. Any new quests or tier changes must FIRST be added to the curriculum
 *    document at `/docs/aztecbat_curriculum.md`.
 * 
 * 2. Then update this registry to reflect those changes:
 *    - Add new quest entries to `questRegistry`
 *    - Update tier mappings in `mapping.ts` if needed
 *    - Update quest metadata (name, prompt, type, etc.)
 * 
 * 3. Update the Noir circuit if quest IDs or tier logic changes
 * 
 * VALIDATION FUNCTION IMPLEMENTATION
 * 
 * The `validate` functions in each quest definition are currently placeholders
 * that throw errors. They will be implemented later with the following approach:
 * 
 * 1. **Logic/Syntax Puzzles** (multiple_choice, numeric_input, structured_text, puzzle_logic):
 *    - Run local JavaScript validation checks
 *    - Parse submissions based on puzzle type
 *    - Apply validation logic as specified in the curriculum
 *    - Return ValidationResult with success, score (0-100), and feedback
 * 
 * 2. **Devnet Transaction Puzzles** (devnet_tx):
 *    - Call Aztec devnet RPC or backend services to verify transaction
 *    - Query transaction receipt and verify success
 *    - Optionally verify contract code or state changes
 *    - Return ValidationResult based on transaction verification
 * 
 * 3. **Integration with Aztec QuestNote Flow**:
 *    - Once validated, quest completions are stored in the user's Aztec vault
 *    - The QuestNote struct (defined in the Noir contract) stores:
 *      - quest_id_hash: hash of the quest ID
 *      - category_hash: hash of the category ("aztec_builder")
 *      - score: completion score (0-100)
 *      - timestamp: Unix epoch timestamp
 *    - These QuestNotes are used by the tier proof circuit to verify
 *      tier completion and calculate average scores
 */
