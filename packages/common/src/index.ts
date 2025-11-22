// ============================================================================
// Core Types & Utilities
// ============================================================================

// Re-export types and utilities from core-logic
export type { SkillNode, AztecBuilderTierProofInputs } from '@hidden-garden/core-logic';
export { normalizeSkillId } from '@hidden-garden/core-logic';

// Export skill tree types (from web branch - may overlap with types.ts)
// Note: skillTree.ts and types.ts both export SkillNode - we prioritize types.ts
export type { SkillNode as SkillTreeNode } from '@hidden-garden/core-logic';

// ============================================================================
// Contract Integration (from chain branch)
// ============================================================================

// Re-export contract addresses and ABIs from core-logic
export type { Address, SupportedChainId } from '@hidden-garden/core-logic';
export {
  CHAINS,
  SELF_HUMAN_SBT_ADDRESS,
  SKILL_LEADERBOARD_ADDRESS,
  SelfHumanSBTAbi,
  SkillLeaderboardAbi,
  getSelfHumanSBTAddress,
  getSkillLeaderboardAddress,
} from '@hidden-garden/core-logic';

// ============================================================================
// Leaderboard Client (from chain branch)
// ============================================================================

// Re-export leaderboard client from core-logic
export type { SkillHash, LeaderboardEntry, UserSkill, LeaderboardClientConfig } from '@hidden-garden/core-logic';
export { LeaderboardClient, getAztecBuilderLeaderboard } from '@hidden-garden/core-logic';

// ============================================================================
// Skill Utilities (from chain branch)
// ============================================================================

// Re-export skill utilities from core-logic
export { hashSkillName } from '@hidden-garden/core-logic';

// ============================================================================
// Quest System (from chain branch)
// ============================================================================

// Re-export quest logic interface layer from core-logic
export * from '@hidden-garden/core-logic';

// ============================================================================
// API & ENS Integration (from web branch)
// ============================================================================

// Export ENS utilities from core-logic
export { shortenAddress, getEnsName } from '@hidden-garden/core-logic';
export type { EnsPublicClient } from '@hidden-garden/core-logic';

// Export API types from core-logic
export type { UserIdentity, PublicSkillTier, UserPublicSkill, LeaderboardAPI } from '@hidden-garden/core-logic';
export * from '@hidden-garden/core-logic';

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
  user: import('@hidden-garden/core-logic').UserIdentity;
  skillTiers: SkillTier[]; // All skill tiers this user has achieved
};

// Leaderboard entry for a specific skill
export type SkillLeaderboardEntry = {
  rank: number; // Position in leaderboard (1-indexed)
  user: import('@hidden-garden/core-logic').UserIdentity;
  tier: number; // Highest tier achieved for this skill
  achievedAt: number; // Timestamp when this tier was achieved
};

// Skill leaderboard
export type SkillLeaderboard = {
  skillId: string; // The skill this leaderboard is for
  entries: SkillLeaderboardEntry[]; // Sorted by rank (highest tier first, then by achievedAt)
  totalParticipants: number; // Total number of users who have this skill
};
