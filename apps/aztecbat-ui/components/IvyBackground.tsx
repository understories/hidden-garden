/**
 * IvyBackground Component
 * 
 * Animated ivy vines for the landing page background.
 * Creates organic, data-viz-inspired patterns that subtly move.
 * Vines represent skill connections; nodes represent data points.
 */

'use client';

import React from 'react';

export function IvyBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.15] dark:opacity-[0.08]">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main ivy vine - organic, hand-drawn feel */}
        <g className="ivy-vine-main">
          <path
            d="M -100 450 
               C 50 420, 150 400, 300 410
               S 500 430, 600 415
               C 700 400, 800 420, 950 410
               S 1100 400, 1300 420"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-emerald-600 dark:text-emerald-400"
            style={{
              filter: 'blur(0.5px)',
            }}
          >
            {/* Subtle breathing animation - very slow and organic */}
            <animate
              attributeName="d"
              values="M -100 450 C 50 420, 150 400, 300 410 S 500 430, 600 415 C 700 400, 800 420, 950 410 S 1100 400, 1300 420;
                     M -100 455 C 50 425, 150 405, 300 415 S 500 435, 600 420 C 700 405, 800 425, 950 415 S 1100 405, 1300 425;
                     M -100 450 C 50 420, 150 400, 300 410 S 500 430, 600 415 C 700 400, 800 420, 950 410 S 1100 400, 1300 420"
              dur="25s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Second vine layer - different path, slightly behind */}
        <g className="ivy-vine-secondary">
          <path
            d="M -80 550
               C 100 520, 250 540, 400 530
               S 550 510, 700 525
               C 850 540, 1000 520, 1150 535
               S 1280 550, 1380 560"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="text-teal-600 dark:text-teal-400"
            style={{
              filter: 'blur(0.8px)',
              opacity: 0.7,
            }}
          >
            {/* Different timing for depth - slightly out of sync */}
            <animate
              attributeName="d"
              values="M -80 550 C 100 520, 250 540, 400 530 S 550 510, 700 525 C 850 540, 1000 520, 1150 535 S 1280 550, 1380 560;
                     M -80 545 C 100 515, 250 535, 400 525 S 550 505, 700 520 C 850 535, 1000 515, 1150 530 S 1280 545, 1380 555;
                     M -80 550 C 100 520, 250 540, 400 530 S 550 510, 700 525 C 850 540, 1000 520, 1150 535 S 1280 550, 1380 560"
              dur="30s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
}

