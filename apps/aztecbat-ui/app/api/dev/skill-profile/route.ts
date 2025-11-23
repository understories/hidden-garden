import { NextRequest, NextResponse } from 'next/server';
import { getSkillProfile } from '@hidden-garden/core-logic';
import { listAllQuests } from '@hidden-garden/game-engine';

/**
 * API Route: GET /api/dev/skill-profile
 * 
 * Developer endpoint for testing getSkillProfile()
 * 
 * Query parameters:
 * - address: User's Ethereum address
 * - chainId: Chain ID (default: 11155111 for Sepolia)
 * 
 * Returns:
 * - { ok: true, profile: SkillProfile } on success
 * - { ok: false, error: string } on error
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const chainIdParam = searchParams.get('chainId');

    console.log('[skill-profile] Request:', { address, chainId: chainIdParam });

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

    console.log('[skill-profile] Calling getSkillProfile:', {
      chainId,
      address,
      indexerBaseUrl: indexerBaseUrl || 'not set',
    });

    // Call getSkillProfile
    const profile = await getSkillProfile({
      chainId,
      address,
      indexerBaseUrl,
    });

    // Populate questSummaries from quest registry if empty
    // This mirrors what's stored privately in Aztec
    if (!profile.questSummaries || profile.questSummaries.length === 0) {
      const allQuests = listAllQuests();
      profile.questSummaries = allQuests.map(quest => ({
        id: quest.questId,
        title: quest.name,
        score: null,
        status: 'not_started' as const,
      }));
    }

    console.log('[skill-profile] Success:', {
      humanVerified: profile.humanVerified,
      aztecBuilderTier: profile.aztecBuilderTier,
      allowAgents: profile.allowAgents,
      questSummariesCount: profile.questSummaries?.length || 0,
    });

    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    console.error('[skill-profile] Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}

