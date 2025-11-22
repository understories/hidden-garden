/**
 * Quest Logic Interface Layer
 * 
 * Re-exports for the quest system types, mappings, and registry.
 * This module provides a clean interface for frontend, backend, and
 * circuit code generation to interact with the AztecBat learning pathway.
 */

// Types
export type {
  // Base types
  QuestId,
  QuestIdHash,
  TierNumber,
  CategoryId,
  CategoryHash,
  // Puzzle types
  PuzzleType,
  QuestScore,
  ValidationResult,
  QuestSubmission,
  MultipleChoiceSubmission,
  NumericInputSubmission,
  StructuredTextSubmission,
  DevnetTxSubmission,
  PuzzleLogicSubmission,
  // Puzzle definitions
  PuzzleMetadata,
  QuestDefinition,
  PuzzleDefinition, // Legacy alias for QuestDefinition
  // Quest completion
  QuestNoteModel,
  QuestCompletion,
  TierRequirements,
  TierProofInputs,
  QuestRegistryEntry,
  // Legacy aliases (for backward compatibility)
  Tier,
  QuestCategory,
} from './types';

// Mappings
export {
  AZTEC_BUILDER_CATEGORY,
  AZTEC_BUILDER_CATEGORY_HASH,
  AZTEC_BUILDER_PATH_HASH,
  QUEST_TIER_MAP,
  TIER_QUEST_MAP,
  TIER_REQUIRED_QUESTS,
  TIER_1_QUEST_ID,
  TIER_2_QUEST_ID,
  TIER_3_QUEST_ID,
  TIER_4_QUEST_ID,
  getQuestTier,
  getTierQuests,
  getTierRequiredQuests,
  isQuestOptional,
  getQuestCategory,
} from './mapping';

// Registry
export {
  getQuestMetadata,
  getTierMetadata,
  getAllQuestMetadata,
  getQuestRegistryEntry,
  registerQuest,
  getQuest,
  isQuestRegistered,
  getAllRegisteredQuests,
  // Legacy aliases
  registerPuzzle,
  getPuzzle,
  isPuzzleRegistered,
  getAllRegisteredPuzzles,
  isValidQuestId,
} from './registry';

