/**
 * Skill Trees Page (Forest View)
 *
 * A mysterious, bioluminescent forest inspired by Botanicula, Journey, and No Man's Sky.
 * Skills appear as glowing organisms in a dark, wonder-filled forest.
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock skill tree data - in production this would come from the backend
const mockSkillTrees = [
  {
    skillId: 'aztec-protocol',
    skillName: 'Aztec Protocol',
    participantCount: 1247,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 15, mixed: 15, private: 70 },
    size: 'large' as const, // Tree size based on engagement
  },
  {
    skillId: 'rust-foundations',
    skillName: 'Rust Foundations',
    participantCount: 2156,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 70, mixed: 20, private: 10 },
    size: 'xlarge' as const,
  },
  {
    skillId: 'zero-knowledge-basics',
    skillName: 'Zero-Knowledge Basics',
    participantCount: 892,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 40, mixed: 40, private: 20 },
    size: 'medium' as const,
  },
  {
    skillId: 'advanced-circuits',
    skillName: 'Advanced Circuits',
    participantCount: 634,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 20, mixed: 20, private: 60 },
    size: 'medium' as const,
  },
  {
    skillId: 'l1-l2-bridging',
    skillName: 'L1 → L2 Bridging',
    participantCount: 445,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 35, mixed: 45, private: 20 },
    size: 'small' as const,
  },
  {
    skillId: 'noir-basics',
    skillName: 'Aztec Noir Basics',
    participantCount: 1123,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 75, mixed: 15, private: 10 },
    size: 'large' as const,
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

function BioluminescentOrganism({
  skillId,
  skillName,
  participantCount,
  privacyMode,
  privacyStats,
  size,
  position,
}: typeof mockSkillTrees[0] & { position: { x: number; y: number } }) {
  const colors = getTreeColors(privacyMode);
  const [isHovered, setIsHovered] = useState(false);

  // Organic shape sizes based on engagement
  const organismSize = size === 'small' ? 60 : size === 'medium' ? 80 : size === 'large' ? 100 : 120;
  const pulseSize = organismSize * 1.3;

  return (
    <div
      className="absolute group cursor-pointer"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
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
        </div>
      </Link>
    </div>
  );
}

export default function SkillTreesPage() {
  // Organic positions for organisms in the dark forest
  const organismPositions = [
    { x: 20, y: 30 },
    { x: 75, y: 25 },
    { x: 45, y: 55 },
    { x: 15, y: 70 },
    { x: 80, y: 65 },
    { x: 50, y: 85 },
  ];

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
          Hover to discover. Each organism's size reflects how many have explored it. The glow reveals privacy patterns—brighter for shared knowledge, cooler for private paths.
        </p>
      </div>

      {/* Dark Forest Canvas */}
      <div className="relative min-h-[700px] rounded-lg overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 border border-gray-800 dark:border-gray-700">
        {/* Atmospheric depth layers */}
        <div className="absolute inset-0">
          {/* Distant stars/particles */}
          {[...Array(30)].map((_, i) => (
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

          {/* Subtle fog/mist layers */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-900/50 to-transparent" />
        </div>

        {/* Bioluminescent Organisms */}
        <div className="relative w-full h-full min-h-[700px]">
          {mockSkillTrees.map((tree, index) => (
            <BioluminescentOrganism
              key={tree.skillId}
              {...tree}
              position={organismPositions[index] || { x: 50, y: 50 }}
            />
          ))}
        </div>

        {/* Subtle instruction hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-600 text-center">
          <span className="opacity-50">Hover to discover</span>
        </div>
      </div>
    </main>
  );
}

