/**
 * Proof Extraction Tests
 * 
 * Tests for proper proof extraction and public input encoding.
 * This addresses the critical audit finding about incorrect proof extraction.
 */

import {
  validateProofFormat,
  extractPublicInputs,
  encodePublicInputs,
  extractAndValidateProof,
} from '../src/aztec/utils/proofExtraction';
import type { Address } from '../src/contracts';

describe('Proof Extraction Utilities', () => {
  describe('validateProofFormat', () => {
    it('should validate hex string proof', () => {
      const proof = '0x1234567890abcdef';
      const result = validateProofFormat(proof);
      expect(result).toBe(proof);
    });

    it('should validate hex string without 0x prefix', () => {
      const proof = '1234567890abcdef';
      const result = validateProofFormat(proof);
      expect(result).toBe('0x1234567890abcdef');
    });

    it('should validate Buffer proof', () => {
      const proof = Buffer.from([0x12, 0x34, 0x56, 0x78]);
      const result = validateProofFormat(proof);
      expect(result).toBe('0x12345678');
    });

    it('should validate Uint8Array proof', () => {
      const proof = new Uint8Array([0x12, 0x34, 0x56, 0x78]);
      const result = validateProofFormat(proof);
      expect(result).toBe('0x12345678');
    });

    it('should validate Array proof', () => {
      const proof = [0x12, 0x34, 0x56, 0x78];
      const result = validateProofFormat(proof);
      expect(result).toBe('0x12345678');
    });

    it('should throw error for missing proof', () => {
      expect(() => validateProofFormat(null)).toThrow('Proof is missing');
      expect(() => validateProofFormat(undefined)).toThrow('Proof is missing');
    });

    it('should throw error for invalid proof format', () => {
      expect(() => validateProofFormat(123)).toThrow('Invalid proof format');
    });
  });

  describe('extractPublicInputs', () => {
    it('should extract public inputs from object', () => {
      const returnValues = {
        owner: '0x1234',
        minTier: 2,
        minAverageScore: 75,
        pathHash: '0xabcd',
      };
      const result = extractPublicInputs(returnValues);
      expect(result.ownerAddress).toBe('0x1234');
      expect(result.minTier).toBe(2);
      expect(result.minAverageScore).toBe(75);
      expect(result.pathHash).toBe('0xabcd');
    });

    it('should extract public inputs from array format', () => {
      const returnValues = ['0x1234', 2, 75, '0xabcd'];
      const result = extractPublicInputs(returnValues);
      expect(result.ownerAddress).toBe('0x1234');
      expect(result.minTier).toBe(2);
      expect(result.minAverageScore).toBe(75);
      expect(result.pathHash).toBe('0xabcd');
    });

    it('should extract public inputs from JSON string', () => {
      const returnValues = JSON.stringify({
        owner: '0x1234',
        minTier: 2,
        minAverageScore: 75,
        pathHash: '0xabcd',
      });
      const result = extractPublicInputs(returnValues);
      expect(result.ownerAddress).toBe('0x1234');
      expect(result.minTier).toBe(2);
      expect(result.minAverageScore).toBe(75);
      expect(result.pathHash).toBe('0xabcd');
    });

    it('should throw error for missing return values', () => {
      expect(() => extractPublicInputs(null)).toThrow('Return values are missing');
      expect(() => extractPublicInputs(undefined)).toThrow('Return values are missing');
    });

    it('should throw error for invalid return values structure', () => {
      expect(() => extractPublicInputs({})).toThrow('Invalid public inputs structure');
    });
  });

  describe('encodePublicInputs', () => {
    const userAddress: Address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const skillHash: `0x${string}` = '0x' + 'a'.repeat(64);
    const minTier = 2;

    it('should encode public inputs correctly', () => {
      const result = encodePublicInputs(userAddress, skillHash, minTier);
      expect(result).toMatch(/^0x[0-9a-f]+$/);
      expect(result.length).toBeGreaterThan(66); // At least address (20 bytes) + bytes32 (32 bytes) + uint8 (1 byte)
    });

    it('should throw error for invalid address', () => {
      expect(() => encodePublicInputs('0xinvalid' as Address, skillHash, minTier)).toThrow('Invalid Ethereum address');
    });

    it('should throw error for invalid skill hash format', () => {
      expect(() => encodePublicInputs(userAddress, '0xinvalid' as `0x${string}`, minTier)).toThrow('Invalid skill hash format');
    });

    it('should throw error for invalid minTier', () => {
      expect(() => encodePublicInputs(userAddress, skillHash, 0)).toThrow('Invalid minTier');
      expect(() => encodePublicInputs(userAddress, skillHash, 5)).toThrow('Invalid minTier');
    });
  });

  describe('extractAndValidateProof', () => {
    const userAddress: Address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const skillHash: `0x${string}` = '0x' + 'a'.repeat(64);

    it('should extract and validate proof from receipt', () => {
      const receipt = {
        proof: Buffer.from([0x12, 0x34, 0x56, 0x78]),
        returnValues: {
          owner: '0x1234',
          minTier: 2,
          minAverageScore: 75,
          pathHash: '0xabcd',
        },
      };

      const result = extractAndValidateProof(receipt, userAddress, skillHash);
      expect(result.proof).toBe('0x12345678');
      expect(result.rawPublicInputs.minTier).toBe(2);
      expect(result.encodedPublicInputs).toMatch(/^0x[0-9a-f]+$/);
    });

    it('should throw error for missing proof', () => {
      const receipt = {
        returnValues: {
          owner: '0x1234',
          minTier: 2,
          minAverageScore: 75,
          pathHash: '0xabcd',
        },
      };

      expect(() => extractAndValidateProof(receipt, userAddress, skillHash)).toThrow('Proof is missing');
    });

    it('should throw error for missing return values', () => {
      const receipt = {
        proof: Buffer.from([0x12, 0x34]),
      };

      expect(() => extractAndValidateProof(receipt, userAddress, skillHash)).toThrow('Return values are missing');
    });
  });
});

