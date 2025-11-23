/**
 * Tier Publisher - Tier Publishing Helper (SBT Optional)
 * 
 * Provides a single backend entrypoint for publishing tier proofs to L1.
 * SBT verification is optional - users can compete in "anon/agent mode" or "human-only mode".
 * 
 * This helper:
 * 1. Uses RealAztecClient to generate a proof for aztec_builder_path
 * 2. Optionally checks SelfHumanSBT on L1 (for human-only mode)
 * 3. Submits tier proof to SkillLeaderboard (works with or without SBT)
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
  /** Require SelfHumanSBT to be valid (default: false) */
  requireSBT?: boolean;
}

/**
 * Result of submitting a tier proof
 */
export interface SubmitTierProofResult {
  /** L1 transaction hash */
  txHash: string;
  /** Skill hash that was submitted */
  skillHash: string;
  /** Whether the user has a valid SelfHumanSBT (human-verified) */
  isHumanVerified: boolean;
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
  // Mock mode: For demo purposes, treat specific dev wallet as human-verified
  // This allows the demo to work without requiring SBT minting
  const DEMO_HUMAN_ADDRESS = process.env.DEMO_HUMAN_ADDRESS || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_AZTEC === 'true' || 
                     process.env.USE_MOCK_SBT === 'true' ||
                     !process.env.NEXT_PUBLIC_USE_REAL_AZTEC;
  
  if (isMockMode && userAddress.toLowerCase() === DEMO_HUMAN_ADDRESS.toLowerCase()) {
    console.log(`[checkSelfHumanSBT] Mock mode: treating ${userAddress} as human-verified for demo`);
    return true;
  }

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
 * Submit a tier proof to SkillLeaderboard (SBT check is optional)
 * 
 * This function:
 * 1. Computes skillHash for the skill path
 * 2. Generates Aztec proof via aztecClient
 * 3. Encodes public inputs for L1 contract
 * 4. Optionally checks SelfHumanSBT validity (for human-only mode)
 * 5. Submits to SkillLeaderboard (works with or without SBT)
 * 
 * Note: SBT verification is optional. Users can compete in:
 * - "Anon/Agent Mode": No SBT required (anyone can publish)
 * - "Human-Only Mode": SBT required (only verified humans can publish)
 * 
 * The leaderboard can be filtered to show only human-verified entries.
 * 
 * @param params Submission parameters
 * @returns Transaction hash, skill hash, and human verification status
 * @throws Error if contract addresses not found or proof generation fails
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
    requireSBT = false,
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

  // Extract proof from result
  const { proof } = proofResult.proof;
  
  // Extract raw return values if available (from the fixed aztecClient)
  // These contain the public inputs from the Noir circuit
  const rawReturnValues = (proofResult as any).rawReturnValues;
  
  // 3. Encode public inputs for L1 contract
  // Format: abi.encode(userAddress, skillHash, minTier)
  // CRITICAL FIX: We use the user's Ethereum address and skill hash for L1 encoding,
  // NOT the Aztec address from the circuit. The circuit's public inputs are used for
  // proof verification, but L1 needs the Ethereum address.
  const encodedPublicInputs = encodeTierProofPublicInputs(
    userAddress as Address,
    skillHash,
    minTier
  );

  // 4. Check SelfHumanSBT validity (optional - for human-only mode)
  // Note: SBT check is now optional. Users can compete in "anon/agent mode" or "human-only mode"
  const provider = signer.provider;
  if (!provider) {
    throw new Error('Signer must have a provider attached for SBT verification');
  }

  let isHumanVerified = false;
  try {
    isHumanVerified = await checkSelfHumanSBT(provider, chainId, userAddress as Address);
  } catch (error) {
    // If SBT check fails (e.g., contract not deployed), default to false (anon mode)
    console.warn(
      `SBT check failed for ${userAddress} on chain ${chainId}: ${error instanceof Error ? error.message : String(error)}. ` +
      'Publishing in anon/agent mode.'
    );
    isHumanVerified = false;
  }

  // If requireSBT is true and user doesn't have valid SBT, throw error
  if (requireSBT && !isHumanVerified) {
    throw new Error(
      `User must have a valid SelfHumanSBT to publish tier proof. ` +
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
  // Check if we're in mock mode (MockAztecClient) - if so, skip contract call
  const isMockMode = (aztecClient as any).isMock === true;
  
  if (isMockMode) {
    // Mock mode: return a mock transaction hash without calling the contract
    // This allows the demo to work without requiring SBT or real contract deployment
    const mockTxHash = `0x${Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}` as `0x${string}`;
    
    console.log('[tierPublisher] Mock mode: skipping contract call, returning mock tx hash');
    
    return {
      txHash: mockTxHash,
      skillHash,
      isHumanVerified,
    };
  }

  // Real mode: call the contract
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
      isHumanVerified,
    };
  } catch (error) {
    // If contract call fails, provide helpful error message
    if (error instanceof Error && error.message.includes('hasValidSBT')) {
      throw new Error(
        `Failed to submit tier proof to SkillLeaderboard: User must have a valid SelfHumanSBT. ` +
        `Address ${userAddress} does not have an SBT on chain ${chainId}. ` +
        `For demo purposes, you can mint an SBT using the mint-sbt-for-demo.ts script, ` +
        `or use mock mode (set NEXT_PUBLIC_USE_REAL_AZTEC=false).`
      );
    }
    if (error instanceof Error) {
      throw new Error(
        `Failed to submit tier proof to SkillLeaderboard: ${error.message}`
      );
    }
    throw error;
  }
}

