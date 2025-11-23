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
  const [selectedQuestId, setSelectedQuestId] = useState<string>('quest-1');

  // Mock quests - in production this would come from the backend
  const mockQuests = [
    { id: 'quest-1', name: 'Quest 1', description: 'First quest in this skill path' },
    { id: 'quest-2', name: 'Quest 2', description: 'Second quest in this skill path' },
    { id: 'quest-3', name: 'Quest 3', description: 'Third quest in this skill path' },
  ];

  const handleStartQuest = () => {
    router.push(`/proof?skillId=${encodeURIComponent(skillId)}&questId=${encodeURIComponent(selectedQuestId)}`);
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
          
          {/* Quest Selection */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Available Quests</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select a quest to begin. Each quest completion is validated and stored privately in Aztec.
            </p>
            <div className="space-y-2 mb-4">
              {mockQuests.map((quest) => (
                <label
                  key={quest.id}
                  className="block border-2 rounded-lg p-3 cursor-pointer transition-all hover:border-blue-300 dark:hover:border-blue-600"
                  style={{
                    borderColor: selectedQuestId === quest.id
                      ? 'rgb(59 130 246)' // blue-500
                      : 'rgb(229 231 235)', // gray-200
                    backgroundColor: selectedQuestId === quest.id
                      ? 'rgba(59 130 246 / 0.1)' // blue-50
                      : 'transparent',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="quest-selection"
                      value={quest.id}
                      checked={selectedQuestId === quest.id}
                      onChange={(e) => setSelectedQuestId(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {quest.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {quest.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartQuest}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Start {mockQuests.find(q => q.id === selectedQuestId)?.name || 'Quest'}
          </button>
        </div>
      </div>
    </main>
  );
}
