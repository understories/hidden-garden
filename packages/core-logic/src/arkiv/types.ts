/**
 * Arkiv Types - Public Profile Snapshot Payload
 * 
 * Defines the data structure for public skill profile snapshots stored in Arkiv.
 * This is intentionally "public only" – no private quest details.
 */

// Public profile snapshot stored in Arkiv.
// This is intentionally "public only" – no private quest details.
export interface ArkivSkillProfilePayload {
  address: string;          // user wallet
  chainId: number;          // L1 chain where SBT / leaderboard live

  // Identity / participation mode
  humanVerified: boolean;   // has Self SBT?
  allowAgents: boolean;     // if false -> "humans only", if true -> "humans + agents"

  // Aztec builder state (from your existing skill profile)
  aztecBuilderTier: number | null;
  aztecBuilderSkillHash: string | null;

  // Optional badges for "white-hat" leaderboard flavor
  externalBadges: {
    id: string;
    label: string;
    source: string; // 'hackathon', 'ctf', 'other', etc.
  }[];

  lastUpdated: number;      // unix ms timestamp
}

