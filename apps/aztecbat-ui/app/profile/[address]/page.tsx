/**
 * Profile Page
 *
 * Displays a user's public profile with their revealed achievements.
 */

import { AchievementCard } from '../../../components/AchievementCard';
import Link from 'next/link';

type ProfilePageProps = {
  params: Promise<{
    address: string;
  }>;
};

// Mock profile data lookup - in production this would come from the backend
// Each profile has diverse skills and achievements
const mockProfileDataLookup: Record<string, {
  ensName?: string;
  bio: string;
  achievements: Array<{
    skillName: string;
    tier: number;
    dateRevealed: string;
    proofOfHuman: boolean;
  }>;
  hasPrivateCompletions: boolean;
}> = {
  // Alice - Strong in Rust, good in ZK
  '0x1234567890123456789012345678901234567890': {
    ensName: 'alice.eth',
    bio: 'Building a privacy-first skill graph.',
    achievements: [
      {
        skillName: 'Rust Foundations',
        tier: 4,
        dateRevealed: '2024-01-15T10:30:00Z',
        proofOfHuman: true,
      },
      {
        skillName: 'Zero-Knowledge Basics',
        tier: 3,
        dateRevealed: '2024-01-10T14:20:00Z',
        proofOfHuman: true,
      },
      {
        skillName: 'Aztec Protocol',
        tier: 2,
        dateRevealed: '2024-01-08T09:15:00Z',
        proofOfHuman: true,
      },
    ],
    hasPrivateCompletions: true,
  },
  // Bob - Strong in ZK and Circuits, good in Rust
  '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd': {
    ensName: 'bob.eth',
    bio: 'Exploring zero-knowledge proofs and privacy tech.',
    achievements: [
      {
        skillName: 'Zero-Knowledge Basics',
        tier: 4,
        dateRevealed: '2024-01-12T08:15:00Z',
        proofOfHuman: true,
      },
      {
        skillName: 'Advanced Circuits',
        tier: 4,
        dateRevealed: '2024-01-08T16:45:00Z',
        proofOfHuman: true,
      },
      {
        skillName: 'Rust Foundations',
        tier: 3,
        dateRevealed: '2024-01-05T11:20:00Z',
        proofOfHuman: true,
      },
    ],
    hasPrivateCompletions: false,
  },
  // Agent/Non-human - Rust only, no proof of human
  '0x9876543210987654321098765432109876543210': {
    bio: 'Learning Aztec and Noir.',
    achievements: [
      {
        skillName: 'Advanced Circuits',
        tier: 3,
        dateRevealed: '2024-01-14T12:00:00Z',
        proofOfHuman: false,
      },
      {
        skillName: 'Aztec Protocol',
        tier: 2,
        dateRevealed: '2024-01-11T15:30:00Z',
        proofOfHuman: false,
      },
    ],
    hasPrivateCompletions: false,
  },
  // Charlie - Mixed results, moderate across skills
  '0xfedcba9876543210fedcba9876543210fedcba98': {
    ensName: 'charlie.eth',
    bio: 'Building a privacy-first skill graph.',
    achievements: [
      {
        skillName: 'Rust Foundations',
        tier: 3,
        dateRevealed: '2024-01-11T14:30:00Z',
        proofOfHuman: true,
      },
      {
        skillName: 'Zero-Knowledge Basics',
        tier: 2,
        dateRevealed: '2024-01-09T10:00:00Z',
        proofOfHuman: true,
      },
    ],
    hasPrivateCompletions: false,
  },
  // Dana - Early learner, lower tiers
  '0x2468135790246813579024681357902468135790': {
    bio: 'Exploring privacy-preserving technologies.',
    achievements: [
      {
        skillName: 'Rust Foundations',
        tier: 2,
        dateRevealed: '2024-01-13T10:00:00Z',
        proofOfHuman: true,
      },
    ],
    hasPrivateCompletions: false,
  },
  // Shadowmage - Strong in Aztec, good in Circuits
  'shadowmage.eth': {
    ensName: 'shadowmage.eth',
    bio: 'Privacy researcher and Aztec enthusiast.',
    achievements: [
      {
        skillName: 'Aztec Protocol',
        tier: 4,
        dateRevealed: '2024-01-16T08:00:00Z',
        proofOfHuman: true,
      },
      {
        skillName: 'Advanced Circuits',
        tier: 3,
        dateRevealed: '2024-01-12T14:20:00Z',
        proofOfHuman: true,
      },
      {
        skillName: 'Zero-Knowledge Basics',
        tier: 3,
        dateRevealed: '2024-01-07T11:45:00Z',
        proofOfHuman: true,
      },
    ],
    hasPrivateCompletions: false,
  },
  // ZKMaster - Expert in ZK, moderate elsewhere
  '0x1111222233334444555566667777888899990000': {
    ensName: 'zkmaster.eth',
    bio: 'Zero-knowledge proof specialist.',
    achievements: [
      {
        skillName: 'Zero-Knowledge Basics',
        tier: 4,
        dateRevealed: '2024-01-17T09:30:00Z',
        proofOfHuman: true,
      },
      {
        skillName: 'Advanced Circuits',
        tier: 2,
        dateRevealed: '2024-01-10T16:00:00Z',
        proofOfHuman: true,
      },
    ],
    hasPrivateCompletions: true,
  },
  // CircuitBuilder - Strong in Circuits, good in Rust
  '0xaaaabbbbccccddddeeeeffff1111222233334444': {
    bio: 'Circuit design and optimization.',
    achievements: [
      {
        skillName: 'Advanced Circuits',
        tier: 4,
        dateRevealed: '2024-01-15T13:15:00Z',
        proofOfHuman: true,
      },
      {
        skillName: 'Rust Foundations',
        tier: 3,
        dateRevealed: '2024-01-09T10:30:00Z',
        proofOfHuman: true,
      },
      {
        skillName: 'Aztec Protocol',
        tier: 2,
        dateRevealed: '2024-01-06T14:00:00Z',
        proofOfHuman: false,
      },
    ],
    hasPrivateCompletions: false,
  },
};

function shortenAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { address: rawAddress } = await params;
  const address = decodeURIComponent(rawAddress);

  // Mock: in production, fetch profile data based on address
  // Handle both ENS names and addresses
  const profile = mockProfileDataLookup[address] || {
    bio: 'Building a privacy-first skill graph.',
    achievements: [],
    hasPrivateCompletions: false,
  };
  
  // If address is an ENS name, use it as display name; otherwise use profile ENS or shortened address
  const displayName = address.endsWith('.eth') 
    ? address 
    : (profile.ensName || shortenAddress(address));

  return (
    <main className="max-w-3xl mx-auto space-y-6 py-8">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {displayName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
              {address}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            ← Back
          </Link>
        </div>
        <p className="text-base text-gray-600 dark:text-gray-400">{profile.bio}</p>
      </header>

      {/* Private Completions Notice (Mock - would only show for current user) */}
      {profile.hasPrivateCompletions && (
        <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> You have private completions not visible on this public profile.
            Your learning journey remains private by default.
          </p>
        </div>
      )}

      {/* Public Achievements */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Public Achievements
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Skills that have been selectively revealed. Your full skill tree remains private.
          </p>
        </div>

        {profile.achievements.length === 0 ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-800/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No public achievements have been revealed yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.achievements.map((achievement, index) => (
              <AchievementCard
                key={`${achievement.skillName}-${index}`}
                skillName={achievement.skillName}
                tier={achievement.tier}
                dateRevealed={achievement.dateRevealed}
                proofOfHuman={achievement.proofOfHuman}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer Note */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          This profile shows only skills that have been selectively revealed. The full learning
          journey remains private and secure.
        </p>
      </div>
    </main>
  );
}

