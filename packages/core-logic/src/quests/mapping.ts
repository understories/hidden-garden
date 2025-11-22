/**
 * Quest Mapping
 * 
 * Mappings from quest IDs to tiers, categories, and other metadata.
 * These mappings are derived from the curriculum specification and must
 * match the hardcoded values in the Noir circuit.
 * 
 * Based on `/docs/aztecbat_curriculum.md`
 */

import type { QuestId, TierNumber, CategoryId, QuestIdHash } from './types';

/**
 * Category for all AztecBat puzzles
 */
export const AZTEC_BUILDER_CATEGORY: CategoryId = 'aztec_builder';

import { computeCategoryHash, computePathHash } from './hashing';

/**
 * Category hash (computed from category string)
 * This matches the category_hash used in QuestNote storage
 * Computed as: pedersen_hash(bytes("aztec_builder")) - matches Noir circuit
 */
export const AZTEC_BUILDER_CATEGORY_HASH: QuestIdHash = computeCategoryHash(AZTEC_BUILDER_CATEGORY);

/**
 * Path hash for Aztec Builder pathway
 * Used in tier proof public outputs and leaderboard queries
 * This identifies the "aztec_builder_path" learning pathway
 * 
 * Computed as: pedersen_hash(bytes("aztec_builder_path")) - matches Noir circuit
 */
export const PATH_HASH: QuestIdHash = computePathHash('aztec_builder_path');

/**
 * Quest ID to Tier mapping
 * Maps each quest ID to its tier number
 * This must match the tier assignments in the curriculum
 * 
 * Quest names from curriculum:
 * Tier 1: SumTo7, SmallSquare, FixThisCircuit, WhichAssertionFails, NoirSyntaxBug (optional)
 * Tier 2: NoirInputPuzzle, RangeCheckFix, PrivatePubSplit, TinyHashCircuit, NoirFirstCircuit (optional)
 * Tier 3: WhichIsPrivate, PrivacyLeak, StateUpdateCorrectness, FirstPrivateTx, VaultModification (optional)
 * Tier 4: MinimalIdentityProof, IdentifyPublicOutputs, ZKThresholdDesign, TierProofPublishing
 */
export const QUEST_TIER_MAP: Record<QuestId, TierNumber> = {
  // Tier 1 Puzzles
  'aztec_concept_quiz': 1,           // SumTo7
  'aztec_privacy_basics': 1,          // SmallSquare
  'aztec_notes_concept': 1,            // FixThisCircuit
  'aztec_public_vs_private': 1,       // WhichAssertionFails
  'aztec_protocol_overview': 1,       // NoirSyntaxBug (optional)
  
  // Tier 2 Puzzles
  'noir_basic_puzzle': 2,              // NoirInputPuzzle
  'noir_constraint_basics': 2,        // RangeCheckFix
  'noir_public_private': 2,           // PrivatePubSplit
  'noir_hash_function': 2,            // TinyHashCircuit
  'noir_first_circuit': 2,            // NoirFirstCircuit (optional)
  
  // Tier 3 Puzzles
  'aztec_private_state_identify': 3,  // WhichIsPrivate
  'aztec_privacy_analysis': 3,        // PrivacyLeak
  'aztec_note_management': 3,         // StateUpdateCorrectness
  'first_private_tx': 3,               // FirstPrivateTx
  'aztec_vault_update': 3,            // VaultModification (optional)
  
  // Tier 4 Puzzles
  'zk_identity_design': 4,            // MinimalIdentityProof
  'zk_public_outputs': 4,             // IdentifyPublicOutputs
  'zk_threshold_proof': 4,            // ZKThresholdDesign
  'identity_architect_scenario': 4,    // TierProofPublishing
} as const;

/**
 * Quest ID to Category mapping
 * All AztecBat puzzles use the same category
 */
export const QUEST_CATEGORY_MAP: Record<QuestId, CategoryId> = Object.keys(QUEST_TIER_MAP).reduce(
  (acc, questId) => {
    acc[questId as QuestId] = AZTEC_BUILDER_CATEGORY;
    return acc;
  },
  {} as Record<QuestId, CategoryId>
);

/**
 * Tier to Quest IDs mapping
 * Maps each tier to the quest IDs required for that tier
 * Used for tier calculation and validation
 */
