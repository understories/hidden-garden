import { NextRequest, NextResponse } from 'next/server';
import { getPublicSkillProfile } from '@hidden-garden/core-logic';

/**
 * API Route: GET /api/dev/public-profile
 * 
 * Developer endpoint for fetching public skill profile
 * 
 * Query parameters:
 * - address: User's Ethereum address
 * - chainId: Chain ID (default: 11155111 for Sepolia)
 * 
 * Returns:
 * - { ok: true, profile: PublicSkillProfile } on success
 * - { ok: false, error: string } on error
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const chainIdParam = searchParams.get('chainId');

    console.log('[public-profile] Request:', { address, chainId: chainIdParam });

    // Validate address
    if (!address) {
      return NextResponse.json(
        { ok: false, error: 'address query parameter is required' },
        { status: 400 }
      );
    }

    // Parse chainId (default to Sepolia)
    const chainId = chainIdParam ? parseInt(chainIdParam, 10) : 11155111;
    if (isNaN(chainId)) {
      return NextResponse.json(
        { ok: false, error: `Invalid chainId: ${chainIdParam}` },
        { status: 400 }
      );
    }

    // Get indexer base URL from environment
    const indexerBaseUrl = process.env.NEXT_PUBLIC_INDEXER_BASE_URL;

    console.log('[public-profile] Calling getPublicSkillProfile:', {
      chainId,
      address,
      indexerBaseUrl: indexerBaseUrl || 'not set',
    });

    // Call getPublicSkillProfile
    const profile = await getPublicSkillProfile({
      chainId,
      address,
      indexerBaseUrl,
    });

    console.log('[public-profile] Success:', {
      humanVerified: profile.humanVerified,
      aztecBuilderTier: profile.aztecBuilderTier,
    });

    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    console.error('[public-profile] Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}

