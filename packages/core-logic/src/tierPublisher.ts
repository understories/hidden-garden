/**
 * Tier Publisher - Self-Gated Tier Publishing Helper
 * 
 * Provides a single backend entrypoint for publishing tier proofs to L1
 * with SelfHumanSBT verification.
 * 
 * This helper:
 * 1. Uses RealAztecClient to generate a proof for aztec_builder_path
 * 2. Checks SelfHumanSBT on L1
 * 3. Submits tier proof to SkillLeaderboard ONLY if SBT is valid
 */

import { ethers } from 'ethers';
import type { Address } from './contracts';
import {
  getSelfHumanSBTAddress,
  getSkillLeaderboardAddress,
  SelfHumanSBTAbi,
  SkillLeaderboardAbi,
} from './contracts';
import { hashSkillName } from './skills';
import type { AztecClient } from './aztecClient';

/**
 * Parameters for submitting a tier proof with SBT check
 */
export interface SubmitTierProofParams {
  /** Chain ID for L1 contract interaction */
  chainId: number;
  /** User's Ethereum address (must match Aztec address owner) */
  userAddress: string;
  /** Minimum tier to prove (1-4) */
  minTier: number;
  /** Minimum average score required (0-100) */
  minAverageScore: number;
  /** Skill path identifier (default: "aztec_builder_path") */
  skillPathId?: string;
  /** Ethers signer for contract interactions (required for writes) */
  signer: ethers.Signer;
  /** Aztec client for generating proofs */
  aztecClient: AztecClient;
}

/**
 * Result of submitting a tier proof
 */
export interface SubmitTierProofResult {
  /** L1 transaction hash */
  txHash: string;
  /** Skill hash that was submitted */
  skillHash: string;
}

/**
 * Encode public inputs for L1 contract submission
 * 
 * Format: abi.encode(userAddress, skillHash, minTier)
 * 
 * @param userAddress User's Ethereum address
 * @param skillHash Skill hash (bytes32)
 * @param minTier Minimum tier (uint8)
 * @returns Encoded public inputs as hex string
 */
export function encodeTierProofPublicInputs(
  userAddress: Address,
  skillHash: `0x${string}`,
  minTier: number
): `0x${string}` {
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const encoded = abiCoder.encode(
    ['address', 'bytes32', 'uint8'],
    [userAddress, skillHash, minTier]
  );
  return encoded as `0x${string}`;
}

/**
 * Check if a user has a valid SelfHumanSBT
 * 
 * @param provider Ethers provider for contract reads
 * @param chainId Chain ID to get contract address
 * @param userAddress User's address to check
 * @returns True if user has valid SBT, false otherwise
 * @throws Error if contract address not found for chainId
 */
export async function checkSelfHumanSBT(
  provider: ethers.Provider,
  chainId: number,
  userAddress: Address
): Promise<boolean> {
  const sbtAddress = getSelfHumanSBTAddress(chainId);
  if (!sbtAddress) {
    throw new Error(
      `SelfHumanSBT contract address not found for chain ${chainId}. ` +
      `Please configure the contract address in packages/core-logic/src/contracts.ts`
    );
  }

  const sbtContract = new ethers.Contract(sbtAddress, SelfHumanSBTAbi, provider);
  const hasSBT = await sbtContract.hasValidSBT(userAddress);
  return hasSBT;
}

/**
 * Submit a tier proof to SkillLeaderboard with SelfHumanSBT verification
 * 
 * This function:
 * 1. Computes skillHash for the skill path
 * 2. Generates Aztec proof via aztecClient
 * 3. Encodes public inputs for L1 contract
 * 4. Checks SelfHumanSBT validity
 * 5. Submits to SkillLeaderboard if SBT is valid
 * 
 * @param params Submission parameters
 * @returns Transaction hash and skill hash
 * @throws Error if SBT check fails, contract addresses not found, or proof generation fails
 */
export async function submitTierProofWithSBTCheck(
  params: SubmitTierProofParams
): Promise<SubmitTierProofResult> {
  const {
    chainId,
    userAddress,
    minTier,
    minAverageScore,
    skillPathId = 'aztec_builder_path',
    signer,
    aztecClient,
  } = params;

  // Validate inputs
  if (minTier < 1 || minTier > 4) {
    throw new Error(`Invalid minTier: ${minTier}. Must be between 1 and 4.`);
  }
  if (minAverageScore < 0 || minAverageScore > 100) {
    throw new Error(`Invalid minAverageScore: ${minAverageScore}. Must be between 0 and 100.`);
  }
  if (!ethers.isAddress(userAddress)) {
    throw new Error(`Invalid userAddress: ${userAddress}. Must be a valid Ethereum address.`);
  }

  // 1. Compute skillHash for the skill path
  const skillHash = hashSkillName(skillPathId);

  // 2. Generate Aztec proof
  const proofResult = await aztecClient.proveAztecBuilderTier(minTier, minAverageScore);
  
  if (!proofResult.success || !proofResult.proof) {
    throw new Error(
      `Failed to generate Aztec proof: ${proofResult.error || 'Unknown error'}`
    );
  }

  const { proof, publicInputs: aztecPublicInputs } = proofResult.proof;

  // 3. Encode public inputs for L1 contract
  // Format: abi.encode(userAddress, skillHash, minTier)
  const encodedPublicInputs = encodeTierProofPublicInputs(
    userAddress as Address,
    skillHash,
    minTier
  );

  // 4. Check SelfHumanSBT validity
  const provider = signer.provider;
  if (!provider) {
    throw new Error('Signer must have a provider attached for SBT verification');
  }

  const hasSBT = await checkSelfHumanSBT(provider, chainId, userAddress as Address);
  
  if (!hasSBT) {
    throw new Error(
      'User must have a valid SelfHumanSBT to publish tier proof. ' +
      `Address ${userAddress} does not have a valid SBT on chain ${chainId}.`
    );
  }

  // 5. Get SkillLeaderboard contract address
  const leaderboardAddress = getSkillLeaderboardAddress(chainId);
  if (!leaderboardAddress) {
    throw new Error(
      `SkillLeaderboard contract address not found for chain ${chainId}. ` +
      `Please configure the contract address in packages/core-logic/src/contracts.ts`
    );
  }

  // 6. Submit to SkillLeaderboard
  const leaderboardContract = new ethers.Contract(
    leaderboardAddress,
    SkillLeaderboardAbi,
    signer
  );

  try {
    const tx = await leaderboardContract.submitSkillTierWithProof(
      skillHash,
      minTier,
      proof,
      encodedPublicInputs
    );

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    if (!receipt) {
      throw new Error('Transaction receipt not available');
    }

    return {
      txHash: receipt.hash,
      skillHash,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to submit tier proof to SkillLeaderboard: ${error.message}`
      );
    }
    throw error;
  }
}

