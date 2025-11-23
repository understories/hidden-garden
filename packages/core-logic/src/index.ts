// ============================================================================
// Core Logic Package - Main Entry Point
// ============================================================================
// This package provides the core logic interfaces, types, and utilities
// for Team A's work (Aztec/Noir circuits, quest logic, contract integration)

// ============================================================================
// Core Types & Utilities
// ============================================================================
export type { SkillNode, AztecBuilderTierProofInputs } from './types';
export { normalizeSkillId } from './utils';
export type { SkillNode as SkillTreeNode } from './skillTree';

// ============================================================================
// Contract Integration
// ============================================================================
export type { Address, SupportedChainId } from './contracts';
export {
  CHAINS,
  SELF_HUMAN_SBT_ADDRESS,
  SKILL_LEADERBOARD_ADDRESS,
  SelfHumanSBTAbi,
  SkillLeaderboardAbi,
  getSelfHumanSBTAddress,
  getSkillLeaderboardAddress,
  getExplorerTxUrl,
} from './contracts';

// ============================================================================
// Tier Publisher (Self-Gated Tier Publishing)
// ============================================================================
export {
  submitTierProofWithSBTCheck,
  encodeTierProofPublicInputs,
  checkSelfHumanSBT,
} from './tierPublisher';
export type {
  SubmitTierProofParams,
  SubmitTierProofResult,
} from './tierPublisher';

// ============================================================================
// Leaderboard Client
// ============================================================================
export type { SkillHash, LeaderboardEntry, UserSkill, LeaderboardClientConfig } from './leaderboardClient';
export {
  LeaderboardClient,
  MockLeaderboardClient,
  getAztecBuilderLeaderboard,
  checkIndexerReachable,
} from './leaderboardClient';

// ============================================================================
// Skill Utilities
// ============================================================================
export { hashSkillName } from './skills';

// ============================================================================
// Quest System - Types & Mapping
// ============================================================================
export * from './quests/types';
export * from './quests/mapping';
export * from './quests/hashing';

// ============================================================================
// Aztec Client Interface
// ============================================================================
export type {
  AztecClient,
  AztecClientMode,
  AztecClientConfig,
  ZKProof,
  QuestCompletionResult,
  TierProofResult,
  AztecAddress,
} from './aztecClient';
export {
  RealAztecClient,
  MockAztecClient,
  createAztecClient,
} from './aztecClient';

// ============================================================================
// API & ENS Integration
// ============================================================================
export { shortenAddress, getEnsName } from './ens';
export type { EnsPublicClient } from './ens';

// Export API types
export * from './api';
export type { UserIdentity, PublicSkillTier, UserPublicSkill, LeaderboardAPI } from './api';

// Import UserIdentity for use in custom types below
import type { UserIdentity } from './api';

// ============================================================================
// Skill Profile
// ============================================================================
export type { SkillProfile, ExternalBadge, QuestSummary } from './types';
export { getSkillProfile } from './skillProfile';
export type { PublicSkillProfile } from './publicProfile';
export { getPublicSkillProfile } from './publicProfile';

// ============================================================================
// Leaderboard Orchestrator
// ============================================================================
export type { PublishAndFetchParams, PublishAndFetchResult } from './leaderboardOrchestrator';
export { publishAndFetchAztecBuilderLeaderboard } from './leaderboardOrchestrator';

// ============================================================================
// Custom Types (for UI compatibility)
// ============================================================================
export type SkillTier = {
  skillId: string;
  tier: number;
  achievedAt: number;
};

export type UserPublicSkills = {
  user: UserIdentity;
  skillTiers: SkillTier[];
};

export type SkillLeaderboardEntry = {
  rank: number;
  user: UserIdentity;
  tier: number;
  achievedAt: number;
};

export type SkillLeaderboard = {
  skillId: string;
  entries: SkillLeaderboardEntry[];
  totalParticipants: number;
};

// ============================================================================
// Arkiv Integration
// ============================================================================
// Arkiv exports
export * from './arkiv/types';
export {
  upsertArkivSkillProfile,
  getArkivSkillProfile,
  listArkivSkillProfiles,
} from './arkiv/skillProfiles';
