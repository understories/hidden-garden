import type { UserIdentity } from './api';

// Export skill tree types
export type { SkillNode } from './skillTree';
export { normalizeSkillId } from './skillTree';

// Export API types
export * from './api';
export type { UserIdentity, PublicSkillTier, UserPublicSkill, LeaderboardAPI } from './api';

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

