/**
 * Skill Canopy Page
 *
 * An isometric, game-like view of skill clusters in our lunar-punk forest.
 * Rebuilt from scratch following Power/Ease Matrix principles.
 */

import { clusters, skillTreeNodes, getSkillsByCluster } from './skillCanopyData';

export default function SkillCanopyPage() {
  // Temporary: Log data to verify it's wired correctly
  console.log('Clusters:', clusters);
  console.log('Skill Tree Nodes:', skillTreeNodes);
  console.log('Skills by cluster:', clusters.map((c) => ({ cluster: c.name, skills: getSkillsByCluster(c.id) })));

  return (
    <main className="max-w-6xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Canopy</h1>
        <p className="text-gray-600 dark:text-gray-400">
          An isometric, game-like view of skill clusters in our lunar-punk forest.
        </p>
      </div>

      {/* Temporary: JSON dump to verify data is wired correctly */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800/50">
        <h2 className="text-lg font-semibold mb-4">Data Verification (Temporary)</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Clusters ({clusters.length}):</h3>
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto">
              {JSON.stringify(clusters, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Skills by Cluster:</h3>
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto">
              {JSON.stringify(
                clusters.map((cluster) => ({
                  cluster: cluster.name,
                  skills: getSkillsByCluster(cluster.id),
                })),
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* Forest grid container - will be populated in next steps */}
      <div className="relative min-h-[600px] rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        {/* Forest grid will go here */}
      </div>
    </main>
  );
}

