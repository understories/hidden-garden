/**
 * Interactive Skill Forest Visualization
 *
 * Constellation layout with privacy-based clustering.
 * Skills arranged like stars in a constellation around a center silver tree.
 */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  SpringCanopyTree,
  AutumnBlendTree,
  MoonlitBranchesTree,
  BaseTree,
  BioluminescentMushroom,
  MiniShrub,
  SilverPineTree,
  PrivacyMode,
} from '@/components/CustomTreeIcons';

// Mock skill data (same as main skill-forest page)
const mockSkillTrees = [
  {
    skillId: 'aztec-protocol',
    skillName: 'Aztec Noir Basics',
    participantCount: 1247,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 15, mixed: 15, private: 70 },
    customTreeType: 'shrub' as const,
  },
  {
    skillId: 'rust-foundations',
    skillName: 'Rust Foundations',
    participantCount: 2156,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 70, mixed: 20, private: 10 },
    customTreeType: 'spring' as const,
  },
  {
    skillId: 'zero-knowledge-basics',
    skillName: 'Zero-Knowledge Basics',
    participantCount: 892,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 40, mixed: 40, private: 20 },
    customTreeType: 'autumn' as const,
  },
  {
    skillId: 'advanced-circuits',
    skillName: 'Advanced Circuits',
    participantCount: 634,
    privacyMode: 'mostly-private' as const,
    privacyStats: { public: 20, mixed: 20, private: 60 },
    customTreeType: 'mushroom' as const,
  },
  {
    skillId: 'l1-l2-bridging',
    skillName: 'L1 → L2 Bridging',
    participantCount: 445,
    privacyMode: 'mixed' as const,
    privacyStats: { public: 35, mixed: 45, private: 20 },
    customTreeType: 'base' as const,
  },
  {
    skillId: 'noir-basics',
    skillName: 'Aztec Noir Advanced',
    participantCount: 1123,
    privacyMode: 'public-heavy' as const,
    privacyStats: { public: 75, mixed: 15, private: 10 },
    customTreeType: 'moonlit' as const,
  },
];

// Helper to convert privacy mode
function convertPrivacyMode(mode: 'public-heavy' | 'mixed' | 'mostly-private'): PrivacyMode {
  return mode === 'mostly-private' ? 'private-heavy' : mode;
}

// Helper to render custom tree based on type
function renderCustomTree(
  customTreeType: 'spring' | 'autumn' | 'moonlit' | 'base' | 'mushroom' | 'shrub',
  privacy: PrivacyMode,
  size: 'sm' | 'md' | 'lg' = 'sm'
) {
  switch (customTreeType) {
    case 'spring':
      return <SpringCanopyTree privacy={privacy} size={size} />;
    case 'autumn':
      return <AutumnBlendTree privacy={privacy} size={size} />;
    case 'moonlit':
      return <MoonlitBranchesTree privacy={privacy} size={size} />;
    case 'base':
      return <BaseTree privacy={privacy} size={size} />;
    case 'mushroom':
      return <BioluminescentMushroom privacy={privacy} size={size} />;
    case 'shrub':
      return <MiniShrub privacy={privacy} size={size} />;
    default:
      return <BaseTree privacy={privacy} size={size} />;
  }
}

// Calculate constellation positions with clustering
function calculateConstellationPositions(skills: typeof mockSkillTrees) {
  const centerX = 50; // percentage
  const centerY = 50; // percentage
  
  // Group skills by privacy mode
  const clusters = {
    'public-heavy': skills.filter(s => s.privacyMode === 'public-heavy'),
    'mixed': skills.filter(s => s.privacyMode === 'mixed'),
    'mostly-private': skills.filter(s => s.privacyMode === 'mostly-private'),
  };

  const positions: Array<{ skill: typeof skills[0]; x: number; y: number; privacy: PrivacyMode }> = [];
  
  // Cluster positions (angles from center)
  const clusterAngles = {
    'public-heavy': -Math.PI / 3, // Top-right
    'mixed': Math.PI / 3, // Bottom-right
    'mostly-private': Math.PI, // Left
  };

  // Calculate positions for each cluster
  Object.entries(clusters).forEach(([privacyMode, clusterSkills]) => {
    if (clusterSkills.length === 0) return;
    
    const baseAngle = clusterAngles[privacyMode as keyof typeof clusterAngles];
    const baseRadius = 30; // Base distance from center (%)
    const clusterRadius = 12; // Spread within cluster (%)
    
    clusterSkills.forEach((skill, index) => {
      // Distribute skills in a small arc within the cluster
      const angleOffset = (index - (clusterSkills.length - 1) / 2) * 0.3;
      const angle = baseAngle + angleOffset;
      const radius = baseRadius + (index % 2) * 3; // Slight variation in distance
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      positions.push({
        skill,
        x,
        y,
        privacy: convertPrivacyMode(skill.privacyMode as 'public-heavy' | 'mixed' | 'mostly-private'),
      });
    });
  });

  return { positions, clusters };
}

