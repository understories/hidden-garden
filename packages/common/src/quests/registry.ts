/**
 * Quest Registry
 * 
 * Central registry of all puzzles in the AztecBat learning pathway.
 * This registry loads puzzle metadata from static definitions and provides
 * a lookup interface for frontend, backend, and circuit code generation.
 * 
 * Puzzle definitions are loaded lazily - metadata is always available,
 * but validation logic may be loaded on-demand.
 */

import type {
  QuestId,
  PuzzleMetadata,
  PuzzleDefinition,
  QuestRegistryEntry,
  TierNumber,
} from './types';
import { QUEST_TIER_MAP, getQuestCategory } from './mapping';

/**
 * Quest metadata registry
 * Static metadata for all puzzles, keyed by quest ID
 * This is the source of truth for puzzle metadata
 */
const QUEST_METADATA_REGISTRY: Record<QuestId, PuzzleMetadata> = {
  // Tier 1 Puzzles
  'aztec_concept_quiz': {
    questId: 'aztec_concept_quiz',
    name: 'Aztec Concept Quiz',
    tier: 1,
    puzzleType: 'multiple_choice',
    prompt: 'What is Aztec Protocol?',
    optional: false,
  },
  'aztec_privacy_basics': {
    questId: 'aztec_privacy_basics',
    name: 'Aztec Privacy Basics',
    tier: 1,
    puzzleType: 'multiple_choice',
    prompt: 'What makes Aztec different from other Layer 2 solutions?',
    optional: false,
  },
  'aztec_notes_concept': {
    questId: 'aztec_notes_concept',
    name: 'Aztec Notes Concept',
    tier: 1,
    puzzleType: 'multiple_choice',
    prompt: 'What is a private note in Aztec?',
    optional: false,
  },
  'aztec_public_vs_private': {
    questId: 'aztec_public_vs_private',
    name: 'Public vs Private Transactions',
    tier: 1,
    puzzleType: 'multiple_choice',
    prompt: 'What is the difference between a public and private transaction in Aztec?',
    optional: false,
  },
  'aztec_protocol_overview': {
    questId: 'aztec_protocol_overview',
    name: 'Aztec Protocol Overview',
    tier: 1,
    puzzleType: 'multiple_choice',
    prompt: 'Which of the following is a privacy guarantee of Aztec?',
    optional: true,
  },
  
  // Tier 2 Puzzles
  'noir_basic_puzzle': {
    questId: 'noir_basic_puzzle',
    name: 'Noir Basic Puzzle',
    tier: 2,
    puzzleType: 'numeric_input',
    prompt: 'Complete this Noir function to return the sum of two inputs. What value does add(5, 3) return?',
    optional: false,
  },
  'noir_constraint_basics': {
    questId: 'noir_constraint_basics',
    name: 'Noir Constraint Basics',
    tier: 2,
    puzzleType: 'structured_text',
    prompt: 'Fix this Noir function to ensure the result is between 0 and 100. Provide the corrected assertion line.',
    optional: false,
  },
  'noir_public_private': {
    questId: 'noir_public_private',
    name: 'Noir Public vs Private',
    tier: 2,
    puzzleType: 'multiple_choice',
    prompt: 'In Noir, what is the difference between `pub` and non-`pub` function parameters?',
    optional: false,
  },
  'noir_hash_function': {
    questId: 'noir_hash_function',
    name: 'Noir Hash Function',
    tier: 2,
    puzzleType: 'structured_text',
    prompt: 'Write a Noir function that hashes a Field value using pedersen_hash. Provide the function body.',
    optional: false,
  },
  'noir_first_circuit': {
    questId: 'noir_first_circuit',
    name: 'Noir First Circuit',
    tier: 2,
    puzzleType: 'devnet_tx',
    prompt: 'Deploy a simple Noir circuit to Aztec devnet that proves you know a secret value x such that x * 2 == 10. Submit the transaction hash.',
    optional: true,
  },
  
  // Tier 3 Puzzles
  'aztec_private_state_identify': {
    questId: 'aztec_private_state_identify',
    name: 'Identify Private State',
    tier: 3,
    puzzleType: 'multiple_choice',
    prompt: 'In an Aztec contract, which of the following should be stored as private state?',
    optional: false,
  },
  'aztec_privacy_analysis': {
    questId: 'aztec_privacy_analysis',
    name: 'Privacy Analysis',
    tier: 3,
    puzzleType: 'puzzle_logic',
    prompt: 'What information is leaked if this Aztec function is called?',
    optional: false,
  },
  'aztec_note_management': {
    questId: 'aztec_note_management',
    name: 'Aztec Note Management',
    tier: 3,
    puzzleType: 'structured_text',
    prompt: 'Write the correct Aztec.nr code to create a private note with a skill level.',
    optional: false,
  },
  'first_private_tx': {
    questId: 'first_private_tx',
    name: 'First Private Transaction',
    tier: 3,
    puzzleType: 'devnet_tx',
    prompt: 'Send a private transaction to an Aztec contract that updates your private skill level. Submit the transaction hash.',
    optional: false,
  },
  'aztec_vault_update': {
    questId: 'aztec_vault_update',
    name: 'Vault Modification',
    tier: 3,
    puzzleType: 'puzzle_logic',
    prompt: 'Explain in 1-2 sentences: How do you update an existing private note in Aztec?',
    optional: true,
  },
  
  // Tier 4 Puzzles
  'zk_identity_design': {
    questId: 'zk_identity_design',
    name: 'Minimal Identity Proof',
    tier: 4,
    puzzleType: 'puzzle_logic',
    prompt: 'Design a minimal ZK proof that proves you have a skill level >= 5 without revealing the exact level. What should be the public inputs?',
    optional: false,
  },
  'zk_public_outputs': {
    questId: 'zk_public_outputs',
    name: 'Identify Public Outputs',
    tier: 4,
    puzzleType: 'structured_text',
    prompt: 'For a tier proof function prove_aztec_builder_tier(min_tier, min_average_score), list the public outputs that should be emitted for L1 verification.',
    optional: false,
  },
  'zk_threshold_proof': {
    questId: 'zk_threshold_proof',
    name: 'ZK Threshold Design',
    tier: 4,
    puzzleType: 'puzzle_logic',
    prompt: 'In the prove_aztec_builder_tier circuit, how should the average score be calculated?',
    optional: false,
  },
  'identity_architect_scenario': {
    questId: 'identity_architect_scenario',
    name: 'Tier Proof Publishing',
    tier: 4,
    puzzleType: 'devnet_tx',
    prompt: 'Generate a tier proof for Tier 3 with min_average_score 70, then submit it to the public SkillLeaderboard contract. Submit the L1 transaction hash.',
    optional: false,
  },
} as const;

