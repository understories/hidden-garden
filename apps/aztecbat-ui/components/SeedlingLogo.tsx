/**
 * SeedlingLogo Component
 *
 * A Ghibli-style seedling logo matching the falling leaves aesthetic.
 * Organic, soft shapes with gentle colors and shadows.
 */

type SeedlingLogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

export function SeedlingLogo({ size = 'md', className = '' }: SeedlingLogoProps) {
  // Size mapping
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  };
  const logoSize = sizeMap[size];
  const viewBox = '0 0 32 40';
  
  // Ghibli-style soft spring green (matching falling leaves)
  const primaryColor = '#7dd87d';
  const stemColor = '#8b6f47';
  const soilColor = '#a0826d';
  
  return (
    <svg
      width={logoSize}
      height={logoSize * 1.25}
      viewBox={viewBox}
      className={className}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(125, 216, 125, 0.3))',
      }}
      aria-label="Hidden Garden seedling logo"
    >
      {/* Soil/pot base */}
      <ellipse
        cx="16"
        cy="36"
        rx="10"
        ry="4"
        fill={soilColor}
        fillOpacity="0.7"
      />
      <ellipse
        cx="16"
        cy="35"
        rx="8"
        ry="3"
        fill={soilColor}
        fillOpacity="0.5"
      />
      
      {/* Stem */}
      <path
        d="M 16 36 Q 16 30, 16 24 Q 16 20, 16 16"
        stroke={stemColor}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.8"
      />
      
      {/* Left leaf - organic, flowing shape */}
      <path
        d="M 16 16 
           Q 10 14, 8 10
           Q 6 8, 8 6
           Q 10 4, 12 6
           Q 14 8, 14 10
           Q 14 12, 16 14
           Z"
        fill={primaryColor}
        fillOpacity="0.85"
        stroke={primaryColor}
        strokeWidth="0.5"
        strokeOpacity="0.6"
      />
      
      {/* Right leaf - organic, flowing shape */}
      <path
        d="M 16 16 
           Q 22 14, 24 10
           Q 26 8, 24 6
           Q 22 4, 20 6
           Q 18 8, 18 10
           Q 18 12, 16 14
           Z"
        fill={primaryColor}
        fillOpacity="0.85"
        stroke={primaryColor}
        strokeWidth="0.5"
        strokeOpacity="0.6"
      />
      
      {/* Center leaf - smaller, at the top */}
      <path
        d="M 16 16 
           Q 14 12, 16 8
           Q 18 12, 16 16
           Z"
        fill={primaryColor}
        fillOpacity="0.9"
        stroke={primaryColor}
        strokeWidth="0.5"
        strokeOpacity="0.6"
      />
      
      {/* Leaf veins - subtle details */}
      <path
        d="M 16 16 Q 12 12, 10 8"
        stroke={primaryColor}
        strokeWidth="0.5"
        strokeOpacity="0.4"
        fill="none"
      />
      <path
        d="M 16 16 Q 20 12, 22 8"
        stroke={primaryColor}
        strokeWidth="0.5"
        strokeOpacity="0.4"
        fill="none"
      />
      <path
        d="M 16 16 L 16 10"
        stroke={primaryColor}
        strokeWidth="0.5"
        strokeOpacity="0.4"
        fill="none"
      />
    </svg>
  );
}

