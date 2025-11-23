/**
 * Skill Canopy Page
 *
 * An isometric forest view of skills, inspired by modular game tiles.
 * Skills are grouped into clusters, each represented as a forest tile with trees and plants.
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

type PrivacyMode = 'public-heavy' | 'mixed' | 'mostly-private';

// Skill cluster - groups related skills together
type SkillCluster = {
  id: string;
  name: string;
  description: string;
  skills: Array<{
    skillId: string;
    skillName: string;
    participantCount: number;
    privacyMode: PrivacyMode;
    treeType: 'conifer' | 'deciduous' | 'palm' | 'bush';
    size: 'small' | 'medium' | 'large';
  }>;
  dominantPrivacyMode: PrivacyMode;
  totalParticipants: number;
  position: { x: number; y: number }; // Grid position
};

// Mock skill clusters - grouped by learning domain
const skillClusters: SkillCluster[] = [
  {
    id: 'privacy-protocols',
    name: 'Privacy Protocols',
    description: 'Core privacy technologies and protocols',
    dominantPrivacyMode: 'mostly-private',
    totalParticipants: 2081,
    position: { x: 0, y: 0 },
    skills: [
      {
        skillId: 'aztec-protocol',
        skillName: 'Aztec Protocol',
        participantCount: 1247,
        privacyMode: 'mostly-private',
        treeType: 'conifer',
        size: 'large',
      },
      {
        skillId: 'zero-knowledge-basics',
        skillName: 'Zero-Knowledge Basics',
        participantCount: 892,
        privacyMode: 'mixed',
        treeType: 'deciduous',
        size: 'medium',
      },
    ],
  },
  {
    id: 'programming-foundations',
    name: 'Programming Foundations',
    description: 'Core programming skills and languages',
    dominantPrivacyMode: 'public-heavy',
    totalParticipants: 2156,
    position: { x: 1, y: 0 },
    skills: [
      {
        skillId: 'rust-foundations',
        skillName: 'Rust Foundations',
        participantCount: 2156,
        privacyMode: 'public-heavy',
        treeType: 'deciduous',
        size: 'large',
      },
    ],
  },
  {
    id: 'advanced-development',
    name: 'Advanced Development',
    description: 'Advanced circuit design and Noir development',
    dominantPrivacyMode: 'mostly-private',
    totalParticipants: 1777,
    position: { x: 0, y: 1 },
    skills: [
      {
        skillId: 'advanced-circuits',
        skillName: 'Advanced Circuits',
        participantCount: 634,
        privacyMode: 'mostly-private',
        treeType: 'conifer',
        size: 'medium',
      },
      {
        skillId: 'noir-basics',
        skillName: 'Aztec Noir Basics',
        participantCount: 1123,
        privacyMode: 'public-heavy',
        treeType: 'palm',
        size: 'large',
      },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Blockchain infrastructure and bridging',
    dominantPrivacyMode: 'mixed',
    totalParticipants: 445,
    position: { x: 1, y: 1 },
    skills: [
      {
        skillId: 'l1-l2-bridging',
        skillName: 'L1 → L2 Bridging',
        participantCount: 445,
        privacyMode: 'mixed',
        treeType: 'bush',
        size: 'small',
      },
    ],
  },
];

// Get privacy colors
function getPrivacyColors(privacyMode: PrivacyMode): {
  tree: string;
  ground: string;
  accent: string;
} {
  switch (privacyMode) {
    case 'public-heavy':
      return {
        tree: 'text-emerald-600 dark:text-emerald-400',
        ground: 'bg-emerald-50 dark:bg-emerald-900/20',
        accent: 'text-cyan-500 dark:text-cyan-300',
      };
    case 'mixed':
      return {
        tree: 'text-amber-600 dark:text-amber-400',
        ground: 'bg-amber-50 dark:bg-amber-900/20',
        accent: 'text-orange-500 dark:text-orange-300',
      };
    case 'mostly-private':
      return {
        tree: 'text-blue-600 dark:text-blue-400',
        ground: 'bg-blue-50 dark:bg-blue-900/20',
        accent: 'text-indigo-500 dark:text-indigo-300',
      };
  }
}

// Convert grid position to isometric coordinates
function gridToIsometric(gridX: number, gridY: number, tileSize: number = 200): { x: number; y: number } {
  const isoX = (gridX - gridY) * (tileSize * 0.5);
  const isoY = (gridX + gridY) * (tileSize * 0.25);
  return { x: isoX, y: isoY };
}

// Tree component - different types based on treeType
function Tree({
  treeType,
  size,
  privacyMode,
  skillName,
  skillId,
}: {
  treeType: 'conifer' | 'deciduous' | 'palm' | 'bush';
  size: 'small' | 'medium' | 'large';
  privacyMode: PrivacyMode;
  skillName: string;
  skillId: string;
}) {
  const colors = getPrivacyColors(privacyMode);
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const renderTree = () => {
    switch (treeType) {
      case 'conifer':
        // Conifer/triangle tree
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-2 ${colors.tree} bg-current`} />
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent ${colors.tree} border-b-current`} />
            <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent ${colors.tree} border-b-current`} />
            {size === 'large' && (
              <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[8px] border-l-transparent border-r-transparent ${colors.tree} border-b-current`} />
            )}
          </div>
        );
      case 'deciduous':
        // Rounded canopy tree
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 ${colors.tree} bg-current`} />
            <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-full h-full rounded-full ${colors.tree} bg-current opacity-60`} />
          </div>
        );
      case 'palm':
        // Palm tree
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 ${colors.tree} bg-current`} />
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 flex gap-1`}>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-3 ${colors.tree} bg-current`}
                  style={{
                    transform: `rotate(${i * 90}deg) translateY(-2px)`,
                    transformOrigin: 'bottom center',
                  }}
                />
              ))}
            </div>
          </div>
        );
      case 'bush':
        // Small bush
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-3/4 rounded-full ${colors.tree} bg-current opacity-70`} />
          </div>
        );
    }
  };

  return (
    <Link
      href={`/leaderboard/${skillId}`}
      className="group relative block cursor-pointer"
      title={skillName}
    >
      {renderTree()}
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 dark:bg-black/90 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-30">
        {skillName}
      </div>
    </Link>
  );
}

// Forest tile component - represents a skill cluster
function ForestTile({ cluster }: { cluster: SkillCluster }) {
  const colors = getPrivacyColors(cluster.dominantPrivacyMode);
  const isoPos = gridToIsometric(cluster.position.x, cluster.position.y, 200);

  return (
    <div
      className="absolute group"
      style={{
        left: `calc(50% + ${isoPos.x}px)`,
        top: `calc(40% + ${isoPos.y}px)`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Isometric tile base */}
      <div
        className={`relative w-48 h-32 ${colors.ground} border-2 border-gray-300 dark:border-gray-600 rounded-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}
        style={{
          transform: 'rotate(45deg) skew(-15deg, 15deg)',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        }}
      >
        {/* Cluster label */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-center z-10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {cluster.name}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {cluster.totalParticipants.toLocaleString()} explorers
          </p>
        </div>

        {/* Trees positioned on the tile */}
        <div className="absolute inset-0 flex items-end justify-center gap-4 pb-2">
          {cluster.skills.map((skill, index) => (
            <div
              key={skill.skillId}
              className="relative"
              style={{
                transform: `translateX(${(index - (cluster.skills.length - 1) / 2) * 40}px)`,
              }}
            >
              <Tree
                treeType={skill.treeType}
                size={skill.size}
                privacyMode={skill.privacyMode}
                skillName={skill.skillName}
                skillId={skill.skillId}
              />
            </div>
          ))}
        </div>

        {/* Small decorative elements (rocks, patches) */}
        <div className="absolute bottom-2 left-4 w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full opacity-50" />
        <div className="absolute bottom-3 right-6 w-1.5 h-1.5 bg-gray-500 dark:bg-gray-500 rounded-full opacity-40" />
      </div>
    </div>
  );
}

export default function SkillCanopyPage() {
  return (
    <main className="max-w-7xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Canopy</h1>
        <p className="text-gray-600 dark:text-gray-400">
          An isometric forest view of learning domains. Each tile represents a cluster of related skills.
        </p>
      </div>

      {/* Legend */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800/50 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Canopy Colors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-400/40 dark:bg-emerald-400/50 border-2 border-emerald-400/40 dark:border-emerald-400/50 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Public-heavy clusters
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Spring canopy
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-amber-400/40 dark:bg-amber-400/50 border-2 border-amber-400/40 dark:border-amber-400/50 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Mixed privacy
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Autumn blend
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-400/35 dark:bg-indigo-400/40 border-2 border-blue-400/30 dark:border-indigo-400/40 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Mostly-private clusters
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Moonlit branches
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Isometric Forest Canvas */}
      <div className="relative min-h-[600px] rounded-lg overflow-hidden bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
        {/* Forest tiles */}
        {skillClusters.map((cluster) => (
          <ForestTile key={cluster.id} cluster={cluster} />
        ))}

        {/* Subtle instruction hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-600 text-center z-20">
          <span className="opacity-50">Hover over trees to see skill names • Click to view leaderboard</span>
        </div>
      </div>
    </main>
  );
}

