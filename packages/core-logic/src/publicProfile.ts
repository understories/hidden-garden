/**
 * Public Skill Profile - Minimal Public Data View
 * 
 * Shows only publicly verifiable data (SBT status, revealed tier).
 * Contrasts with private profile which includes quest completions, scores, etc.
 */

import { ethers } from 'ethers';
import type { Address, SupportedChainId } from './contracts';
import { CHAINS } from './contracts';
import { checkSelfHumanSBT } from './tierPublisher';
import { hashSkillName } from './skills';
import { LeaderboardClient } from './leaderboardClient';

/**
 * Public skill profile (only publicly verifiable data)
 */
export type PublicSkillProfile = {
  address: string;
  humanVerified: boolean;
  aztecBuilderTier: number | null;
  aztecBuilderSkillHash: string | null;
};

/**
 * Get public skill profile for an address
 * 
 * Returns only publicly verifiable data:
 * - Human verification status (SelfHumanSBT)
 * - Revealed Aztec Builder tier (from leaderboard)
 * 
 * Does NOT include private data:
 * - Individual quest scores
 * - Quest completion list
 * - Average score
 * 
 * @param params Configuration for profile fetching
 * @returns Public skill profile
 */
export async function getPublicSkillProfile(params: {
  chainId: number;
  address: string;
  indexerBaseUrl?: string;
}): Promise<PublicSkillProfile> {
  const { chainId, address, indexerBaseUrl } = params;

  // Create provider from chain config
  const chainConfig = CHAINS[chainId as SupportedChainId];
  if (!chainConfig) {
    throw new Error(`Chain ID ${chainId} is not supported`);
  }

  const rpcUrl = chainConfig.rpcUrl || `https://rpc.ankr.com/eth_sepolia`;
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // 1. Check human verification (SelfHumanSBT)
  let humanVerified = false;
  try {
    humanVerified = await checkSelfHumanSBT(provider, chainId as SupportedChainId, address as Address);
  } catch (error) {
    // If SBT check fails, default to false and log
    console.warn('Failed to check SelfHumanSBT:', error);
    humanVerified = false;
  }

  // 2. Compute skill hash for aztec_builder_path (single source of truth)
  const aztecBuilderSkillHash = hashSkillName('aztec_builder_path');

  // 3. Get Aztec Builder tier from leaderboard (if published)
  let aztecBuilderTier: number | null = null;

  if (indexerBaseUrl) {
    try {
      const leaderboardClient = new LeaderboardClient({ baseUrl: indexerBaseUrl });
      const userSkills = await leaderboardClient.getUserSkills(address as Address);

      // Find Aztec Builder pathway entry
      const aztecBuilderSkill = userSkills.find(
        (skill) => skill.skill_hash.toLowerCase() === aztecBuilderSkillHash.toLowerCase()
      );

      if (aztecBuilderSkill) {
        // Use the tier from the leaderboard entry (this is the minLevel/minTier that was proven)
        aztecBuilderTier = aztecBuilderSkill.tier;
      }
    } catch (error) {
      // If leaderboard query fails, tier remains null
      console.warn('Failed to query leaderboard for user skills:', error);
    }
  }

  return {
    address,
    humanVerified,
    aztecBuilderTier,
    aztecBuilderSkillHash,
  };
}

