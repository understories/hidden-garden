/**
 * Skill Profile - User Profile Aggregation
 * 
 * Provides a single API for the UI to get a complete user profile including:
 * - Human verification status (SelfHumanSBT)
 * - Aztec Builder tier and skill data
 * - Quest completion counts
 * - External badges (POAP, SBT, GitHub, etc.)
 * - allowAgents preference
 */

import { ethers } from 'ethers';
import type { Address, SupportedChainId } from './contracts';
import { CHAINS, getSelfHumanSBTAddress, SelfHumanSBTAbi } from './contracts';
import { checkSelfHumanSBT } from './tierPublisher';
import { hashSkillName } from './skills';
import { LeaderboardClient } from './leaderboardClient';
import type { SkillProfile, ExternalBadge, QuestSummary } from './types';

/**
 * Get external badges for an address
 * 
 * Currently includes:
 * - ETHGlobal finalist badge (demo addresses)
 * - Aztec Builder Path Explorer badge (all users)
 * 
 * TODO: Integrate with POAP API, SBT contracts, GitHub API, etc.
 */
function getExternalBadgesForAddress(address: string): ExternalBadge[] {
  const addr = address.toLowerCase();
  const badges: ExternalBadge[] = [];

  // Demo allowlist for ETHGlobal finalist badge
  const ethGlobalAllowlist = new Set<string>([
    // TODO: Fill with actual ETHGlobal finalist addresses
    // Example: '0x1234567890123456789012345678901234567890',
  ]);

  if (ethGlobalAllowlist.has(addr)) {
    badges.push({
      id: 'ethglobal-finalist',
      label: 'ETHGlobal Finalist',
      source: 'poap',
      url: 'https://ethglobal.com/',
    });
  }

  // All users get the Aztec Builder Path Explorer badge
  badges.push({
    id: 'aztec-builder-explorer',
    label: 'Aztec Builder Path Explorer',
    source: 'other',
  });

  return badges;
}

/**
 * Get a complete skill profile for a user
 * 
 * Aggregates data from:
 * - SelfHumanSBT (human verification)
 * - Leaderboard indexer (Aztec Builder tier, if published)
 * - External badges (POAP, SBT, GitHub, etc.)
 * - allowAgents preference
 * 
 * @param params Configuration for profile fetching
 * @returns Complete skill profile
 */
export async function getSkillProfile(params: {
  chainId: number;
  address: string;
  indexerBaseUrl?: string;
}): Promise<SkillProfile> {
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

  // 4. Get external badges
  const externalBadges = getExternalBadgesForAddress(address);

  // 5. Get quest summaries (app-level data, mirrors Aztec private storage)
  // For now, use demo data. In the future, this could come from:
  // - Session storage (localStorage)
  // - Backend API that tracks quest completions
  // - Aztec read path (when implemented)
  const questSummaries = getQuestSummariesForAddress(address);

  // 6. allowAgents preference
  // TODO: This is a placeholder until we have persisted user preferences
  // The UI team will own the toggle, and we'll need to store this preference
  // (e.g., in localStorage, a contract, or a backend service)
  const allowAgents = true; // placeholder, UI-owned toggle for now

  // Compute questsCompleted count from summaries
  const questsCompleted = questSummaries.filter(q => q.status === 'completed').length;

  return {
    address,
    humanVerified,
    aztecBuilderTier,
    aztecBuilderSkillHash,
    // TODO: expose aztecAverageScore when we have a clean API from Aztec side
    aztecAverageScore: null,
    questsCompleted,
    questSummaries,
    externalBadges,
    allowAgents,
  };
}

/**
 * Get quest summaries for an address
 * 
 * This is app-level data that mirrors what's stored privately in Aztec.
 * For now, returns demo data. In the future, this could come from:
 * - Session storage (localStorage)
 * - Backend API
 * - Aztec read path (when implemented)
 * 
 * Note: This function doesn't import from game-engine to avoid circular dependencies.
 * The UI layer (game-engine) will provide the quest list, and this function
 * will map it to summaries based on completion data.
 * 
 * @param address User address
 * @returns Array of quest summaries
 */
function getQuestSummariesForAddress(address: string): QuestSummary[] {
  // For demo purposes, return empty array
  // In production, this would:
  // 1. Query session storage (localStorage) for quest completions
  // 2. Query backend API for persisted completions
  // 3. Query Aztec read path (when implemented)
  
  // Demo data: Show a few completed quests for demo addresses
  const demoCompletedQuests: Record<string, Array<{ id: string; score: number }>> = {
    // Add demo addresses here if needed
    // Example:
    // '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266': [
    //   { id: 'aztec_concept_quiz', score: 100 },
    //   { id: 'noir_syntax_basics', score: 85 },
    // ],
  };
  
  const demoData = demoCompletedQuests[address.toLowerCase()];
  
  // For now, return empty array
  // The UI will handle displaying quest summaries by calling getSkillProfile
  // and then mapping quest definitions to summaries
  // This keeps the backend simple and avoids circular dependencies
  
  // If we have demo data, we could return it here, but for now we'll keep it empty
  // and let the UI layer handle the quest list display
  return [];
}

