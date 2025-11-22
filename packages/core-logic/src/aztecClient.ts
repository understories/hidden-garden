/**
 * Aztec SDK Client Wrapper
 * 
 * Provides a clean interface for interacting with Aztec Protocol contracts.
 * This wraps the Aztec SDK to call private functions and generate proofs.
 * 
 * Note: This is a TypeScript interface layer. The actual Aztec SDK integration
 * will be implemented by Team B in the UI layer.
 */

import type { QuestIdHash } from './quests/types';

/**
 * Aztec address type (from Aztec SDK)
 */
export type AztecAddress = string;

/**
 * ZK proof data structure
 */
export interface ZKProof {
  /** The zero-knowledge proof bytes */
  proof: `0x${string}`;
  /** Public inputs for verification */
  publicInputs: `0x${string}`;
}

/**
 * Result of adding a quest completion
 */
export interface QuestCompletionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Result of generating a tier proof
 */
export interface TierProofResult {
  success: boolean;
  proof?: ZKProof;
  error?: string;
}

/**
 * Aztec Client Interface
 * 
 * This interface defines the contract for Aztec SDK integration.
 * Team B will implement this using the actual Aztec SDK.
 */
export interface AztecClient {
  /**
   * Get the current user's Aztec address
   * @returns The user's Aztec address, or null if not connected
   */
  getAddress(): Promise<AztecAddress | null>;

  /**
   * Add a quest completion to the private vault
   * 
   * Calls: `add_quest_completion(owner, quest_id_hash, score)`
   * 
   * @param questIdHash The hashed quest identifier
   * @param score The completion score (0-100)
   * @returns Result indicating success or failure
   */
  addQuestCompletion(
    questIdHash: QuestIdHash,
    score: number
  ): Promise<QuestCompletionResult>;

  /**
   * Generate a tier proof for the Aztec Builder pathway
   * 
   * Calls: `prove_aztec_builder_tier(owner, min_tier, min_average_score)`
   * 
   * @param minTier The minimum tier to prove (1-4)
   * @param minAverageScore The minimum average score (0-100)
   * @returns ZK proof and public inputs, or error
   */
  proveAztecBuilderTier(
    minTier: number,
    minAverageScore: number
  ): Promise<TierProofResult>;
}

/**
 * Mock Aztec Client (for development/testing)
 * 
 * This provides a mock implementation that simulates Aztec SDK calls
 * without requiring actual Aztec infrastructure.
 */
export class MockAztecClient implements AztecClient {
  private address: AztecAddress | null = null;
  private questCompletions: Map<QuestIdHash, number> = new Map();

  async getAddress(): Promise<AztecAddress | null> {
    return this.address || 'aztec1mockuser123456789';
  }

  async addQuestCompletion(
    questIdHash: QuestIdHash,
    score: number
  ): Promise<QuestCompletionResult> {
    // Validate score
    if (score < 0 || score > 100) {
      return {
        success: false,
        error: `Invalid score: ${score}. Score must be between 0 and 100.`,
      };
    }

    // Store completion (keep best score)
    const currentScore = this.questCompletions.get(questIdHash) || 0;
    if (score > currentScore) {
      this.questCompletions.set(questIdHash, score);
    }

    // Simulate transaction
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}` as `0x${string}`;

    return {
      success: true,
      transactionHash: txHash,
    };
  }

  async proveAztecBuilderTier(
    minTier: number,
    minAverageScore: number
  ): Promise<TierProofResult> {
    // Mock proof generation
    // In real implementation, this would call the Aztec SDK
    
    // For now, generate mock proof data
    const proof: ZKProof = {
      proof: `0x${'0'.repeat(128)}` as `0x${string}`, // Mock proof
      publicInputs: `0x${'0'.repeat(64)}` as `0x${string}`, // Mock public inputs
    };

    return {
      success: true,
      proof,
    };
  }
}