/**
 * Quest registry
 * Maps quest IDs to registry entries
 * Puzzle definitions are loaded lazily (validation logic not included here)
 */
const QUEST_REGISTRY: Map<QuestId, QuestRegistryEntry> = new Map();

// Initialize registry with metadata
Object.values(QUEST_METADATA_REGISTRY).forEach((metadata) => {
  QUEST_REGISTRY.set(metadata.questId, {
    metadata,
    puzzle: undefined, // Will be set when puzzle is loaded
  });
});

/**
 * Get puzzle metadata by quest ID
 */
export function getQuestMetadata(questId: QuestId): PuzzleMetadata | undefined {
  return QUEST_METADATA_REGISTRY[questId];
}

/**
 * Get all quest metadata for a tier
 */
export function getTierMetadata(tier: TierNumber): PuzzleMetadata[] {
  return Object.values(QUEST_METADATA_REGISTRY).filter(
    (metadata) => metadata.tier === tier
  );
}

/**
 * Get all quest metadata
 */
export function getAllQuestMetadata(): PuzzleMetadata[] {
  return Object.values(QUEST_METADATA_REGISTRY);
}

/**
 * Get quest registry entry
 */
export function getQuestRegistryEntry(questId: QuestId): QuestRegistryEntry | undefined {
  return QUEST_REGISTRY.get(questId);
}

/**
 * Register a puzzle definition
 * This allows puzzle implementations to register their validation logic
 */
export function registerPuzzle(puzzle: PuzzleDefinition): void {
  const entry = QUEST_REGISTRY.get(puzzle.questId);
  if (!entry) {
    throw new Error(`Quest ${puzzle.questId} not found in registry`);
  }
  
  // Validate that puzzle matches metadata
  if (puzzle.questId !== entry.metadata.questId ||
      puzzle.tier !== entry.metadata.tier ||
      puzzle.puzzleType !== entry.metadata.puzzleType) {
    throw new Error(`Puzzle definition does not match metadata for ${puzzle.questId}`);
  }
  
  entry.puzzle = puzzle;
}

/**
 * Get puzzle definition (with validation logic)
 * Returns undefined if puzzle not yet registered
 */
export function getPuzzle(questId: QuestId): PuzzleDefinition | undefined {
  return QUEST_REGISTRY.get(questId)?.puzzle;
}

/**
 * Check if a puzzle is registered (has validation logic)
 */
export function isPuzzleRegistered(questId: QuestId): boolean {
  return QUEST_REGISTRY.get(questId)?.puzzle !== undefined;
}

/**
 * Get all registered puzzles
 */
export function getAllRegisteredPuzzles(): PuzzleDefinition[] {
  return Array.from(QUEST_REGISTRY.values())
    .map((entry) => entry.puzzle)
    .filter((puzzle): puzzle is PuzzleDefinition => puzzle !== undefined);
}

/**
 * Validate quest ID exists in registry
 */
export function isValidQuestId(questId: string): questId is QuestId {
  return questId in QUEST_METADATA_REGISTRY;
}

