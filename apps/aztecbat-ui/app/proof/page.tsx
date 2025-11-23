'use client';

/**
 * Proof & Result Flow Page
 *
 * This page handles steps 2-4 of the user flow:
 * - Step 2: Result Screen (Private by Default)
 * - Step 3: Choose What to Reveal
 * - Step 4: Submit Transaction (mocked for now)
 *
 * After submission, users are redirected to the leaderboard/profile.
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type RevealOption = 'full' | 'completion-only' | 'private';

// Mock skills lookup - in production this would come from the backend
const mockSkills: Record<string, { name: string }> = {
  'rust-foundations': { name: 'Rust Foundations' },
  'zero-knowledge-basics': { name: 'Zero-Knowledge Basics' },
  'advanced-circuits': { name: 'Advanced Circuits' },
  'aztec-protocol': { name: 'Aztec Protocol' },
};

export default function ProofFlowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOption, setSelectedOption] = useState<RevealOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillId, setSkillId] = useState<string>('');

  useEffect(() => {
    const skillIdParam = searchParams.get('skillId');
    if (skillIdParam) {
      setSkillId(decodeURIComponent(skillIdParam));
    }
  }, [searchParams]);

  // Mocked result data
  const mockResult = {
    score: 87,
    maxScore: 100,
    status: 'Passed',
  };

  const skill = skillId ? mockSkills[skillId] : null;
  const skillName = skill?.name || skillId || 'Challenge';

  const handleSubmit = async () => {
    if (!selectedOption || !skillId) return;

    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);

    // Navigate based on choice
    if (selectedOption === 'full' || selectedOption === 'completion-only') {
      // Navigate to leaderboard for the skill with success param
      router.push(`/leaderboard/${skillId}?revealed=true`);
    } else {
      // Navigate back to skills with confirmation
      router.push(`/skills/${skillId}?private=true`);
    }
  };

  return (
    <main className="max-w-2xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Challenge Result</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {skillName} • Review your result and choose what to share publicly
        </p>
      </div>

      {/* Result Section */}
      <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Result</h2>
          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
            Private result (visible only to you)
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Score:</span>
            <span className="text-2xl font-bold">
              {mockResult.score}/{mockResult.maxScore}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              {mockResult.status}
            </span>
          </div>
        </div>
      </section>

      {/* Choose What to Reveal Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Choose What to Reveal</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select how you want this attempt to appear on your profile and the leaderboard.
        </p>

        <div className="space-y-3">
          {/* Option 1: Full Result */}
          <label className="block">
            <input
              type="radio"
              name="reveal-option"
              value="full"
              checked={selectedOption === 'full'}
              onChange={() => setSelectedOption('full')}
              className="sr-only"
            />
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedOption === 'full'
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === 'full'
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {selectedOption === 'full' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">
                    Reveal this tier publicly (score + completion)
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Your score and completion status will be visible to others on your profile and the leaderboard
                  </div>
                </div>
              </div>
            </div>
          </label>

          {/* Option 2: Completion Only */}
          <label className="block">
            <input
              type="radio"
              name="reveal-option"
              value="completion-only"
              checked={selectedOption === 'completion-only'}
              onChange={() => setSelectedOption('completion-only')}
              className="sr-only"
            />
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedOption === 'completion-only'
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === 'completion-only'
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {selectedOption === 'completion-only' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">
                    Reveal completion only (no score)
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Only your completion status will be visible on your profile and the leaderboard, not your score
                  </div>
                </div>
              </div>
            </div>
          </label>

          {/* Option 3: Keep Private */}
          <label className="block">
            <input
              type="radio"
              name="reveal-option"
              value="private"
              checked={selectedOption === 'private'}
              onChange={() => setSelectedOption('private')}
              className="sr-only"
            />
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedOption === 'private'
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === 'private'
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {selectedOption === 'private' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">
                    Keep this attempt private
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Your progress is saved privately. This attempt won't appear on leaderboards, but it still counts toward your private skill tree.
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </section>

      {/* Info Block */}
      <section className="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg p-6">
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            We built a privacy-first skill graph. Your learning path stays private inside Aztec, but
            you can selectively reveal just the tier you want to show.
          </p>
          <p>
            We respect your autonomy:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              You can toggle off 'Proof of Human' to let agents compete,
            </li>
            <li>
              Or toggle it on to guarantee this is a human skills leaderboard.
            </li>
          </ul>
          <p>
            We also show what responsible design looks like by offering both white-hat and
            black-hat leaderboard views.
          </p>
          <p className="font-medium">
            Same data, different emotional framing. We choose white-hat; empowerment, progress,
            mastery.
          </p>
        </div>
      </section>

      {/* Submit Button */}
      <div className="pt-4 space-y-2">
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
            selectedOption && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Processing your choice…
            </span>
          ) : selectedOption === 'private' ? (
            'Keep this attempt private'
          ) : selectedOption === 'full' ? (
            'Reveal this tier publicly'
          ) : selectedOption === 'completion-only' ? (
            'Reveal completion only'
          ) : (
            'Continue'
          )}
        </button>
        {selectedOption && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {selectedOption === 'private'
              ? 'Your progress will be saved privately in your skill tree.'
              : 'Your achievement will be visible on your profile and the leaderboard.'}
          </p>
        )}
      </div>
    </main>
  );
}
