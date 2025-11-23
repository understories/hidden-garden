/**
 * Layout Preview Page
 * 
 * Shows different layout options for the interactive skill forest visualization.
 * User can compare and select their preferred style.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  SpringCanopyTree,
  AutumnBlendTree,
  MoonlitBranchesTree,
  BaseTree,
  BioluminescentMushroom,
  MiniShrub,
  PrivacyMode,
} from '@/components/CustomTreeIcons';

// Mock skill data (same as main page)
const mockSkills = [
  {
    skillId: 'aztec-protocol',
    skillName: 'Aztec Noir Basics',
    participantCount: 1247,
    privacyMode: 'mostly-private' as const,
    customTreeType: 'shrub' as const,
  },
  {
    skillId: 'rust-foundations',
    skillName: 'Rust Foundations',
    participantCount: 2156,
    privacyMode: 'public-heavy' as const,
    customTreeType: 'spring' as const,
  },
  {
    skillId: 'zero-knowledge-basics',
    skillName: 'Zero-Knowledge Basics',
    participantCount: 892,
    privacyMode: 'mixed' as const,
    customTreeType: 'autumn' as const,
  },
  {
    skillId: 'advanced-circuits',
    skillName: 'Advanced Circuits',
    participantCount: 634,
    privacyMode: 'mostly-private' as const,
    customTreeType: 'mushroom' as const,
  },
  {
    skillId: 'l1-l2-bridging',
    skillName: 'L1 → L2 Bridging',
    participantCount: 445,
    privacyMode: 'mixed' as const,
    customTreeType: 'base' as const,
  },
  {
    skillId: 'noir-basics',
    skillName: 'Aztec Noir Advanced',
    participantCount: 1123,
    privacyMode: 'public-heavy' as const,
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

// Layout Option 1: Force-Directed Graph (Organic, Connected)
function ForceDirectedPreview() {
  // Simplified positions for preview (would be calculated dynamically in real implementation)
  const positions = [
    { x: 100, y: 80 },
    { x: 250, y: 120 },
    { x: 150, y: 200 },
    { x: 300, y: 180 },
    { x: 200, y: 280 },
    { x: 350, y: 250 },
  ];

  return (
    <div className="relative w-full h-[400px] border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Center silver tree */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-700">
            <span className="text-2xl">🌳</span>
          </div>
          <div className="absolute -inset-2 bg-gray-300/30 rounded-full blur-md animate-pulse" />
        </div>
      </div>

      {/* Skill trees with connection lines */}
      {mockSkills.map((skill, index) => {
        const pos = positions[index];
        const privacy = convertPrivacyMode(skill.privacyMode);
        return (
          <div key={skill.skillId}>
            {/* Connection line to center */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1={pos.x}
                y1={pos.y}
                x2="50%"
                y2="50%"
                stroke="rgba(156, 163, 175, 0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>
            {/* Tree */}
            <div
              className="absolute cursor-pointer hover:scale-110 transition-transform"
              style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}
            >
              {renderCustomTree(skill.customTreeType, privacy, 'sm')}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Layout Option 2: Isometric Grid (Game-like, Organized)
function IsometricGridPreview() {
  const gridCols = 3;
  const gridRows = 2;
  const tileSize = 100;
  const spacing = 20;

  return (
    <div className="relative w-full h-[400px] border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden flex items-center justify-center">
      <div className="relative" style={{ transform: 'rotateX(60deg) rotateZ(-45deg) scale(0.8)' }}>
        {/* Center silver tree */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center shadow-xl border-2 border-white dark:border-gray-700">
            <span className="text-3xl">🌳</span>
          </div>
        </div>

        {/* Grid of skill trees */}
        {mockSkills.map((skill, index) => {
          const row = Math.floor(index / gridCols);
          const col = index % gridCols;
          const x = (col - 1) * (tileSize + spacing);
          const y = (row - 0.5) * (tileSize + spacing);
          const privacy = convertPrivacyMode(skill.privacyMode);

          return (
            <div
              key={skill.skillId}
              className="absolute cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {renderCustomTree(skill.customTreeType, privacy, 'sm')}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Layout Option 3: Radial Clusters (Skills grouped around center)
function RadialClustersPreview() {
  const centerX = 50; // percentage
  const centerY = 50; // percentage
  const radius = 35; // percentage
  const angleStep = (2 * Math.PI) / mockSkills.length;

  return (
    <div className="relative w-full h-[400px] border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Center silver tree */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-xl border-2 border-white dark:border-gray-700">
          <span className="text-3xl">🌳</span>
        </div>
        <div className="absolute -inset-4 bg-gray-300/40 rounded-full blur-lg animate-pulse" />
      </div>

      {/* Skill trees in a circle */}
      {mockSkills.map((skill, index) => {
        const angle = index * angleStep - Math.PI / 2; // Start from top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const privacy = convertPrivacyMode(skill.privacyMode);

        return (
          <div
            key={skill.skillId}
            className="absolute cursor-pointer hover:scale-110 transition-transform"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {renderCustomTree(skill.customTreeType, privacy, 'sm')}
          </div>
        );
      })}

      {/* Cluster background zones (subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full border-2 border-amber-200/30 dark:border-amber-800/30" />
    </div>
  );
}

// Layout Option 4: Organic Forest (Natural clustering, varied spacing)
function OrganicForestPreview() {
  // Organic, varied positions (would be calculated with clustering algorithm in real implementation)
  const positions = [
    { x: 120, y: 100, cluster: 'private' },
    { x: 180, y: 140, cluster: 'private' },
    { x: 280, y: 120, cluster: 'public' },
    { x: 320, y: 180, cluster: 'public' },
    { x: 200, y: 240, cluster: 'mixed' },
    { x: 260, y: 280, cluster: 'mixed' },
  ];

  return (
    <div className="relative w-full h-[400px] border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Center silver tree */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-xl border-2 border-white dark:border-gray-700">
          <span className="text-3xl">🌳</span>
        </div>
        <div className="absolute -inset-4 bg-gray-300/30 rounded-full blur-lg" />
      </div>

      {/* Cluster backgrounds (subtle) */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-violet-100/20 dark:bg-violet-900/10 blur-2xl" />
      <div className="absolute top-24 right-32 w-40 h-40 rounded-full bg-green-100/20 dark:bg-green-900/10 blur-2xl" />
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-amber-100/20 dark:bg-amber-900/10 blur-2xl" />

      {/* Skill trees with organic positioning */}
      {mockSkills.map((skill, index) => {
        const pos = positions[index];
        const privacy = convertPrivacyMode(skill.privacyMode);

        return (
          <div
            key={skill.skillId}
            className="absolute cursor-pointer hover:scale-110 transition-transform"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {renderCustomTree(skill.customTreeType, privacy, 'sm')}
          </div>
        );
      })}
    </div>
  );
}

export default function LayoutPreviewPage() {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);

  const layouts = [
    {
      id: 'force-directed',
      name: 'Force-Directed Graph',
      description: 'Organic, flowing layout with trees connected by relationship lines. Natural clustering emerges from connections.',
      component: ForceDirectedPreview,
      pros: ['Natural, organic feel', 'Shows relationships clearly', 'Dynamic and fluid'],
      cons: ['Can be less organized', 'May require zoom for clarity'],
    },
    {
      id: 'isometric',
      name: 'Isometric Grid',
      description: 'Game-like, organized tile-based layout. Clean and structured, reminiscent of strategy games.',
      component: IsometricGridPreview,
      pros: ['Highly organized', 'Easy to scan', 'Familiar game aesthetic'],
      cons: ['Less organic', 'May feel rigid'],
    },
    {
      id: 'radial',
      name: 'Radial Clusters',
      description: 'Skills arranged in a circle around the center tree, with clustering by privacy mode.',
      component: RadialClustersPreview,
      pros: ['Clear center focus', 'Easy to see all skills', 'Good for clustering'],
      cons: ['Less space-efficient', 'May feel circular/constrained'],
    },
    {
      id: 'organic',
      name: 'Organic Forest',
      description: 'Natural, varied spacing with soft cluster zones. Mimics a real forest with natural groupings.',
      component: OrganicForestPreview,
      pros: ['Most natural/forest-like', 'Flexible clustering', 'Beautiful and immersive'],
      cons: ['May need careful positioning', 'Less predictable layout'],
    },
  ];

  return (
    <main className="max-w-7xl mx-auto space-y-8 py-8 px-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Layout Options Preview</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compare different layout styles for the interactive skill forest. Click on a layout to select it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {layouts.map((layout) => {
          const LayoutComponent = layout.component;
          const isSelected = selectedLayout === layout.id;

          return (
            <div
              key={layout.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
                  : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
              }`}
              onClick={() => setSelectedLayout(layout.id)}
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">{layout.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {layout.description}
                </p>
              </div>

              {/* Preview visualization */}
              <div className="mb-4">
                <LayoutComponent />
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-green-700 dark:text-green-400 mb-1">Pros:</div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    {layout.pros.map((pro, i) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-amber-700 dark:text-amber-400 mb-1">Cons:</div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    {layout.cons.map((con, i) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                  <span className="text-green-800 dark:text-green-300 font-medium">✓ Selected</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/skill-forest"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          ← Back to Skill Forest
        </Link>
        {selectedLayout && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Selected: <span className="font-semibold">{layouts.find(l => l.id === selectedLayout)?.name}</span>
          </div>
        )}
      </div>
    </main>
  );
}

