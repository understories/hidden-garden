/**
 * Skill Canopy Page
 *
 * An isometric, game-like view of skill clusters in our lunar-punk forest.
 * Rebuilt from scratch following Power/Ease Matrix principles.
 */

import { clusters, getSkillsByCluster } from './skillCanopyData';
import { ForestTile } from '../../components/ForestTile';
import { ClickableTree } from '../../components/ClickableTree';

// Helper to calculate total participants for a cluster
function getClusterTotalParticipants(clusterId: string): number {
  const skills = getSkillsByCluster(clusterId);
  return skills.reduce((sum, skill) => sum + skill.participants, 0);
}

// Helper to get tree type based on index (for visual variety)
function getTreeType(index: number): 'conifer' | 'round' | 'mushroom' {
  const types: ('conifer' | 'round' | 'mushroom')[] = ['conifer', 'round', 'mushroom'];
  return types[index % types.length];
}

// Helper to get tree size based on participant count
function getTreeSize(participants: number): 'sm' | 'md' | 'lg' {
  if (participants > 1000) return 'lg';
  if (participants > 500) return 'md';
  return 'sm';
}

export default function SkillCanopyPage() {
  return (
    <main className="max-w-6xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Canopy</h1>
        <p className="text-gray-600 dark:text-gray-400">
          An isometric, game-like view of skill clusters in our lunar-punk forest.
        </p>
      </div>

      {/* Responsive grid of forest tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clusters.map((cluster) => {
          const skills = getSkillsByCluster(cluster.id);
          const totalParticipants = getClusterTotalParticipants(cluster.id);
          const skillCount = skills.length;

          return (
            <ForestTile key={cluster.id} className="w-full">
              {/* Cluster header */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {cluster.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {skillCount} {skillCount === 1 ? 'skill' : 'skills'} · {totalParticipants.toLocaleString()} participants
                </p>
              </div>

              {/* Trees positioned in a flexible grid */}
              <div className="flex flex-wrap items-end justify-center gap-4 min-h-[100px]">
                {skills.map((skill, index) => (
                  <ClickableTree
                    key={skill.id}
                    skillId={skill.id}
                    skillName={skill.name}
                    participants={skill.participants}
                    privacy={skill.privacy}
                    treeType={getTreeType(index)}
                    size={getTreeSize(skill.participants)}
                  />
                ))}
              </div>
            </ForestTile>
          );
        })}
      </div>
    </main>
  );
}

