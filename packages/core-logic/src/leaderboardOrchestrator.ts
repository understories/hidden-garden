/**
 * Leaderboard Orchestrator - Publish and Fetch Helper
 * 
 * Provides orchestration for the "Reveal my tier" flow:
 * 1. Submit tier proof to L1 (with SBT check)
 * 2. Wait for indexer to ingest the event
 * 3. Return the updated leaderboard
 */

import type { LeaderboardEntry } from './leaderboardClient';
import { LeaderboardClient } from './leaderboardClient';
import { submitTierProofWithSBTCheck } from './tierPublisher';
import type { AztecClient } from './aztecClient';
import type { SubmitTierProofParams } from './tierPublisher';
import { ethers } from 'ethers';

/**
 * Parameters for publishing and fetching Aztec Builder leaderboard
 */
export interface PublishAndFetchParams {
  /** Chain ID for L1 contract interaction */
  chainId: number;
  /** User's Ethereum address */
  userAddress: string;
  /** Minimum tier to prove (1-4) */
  minTier: number;
  /** Minimum average score required (0-100) */
  minAverageScore: number;
  /** Ethers signer for contract interactions */
  signer: ethers.Signer;
  /** Aztec client for generating proofs */
  aztecClient: AztecClient;
  /** Base URL for the indexer service (optional) */
  indexerBaseUrl?: string;
  /** Polling interval in milliseconds (default: 3000) */
  pollIntervalMs?: number;
  /** Maximum number of polling attempts (default: 10) */
  maxAttempts?: number;
  /** Require SelfHumanSBT to be valid (default: false) */
  requireSBT?: boolean;
}

/**
 * Result of publishing and fetching leaderboard
 */
export interface PublishAndFetchResult {
  /** L1 transaction hash */
  txHash: string;
  /** Skill hash that was submitted */
  skillHash: string;
  /** Updated leaderboard entries */
  leaderboard: LeaderboardEntry[];
  /** Whether the user has a valid SelfHumanSBT (human-verified) */
  isHumanVerified: boolean;
  /** Whether indexer data is available (false if polling timed out) */
  indexerAvailable?: boolean;
  /** Warning message if indexer timed out but transaction succeeded */
  warning?: string;
}

/**
 * Publish tier proof to L1 and wait for indexer to ingest, then return updated leaderboard
 * 
 * This function orchestrates the complete "Reveal my tier" flow:
 * 1. Calls submitTierProofWithSBTCheck to publish tier proof to L1
 * 2. Polls the indexer until the user's entry appears in the leaderboard
 * 3. Returns the transaction hash, skill hash, and updated leaderboard
 * 
 * @param params Configuration for publishing and fetching
 * @returns Transaction hash, skill hash, and updated leaderboard
 * @throws Error if indexerBaseUrl is not provided, or if polling times out
 */
export async function publishAndFetchAztecBuilderLeaderboard(
  params: PublishAndFetchParams
): Promise<PublishAndFetchResult> {
  const {
    chainId,
    userAddress,
    minTier,
    minAverageScore,
    signer,
    aztecClient,
    indexerBaseUrl,
    pollIntervalMs = 3000,
    maxAttempts = 10,
    requireSBT = false,
  } = params;

  // Validate indexerBaseUrl is provided
  if (!indexerBaseUrl) {
    throw new Error('indexerBaseUrl is required for polling leaderboard');
  }

  // 1. Call submitTierProofWithSBTCheck
  const submitParams: SubmitTierProofParams = {
    chainId,
    userAddress,
    minTier,
    minAverageScore,
    skillPathId: 'aztec_builder_path',
    signer,
    aztecClient,
    requireSBT,
  };

  const { txHash, skillHash, isHumanVerified } = await submitTierProofWithSBTCheck(submitParams);

  // 2. Instantiate leaderboard client
  const client = new LeaderboardClient({ baseUrl: indexerBaseUrl });

  // 3. Polling loop to wait for indexer to ingest the event
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const leaderboard = await client.getLeaderboard(skillHash as `0x${string}`);

      // Check if user's entry is in the leaderboard
      const found = leaderboard.some(
        (entry) => entry.user_address.toLowerCase() === userAddress.toLowerCase()
      );

      if (found) {
        return { 
          txHash, 
          skillHash, 
          leaderboard, 
          isHumanVerified,
          indexerAvailable: true,
        };
      }
    } catch (error) {
      // If indexer is not reachable, log warning but continue polling
      console.warn(
        `[leaderboardOrchestrator] Indexer request failed (attempt ${i + 1}/${maxAttempts}):`,
        error instanceof Error ? error.message : String(error)
      );
    }

    // Wait before next attempt (except on last iteration)
    if (i < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
  }

  // If we get here, polling timed out, but transaction succeeded
  // Return partial result with warning instead of throwing error
  // This allows the UI to show the transaction was successful even if indexer isn't ready
  return {
    txHash,
    skillHash,
    leaderboard: [], // Empty leaderboard since indexer hasn't ingested yet
    isHumanVerified,
    indexerAvailable: false,
    warning: `Transaction submitted successfully (tx: ${txHash}), but indexer hasn't ingested the data yet. ` +
             `The indexer may need more time, or it may not be running. ` +
             `You can check the transaction on the blockchain explorer.`,
  };
}

