/**
 * ClickableTree Component
 *
 * A clickable tree icon with hover effects, tooltip, and navigation.
 * White-hat, accessible, and respects prefers-reduced-motion.
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { TreeIcon } from './TreeIcon';

type PrivacyMode = 'public-heavy' | 'mixed' | 'private-heavy';

type ClickableTreeProps = {
  skillId: string;
  skillName: string;
  participants: number;
  privacy: PrivacyMode;
  treeType: 'conifer' | 'round' | 'mushroom';
  size: 'sm' | 'md' | 'lg';
};

// Get privacy description (white-hat, empowering language)
function getPrivacyDescription(privacy: PrivacyMode): string {
  switch (privacy) {
    case 'public-heavy':
      return 'More public reveals';
    case 'mixed':
      return 'Mixed privacy';
    case 'private-heavy':
      return 'More private journeys';
  }
}

export function ClickableTree({
  skillId,
  skillName,
  participants,
  privacy,
  treeType,
  size,
}: ClickableTreeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const showTooltip = isHovered || isFocused;

  return (
    <div className="relative flex flex-col items-center group">
      <Link
        href={`/leaderboard/${skillId}`}
        className="relative inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label={`View ${skillName} leaderboard`}
      >
        {/* Tree with hover effects */}
        <div
          className={`
            transition-transform duration-200 ease-out
            motion-reduce:transition-none
            ${showTooltip ? 'scale-110 motion-reduce:scale-100' : 'scale-100'}
          `}
          style={{
            // Enhanced glow on hover (only if motion is allowed)
            filter: showTooltip
              ? 'drop-shadow(0 0 12px currentColor) drop-shadow(0 0 8px currentColor)'
              : undefined,
          }}
        >
          <TreeIcon type={treeType} privacy={privacy} size={size} />
        </div>
      </Link>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className={`
            absolute bottom-full mb-2 left-1/2 -translate-x-1/2
            px-3 py-2
            bg-gray-900 dark:bg-gray-800
            text-white text-xs
            rounded-lg
            shadow-lg
            z-50
            pointer-events-none
            whitespace-nowrap
            border border-gray-700 dark:border-gray-600
            motion-reduce:transition-none
          `}
          role="tooltip"
        >
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-gray-900 dark:bg-gray-800 border-r border-b border-gray-700 dark:border-gray-600 rotate-45" />
          </div>

          {/* Tooltip content */}
          <div className="relative z-10">
            <div className="font-semibold mb-1">{skillName}</div>
            <div className="text-gray-300 dark:text-gray-400 space-y-0.5">
              <div>{participants.toLocaleString()} participants</div>
              <div className="text-xs">{getPrivacyDescription(privacy)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

