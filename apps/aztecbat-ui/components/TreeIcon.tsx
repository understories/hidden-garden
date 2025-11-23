/**
 * TreeIcon Component
 *
 * SVG-based tree icon with variants and privacy-based colors.
 * Clean, flat vector art with subtle glow effects.
 */

type PrivacyMode = 'public-heavy' | 'mixed' | 'private-heavy';

type TreeIconProps = {
  type?: 'conifer' | 'round' | 'mushroom';
  privacy: PrivacyMode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

// Get privacy-based colors for tree foliage
function getPrivacyColors(privacy: PrivacyMode): {
  foliage: string;
  glow: string;
  trunk: string;
} {
  switch (privacy) {
    case 'public-heavy':
      // Bright cyan/green glow
      return {
        foliage: 'fill-emerald-400 dark:fill-cyan-400',
        glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.6)] dark:drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]',
        trunk: 'fill-amber-800 dark:fill-amber-700',
      };
    case 'mixed':
      // Amber/orange
      return {
        foliage: 'fill-amber-500 dark:fill-orange-400',
        glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] dark:drop-shadow-[0_0_12px_rgba(251,146,60,0.7)]',
        trunk: 'fill-amber-800 dark:fill-amber-700',
      };
    case 'private-heavy':
      // Indigo/violet moonlit
      return {
        foliage: 'fill-indigo-400 dark:fill-violet-400',
        glow: 'drop-shadow-[0_0_8px_rgba(99,102,241,0.6)] dark:drop-shadow-[0_0_12px_rgba(139,92,246,0.7)]',
        trunk: 'fill-gray-700 dark:fill-gray-600',
      };
  }
}

// Get size classes
function getSizeClasses(size: 'sm' | 'md' | 'lg'): { width: string; height: string } {
  switch (size) {
    case 'sm':
      return { width: 'w-8', height: 'h-8' };
    case 'md':
      return { width: 'w-12', height: 'h-12' };
    case 'lg':
      return { width: 'w-16', height: 'h-16' };
  }
}

export function TreeIcon({ type = 'conifer', privacy, size = 'md', className = '' }: TreeIconProps) {
  const colors = getPrivacyColors(privacy);
  const sizeClasses = getSizeClasses(size);
  const baseSize = size === 'sm' ? 32 : size === 'md' ? 48 : 64;

  const renderTree = () => {
    switch (type) {
      case 'conifer':
        // Triangle/conifer tree
        return (
          <svg
            width={baseSize}
            height={baseSize}
            viewBox="0 0 48 64"
            className={`${sizeClasses.width} ${sizeClasses.height} ${colors.glow} ${className}`}
            aria-label={`${type} tree`}
          >
            {/* Trunk */}
            <rect x="22" y="48" width="4" height="16" className={colors.trunk} />
            {/* Foliage layers - bottom to top */}
            <polygon points="24,8 8,40 40,40" className={colors.foliage} />
            <polygon points="24,16 12,36 36,36" className={colors.foliage} opacity="0.9" />
            <polygon points="24,24 16,32 32,32" className={colors.foliage} opacity="0.8" />
          </svg>
        );

      case 'round':
        // Rounded canopy tree
        return (
          <svg
            width={baseSize}
            height={baseSize}
            viewBox="0 0 48 64"
            className={`${sizeClasses.width} ${sizeClasses.height} ${colors.glow} ${className}`}
            aria-label={`${type} tree`}
          >
            {/* Trunk */}
            <rect x="22" y="48" width="4" height="16" className={colors.trunk} />
            {/* Rounded canopy */}
            <circle cx="24" cy="36" r="16" className={colors.foliage} />
            <circle cx="24" cy="36" r="12" className={colors.foliage} opacity="0.7" />
            <circle cx="24" cy="36" r="8" className={colors.foliage} opacity="0.5" />
          </svg>
        );

      case 'mushroom':
        // Mushroom-shaped tree (palm-like)
        return (
          <svg
            width={baseSize}
            height={baseSize}
            viewBox="0 0 48 64"
            className={`${sizeClasses.width} ${sizeClasses.height} ${colors.glow} ${className}`}
            aria-label={`${type} tree`}
          >
            {/* Trunk */}
            <rect x="22" y="48" width="4" height="16" className={colors.trunk} />
            {/* Mushroom cap */}
            <ellipse cx="24" cy="32" rx="18" ry="12" className={colors.foliage} />
            <ellipse cx="24" cy="28" rx="14" ry="10" className={colors.foliage} opacity="0.8" />
            {/* Fronds/leaves */}
            <path
              d="M 24 20 L 12 28 L 24 32 Z"
              className={colors.foliage}
              opacity="0.9"
            />
            <path
              d="M 24 20 L 36 28 L 24 32 Z"
              className={colors.foliage}
              opacity="0.9"
            />
            <path
              d="M 24 20 L 8 24 L 24 32 Z"
              className={colors.foliage}
              opacity="0.7"
            />
            <path
              d="M 24 20 L 40 24 L 24 32 Z"
              className={colors.foliage}
              opacity="0.7"
            />
          </svg>
        );
    }
  };

  return renderTree();
}

