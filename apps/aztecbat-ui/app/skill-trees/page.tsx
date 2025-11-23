/**
 * Skill Trees Page (Forest View)
 *
 * An alternate forest view where skills are represented as actual tree-like shapes.
 * More organic and tree-like than the grid view.
 */

import Link from 'next/link';

// Mock skill tree data - in production this would come from the backend
const mockSkillTrees = [
  {
    skillId: 'aztec-protocol',
    skillName: 'Aztec Protocol',
    participantCount: 1247,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 15, mixed: 15, private: 70 },
    size: 'large' as const, // Tree size based on engagement
  },
  {
    skillId: 'rust-foundations',
    skillName: 'Rust Foundations',
    participantCount: 2156,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 70, mixed: 20, private: 10 },
    size: 'xlarge' as const,
  },
  {
    skillId: 'zero-knowledge-basics',
    skillName: 'Zero-Knowledge Basics',
    participantCount: 892,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 40, mixed: 40, private: 20 },
    size: 'medium' as const,
  },
  {
    skillId: 'advanced-circuits',
    skillName: 'Advanced Circuits',
    participantCount: 634,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 20, mixed: 20, private: 60 },
    size: 'medium' as const,
  },
  {
    skillId: 'l1-l2-bridging',
    skillName: 'L1 → L2 Bridging',
    participantCount: 445,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 35, mixed: 45, private: 20 },
    size: 'small' as const,
  },
  {
    skillId: 'noir-basics',
    skillName: 'Aztec Noir Basics',
    participantCount: 1123,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 75, mixed: 15, private: 10 },
    size: 'large' as const,
  },
];

type PrivacyMode = 'public-heavy' | 'mixed' | 'mostly-private';
type TreeSize = 'small' | 'medium' | 'large' | 'xlarge';

function getTreeColors(privacyMode: PrivacyMode): {
  trunk: string;
  foliage: string;
  glow: string;
} {
  switch (privacyMode) {
    case 'public-heavy':
      return {
        trunk: 'bg-emerald-600 dark:bg-emerald-500',
        foliage: 'from-emerald-400 via-cyan-400 to-teal-400',
        glow: 'shadow-emerald-400/40 dark:shadow-emerald-400/50',
      };
    case 'mixed':
      return {
        trunk: 'bg-amber-600 dark:bg-amber-500',
        foliage: 'from-amber-400 via-orange-400 to-yellow-400',
        glow: 'shadow-amber-400/40 dark:shadow-amber-400/50',
      };
    case 'mostly-private':
      return {
        trunk: 'bg-indigo-600 dark:bg-indigo-500',
        foliage: 'from-blue-400 via-indigo-400 to-purple-400',
        glow: 'shadow-indigo-400/30 dark:shadow-indigo-400/40',
      };
  }
}

function getTreeSize(size: TreeSize): {
  width: string;
  height: string;
  trunkHeight: string;
  foliageSize: string;
} {
  switch (size) {
    case 'small':
      return {
        width: 'w-20',
        height: 'h-32',
        trunkHeight: 'h-8',
        foliageSize: 'w-16 h-16',
      };
    case 'medium':
      return {
        width: 'w-24',
        height: 'h-40',
        trunkHeight: 'h-10',
        foliageSize: 'w-20 h-20',
      };
    case 'large':
      return {
        width: 'w-28',
        height: 'h-48',
        trunkHeight: 'h-12',
        foliageSize: 'w-24 h-24',
      };
    case 'xlarge':
      return {
        width: 'w-32',
        height: 'h-56',
        trunkHeight: 'h-14',
        foliageSize: 'w-28 h-28',
      };
  }
}

function SkillTree({
  skillId,
  skillName,
  participantCount,
  privacyMode,
  privacyStats,
  size,
}: typeof mockSkillTrees[0]) {
  const colors = getTreeColors(privacyMode);
  const dimensions = getTreeSize(size);

  return (
    <Link
      href={`/leaderboard/${skillId}`}
      className={`group relative flex flex-col items-center ${dimensions.width} ${dimensions.height} transition-all duration-300 hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-blue-500`}
    >
      {/* Tree Foliage (Crown) */}
      <div
        className={`relative ${dimensions.foliageSize} rounded-full bg-gradient-to-br ${colors.foliage} opacity-80 dark:opacity-90 ${colors.glow} shadow-lg group-hover:shadow-xl group-hover:opacity-100 transition-all duration-300 mb-1`}
      >
        {/* Foliage layers for depth */}
        <div className={`absolute inset-0 ${dimensions.foliageSize} rounded-full bg-gradient-to-tr ${colors.foliage} opacity-50 blur-sm`} />
        <div className={`absolute inset-2 ${dimensions.foliageSize === 'w-16 h-16' ? 'w-12 h-12' : dimensions.foliageSize === 'w-20 h-20' ? 'w-14 h-14' : dimensions.foliageSize === 'w-24 h-24' ? 'w-18 h-18' : 'w-20 h-20'} rounded-full bg-gradient-to-br ${colors.foliage} opacity-70`} />
      </div>

      {/* Tree Trunk */}
      <div
        className={`${dimensions.trunkHeight} w-3 ${colors.trunk} rounded-b-md group-hover:brightness-110 transition-all duration-300`}
      />

      {/* Skill Name Label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 text-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
          {skillName}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {participantCount.toLocaleString()} participants
        </div>
      </div>

      {/* Tooltip on hover */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-focus:opacity-100 group-hover:visible group-focus:visible transition-all duration-200 pointer-events-none z-20 whitespace-nowrap">
        <div className="font-medium mb-1">{skillName}</div>
        <div className="space-y-0.5 text-gray-300 dark:text-gray-400">
          <div>{participantCount.toLocaleString()} participants</div>
          <div className="text-xs">
            {privacyStats.public}% public, {privacyStats.mixed}% mixed, {privacyStats.private}% private
          </div>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
      </div>
    </Link>
  );
}

export default function SkillTreesPage() {
  return (
    <main className="max-w-7xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Trees</h1>
        <p className="text-gray-600 dark:text-gray-400">
          A lunar-punk forest where each skill grows as a tree. Size reflects engagement; colors reflect privacy patterns.
        </p>
      </div>

      {/* Legend */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800/50 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Forest Colors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  More public reveals
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Spring canopy
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Mixed privacy
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Autumn blend
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  More private journeys
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Moonlit branches
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Each skill grows as a tree in this lunar forest. Taller trees have more participants. The glow reflects privacy patterns—brighter for public reveals, cooler for private journeys. Your learning shapes the forest, whether you reveal or keep it private.
          </p>
        </div>
      </div>

      {/* Forest Layout - Organic, scattered trees */}
      <div className="relative min-h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 overflow-hidden">
        {/* Forest floor texture */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/20 to-transparent" />
        </div>

        {/* Trees positioned organically */}
        <div className="relative h-full flex items-end justify-around flex-wrap gap-8">
          {mockSkillTrees.map((tree, index) => (
            <div
              key={tree.skillId}
              className="flex-shrink-0"
              style={{
                marginBottom: `${Math.random() * 20}px`,
                marginLeft: index % 2 === 0 ? '0' : '20px',
                marginRight: index % 2 === 1 ? '0' : '20px',
              }}
            >
              <SkillTree {...tree} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

