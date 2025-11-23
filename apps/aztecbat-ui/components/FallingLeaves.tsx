/**
 * FallingLeaves Component
 *
 * 8-bit neon style falling leaves animation for landing page background.
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

// Get 8-bit neon colors based on privacy mode
function getNeonColor(privacyMode: PrivacyMode): string {
  switch (privacyMode) {
    case 'public-heavy':
      return '#00ff88'; // Neon emerald
    case 'mixed':
      return '#ffaa00'; // Neon amber
    case 'mostly-private':
      return '#0066ff'; // Neon blue
  }
}

// Get neon glow filter
function getNeonGlow(privacyMode: PrivacyMode): string {
  const color = getNeonColor(privacyMode);
  // Extract RGB values for glow
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `drop-shadow(0 0 4px rgba(${r}, ${g}, ${b}, 0.8)) drop-shadow(0 0 8px rgba(${r}, ${g}, ${b}, 0.6)) drop-shadow(0 0 12px rgba(${r}, ${g}, ${b}, 0.4))`;
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

// 8-bit pixelated leaf SVG
function LeafSVG({ size, color }: { size: 'sm' | 'md' | 'lg'; color: string }) {
  const pixelSize = size === 'sm' ? 12 : size === 'md' ? 18 : 24; // 50% bigger: 8->12, 12->18, 16->24
  const viewBox = '0 0 16 16';
  
  // Simple 8-bit leaf shape (blocky, pixelated)
  // Using a diamond/leaf-like pixel pattern
  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox={viewBox}
      style={{
        imageRendering: 'pixelated',
        imageRendering: '-moz-crisp-edges',
        imageRendering: 'crisp-edges',
      }}
      className="block"
    >
      {/* 8-bit leaf shape - simple diamond with pixels */}
      {/* Top point */}
      <rect x="7" y="2" width="2" height="2" fill={color} />
      {/* Upper body */}
      <rect x="5" y="4" width="2" height="2" fill={color} />
      <rect x="7" y="4" width="2" height="2" fill={color} />
      <rect x="9" y="4" width="2" height="2" fill={color} />
      {/* Middle */}
      <rect x="4" y="6" width="2" height="2" fill={color} />
      <rect x="6" y="6" width="2" height="2" fill={color} />
      <rect x="8" y="6" width="2" height="2" fill={color} />
      <rect x="10" y="6" width="2" height="2" fill={color} />
      {/* Lower body */}
      <rect x="5" y="8" width="2" height="2" fill={color} />
      <rect x="7" y="8" width="2" height="2" fill={color} />
      <rect x="9" y="8" width="2" height="2" fill={color} />
      {/* Bottom point */}
      <rect x="7" y="10" width="2" height="2" fill={color} />
      {/* Stem */}
      <rect x="7" y="12" width="2" height="2" fill={color} />
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
              opacity: 1;
            }
            95% {
              opacity: 1;
            }
            100% {
              transform: translateY(calc(100vh + 20px)) translateX(${leaf.drift}px) rotate(${leaf.rotation + 360}deg);
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
          const color = getNeonColor(leaf.privacyMode);
          const glow = getNeonGlow(leaf.privacyMode);
          
          return (
            <div
              key={leaf.id}
              className="absolute"
              style={{
                left: `${leaf.startX}%`,
                top: '-20px',
                animation: `fall-${leaf.id} ${leaf.duration}s linear ${leaf.delay}s infinite`,
                filter: glow,
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

