// ============================================================================
// Game Engine Package - Main Entry Point
// ============================================================================
// This package provides game orchestration, quest registry, and validators
// Shared between Team A (core correctness) and Team B (extensions)

// Re-export quest registry and helper functions
export {
  questRegistry,
  getQuestDefinition,
  listQuestsByTier,
  listAllQuests,
} from './registry';

// Re-export quest types from core-logic for convenience
export type {
  QuestId,
  QuestDefinition,
  QuestSubmission,
  ValidationResult,
  TierNumber,
  PuzzleType,
} from '@hidden-garden/core-logic';
