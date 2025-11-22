export interface SkillReveal {
  id: number;
  user_address: string;
  skill_hash: string;
  tier: number;
  block_number: number;
  tx_hash: string;
  timestamp: number;
  created_at: number;
}

export interface SkillRevealInsert {
  user_address: string;
  skill_hash: string;
  tier: number;
  block_number: number;
  tx_hash: string;
  timestamp: number;
}

