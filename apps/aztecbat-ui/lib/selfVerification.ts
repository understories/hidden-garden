/**
 * Self Verification Flow
 *
 * This module handles the Self verification flow initiation.
 * For hackathon demo, this opens Self documentation.
 * In production, this will be replaced with Self SDK integration.
 */

/**
 * Starts the Self verification flow.
 *
 * Current implementation (hackathon demo):
 * - Opens Self.xyz documentation in a new tab
 *
 * Future implementation:
 * - Initialize Self SDK
 * - Generate proof payload
 * - Handle deep link to Self app
 * - Process verification callback
 *
 * @param userAddress - The user's Ethereum address (optional, for future use)
 */
export function startSelfVerificationFlow(userAddress?: `0x${string}`): void {
  // For hackathon demo: open Self documentation
  // In production, this will be replaced with actual SDK integration
  const selfDocsUrl = 'https://docs.self.xyz';
  window.open(selfDocsUrl, '_blank', 'noopener,noreferrer');

  // TODO: Future implementation
  // 1. Initialize Self SDK with config matching contract
  // 2. Generate proof payload
  // 3. Handle deep link or embedded flow
  // 4. Process verification callback
  // 5. Call contract's verifyAndMint function
}

