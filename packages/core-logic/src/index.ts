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
} from './contracts';

// ============================================================================
// Leaderboard Client
// ============================================================================
export type { SkillHash, LeaderboardEntry, UserSkill, LeaderboardClientConfig } from './leaderboardClient';
export { LeaderboardClient, getAztecBuilderLeaderboard } from './leaderboardClient';

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
export {
  AztecClient,
  RealAztecClient,
  MockAztecClient,
  createAztecClient,
  type AztecClientMode,
  type AztecClientConfig,
  type ZKProof,
  type QuestCompletionResult,
  type TierProofResult,
  type AztecAddress,
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
