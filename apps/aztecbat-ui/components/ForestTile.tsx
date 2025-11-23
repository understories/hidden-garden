/**
 * ForestTile Component
 *
 * An isometric-inspired island tile for the skill canopy.
 * Renders a rectangular "island" with a darker soil border and lighter grass surface.
 */

import { ReactNode } from 'react';

type ForestTileProps = {
  children: ReactNode;
  className?: string;
};

export function ForestTile({ children, className = '' }: ForestTileProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Island base - darker soil border/rim (bottom edge) */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg shadow-lg translate-y-1" />
      
      {/* Grass surface - lighter top with pseudo-isometric depth */}
      <div className="relative bg-gradient-to-b from-green-100 via-emerald-50 to-green-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg border-2 border-green-200 dark:border-gray-500 shadow-md">
        {/* Subtle texture overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent dark:via-white/5 rounded-lg pointer-events-none" />
        
        {/* Top highlight for 3D effect */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white/20 to-transparent dark:from-white/10 rounded-t-lg pointer-events-none" />
        
        {/* Content area */}
        <div className="relative p-4 min-h-[120px]">
          {children}
        </div>
      </div>
    </div>
  );
}

