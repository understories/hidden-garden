/**
 * Minimal Proof Test API
 * 
 * This endpoint tests the absolute minimum: can we generate a single proof?
 * Following the official Aztec starter pattern.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAztecClient } from '@hidden-garden/core-logic';

export async function GET(request: NextRequest) {
  try {
    const pxeUrl = process.env.AZTEC_PXE_URL || 
                   process.env.NEXT_PUBLIC_AZTEC_PXE_URL || 
                   'http://localhost:8080';
    
    console.log('[TEST PROOF] Starting minimal proof test...');
    console.log('[TEST PROOF] PXE URL:', pxeUrl);
    
    // Step 1: Create Aztec client
    console.log('[TEST PROOF] Step 1: Creating Aztec client...');
    const aztecClient = createAztecClient('real', { pxeUrl });
    console.log('[TEST PROOF] ✅ Client created');
    
    // Step 2: Initialize (this is where the logger error occurs)
    console.log('[TEST PROOF] Step 2: Initializing client...');
    await (aztecClient as any).initialize();
    console.log('[TEST PROOF] ✅ Client initialized');
    
    // Step 3: Get address
    console.log('[TEST PROOF] Step 3: Getting address...');
    const address = await aztecClient.getAddress();
    console.log('[TEST PROOF] ✅ Address:', address);
    
    // Step 4: Try to generate a minimal proof (Tier 1, score 60)
    console.log('[TEST PROOF] Step 4: Generating proof (Tier 1, score 60)...');
    const proofResult = await aztecClient.proveAztecBuilderTier(1, 60);
    console.log('[TEST PROOF] ✅ Proof result:', {
      success: proofResult.success,
      hasProof: !!proofResult.proof,
      error: proofResult.error,
    });
    
    return NextResponse.json({
      success: true,
      steps: {
        clientCreated: true,
        clientInitialized: true,
        address,
        proofGenerated: proofResult.success,
      },
      proof: proofResult.success ? {
        hasProof: !!proofResult.proof,
        proofLength: proofResult.proof?.proof?.length || 0,
        publicInputsLength: proofResult.proof?.publicInputs?.length || 0,
      } : null,
      error: proofResult.error || null,
    });
  } catch (error: any) {
    console.error('[TEST PROOF] ❌ Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || String(error),
      stack: error?.stack?.split('\n').slice(0, 10).join('\n'),
    }, { status: 500 });
  }
}

