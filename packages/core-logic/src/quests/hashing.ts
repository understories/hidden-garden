/**
 * Quest Hashing Utilities
 * 
 * Computes quest ID hashes and category hashes using keccak256.
 * These hashes must match the values computed in the Noir circuit.
 */

import { keccak256, toUtf8Bytes } from 'ethers';
import type { QuestId, QuestIdHash, CategoryId } from './types';

/**
 * Compute quest ID hash from quest ID string
 * Uses keccak256 to match Noir circuit computation
 * 
 * @param questId The quest ID string (e.g., "aztec_concept_quiz")
 * @returns The hashed quest ID as a 0x-prefixed hex string
 */
export function computeQuestIdHash(questId: QuestId): QuestIdHash {
  return keccak256(toUtf8Bytes(questId)) as QuestIdHash;
}

/**
 * Compute category hash from category ID string
 * Uses keccak256 to match Noir circuit computation
 * 
 * @param categoryId The category ID string (e.g., "aztec_builder")
 * @returns The hashed category ID as a 0x-prefixed hex string
 */
export function computeCategoryHash(categoryId: CategoryId): QuestIdHash {
  return keccak256(toUtf8Bytes(categoryId)) as QuestIdHash;
}

/**
 * Compute path hash from path name string
 * Uses keccak256 to match Noir circuit computation
 * 
 * @param pathName The path name string (e.g., "aztec_builder_path")
 * @returns The hashed path name as a 0x-prefixed hex string
 */
export function computePathHash(pathName: string): QuestIdHash {
  return keccak256(toUtf8Bytes(pathName)) as QuestIdHash;
}

