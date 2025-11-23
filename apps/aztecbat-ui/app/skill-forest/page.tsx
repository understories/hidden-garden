/**
 * Skill Forest Page
 *
 * A lunar-punk forest view of skills across the network.
 * Shows skills as tree tiles with growth and privacy-based glow.
 */

'use client';

import { SkillTreeTile } from '../../components/SkillTreeTile';

// Mock skill tree data - in production this would come from the backend
const mockSkillTrees = [
  {
    skillId: 'aztec-protocol',
    skillName: 'Aztec Noir Basics',
    participantCount: 1247,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 15, mixed: 15, private: 70 },
    quests: [
      { id: 'quest-1', name: 'Quest 1', participantCount: 450, privacyMode: 'private-heavy' as const },
    ],
    treeType: 'conifer' as const,
  },
  {
    skillId: 'rust-foundations',
    skillName: 'Rust Foundations',
    participantCount: 2156,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 70, mixed: 20, private: 10 },
    quests: [
      { id: 'quest-1', name: 'Quest 1', participantCount: 890, privacyMode: 'public-heavy' as const },
    ],
    treeType: 'round' as const,
  },
  {
    skillId: 'zero-knowledge-basics',
    skillName: 'Zero-Knowledge Basics',
    participantCount: 892,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 40, mixed: 40, private: 20 },
    quests: [
      { id: 'quest-1', name: 'Quest 1', participantCount: 420, privacyMode: 'mixed' as const },
    ],
    treeType: 'mushroom' as const,
  },
  {
    skillId: 'advanced-circuits',
    skillName: 'Advanced Circuits',
    participantCount: 634,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 20, mixed: 20, private: 60 },
    quests: [
      { id: 'quest-1', name: 'Quest 1', participantCount: 280, privacyMode: 'private-heavy' as const },
    ],
    treeType: 'round' as const,
  },
  {
    skillId: 'l1-l2-bridging',
    skillName: 'L1 → L2 Bridging',
    participantCount: 445,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 35, mixed: 45, private: 20 },
    quests: [
      { id: 'quest-1', name: 'Quest 1', participantCount: 200, privacyMode: 'mixed' as const },
    ],
    treeType: 'conifer' as const,
  },
  {
    skillId: 'noir-basics',
    skillName: 'Aztec Noir Advanced',
    participantCount: 1123,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 75, mixed: 15, private: 10 },
    quests: [
      { id: 'quest-1', name: 'Quest 1', participantCount: 520, privacyMode: 'public-heavy' as const },
    ],
    treeType: 'mushroom' as const,
  },
];

export default function SkillForestPage() {
  return (
    <main className="max-w-6xl mx-auto space-y-6 py-8">

      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Forest</h1>
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
              <div className="w-4 h-4 rounded-full bg-[#7dd87d] border border-green-300/50 dark:border-green-400/30 flex-shrink-0 mt-0.5 shadow-sm" />
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
              <div className="w-4 h-4 rounded-full bg-[#f4a460] border border-amber-300/50 dark:border-amber-400/30 flex-shrink-0 mt-0.5 shadow-sm" />
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
              <div className="w-4 h-4 rounded-full bg-[#87ceeb] border border-blue-300/50 dark:border-blue-400/30 flex-shrink-0 mt-0.5 shadow-sm" />
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
            quests={skill.quests}
            treeType={skill.treeType}
          />
        ))}
      </div>
    </main>
  );
}

