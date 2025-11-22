/**
 * Quest Mapping
 * 
 * Mappings from quest IDs to tiers, categories, and other metadata.
 * These mappings are derived from the curriculum specification and must
 * match the hardcoded values in the Noir circuit.
 */

import type { QuestId, TierNumber, CategoryId, QuestIdHash } from './types';
import { hashSkillName } from '../skills';

/**
 * Category for all AztecBat puzzles
 */
export const AZTEC_BUILDER_CATEGORY: CategoryId = 'aztec_builder';

/**
 * Category hash (computed from category string)
 * This matches the category_hash used in QuestNote storage
 */
export const AZTEC_BUILDER_CATEGORY_HASH: QuestIdHash = hashSkillName(AZTEC_BUILDER_CATEGORY) as QuestIdHash;

/**
 * Path hash for Aztec Builder pathway
 * Used in tier proof public outputs and leaderboard queries
 */
export const AZTEC_BUILDER_PATH_HASH: QuestIdHash = hashSkillName('aztec_builder_path') as QuestIdHash;

/**
 * Quest ID to Tier mapping
 * Maps each quest ID to its tier number
 * This must match the tier assignments in the curriculum
 */
export const QUEST_TIER_MAP: Record<QuestId, TierNumber> = {
  // Tier 1
  'aztec_concept_quiz': 1,
  'aztec_privacy_basics': 1,
  'aztec_notes_concept': 1,
  'aztec_public_vs_private': 1,
  'aztec_protocol_overview': 1, // Optional
  
  // Tier 2
  'noir_basic_puzzle': 2,
  'noir_constraint_basics': 2,
  'noir_public_private': 2,
  'noir_hash_function': 2,
  'noir_first_circuit': 2, // Optional
  
  // Tier 3
  'aztec_private_state_identify': 3,
  'aztec_privacy_analysis': 3,
  'aztec_note_management': 3,
  'first_private_tx': 3,
  'aztec_vault_update': 3, // Optional
  
  // Tier 4
  'zk_identity_design': 4,
  'zk_public_outputs': 4,
  'zk_threshold_proof': 4,
  'identity_architect_scenario': 4,
} as const;

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
 * Tier 1 quest ID hash (for Noir circuit)
 * This is the quest required for Tier 1 completion
 */
export const TIER_1_QUEST_ID = 'aztec_concept_quiz' as const;

/**
 * Tier 2 quest ID hash (for Noir circuit)
 * This is the quest required for Tier 2 completion
 */
export const TIER_2_QUEST_ID = 'noir_basic_puzzle' as const;

/**
 * Tier 3 quest ID hash (for Noir circuit)
 * This is the quest required for Tier 3 completion
 */
export const TIER_3_QUEST_ID = 'first_private_tx' as const;

/**
 * Tier 4 quest ID hash (for Noir circuit)
 * This is the quest required for Tier 4 completion
 */
export const TIER_4_QUEST_ID = 'identity_architect_scenario' as const;

/**
 * Get tier for a quest ID
 */
export function getQuestTier(questId: QuestId): TierNumber | undefined {
  return QUEST_TIER_MAP[questId];
}

/**
 * Get all quest IDs for a tier
 */
export function getTierQuests(tier: TierNumber): QuestId[] {
  return TIER_QUEST_MAP[tier] || [];
}

/**
 * Get required quest IDs for a tier (excluding optional)
 */
export function getTierRequiredQuests(tier: TierNumber): QuestId[] {
  return TIER_REQUIRED_QUESTS[tier] || [];
}

/**
 * Check if a quest ID is optional
 */
export function isQuestOptional(questId: QuestId): boolean {
  const tier = getQuestTier(questId);
  if (!tier) return false;
  
  const required = getTierRequiredQuests(tier);
  return !required.includes(questId);
}

/**
 * Get category for a quest ID
 * All AztecBat puzzles use the same category
 */
export function getQuestCategory(questId: QuestId): CategoryId {
  return AZTEC_BUILDER_CATEGORY;
}

