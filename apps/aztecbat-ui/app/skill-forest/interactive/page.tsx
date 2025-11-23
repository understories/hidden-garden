/**
 * Interactive Skill Forest Visualization
 *
 * An interactive, explorable visualization of the skill forest
 * with clustering, zoom, and navigation capabilities.
 */

'use client';

import Link from 'next/link';

export default function InteractiveSkillForestPage() {
  return (
    <main className="max-w-7xl mx-auto space-y-6 py-8 px-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Interactive Skill Forest</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore the forest of skills in an interactive visualization.
        </p>
      </div>

      {/* Link to preview layouts */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
          <strong>Step 2:</strong> Choose your preferred layout style
        </p>
        <Link
          href="/skill-forest/interactive/preview"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          View Layout Options →
        </Link>
      </div>

      {/* Placeholder for interactive visualization */}
      <div className="w-full h-[600px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
        <p className="text-gray-500 dark:text-gray-400">
          Interactive visualization coming soon... (Layout selection in progress)
        </p>
      </div>
    </main>
  );
}