export const TIER_QUEST_MAP: Record<TierNumber, QuestId[]> = {
  1: [
    'aztec_concept_quiz',
    'aztec_privacy_basics',
    'aztec_notes_concept',
    'aztec_public_vs_private',
    'aztec_protocol_overview', // Optional
  ],
  2: [
    'noir_basic_puzzle',
    'noir_constraint_basics',
    'noir_public_private',
    'noir_hash_function',
    'noir_first_circuit', // Optional
  ],
  3: [
    'aztec_private_state_identify',
    'aztec_privacy_analysis',
    'aztec_note_management',
    'first_private_tx',
    'aztec_vault_update', // Optional
  ],
  4: [
    'zk_identity_design',
    'zk_public_outputs',
    'zk_threshold_proof',
    'identity_architect_scenario',
  ],
} as const;

/**
 * Required quests per tier (excluding optional)
 * These are the minimum quests needed to achieve each tier
 */
export const TIER_REQUIRED_QUESTS: Record<TierNumber, QuestId[]> = {
  1: [
    'aztec_concept_quiz',
    'aztec_privacy_basics',
    'aztec_notes_concept',
    'aztec_public_vs_private',
  ],
  2: [
    'noir_basic_puzzle',
    'noir_constraint_basics',
    'noir_public_private',
    'noir_hash_function',
  ],
  3: [
    'aztec_private_state_identify',
    'aztec_privacy_analysis',
    'aztec_note_management',
    'first_private_tx',
  ],
  4: [
    'zk_identity_design',
    'zk_public_outputs',
    'zk_threshold_proof',
    'identity_architect_scenario',
  ],
} as const;

/**
 * Tier 1 quest ID (for Noir circuit)
 * This is the quest required for Tier 1 completion
 */
export const TIER_1_QUEST_ID: QuestId = 'aztec_concept_quiz';

/**
 * Tier 2 quest ID (for Noir circuit)
 * This is the quest required for Tier 2 completion
 */
export const TIER_2_QUEST_ID: QuestId = 'noir_basic_puzzle';

/**
 * Tier 3 quest ID (for Noir circuit)
 * This is the quest required for Tier 3 completion
 */
export const TIER_3_QUEST_ID: QuestId = 'first_private_tx';

/**
 * Tier 4 quest ID (for Noir circuit)
 * This is the quest required for Tier 4 completion
 */
export const TIER_4_QUEST_ID: QuestId = 'identity_architect_scenario';

/**
 * Get tier for a quest ID
 * @param questId The quest identifier
 * @returns The tier number, or undefined if quest not found
 */
export function getTierForQuest(questId: QuestId): TierNumber | undefined {
  return QUEST_TIER_MAP[questId];
}

/**
 * Get all quest IDs for a tier
 * @param tier The tier number
 * @returns Array of quest IDs for that tier
 */
export function getQuestsForTier(tier: TierNumber): QuestId[] {
  return TIER_QUEST_MAP[tier] || [];
}

/**
 * Get all quest IDs across all tiers
 * @returns Array of all quest IDs
 */
export function getAllQuestIds(): QuestId[] {
  return Object.keys(QUEST_TIER_MAP) as QuestId[];
}

/**
 * Get category for a quest ID
 * All AztecBat puzzles use the same category
 * @param questId The quest identifier
 * @returns The category identifier
 */
export function getQuestCategory(questId: QuestId): CategoryId {
  return QUEST_CATEGORY_MAP[questId] || AZTEC_BUILDER_CATEGORY;
}

/**
 * Get required quest IDs for a tier (excluding optional)
 * @param tier The tier number
 * @returns Array of required quest IDs for that tier
 */
export function getTierRequiredQuests(tier: TierNumber): QuestId[] {
  return TIER_REQUIRED_QUESTS[tier] || [];
}

/**
 * Check if a quest ID is optional
 * @param questId The quest identifier
 * @returns True if the quest is optional, false if required
 */
export function isQuestOptional(questId: QuestId): boolean {
  const tier = getTierForQuest(questId);
  if (!tier) return false;
  
  const required = getTierRequiredQuests(tier);
  return !required.includes(questId);
}

// Legacy exports for backward compatibility
export const getQuestTier = getTierForQuest;
export const getTierQuests = getQuestsForTier;
