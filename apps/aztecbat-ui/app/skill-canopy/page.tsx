/**
 * Skill Canopy Page
 *
 * An isometric, game-like view of skill clusters in our lunar-punk forest.
 * Rebuilt from scratch following Power/Ease Matrix principles.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  return (
    <main className="max-w-6xl mx-auto space-y-6 py-8">
      {/* Navigation tabs */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/skill-tree"
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${pathname === '/skill-tree'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
        >
          Skill Tree
        </Link>
        <Link
          href="/skill-canopy"
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${pathname === '/skill-canopy'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
        >
          Skill Canopy
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Canopy</h1>
        <p className="text-gray-600 dark:text-gray-400">
          A gentle, organic view of skill clusters in our hidden garden.
        </p>
      </div>

      {/* Legend */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800/50 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Forest Colors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Public-heavy */}
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-[#7dd87d] border border-green-300/50 dark:border-green-400/30 flex-shrink-0 mt-0.5 shadow-sm" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  More public reveals
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Spring canopy
                </div>
              </div>
            </div>

            {/* Mixed */}
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-[#f4a460] border border-amber-300/50 dark:border-amber-400/30 flex-shrink-0 mt-0.5 shadow-sm" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Mixed privacy
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Autumn blend
                </div>
              </div>
            </div>

            {/* Mostly private */}
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-[#87ceeb] border border-blue-300/50 dark:border-blue-400/30 flex-shrink-0 mt-0.5 shadow-sm" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  More private journeys
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Moonlit branches
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canopy-specific explanation */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            Each island represents a skill cluster—a group of related learning domains. The trees on each island are individual skills, with colors reflecting their privacy patterns. Hover over any tree to see details, or click to explore its leaderboard.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Your learning choices—whether to reveal or keep private—shape this lunar forest. Every skill contributes to the ecosystem's unique glow, creating a living map of knowledge and privacy preferences.
          </p>
        </div>
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

