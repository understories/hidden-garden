import { NextRequest, NextResponse } from 'next/server';
import { publishAndFetchAztecBuilderLeaderboard } from '@hidden-garden/core-logic';
import { createAztecClient } from '@hidden-garden/core-logic';
import { ethers } from 'ethers';

/**
 * API Route: POST /api/dev/publish-and-fetch
 * 
 * Developer endpoint for testing publishAndFetchAztecBuilderLeaderboard()
 * 
 * Body:
 * - address: User's Ethereum address
 * - chainId: Chain ID
 * - minTier: Minimum tier to prove (1-4)
 * - minAverageScore: Minimum average score (0-100)
 * 
 * Returns:
 * - { ok: true, txHash, skillHash, leaderboard } on success
 * - { ok: false, error: string } on error
 * 
 * Requires:
 * - Aztec PXE running at PXE_URL (default: http://localhost:8080)
 * - SERVER_PRIVATE_KEY environment variable set
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, chainId, minTier, minAverageScore, requireSBT } = body;

    console.log('[publish-and-fetch] Request:', {
      address,
      chainId,
      minTier,
      minAverageScore,
    });

    // Validate inputs
    if (!address) {
      return NextResponse.json(
        { ok: false, error: 'address is required in request body' },
        { status: 400 }
      );
    }

    if (!chainId || typeof chainId !== 'number') {
      return NextResponse.json(
        { ok: false, error: 'chainId must be a number' },
        { status: 400 }
      );
    }

    if (!minTier || minTier < 1 || minTier > 4) {
      return NextResponse.json(
        { ok: false, error: 'minTier must be between 1 and 4' },
        { status: 400 }
      );
    }

    if (
      minAverageScore === undefined ||
      minAverageScore < 0 ||
      minAverageScore > 100
    ) {
      return NextResponse.json(
        { ok: false, error: 'minAverageScore must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Require real Aztec PXE connection
    const pxeUrl = process.env.NEXT_PUBLIC_PXE_URL || 'http://localhost:8080';
    
    // Verify PXE is reachable before proceeding using JSON-RPC health check
    const { checkPXEHealth, getPXEErrorMessage } = await import('@hidden-garden/core-logic');
    try {
      const healthResult = await checkPXEHealth(pxeUrl, 3000);
      if (!healthResult.healthy) {
        throw new Error(healthResult.error || 'PXE health check failed');
      }
    } catch (error) {
      throw new Error(getPXEErrorMessage(pxeUrl, error));
    }

    console.log('[publish-and-fetch] Aztec mode: REAL');

    // Create Aztec client (REAL MODE ONLY)
    const aztecClient = createAztecClient('real', {
      pxeUrl,
    });

    // Create signer (always real for dev UI)
    // CRITICAL: Never use hardcoded private keys
    let signer: ethers.Signer;

    if (!process.env.SERVER_PRIVATE_KEY) {
      throw new Error(
        'SERVER_PRIVATE_KEY environment variable is required. ' +
        'Never use hardcoded private keys in production code. ' +
        'Set SERVER_PRIVATE_KEY in your .env.local file.'
      );
    }

    // Use private key from environment
    const provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || 'http://localhost:8545'
    );
    signer = new ethers.Wallet(process.env.SERVER_PRIVATE_KEY, provider);
    console.log('[publish-and-fetch] Using signer from SERVER_PRIVATE_KEY');

    // Get indexer base URL
    const indexerBaseUrl =
      process.env.INDEXER_BASE_URL ||
      process.env.NEXT_PUBLIC_INDEXER_BASE_URL;

    if (!indexerBaseUrl) {
      console.warn(
        '[publish-and-fetch] WARNING: indexerBaseUrl not set. Polling will fail.'
      );
    }

    console.log('[publish-and-fetch] Calling publishAndFetchAztecBuilderLeaderboard:', {
      chainId,
      userAddress: address,
      minTier,
      minAverageScore,
      requireSBT: requireSBT || false,
      indexerBaseUrl: indexerBaseUrl || 'not set',
      aztecMode: 'real', // Always real mode for dev UI
    });

    // Call publishAndFetchAztecBuilderLeaderboard
    const result = await publishAndFetchAztecBuilderLeaderboard({
      chainId,
      userAddress: address,
      minTier,
      minAverageScore,
      signer,
      aztecClient,
      indexerBaseUrl,
      requireSBT: requireSBT || false,
    });

    console.log('[publish-and-fetch] Success:', {
      txHash: result.txHash,
      skillHash: result.skillHash,
      leaderboardEntries: result.leaderboard.length,
      isHumanVerified: result.isHumanVerified,
      indexerAvailable: result.indexerAvailable,
    });

    return NextResponse.json({
      ok: true,
      txHash: result.txHash,
      skillHash: result.skillHash,
      leaderboard: result.leaderboard,
      isHumanVerified: result.isHumanVerified,
      indexerAvailable: result.indexerAvailable,
      warning: result.warning,
    });
  } catch (error) {
    console.error('[publish-and-fetch] Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}

