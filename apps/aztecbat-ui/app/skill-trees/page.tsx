/**
 * Skill Trees Page (Forest View)
 *
 * A mysterious, bioluminescent forest inspired by Botanicula, Journey, and No Man's Sky.
 * Skills appear as glowing organisms in a dark, wonder-filled forest.
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

// Explorer cluster types based on learning patterns
type ExplorerCluster = {
  id: string;
  questsCompleted: number;
  masteryLevel: number; // 1-4 (Bronze to Master)
  preference: 'public-heavy' | 'mixed' | 'mostly-private';
  size: number; // Number of explorers in this cluster
  angle: number; // Position around the skill organism
  distance: number; // Distance from center
};

// Mock skill tree data with relationship/overlap information
const mockSkillTrees = [
  {
    skillId: 'aztec-protocol',
    skillName: 'Aztec Protocol',
    participantCount: 1247,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 15, mixed: 15, private: 70 },
    size: 'large' as const,
    overlaps: ['zero-knowledge-basics', 'advanced-circuits'],
    gridPos: { x: 2, y: 1 },
    // Explorer clusters within this domain
    explorerClusters: [
      { id: 'cluster-1', questsCompleted: 3, masteryLevel: 4, preference: 'mostly-private' as const, size: 320, angle: 0, distance: 80 },
      { id: 'cluster-2', questsCompleted: 2, masteryLevel: 3, preference: 'mixed' as const, size: 180, angle: 120, distance: 100 },
      { id: 'cluster-3', questsCompleted: 1, masteryLevel: 2, preference: 'mostly-private' as const, size: 450, angle: 240, distance: 90 },
      { id: 'cluster-4', questsCompleted: 2, masteryLevel: 2, preference: 'mostly-private' as const, size: 297, angle: 60, distance: 110 },
    ] as ExplorerCluster[],
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
    explorerClusters: [
      { id: 'cluster-1', questsCompleted: 3, masteryLevel: 4, preference: 'public-heavy' as const, size: 650, angle: 30, distance: 120 },
      { id: 'cluster-2', questsCompleted: 2, masteryLevel: 3, preference: 'public-heavy' as const, size: 480, angle: 150, distance: 110 },
      { id: 'cluster-3', questsCompleted: 1, masteryLevel: 2, preference: 'mixed' as const, size: 720, angle: 270, distance: 130 },
      { id: 'cluster-4', questsCompleted: 2, masteryLevel: 3, preference: 'public-heavy' as const, size: 306, angle: 90, distance: 100 },
    ] as ExplorerCluster[],
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
    explorerClusters: [
      { id: 'cluster-1', questsCompleted: 2, masteryLevel: 3, preference: 'mixed' as const, size: 280, angle: 45, distance: 85 },
      { id: 'cluster-2', questsCompleted: 1, masteryLevel: 2, preference: 'public-heavy' as const, size: 210, angle: 180, distance: 95 },
      { id: 'cluster-3', questsCompleted: 3, masteryLevel: 4, preference: 'mixed' as const, size: 180, angle: 315, distance: 90 },
      { id: 'cluster-4', questsCompleted: 2, masteryLevel: 2, preference: 'mostly-private' as const, size: 222, angle: 135, distance: 100 },
    ] as ExplorerCluster[],
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
    explorerClusters: [
      { id: 'cluster-1', questsCompleted: 3, masteryLevel: 4, preference: 'mostly-private' as const, size: 150, angle: 0, distance: 80 },
      { id: 'cluster-2', questsCompleted: 2, masteryLevel: 3, preference: 'mostly-private' as const, size: 120, angle: 120, distance: 90 },
      { id: 'cluster-3', questsCompleted: 1, masteryLevel: 2, preference: 'mixed' as const, size: 364, angle: 240, distance: 95 },
    ] as ExplorerCluster[],
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
    explorerClusters: [
      { id: 'cluster-1', questsCompleted: 2, masteryLevel: 3, preference: 'mixed' as const, size: 180, angle: 60, distance: 75 },
      { id: 'cluster-2', questsCompleted: 1, masteryLevel: 2, preference: 'public-heavy' as const, size: 265, angle: 200, distance: 80 },
    ] as ExplorerCluster[],
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
    explorerClusters: [
      { id: 'cluster-1', questsCompleted: 3, masteryLevel: 4, preference: 'public-heavy' as const, size: 420, angle: 20, distance: 100 },
      { id: 'cluster-2', questsCompleted: 2, masteryLevel: 3, preference: 'public-heavy' as const, size: 380, angle: 140, distance: 95 },
      { id: 'cluster-3', questsCompleted: 1, masteryLevel: 2, preference: 'mixed' as const, size: 323, angle: 260, distance: 105 },
    ] as ExplorerCluster[],
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

// Convert isometric grid position to screen coordinates (increased spacing for planets)
function gridToIsometric(gridX: number, gridY: number, tileSize: number = 240): { x: number; y: number } {
  const isoX = (gridX - gridY) * (tileSize * 0.5);
  const isoY = (gridX + gridY) * (tileSize * 0.25);
  return { x: isoX, y: isoY };
}

// Explorer cluster component with orbital animation
function ExplorerCluster({
  cluster,
  centerX,
  centerY,
  orbitSpeed = 1,
}: {
  cluster: ExplorerCluster;
  centerX: number;
  centerY: number;
  orbitSpeed?: number;
}) {
  const colors = getTreeColors(cluster.preference);
  const masteryColors = {
    1: 'from-amber-400/40 to-amber-600/40', // Bronze
    2: 'from-gray-300/40 to-gray-500/40', // Silver
    3: 'from-yellow-300/40 to-yellow-500/40', // Gold
    4: 'from-purple-300/40 to-purple-500/40', // Master
  };

  // Orbital animation - clusters orbit around the planet
  const baseAngle = cluster.angle;
  const orbitDuration = 20 + (cluster.distance / 10); // Slower for outer orbits

  // Size based on number of explorers
  const clusterSize = Math.max(18, Math.min(35, cluster.size / 25));

  // Use CSS custom properties for orbital animation
  const orbitStyle: Record<string, string> = {
    '--orbit-angle': `${baseAngle}deg`,
    '--orbit-distance': `${cluster.distance}px`,
    '--orbit-duration': `${orbitDuration}s`,
  };

  return (
    <div
      className="absolute group/cluster orbit-container pointer-events-auto"
      style={{
        left: `${centerX}px`,
        top: `${centerY}px`,
        ...orbitStyle,
      }}
    >
      {/* Cluster glow */}
      <div
        className={`absolute rounded-full bg-gradient-to-br ${colors.foliage} opacity-30 blur-md transition-all duration-500 group-hover/cluster:opacity-50 group-hover/cluster:scale-125`}
        style={{
          width: `${clusterSize * 2}px`,
          height: `${clusterSize * 2}px`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Cluster core - mastery level indicator */}
      <div
        className={`relative rounded-full bg-gradient-to-br ${masteryColors[cluster.masteryLevel as keyof typeof masteryColors]} border-2 ${colors.foliage.includes('emerald') ? 'border-emerald-400/50' : colors.foliage.includes('amber') ? 'border-amber-400/50' : 'border-indigo-400/50'} shadow-lg transition-all duration-300 group-hover/cluster:scale-110 group-hover/cluster:brightness-125`}
        style={{
          width: `${clusterSize}px`,
          height: `${clusterSize}px`,
        }}
      >
        {/* Quest completion indicator - rings */}
        {[...Array(cluster.questsCompleted)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/30"
            style={{
              width: `${clusterSize + (i + 1) * 4}px`,
              height: `${clusterSize + (i + 1) * 4}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Moon tooltip - visible on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 dark:bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 invisible group-hover/cluster:opacity-100 group-hover/cluster:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-30 border border-white/20 shadow-xl">
        <div className="font-semibold mb-1">Moon Cluster</div>
        <div className="font-medium mb-1.5">{cluster.size} explorers</div>
        <div className="space-y-0.5 text-gray-300">
          <div>Mastery: {getTierName(cluster.masteryLevel)}</div>
          <div>Quests: {cluster.questsCompleted} completed</div>
          <div className="text-gray-400 text-xs mt-1 pt-1 border-t border-white/10">
            Privacy: {cluster.preference === 'public-heavy' ? 'Public' : cluster.preference === 'mixed' ? 'Mixed' : 'Private'}
          </div>
        </div>
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-black/90 dark:bg-black/90 rotate-45 border-r border-b border-white/20" />
      </div>
    </div>
  );
}

function getTierName(tier: number): string {
  const tierMap: Record<number, string> = {
    1: 'Bronze',
    2: 'Silver',
    3: 'Gold',
    4: 'Master',
  };
  return tierMap[tier] || `Tier ${tier}`;
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
  explorerClusters,
}: typeof mockSkillTrees[0]) {
  const colors = getTreeColors(privacyMode);
  const [isHovered, setIsHovered] = useState(false);

  // Organic shape sizes based on engagement
  const organismSize = size === 'small' ? 50 : size === 'medium' ? 70 : size === 'large' ? 90 : 110;
  const pulseSize = organismSize * 1.4;

  // Convert grid position to isometric coordinates
  const isoPos = gridToIsometric(gridPos.x, gridPos.y, 240);

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

        {/* Explorer clusters orbiting the skill organism */}
        {explorerClusters && explorerClusters.length > 0 && (
          <div className="absolute inset-0 pointer-events-none" style={{ width: `${organismSize + 200}px`, height: `${organismSize + 200}px`, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            {explorerClusters.map((cluster) => (
              <ExplorerCluster
                key={cluster.id}
                cluster={cluster}
                centerX={(organismSize + 200) / 2}
                centerY={(organismSize + 200) / 2}
              />
            ))}
          </div>
        )}

        {/* Info cloud - visible only on hover */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 mt-4 text-center transition-all duration-300 ${
            isHovered
              ? 'opacity-100 translate-y-0 scale-105'
              : 'opacity-0 translate-y-2 scale-100 pointer-events-none'
          }`}
        >
          <div className="px-3 py-1.5 bg-black/70 dark:bg-black/80 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg border border-white/10 group-hover:bg-black/90 group-hover:border-white/20">
            {skillName}
          </div>
          <div className="text-xs text-gray-300 dark:text-gray-400 mt-1.5">
            {participantCount.toLocaleString()} explorers
          </div>
          {overlaps && overlaps.length > 0 && (
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Connected to {overlaps.length} planet{overlaps.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

// Power transmission lines between planets - glowing, animated
function PowerTransmissionLine({
  from,
  to,
  opacity = 0.4,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  opacity?: number;
}) {
  const fromIso = gridToIsometric(from.x, from.y, 240);
  const toIso = gridToIsometric(to.x, to.y, 240);

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
      {/* Base glow line */}
      <div className="absolute h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent w-full animate-pulse-glow" />
      
      {/* Animated power pulse - traveling along the line */}
      <div className="absolute h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent w-32 animate-power-flow" />
      
      {/* Reverse power pulse */}
      <div className="absolute h-1 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent w-32 animate-power-flow-reverse" />
      
      {/* Outer glow */}
      <div className="absolute h-1 bg-gradient-to-r from-cyan-400/20 via-cyan-300/40 to-cyan-400/20 w-full blur-sm" />
    </div>
  );
}

export default function SkillTreesPage() {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <main className="max-w-7xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Knowledge Planets</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Each skill is a planet in this cosmic forest. Explorer clusters orbit around knowledge domains, connected by glowing power transmission lines.
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
          Hover planets to see details. Planet size reflects engagement. Clusters orbit showing explorer groups. Glowing lines transmit power between connected planets. Color zones show privacy preference clusters.
        </p>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={handleZoomOut}
          className="px-3 py-1.5 text-sm border border-gray-700 dark:border-gray-600 rounded bg-black/30 dark:bg-black/50 backdrop-blur-sm text-gray-300 dark:text-gray-400 hover:bg-black/50 hover:text-white transition-colors"
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="text-xs text-gray-400 dark:text-gray-500 px-2">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="px-3 py-1.5 text-sm border border-gray-700 dark:border-gray-600 rounded bg-black/30 dark:bg-black/50 backdrop-blur-sm text-gray-300 dark:text-gray-400 hover:bg-black/50 hover:text-white transition-colors"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>

      {/* Isometric Forest Canvas */}
      <div
        className="relative min-h-[800px] rounded-lg overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 border border-gray-800 dark:border-gray-700 cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Zoomable container */}
        <div
          className="absolute inset-0 origin-center transition-transform duration-200"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Isometric grid background - spaced for planets */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, x) =>
              [...Array(8)].map((_, y) => {
                const iso = gridToIsometric(x, y, 240);
                return (
                  <div
                    key={`${x}-${y}`}
                    className="absolute border border-cyan-500/10"
                    style={{
                      left: `calc(50% + ${iso.x}px)`,
                      top: `calc(40% + ${iso.y}px)`,
                      width: '240px',
                      height: '120px',
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

          {/* Power transmission lines between planets */}
          <div className="absolute inset-0 w-full h-full min-h-[800px]">
          {mockSkillTrees.map((tree) =>
            tree.overlaps?.map((overlapId) => {
              const targetTree = mockSkillTrees.find((t) => t.skillId === overlapId);
              if (!targetTree) return null;
              return (
                <PowerTransmissionLine
                  key={`${tree.skillId}-${overlapId}`}
                  from={tree.gridPos}
                  to={targetTree.gridPos}
                  opacity={0.5}
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
              const iso = gridToIsometric(tree.gridPos.x, tree.gridPos.y, 240);
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

          {/* Activity heat map - showing recent quest completions */}
          <div className="absolute inset-0 pointer-events-none">
            {mockSkillTrees.map((tree) => {
              const iso = gridToIsometric(tree.gridPos.x, tree.gridPos.y, 240);
            // Simulate activity pulses
            const activityLevel = tree.participantCount / 100;
            return (
              <div
                key={`heat-${tree.skillId}`}
                className="absolute rounded-full bg-gradient-to-br from-cyan-400/10 to-transparent animate-pulse"
                style={{
                  left: `calc(50% + ${iso.x}px)`,
                  top: `calc(40% + ${iso.y}px)`,
                  width: `${Math.min(200, activityLevel * 2)}px`,
                  height: `${Math.min(200, activityLevel * 2)}px`,
                  transform: 'translate(-50%, -50%)',
                  animationDuration: `${3 + Math.random() * 2}s`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            );
          })}
          </div>

          {/* Learning paths - trails between related skills */}
          <div className="absolute inset-0 pointer-events-none">
          {mockSkillTrees.map((tree) =>
            tree.overlaps?.slice(0, 1).map((overlapId) => {
              const targetTree = mockSkillTrees.find((t) => t.skillId === overlapId);
              if (!targetTree) return null;
              const fromIso = gridToIsometric(tree.gridPos.x, tree.gridPos.y, 240);
              const toIso = gridToIsometric(targetTree.gridPos.x, targetTree.gridPos.y, 240);
              
              // Create a curved path
              const midX = (fromIso.x + toIso.x) / 2;
              const midY = (fromIso.y + toIso.y) / 2 - 30; // Curve upward
              
              return (
                <svg
                  key={`path-${tree.skillId}-${overlapId}`}
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: 'none' }}
                >
                  <path
                    d={`M ${50 + (fromIso.x / 20)}% ${40 + (fromIso.y / 20)}% Q ${50 + (midX / 20)}% ${40 + (midY / 20)}%, ${50 + (toIso.x / 20)}% ${40 + (toIso.y / 20)}%`}
                    stroke="rgba(148, 163, 184, 0.1)"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="4 4"
                    className="animate-dash"
                  />
                </svg>
              );
            })
          )}
          </div>
        </div>

        {/* Subtle instruction hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-600 text-center z-20 pointer-events-none">
          <span className="opacity-50">Hover planets/moons to discover • Scroll to zoom • Drag to pan</span>
        </div>
      </div>
    </main>
  );
}

