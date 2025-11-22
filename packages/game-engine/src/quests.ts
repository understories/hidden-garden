/**
 * Quest Logic Interface Layer
 * 
 * Re-exports for the quest system types, mappings, and registry.
 * This module provides a clean interface for frontend, backend, and
 * circuit code generation to interact with the AztecBat learning pathway.
 * 
 * Note: Types and mappings are in core-logic, registry is in game-engine.
 */

// Re-export quest types and mappings from core-logic
export type {
  QuestId,
  QuestDefinition,
  QuestSubmission,
  ValidationResult,
  TierNumber,
  PuzzleType,
} from '@hidden-garden/core-logic';

export {
  getTierForQuest,
  getQuestsForTier,
  getAllQuestIds,
  getQuestCategory,
  getTierRequiredQuests,
  isQuestOptional,
  AZTEC_BUILDER_CATEGORY,
} from '@hidden-garden/core-logic';

// Re-export registry from this package
export * from './registry';
