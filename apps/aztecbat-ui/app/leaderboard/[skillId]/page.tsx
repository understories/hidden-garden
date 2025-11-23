'use client';

/**
 * Leaderboard Page
 *
 * Displays the leaderboard for a specific skill with white-hat/black-hat view toggle.
 * The data remains the same; only the framing and copy change.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LeaderboardEntry } from '../../../components/LeaderboardEntry';

type LeaderboardPageProps = {
  params: Promise<{
    skillId: string;
  }>;
};

// Mock skills lookup - in production this would come from the backend
const mockSkills: Record<string, { name: string }> = {
  'rust-foundations': { name: 'Rust Foundations' },
  'zero-knowledge-basics': { name: 'Zero-Knowledge Basics' },
  'advanced-circuits': { name: 'Advanced Circuits' },
  'aztec-protocol': { name: 'Aztec Protocol' },
};

// Mock leaderboard data - varies by skill
// In production this would come from the backend and be filtered by skillId
const getMockLeaderboardData = (skillId: string) => {
  // Base data that varies by skill
  const baseData: Record<string, Array<{
    rank: number;
    displayName: string;
    address: string;
    tier: number;
    proofOfHuman: boolean;
  }>> = {
    'rust-foundations': [
      { rank: 1, displayName: 'alice.eth', address: '0x1234567890123456789012345678901234567890', tier: 4, proofOfHuman: true },
      { rank: 2, displayName: 'bob.eth', address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', tier: 3, proofOfHuman: true },
      { rank: 3, displayName: 'charlie.eth', address: '0xfedcba9876543210fedcba9876543210fedcba98', tier: 3, proofOfHuman: true },
      { rank: 4, displayName: 'circuitbuilder.eth', address: '0xaaaabbbbccccddddeeeeffff1111222233334444', tier: 3, proofOfHuman: true },
      { rank: 5, displayName: 'dana.eth', address: '0x2468135790246813579024681357902468135790', tier: 2, proofOfHuman: true },
      { rank: 6, displayName: '0x9876...5432', address: '0x9876543210987654321098765432109876543210', tier: 2, proofOfHuman: false },
      { rank: 7, displayName: 'rustlearner.eth', address: '0x5555666677778888999900001111222233334444', tier: 2, proofOfHuman: true },
    ],
    'zero-knowledge-basics': [
      { rank: 1, displayName: 'zkmaster.eth', address: '0x1111222233334444555566667777888899990000', tier: 4, proofOfHuman: true },
      { rank: 2, displayName: 'bob.eth', address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', tier: 4, proofOfHuman: true },
      { rank: 3, displayName: 'shadowmage.eth', address: 'shadowmage.eth', tier: 3, proofOfHuman: true },
      { rank: 4, displayName: 'alice.eth', address: '0x1234567890123456789012345678901234567890', tier: 3, proofOfHuman: true },
      { rank: 5, displayName: 'charlie.eth', address: '0xfedcba9876543210fedcba9876543210fedcba98', tier: 2, proofOfHuman: true },
      { rank: 6, displayName: 'zkexplorer.eth', address: '0x3333444455556666777788889999000011112222', tier: 2, proofOfHuman: true },
    ],
    'advanced-circuits': [
      { rank: 1, displayName: 'circuitbuilder.eth', address: '0xaaaabbbbccccddddeeeeffff1111222233334444', tier: 4, proofOfHuman: true },
      { rank: 2, displayName: 'bob.eth', address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', tier: 4, proofOfHuman: true },
      { rank: 3, displayName: '0x9876...5432', address: '0x9876543210987654321098765432109876543210', tier: 3, proofOfHuman: false },
      { rank: 4, displayName: 'shadowmage.eth', address: 'shadowmage.eth', tier: 3, proofOfHuman: true },
      { rank: 5, displayName: 'zkmaster.eth', address: '0x1111222233334444555566667777888899990000', tier: 2, proofOfHuman: true },
      { rank: 6, displayName: 'circuitdesigner.eth', address: '0x7777888899990000111122223333444455556666', tier: 2, proofOfHuman: true },
    ],
    'aztec-protocol': [
      { rank: 1, displayName: 'shadowmage.eth', address: 'shadowmage.eth', tier: 4, proofOfHuman: true },
      { rank: 2, displayName: 'alice.eth', address: '0x1234567890123456789012345678901234567890', tier: 2, proofOfHuman: true },
      { rank: 3, displayName: '0x9876...5432', address: '0x9876543210987654321098765432109876543210', tier: 2, proofOfHuman: false },
      { rank: 4, displayName: 'circuitbuilder.eth', address: '0xaaaabbbbccccddddeeeeffff1111222233334444', tier: 2, proofOfHuman: false },
      { rank: 5, displayName: 'aztecexplorer.eth', address: '0x9999000011112222333344445555666677778888', tier: 1, proofOfHuman: true },
    ],
  };

  return baseData[skillId] || baseData['rust-foundations'];
};

function shortenAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function LeaderboardPage({ params }: LeaderboardPageProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'white-hat' | 'black-hat'>('white-hat');
  const [skillId, setSkillId] = useState<string>('');

  // Handle async params
  useEffect(() => {
    params.then((p) => {
      setSkillId(decodeURIComponent(p.skillId));
    });
  }, [params]);

  // Get skill name from lookup
  const skill = skillId ? mockSkills[skillId] : null;
  const skillDisplayName = skill?.name || skillId.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || skillId;

  // Get leaderboard data for this skill
  const leaderboardData = skillId ? getMockLeaderboardData(skillId) : [];

  const handleRowClick = (address: string) => {
    router.push(`/profile/${address}`);
  };

  return (
    <main className="max-w-4xl mx-auto space-y-6 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {viewMode === 'white-hat' ? (
            <>
              {skillDisplayName} Leaderboard
              <span className="block text-lg font-normal text-gray-600 dark:text-gray-400 mt-1">
                Celebrate your progress and mastery
              </span>
            </>
          ) : (
            <>
              {skillDisplayName} Rankings
              <span className="block text-lg font-normal text-gray-600 dark:text-gray-400 mt-1">
                See where you stand against others
              </span>
            </>
          )}
        </h1>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            View Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('white-hat')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'white-hat'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              White-Hat View
            </button>
            <button
              onClick={() => setViewMode('black-hat')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'black-hat'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Black-Hat View
              <span className="ml-1 text-xs opacity-75">(Educational)</span>
            </button>
          </div>
        </div>
        {viewMode === 'black-hat' && (
          <div className="ml-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded text-xs text-orange-800 dark:text-orange-200 max-w-xs">
            <strong>Educational Mode:</strong> This view demonstrates how the same data could be
            framed with more competitive language. We default to the empowering white-hat view.
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {viewMode === 'white-hat' ? (
          <p>
            This leaderboard celebrates your journey of mastery. Each entry represents someone's
            commitment to growth and learning. Your progress is your own—compare to inspire, not to
            compete.
          </p>
        ) : (
          <p>
            Rankings are updated in real-time. Your position reflects your current standing. Keep
            pushing to climb higher and outperform others.
          </p>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800/50">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {viewMode === 'white-hat' ? 'Rank' : 'Position'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {viewMode === 'white-hat' ? 'Learner' : 'Competitor'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {viewMode === 'white-hat' ? 'Mastery Level' : 'Tier'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Verification
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboardData.map((entry) => (
              <LeaderboardEntry
                key={entry.rank}
                rank={entry.rank}
                displayName={entry.displayName}
                address={shortenAddress(entry.address)}
                tier={entry.tier}
                proofOfHuman={entry.proofOfHuman}
                viewMode={viewMode}
                onClick={() => handleRowClick(entry.address)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {viewMode === 'white-hat' ? (
          <p>
            Remember: Your learning journey is unique. This leaderboard is a celebration of
            collective progress, not a competition.
          </p>
        ) : (
          <p>
            Rankings are competitive. Your position matters. Stay ahead of the competition.
          </p>
        )}
      </div>
    </main>
  );
}

