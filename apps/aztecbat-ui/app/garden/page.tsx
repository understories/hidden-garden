/**
 * My Garden Page
 *
 * Placeholder page for the user's private skill garden.
 * This will be implemented in a future step.
 */

export default function GardenPage() {
  return (
    <main className="max-w-3xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Garden</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your private skill tree and learning journey. This page will show your complete skill
          tree, including both public and private achievements.
        </p>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              We store quest completions privately in Aztec; this local list mirrors what lives there, but the only thing we reveal publicly is the ZK proof of tier.
            </p>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            My Garden view coming soon. This will display your complete private skill tree.
          </p>
        </div>
      </div>
    </main>
  );
}

