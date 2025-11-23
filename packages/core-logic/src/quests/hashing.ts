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
 * Computed using: aztec-nargo test (see packages/core-logic/tests/standalone)
 */
export const EXPECTED_AZTEC_CONCEPT_QUIZ_HASH: QuestIdHash = '0x02b21397b0c2dfe25a0658e30e4e146b8b6dd80304cdc0c14fee4f21a1d9175d' as QuestIdHash;

/**
 * Expected hash for category "aztec_builder"
 * Must match: AZTEC_BUILDER_CATEGORY_HASH in main.nr
 * Computed from: hash::pedersen_hash([97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114])
 * Computed using: aztec-nargo test (see packages/core-logic/tests/standalone)
 */
export const EXPECTED_AZTEC_BUILDER_CATEGORY_HASH: QuestIdHash = '0x2f40a2752a0fe69d3d3a555d6e91026d60b0c521f0ce7031f9b01e79ea3219bd' as QuestIdHash;

/**
 * Expected hash for path "aztec_builder_path"
 * Must match: AZTEC_BUILDER_PATH_HASH in main.nr
 * Computed from: hash::pedersen_hash([97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114, 95, 112, 97, 116, 104])
 * Computed using: aztec-nargo test (see packages/core-logic/tests/standalone)
 */
export const EXPECTED_AZTEC_BUILDER_PATH_HASH: QuestIdHash = '0x3032625cebcb714e3686599e98c3e8412a98ba6a4f0506bfccf97ed0db7c32e4' as QuestIdHash;

const PEDERSEN_HASH_LOOKUP: Record<string, QuestIdHash> = {
  // Quest IDs (computed using aztec-nargo test - see packages/core-logic/tests/standalone)
  'aztec_concept_quiz': EXPECTED_AZTEC_CONCEPT_QUIZ_HASH,
  'noir_syntax_basics': '0x0c948fc303a4b6888e3398c0970657320ee4ba36d3a6597bcb649fb8092d2a19' as QuestIdHash,
  'aztec_storage_intro': '0x1a14c5abc569fc55179d3221e140be698747b65c38a6a398e3ca90587e117289' as QuestIdHash,
  // Placeholder hashes for demo (will be replaced with real hashes when computed)
  'aztec_privacy_basics': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  'aztec_notes_concept': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  'aztec_public_vs_private': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  'noir_basic_puzzle': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  'first_private_tx': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  'identity_architect_scenario': '0x0000000000000000000000000000000000000000000000000000000000000000' as QuestIdHash, // TODO: Compute from Noir
  
  // Category (computed using aztec-nargo test)
  'aztec_builder': EXPECTED_AZTEC_BUILDER_CATEGORY_HASH,
  
  // Path (computed using aztec-nargo test)
  'aztec_builder_path': EXPECTED_AZTEC_BUILDER_PATH_HASH,
};

/**
 * Check if a hash value is a placeholder (all zeros)
 */
function isPlaceholder(hash: QuestIdHash): boolean {
  return hash === '0x0000000000000000000000000000000000000000000000000000000000000000';
}

/**
 * Compute Pedersen hash for a string using @aztec/bb.js (deprecated - use pre-computed lookup)
 * 
 * This function is kept for future use if runtime hash computation is needed.
 * For now, all hashes are pre-computed using Noir and stored in PEDERSEN_HASH_LOOKUP.
 * 
 * @param input The input string
 * @returns The Pedersen hash as a 0x-prefixed hex string (32 bytes)
 * @deprecated Use pre-computed hashes from PEDERSEN_HASH_LOOKUP instead
 */
async function computePedersenHashAsync(input: string): Promise<QuestIdHash> {
  // For now, use synchronous lookup (all hashes should be pre-computed)
  return computePedersenHash(input);
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
    // If it's a placeholder, return it with a warning (for demo purposes)
    if (isPlaceholder(hash)) {
      console.warn(
        `⚠️  Using placeholder hash for "${input}". ` +
        `This quest cannot be stored in Aztec until the real hash is computed. ` +
        `For demo, use quests with computed hashes: aztec_concept_quiz, noir_syntax_basics, aztec_storage_intro`
      );
      return hash;
    }
    // If it's not the placeholder, cache and return it
    hashCache[input] = hash;
    return hash;
  }
  
  // If we reach here, the hash is not in the lookup table
  // This should not happen for known quest IDs, categories, or paths
  // Throw an error to alert developers that a hash needs to be computed
  throw new Error(
    `Pedersen hash not found for "${input}". ` +
    `Please compute the hash using Noir (aztec-nargo test) and add it to PEDERSEN_HASH_LOOKUP. ` +
    `See packages/core-logic/tests/standalone for an example.`
  );
}

/**
 * Convert string to bytes array (matching Noir's byte representation)
 * 
 * @param str The string to convert
 * @returns Array of byte values (0-255)
 */
export function stringToBytes(str: string): number[] {
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
