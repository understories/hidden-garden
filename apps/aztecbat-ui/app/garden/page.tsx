'use client';

/**
 * My Garden Page
 *
 * Displays the user's complete private skill tree and quest progress.
 * This mirrors what is stored privately in Aztec.
 */

import { useState } from 'react';

// Mock private quest completions - in production this would come from Aztec
const mockPrivateQuests = [
  {
    skillId: 'aztec-protocol',
    skillName: 'Aztec Protocol',
    quests: [
      {
        questId: 'quest-1',
        questName: 'Quest 1',
        completed: true,
        score: 92,
        maxScore: 100,
        completedAt: '2024-01-15T10:30:00Z',
        tier: 4,
      },
      {
        questId: 'quest-2',
        questName: 'Quest 2',
        completed: true,
        score: 88,
        maxScore: 100,
        completedAt: '2024-01-16T14:20:00Z',
        tier: 3,
      },
      {
        questId: 'quest-3',
        questName: 'Quest 3',
        completed: false,
        score: null,
        maxScore: 100,
        completedAt: null,
        tier: null,
      },
    ],
  },
  {
    skillId: 'rust-foundations',
    skillName: 'Rust Foundations',
    quests: [
      {
        questId: 'quest-1',
        questName: 'Quest 1',
        completed: true,
        score: 85,
        maxScore: 100,
        completedAt: '2024-01-10T09:15:00Z',
        tier: 3,
      },
      {
        questId: 'quest-2',
        questName: 'Quest 2',
        completed: true,
        score: 78,
        maxScore: 100,
        completedAt: '2024-01-12T11:30:00Z',
        tier: 2,
      },
      {
        questId: 'quest-3',
        questName: 'Quest 3',
        completed: true,
        score: 90,
        maxScore: 100,
        completedAt: '2024-01-14T16:45:00Z',
        tier: 4,
      },
    ],
  },
  {
    skillId: 'zero-knowledge-basics',
    skillName: 'Zero-Knowledge Basics',
    quests: [
      {
        questId: 'quest-1',
        questName: 'Quest 1',
        completed: true,
        score: 82,
        maxScore: 100,
        completedAt: '2024-01-08T13:20:00Z',
        tier: 2,
      },
      {
        questId: 'quest-2',
        questName: 'Quest 2',
        completed: false,
        score: null,
        maxScore: 100,
        completedAt: null,
        tier: null,
      },
      {
        questId: 'quest-3',
        questName: 'Quest 3',
        completed: false,
        score: null,
        maxScore: 100,
        completedAt: null,
        tier: null,
      },
    ],
  },
];

// Mock badges
const mockBadges = [
  {
    id: 'aztec-builder-explorer',
    name: 'Aztec Builder Path Explorer',
    description: 'Completed multiple Aztec Protocol quests',
    earnedAt: '2024-01-16T14:20:00Z',
  },
];

function getTierName(tier: number | null): string {
  if (!tier) return 'Not completed';
  const tierMap: Record<number, string> = {
    1: 'Bronze',
    2: 'Silver',
    3: 'Gold',
    4: 'Master',
  };
  return tierMap[tier] || `Tier ${tier}`;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function GardenPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  return (
    <main className="max-w-4xl mx-auto space-y-6 py-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">My Garden</h1>
          <span className="text-lg" title="Private view - stored in Aztec">🔒</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Your complete private skill tree and learning journey. This mirrors what is stored privately in Aztec.
        </p>
      </div>

      {/* Privacy Disclaimer */}
      <div className="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
          We store quest completions privately in Aztec; this local list mirrors what lives there, but the only thing we reveal publicly is the ZK proof of tier.
        </p>
      </div>

      {/* Badges Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Badges
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Achievements earned through your private quest completions.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {mockBadges.map((badge) => (
            <div
              key={badge.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {badge.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Earned: {formatDate(badge.earnedAt)}
                  </p>
                </div>
                <span className="text-2xl ml-2">🏆</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Private Quest Completions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Private Quest Completions <span className="text-sm font-normal text-gray-500 dark:text-gray-400">🔒</span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your complete quest history. All data is stored privately in Aztec.
          </p>
        </div>

        <div className="space-y-4">
          {mockPrivateQuests.map((skill) => {
            const completedQuests = skill.quests.filter(q => q.completed);
            const totalQuests = skill.quests.length;
            const averageScore = completedQuests.length > 0
              ? Math.round(completedQuests.reduce((sum, q) => sum + (q.score || 0), 0) / completedQuests.length)
              : 0;

            return (
              <div
                key={skill.skillId}
                className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 overflow-hidden"
              >
                <button
                  onClick={() => setSelectedSkill(selectedSkill === skill.skillId ? null : skill.skillId)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors text-left"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {skill.skillName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{completedQuests.length}/{totalQuests} quests completed</span>
                      {completedQuests.length > 0 && (
                        <span>Avg score: {averageScore}%</span>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500">
                    {selectedSkill === skill.skillId ? '▼' : '▶'}
                  </span>
                </button>

                {selectedSkill === skill.skillId && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    {skill.quests.map((quest) => (
                      <div
                        key={quest.questId}
                        className={`border rounded-lg p-3 ${
                          quest.completed
                            ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {quest.questName}
                              </h4>
                              {quest.completed && (
                                <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                                  ✓ Completed
                                </span>
                              )}
                            </div>
                            {quest.completed ? (
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Score:</span>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {quest.score}/{quest.maxScore}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Tier:</span>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {getTierName(quest.tier)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {formatDate(quest.completedAt)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Not yet completed
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Note */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          This is your private view. All quest completions are stored securely in Aztec. Only ZK proofs of tiers are revealed publicly.
        </p>
      </div>
    </main>
  );
}

