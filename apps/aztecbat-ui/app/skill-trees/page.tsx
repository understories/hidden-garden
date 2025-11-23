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

// Ghibli-style colors
function getGhibliColor(privacyMode: PrivacyMode): string {
  switch (privacyMode) {
    case 'public-heavy':
      return '#7dd87d'; // Soft spring green
    case 'mixed':
      return '#f4a460'; // Soft sandy amber
    case 'mostly-private':
      return '#87ceeb'; // Soft sky blue
  }
}

function getTreeColors(privacyMode: PrivacyMode): {
  trunk: string;
  foliage: string;
  glow: string;
  color: string;
} {
  const color = getGhibliColor(privacyMode);
  switch (privacyMode) {
    case 'public-heavy':
      return {
        trunk: '#8b6f47', // Soft brown
        foliage: color,
        glow: 'drop-shadow(0 2px 4px rgba(125, 216, 125, 0.3))',
        color: color,
      };
    case 'mixed':
      return {
        trunk: '#8b6f47', // Soft brown
        foliage: color,
        glow: 'drop-shadow(0 2px 4px rgba(244, 164, 96, 0.3))',
        color: color,
      };
    case 'mostly-private':
      return {
        trunk: '#6b7a8a', // Soft gray-blue
        foliage: color,
        glow: 'drop-shadow(0 2px 4px rgba(135, 206, 235, 0.3))',
        color: color,
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

// Explorer cluster component with orbital animation (Ghibli style)
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
    1: 'rgba(244, 164, 96, 0.4)', // Bronze - soft amber
    2: 'rgba(192, 192, 192, 0.4)', // Silver - soft gray
    3: 'rgba(255, 215, 0, 0.4)', // Gold - soft yellow
    4: 'rgba(186, 85, 211, 0.4)', // Master - soft purple
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
      {/* Cluster glow - soft Ghibli style */}
      <div
        className="absolute rounded-full opacity-20 blur-md transition-all duration-500 group-hover/cluster:opacity-30 group-hover/cluster:scale-125"
        style={{
          width: `${clusterSize * 2}px`,
          height: `${clusterSize * 2}px`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: colors.color,
        }}
      />

      {/* Cluster core - mastery level indicator */}
      <div
        className="relative rounded-full border-2 shadow-lg transition-all duration-300 group-hover/cluster:scale-110"
        style={{
          width: `${clusterSize}px`,
          height: `${clusterSize}px`,
          backgroundColor: masteryColors[cluster.masteryLevel as keyof typeof masteryColors],
          borderColor: `${colors.color}80`,
        }}
      >
        {/* Quest completion indicator - rings */}
        {[...Array(cluster.questsCompleted)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: `${clusterSize + (i + 1) * 4}px`,
              height: `${clusterSize + (i + 1) * 4}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderColor: `${colors.color}40`,
            }}
          />
        ))}
      </div>

      {/* Moon tooltip - visible on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 invisible group-hover/cluster:opacity-100 group-hover/cluster:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-30 border border-gray-700 shadow-xl">
        <div className="font-semibold mb-1">Moon Cluster</div>
        <div className="font-medium mb-1.5">{cluster.size} explorers</div>
        <div className="space-y-0.5 text-gray-300">
          <div>Mastery: {getTierName(cluster.masteryLevel)}</div>
          <div>Quests: {cluster.questsCompleted} completed</div>
          <div className="text-gray-400 text-xs mt-1 pt-1 border-t border-gray-700">
            Privacy: {cluster.preference === 'public-heavy' ? 'Public' : cluster.preference === 'mixed' ? 'Mixed' : 'Private'}
          </div>
        </div>
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900/90 dark:bg-gray-800/90 rotate-45 border-r border-b border-gray-700" />
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

// Center Sun component - clickable, links to /skills
function CenterSun() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      href="/skills"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 rounded-full transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="View all skills"
    >
      {/* Expanding background glow */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/30 via-amber-200/20 to-orange-200/30 blur-3xl animate-expand-background"
        style={{
          width: isHovered ? '400px' : '300px',
          height: isHovered ? '400px' : '300px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Sun core - Ghibli style soft yellow */}
      <div
        className="relative rounded-full bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 shadow-lg transition-all duration-300 group-hover:scale-110"
        style={{
          width: '80px',
          height: '80px',
          filter: 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4))',
        }}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-4 rounded-full bg-white/40 blur-sm"
          style={{
            width: '40px',
            height: '40px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      
      {/* Sun rays - gentle pulsing */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-yellow-200/40 to-transparent"
            style={{
              width: '120px',
              height: '4px',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              transformOrigin: '0 50%',
              animation: 'pulse 3s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        );
      })}
      
      {/* Tooltip */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-white text-xs rounded-lg shadow-xl border border-gray-700 transition-all duration-200 pointer-events-none whitespace-nowrap ${
          isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="font-semibold">All Skills</div>
        <div className="text-gray-300 text-xs mt-1">Click to explore</div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900/90 dark:bg-gray-800/90 rotate-45 border-r border-b border-gray-700" />
      </div>
    </Link>
  );
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
  centerX,
  centerY,
  orbitAngle,
  orbitDistance,
  orbitDuration,
}: typeof mockSkillTrees[0] & {
  centerX: number;
  centerY: number;
  orbitAngle: number;
  orbitDistance: number;
  orbitDuration: number;
}) {
  const colors = getTreeColors(privacyMode);
  const [isHovered, setIsHovered] = useState(false);

  // Organic shape sizes based on engagement
  const organismSize = size === 'small' ? 50 : size === 'medium' ? 70 : size === 'large' ? 90 : 110;
  const pulseSize = organismSize * 1.4;

  return (
    <div
      className="absolute group cursor-pointer z-10 planet-orbit"
      style={{
        left: '50%',
        top: '50%',
        '--orbit-duration': `${orbitDuration}s`,
        '--orbit-distance': `${orbitDistance}px`,
        '--initial-angle': `${orbitAngle}deg`,
      } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/leaderboard/${skillId}`}
        className="block relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-blue-500 rounded-full"
      >
        {/* Outer glow pulse - soft Ghibli breathing effect */}
        <div
          className="absolute inset-0 rounded-full opacity-15 blur-xl transition-all duration-2000 ease-in-out"
          style={{
            width: `${pulseSize}px`,
            height: `${pulseSize}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: colors.color,
            animation: isHovered ? 'pulse 2s ease-in-out infinite' : 'none',
          }}
        />

        {/* Main organism - soft Ghibli planet */}
        <div
          className="relative rounded-full shadow-lg transition-all duration-500 group-hover:scale-110"
          style={{
            width: `${organismSize}px`,
            height: `${organismSize}px`,
            backgroundColor: colors.color,
            filter: colors.glow,
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute rounded-full opacity-40 blur-sm"
            style={{
              width: `${organismSize * 0.6}px`,
              height: `${organismSize * 0.6}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }}
          />

          {/* Core light */}
          <div
            className="absolute rounded-full bg-white opacity-30 blur-md"
            style={{
              width: `${organismSize * 0.3}px`,
              height: `${organismSize * 0.3}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
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
          <div className="px-3 py-1.5 bg-gray-900/70 dark:bg-gray-800/80 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg border border-gray-700 group-hover:bg-gray-900/90">
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

// Power transmission lines between planets - soft Ghibli style (removed for cleaner orbital view)
function PowerTransmissionLine({
  from,
  to,
  opacity = 0.2,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  opacity?: number;
}) {
  // Lines are now subtle since planets orbit - keeping minimal for Ghibli aesthetic
  return null; // Disabled for cleaner orbital view
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
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Skill Orbits</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Each skill orbits around the center sun. Click the sun to explore all skills. Explorer clusters orbit around each planet, creating a gentle dance of learning.
        </p>
      </div>

      {/* Minimal Legend - Ghibli style */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#7dd87d' }} />
            <span className="text-gray-700 dark:text-gray-300">Public reveals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f4a460' }} />
            <span className="text-gray-700 dark:text-gray-300">Mixed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#87ceeb' }} />
            <span className="text-gray-700 dark:text-gray-300">Private journeys</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          Planets orbit around the center sun. Click the sun to explore all skills. Hover planets to see details. Planet size reflects engagement.
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

      {/* Black space canvas with moving stars */}
      <div
        className="relative min-h-[800px] rounded-lg overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 border border-gray-800 dark:border-gray-700 cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Expanding background glow around sun */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-yellow-200/10 via-amber-200/5 to-transparent dark:from-yellow-900/10 dark:via-amber-900/5 dark:to-transparent animate-expand-background rounded-full blur-3xl" />
        </div>

        {/* Zoomable container */}
        <div
          className="absolute inset-0 origin-center transition-transform duration-200"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Center coordinates for orbital calculations - 50% of container */}
          <div className="absolute left-1/2 top-1/2 w-0 h-0" id="center-sun" />

          {/* Atmospheric depth layers - black space with moving stars */}
          <div className="absolute inset-0">
            {/* Moving stars/particles */}
            {[...Array(60)].map((_, i) => {
              const x = Math.random() * 100;
              const y = Math.random() * 100;
              const size = Math.random() * 2 + 1;
              const opacity = Math.random() * 0.5 + 0.3;
              const delay = Math.random() * 3;
              const duration = Math.random() * 2 + 2;
              
              return (
                <div
                  key={i}
                  className="absolute rounded-full bg-white animate-pulse"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${x}%`,
                    top: `${y}%`,
                    opacity: opacity,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                  }}
                />
              );
            })}

            {/* Privacy zones - subtle Ghibli colors in dark space */}
            <div className="absolute inset-0">
              {/* Public zone (top-right) */}
              <div className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(125, 216, 125, 0.05)' }} />
              {/* Mixed zone (center) */}
              <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(244, 164, 96, 0.05)' }} />
              {/* Private zone (bottom-left) */}
              <div className="absolute bottom-0 left-0 w-1/3 h-1/3 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(135, 206, 235, 0.05)' }} />
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

          {/* Center Sun */}
          <CenterSun />

          {/* Planets orbiting the sun - realistic solar system layout */}
          <div className="relative w-full h-full min-h-[800px]" style={{ position: 'relative' }}>
            {mockSkillTrees.map((tree, index) => {
              // Realistic orbital parameters - like a real solar system
              // Inner planets closer, outer planets further
              // Use a logarithmic scale for more realistic spacing
              const totalPlanets = mockSkillTrees.length;
              const orbitRatio = index / (totalPlanets - 1); // 0 to 1
              const minDistance = 120; // Closest orbit
              const maxDistance = 350; // Farthest orbit
              // Logarithmic scale for more realistic spacing (inner planets closer together)
              const logScale = Math.pow(orbitRatio, 0.6); // 0.6 gives nice spacing
              const orbitDistance = minDistance + (maxDistance - minDistance) * logScale;
              
              // Evenly distribute planets around the sun (360 degrees)
              const baseAngle = (index * 360) / totalPlanets;
              
              // Orbital period - outer planets move slower (like real planets)
              // Use Kepler's laws: period increases with distance
              const basePeriod = 20; // Base period in seconds
              const periodMultiplier = Math.pow(orbitDistance / minDistance, 1.5); // Kepler's 3rd law approximation
              const orbitDuration = basePeriod * periodMultiplier;
              
              return (
                <BioluminescentOrganism
                  key={tree.skillId}
                  {...tree}
                  centerX={0} // Will be calculated relative to center
                  centerY={0}
                  orbitAngle={baseAngle}
                  orbitDistance={orbitDistance}
                  orbitDuration={orbitDuration}
                />
              );
            })}
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

