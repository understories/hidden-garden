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
 * NOTE: This route currently operates in MOCK mode for local development.
 * To switch to real Aztec devnet:
 * 1. Set NEXT_PUBLIC_USE_REAL_AZTEC=true
 * 2. Ensure Aztec devnet is running (pnpm aztec:devnet)
 * 3. Set NEXT_PUBLIC_PXE_URL to your PXE URL (e.g., http://localhost:8080)
 * 4. For signer: Use a real private key from environment variable or
 *    implement a server-side wallet pattern
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

    // Determine Aztec mode - default to MOCK for development
    // Set NEXT_PUBLIC_USE_REAL_AZTEC=true to use real Aztec devnet for live demo
    const useRealAztec = process.env.NEXT_PUBLIC_USE_REAL_AZTEC === 'true';
    let aztecMode: 'mock' | 'real' = useRealAztec ? 'real' : 'mock';
    
    // Check if Aztec SDK is available (only if trying to use real mode)
    if (aztecMode === 'real') {
      try {
        // Try to dynamically check if @aztec/aztec.js is available
        // This is a lightweight check - actual loading happens in initialize()
        await import('@aztec/aztec.js');
      } catch (error) {
        console.warn(
          '[publish-and-fetch] ⚠️  @aztec/aztec.js not available. ' +
          'Falling back to mock mode. ' +
          'Install with: pnpm add @aztec/aztec.js @aztec/accounts/testing ' +
          'or set NEXT_PUBLIC_USE_MOCK_AZTEC=true explicitly.'
        );
        aztecMode = 'mock';
      }
    }

    console.log('[publish-and-fetch] Aztec mode:', aztecMode, aztecMode === 'mock' ? '(MOCK - set NEXT_PUBLIC_USE_MOCK_AZTEC=false for real Aztec)' : '(REAL - demonstrating Aztec privacy)');

    // Create Aztec client
    const aztecClient = createAztecClient(aztecMode, {
      pxeUrl: process.env.NEXT_PUBLIC_PXE_URL || 'http://localhost:8080',
    });

    // Create signer
    // TODO: For production, use a proper server-side signer pattern
    // For now, create a mock signer that satisfies the type requirements
    // In mock mode, this won't actually send transactions
    let signer: ethers.Signer;

    if (!useMockAztec && process.env.SERVER_PRIVATE_KEY) {
      // Real mode: use private key from environment
      const provider = new ethers.JsonRpcProvider(
        process.env.RPC_URL || 'http://localhost:8545'
      );
      signer = new ethers.Wallet(process.env.SERVER_PRIVATE_KEY, provider);
      console.log('[publish-and-fetch] Using real signer from SERVER_PRIVATE_KEY');
    } else {
      // Mock mode: create a dummy signer that won't actually send transactions
      // The function will work in mock mode for testing
      const provider = new ethers.JsonRpcProvider(
        'http://localhost:8545' // Dummy provider
      );
      signer = new ethers.Wallet(
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // Hardhat default
        provider
      );
      console.log('[publish-and-fetch] Using mock signer (transactions will be mocked)');
    }

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
      aztecMode,
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

