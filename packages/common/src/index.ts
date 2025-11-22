// Re-export types and utilities
export type { SkillNode, AztecBuilderTierProofInputs } from './types';
export { normalizeSkillId } from './utils';

// Re-export contract addresses and ABIs
export type { Address, SupportedChainId } from './contracts';
export {
  CHAINS,
  SELF_HUMAN_SBT_ADDRESS,
  SKILL_LEADERBOARD_ADDRESS,
  SelfHumanSBTAbi,
  SkillLeaderboardAbi,
} from './contracts';

// Re-export leaderboard client
export type { SkillHash, LeaderboardEntry, UserSkill, LeaderboardClientConfig } from './leaderboardClient';
export { LeaderboardClient, getAztecBuilderLeaderboard } from './leaderboardClient';

// Re-export skill utilities
export { hashSkillName } from './skills';
