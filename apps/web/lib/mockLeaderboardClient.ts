import type {
  PublicSkillTier,
  UserPublicSkill,
  LeaderboardAPI,
} from '@hidden-garden/common';

// Simple mock users for now.
const MOCK_USERS = {
  alice: {
    address: '0x1111111111111111111111111111111111111111' as const,
    ensName: 'alice.eth',
  },
  bob: {
    address: '0x2222222222222222222222222222222222222222' as const,
    ensName: 'bob.eth',
  },
  carol: {
    address: '0x3333333333333333333333333333333333333333' as const,
    ensName: null,
  },
} as const;

// Helper to make ISO timestamps easily.
function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

// Mock public skills keyed by user address.
const MOCK_USER_SKILLS: Record<string, UserPublicSkill[]> = {
  [MOCK_USERS.alice.address]: [
    {
      userAddress: MOCK_USERS.alice.address,
      ensName: MOCK_USERS.alice.ensName,
      skillName: 'rust',
      skillHash: undefined,
      tier: 3,
      updatedAt: daysAgo(2),
    },
    {
      userAddress: MOCK_USERS.alice.address,
      ensName: MOCK_USERS.alice.ensName,
      skillName: 'zk',
      skillHash: undefined,
      tier: 2,
      updatedAt: daysAgo(5),
    },
  ],
  [MOCK_USERS.bob.address]: [
    {
      userAddress: MOCK_USERS.bob.address,
      ensName: MOCK_USERS.bob.ensName,
      skillName: 'rust',
      skillHash: undefined,
      tier: 4,
      updatedAt: daysAgo(1),
    },
  ],
  [MOCK_USERS.carol.address]: [
    {
      userAddress: MOCK_USERS.carol.address,
      ensName: MOCK_USERS.carol.ensName,
      skillName: 'mentoring',
      skillHash: undefined,
      tier: 5,
      updatedAt: daysAgo(3),
    },
  ],
};

const mockLeaderboardApi: LeaderboardAPI = {
  async getLeaderboard(skillId: string): Promise<PublicSkillTier[]> {
    const normalized = skillId.trim().toLowerCase();
    const allSkills: UserPublicSkill[] = Object.values(MOCK_USER_SKILLS).flat();

    // Filter by skill name for now; later we might match by hash.
    const matching = allSkills.filter((skill) => {
      const name = (skill.skillName ?? '').toLowerCase();
      return name === normalized;
    });

    // Sort by tier descending, then by updatedAt descending.
    matching.sort((a, b) => {
      if (b.tier !== a.tier) return b.tier - a.tier;
      return b.updatedAt.localeCompare(a.updatedAt);
    });

    return matching;
  },

  async getUserSkills(address: `0x${string}`): Promise<UserPublicSkill[]> {
    const key = address.toLowerCase();

    // Our mock data keys might not be lowercased, so normalize.
    const entry = Object.entries(MOCK_USER_SKILLS).find(
      ([addr]) => addr.toLowerCase() === key,
    );

    if (!entry) return [];

    const [, skills] = entry;
    return skills;
  },
};

export function formatDisplayName(entry: PublicSkillTier): string {
  if (entry.ensName && entry.ensName.length > 0) {
    return entry.ensName;
  }
  const addr = entry.userAddress;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export { mockLeaderboardApi };

