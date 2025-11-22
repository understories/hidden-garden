import type { UserIdentity } from './api';

// ============================================================================
// Core Types & Utilities
// ============================================================================

// Re-export types and utilities (from chain branch)
export type { SkillNode, AztecBuilderTierProofInputs } from './types';
export { normalizeSkillId } from './utils';

// Export skill tree types (from web branch - may overlap with types.ts)
// Note: skillTree.ts and types.ts both export SkillNode - we prioritize types.ts
export type { SkillNode as SkillTreeNode } from './skillTree';

// ============================================================================
// Contract Integration (from chain branch)
// ============================================================================

// Re-export contract addresses and ABIs
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
// Leaderboard Client (from chain branch)
// ============================================================================

// Re-export leaderboard client
export type { SkillHash, LeaderboardEntry, UserSkill, LeaderboardClientConfig } from './leaderboardClient';
export { LeaderboardClient, getAztecBuilderLeaderboard } from './leaderboardClient';

// ============================================================================
// Skill Utilities (from chain branch)
// ============================================================================

// Re-export skill utilities
export { hashSkillName } from './skills';

// ============================================================================
// Quest System (from chain branch)
// ============================================================================

// Re-export quest logic interface layer
export * from './quests';

// ============================================================================
// API & ENS Integration (from web branch)
// ============================================================================

// Export ENS utilities
export { shortenAddress, getEnsName } from './ens';
export type { EnsPublicClient } from './ens';

// Export API types
export * from './api';
export type { UserIdentity, PublicSkillTier, UserPublicSkill, LeaderboardAPI } from './api';

// ============================================================================
// Web Branch Custom Types (from web branch)
// ============================================================================

// Public skill tier
export type SkillTier = {
  skillId: string; // Normalized skill identifier
  tier: number; // Tier level (e.g., 1, 2, 3, etc.)
  achievedAt: number; // Timestamp when tier was achieved
};

// User public skills
export type UserPublicSkills = {
  user: UserIdentity;
  skillTiers: SkillTier[]; // All skill tiers this user has achieved
};

// Leaderboard entry for a specific skill
export type SkillLeaderboardEntry = {
  rank: number; // Position in leaderboard (1-indexed)
  user: UserIdentity;
  tier: number; // Highest tier achieved for this skill
  achievedAt: number; // Timestamp when this tier was achieved
};

// Skill leaderboard
export type SkillLeaderboard = {
  skillId: string; // The skill this leaderboard is for
  entries: SkillLeaderboardEntry[]; // Sorted by rank (highest tier first, then by achievedAt)
  totalParticipants: number; // Total number of users who have this skill
};
