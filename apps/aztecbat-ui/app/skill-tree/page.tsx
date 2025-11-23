/**
 * Skill Tree Page
 *
 * A lunar-punk forest view of skills across the network.
 * Shows skills as tree tiles with growth and privacy-based glow.
 */

export default function SkillTreePage() {
  return (
    <main className="max-w-6xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Tree</h1>
        <p className="text-gray-600 dark:text-gray-400">
          A lunar-punk forest view of skills across the network.
        </p>
      </div>

      {/* Grid placeholder - will be populated in next steps */}
      <div className="min-h-[400px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Skill tree grid coming soon...
        </p>
      </div>
    </main>
  );
}

