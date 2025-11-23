/**
 * Leaderboards List Page
 *
 * Displays a list of all available skills with links to their individual leaderboards.
 */

import Link from 'next/link';

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

export default function LeaderboardsPage() {
  return (
    <main className="max-w-3xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leaderboards</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore leaderboards for each skill. Celebrate progress and mastery together.
        </p>
      </div>

      <div className="grid gap-4">
        {mockSkills.map((skill) => (
          <Link
            key={skill.id}
            href={`/leaderboard/${skill.id}`}
            className="block border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {skill.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{skill.description}</p>
            <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
              View leaderboard →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

