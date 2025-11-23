/**
 * Skills List Page
 *
 * Displays a list of available skills that users can attempt quests for.
 * This is the entry point for the quest flow.
 */

import Link from 'next/link';

// Mock skills data - in production this would come from the backend
const mockSkills = [
  {
    id: 'aztec-protocol',
    name: 'Aztec Protocol',
    description: 'Deep dive into Aztec privacy technology',
  },
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
];

export default function SkillsListPage() {
  return (
    <main className="max-w-3xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Available Skills</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a skill to begin your quest. Your progress stays private by default.
        </p>
      </div>

      <div className="grid gap-4">
        {mockSkills.map((skill) => (
          <Link
            key={skill.id}
            href={`/skills/${skill.id}`}
            className="block border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm hover:scale-[1.01] transition-all duration-200 ease-out"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {skill.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{skill.description}</p>
            <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
              View details →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
