export type SkillNode = {
  id: string;
  name: string;
  level: number;
  xp: number;
  children?: SkillNode[];
};

export interface AztecBuilderTierProofInputs {
  minTier: number;
  minAverageScore: number;
  proof: `0x${string}`;
  publicInputs: `0x${string}`;
}

/**
 * External badge from third-party sources (POAP, SBT, GitHub, etc.)
 */
export type ExternalBadge = {
  id: string;
  label: string;
  source: 'poap' | 'sbt' | 'github' | 'other';
  chainId?: number;
  contract?: string;
  tokenId?: string;
  url?: string;
};

/**
 * Quest summary for private progress display
 * Represents app-level quest completion data (mirrors what's stored privately in Aztec)
 */
export type QuestSummary = {
  id: string;
  title: string;
  score: number | null;
  status: 'completed' | 'not_started';
};

/**
 * Complete skill profile for a user
 * Aggregates data from SelfHumanSBT, Aztec tier proofs, quest completions, and external badges
 */
export type SkillProfile = {
  address: string;
  humanVerified: boolean;
  aztecBuilderTier: number | null;
  aztecBuilderSkillHash: string | null;
  aztecAverageScore?: number | null;
  questsCompleted?: number | null;
  questSummaries: QuestSummary[]; // App-level quest completion data (mirrors Aztec private storage)
  externalBadges: ExternalBadge[];
  allowAgents: boolean;
};

