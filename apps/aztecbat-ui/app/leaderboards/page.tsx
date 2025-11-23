/**
 * Leaderboards List Page
 *
 * Displays a list of all available skills with preview data from their leaderboards.
 */

import Link from 'next/link';
import { Avatar } from '../../components/Avatar';

// Mock skills data - in production this would come from the backend
const mockSkills = [
  {
    id: 'rust-foundations',
    name: 'Rust Foundations',
    description: 'Master the fundamentals of Rust programming',
  },
  {
    id: 'zero-knowledge-basics',
    name: 'Zero-Knowledge Basics',
    description: 'Learn the core concepts of zero-knowledge proofs',
  },
  {
    id: 'advanced-circuits',
    name: 'Advanced Circuits',
    description: 'Build complex circuits with Noir',
  },
  {
    id: 'aztec-protocol',
    name: 'Aztec Protocol',
    description: 'Deep dive into Aztec privacy technology',
  },
];

// Mock leaderboard preview data for each skill
const getLeaderboardPreview = (skillId: string) => {
  const previews: Record<string, Array<{ rank: number; displayName: string; tier: number }>> = {
    'rust-foundations': [
      { rank: 1, displayName: 'alice.eth', tier: 4 },
      { rank: 2, displayName: 'bob.eth', tier: 3 },
      { rank: 3, displayName: 'charlie.eth', tier: 3 },
    ],
    'zero-knowledge-basics': [
      { rank: 1, displayName: 'zkmaster.eth', tier: 4 },
      { rank: 2, displayName: 'bob.eth', tier: 4 },
      { rank: 3, displayName: 'shadowmage.eth', tier: 3 },
    ],
    'advanced-circuits': [
      { rank: 1, displayName: 'circuitbuilder.eth', tier: 4 },
      { rank: 2, displayName: 'bob.eth', tier: 4 },
      { rank: 3, displayName: 'shadowmage.eth', tier: 3 },
    ],
    'aztec-protocol': [
      { rank: 1, displayName: 'shadowmage.eth', tier: 4 },
      { rank: 2, displayName: 'alice.eth', tier: 2 },
      { rank: 3, displayName: 'aztecexplorer.eth', tier: 1 },
    ],
  };
  return previews[skillId] || [];
};

function getTierName(tier: number): string {
  const tierMap: Record<number, string> = {
    1: 'Bronze',
    2: 'Silver',
    3: 'Gold',
    4: 'Master',
  };
  return tierMap[tier] || `Tier ${tier}`;
}

function getTierColor(tier: number): string {
  const colorMap: Record<number, string> = {
    1: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    2: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600',
    3: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    4: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700',
  };
  return colorMap[tier] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
}

export default function LeaderboardsPage() {
  return (
    <main className="max-w-4xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leaderboards</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore leaderboards for each skill. Celebrate progress and mastery together.
        </p>
      </div>

      <div className="grid gap-6">
        {mockSkills.map((skill) => {
          const preview = getLeaderboardPreview(skill.id);
          return (
            <div
              key={skill.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 overflow-hidden hover:scale-[1.01] transition-transform duration-200 ease-out"
            >
              <Link
                href={`/leaderboard/${skill.id}`}
                className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {skill.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{skill.description}</p>
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium ml-4">
                    View full →
                  </div>
                </div>

                {/* Leaderboard Preview */}
                {preview.length > 0 ? (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Top Learners
                    </h3>
                    <div className="space-y-2">
                      {preview.map((entry) => (
                        <div
                          key={entry.rank}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 dark:text-gray-400 font-medium w-8">
                              #{entry.rank}
                            </span>
                            <Avatar 
                              displayName={entry.displayName} 
                              address={entry.displayName} 
                              size="sm" 
                            />
                            <span className="text-gray-900 dark:text-gray-100">
                              {entry.displayName}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getTierColor(entry.tier)}`}
                          >
                            {getTierName(entry.tier)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No entries yet. Be the first to complete this skill!
                    </p>
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
