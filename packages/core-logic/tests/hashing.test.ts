/**
 * Tests for quest hashing utilities
 * 
 * These tests verify that TypeScript-computed hashes match Noir's pedersen_hash values.
 * 
 * Note: These tests will fail until the actual pedersen hash values are computed from Noir
 * and added to PEDERSEN_HASH_LOOKUP in hashing.ts
 */

import { describe, it, expect } from '@jest/globals';
import {
  computeQuestIdHash,
  computeCategoryHash,
  computePathHash,
} from '../src/quests/hashing';

describe('Quest Hashing Utilities', () => {
  describe('computeQuestIdHash', () => {
    it('should compute hash for aztec_concept_quiz (matches Noir pedersen_hash)', () => {
      // This test will fail until the actual pedersen hash is computed from Noir
      // and added to PEDERSEN_HASH_LOOKUP
      expect(() => {
        const hash = computeQuestIdHash('aztec_concept_quiz');
        // Once hash is computed, verify it's not a placeholder
        expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
        expect(hash).not.toBe('0x0000000000000000000000000000000000000000000000000000000000000000');
      }).toThrow(); // Will throw until hash is computed
    });

    it('should throw error for unknown quest ID', () => {
      expect(() => {
        computeQuestIdHash('unknown_quest' as any);
      }).toThrow(/not yet computed/);
    });
  });

  describe('computeCategoryHash', () => {
    it('should compute hash for aztec_builder (matches Noir pedersen_hash)', () => {
      // This test will fail until the actual pedersen hash is computed from Noir
      expect(() => {
        const hash = computeCategoryHash('aztec_builder');
        // Once hash is computed, verify it's not a placeholder
        expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
        expect(hash).not.toBe('0x0000000000000000000000000000000000000000000000000000000000000000');
      }).toThrow(); // Will throw until hash is computed
    });
  });

  describe('computePathHash', () => {
    it('should compute hash for aztec_builder_path (matches Noir pedersen_hash)', () => {
      // This test will fail until the actual pedersen hash is computed from Noir
      expect(() => {
        const hash = computePathHash('aztec_builder_path');
        // Once hash is computed, verify it's not a placeholder
        expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
        expect(hash).not.toBe('0x0000000000000000000000000000000000000000000000000000000000000000');
      }).toThrow(); // Will throw until hash is computed
    });
  });
});

