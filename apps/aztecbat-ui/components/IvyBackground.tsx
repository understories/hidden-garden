/**
 * IvyBackground Component
 * 
 * Animated ivy vines for the landing page background.
 * Creates organic, data-viz-inspired patterns that subtly move.
 */

'use client';

import React from 'react';

export function IvyBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-20 dark:opacity-10">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* First ivy vine - main stem */}
        <g className="ivy-vine-1">
          <path
            d="M 0 400 Q 200 350 400 380 T 800 400 T 1200 420"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-600 dark:text-green-500"
          >
            <animate
              attributeName="d"
              values="M 0 400 Q 200 350 400 380 T 800 400 T 1200 420;M -50 400 Q 150 350 350 380 T 750 400 T 1150 420;M 0 400 Q 200 350 400 380 T 800 400 T 1200 420"
              dur="20s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
}

