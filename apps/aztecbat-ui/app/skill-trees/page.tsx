/**
 * Skill Trees Page (Forest View)
 *
 * A mysterious, bioluminescent forest inspired by Botanicula, Journey, and No Man's Sky.
 * Skills appear as glowing organisms in a dark, wonder-filled forest.
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock skill tree data with relationship/overlap information
const mockSkillTrees = [
  {
    skillId: 'aztec-protocol',
    skillName: 'Aztec Protocol',
    participantCount: 1247,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 15, mixed: 15, private: 70 },
    size: 'large' as const,
    // Skills that overlap (users learning both)
    overlaps: ['zero-knowledge-basics', 'advanced-circuits'],
    // Isometric grid position
    gridPos: { x: 2, y: 1 },
  },
  {
    skillId: 'rust-foundations',
    skillName: 'Rust Foundations',
    participantCount: 2156,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 70, mixed: 20, private: 10 },
    size: 'xlarge' as const,
    overlaps: ['noir-basics', 'advanced-circuits'],
    gridPos: { x: 4, y: 3 },
  },
  {
    skillId: 'zero-knowledge-basics',
    skillName: 'Zero-Knowledge Basics',
    participantCount: 892,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 40, mixed: 40, private: 20 },
    size: 'medium' as const,
    overlaps: ['aztec-protocol', 'advanced-circuits', 'noir-basics'],
    gridPos: { x: 1, y: 2 },
  },
  {
    skillId: 'advanced-circuits',
    skillName: 'Advanced Circuits',
    participantCount: 634,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 20, mixed: 20, private: 60 },
    size: 'medium' as const,
    overlaps: ['aztec-protocol', 'rust-foundations', 'zero-knowledge-basics'],
    gridPos: { x: 3, y: 2 },
  },
  {
    skillId: 'l1-l2-bridging',
    skillName: 'L1 → L2 Bridging',
    participantCount: 445,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 35, mixed: 45, private: 20 },
    size: 'small' as const,
    overlaps: ['rust-foundations'],
    gridPos: { x: 5, y: 4 },
  },
  {
    skillId: 'noir-basics',
    skillName: 'Aztec Noir Basics',
    participantCount: 1123,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 75, mixed: 15, private: 10 },
    size: 'large' as const,
    overlaps: ['rust-foundations', 'zero-knowledge-basics'],
    gridPos: { x: 4, y: 1 },
  },
];

type PrivacyMode = 'public-heavy' | 'mixed' | 'mostly-private';
type TreeSize = 'small' | 'medium' | 'large' | 'xlarge';

function getTreeColors(privacyMode: PrivacyMode): {
  trunk: string;
  foliage: string;
  glow: string;
} {
  switch (privacyMode) {
    case 'public-heavy':
      return {
        trunk: 'bg-emerald-600 dark:bg-emerald-500',
        foliage: 'from-emerald-400 via-cyan-400 to-teal-400',
        glow: 'shadow-emerald-400/40 dark:shadow-emerald-400/50',
      };
    case 'mixed':
      return {
        trunk: 'bg-amber-600 dark:bg-amber-500',
        foliage: 'from-amber-400 via-orange-400 to-yellow-400',
        glow: 'shadow-amber-400/40 dark:shadow-amber-400/50',
      };
    case 'mostly-private':
      return {
        trunk: 'bg-indigo-600 dark:bg-indigo-500',
        foliage: 'from-blue-400 via-indigo-400 to-purple-400',
        glow: 'shadow-indigo-400/30 dark:shadow-indigo-400/40',
      };
  }
}

function getTreeSize(size: TreeSize): {
  width: string;
  height: string;
  trunkHeight: string;
  foliageSize: string;
} {
  switch (size) {
    case 'small':
      return {
        width: 'w-20',
        height: 'h-32',
        trunkHeight: 'h-8',
        foliageSize: 'w-16 h-16',
      };
    case 'medium':
      return {
        width: 'w-24',
        height: 'h-40',
        trunkHeight: 'h-10',
        foliageSize: 'w-20 h-20',
      };
    case 'large':
      return {
        width: 'w-28',
        height: 'h-48',
        trunkHeight: 'h-12',
        foliageSize: 'w-24 h-24',
      };
    case 'xlarge':
      return {
        width: 'w-32',
        height: 'h-56',
        trunkHeight: 'h-14',
        foliageSize: 'w-28 h-28',
      };
  }
}

// Convert isometric grid position to screen coordinates
function gridToIsometric(gridX: number, gridY: number, tileSize: number = 120): { x: number; y: number } {
  const isoX = (gridX - gridY) * (tileSize * 0.5);
  const isoY = (gridX + gridY) * (tileSize * 0.25);
  return { x: isoX, y: isoY };
}

function BioluminescentOrganism({
  skillId,
  skillName,
  participantCount,
  privacyMode,
  privacyStats,
  size,
  gridPos,
  overlaps,
}: typeof mockSkillTrees[0]) {
  const colors = getTreeColors(privacyMode);
  const [isHovered, setIsHovered] = useState(false);

  // Organic shape sizes based on engagement
  const organismSize = size === 'small' ? 50 : size === 'medium' ? 70 : size === 'large' ? 90 : 110;
  const pulseSize = organismSize * 1.4;

  // Convert grid position to isometric coordinates
  const isoPos = gridToIsometric(gridPos.x, gridPos.y);

  return (
    <div
      className="absolute group cursor-pointer z-10"
      style={{
        left: `calc(50% + ${isoPos.x}px)`,
        top: `calc(40% + ${isoPos.y}px)`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/leaderboard/${skillId}`}
        className="block relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-blue-500 rounded-full"
      >
        {/* Outer glow pulse - breathing effect */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.foliage} opacity-20 blur-xl transition-all duration-2000 ease-in-out ${
            isHovered ? 'animate-pulse' : ''
          }`}
          style={{
            width: `${pulseSize}px`,
            height: `${pulseSize}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Main organism - organic blob shape */}
        <div
          className={`relative rounded-full bg-gradient-to-br ${colors.foliage} ${colors.glow} shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:brightness-110`}
          style={{
            width: `${organismSize}px`,
            height: `${organismSize}px`,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-4 rounded-full bg-gradient-to-tr opacity-60 blur-sm"
            style={{
              background: `linear-gradient(135deg, ${colors.foliage.split(' ')[0].replace('from-', '')}40, transparent)`,
            }}
          />

          {/* Core light */}
          <div
            className="absolute inset-1/2 rounded-full bg-white opacity-40 blur-md"
            style={{
              width: `${organismSize * 0.3}px`,
              height: `${organismSize * 0.3}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Floating particles around organism */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-gradient-to-br ${colors.foliage} opacity-30 blur-sm animate-float`}
              style={{
                width: `${organismSize * 0.15}px`,
                height: `${organismSize * 0.15}px`,
                left: `${50 + (i - 1) * 30}%`,
                top: `${50 + Math.sin(i) * 20}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s',
              }}
            />
          ))}
        </div>

        {/* Name appears on hover - like discovering a species */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 mt-4 text-center transition-all duration-300 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="px-3 py-1.5 bg-black/70 dark:bg-black/80 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg border border-white/10">
            {skillName}
          </div>
          <div className="text-xs text-gray-300 dark:text-gray-400 mt-1.5">
            {participantCount.toLocaleString()} explorers
          </div>
          {overlaps && overlaps.length > 0 && (
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Overlaps with {overlaps.length} skill{overlaps.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

// Connection lines showing skill overlaps
function ConnectionLine({
  from,
  to,
  opacity = 0.3,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  opacity?: number;
}) {
  const fromIso = gridToIsometric(from.x, from.y);
  const toIso = gridToIsometric(to.x, to.y);

  const length = Math.sqrt(
    Math.pow(toIso.x - fromIso.x, 2) + Math.pow(toIso.y - fromIso.y, 2)
  );
  const angle = Math.atan2(toIso.y - fromIso.y, toIso.x - fromIso.x) * (180 / Math.PI);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `calc(50% + ${fromIso.x}px)`,
        top: `calc(40% + ${fromIso.y}px)`,
        width: `${length}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 50%',
        opacity,
      }}
    >
      <div className="h-px bg-gradient-to-r from-white/20 via-cyan-300/30 to-white/20 w-full" />
    </div>
  );
}

export default function SkillTreesPage() {
  return (
    <main className="max-w-7xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Hidden Forest</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore the bioluminescent organisms that grow from shared learning. Each glow tells a story of privacy and discovery.
        </p>
      </div>

      {/* Minimal Legend */}
      <div className="border border-gray-800 dark:border-gray-700 rounded-lg p-4 bg-black/30 dark:bg-black/50 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-teal-400" />
            <span className="text-gray-300 dark:text-gray-400">Public reveals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400" />
            <span className="text-gray-300 dark:text-gray-400">Mixed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400" />
            <span className="text-gray-300 dark:text-gray-400">Private journeys</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
          Hover to discover. Size reflects engagement. Glow reveals privacy patterns. Lines connect overlapping skills—where learners explore multiple subjects. Color zones show privacy preference clusters across the forest.
        </p>
      </div>

      {/* Isometric Forest Canvas */}
      <div className="relative min-h-[800px] rounded-lg overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 border border-gray-800 dark:border-gray-700">
        {/* Isometric grid background */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, x) =>
            [...Array(6)].map((_, y) => {
              const iso = gridToIsometric(x, y, 120);
              return (
                <div
                  key={`${x}-${y}`}
                  className="absolute border border-cyan-500/10"
                  style={{
                    left: `calc(50% + ${iso.x}px)`,
                    top: `calc(40% + ${iso.y}px)`,
                    width: '120px',
                    height: '60px',
                    transform: 'translate(-50%, -50%) rotate(45deg) skew(-15deg, 15deg)',
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                  }}
                />
              );
            })
          )}
        </div>

        {/* Atmospheric depth layers */}
        <div className="absolute inset-0">
          {/* Distant stars/particles */}
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}

          {/* Privacy zones - color regions showing privacy preference clusters */}
          <div className="absolute inset-0">
            {/* Public zone (top-right) */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-500/5 rounded-full blur-3xl" />
            {/* Mixed zone (center) */}
            <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-amber-500/5 rounded-full blur-3xl" />
            {/* Private zone (bottom-left) */}
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-500/5 rounded-full blur-3xl" />
          </div>

          {/* Subtle fog/mist layers */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-900/60 to-transparent" />
        </div>

        {/* Connection lines showing skill overlaps */}
        <div className="absolute inset-0 w-full h-full min-h-[800px]">
          {mockSkillTrees.map((tree) =>
            tree.overlaps?.map((overlapId) => {
              const targetTree = mockSkillTrees.find((t) => t.skillId === overlapId);
              if (!targetTree) return null;
              return (
                <ConnectionLine
                  key={`${tree.skillId}-${overlapId}`}
                  from={tree.gridPos}
                  to={targetTree.gridPos}
                  opacity={0.2}
                />
              );
            })
          )}
        </div>

        {/* Bioluminescent Organisms */}
        <div className="relative w-full h-full min-h-[800px]">
          {mockSkillTrees.map((tree) => (
            <BioluminescentOrganism key={tree.skillId} {...tree} />
          ))}
        </div>

        {/* Overlap clusters - visual indicators where skills intersect */}
        {mockSkillTrees
          .filter((tree) => tree.overlaps && tree.overlaps.length > 0)
          .map((tree) => {
            const iso = gridToIsometric(tree.gridPos.x, tree.gridPos.y);
            return (
              <div
                key={`cluster-${tree.skillId}`}
                className="absolute rounded-full border border-cyan-400/10 pointer-events-none"
                style={{
                  left: `calc(50% + ${iso.x}px)`,
                  top: `calc(40% + ${iso.y}px)`,
                  width: `${(tree.overlaps?.length || 0) * 20 + 100}px`,
                  height: `${(tree.overlaps?.length || 0) * 20 + 100}px`,
                  transform: 'translate(-50%, -50%)',
                  animation: 'pulse 4s ease-in-out infinite',
                }}
              />
            );
          })}

        {/* Subtle instruction hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-600 text-center z-20">
          <span className="opacity-50">Hover to discover • Lines show skill overlaps</span>
        </div>
      </div>
    </main>
  );
}

