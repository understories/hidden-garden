'use client';

/**
 * Skill Detail Page
 *
 * Shows details for a specific skill and provides the "Start quest" entry point.
 * This is step 1 of the user flow: Start Quest (Private Compute)
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SkillDetailPageProps = {
  params: Promise<{
    skillId: string;
  }>;
  searchParams: Promise<{
    private?: string;
  }>;
};

// Mock skills lookup - in production this would come from the backend
const mockSkills: Record<string, { name: string; description: string }> = {
  'rust-foundations': {
    name: 'Rust Foundations',
    description: 'Master the fundamentals of Rust programming, including ownership, borrowing, and memory safety.',
  },
  'zero-knowledge-basics': {
    name: 'Zero-Knowledge Basics',
    description: 'Learn the core concepts of zero-knowledge proofs and their applications in privacy-preserving systems.',
  },
  'advanced-circuits': {
    name: 'Advanced Circuits',
    description: 'Build complex circuits with Noir, exploring advanced constraint systems and optimization techniques.',
  },
  'aztec-protocol': {
    name: 'Aztec Protocol',
    description: 'Deep dive into Aztec privacy technology, including private state management and note systems.',
  },
};

export default function SkillDetailPage({ params, searchParams }: SkillDetailPageProps) {
  const router = useRouter();
  const [skillId, setSkillId] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setSkillId(decodeURIComponent(p.skillId));
    });
    searchParams.then((s) => {
      setIsPrivate(s.private === 'true');
    });
  }, [params, searchParams]);

  const skill = skillId ? mockSkills[skillId] : null;
  const skillName = skill?.name || skillId;

  const handleStartQuest = () => {
    router.push(`/proof?skillId=${encodeURIComponent(skillId)}`);
  };

  return (
    <main className="max-w-2xl mx-auto space-y-6 py-8">
      <div>
        <Link
          href="/skills"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 inline-block"
        >
          ← Back to Skills
        </Link>
        <h1 className="text-3xl font-bold mb-2">{skillName}</h1>
        {skill && (
          <p className="text-gray-600 dark:text-gray-400">{skill.description}</p>
        )}
      </div>

      {isPrivate && (
        <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 space-y-2">
          <p className="text-sm text-green-800 dark:text-green-200 font-medium">
            ✓ Your attempt has been kept private
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Your progress is saved and counts toward your private skill tree. This attempt won't appear on public leaderboards, but your learning journey continues to grow privately.
          </p>
        </div>
      )}

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800/50">
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg p-4 mb-4">
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
              We store quest completions privately in Aztec; this local list mirrors what lives there, but the only thing we reveal publicly is the ZK proof of tier.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Ready to begin?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Start the quest to test your knowledge. Your result will be private by default,
              and you can choose what to reveal publicly.
            </p>
          </div>
          <button
            onClick={handleStartQuest}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Start Quest
          </button>
        </div>
      </div>
    </main>
  );
}
