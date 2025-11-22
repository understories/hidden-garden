// Basic identity for any on-chain user we show in the UI.
export type UserIdentity = {
  address: `0x${string}`;
  ensName?: string | null;
  // Optional field for UI convenience (e.g. "alice.eth" or shortened address)
  displayName?: string | null;
};

// A single public skill tier for a user.
export type PublicSkillTier = {
  userAddress: `0x${string}`;
  ensName?: string | null;

  // Human-readable name, e.g. "rust"
  skillName?: string;

  // Canonical skill identifier we will use on-chain later.
  skillHash?: `0x${string}`;

  tier: number;          // e.g. 1–5
  updatedAt: string;     // ISO timestamp
};

// Alias: from the user's perspective, this is "one of my public skills".
export type UserPublicSkill = PublicSkillTier;

// Shape of the indexer API that Team A will implement and Team B will consume.
export interface LeaderboardAPI {
  /**
   * Get the leaderboard for a skill by canonical skill ID or name.
   * For now, we will accept a string; in the future, this may be a hash.
   */
  getLeaderboard(skillId: string): Promise<PublicSkillTier[]>;

  /**
   * Get all public skills that a given user has revealed.
   */
  getUserSkills(address: `0x${string}`): Promise<UserPublicSkill[]>;
}

// API Response types

// Get user public skills response
export type GetUserPublicSkillsResponse = {
  user: UserIdentity;
  skillTiers: Array<{
    skillId: string;
    tier: number;
    achievedAt: number;
  }>;
};

// Get skill leaderboard response
export type GetSkillLeaderboardResponse = {
  skillId: string;
  entries: Array<{
    rank: number;
    user: UserIdentity;
    tier: number;
    achievedAt: number;
  }>;
  totalParticipants: number;
};

// Get user skill tier response
export type GetUserSkillTierResponse = {
  user: UserIdentity;
  skillTier: {
    skillId: string;
    tier: number;
    achievedAt: number;
  } | null; // null if user doesn't have this skill
};

// List all skills response
export type ListSkillsResponse = {
  skills: Array<{
    id: string;
    name: string;
    totalParticipants: number;
  }>;
};

// Get user leaderboard position response
export type GetUserLeaderboardPositionResponse = {
  skillId: string;
  user: UserIdentity;
  entry: {
    rank: number;
    user: UserIdentity;
    tier: number;
    achievedAt: number;
  } | null; // null if user is not on leaderboard
};

// API Request types

// Get user public skills request
export type GetUserPublicSkillsRequest = {
  address: string; // User's Ethereum address
};

// Get skill leaderboard request
export type GetSkillLeaderboardRequest = {
  skillId: string;
  limit?: number; // Optional limit on number of entries to return
  offset?: number; // Optional offset for pagination
};

// Get user skill tier request
export type GetUserSkillTierRequest = {
  address: string; // User's Ethereum address
  skillId: string;
};

// Get user leaderboard position request
export type GetUserLeaderboardPositionRequest = {
  address: string; // User's Ethereum address
  skillId: string;
};

