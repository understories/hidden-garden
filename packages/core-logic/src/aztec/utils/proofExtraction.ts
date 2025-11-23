/**
 * Proof Extraction and Encoding Utilities
 * 
 * Handles proper extraction of ZK proofs and public inputs from Aztec transaction receipts.
 * Follows Aztec starter patterns for proof handling and L1 contract integration.
 * 
 * CRITICAL: This fixes the audit finding that proofs were extracted incorrectly
 * and public inputs were JSON-stringified instead of ABI-encoded.
 */

import { ethers } from 'ethers';
import type { Address } from '../contracts';

/**
 * Raw public inputs from Aztec proof generation
 * These come from the Noir circuit's public inputs
 */
export interface AztecPublicInputs {
  /** Owner address (Aztec address) */
  ownerAddress: string;
  /** Minimum tier (1-4) */
  minTier: number;
  /** Minimum average score (0-100) */
  minAverageScore: number;
  /** Path hash (bytes32) */
  pathHash: string;
}

/**
 * Validated proof data ready for L1 submission
 */
export interface ValidatedProof {
  /** The ZK proof bytes (as hex string) */
  proof: `0x${string}`;
  /** ABI-encoded public inputs (ready for L1 contract) */
  encodedPublicInputs: `0x${string}`;
  /** Raw public inputs (for debugging/logging) */
  rawPublicInputs: AztecPublicInputs;
}

/**
 * Validate proof format from Aztec receipt
 * 
 * @param proof Proof bytes from receipt (can be Buffer, Uint8Array, or hex string)
 * @returns Validated proof as hex string
 * @throws Error if proof format is invalid
 */
export function validateProofFormat(proof: unknown): `0x${string}` {
  if (!proof) {
    throw new Error('Proof is missing from transaction receipt');
  }

  // Handle different proof formats from Aztec SDK
  let proofBytes: Uint8Array;
  
  if (typeof proof === 'string') {
    // Already a hex string
    if (proof.startsWith('0x')) {
      return proof as `0x${string}`;
    }
    // Try to parse as hex without 0x prefix
    try {
      return `0x${proof}` as `0x${string}`;
    } catch {
      throw new Error('Invalid proof format: expected hex string');
    }
  } else if (Buffer.isBuffer(proof)) {
    proofBytes = new Uint8Array(proof);
  } else if (proof instanceof Uint8Array) {
    proofBytes = proof;
  } else if (Array.isArray(proof)) {
    proofBytes = new Uint8Array(proof);
  } else {
    throw new Error(`Invalid proof format: expected Buffer, Uint8Array, or hex string, got ${typeof proof}`);
  }

  // Convert to hex string
  const hex = Buffer.from(proofBytes).toString('hex');
  return `0x${hex}` as `0x${string}`;
}

/**
 * Extract and validate public inputs from Aztec receipt
 * 
 * The receipt's returnValues should contain the public inputs from the Noir circuit.
 * Format depends on how the Noir contract returns values.
 * 
 * @param returnValues Return values from transaction receipt
 * @returns Raw public inputs
 * @throws Error if public inputs format is invalid
 */
export function extractPublicInputs(returnValues: unknown): AztecPublicInputs {
  if (!returnValues) {
    throw new Error('Return values are missing from transaction receipt');
  }

  // Handle different return value formats
  let inputs: any;
  
  if (typeof returnValues === 'string') {
    // Try to parse as JSON
    try {
      inputs = JSON.parse(returnValues);
    } catch {
      throw new Error('Invalid return values format: expected object or JSON string');
    }
  } else if (typeof returnValues === 'object' && returnValues !== null) {
    inputs = returnValues;
  } else {
    throw new Error(`Invalid return values format: expected object, got ${typeof returnValues}`);
  }

  // Extract public inputs based on Noir circuit structure
  // The circuit returns: (owner, min_tier, min_average_score, path_hash)
  // We need to map these to our interface
  const ownerAddress = inputs.owner || inputs.ownerAddress || inputs[0];
  const minTier = inputs.minTier || inputs.min_tier || inputs[1];
  const minAverageScore = inputs.minAverageScore || inputs.min_average_score || inputs[2];
  const pathHash = inputs.pathHash || inputs.path_hash || inputs[3];

  if (!ownerAddress || minTier === undefined || minAverageScore === undefined || !pathHash) {
    throw new Error(
      `Invalid public inputs structure. Expected: { owner, minTier, minAverageScore, pathHash }. ` +
      `Got: ${JSON.stringify(inputs)}`
    );
  }

  return {
    ownerAddress: String(ownerAddress),
    minTier: Number(minTier),
    minAverageScore: Number(minAverageScore),
    pathHash: String(pathHash),
  };
}

/**
 * Encode public inputs for L1 contract submission
 * 
 * The L1 contract expects: abi.encode(userAddress, skillHash, minTier)
 * 
 * Note: The userAddress here is the Ethereum address (not Aztec address),
 * and skillHash is computed from the skill path name.
 * 
 * @param userAddress User's Ethereum address (from L1)
 * @param skillHash Skill hash (bytes32) - computed from skill path
 * @param minTier Minimum tier (uint8)
 * @returns ABI-encoded public inputs as hex string
 */
export function encodePublicInputs(
  userAddress: Address,
  skillHash: `0x${string}`,
  minTier: number
): `0x${string}` {
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  
  // Validate inputs
  if (!ethers.isAddress(userAddress)) {
    throw new Error(`Invalid Ethereum address: ${userAddress}`);
  }
  
  if (!skillHash.startsWith('0x') || skillHash.length !== 66) {
    throw new Error(`Invalid skill hash format: expected 0x-prefixed 32-byte hex string, got ${skillHash}`);
  }
  
  if (minTier < 1 || minTier > 4) {
    throw new Error(`Invalid minTier: expected 1-4, got ${minTier}`);
  }
  
  // Encode: (address, bytes32, uint8)
  const encoded = abiCoder.encode(
    ['address', 'bytes32', 'uint8'],
    [userAddress, skillHash, minTier]
  );
  
  return encoded as `0x${string}`;
}

/**
 * Extract and validate proof from Aztec transaction receipt
 * 
 * This is the main function that should be called to extract proof data
 * from an Aztec transaction receipt.
 * 
 * @param receipt Transaction receipt from Aztec
 * @param userAddress User's Ethereum address (for encoding public inputs)
 * @param skillHash Skill hash (for encoding public inputs)
 * @returns Validated proof ready for L1 submission
 * @throws Error if proof or public inputs are invalid
 */
export function extractAndValidateProof(
  receipt: any,
  userAddress: Address,
  skillHash: `0x${string}`
): ValidatedProof {
  // Extract proof
  const proof = validateProofFormat(receipt.proof);
  
  // Extract public inputs
  const rawPublicInputs = extractPublicInputs(receipt.returnValues);
  
  // Encode public inputs for L1 contract
  // Note: We use userAddress (Ethereum) and skillHash (computed) for L1 encoding
  // The raw public inputs from Aztec contain the Aztec address and path hash
  const encodedPublicInputs = encodePublicInputs(
    userAddress,
    skillHash,
    rawPublicInputs.minTier
  );
  
  return {
    proof,
    encodedPublicInputs,
    rawPublicInputs,
  };
}

