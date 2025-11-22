export type SkillNode = {
  id: string;          // normalized skill id, e.g. "rust", "zk-proofs"
  name: string;        // display name
  level: number;       // integer level, e.g. 1–10
  xp: number;          // optional: accumulated XP toward next level
  // In Phase 2 we might not use children yet, but model it for the tree:
  children?: SkillNode[];
};

export function normalizeSkillId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

