/**
 * IvyBackground Component
 * 
 * Animated ivy vines for the landing page background.
 * Creates organic, data-viz-inspired patterns that subtly move.
 * Vines represent skill connections; nodes represent data points.
 * Colors follow skill tree privacy modes: public-heavy (emerald/cyan), mixed (amber/orange), mostly-private (blue/purple).
 */

'use client';

import React from 'react';

type PrivacyMode = 'public-heavy' | 'mixed' | 'mostly-private';

// Get color classes based on privacy mode (matching skill tree)
function getPrivacyColors(privacyMode: PrivacyMode): {
  light: string;
  dark: string;
  lightSecondary: string;
  darkSecondary: string;
} {
  switch (privacyMode) {
    case 'public-heavy':
      return {
        light: 'text-emerald-600',
        dark: 'text-emerald-400',
        lightSecondary: 'text-cyan-500',
        darkSecondary: 'text-cyan-300',
      };
    case 'mixed':
      return {
        light: 'text-amber-600',
        dark: 'text-amber-400',
        lightSecondary: 'text-orange-500',
        darkSecondary: 'text-orange-300',
      };
    case 'mostly-private':
      return {
        light: 'text-blue-600',
        dark: 'text-blue-400',
        lightSecondary: 'text-indigo-500',
        darkSecondary: 'text-indigo-300',
      };
  }
}

// Generate 150 vines (10x the original 15)
function generateVineConfigs(): Array<{
  id: string;
  privacyMode: PrivacyMode;
  startY: number;
  pathVariation: number;
  duration: number;
  strokeWidth: number;
  opacity: number;
  blur: number;
  lightningDelay: number; // Delay for lightning pulse
  lightningDuration: number; // Duration of lightning pulse
}> {
  const configs: Array<{
    id: string;
    privacyMode: PrivacyMode;
    startY: number;
    pathVariation: number;
    duration: number;
    strokeWidth: number;
    opacity: number;
    blur: number;
    lightningDelay: number;
    lightningDuration: number;
  }> = [];

  const privacyModes: PrivacyMode[] = ['public-heavy', 'mixed', 'mostly-private'];
  
  for (let i = 0; i < 150; i++) {
    const privacyMode = privacyModes[i % 3];
    const baseY = 200 + (i % 600); // Distribute across 600px height range
    const variation = (i % 50) - 25; // Vary path
    const duration = 20 + (i % 20); // 20-40s range
    const strokeWidth = 0.8 + (i % 8) * 0.1; // 0.8-1.5px
    const opacity = 0.3 + (i % 5) * 0.1; // 0.3-0.7
    const blur = 0.5 + (i % 8) * 0.1; // 0.5-1.2px
    const lightningDelay = (i * 0.3) % 10; // Stagger lightning
    const lightningDuration = 2 + (i % 3); // 2-4s

    configs.push({
      id: `v${i + 1}`,
      privacyMode,
      startY: baseY,
      pathVariation: variation,
      duration,
      strokeWidth,
      opacity,
      blur,
      lightningDelay,
      lightningDuration,
    });
  }

  return configs;
}

const vineConfigs = generateVineConfigs();

// Mock user data - users who have skilled up (for leaves)
const mockUserData: Array<{
  vineId: string;
  userCount: number; // Number of users who skilled up on this vine
  positions: number[]; // Positions along vine (0-1) where leaves appear
}> = vineConfigs.map((config, index) => {
  // Generate random user counts (1-50 users per vine)
  const userCount = Math.floor(Math.random() * 50) + 1;
  // Generate leaf positions based on user count (more users = more leaves)
  const leafCount = Math.min(userCount, 15); // Max 15 leaves per vine
  const positions: number[] = [];
  for (let i = 0; i < leafCount; i++) {
    positions.push(Math.random()); // Random position along vine
  }
  positions.sort(); // Sort for visual consistency
  
  return {
    vineId: config.id,
    userCount,
    positions,
  };
});

// Generate path for a vine
function generateVinePath(startY: number, variation: number): string {
  const v1 = variation * 0.5;
  const v2 = variation * 0.3;
  const v3 = variation * 0.7;
  const v4 = variation * 0.4;
  
  return `M -100 ${startY} 
    C 50 ${startY - 30 + v1}, 150 ${startY - 50 + v2}, 300 ${startY - 40 + v3}
    S 500 ${startY - 20 + v4}, 600 ${startY - 35 + v1}
    C 700 ${startY - 50 + v2}, 800 ${startY - 30 + v3}, 950 ${startY - 40 + v4}
    S 1100 ${startY - 50 + v1}, 1300 ${startY - 30 + v2}`;
}

