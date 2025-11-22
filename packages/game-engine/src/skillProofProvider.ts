/**
 * Skill Proof Provider Interface
 *
 * This interface abstracts proof generation for skill tier submissions.
 * Team A provides a stub implementation that returns fake proof data.
 * In production, this will be replaced with actual Aztec/Noir proof generation.
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
 * Returns fake proof data for development/demo purposes.
 * This implementation obeys the SkillProofProvider interface but
 * does not generate real ZK proofs.
 */
export class StubSkillProofProvider implements SkillProofProvider {
  async generateProof(req: SkillProofRequest): Promise<SkillProofResult> {
    // Simulate proof generation delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return fake proof data
    // In production, this would be actual ZK proof bytes from Aztec/Noir
    const fakeProofData = `0x${'1'.repeat(128)}`; // 64 bytes of fake proof data

    return {
      proofData: fakeProofData,
      claimedTier: req.minTier, // For stub, claimed tier equals min tier
    };
  }
}

/**
 * Default stub instance for use in development
 */
export const stubSkillProofProvider = new StubSkillProofProvider();

