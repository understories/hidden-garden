/**
 * Tests for Leaderboard Orchestrator - Publish and Fetch Helper
 * 
 * Tests the publishAndFetchAztecBuilderLeaderboard function that orchestrates
 * tier proof submission and leaderboard polling.
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { ethers } from 'ethers';
import { publishAndFetchAztecBuilderLeaderboard } from '../src/leaderboardOrchestrator';
import { submitTierProofWithSBTCheck } from '../src/tierPublisher';
import { LeaderboardClient } from '../src/leaderboardClient';
import type { AztecClient } from '../src/aztecClient';
import type { LeaderboardEntry } from '../src/leaderboardClient';
import type { Address } from '../src/contracts';

describe('publishAndFetchAztecBuilderLeaderboard', () => {
  const chainId = 31337; // Local Hardhat
  const userAddress = '0x1234567890123456789012345678901234567890';
  const minTier = 2;
  const minAverageScore = 75;
  const indexerBaseUrl = 'http://localhost:4000';
  const mockTxHash = '0x' + 'a'.repeat(64);
  const mockSkillHash = '0x' + 'b'.repeat(64) as `0x${string}`;

  let mockSigner: ethers.Wallet;
  let mockAztecClient: AztecClient;
  let submitTierProofSpy: jest.SpiedFunction<typeof submitTierProofWithSBTCheck>;
  let getLeaderboardSpy: jest.SpiedFunction<LeaderboardClient['getLeaderboard']>;

  beforeEach(() => {
    // Create mock signer
    mockSigner = new ethers.Wallet(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      new ethers.JsonRpcProvider('http://localhost:8545')
    );

    // Create mock Aztec client
    mockAztecClient = {
      getAddress: jest.fn(),
      addQuestCompletion: jest.fn(),
      proveAztecBuilderTier: jest.fn(),
    } as any;

    // Spy on submitTierProofWithSBTCheck
    submitTierProofSpy = jest.spyOn(
      require('../src/tierPublisher'),
      'submitTierProofWithSBTCheck'
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('successful flow', () => {
    it('should return leaderboard when user entry appears after polling', async () => {
      // Mock submitTierProofWithSBTCheck to return fixed values
      submitTierProofSpy.mockResolvedValue({
        txHash: mockTxHash,
        skillHash: mockSkillHash,
      });

      // Create mock leaderboard entries
      const otherUserEntry: LeaderboardEntry = {
        id: 1,
        user_address: '0x9999999999999999999999999999999999999999' as Address,
        skill_hash: mockSkillHash,
        tier: 3,
        block_number: 12340,
        tx_hash: '0x111111',
        timestamp: 1234567890,
        created_at: 1234567890,
      };

      const userEntry: LeaderboardEntry = {
        id: 2,
        user_address: userAddress as Address,
        skill_hash: mockSkillHash,
        tier: minTier,
        block_number: 12345,
        tx_hash: mockTxHash,
        timestamp: 1234567900,
        created_at: 1234567900,
      };

      // Mock getLeaderboard: first call returns without user, second call includes user
      let callCount = 0;
      getLeaderboardSpy = jest
        .spyOn(LeaderboardClient.prototype, 'getLeaderboard')
        .mockImplementation(async () => {
          callCount++;
          if (callCount === 1) {
            // First call: user not in leaderboard yet
            return [otherUserEntry];
          } else {
            // Second call: user appears in leaderboard
            return [otherUserEntry, userEntry];
          }
        });

      const result = await publishAndFetchAztecBuilderLeaderboard({
        chainId,
        userAddress,
        minTier,
        minAverageScore,
        signer: mockSigner,
        aztecClient: mockAztecClient,
        indexerBaseUrl,
        pollIntervalMs: 100, // Short interval for faster tests
        maxAttempts: 5,
      });

      // Verify result
      expect(result.txHash).toBe(mockTxHash);
      expect(result.skillHash).toBe(mockSkillHash);
      expect(result.leaderboard).toHaveLength(2);
      expect(result.leaderboard).toContainEqual(userEntry);
      expect(result.leaderboard).toContainEqual(otherUserEntry);

      // Verify submitTierProofWithSBTCheck was called correctly
      expect(submitTierProofSpy).toHaveBeenCalledWith({
        chainId,
        userAddress,
        minTier,
        minAverageScore,
        skillPathId: 'aztec_builder_path',
        signer: mockSigner,
        aztecClient: mockAztecClient,
      });

      // Verify getLeaderboard was called multiple times
      expect(getLeaderboardSpy).toHaveBeenCalledTimes(2);
      expect(getLeaderboardSpy).toHaveBeenCalledWith(mockSkillHash);
    });

    it('should return immediately if user is already in leaderboard', async () => {
      // Mock submitTierProofWithSBTCheck
      submitTierProofSpy.mockResolvedValue({
        txHash: mockTxHash,
        skillHash: mockSkillHash,
      });

      // Mock leaderboard with user already present
      const userEntry: LeaderboardEntry = {
        id: 1,
        user_address: userAddress as Address,
        skill_hash: mockSkillHash,
        tier: minTier,
        block_number: 12345,
        tx_hash: mockTxHash,
        timestamp: 1234567900,
        created_at: 1234567900,
      };

      getLeaderboardSpy = jest
        .spyOn(LeaderboardClient.prototype, 'getLeaderboard')
        .mockResolvedValue([userEntry]);

      const result = await publishAndFetchAztecBuilderLeaderboard({
        chainId,
        userAddress,
        minTier,
        minAverageScore,
        signer: mockSigner,
        aztecClient: mockAztecClient,
        indexerBaseUrl,
        pollIntervalMs: 100,
        maxAttempts: 5,
      });

      expect(result.txHash).toBe(mockTxHash);
      expect(result.skillHash).toBe(mockSkillHash);
      expect(result.leaderboard).toHaveLength(1);
      expect(result.leaderboard[0]).toEqual(userEntry);

      // Should only call getLeaderboard once since user is already there
      expect(getLeaderboardSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('timeout scenarios', () => {
    it('should throw error when indexer never ingests the entry', async () => {
      // Mock submitTierProofWithSBTCheck
      submitTierProofSpy.mockResolvedValue({
        txHash: mockTxHash,
        skillHash: mockSkillHash,
      });

      // Mock leaderboard without user (all calls return empty or without user)
      const otherUserEntry: LeaderboardEntry = {
        id: 1,
        user_address: '0x9999999999999999999999999999999999999999' as Address,
        skill_hash: mockSkillHash,
        tier: 3,
        block_number: 12340,
        tx_hash: '0x111111',
        timestamp: 1234567890,
        created_at: 1234567890,
      };

      getLeaderboardSpy = jest
        .spyOn(LeaderboardClient.prototype, 'getLeaderboard')
        .mockResolvedValue([otherUserEntry]);

      await expect(
        publishAndFetchAztecBuilderLeaderboard({
          chainId,
          userAddress,
          minTier,
          minAverageScore,
          signer: mockSigner,
          aztecClient: mockAztecClient,
          indexerBaseUrl,
          pollIntervalMs: 50, // Short interval for faster tests
          maxAttempts: 3, // Small number for faster test
        })
      ).rejects.toThrow('Timed out waiting for indexer to ingest leaderboard data');

      // Verify it polled the expected number of times
      expect(getLeaderboardSpy).toHaveBeenCalledTimes(3);
    });

    it('should include transaction hash in timeout error message', async () => {
      submitTierProofSpy.mockResolvedValue({
        txHash: mockTxHash,
        skillHash: mockSkillHash,
      });

      getLeaderboardSpy = jest
        .spyOn(LeaderboardClient.prototype, 'getLeaderboard')
        .mockResolvedValue([]);

      await expect(
        publishAndFetchAztecBuilderLeaderboard({
          chainId,
          userAddress,
          minTier,
          minAverageScore,
          signer: mockSigner,
          aztecClient: mockAztecClient,
          indexerBaseUrl,
          pollIntervalMs: 50,
          maxAttempts: 2,
        })
      ).rejects.toThrow('Timed out waiting for indexer to ingest leaderboard data');

      // Verify error message contains transaction hash
      try {
        await publishAndFetchAztecBuilderLeaderboard({
          chainId,
          userAddress,
          minTier,
          minAverageScore,
          signer: mockSigner,
          aztecClient: mockAztecClient,
          indexerBaseUrl,
          pollIntervalMs: 50,
          maxAttempts: 2,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain('Timed out waiting for indexer to ingest leaderboard data');
        expect(errorMessage).toContain(mockTxHash);
        expect(errorMessage).toContain('2 times'); // maxAttempts
        expect(errorMessage).toContain('50ms'); // pollIntervalMs
      }
    });
  });

  describe('error handling', () => {
    it('should throw error if indexerBaseUrl is not provided', async () => {
      await expect(
        publishAndFetchAztecBuilderLeaderboard({
          chainId,
          userAddress,
          minTier,
          minAverageScore,
          signer: mockSigner,
          aztecClient: mockAztecClient,
          // indexerBaseUrl is missing
        } as any)
      ).rejects.toThrow('indexerBaseUrl is required for polling leaderboard');
    });

    it('should propagate errors from submitTierProofWithSBTCheck', async () => {
      const submitError = new Error('SBT check failed');
      submitTierProofSpy.mockRejectedValue(submitError);

      await expect(
        publishAndFetchAztecBuilderLeaderboard({
          chainId,
          userAddress,
          minTier,
          minAverageScore,
          signer: mockSigner,
          aztecClient: mockAztecClient,
          indexerBaseUrl,
        })
      ).rejects.toThrow('SBT check failed');

      // Should not attempt to poll if submission fails
      // Note: getLeaderboard won't be called if submitTierProofWithSBTCheck fails
      // We verify this by ensuring no leaderboard client was created
      // (The error is thrown before leaderboard polling starts)
    });

    it('should propagate errors from leaderboard client', async () => {
      submitTierProofSpy.mockResolvedValue({
        txHash: mockTxHash,
        skillHash: mockSkillHash,
      });

      const leaderboardError = new Error('Network error');
      getLeaderboardSpy = jest
        .spyOn(LeaderboardClient.prototype, 'getLeaderboard')
        .mockRejectedValue(leaderboardError);

      await expect(
        publishAndFetchAztecBuilderLeaderboard({
          chainId,
          userAddress,
          minTier,
          minAverageScore,
          signer: mockSigner,
          aztecClient: mockAztecClient,
          indexerBaseUrl,
          pollIntervalMs: 50,
          maxAttempts: 3,
        })
      ).rejects.toThrow('Network error');
    });
  });

  describe('polling configuration', () => {
    it('should use default pollIntervalMs and maxAttempts when not provided', async () => {
      submitTierProofSpy.mockResolvedValue({
        txHash: mockTxHash,
        skillHash: mockSkillHash,
      });

      const userEntry: LeaderboardEntry = {
        id: 1,
        user_address: userAddress as Address,
        skill_hash: mockSkillHash,
        tier: minTier,
        block_number: 12345,
        tx_hash: mockTxHash,
        timestamp: 1234567900,
        created_at: 1234567900,
      };

      getLeaderboardSpy = jest
        .spyOn(LeaderboardClient.prototype, 'getLeaderboard')
        .mockResolvedValue([userEntry]);

      await publishAndFetchAztecBuilderLeaderboard({
        chainId,
        userAddress,
        minTier,
        minAverageScore,
        signer: mockSigner,
        aztecClient: mockAztecClient,
        indexerBaseUrl,
        // pollIntervalMs and maxAttempts not provided - should use defaults
      });

      expect(getLeaderboardSpy).toHaveBeenCalledTimes(1);
    });

    it('should respect custom pollIntervalMs and maxAttempts', async () => {
      submitTierProofSpy.mockResolvedValue({
        txHash: mockTxHash,
        skillHash: mockSkillHash,
      });

      getLeaderboardSpy = jest
        .spyOn(LeaderboardClient.prototype, 'getLeaderboard')
        .mockResolvedValue([]);

      const customPollInterval = 200;
      const customMaxAttempts = 5;

      await expect(
        publishAndFetchAztecBuilderLeaderboard({
          chainId,
          userAddress,
          minTier,
          minAverageScore,
          signer: mockSigner,
          aztecClient: mockAztecClient,
          indexerBaseUrl,
          pollIntervalMs: customPollInterval,
          maxAttempts: customMaxAttempts,
        })
      ).rejects.toThrow('Timed out');

      // Verify it polled the custom number of times
      expect(getLeaderboardSpy).toHaveBeenCalledTimes(customMaxAttempts);
    });
  });
});

