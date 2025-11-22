/**
 * SkillProofProvider
 *
 * IMPORTANT:
 * - This stub implementation is OWNED BY TEAM A.
 * - Team B and UI code MUST NOT replace this with "real" proof generation.
 * - Treat this as a stable boundary: Team B only calls this interface.
 * - Team A may later change the INTERNAL implementation (or swap the import)
 *   while keeping the interface identical.
 *
 * This interface abstracts proof generation for skill tier submissions.
 * It serves as a canonical integration boundary between Team A (proof generation)
 * and Team B (UI/contract integration).
 */

export type SkillProofRequest = {
  skillHash: string; // bytes32 skill hash (0x-prefixed hex string)
  minTier: number; // Minimum tier to prove (1-10)
};

export type SkillProofResult = {
  proofData: string; // Proof bytes as hex string (0x-prefixed)
  claimedTier: number; // The tier that was proven (should be >= minTier)
};

export interface SkillProofProvider {
  /**
   * Generate a proof for a skill tier threshold.
   *
   * @param req - Proof request containing skillHash and minTier
   * @returns Promise resolving to proof data and claimed tier
   */
  generateProof(req: SkillProofRequest): Promise<SkillProofResult>;
}

/**
 * Team A Stub Implementation
 *
 * OWNERSHIP: This implementation is owned by Team A.
 * Team B must not modify or replace this class.
 *
 * Returns fake proof data for development/demo purposes.
 * This implementation obeys the SkillProofProvider interface.
 * Team A may later replace this with a real implementation in a separate package,
 * but the interface will remain stable.
 */
export class StubSkillProofProvider implements SkillProofProvider {
  async generateProof(req: SkillProofRequest): Promise<SkillProofResult> {
    // Simulate proof generation delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return fake proof data
    // NOTE: Team A may replace this implementation with real proof generation
    // in a separate package, but the interface and this class location remain stable.
    const fakeProofData = `0x${'1'.repeat(128)}`; // 64 bytes of fake proof data

    return {
      proofData: fakeProofData,
      claimedTier: req.minTier, // For stub, claimed tier equals min tier
    };
  }
}

/**
 * Default stub instance for use in development
 *
 * OWNERSHIP: This instance is provided by Team A.
 * Team B should use this instance and must not create alternative implementations.
 */
export const stubSkillProofProvider = new StubSkillProofProvider();

