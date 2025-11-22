/**
 * Quest Hashing Utilities
 * 
 * Computes quest ID hashes, category hashes, and path hashes using Pedersen hash
 * to match the Noir circuit implementation.
 * 
 * IMPORTANT: These hashes MUST match the pedersen_hash values computed in the Noir circuit.
 * The Noir circuit uses: hash::pedersen_hash(bytes_array) for all string hashing.
 * 
 * Current Implementation:
 * - Uses hardcoded Pedersen hash values that match Noir's computation
 * - These values are computed from the Noir circuit and hardcoded here
 * 
 * TODO: Replace hardcoded values with runtime Pedersen hash computation using:
 * - @aztec/bb.js (Barretenberg library) - install with: pnpm add @aztec/bb.js
 * - Or Aztec SDK pedersen hash utilities when available
 */

import type { QuestId, QuestIdHash, CategoryId } from './types';

/**
 * Hardcoded Pedersen hash values computed from Noir circuit
 * 
 * These values are computed by the Noir circuit using:
 * - hash::pedersen_hash(string_bytes)
 * 
 * To compute new values:
 * 1. Run: aztec-nargo test tests/compute_pedersen_hashes.nr
 * 2. Extract the Field values from the output
 * 3. Convert Field to hex string (0x-prefixed, 64 hex chars)
 * 4. Update the values below
 * 
 * OR use a TypeScript Pedersen hash library:
 * - Install: pnpm add @aztec/bb.js
 * - Use Barretenberg to compute hashes at runtime
 * 
 * Current values are placeholders - MUST be replaced with actual computed values.
 */
const PEDERSEN_HASH_LOOKUP: Record<string, QuestIdHash> = {
  // Quest IDs (computed from Noir: hash::pedersen_hash([97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122]))
  'aztec_concept_quiz': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  'noir_basic_puzzle': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  'first_private_tx': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  'identity_architect_scenario': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  
  // Category (computed from Noir: hash::pedersen_hash([97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114]))
  'aztec_builder': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  
  // Path (computed from Noir: hash::pedersen_hash([97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114, 95, 112, 97, 116, 104]))
  'aztec_builder_path': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
};

/**
 * Check if a hash value is a placeholder (all zeros)
 */
function isPlaceholder(hash: QuestIdHash): boolean {
  return hash === '0x0000000000000000000000000000000000000000000000000000000000000000';
}

/**
 * Compute Pedersen hash for a string (hardcoded lookup for now)
 * 
 * This function currently uses hardcoded values that match Noir's pedersen_hash output.
 * 
 * TODO: Implement proper Pedersen hash computation using:
 * - @aztec/bb.js (Barretenberg library)
 * - Or Aztec SDK pedersen hash utilities when available
 * 
 * @param input The input string
 * @returns The Pedersen hash as a 0x-prefixed hex string (32 bytes)
 * @throws Error if hash is not computed yet (placeholder value)
 */
function computePedersenHash(input: string): QuestIdHash {
  // Check if we have a hardcoded value
  if (PEDERSEN_HASH_LOOKUP[input]) {
    const hash = PEDERSEN_HASH_LOOKUP[input];
    // If it's not the placeholder, return it
    if (!isPlaceholder(hash)) {
      return hash;
    }
  }
  
  // Hash is not computed yet - throw error with instructions
  const bytes = stringToBytes(input);
  throw new Error(
    `Pedersen hash for "${input}" is not yet computed.\n` +
    `Please compute it from the Noir circuit and add it to PEDERSEN_HASH_LOOKUP.\n` +
    `The Noir circuit uses: hash::pedersen_hash([${bytes.join(', ')}])\n` +
    `See: packages/core-logic/scripts/compute-pedersen-hashes.md for instructions.`
  );
}

/**
 * Convert string to bytes array (matching Noir's byte representation)
 * 
 * @param str The string to convert
 * @returns Array of byte values (0-255)
 */
function stringToBytes(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

/**
 * Compute quest ID hash from quest ID string
 * Uses Pedersen hash to match Noir circuit computation
 * 
 * @param questId The quest ID string (e.g., "aztec_concept_quiz")
 * @returns The hashed quest ID as a 0x-prefixed hex string (32 bytes)
 * @throws Error if hash is not computed yet
 */
export function computeQuestIdHash(questId: QuestId): QuestIdHash {
  return computePedersenHash(questId);
}

/**
 * Compute category hash from category ID string
 * Uses Pedersen hash to match Noir circuit computation
 * 
 * @param categoryId The category ID string (e.g., "aztec_builder")
 * @returns The hashed category ID as a 0x-prefixed hex string (32 bytes)
 * @throws Error if hash is not computed yet
 */
export function computeCategoryHash(categoryId: CategoryId): QuestIdHash {
  return computePedersenHash(categoryId);
}

/**
 * Compute path hash from path name string
 * Uses Pedersen hash to match Noir circuit computation
 * 
 * @param pathName The path name string (e.g., "aztec_builder_path")
 * @returns The hashed path name as a 0x-prefixed hex string (32 bytes)
 * @throws Error if hash is not computed yet
 */
export function computePathHash(pathName: string): QuestIdHash {
  return computePedersenHash(pathName);
}