// Get cluster zone properties
function getClusterZone(privacyMode: 'public-heavy' | 'mixed' | 'mostly-private') {
  const zones = {
    'public-heavy': {
      centerAngle: -Math.PI / 3,
      centerRadius: 30,
      spread: 15,
      color: 'rgba(125, 216, 125, 0.15)', // Spring green
      borderColor: 'rgba(125, 216, 125, 0.3)',
    },
    'mixed': {
      centerAngle: Math.PI / 3,
      centerRadius: 30,
      spread: 15,
      color: 'rgba(244, 164, 96, 0.15)', // Amber
      borderColor: 'rgba(244, 164, 96, 0.3)',
    },
    'mostly-private': {
      centerAngle: Math.PI,
      centerRadius: 30,
      spread: 15,
      color: 'rgba(147, 112, 219, 0.15)', // Violet
      borderColor: 'rgba(147, 112, 219, 0.3)',
    },
  };
  return zones[privacyMode];
}

export default function InteractiveSkillForestPage() {
  const { positions, clusters } = useMemo(() => calculateConstellationPositions(mockSkillTrees), []);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <main className="max-w-7xl mx-auto space-y-6 py-8 px-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Interactive Skill Forest</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore the forest of skills in a constellation layout, clustered by privacy mode.
        </p>
      </div>

      {/* Constellation Visualization */}
      <div className="relative w-full h-[700px] border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Subtle starfield background */}
        {Array.from({ length: 30 }).map((_, i) => {
          const x = ((i * 17) % 100);
          const y = ((i * 23) % 100);
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gray-400 rounded-full opacity-30 dark:opacity-20"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          );
        })}

        {/* Cluster background zones */}
        {Object.entries(clusters).map(([privacyMode, clusterSkills]) => {
          if (clusterSkills.length === 0) return null;
          const zone = getClusterZone(privacyMode as 'public-heavy' | 'mixed' | 'mostly-private');
          const centerX = 50 + zone.centerRadius * Math.cos(zone.centerAngle);
          const centerY = 50 + zone.centerRadius * Math.sin(zone.centerAngle);
          
          return (
            <div
              key={privacyMode}
              className="absolute rounded-full border-2"
              style={{
                left: `${centerX - zone.spread}%`,
                top: `${centerY - zone.spread}%`,
                width: `${zone.spread * 2}%`,
                height: `${zone.spread * 2}%`,
                backgroundColor: zone.color,
                borderColor: zone.borderColor,
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* Connection lines from skills to center (subtle) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {positions.map((pos, i) => (
            <line
              key={i}
              x1={`${pos.x}%`}
              y1={`${pos.y}%`}
              x2="50%"
              y2="50%"
              stroke="#c0c0c0"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}
        </svg>

        {/* Center silver tree */}
        <Link
          href="/skills"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer hover:scale-105 transition-transform duration-300"
          aria-label="Navigate to Skills page"
        >
          <div className="relative">
            <SilverPineTree size="xl" />
            <div className="absolute -inset-4 bg-gray-300/20 rounded-full blur-lg animate-pulse" />
          </div>
        </Link>

        {/* Skill trees as constellation points */}
        {positions.map(({ skill, x, y, privacy }) => (
          <div
            key={skill.skillId}
            className="absolute cursor-pointer hover:scale-110 transition-transform duration-300 z-20"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Subtle glow around tree */}
            <div
              className="absolute rounded-full opacity-20 blur-md -z-10"
              style={{
                width: '40px',
                height: '40px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: privacy === 'public-heavy' 
                  ? '#7dd87d' 
                  : privacy === 'mixed' 
                  ? '#f4a460' 
                  : '#9370db',
              }}
            />
            {/* Tree */}
            {renderCustomTree(skill.customTreeType, privacy, 'sm')}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800/50">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
          Constellation Clusters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full bg-[#7dd87d] border border-green-300/50 dark:border-green-400/30 flex-shrink-0 mt-0.5 shadow-sm" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Public-Heavy Cluster
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {clusters['public-heavy'].length} skills
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full bg-[#f4a460] border border-amber-300/50 dark:border-amber-400/30 flex-shrink-0 mt-0.5 shadow-sm" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Mixed Cluster
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {clusters['mixed'].length} skills
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full bg-[#9370db] border border-purple-300/50 dark:border-purple-400/30 flex-shrink-0 mt-0.5 shadow-sm" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Private-Heavy Cluster
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {clusters['mostly-private'].length} skills
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

