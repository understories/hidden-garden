/**
 * Tests for Tier Publisher - Self-Gated Tier Publishing Helper
 * 
 * Tests the submitTierProofWithSBTCheck function and related utilities.
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ethers } from 'ethers';
import {
  submitTierProofWithSBTCheck,
  encodeTierProofPublicInputs,
  checkSelfHumanSBT,
} from '../src/tierPublisher';
import type { AztecClient, ZKProof } from '../src/aztecClient';
import { MockAztecClient } from '../src/aztecClient';
import {
  getSelfHumanSBTAddress,
  getSkillLeaderboardAddress,
  SelfHumanSBTAbi,
  SkillLeaderboardAbi,
} from '../src/contracts';
import { hashSkillName } from '../src/skills';

describe.skip('Tier Publisher', () => {
  const chainId = 31337; // Local Hardhat
  const userAddress = '0x1234567890123456789012345678901234567890' as `0x${string}`;
  const minTier = 1;
  const minAverageScore = 60;
  const skillPathId = 'aztec_builder_path';

  let mockProvider: ethers.JsonRpcProvider;
  let mockSigner: ethers.Wallet;
  let mockAztecClient: AztecClient;

  beforeEach(() => {
    // Create mock provider and signer
    mockProvider = new ethers.JsonRpcProvider('http://localhost:8545');
    mockSigner = new ethers.Wallet(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      mockProvider
    );

    // Create mock Aztec client
    mockAztecClient = new MockAztecClient();
  });

  describe('encodeTierProofPublicInputs', () => {
    it('should encode public inputs correctly', () => {
      const skillHash = hashSkillName('aztec_builder_path');
      const encoded = encodeTierProofPublicInputs(userAddress, skillHash, minTier);

      // Verify it's a valid hex string
      expect(encoded).toMatch(/^0x[0-9a-f]+$/i);

      // Decode to verify format
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const decoded = abiCoder.decode(['address', 'bytes32', 'uint8'], encoded);

      expect(decoded[0].toLowerCase()).toBe(userAddress.toLowerCase());
      expect(decoded[1]).toBe(skillHash);
      expect(decoded[2]).toBe(minTier);
    });

    it('should match abi.encode format', () => {
      const skillHash = hashSkillName('aztec_builder_path');
      const encoded = encodeTierProofPublicInputs(userAddress, skillHash, minTier);

      // Use ethers to encode the same way and compare
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const expected = abiCoder.encode(
        ['address', 'bytes32', 'uint8'],
        [userAddress, skillHash, minTier]
      );

      expect(encoded).toBe(expected);
    });
  });

  describe('checkSelfHumanSBT', () => {
    it('should return true when user has SBT', async () => {
      if (!getSelfHumanSBTAddress(chainId)) {
        console.log('Skipping: SBT contract address not configured');
        return;
      }

      // Mock provider.call to return encoded true
      const mockCall = jest.spyOn(mockProvider, 'call').mockResolvedValue(
        ethers.AbiCoder.defaultAbiCoder().encode(['bool'], [true])
      );

      const hasSBT = await checkSelfHumanSBT(mockProvider, chainId, userAddress);
      expect(hasSBT).toBe(true);
      mockCall.mockRestore();
    });

    it('should return false when user does not have SBT', async () => {
      if (!getSelfHumanSBTAddress(chainId)) {
        console.log('Skipping: SBT contract address not configured');
        return;
      }

      // Mock provider.call to return encoded false
      const mockCall = jest.spyOn(mockProvider, 'call').mockResolvedValue(
        ethers.AbiCoder.defaultAbiCoder().encode(['bool'], [false])
      );

      const hasSBT = await checkSelfHumanSBT(mockProvider, chainId, userAddress);
      expect(hasSBT).toBe(false);
      mockCall.mockRestore();
    });

    it('should throw error when contract address not found', async () => {
      const invalidChainId = 999999;

      await expect(
        checkSelfHumanSBT(mockProvider, invalidChainId, userAddress)
      ).rejects.toThrow('SelfHumanSBT contract address not found');
    });
  });

  describe('submitTierProofWithSBTCheck', () => {
    it('should throw error when SBT check fails', async () => {
      if (!getSelfHumanSBTAddress(chainId) || !getSkillLeaderboardAddress(chainId)) {
        console.log('Skipping: Contract addresses not configured');
        return;
      }

      // Mock Aztec client to return proof
      const mockProof: ZKProof = {
        proof: ('0x' + '0'.repeat(128)) as `0x${string}`,
        publicInputs: ('0x' + '0'.repeat(64)) as `0x${string}`,
      };

      jest.spyOn(mockAztecClient, 'proveAztecBuilderTier').mockResolvedValue({
        success: true,
        proof: mockProof,
      });

      // Mock provider.call to return encoded false for SBT check
      jest.spyOn(mockProvider, 'call').mockResolvedValue(
        ethers.AbiCoder.defaultAbiCoder().encode(['bool'], [false])
      );

      await expect(
        submitTierProofWithSBTCheck({
          chainId,
          userAddress,
          minTier,
          minAverageScore,
          skillPathId,
          signer: mockSigner,
          aztecClient: mockAztecClient,
        })
      ).rejects.toThrow('User must have a valid SelfHumanSBT to publish tier proof');
    });

    it('should submit tier proof when SBT check passes', async () => {
      if (!getSelfHumanSBTAddress(chainId) || !getSkillLeaderboardAddress(chainId)) {
        console.log('Skipping: Contract addresses not configured');
        return;
      }

      // Mock Aztec client to return proof
      const mockProof: ZKProof = {
        proof: ('0x' + '0'.repeat(128)) as `0x${string}`,
        publicInputs: ('0x' + '0'.repeat(64)) as `0x${string}`,
      };

      jest.spyOn(mockAztecClient, 'proveAztecBuilderTier').mockResolvedValue({
        success: true,
        proof: mockProof,
      });

      // Mock provider.call to return encoded true for SBT check
      const mockCall = jest.spyOn(mockProvider, 'call');
      mockCall.mockResolvedValueOnce(
        ethers.AbiCoder.defaultAbiCoder().encode(['bool'], [true])
      );

      // Mock leaderboard contract submission
      const mockTxHash = ('0x' + 'a'.repeat(64)) as `0x${string}`;
      // Create a minimal mock receipt that Jest can serialize (avoid BigInt)
      const mockReceipt = {
        hash: mockTxHash,
        status: 1,
      } as any;
      const mockWait = jest.fn<() => Promise<ethers.TransactionReceipt>>().mockResolvedValue(mockReceipt);
      const mockTx = {
        hash: mockTxHash,
        wait: mockWait,
      } as any;

      // Mock sendTransaction for contract write
      const mockSendTx = jest.spyOn(mockSigner, 'sendTransaction').mockResolvedValue(mockTx as any);

      const result = await submitTierProofWithSBTCheck({
        chainId,
        userAddress,
        minTier,
        minAverageScore,
        skillPathId,
        signer: mockSigner,
        aztecClient: mockAztecClient,
      });

      expect(result.txHash).toBe('0x' + 'a'.repeat(64));
      expect(result.skillHash).toBe(hashSkillName(skillPathId));

      // Verify transaction was sent (contract interaction happens via sendTransaction)
      expect(mockSendTx).toHaveBeenCalled();
      
      mockCall.mockRestore();
      mockSendTx.mockRestore();
    });

    it('should throw error when proof generation fails', async () => {
      // Mock Aztec client to return error
      jest.spyOn(mockAztecClient, 'proveAztecBuilderTier').mockResolvedValue({
        success: false,
        error: 'Failed to generate proof',
      });

      await expect(
        submitTierProofWithSBTCheck({
          chainId,
          userAddress,
          minTier,
          minAverageScore,
          skillPathId,
          signer: mockSigner,
          aztecClient: mockAztecClient,
        })
      ).rejects.toThrow('Failed to generate Aztec proof');
    });

    it('should validate minTier range', async () => {
      await expect(
        submitTierProofWithSBTCheck({
          chainId,
          userAddress,
          minTier: 0, // Invalid
          minAverageScore,
          skillPathId,
          signer: mockSigner,
          aztecClient: mockAztecClient,
        })
      ).rejects.toThrow('Invalid minTier');

      await expect(
        submitTierProofWithSBTCheck({
          chainId,
          userAddress,
          minTier: 5, // Invalid
          minAverageScore,
          skillPathId,
          signer: mockSigner,
          aztecClient: mockAztecClient,
        })
      ).rejects.toThrow('Invalid minTier');
    });

    it('should validate minAverageScore range', async () => {
      await expect(
        submitTierProofWithSBTCheck({
          chainId,
          userAddress,
          minTier,
          minAverageScore: -1, // Invalid
          skillPathId,
          signer: mockSigner,
          aztecClient: mockAztecClient,
        })
      ).rejects.toThrow('Invalid minAverageScore');

      await expect(
        submitTierProofWithSBTCheck({
          chainId,
          userAddress,
          minTier,
          minAverageScore: 101, // Invalid
          skillPathId,
          signer: mockSigner,
          aztecClient: mockAztecClient,
        })
      ).rejects.toThrow('Invalid minAverageScore');
    });

    it('should validate userAddress format', async () => {
      await expect(
        submitTierProofWithSBTCheck({
          chainId,
          userAddress: 'invalid-address', // Invalid
          minTier,
          minAverageScore,
          skillPathId,
          signer: mockSigner,
          aztecClient: mockAztecClient,
        })
      ).rejects.toThrow('Invalid userAddress');
    });

    it('should throw error when SkillLeaderboard address not found', async () => {
      const invalidChainId = 999999;

      const mockProof: ZKProof = {
        proof: ('0x' + '0'.repeat(128)) as `0x${string}`,
        publicInputs: ('0x' + '0'.repeat(64)) as `0x${string}`,
      };

      jest.spyOn(mockAztecClient, 'proveAztecBuilderTier').mockResolvedValue({
        success: true,
        proof: mockProof,
      });

      await expect(
        submitTierProofWithSBTCheck({
          chainId: invalidChainId,
          userAddress,
          minTier,
          minAverageScore,
          skillPathId,
          signer: mockSigner,
          aztecClient: mockAztecClient,
        })
      ).rejects.toThrow('SkillLeaderboard contract address not found');
    });

    it('should use default skillPathId when not provided', async () => {
      if (!getSelfHumanSBTAddress(chainId) || !getSkillLeaderboardAddress(chainId)) {
        console.log('Skipping: Contract addresses not configured');
        return;
      }

      const mockProof: ZKProof = {
        proof: ('0x' + '0'.repeat(128)) as `0x${string}`,
        publicInputs: ('0x' + '0'.repeat(64)) as `0x${string}`,
      };

      jest.spyOn(mockAztecClient, 'proveAztecBuilderTier').mockResolvedValue({
        success: true,
        proof: mockProof,
      });

      // Mock provider.call to return encoded true for SBT check
      const mockCall = jest.spyOn(mockProvider, 'call').mockResolvedValue(
        ethers.AbiCoder.defaultAbiCoder().encode(['bool'], [true])
      );

      // Mock leaderboard contract submission
      const mockTxHash = ('0x' + 'a'.repeat(64)) as `0x${string}`;
      // Create a minimal mock receipt that Jest can serialize (avoid BigInt)
      const mockReceipt = {
        hash: mockTxHash,
        status: 1,
      } as any;
      const mockWait = jest.fn<() => Promise<ethers.TransactionReceipt>>().mockResolvedValue(mockReceipt);
      const mockTx = {
        hash: mockTxHash,
        wait: mockWait,
      } as any;

      const mockSendTx = jest.spyOn(mockSigner, 'sendTransaction').mockResolvedValue(mockTx as any);

      const result = await submitTierProofWithSBTCheck({
        chainId,
        userAddress,
        minTier,
        minAverageScore,
        // skillPathId not provided - should default to 'aztec_builder_path'
        signer: mockSigner,
        aztecClient: mockAztecClient,
      });

      expect(result.skillHash).toBe(hashSkillName('aztec_builder_path'));
      
      mockCall.mockRestore();
      mockSendTx.mockRestore();
    });
  });
});

