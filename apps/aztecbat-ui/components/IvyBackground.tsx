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

// Generate 150 vines (10x the original 15) with varied directions
function generateVineConfigs(): Array<{
  id: string;
  privacyMode: PrivacyMode;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  direction: 'horizontal' | 'vertical' | 'diagonal-up' | 'diagonal-down' | 'curved';
  pathVariation: number;
  duration: number;
  strokeWidth: number;
  opacity: number;
  blur: number;
  lightningDelay: number;
  lightningDuration: number;
}> {
  const configs: Array<{
    id: string;
    privacyMode: PrivacyMode;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    direction: 'horizontal' | 'vertical' | 'diagonal-up' | 'diagonal-down' | 'curved';
    pathVariation: number;
    duration: number;
    strokeWidth: number;
    opacity: number;
    blur: number;
    lightningDelay: number;
    lightningDuration: number;
  }> = [];

  const privacyModes: PrivacyMode[] = ['public-heavy', 'mixed', 'mostly-private'];
  const directions: Array<'horizontal' | 'vertical' | 'diagonal-up' | 'diagonal-down' | 'curved'> = 
    ['horizontal', 'vertical', 'diagonal-up', 'diagonal-down', 'curved'];
  
  for (let i = 0; i < 75; i++) {
    const privacyMode = privacyModes[i % 3];
    const direction = directions[i % 5];
    
    // Spread vines across entire screen with varied start/end points
    let startX: number, startY: number, endX: number, endY: number;
    
    switch (direction) {
      case 'horizontal':
        startX = -100 + (i % 200);
        startY = 50 + (i * 4) % 750;
        endX = 1300 + (i % 200);
        endY = startY + ((i % 30) - 15);
        break;
      case 'vertical':
        startX = 100 + (i * 7) % 1100;
        startY = -50 + (i % 100);
        endX = startX + ((i % 40) - 20);
        endY = 850 + (i % 100);
        break;
      case 'diagonal-up':
        startX = -100 + (i * 3) % 300;
        startY = 700 + (i * 5) % 200;
        endX = 1300 + (i * 3) % 300;
        endY = 50 + (i * 5) % 200;
        break;
      case 'diagonal-down':
        startX = -100 + (i * 3) % 300;
        startY = 50 + (i * 5) % 200;
        endX = 1300 + (i * 3) % 300;
        endY = 700 + (i * 5) % 200;
        break;
      case 'curved':
        startX = 100 + (i * 8) % 1000;
        startY = 100 + (i * 6) % 600;
        endX = startX + 400 + (i % 300);
        endY = startY + 200 - (i % 400);
        break;
    }
    
    const variation = (i % 50) - 25;
    const duration = 20 + (i % 20);
    const strokeWidth = 0.8 + (i % 8) * 0.1;
    const opacity = 0.3 + (i % 5) * 0.1;
    const blur = 0.5 + (i % 8) * 0.1;
    const lightningDelay = (i * 0.3) % 10;
    const lightningDuration = 2 + (i % 3);

    configs.push({
      id: `v${i + 1}`,
      privacyMode,
      startX,
      startY,
      endX,
      endY,
      direction,
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

// Generate organic ivy-like path with tendrils and natural curves
function generateVinePath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  direction: 'horizontal' | 'vertical' | 'diagonal-up' | 'diagonal-down' | 'curved',
  variation: number
): string {
  const v1 = variation * 0.5;
  const v2 = variation * 0.3;
  const v3 = variation * 0.7;
  const v4 = variation * 0.4;
  const v5 = variation * 0.6;
  
  const midX1 = startX + (endX - startX) * 0.2;
  const midX2 = startX + (endX - startX) * 0.4;
  const midX3 = startX + (endX - startX) * 0.6;
  const midX4 = startX + (endX - startX) * 0.8;
  const midY1 = startY + (endY - startY) * 0.2;
  const midY2 = startY + (endY - startY) * 0.4;
  const midY3 = startY + (endY - startY) * 0.6;
  const midY4 = startY + (endY - startY) * 0.8;
  
  // Create more organic, ivy-like paths with multiple curves
  switch (direction) {
    case 'horizontal':
      return `M ${startX} ${startY} 
        C ${midX1} ${startY + v1}, ${midX2} ${startY - v2}, ${midX3} ${startY + v3}
        C ${midX4} ${startY - v4}, ${endX - 20} ${endY + v5}, ${endX} ${endY}`;
    
    case 'vertical':
      return `M ${startX} ${startY} 
        C ${startX + v1} ${midY1}, ${startX - v2} ${midY2}, ${startX + v3} ${midY3}
        C ${startX - v4} ${midY4}, ${endX + v5} ${endY - 20}, ${endX} ${endY}`;
    
    case 'diagonal-up':
      return `M ${startX} ${startY} 
        C ${midX1} ${midY1 + v1}, ${midX2} ${midY2 - v2}, ${midX3} ${midY3 + v3}
        C ${midX4} ${midY4 - v4}, ${endX - 15} ${endY + v5}, ${endX} ${endY}`;
    
    case 'diagonal-down':
      return `M ${startX} ${startY} 
        C ${midX1} ${midY1 - v1}, ${midX2} ${midY2 + v2}, ${midX3} ${midY3 - v3}
        C ${midX4} ${midY4 + v4}, ${endX - 15} ${endY - v5}, ${endX} ${endY}`;
    
    case 'curved':
      // Organic ivy tendril-like path
      const curve1X = startX + (endX - startX) * 0.25;
      const curve1Y = startY + (endY - startY) * 0.25 + v1;
      const curve2X = startX + (endX - startX) * 0.5;
      const curve2Y = startY + (endY - startY) * 0.5 - v2;
      const curve3X = startX + (endX - startX) * 0.75;
      const curve3Y = startY + (endY - startY) * 0.75 + v3;
      return `M ${startX} ${startY} 
        Q ${curve1X} ${curve1Y}, ${curve2X} ${curve2Y}
        Q ${curve3X} ${curve3Y}, ${endX} ${endY}`;
    
    default:
      return `M ${startX} ${startY} L ${endX} ${endY}`;
  }
}

// Calculate point along path at position t (0-1)
function getPointOnPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  direction: 'horizontal' | 'vertical' | 'diagonal-up' | 'diagonal-down' | 'curved',
  variation: number,
  t: number
): { x: number; y: number } {
  // Linear interpolation with curve variation
  const x = startX + (endX - startX) * t;
  const y = startY + (endY - startY) * t;
  
  // Add organic variation based on direction
  const v = variation * 0.3;
  let offsetX = 0;
  let offsetY = 0;
  
  switch (direction) {
    case 'horizontal':
      offsetY = Math.sin(t * Math.PI * 2) * v;
      break;
    case 'vertical':
      offsetX = Math.sin(t * Math.PI * 2) * v;
      break;
    case 'diagonal-up':
    case 'diagonal-down':
      offsetX = Math.sin(t * Math.PI * 3) * v * 0.5;
      offsetY = Math.cos(t * Math.PI * 3) * v * 0.5;
      break;
    case 'curved':
      offsetX = Math.sin(t * Math.PI * 4) * v;
      offsetY = Math.cos(t * Math.PI * 4) * v;
      break;
  }
  
  return { x: x + offsetX, y: y + offsetY };
}

// Generate animated path values
function generateAnimatedPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  direction: 'horizontal' | 'vertical' | 'diagonal-up' | 'diagonal-down' | 'curved',
  variation: number
): string {
  const base = generateVinePath(startX, startY, endX, endY, direction, variation);
  const alt1 = generateVinePath(startX, startY + 5, endX, endY + 3, direction, variation + 2);
  const alt2 = generateVinePath(startX, startY - 3, endX, endY - 2, direction, variation - 1);
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
          
          // Calculate approximate path length for lightning animation
          const pathLength = Math.sqrt(
            Math.pow(config.endX - config.startX, 2) + 
            Math.pow(config.endY - config.startY, 2)
          );
          
          return (
            <g key={config.id} className={`ivy-vine-${config.id}`}>
              {/* Base vine path - thicker main stem */}
              <path
                d={generateVinePath(config.startX, config.startY, config.endX, config.endY, config.direction, config.pathVariation)}
                fill="none"
                stroke="currentColor"
                strokeWidth={config.strokeWidth * 1.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${colors.light} dark:${colors.dark}`}
                style={{
                  filter: `blur(${config.blur}px)`,
                  opacity: config.opacity,
                }}
              >
                <animate
                  attributeName="d"
                  values={generateAnimatedPath(config.startX, config.startY, config.endX, config.endY, config.direction, config.pathVariation)}
                  dur={`${config.duration}s`}
                  repeatCount="indefinite"
                />
              </path>

              {/* Subtle growth pulse - like sap flowing through ivy */}
              <path
                d={generateVinePath(config.startX, config.startY, config.endX, config.endY, config.direction, config.pathVariation)}
                fill="none"
                stroke="currentColor"
                strokeWidth={config.strokeWidth * 1.5}
                strokeLinecap="round"
                className={`${colors.lightSecondary} dark:${colors.darkSecondary}`}
                style={{
                  filter: `blur(${config.blur * 1.5}px)`,
                  opacity: 0,
                }}
              >
                <animate
                  attributeName="d"
                  values={generateAnimatedPath(config.startX, config.startY, config.endX, config.endY, config.direction, config.pathVariation)}
                  dur={`${config.duration}s`}
                  repeatCount="indefinite"
                />
                {/* Subtle growth pulse - slower and more organic */}
                <animate
                  attributeName="opacity"
                  values={`0;0;0.6;0.8;0.6;0;0`}
                  dur={`${config.lightningDuration * 1.5}s`}
                  repeatCount="indefinite"
                  begin={`${config.lightningDelay}s`}
                />
                {/* Growth travels along path */}
                <animate
                  attributeName="stroke-dasharray"
                  values={`0,${pathLength};${pathLength * 0.5},${pathLength * 0.5};${pathLength},0;0,${pathLength}`}
                  dur={`${config.lightningDuration * 1.5}s`}
                  repeatCount="indefinite"
                  begin={`${config.lightningDelay}s`}
                />
              </path>

              {/* Ivy leaves - heart-shaped and clustered at nodes */}
              {userData && userData.positions.map((position, leafIndex) => {
                const point = getPointOnPath(config.startX, config.startY, config.endX, config.endY, config.direction, config.pathVariation, position);
                const leafSize = Math.min(userData.userCount / 10, 6);
                const rotation = (leafIndex * 60) % 360;
                const leafOffset = (leafIndex % 3) * 8 - 8; // Cluster leaves at nodes
                
                // Heart-shaped ivy leaf path
                const leafPath = `
                  M ${point.x} ${point.y + leafOffset}
                  C ${point.x - leafSize * 0.5} ${point.y + leafOffset - leafSize * 0.3},
                    ${point.x - leafSize} ${point.y + leafOffset - leafSize * 0.8},
                    ${point.x - leafSize * 0.3} ${point.y + leafOffset - leafSize * 1.2}
                  C ${point.x} ${point.y + leafOffset - leafSize * 1.4},
                    ${point.x} ${point.y + leafOffset - leafSize * 1.4},
                    ${point.x + leafSize * 0.3} ${point.y + leafOffset - leafSize * 1.2}
                  C ${point.x + leafSize} ${point.y + leafOffset - leafSize * 0.8},
                    ${point.x + leafSize * 0.5} ${point.y + leafOffset - leafSize * 0.3},
                    ${point.x} ${point.y + leafOffset}
                  Z
                `;
                
                return (
                  <g key={`leaf-${config.id}-${leafIndex}`}>
                    <path
                      d={leafPath}
                      className={`${colors.lightSecondary} dark:${colors.darkSecondary}`}
                      fill="currentColor"
                      opacity={config.opacity * 0.7}
                      transform={`rotate(${rotation} ${point.x} ${point.y + leafOffset})`}
                      style={{
                        filter: `blur(${config.blur * 0.3}px)`,
                      }}
                    >
                      {/* Gentle leaf animation */}
                      <animate
                        attributeName="opacity"
                        values={`${config.opacity * 0.7};${config.opacity * 0.95};${config.opacity * 0.7}`}
                        dur={`${4 + (leafIndex % 3)}s`}
                        repeatCount="indefinite"
                        begin={`${leafIndex * 0.25}s`}
                      />
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values={`${rotation} ${point.x} ${point.y + leafOffset};${rotation + 8} ${point.x} ${point.y + leafOffset};${rotation} ${point.x} ${point.y + leafOffset}`}
                        dur={`${5 + (leafIndex % 2)}s`}
                        repeatCount="indefinite"
                        begin={`${leafIndex * 0.3}s`}
                      />
                    </path>
                    {/* Leaf vein detail */}
                    <line
                      x1={point.x}
                      y1={point.y + leafOffset}
                      x2={point.x}
                      y2={point.y + leafOffset - leafSize * 1.2}
                      stroke="currentColor"
                      strokeWidth="0.5"
                      opacity={config.opacity * 0.5}
                      transform={`rotate(${rotation} ${point.x} ${point.y + leafOffset})`}
                      style={{
                        filter: `blur(${config.blur * 0.2}px)`,
                      }}
                    />
                  </g>
                );
              })}
              
              {/* Small tendrils branching off main vine */}
              {userData && userData.positions.length > 0 && userData.positions.slice(0, 3).map((position, tendrilIndex) => {
                const basePoint = getPointOnPath(config.startX, config.startY, config.endX, config.endY, config.direction, config.pathVariation, position);
                const tendrilLength = 15 + (tendrilIndex * 5);
                const tendrilAngle = (tendrilIndex * 120) % 360;
                const endX = basePoint.x + Math.cos((tendrilAngle * Math.PI) / 180) * tendrilLength;
                const endY = basePoint.y + Math.sin((tendrilAngle * Math.PI) / 180) * tendrilLength;
                
                return (
                  <path
                    key={`tendril-${config.id}-${tendrilIndex}`}
                    d={`M ${basePoint.x} ${basePoint.y} Q ${basePoint.x + (endX - basePoint.x) * 0.5} ${basePoint.y + (endY - basePoint.y) * 0.5 + 5}, ${endX} ${endY}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={config.strokeWidth * 0.6}
                    strokeLinecap="round"
                    className={`${colors.light} dark:${colors.dark}`}
                    opacity={config.opacity * 0.5}
                    style={{
                      filter: `blur(${config.blur * 0.8}px)`,
                    }}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

