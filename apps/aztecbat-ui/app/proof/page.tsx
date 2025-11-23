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
 * Quest completions are stored privately in Aztec.
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const [tierToReveal, setTierToReveal] = useState<number>(1);
  const [minAverageScore, setMinAverageScore] = useState<number>(0);
  const [requireProofOfHuman, setRequireProofOfHuman] = useState<boolean>(true);
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
  const skillName = skill?.name || skillId || 'Quest';

  const handleSubmit = async () => {
    if (!skillId) return;

    setIsSubmitting(true);

    // Simulate submission delay (ZK proof generation)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    // Navigate to leaderboard for the skill with success param
    router.push(`/leaderboard/${skillId}?revealed=true`);
  };

  return (
    <main className="max-w-2xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Quest Result</h1>
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
          Configure what tier to reveal publicly. Your quest completions remain private in Aztec.
        </p>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800/50 space-y-6">
          {/* Tier to Reveal */}
          <div>
            <label htmlFor="tier-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tier to reveal
            </label>
            <select
              id="tier-select"
              value={tierToReveal}
              onChange={(e) => setTierToReveal(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value={1}>Tier 1 (Bronze)</option>
              <option value={2}>Tier 2 (Silver)</option>
              <option value={3}>Tier 3 (Gold)</option>
              <option value={4}>Tier 4 (Master)</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select the minimum tier you want to prove publicly.
            </p>
          </div>

          {/* Min Average Score */}
          <div>
            <label htmlFor="min-score" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Min average score
            </label>
            <input
              id="min-score"
              type="number"
              min="0"
              max="100"
              value={minAverageScore}
              onChange={(e) => setMinAverageScore(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Minimum average score across quests to reveal this tier.
            </p>
          </div>

          {/* Proof of Human Toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Require proof of human (Self SBT)
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {requireProofOfHuman
                    ? 'Only entries with verified human proof will be shown on leaderboards.'
                    : 'Allow agents to compete alongside humans.'}
                </div>
              </div>
              <div className="ml-4">
                <button
                  type="button"
                  onClick={() => setRequireProofOfHuman(!requireProofOfHuman)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    requireProofOfHuman
                      ? 'bg-blue-600 dark:bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label="Toggle proof of human requirement"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      requireProofOfHuman ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Aztec Privacy Disclaimer */}
      <section className="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg p-6">
        <div className="space-y-3 text-sm leading-relaxed">
          <p className="font-medium">
            We store quest completions privately in Aztec; this local list mirrors what lives there, but the only thing we reveal publicly is the ZK proof of tier.
          </p>
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
          <p className="font-medium">
            We choose responsible design: empowerment, progress, and mastery over competitive pressure.
          </p>
        </div>
      </section>

      {/* Submit Button */}
      <div className="pt-4 space-y-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
            !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Generating ZK proof & publishing…
            </span>
          ) : (
            'Reveal selected tier'
          )}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          A ZK proof will be generated proving you achieved at least tier {tierToReveal} with a minimum average score of {minAverageScore}%. Only the proof will be published publicly.
        </p>
      </div>
    </main>
  );
}
