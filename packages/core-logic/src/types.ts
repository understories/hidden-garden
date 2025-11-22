export type SkillNode = {
  id: string;
  name: string;
  level: number;
  xp: number;
};

export interface AztecBuilderTierProofInputs {
  minTier: number;
  minAverageScore: number;
  proof: `0x${string}`;
  publicInputs: `0x${string}`;
}

