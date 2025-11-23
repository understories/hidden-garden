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

// Get Ghibli-style privacy-based colors for tree foliage
function getPrivacyColors(privacy: PrivacyMode): {
  foliage: string;
  shadow: string;
  trunk: string;
} {
  switch (privacy) {
    case 'public-heavy':
      // Soft spring green (matching falling leaves)
      return {
        foliage: '#7dd87d',
        shadow: 'drop-shadow(0 2px 4px rgba(125, 216, 125, 0.3))',
        trunk: '#8b6f47',
      };
    case 'mixed':
      // Soft sandy amber
      return {
        foliage: '#f4a460',
        shadow: 'drop-shadow(0 2px 4px rgba(244, 164, 96, 0.3))',
        trunk: '#8b6f47',
      };
    case 'private-heavy':
      // Soft sky blue
      return {
        foliage: '#87ceeb',
        shadow: 'drop-shadow(0 2px 4px rgba(135, 206, 235, 0.3))',
        trunk: '#6b7a8a',
      };
    default:
      // Fallback to mixed if privacy mode is unexpected
      return {
        foliage: '#f4a460',
        shadow: 'drop-shadow(0 2px 4px rgba(244, 164, 96, 0.3))',
        trunk: '#8b6f47',
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
  // Safety check: ensure privacy is valid
  const validPrivacy: PrivacyMode = privacy && ['public-heavy', 'mixed', 'private-heavy'].includes(privacy) 
    ? privacy 
    : 'mixed';
  const colors = getPrivacyColors(validPrivacy);
  const sizeClasses = getSizeClasses(size);
  const baseSize = size === 'sm' ? 32 : size === 'md' ? 48 : 64;

  const renderTree = () => {
    switch (type) {
      case 'conifer':
        // Organic conifer tree - Ghibli style
        return (
          <svg
            width={baseSize}
            height={baseSize}
            viewBox="0 0 48 64"
            className={`${sizeClasses.width} ${sizeClasses.height} ${className}`}
            style={{ filter: colors.shadow }}
            aria-label={`${type} tree`}
          >
            {/* Trunk */}
            <path
              d="M 22 48 L 24 48 L 26 48 L 26 64 L 22 64 Z"
              fill={colors.trunk}
              fillOpacity="0.8"
            />
            {/* Organic foliage layers */}
            <path
              d="M 24 8 Q 10 20, 10 35 Q 10 40, 24 40 Q 38 40, 38 35 Q 38 20, 24 8 Z"
              fill={colors.foliage}
              fillOpacity="0.85"
            />
            <path
              d="M 24 16 Q 14 24, 14 32 Q 14 36, 24 36 Q 34 36, 34 32 Q 34 24, 24 16 Z"
              fill={colors.foliage}
              fillOpacity="0.75"
            />
            <path
              d="M 24 22 Q 18 26, 18 30 Q 18 32, 24 32 Q 30 32, 30 30 Q 30 26, 24 22 Z"
              fill={colors.foliage}
              fillOpacity="0.65"
            />
          </svg>
        );

      case 'round':
        // Organic rounded canopy tree - Ghibli style
        return (
          <svg
            width={baseSize}
            height={baseSize}
            viewBox="0 0 48 64"
            className={`${sizeClasses.width} ${sizeClasses.height} ${className}`}
            style={{ filter: colors.shadow }}
            aria-label={`${type} tree`}
          >
            {/* Trunk */}
            <path
              d="M 22 48 Q 22 56, 24 56 Q 26 56, 26 48 L 26 64 L 22 64 Z"
              fill={colors.trunk}
              fillOpacity="0.8"
            />
            {/* Organic rounded canopy */}
            <ellipse cx="24" cy="36" rx="18" ry="16" fill={colors.foliage} fillOpacity="0.85" />
            <ellipse cx="24" cy="34" rx="14" ry="12" fill={colors.foliage} fillOpacity="0.7" />
            <ellipse cx="24" cy="32" rx="10" ry="8" fill={colors.foliage} fillOpacity="0.6" />
          </svg>
        );

      case 'mushroom':
        // Organic mushroom/palm tree - Ghibli style
        return (
          <svg
            width={baseSize}
            height={baseSize}
            viewBox="0 0 48 64"
            className={`${sizeClasses.width} ${sizeClasses.height} ${className}`}
            style={{ filter: colors.shadow }}
            aria-label={`${type} tree`}
          >
            {/* Trunk */}
            <path
              d="M 22 48 Q 22 56, 24 56 Q 26 56, 26 48 L 26 64 L 22 64 Z"
              fill={colors.trunk}
              fillOpacity="0.8"
            />
            {/* Organic mushroom cap */}
            <ellipse cx="24" cy="30" rx="20" ry="14" fill={colors.foliage} fillOpacity="0.85" />
            <ellipse cx="24" cy="28" rx="16" ry="11" fill={colors.foliage} fillOpacity="0.75" />
            {/* Organic fronds */}
            <path
              d="M 24 20 Q 12 24, 10 28 Q 10 30, 24 32"
              fill={colors.foliage}
              fillOpacity="0.8"
            />
            <path
              d="M 24 20 Q 36 24, 38 28 Q 38 30, 24 32"
              fill={colors.foliage}
              fillOpacity="0.8"
            />
            <path
              d="M 24 20 Q 8 22, 6 26 Q 6 28, 24 32"
              fill={colors.foliage}
              fillOpacity="0.7"
            />
            <path
              d="M 24 20 Q 40 22, 42 26 Q 42 28, 24 32"
              fill={colors.foliage}
              fillOpacity="0.7"
            />
          </svg>
        );
    }
  };

  return renderTree();
}

