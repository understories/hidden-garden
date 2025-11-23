/**
 * ForestTile Component
 *
 * A Ghibli-style organic island tile for the skill canopy.
 * Soft, natural shapes with gentle gradients and organic feel.
 */

import { ReactNode } from 'react';

type ForestTileProps = {
  children: ReactNode;
  className?: string;
};

export function ForestTile({ children, className = '' }: ForestTileProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Organic grass surface - soft Ghibli style */}
      <div className="relative bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50 dark:from-gray-800/60 dark:via-gray-700/50 dark:to-gray-800/60 rounded-2xl border border-green-200/50 dark:border-gray-600/30 shadow-lg backdrop-blur-sm">
        {/* Soft texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-green-100/20 dark:from-white/5 dark:via-transparent dark:to-gray-700/20 rounded-2xl pointer-events-none" />
        
        {/* Gentle highlight */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white/30 via-white/10 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent rounded-t-2xl pointer-events-none" />
        
        {/* Content area */}
        <div className="relative p-5 min-h-[140px]">
          {children}
        </div>
      </div>
    </div>
  );
}

