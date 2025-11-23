/**
 * FallingLeaves Component
 *
 * Ghibli-style falling leaves animation for landing page background.
 * Soft, organic shapes with gentle colors inspired by Studio Ghibli.
 * Leaves are colored according to skill-tree privacy modes and sized based on data.
 */

'use client';

import React, { useMemo } from 'react';

type PrivacyMode = 'public-heavy' | 'mixed' | 'mostly-private';

type LeafData = {
  id: string;
  privacyMode: PrivacyMode;
  size: 'sm' | 'md' | 'lg';
  startX: number; // 0-100 (percentage)
  delay: number; // 0-10 seconds
  duration: number; // 10-20 seconds
  rotation: number; // degrees
  drift: number; // pixels
};

// Get Ghibli-inspired soft colors based on privacy mode
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

// Get soft shadow for Ghibli aesthetic (no neon glow)
function getSoftShadow(privacyMode: PrivacyMode): string {
  switch (privacyMode) {
    case 'public-heavy':
      return 'drop-shadow(0 2px 4px rgba(125, 216, 125, 0.3))';
    case 'mixed':
      return 'drop-shadow(0 2px 4px rgba(244, 164, 96, 0.3))';
    case 'mostly-private':
      return 'drop-shadow(0 2px 4px rgba(135, 206, 235, 0.3))';
  }
}

// Generate mock leaf data
function generateLeaves(count: number = 40): LeafData[] {
  const privacyModes: PrivacyMode[] = ['public-heavy', 'mixed', 'mostly-private'];
  const sizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `leaf-${i}`,
    privacyMode: privacyModes[Math.floor(Math.random() * privacyModes.length)],
    size: sizes[Math.floor(Math.random() * sizes.length)],
    startX: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 10,
    rotation: Math.random() * 360,
    drift: (Math.random() - 0.5) * 100, // -50 to +50 pixels
  }));
}

// Ghibli-style organic leaf SVG
function LeafSVG({ size, color }: { size: 'sm' | 'md' | 'lg'; color: string }) {
  const leafSize = size === 'sm' ? 12 : size === 'md' ? 18 : 24;
  const viewBox = '0 0 24 32';
  
  // Organic, flowing leaf shape inspired by Ghibli style
  return (
    <svg
      width={leafSize}
      height={leafSize * 1.33}
      viewBox={viewBox}
      className="block"
      style={{
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
      }}
    >
      {/* Organic leaf shape with smooth curves */}
      <path
        d="M 12 2 
           Q 8 4, 6 8
           Q 4 12, 5 16
           Q 6 20, 8 22
           Q 10 24, 12 26
           Q 14 24, 16 22
           Q 18 20, 19 16
           Q 20 12, 18 8
           Q 16 4, 12 2 Z"
        fill={color}
        fillOpacity="0.85"
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity="0.6"
      />
      {/* Leaf vein */}
      <path
        d="M 12 2 L 12 26"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.4"
        fill="none"
      />
      {/* Side veins */}
      <path
        d="M 12 8 Q 9 10, 7 12"
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity="0.3"
        fill="none"
      />
      <path
        d="M 12 8 Q 15 10, 17 12"
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity="0.3"
        fill="none"
      />
      {/* Stem */}
      <path
        d="M 12 26 L 12 30"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FallingLeaves() {
  const leaves = useMemo(() => generateLeaves(40), []);

  return (
    <>
      {/* Inject dynamic keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: leaves.map((leaf) => `
              @keyframes fall-${leaf.id} {
                0% {
                  transform: translateY(0) translateX(0) rotate(${leaf.rotation}deg);
                  opacity: 0;
                }
                5% {
                  opacity: 0.9;
                }
                95% {
                  opacity: 0.9;
                }
                100% {
                  transform: translateY(calc(100vh + 20px)) translateX(${leaf.drift}px) rotate(${leaf.rotation + 180}deg);
                  opacity: 0;
                }
              }
          
          @media (prefers-reduced-motion: reduce) {
            @keyframes fall-${leaf.id} {
              0%, 100% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0.3;
              }
            }
          }
        `).join('\n')
      }} />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {leaves.map((leaf) => {
          const color = getGhibliColor(leaf.privacyMode);
          const shadow = getSoftShadow(leaf.privacyMode);
          
          return (
            <div
              key={leaf.id}
              className="absolute"
              style={{
                left: `${leaf.startX}%`,
                top: '-20px',
                animation: `fall-${leaf.id} ${leaf.duration}s ease-in-out ${leaf.delay}s infinite`,
                filter: shadow,
                willChange: 'transform',
              }}
            >
              <LeafSVG size={leaf.size} color={color} />
            </div>
          );
        })}
      </div>
    </>
  );
}