// Calculate point along path at position t (0-1)
function getPointOnPath(startY: number, variation: number, t: number): { x: number; y: number } {
  // Approximate position along the cubic bezier path
  const totalLength = 1400; // Approximate path length
  const x = -100 + t * totalLength;
  
  // Approximate y using the curve equation
  const v1 = variation * 0.5;
  const v2 = variation * 0.3;
  const v3 = variation * 0.7;
  const v4 = variation * 0.4;
  
  // Simplified curve approximation
  const curveY = startY - 30 + Math.sin(t * Math.PI * 2) * 20 + (variation * 0.3);
  const y = curveY;
  
  return { x, y };
}

// Generate animated path values
function generateAnimatedPath(startY: number, variation: number): string {
  const base = generateVinePath(startY, variation);
  const alt1 = generateVinePath(startY + 5, variation + 2);
  const alt2 = generateVinePath(startY - 3, variation - 1);
  return `${base};${alt1};${base};${alt2};${base}`;
}

export function IvyBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.15] dark:opacity-[0.08]">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Generate all vines with privacy-based colors and lightning effects */}
        {vineConfigs.map((config) => {
          const colors = getPrivacyColors(config.privacyMode);
          const userData = mockUserData.find(d => d.vineId === config.id);
          
          return (
            <g key={config.id} className={`ivy-vine-${config.id}`}>
              {/* Base vine path */}
              <path
                d={generateVinePath(config.startY, config.pathVariation)}
                fill="none"
                stroke="currentColor"
                strokeWidth={config.strokeWidth}
                strokeLinecap="round"
                className={`${colors.light} dark:${colors.dark}`}
                style={{
                  filter: `blur(${config.blur}px)`,
                  opacity: config.opacity,
                }}
              >
                <animate
                  attributeName="d"
                  values={generateAnimatedPath(config.startY, config.pathVariation)}
                  dur={`${config.duration}s`}
                  repeatCount="indefinite"
                />
              </path>

              {/* Lightning pulse effect - travels along the vine */}
              <path
                d={generateVinePath(config.startY, config.pathVariation)}
                fill="none"
                stroke="currentColor"
                strokeWidth={config.strokeWidth * 2}
                strokeLinecap="round"
                className={`${colors.lightSecondary} dark:${colors.darkSecondary}`}
                style={{
                  filter: `blur(${config.blur * 2}px)`,
                  opacity: 0,
                }}
              >
                <animate
                  attributeName="d"
                  values={generateAnimatedPath(config.startY, config.pathVariation)}
                  dur={`${config.duration}s`}
                  repeatCount="indefinite"
                />
                {/* Lightning pulse animation */}
                <animate
                  attributeName="opacity"
                  values={`0;0;0.8;1;0.8;0;0`}
                  dur={`${config.lightningDuration}s`}
                  repeatCount="indefinite"
                  begin={`${config.lightningDelay}s`}
                />
                {/* Lightning travels along path using stroke-dasharray */}
                <animate
                  attributeName="stroke-dasharray"
                  values="0,1400;700,700;1400,0;0,1400"
                  dur={`${config.lightningDuration}s`}
                  repeatCount="indefinite"
                  begin={`${config.lightningDelay}s`}
                />
              </path>

              {/* Leaves based on user data */}
              {userData && userData.positions.map((position, leafIndex) => {
                const point = getPointOnPath(config.startY, config.pathVariation, position);
                const leafSize = Math.min(userData.userCount / 10, 5); // Size based on user count
                const rotation = (leafIndex * 45) % 360; // Vary rotation
                
                return (
                  <ellipse
                    key={`leaf-${config.id}-${leafIndex}`}
                    cx={point.x}
                    cy={point.y}
                    rx={leafSize}
                    ry={leafSize * 1.5}
                    className={`${colors.lightSecondary} dark:${colors.darkSecondary}`}
                    fill="currentColor"
                    opacity={config.opacity * 0.6}
                    transform={`rotate(${rotation} ${point.x} ${point.y})`}
                    style={{
                      filter: `blur(${config.blur * 0.5}px)`,
                    }}
                  >
                    {/* Gentle leaf animation */}
                    <animate
                      attributeName="opacity"
                      values={`${config.opacity * 0.6};${config.opacity * 0.9};${config.opacity * 0.6}`}
                      dur={`${3 + (leafIndex % 3)}s`}
                      repeatCount="indefinite"
                      begin={`${leafIndex * 0.2}s`}
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values={`${rotation} ${point.x} ${point.y};${rotation + 5} ${point.x} ${point.y};${rotation} ${point.x} ${point.y}`}
                      dur={`${4 + (leafIndex % 2)}s`}
                      repeatCount="indefinite"
                      begin={`${leafIndex * 0.3}s`}
                    />
                  </ellipse>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

