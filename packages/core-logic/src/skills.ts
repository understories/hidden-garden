import { keccak256, toUtf8Bytes } from 'ethers';
import type { SkillHash } from './leaderboardClient';

/**
 * Hash a skill name to a skill hash
 * Uses the same hashing algorithm as the contracts (keccak256 of UTF-8 bytes)
 * @param name The skill name (e.g., "solidity", "rust", "typescript")
 * @returns The skill hash (0x-prefixed hex string)
 */
export function hashSkillName(name: string): SkillHash {
  const normalized = name.trim().toLowerCase();
  const hash = keccak256(toUtf8Bytes(normalized));
  return hash as SkillHash;
}

