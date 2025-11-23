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

/**
 * Check if the indexer service is reachable
 * @param baseUrl The base URL of the indexer service
 * @param timeoutMs Timeout in milliseconds (default: 2000)
 * @returns True if indexer is reachable, false otherwise
 */
export async function checkIndexerReachable(
  baseUrl: string,
  timeoutMs: number = 2000
): Promise<boolean> {
  try {
    const url = `${baseUrl.replace(/\/$/, '')}/health`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const response = await fetch(url, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json() as { status?: string };
    return data.status === 'ok';
  } catch (error) {
    // Network error, timeout, or other failure
    return false;
  }
}

/**
 * Mock Leaderboard Client (for offline development)
 * 
 * Provides a mock implementation that returns empty arrays or mock data
 * without requiring the indexer service to be running.
 */
export class MockLeaderboardClient extends LeaderboardClient {
  private mockData: LeaderboardEntry[] = [];

  constructor(config?: LeaderboardClientConfig) {
    // Use a dummy baseUrl since we won't actually make requests
    super(config || { baseUrl: 'http://localhost:4000' });
  }

  /**
   * Set mock leaderboard data
   * @param data Mock leaderboard entries
   */
  setMockData(data: LeaderboardEntry[]): void {
    this.mockData = data;
  }

  /**
   * Get leaderboard entries (returns mock data)
   */
  async getLeaderboard(skillHash: SkillHash): Promise<LeaderboardEntry[]> {
    // Filter mock data by skill hash if provided
    return this.mockData.filter(entry => entry.skill_hash === skillHash);
  }

  /**
   * Get user skills (returns mock data)
   */
  async getUserSkills(address: Address): Promise<UserSkill[]> {
    // Filter mock data by user address
    return this.mockData
      .filter(entry => entry.user_address.toLowerCase() === address.toLowerCase())
      .map(entry => ({
        id: entry.id,
        user_address: entry.user_address,
        skill_hash: entry.skill_hash,
        tier: entry.tier,
        block_number: entry.block_number,
        tx_hash: entry.tx_hash,
        timestamp: entry.timestamp,
        created_at: entry.created_at,
        ensName: entry.ensName,
      }));
  }
}

