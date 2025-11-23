/**
 * Skill Canopy Page
 *
 * An isometric, game-like view of skill clusters in our lunar-punk forest.
 * Rebuilt from scratch following Power/Ease Matrix principles.
 */

export default function SkillCanopyPage() {
  return (
    <main className="max-w-6xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Canopy</h1>
        <p className="text-gray-600 dark:text-gray-400">
          An isometric, game-like view of skill clusters in our lunar-punk forest.
        </p>
      </div>

      {/* Forest grid container - will be populated in next steps */}
      <div className="relative min-h-[600px] rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        {/* Forest grid will go here */}
      </div>
    </main>
  );
}

