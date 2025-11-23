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

// Generate vine data with privacy modes
const vineConfigs: Array<{
  id: string;
  privacyMode: PrivacyMode;
  startY: number;
  pathVariation: number;
  duration: number;
  strokeWidth: number;
  opacity: number;
  blur: number;
}> = [
  // Public-heavy vines (emerald/cyan) - 5 vines
  { id: 'v1', privacyMode: 'public-heavy', startY: 450, pathVariation: 0, duration: 25, strokeWidth: 1.5, opacity: 1, blur: 0.5 },
  { id: 'v2', privacyMode: 'public-heavy', startY: 380, pathVariation: 20, duration: 27, strokeWidth: 1.3, opacity: 0.8, blur: 0.6 },
  { id: 'v3', privacyMode: 'public-heavy', startY: 520, pathVariation: -15, duration: 26, strokeWidth: 1.2, opacity: 0.7, blur: 0.7 },
  { id: 'v4', privacyMode: 'public-heavy', startY: 320, pathVariation: 30, duration: 28, strokeWidth: 1.1, opacity: 0.6, blur: 0.8 },
  { id: 'v5', privacyMode: 'public-heavy', startY: 580, pathVariation: -25, duration: 24, strokeWidth: 1, opacity: 0.5, blur: 0.9 },
  
  // Mixed vines (amber/orange) - 5 vines
  { id: 'v6', privacyMode: 'mixed', startY: 550, pathVariation: 10, duration: 30, strokeWidth: 1.2, opacity: 0.7, blur: 0.8 },
  { id: 'v7', privacyMode: 'mixed', startY: 350, pathVariation: -20, duration: 32, strokeWidth: 1.1, opacity: 0.6, blur: 0.9 },
  { id: 'v8', privacyMode: 'mixed', startY: 600, pathVariation: 25, duration: 29, strokeWidth: 1, opacity: 0.5, blur: 1 },
  { id: 'v9', privacyMode: 'mixed', startY: 300, pathVariation: -10, duration: 31, strokeWidth: 1.3, opacity: 0.65, blur: 0.7 },
  { id: 'v10', privacyMode: 'mixed', startY: 480, pathVariation: 15, duration: 33, strokeWidth: 1.1, opacity: 0.55, blur: 0.85 },
  
  // Mostly-private vines (blue/purple) - 5 vines
  { id: 'v11', privacyMode: 'mostly-private', startY: 400, pathVariation: -5, duration: 35, strokeWidth: 1, opacity: 0.5, blur: 1 },
  { id: 'v12', privacyMode: 'mostly-private', startY: 560, pathVariation: 18, duration: 34, strokeWidth: 1.1, opacity: 0.55, blur: 0.9 },
  { id: 'v13', privacyMode: 'mostly-private', startY: 280, pathVariation: -22, duration: 36, strokeWidth: 0.9, opacity: 0.45, blur: 1.1 },
  { id: 'v14', privacyMode: 'mostly-private', startY: 620, pathVariation: 12, duration: 37, strokeWidth: 1, opacity: 0.4, blur: 1.2 },
  { id: 'v15', privacyMode: 'mostly-private', startY: 360, pathVariation: -18, duration: 38, strokeWidth: 0.95, opacity: 0.42, blur: 1.15 },
];

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
        {/* Generate all vines with privacy-based colors */}
        {vineConfigs.map((config) => {
          const colors = getPrivacyColors(config.privacyMode);
          return (
            <g key={config.id} className={`ivy-vine-${config.id}`}>
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
            </g>
          );
        })}
      </svg>
    </div>
  );
}

