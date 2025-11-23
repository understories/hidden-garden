/**
 * Skill Tree Page
 *
 * A lunar-punk forest view of skills across the network.
 * Shows skills as tree tiles with growth and privacy-based glow.
 */

import { SkillTreeTile } from '../../components/SkillTreeTile';

// Mock skill tree data - in production this would come from the backend
const mockSkillTrees = [
  {
    skillId: 'aztec-protocol',
    skillName: 'Aztec Protocol',
    participantCount: 1247,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 15, mixed: 15, private: 70 },
  },
  {
    skillId: 'rust-foundations',
    skillName: 'Rust Foundations',
    participantCount: 2156,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 70, mixed: 20, private: 10 },
  },
  {
    skillId: 'zero-knowledge-basics',
    skillName: 'Zero-Knowledge Basics',
    participantCount: 892,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 40, mixed: 40, private: 20 },
  },
  {
    skillId: 'advanced-circuits',
    skillName: 'Advanced Circuits',
    participantCount: 634,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 20, mixed: 20, private: 60 },
  },
  {
    skillId: 'l1-l2-bridging',
    skillName: 'L1 → L2 Bridging',
    participantCount: 445,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 35, mixed: 45, private: 20 },
  },
  {
    skillId: 'noir-basics',
    skillName: 'Aztec Noir Basics',
    participantCount: 1123,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 75, mixed: 15, private: 10 },
  },
];

export default function SkillTreePage() {
  return (
    <main className="max-w-6xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Tree</h1>
        <p className="text-gray-600 dark:text-gray-400">
          A lunar-punk forest view of skills across the network.
        </p>
      </div>

      {/* Legend */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800/50 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Forest Colors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Public-heavy */}
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400/30 via-cyan-400/25 to-teal-400/30 dark:from-emerald-400/40 dark:via-cyan-400/35 dark:to-teal-400/40 border-2 border-emerald-400/30 dark:border-emerald-400/40 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  More public reveals
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Spring canopy
                </div>
              </div>
            </div>

            {/* Mixed */}
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400/30 via-orange-400/25 to-yellow-400/30 dark:from-amber-400/40 dark:via-orange-400/35 dark:to-yellow-400/40 border-2 border-amber-400/30 dark:border-amber-400/40 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Mixed privacy
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Autumn blend
                </div>
              </div>
            </div>

            {/* Mostly private */}
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400/25 via-indigo-400/20 to-purple-400/25 dark:from-blue-400/35 dark:via-indigo-400/30 dark:to-purple-400/35 border-2 border-blue-400/20 dark:border-indigo-400/30 flex-shrink-0 mt-0.5" />
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

        {/* Explanatory Copy */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Each skill in this lunar forest grows from the way people learn in Aztec. Brighter trees reflect more public reveals; cooler tones signal more private paths. Your learning can stay private while still shaping the ecosystem. Every choice—whether to reveal or keep private—contributes to the forest's unique glow.
          </p>
        </div>
      </div>

      {/* Bioluminescent Forest Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSkillTrees.map((skill) => (
          <SkillTreeTile
            key={skill.skillId}
            skillId={skill.skillId}
            skillName={skill.skillName}
            participantCount={skill.participantCount}
            privacyMode={skill.privacyMode}
            privacyStats={skill.privacyStats}
          />
        ))}
      </div>
    </main>
  );
}

