export type SkillNode = {
  id: string;
  name: string;
  level: number;
  xp: number;
};

export function normalizeSkillId(name: string): string {
  return name.trim().toLowerCase();
}

