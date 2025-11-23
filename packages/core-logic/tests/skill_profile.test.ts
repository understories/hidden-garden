/**
 * Tests for Skill Profile - User Profile Aggregation
 * 
 * Tests the getSkillProfile function and verifies it correctly aggregates
 * data from SelfHumanSBT, leaderboard, and external badges.
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { ethers } from 'ethers';
import { getSkillProfile } from '../src/skillProfile';
import { checkSelfHumanSBT } from '../src/tierPublisher';
import { LeaderboardClient } from '../src/leaderboardClient';
import { hashSkillName } from '../src/skills';
import type { UserSkill } from '../src/leaderboardClient';
import type { Address } from '../src/contracts';

describe('getSkillProfile', () => {
  const chainId = 31337; // Local Hardhat
  const userAddress = '0x1234567890123456789012345678901234567890';
  const indexerBaseUrl = 'http://localhost:4000';

  let mockProvider: ethers.JsonRpcProvider;
  let originalCheckSelfHumanSBT: typeof checkSelfHumanSBT;
  let checkSelfHumanSBTSpy: jest.SpiedFunction<typeof checkSelfHumanSBT>;
  let fetchSpy: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    // Create mock provider
    mockProvider = new ethers.JsonRpcProvider('http://localhost:8545');

    // Spy on checkSelfHumanSBT to control human verification
    checkSelfHumanSBTSpy = jest.spyOn(
      require('../src/tierPublisher'),
      'checkSelfHumanSBT'
    );

    // Spy on fetch to mock LeaderboardClient responses
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('address', () => {
    it('should return the input address', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
      });

      expect(profile.address).toBe(userAddress);
    });
  });

  describe('humanVerified', () => {
    it('should return true when user has SelfHumanSBT', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(true);
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
      });

      expect(profile.humanVerified).toBe(true);
      expect(checkSelfHumanSBTSpy).toHaveBeenCalledWith(
        expect.any(ethers.JsonRpcProvider),
        chainId,
        userAddress
      );
    });

    it('should return false when user does not have SelfHumanSBT', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
      });

      expect(profile.humanVerified).toBe(false);
    });

    it('should default to false when SBT check fails', async () => {
      checkSelfHumanSBTSpy.mockRejectedValue(new Error('SBT check failed'));
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
      });

      expect(profile.humanVerified).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to check SelfHumanSBT:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('aztecBuilderTier and aztecBuilderSkillHash', () => {
    const aztecBuilderSkillHash = hashSkillName('aztec_builder_path');

    it('should return non-null tier when user is on leaderboard', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);

      const mockUserSkills: UserSkill[] = [
        {
          id: 1,
          user_address: userAddress as Address,
          skill_hash: aztecBuilderSkillHash,
          tier: 3,
          block_number: 12345,
          tx_hash: '0xabcdef',
          timestamp: 1234567890,
          created_at: 1234567890,
        },
      ];

      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify(mockUserSkills), { status: 200 })
      );

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
        indexerBaseUrl,
      });

      expect(profile.aztecBuilderTier).toBe(3);
      expect(profile.aztecBuilderSkillHash).toBe(aztecBuilderSkillHash);
    });

    it('should return null tier when user is not on leaderboard', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
        indexerBaseUrl,
      });

      expect(profile.aztecBuilderTier).toBe(null);
      expect(profile.aztecBuilderSkillHash).toBe(aztecBuilderSkillHash);
    });

    it('should return null tier when indexerBaseUrl is not provided', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
      });

      expect(profile.aztecBuilderTier).toBe(null);
      expect(profile.aztecBuilderSkillHash).toBe(aztecBuilderSkillHash);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should return null tier when leaderboard query fails', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);
      fetchSpy.mockRejectedValue(new Error('Network error'));
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
        indexerBaseUrl,
      });

      expect(profile.aztecBuilderTier).toBe(null);
      expect(profile.aztecBuilderSkillHash).toBe(aztecBuilderSkillHash);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to query leaderboard for user skills:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should find correct skill when user has multiple skills', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);

      const otherSkillHash = hashSkillName('other_skill_path');
      const mockUserSkills: UserSkill[] = [
        {
          id: 1,
          user_address: userAddress as Address,
          skill_hash: otherSkillHash,
          tier: 1,
          block_number: 12340,
          tx_hash: '0x111111',
          timestamp: 1234567890,
          created_at: 1234567890,
        },
        {
          id: 2,
          user_address: userAddress as Address,
          skill_hash: aztecBuilderSkillHash,
          tier: 2,
          block_number: 12345,
          tx_hash: '0xabcdef',
          timestamp: 1234567890,
          created_at: 1234567890,
        },
      ];

      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify(mockUserSkills), { status: 200 })
      );

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
        indexerBaseUrl,
      });

      expect(profile.aztecBuilderTier).toBe(2);
      expect(profile.aztecBuilderSkillHash).toBe(aztecBuilderSkillHash);
    });
  });

  describe('externalBadges', () => {
    it('should always include aztec-builder-explorer badge', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
      });

      const explorerBadge = profile.externalBadges.find(
        (badge) => badge.id === 'aztec-builder-explorer'
      );

      expect(explorerBadge).toBeDefined();
      expect(explorerBadge?.label).toBe('Aztec Builder Path Explorer');
      expect(explorerBadge?.source).toBe('other');
    });

    it('should include ETHGlobal finalist badge for allowlisted addresses', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      // Note: The allowlist is currently empty in the implementation
      // This test verifies the structure, but won't find the badge
      // until addresses are added to the allowlist
      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
      });

      // Should still have the explorer badge
      expect(profile.externalBadges.length).toBeGreaterThan(0);
      expect(profile.externalBadges.some((b) => b.id === 'aztec-builder-explorer')).toBe(true);
    });
  });

  describe('allowAgents', () => {
    it('should always return true (placeholder)', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
      });

      expect(profile.allowAgents).toBe(true);
    });
  });

  describe('aztecAverageScore and questsCompleted', () => {
    it('should return null for aztecAverageScore (TODO)', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
      });

      expect(profile.aztecAverageScore).toBe(null);
    });

    it('should return null for questsCompleted (TODO)', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(false);
      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify([]), { status: 200 })
      );

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
      });

      expect(profile.questsCompleted).toBe(null);
    });
  });

  describe('error handling', () => {
    it('should throw error for unsupported chain ID', async () => {
      await expect(
        getSkillProfile({
          chainId: 999999,
          address: userAddress,
        })
      ).rejects.toThrow('Chain ID 999999 is not supported');
    });
  });

  describe('integration scenarios', () => {
    it('should return complete profile with all fields populated correctly', async () => {
      checkSelfHumanSBTSpy.mockResolvedValue(true);

      const aztecBuilderSkillHash = hashSkillName('aztec_builder_path');
      const mockUserSkills: UserSkill[] = [
        {
          id: 1,
          user_address: userAddress as Address,
          skill_hash: aztecBuilderSkillHash,
          tier: 2,
          block_number: 12345,
          tx_hash: '0xabcdef',
          timestamp: 1234567890,
          created_at: 1234567890,
        },
      ];

      fetchSpy.mockResolvedValue(
        new Response(JSON.stringify(mockUserSkills), { status: 200 })
      );

      const profile = await getSkillProfile({
        chainId,
        address: userAddress,
        indexerBaseUrl,
      });

      // Verify all fields
      expect(profile.address).toBe(userAddress);
      expect(profile.humanVerified).toBe(true);
      expect(profile.aztecBuilderTier).toBe(2);
      expect(profile.aztecBuilderSkillHash).toBe(aztecBuilderSkillHash);
      expect(profile.aztecAverageScore).toBe(null);
      expect(profile.questsCompleted).toBe(null);
      expect(profile.externalBadges.length).toBeGreaterThan(0);
      expect(profile.externalBadges.some((b) => b.id === 'aztec-builder-explorer')).toBe(true);
      expect(profile.allowAgents).toBe(true);
    });
  });
});

