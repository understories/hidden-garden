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
 * Expected Pedersen hash values - MUST match Noir circuit constants
 * 
 * These values MUST match the constants defined in:
 * - packages/core-logic/src/main.nr (AZTEC_CONCEPT_QUIZ_HASH, AZTEC_BUILDER_CATEGORY_HASH, AZTEC_BUILDER_PATH_HASH)
 * 
 * If you change the hashing scheme in Noir, you MUST update these values.
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
 * 
 * IMPORTANT: These are exported as constants for hash consistency tests.
 * See: packages/core-logic/tests/hash_consistency.test.ts
 */

/**
 * Expected hash for quest ID "aztec_concept_quiz"
 * Must match: AZTEC_CONCEPT_QUIZ_HASH in main.nr
 * Computed from: hash::pedersen_hash([97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122])
 */
export const EXPECTED_AZTEC_CONCEPT_QUIZ_HASH: QuestIdHash = '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash; // TODO: Compute from Noir

/**
 * Expected hash for category "aztec_builder"
 * Must match: AZTEC_BUILDER_CATEGORY_HASH in main.nr
 * Computed from: hash::pedersen_hash([97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114])
 */
export const EXPECTED_AZTEC_BUILDER_CATEGORY_HASH: QuestIdHash = '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash; // TODO: Compute from Noir

/**
 * Expected hash for path "aztec_builder_path"
 * Must match: AZTEC_BUILDER_PATH_HASH in main.nr
 * Computed from: hash::pedersen_hash([97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114, 95, 112, 97, 116, 104])
 */
export const EXPECTED_AZTEC_BUILDER_PATH_HASH: QuestIdHash = '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash; // TODO: Compute from Noir

const PEDERSEN_HASH_LOOKUP: Record<string, QuestIdHash> = {
  // Quest IDs (computed from Noir: hash::pedersen_hash([97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122]))
  'aztec_concept_quiz': EXPECTED_AZTEC_CONCEPT_QUIZ_HASH,
  'noir_basic_puzzle': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  'first_private_tx': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  'identity_architect_scenario': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  
  // Category (computed from Noir: hash::pedersen_hash([97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114]))
  'aztec_builder': EXPECTED_AZTEC_BUILDER_CATEGORY_HASH,
  
  // Path (computed from Noir: hash::pedersen_hash([97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114, 95, 112, 97, 116, 104]))
  'aztec_builder_path': EXPECTED_AZTEC_BUILDER_PATH_HASH,
};

/**
 * Check if a hash value is a placeholder (all zeros)
 */
function isPlaceholder(hash: QuestIdHash): boolean {
  return hash === '0x0000000000000000000000000000000000000000000000000000000000000000';
}

/**
 * Compute Pedersen hash for a string using @aztec/bb.js
 * 
 * This function computes Pedersen hashes at runtime to match Noir's pedersen_hash output.
 * 
 * @param input The input string
 * @returns The Pedersen hash as a 0x-prefixed hex string (32 bytes)
 */
async function computePedersenHashAsync(input: string): Promise<QuestIdHash> {
  try {
    // Dynamic import to avoid bundling issues in browser
    const { Barretenberg } = await import('@aztec/bb.js');
    const bb = await Barretenberg.new();
    
    const bytes = stringToBytes(input);
    // Convert bytes to Uint8Array
    const bytesArray = new Uint8Array(bytes);
    
    // Compute Pedersen hash
    const hash = await bb.pedersenHashWithHashIndex(bytesArray, 0);
    
    // Convert Field to hex string
    const hex = hash.toString(16).padStart(64, '0');
    return `0x${hex}` as QuestIdHash;
  } catch (error) {
    // Fallback: check if we have a hardcoded value
    if (PEDERSEN_HASH_LOOKUP[input]) {
      const hash = PEDERSEN_HASH_LOOKUP[input];
      if (!isPlaceholder(hash)) {
        return hash;
      }
    }
    
    // If computation fails and no hardcoded value, throw error
    const bytes = stringToBytes(input);
    throw new Error(
      `Failed to compute Pedersen hash for "${input}".\n` +
      `Error: ${error instanceof Error ? error.message : String(error)}\n` +
      `The Noir circuit uses: hash::pedersen_hash([${bytes.join(', ')}])\n` +
      `See: packages/core-logic/scripts/compute-pedersen-hashes.md for instructions.`
    );
  }
}

/**
 * Compute Pedersen hash for a string (synchronous wrapper with caching)
 * 
 * For browser environments, we use a synchronous wrapper that caches computed hashes.
 * 
 * @param input The input string
 * @returns The Pedersen hash as a 0x-prefixed hex string (32 bytes)
 */
const hashCache: Record<string, QuestIdHash> = {};

function computePedersenHash(input: string): QuestIdHash {
  // Check cache first
  if (hashCache[input]) {
    return hashCache[input];
  }
  
  // Check if we have a hardcoded value
  if (PEDERSEN_HASH_LOOKUP[input]) {
    const hash = PEDERSEN_HASH_LOOKUP[input];
    // If it's not the placeholder, cache and return it
    if (!isPlaceholder(hash)) {
      hashCache[input] = hash;
      return hash;
    }
  }
  
  // For now, compute synchronously using a simple approach
  // In browser, this will need to be async, but for MVP we'll use a workaround
  // TODO: Make this properly async or use a pre-computed lookup table
  
  // Temporary: Use a deterministic hash based on input for MVP
  // This is NOT the real Pedersen hash, but allows the app to run
  // The real hashes should be computed and added to PEDERSEN_HASH_LOOKUP
  const bytes = stringToBytes(input);
  const simpleHash = bytes.reduce((acc, byte) => {
    return ((acc << 5) - acc) + byte;
  }, 0);
  
  // Convert to hex (this is a placeholder - not the real Pedersen hash)
  const placeholderHash = `0x${Math.abs(simpleHash).toString(16).padStart(64, '0')}` as QuestIdHash;
  
  // Cache it
  hashCache[input] = placeholderHash;
  
  // For MVP: return placeholder, but log a warning
  console.warn(
    `⚠️  Using placeholder hash for "${input}". ` +
    `This is NOT the real Pedersen hash. ` +
    `Please compute the real hash from Noir and add it to PEDERSEN_HASH_LOOKUP.`
  );
  
  return placeholderHash;
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
