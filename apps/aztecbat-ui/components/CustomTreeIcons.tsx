/**
 * Custom Tree Icons - Lunar-Punk Bioluminescent Forest
 * 
 * A cohesive set of SVG tree and plant graphics for the Skill Forest interface.
 * Soft Ghibli-inspired forms with bioluminescent lunar-punk aesthetics.
 * Each tree is designed to be simple, scalable, and easily recolorable.
 */

import React from 'react';

export type PrivacyMode = 'public-heavy' | 'mixed' | 'private-heavy';

type TreeIconProps = {
  privacy: PrivacyMode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

// Base size calculations
function getBaseSize(size: 'sm' | 'md' | 'lg'): number {
  switch (size) {
    case 'sm': return 32;
    case 'md': return 48;
    case 'lg': return 64;
  }
}

// Simplified privacy-based color palette (one color per preference)
function getPrivacyGradient(privacy: PrivacyMode): {
  primary: string;
  secondary: string;
  tertiary: string;
  glow: string;
} {
  switch (privacy) {
    case 'public-heavy':
      // Spring green only
      return {
        primary: '#7dd87d', // Soft spring green
        secondary: '#7dd87d', // Same spring green
        tertiary: '#7dd87d', // Same spring green
        glow: 'rgba(125, 216, 125, 0.3)',
      };
    case 'mixed':
      // Amber only
      return {
        primary: '#f4a460', // Soft sandy amber
        secondary: '#f4a460', // Same amber
        tertiary: '#f4a460', // Same amber
        glow: 'rgba(244, 164, 96, 0.3)',
      };
    case 'private-heavy':
      // Violet only
      return {
        primary: '#9370db', // Soft violet
        secondary: '#9370db', // Same violet
        tertiary: '#9370db', // Same violet
        glow: 'rgba(147, 112, 219, 0.3)',
      };
  }
}

// Unused colors from original palette (for reference)
export const unusedColors = {
  'public-heavy': {
    cyan: '#5dd5d5', // Soft cyan
    deeperCyan: '#4dd0d0', // Deeper cyan
    skyBlue: '#87ceeb', // Soft sky blue
  },
  'mixed': {
    coralOrange: '#ff8c69', // Soft coral orange
    pink: '#ff7f9f', // Soft pink
  },
  'private-heavy': {
    indigo: '#6a5acd', // Soft indigo
    moonBlue: '#87ceeb', // Soft sky blue (moon-blue)
  },
};

/**
 * 1. Public-Heavy Tree ("Spring Canopy")
 * Soft, round crown with light green → cyan bioluminescent gradient
 */
export function SpringCanopyTree({ privacy, size = 'md', className = '' }: TreeIconProps) {
  const baseSize = getBaseSize(size);
  const colors = getPrivacyGradient(privacy);
  const viewBox = '0 0 48 64';

  return (
    <svg
      width={baseSize}
      height={baseSize * (64 / 48)}
      viewBox={viewBox}
      className={className}
      style={{
        filter: `drop-shadow(0 2px 4px ${colors.glow})`,
      }}
      aria-label="Spring Canopy Tree"
    >
      <defs>
        <linearGradient id={`spring-canopy-${privacy}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.9" />
          <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.85" />
          <stop offset="100%" stopColor={colors.tertiary} stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id={`spring-glow-${privacy}`} cx="50%" cy="30%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Gentle aura/glow */}
      <ellipse
        cx="24"
        cy="28"
        rx="20"
        ry="18"
        fill={`url(#spring-glow-${privacy})`}
      />

      {/* Soft, round crown - Ghibli style */}
      <ellipse
        cx="24"
        cy="28"
        rx="18"
        ry="16"
        fill={`url(#spring-canopy-${privacy})`}
      />
      <ellipse
        cx="24"
        cy="26"
        rx="14"
        ry="12"
        fill={colors.primary}
        fillOpacity="0.7"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="10"
        ry="8"
        fill={colors.secondary}
        fillOpacity="0.6"
      />

      {/* Simple trunk - pale wood */}
      <path
        d="M 20 40 Q 22 42, 24 42 Q 26 42, 28 40 L 28 64 L 20 64 Z"
        fill="#d4a574"
        fillOpacity="0.8"
      />
    </svg>
  );
}

/**
 * 2. Mixed-Privacy Tree ("Autumn Blend")
 * Slightly triangular or oval crown with rich amber → orange → pink gradient
 */
export function AutumnBlendTree({ privacy, size = 'md', className = '' }: TreeIconProps) {
  const baseSize = getBaseSize(size);
  const colors = getPrivacyGradient(privacy);
  const viewBox = '0 0 48 64';

  return (
    <svg
      width={baseSize}
      height={baseSize * (64 / 48)}
      viewBox={viewBox}
      className={className}
      style={{
        filter: `drop-shadow(0 2px 4px ${colors.glow})`,
      }}
      aria-label="Autumn Blend Tree"
    >
      <defs>
        <linearGradient id={`autumn-blend-${privacy}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.9" />
          <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.85" />
          <stop offset="100%" stopColor={colors.tertiary} stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id={`autumn-glow-${privacy}`} cx="50%" cy="35%">
          <stop offset="0%" stopColor={colors.secondary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Warm, subtle glow */}
      <ellipse
        cx="24"
        cy="30"
        rx="22"
        ry="20"
        fill={`url(#autumn-glow-${privacy})`}
      />

      {/* Slightly triangular/oval crown */}
      <path
        d="M 24 8 Q 8 20, 8 32 Q 8 40, 24 40 Q 40 40, 40 32 Q 40 20, 24 8 Z"
        fill={`url(#autumn-blend-${privacy})`}
      />

      {/* Stylized leaf clusters */}
      <ellipse cx="18" cy="24" rx="6" ry="5" fill={colors.secondary} fillOpacity="0.6" />
      <ellipse cx="30" cy="26" rx="5" ry="4" fill={colors.tertiary} fillOpacity="0.6" />
      <ellipse cx="24" cy="20" rx="4" ry="3" fill={colors.primary} fillOpacity="0.7" />

      {/* Trunk */}
      <path
        d="M 20 42 Q 22 44, 24 44 Q 26 44, 28 42 L 28 64 L 20 64 Z"
        fill="#c19a6b"
        fillOpacity="0.8"
      />
    </svg>
  );
}

/**
 * 3. Private-Heavy Tree ("Moonlit Branches")
 * Tall, slender silhouette with indigo → violet → moon-blue gradient
 */
export function MoonlitBranchesTree({ privacy, size = 'md', className = '' }: TreeIconProps) {
  const baseSize = getBaseSize(size);
  const colors = getPrivacyGradient(privacy);
  const viewBox = '0 0 48 64';

  return (
    <svg
      width={baseSize}
      height={baseSize * (64 / 48)}
      viewBox={viewBox}
      className={className}
      style={{
        filter: `drop-shadow(0 2px 4px ${colors.glow})`,
      }}
      aria-label="Moonlit Branches Tree"
    >
      <defs>
        <linearGradient id={`moonlit-${privacy}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.9" />
          <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.85" />
          <stop offset="100%" stopColor={colors.tertiary} stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id={`moonlit-glow-${privacy}`} cx="50%" cy="25%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.25" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ethereal halo (subtle) */}
      <ellipse
        cx="24"
        cy="22"
        rx="16"
        ry="24"
        fill={`url(#moonlit-glow-${privacy})`}
      />

      {/* Tall, slender silhouette - willow-like */}
      <path
        d="M 24 4 Q 12 12, 10 20 Q 8 28, 12 36 Q 16 40, 24 38 Q 32 40, 36 36 Q 40 28, 38 20 Q 36 12, 24 4 Z"
        fill={`url(#moonlit-${privacy})`}
      />

      {/* Moonlight highlights on foliage */}
      <path
        d="M 24 8 Q 16 14, 14 20 Q 14 26, 20 30 Q 24 32, 24 30 Q 24 26, 24 20 Q 24 14, 24 8 Z"
        fill={colors.primary}
        fillOpacity="0.5"
      />
      <path
        d="M 24 8 Q 32 14, 34 20 Q 34 26, 28 30 Q 24 32, 24 30 Q 24 26, 24 20 Q 24 14, 24 8 Z"
        fill={colors.primary}
        fillOpacity="0.5"
      />

      {/* Slender trunk */}
      <path
        d="M 22 38 Q 22 42, 24 42 Q 26 42, 26 38 L 26 64 L 22 64 Z"
        fill="#6b7a8a"
        fillOpacity="0.8"
      />
    </svg>
  );
}

/**
 * 4. Neutral / Base Tree
 * Very simple form - uses privacy-based colors like other trees
 */
export function BaseTree({ privacy, size = 'md', className = '' }: TreeIconProps) {
  const baseSize = getBaseSize(size);
  const colors = getPrivacyGradient(privacy);
  const viewBox = '0 0 48 64';

  return (
    <svg
      width={baseSize}
      height={baseSize * (64 / 48)}
      viewBox={viewBox}
      className={className}
      style={{
        filter: `drop-shadow(0 2px 4px ${colors.glow})`,
      }}
      aria-label="Base Tree"
    >
      <defs>
        <linearGradient id={`base-tree-${privacy}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.85" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Balanced silhouette for clusters */}
      <ellipse
        cx="24"
        cy="28"
        rx="16"
        ry="14"
        fill={`url(#base-tree-${privacy})`}
      />
      <ellipse
        cx="24"
        cy="26"
        rx="12"
        ry="10"
        fill={colors.primary}
        fillOpacity="0.7"
      />

      {/* Simple trunk */}
      <path
        d="M 21 40 Q 22 42, 24 42 Q 26 42, 27 40 L 27 64 L 21 64 Z"
        fill="#8b6f47"
        fillOpacity="0.8"
      />
    </svg>
  );
}

/**
 * 5. Fungus / Mushroom Variant
 * Soft Ghibli mushroom cluster with bioluminescent dot patterns
 */
export function BioluminescentMushroom({ privacy, size = 'md', className = '' }: TreeIconProps) {
  const baseSize = getBaseSize(size);
  const colors = getPrivacyGradient(privacy);
  const viewBox = '0 0 48 64';

  return (
    <svg
      width={baseSize}
      height={baseSize * (64 / 48)}
      viewBox={viewBox}
      className={className}
      style={{
        filter: `drop-shadow(0 2px 4px ${colors.glow})`,
      }}
      aria-label="Bioluminescent Mushroom"
    >
      <defs>
        <linearGradient id={`mushroom-cap-${privacy}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.9" />
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id={`mushroom-glow-${privacy}`} cx="50%" cy="30%">
          <stop offset="0%" stopColor={colors.tertiary} stopOpacity="0.4" />
          <stop offset="100%" stopColor={colors.tertiary} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft glow around mushroom */}
      <ellipse
        cx="24"
        cy="28"
        rx="18"
        ry="14"
        fill={`url(#mushroom-glow-${privacy})`}
      />

      {/* Main mushroom cap - soft Ghibli style */}
      <ellipse
        cx="24"
        cy="26"
        rx="16"
        ry="12"
        fill={`url(#mushroom-cap-${privacy})`}
      />
      <ellipse
        cx="24"
        cy="24"
        rx="14"
        ry="10"
        fill={colors.primary}
        fillOpacity="0.8"
      />

      {/* Bioluminescent dot patterns */}
      <circle cx="20" cy="22" r="2" fill={colors.tertiary} fillOpacity="0.9" />
      <circle cx="24" cy="20" r="1.5" fill={colors.secondary} fillOpacity="0.9" />
      <circle cx="28" cy="24" r="2" fill={colors.tertiary} fillOpacity="0.9" />
      <circle cx="22" cy="26" r="1.5" fill={colors.secondary} fillOpacity="0.9" />
      <circle cx="26" cy="28" r="1.5" fill={colors.tertiary} fillOpacity="0.9" />

      {/* Stem */}
      <path
        d="M 22 32 Q 22 36, 24 36 Q 26 36, 26 32 L 26 50 L 22 50 Z"
        fill="#d4a574"
        fillOpacity="0.8"
      />

      {/* Small secondary mushroom */}
      <ellipse
        cx="18"
        cy="32"
        rx="6"
        ry="4"
        fill={colors.secondary}
        fillOpacity="0.7"
      />
      <circle cx="18" cy="30" r="1" fill={colors.tertiary} fillOpacity="0.9" />
      <path
        d="M 17 34 Q 17 36, 18 36 Q 19 36, 19 34 L 19 42 L 17 42 Z"
        fill="#c19a6b"
        fillOpacity="0.7"
      />
    </svg>
  );
}

/**
 * 6. Mini Shrub Variant
 * Round, chibi-style bushes for ground cover
 */
export function MiniShrub({ privacy, size = 'sm', className = '' }: TreeIconProps) {
  const baseSize = getBaseSize(size);
  const colors = getPrivacyGradient(privacy);
  const viewBox = '0 0 32 24';

  return (
    <svg
      width={baseSize}
      height={baseSize * (24 / 32)}
      viewBox={viewBox}
      className={className}
      style={{
        filter: `drop-shadow(0 1px 2px ${colors.glow})`,
      }}
      aria-label="Mini Shrub"
    >
      <defs>
        <radialGradient id={`shrub-${privacy}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.9" />
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.8" />
        </radialGradient>
      </defs>

      {/* Round, chibi-style bush */}
      <ellipse
        cx="16"
        cy="12"
        rx="14"
        ry="10"
        fill={`url(#shrub-${privacy})`}
      />
      <ellipse
        cx="16"
        cy="10"
        rx="10"
        ry="7"
        fill={colors.primary}
        fillOpacity="0.7"
      />
      <ellipse
        cx="16"
        cy="8"
        rx="6"
        ry="4"
        fill={colors.secondary}
        fillOpacity="0.6"
      />
    </svg>
  );
}

/**
 * 7. Silver Pine Tree (Majestic Center Tree)
 * A tall, majestic pine tree for the center of the forest
 * Silver/metallic colors with a regal, commanding presence
 */
export function SilverPineTree({ size = 'lg', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const baseSize = size === 'xl' ? 96 : getBaseSize(size);
  const viewBox = '0 0 48 80';
  
  // Silver/metallic color palette
  const silverColors = {
    light: '#e8e8e8', // Light silver
    medium: '#c0c0c0', // Medium silver
    dark: '#a0a0a0', // Dark silver
    shadow: '#808080', // Shadow
    glow: 'rgba(200, 200, 200, 0.4)', // Soft glow
  };

  return (
    <svg
      width={baseSize}
      height={baseSize * (80 / 48)}
      viewBox={viewBox}
      className={className}
      style={{
        filter: `drop-shadow(0 4px 8px ${silverColors.glow})`,
      }}
      aria-label="Silver Pine Tree"
    >
      <defs>
        <linearGradient id="silver-pine-trunk" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={silverColors.medium} stopOpacity="0.9" />
          <stop offset="100%" stopColor={silverColors.dark} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="silver-pine-needles" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={silverColors.light} stopOpacity="0.95" />
          <stop offset="50%" stopColor={silverColors.medium} stopOpacity="0.9" />
          <stop offset="100%" stopColor={silverColors.dark} stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Trunk */}
      <path
        d="M 20 50 Q 22 55, 24 60 Q 26 55, 28 50 L 28 80 L 20 80 Z"
        fill="url(#silver-pine-trunk)"
        stroke={silverColors.shadow}
        strokeWidth="0.5"
        strokeOpacity="0.5"
      />

      {/* Pine branches (layered from bottom to top) */}
      {/* Bottom branch */}
      <ellipse
        cx="24"
        cy="45"
        rx="12"
        ry="8"
        fill="url(#silver-pine-needles)"
        opacity="0.9"
      />
      <ellipse
        cx="24"
        cy="42"
        rx="10"
        ry="6"
        fill={silverColors.light}
        fillOpacity="0.8"
      />

      {/* Middle branch */}
      <ellipse
        cx="24"
        cy="32"
        rx="10"
        ry="7"
        fill="url(#silver-pine-needles)"
        opacity="0.9"
      />
      <ellipse
        cx="24"
        cy="30"
        rx="8"
        ry="5"
        fill={silverColors.light}
        fillOpacity="0.8"
      />

      {/* Upper branch */}
      <ellipse
        cx="24"
        cy="20"
        rx="8"
        ry="6"
        fill="url(#silver-pine-needles)"
        opacity="0.9"
      />
      <ellipse
        cx="24"
        cy="18"
        rx="6"
        ry="4"
        fill={silverColors.light}
        fillOpacity="0.8"
      />

      {/* Top crown */}
      <ellipse
        cx="24"
        cy="10"
        rx="6"
        ry="5"
        fill="url(#silver-pine-needles)"
        opacity="0.95"
      />
      <ellipse
        cx="24"
        cy="8"
        rx="4"
        ry="3"
        fill={silverColors.light}
        fillOpacity="0.9"
      />

      {/* Subtle highlights for depth */}
      <ellipse
        cx="22"
        cy="10"
        rx="2"
        ry="1.5"
        fill={silverColors.light}
        fillOpacity="0.6"
      />
      <ellipse
        cx="22"
        cy="20"
        rx="2.5"
        ry="2"
        fill={silverColors.light}
        fillOpacity="0.5"
      />
      <ellipse
        cx="22"
        cy="32"
        rx="3"
        ry="2.5"
        fill={silverColors.light}
        fillOpacity="0.4"
      />
    </svg>
  );
}

/**
 * Main export - returns appropriate tree based on privacy mode
 */
export function CustomTreeIcon({ privacy, size = 'md', className = '' }: TreeIconProps) {
  switch (privacy) {
    case 'public-heavy':
      return <SpringCanopyTree privacy={privacy} size={size} className={className} />;
    case 'mixed':
      return <AutumnBlendTree privacy={privacy} size={size} className={className} />;
    case 'private-heavy':
      return <MoonlitBranchesTree privacy={privacy} size={size} className={className} />;
    default:
      return <BaseTree privacy={privacy} size={size} className={className} />;
  }
}

