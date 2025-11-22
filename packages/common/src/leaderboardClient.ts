import type { Address } from './contracts';
import { hashSkillName } from './skills';

/**
 * Skill hash type (0x-prefixed hex string, 66 characters)
 */
export type SkillHash = `0x${string}`;

/**
 * Leaderboard entry from the indexer API
 */
export interface LeaderboardEntry {
  id: number;
  user_address: Address;
  skill_hash: SkillHash;
  tier: number;
  block_number: number;
  tx_hash: string;
  timestamp: number;
  created_at: number;
  ensName?: string; // Optional ENS name if resolved
}

/**
 * User skill entry from the indexer API
 */
export interface UserSkill {
  id: number;
  user_address: Address;
  skill_hash: SkillHash;
  tier: number;
  block_number: number;
  tx_hash: string;
  timestamp: number;
  created_at: number;
  ensName?: string; // Optional ENS name if resolved
}

/**
 * Configuration for LeaderboardClient
 */
export interface LeaderboardClientConfig {
  baseUrl: string;
}

/**
 * Client for interacting with the Hidden Garden leaderboard indexer API
 */
export class LeaderboardClient {
  private baseUrl: string;

  constructor(config: LeaderboardClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Get leaderboard entries for a specific skill hash
   * @param skillHash The skill hash to query
   * @returns Array of leaderboard entries, sorted by tier (descending)
   */
  async getLeaderboard(skillHash: SkillHash): Promise<LeaderboardEntry[]> {
    const url = `${this.baseUrl}/leaderboard?skillHash=${encodeURIComponent(skillHash)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch leaderboard: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as LeaderboardEntry[];
  }

  /**
   * Get all skills for a specific user address
   * @param address The user address to query
   * @returns Array of user skills
   */
  async getUserSkills(address: Address): Promise<UserSkill[]> {
    const url = `${this.baseUrl}/user/${encodeURIComponent(address)}/skills`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user skills: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as UserSkill[];
  }
}

/**
 * Get the Aztec Builder pathway leaderboard
 * @param client The LeaderboardClient instance
 * @returns Array of leaderboard entries for the Aztec Builder pathway
 */
export function getAztecBuilderLeaderboard(client: LeaderboardClient): Promise<LeaderboardEntry[]> {
  const pathHash = hashSkillName('aztec_builder_path');
  return client.getLeaderboard(pathHash);
}

