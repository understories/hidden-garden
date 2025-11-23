'use client';

/**
 * Leaderboard Page
 *
 * Displays the leaderboard for a specific skill with empowering, white-hat framing.
 * Focuses on growth, mastery, and collective progress.
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const [skillId, setSkillId] = useState<string>('');
  const [showRevealedMessage, setShowRevealedMessage] = useState(false);

  // Handle async params
  useEffect(() => {
    params.then((p) => {
      setSkillId(decodeURIComponent(p.skillId));
    });
  }, [params]);

  // Check for revealed param
  useEffect(() => {
    if (searchParams.get('revealed') === 'true') {
      setShowRevealedMessage(true);
      // Remove the param from URL after showing message
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowRevealedMessage(false), 5000);
    }
  }, [searchParams]);

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
      {/* Success Message */}
      {showRevealedMessage && (
        <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>✓ Successfully revealed!</strong> Your achievement is now visible on this leaderboard and your profile. Your learning journey continues to grow.
          </p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {skillDisplayName} Leaderboard
          <span className="block text-lg font-normal text-gray-600 dark:text-gray-400 mt-1">
            Celebrate your progress and mastery
          </span>
        </h1>
      </div>

      {/* Helper Text */}
      <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>
          This leaderboard celebrates your journey of mastery. Each entry represents someone's
          commitment to growth and learning. Your progress is your own—compare to inspire, not to
          compete.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800/50">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Learner
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Mastery Level
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
                onClick={() => handleRowClick(entry.address)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>
          Remember: Your learning journey is unique. This leaderboard is a celebration of
          collective progress, not a competition.
        </p>
      </div>
    </main>
  );
}

