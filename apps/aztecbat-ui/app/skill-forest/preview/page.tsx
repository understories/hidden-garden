/**
 * Custom Tree Icons Preview Page
 * 
 * Preview all custom tree and plant graphics in the lunar-punk bioluminescent style.
 */

'use client';

import Link from 'next/link';
import {
  SpringCanopyTree,
  AutumnBlendTree,
  MoonlitBranchesTree,
  BaseTree,
  BioluminescentMushroom,
  MiniShrub,
  SilverPineTree,
  unusedColors,
} from '../../../components/CustomTreeIcons';

export default function TreePreviewPage() {
  return (
    <main className="max-w-6xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Custom Tree Icons Preview</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Lunar-punk bioluminescent forest graphics in soft Ghibli-inspired style.
        </p>
        <div className="mt-4">
          <Link
            href="/skill-forest/interactive/preview"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
          >
            View Layout Options →
          </Link>
        </div>
      </div>

      {/* Public-Heavy Trees */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          1. Spring Canopy Tree (Public-Heavy)
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Soft, round crown with light green → cyan bioluminescent gradient. Gentle aura/glow around edges.
        </p>
        <div className="flex items-end gap-6 p-6 bg-gray-900 rounded-lg">
          <div className="text-center">
            <SpringCanopyTree privacy="public-heavy" size="sm" />
            <p className="text-xs text-gray-400 mt-2">Small</p>
          </div>
          <div className="text-center">
            <SpringCanopyTree privacy="public-heavy" size="md" />
            <p className="text-xs text-gray-400 mt-2">Medium</p>
          </div>
          <div className="text-center">
            <SpringCanopyTree privacy="public-heavy" size="lg" />
            <p className="text-xs text-gray-400 mt-2">Large</p>
          </div>
        </div>
      </section>

      {/* Mixed-Privacy Trees */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          2. Autumn Blend Tree (Mixed)
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Slightly triangular or oval crown with rich amber → orange → pink bioluminescent gradient. Stylized leaf clusters.
        </p>
        <div className="flex items-end gap-6 p-6 bg-gray-900 rounded-lg">
          <div className="text-center">
            <AutumnBlendTree privacy="mixed" size="sm" />
            <p className="text-xs text-gray-400 mt-2">Small</p>
          </div>
          <div className="text-center">
            <AutumnBlendTree privacy="mixed" size="md" />
            <p className="text-xs text-gray-400 mt-2">Medium</p>
          </div>
          <div className="text-center">
            <AutumnBlendTree privacy="mixed" size="lg" />
            <p className="text-xs text-gray-400 mt-2">Large</p>
          </div>
        </div>
      </section>

      {/* Private-Heavy Trees */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          3. Moonlit Branches Tree (Private-Heavy)
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Tall, slender silhouette (willow-like) with indigo → violet → moon-blue gradient. Ethereal halo with moonlight highlights.
        </p>
        <div className="flex items-end gap-6 p-6 bg-gray-900 rounded-lg">
          <div className="text-center">
            <MoonlitBranchesTree privacy="private-heavy" size="sm" />
            <p className="text-xs text-gray-400 mt-2">Small</p>
          </div>
          <div className="text-center">
            <MoonlitBranchesTree privacy="private-heavy" size="md" />
            <p className="text-xs text-gray-400 mt-2">Medium</p>
          </div>
          <div className="text-center">
            <MoonlitBranchesTree privacy="private-heavy" size="lg" />
            <p className="text-xs text-gray-400 mt-2">Large</p>
          </div>
        </div>
      </section>

      {/* Base Tree */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          4. Base Tree (Neutral)
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Very simple form with base green/blue shape. Balanced silhouette for clusters. Recolorable programmatically.
        </p>
        <div className="flex items-end gap-6 p-6 bg-gray-900 rounded-lg">
          <div className="text-center">
            <BaseTree privacy="public-heavy" size="sm" />
            <p className="text-xs text-gray-400 mt-2">Small</p>
          </div>
          <div className="text-center">
            <BaseTree privacy="public-heavy" size="md" />
            <p className="text-xs text-gray-400 mt-2">Medium</p>
          </div>
          <div className="text-center">
            <BaseTree privacy="public-heavy" size="lg" />
            <p className="text-xs text-gray-400 mt-2">Large</p>
          </div>
        </div>
      </section>

      {/* Mushroom Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          5. Bioluminescent Mushroom
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Soft Ghibli mushroom cluster with bioluminescent dot patterns. Recolorable caps. For small or emerging skill groups.
        </p>
        <div className="flex items-end gap-6 p-6 bg-gray-900 rounded-lg">
          <div className="text-center">
            <BioluminescentMushroom privacy="public-heavy" size="sm" />
            <p className="text-xs text-gray-400 mt-2">Public (Green)</p>
          </div>
          <div className="text-center">
            <BioluminescentMushroom privacy="mixed" size="sm" />
            <p className="text-xs text-gray-400 mt-2">Mixed (Amber)</p>
          </div>
          <div className="text-center">
            <BioluminescentMushroom privacy="private-heavy" size="sm" />
            <p className="text-xs text-gray-400 mt-2">Private (Blue)</p>
          </div>
        </div>
      </section>

      {/* Mini Shrub Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          6. Mini Shrub
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Round, chibi-style bushes for ground cover. Simple gradient, minimal detail.
        </p>
        <div className="flex items-end gap-6 p-6 bg-gray-900 rounded-lg">
          <div className="text-center">
            <MiniShrub privacy="public-heavy" size="sm" />
            <p className="text-xs text-gray-400 mt-2">Public</p>
          </div>
          <div className="text-center">
            <MiniShrub privacy="mixed" size="sm" />
            <p className="text-xs text-gray-400 mt-2">Mixed</p>
          </div>
          <div className="text-center">
            <MiniShrub privacy="private-heavy" size="sm" />
            <p className="text-xs text-gray-400 mt-2">Private</p>
          </div>
        </div>
      </section>

      {/* Silver Pine Tree - Center Tree */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          7. Silver Pine Tree (Center Tree)
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Majestic pine tree for the center of the forest. Silver/metallic colors with a regal, commanding presence.
        </p>
        <div className="flex items-end gap-6 p-6 bg-gray-900 rounded-lg justify-center">
          <div className="text-center">
            {/* Custom size: 2x of (largest size * 0.75) = 2 * (64 * 0.75) = 96px */}
            <div style={{ width: '96px', height: '128px', margin: '0 auto' }}>
              <SilverPineTree size="xl" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Center Tree (96px)</p>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 italic">
          Size: 2x of (largest regular tree × 0.75) = 2 × (64px × 0.75) = 96px
        </div>
      </section>

      {/* All Trees Together - Forest Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Forest Preview - All Trees Together
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          How the trees look when arranged together in a forest.
        </p>
        <div className="p-8 bg-gray-900 rounded-lg">
          <div className="flex flex-wrap items-end gap-4 justify-center">
            {/* Center tree */}
            <div className="flex-shrink-0">
              <div style={{ width: '96px', height: '128px' }}>
                <SilverPineTree size="xl" />
              </div>
            </div>
            {/* Regular trees around it */}
            <SpringCanopyTree privacy="public-heavy" size="md" />
            <AutumnBlendTree privacy="mixed" size="md" />
            <MoonlitBranchesTree privacy="private-heavy" size="md" />
            <BaseTree privacy="public-heavy" size="md" />
            <BioluminescentMushroom privacy="mixed" size="sm" />
            <MiniShrub privacy="public-heavy" size="sm" />
            <SpringCanopyTree privacy="public-heavy" size="sm" />
            <AutumnBlendTree privacy="mixed" size="sm" />
            <MoonlitBranchesTree privacy="private-heavy" size="sm" />
            <BioluminescentMushroom privacy="private-heavy" size="sm" />
            <MiniShrub privacy="mixed" size="sm" />
            <BaseTree privacy="public-heavy" size="sm" />
          </div>
        </div>
      </section>

      {/* Color Palette Reference */}
      <section className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Color Palette Reference
        </h2>
        
        {/* Active Colors */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Active Colors (In Use)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#7dd87d' }} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Public-Heavy</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Spring Green</div>
                </div>
              </div>
              <div className="text-xs font-mono text-gray-600 dark:text-gray-400">#7dd87d</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#f4a460' }} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Mixed</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Amber</div>
                </div>
              </div>
              <div className="text-xs font-mono text-gray-600 dark:text-gray-400">#f4a460</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#9370db' }} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Private-Heavy</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Violet</div>
                </div>
              </div>
              <div className="text-xs font-mono text-gray-600 dark:text-gray-400">#9370db</div>
            </div>
          </div>
        </div>

        {/* Unused Colors */}
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Unused Colors (For Reference)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 border-dashed">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Public-Heavy (Unused)</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: unusedColors['public-heavy'].cyan }} />
                  <div className="text-xs">
                    <span className="font-mono">#5dd5d5</span> - Cyan
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: unusedColors['public-heavy'].deeperCyan }} />
                  <div className="text-xs">
                    <span className="font-mono">#4dd0d0</span> - Deeper Cyan
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: unusedColors['public-heavy'].skyBlue }} />
                  <div className="text-xs">
                    <span className="font-mono">#87ceeb</span> - Sky Blue
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 border-dashed">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mixed (Unused)</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: unusedColors['mixed'].coralOrange }} />
                  <div className="text-xs">
                    <span className="font-mono">#ff8c69</span> - Coral Orange
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: unusedColors['mixed'].pink }} />
                  <div className="text-xs">
                    <span className="font-mono">#ff7f9f</span> - Pink
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 border-dashed">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Private-Heavy (Unused)</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: unusedColors['private-heavy'].indigo }} />
                  <div className="text-xs">
                    <span className="font-mono">#6a5acd</span> - Indigo
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: unusedColors['private-heavy'].moonBlue }} />
                  <div className="text-xs">
                    <span className="font-mono">#87ceeb</span> - Moon Blue
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Visualization Questions & Suggestions */}
      <section className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Interactive Visualization - Questions & Suggestions
        </h2>
        
        {/* Interaction Suggestions */}
        <div className="space-y-3 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Interaction Suggestions
          </h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              <strong>Selected Approach:</strong> Constellation layout with cluster-based interactions
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <strong>Hover over cluster zone:</strong> Show information panel with:
                <ul className="list-circle list-inside ml-4 mt-1 space-y-1">
                  <li>Privacy mode name (e.g., "Public-Heavy Cluster")</li>
                  <li>Number of skills in cluster</li>
                  <li>Total participants across cluster</li>
                  <li>Breakdown of skill types</li>
                </ul>
              </li>
              <li>
                <strong>Hover over individual tree:</strong> Show tooltip with:
                <ul className="list-circle list-inside ml-4 mt-1 space-y-1">
                  <li>Skill name</li>
                  <li>Participant count</li>
                  <li>Privacy mode</li>
                  <li>Quick stats</li>
                </ul>
              </li>
              <li>
                <strong>Click on tree:</strong> Navigate to <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">/leaderboard/[skillId]</code>
              </li>
              <li>
                <strong>Click on center silver tree:</strong> Navigate to <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">/skills</code>
              </li>
              <li>
                <strong>Zoom & Pan:</strong> Mouse wheel to zoom, drag to pan (optional, for larger forests)
              </li>
              <li>
                <strong>Filter toggle:</strong> Show/hide clusters by privacy mode (optional)
              </li>
            </ul>
          </div>
        </div>

        {/* Clustering Suggestions */}
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Clustering Mode Suggestions
          </h3>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              <strong>Selected for MVP:</strong> Privacy mode clustering
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Should clustering be toggleable or always on?
                </p>
                <div className="bg-white dark:bg-gray-800 rounded p-3 border border-amber-200 dark:border-amber-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Suggestion:</strong> Start with clustering <strong>always on</strong> (simpler UX), but make cluster zones visually distinct with soft background colors. 
                    Later, we can add a toggle if users want to see an unclustered view. This keeps the initial implementation clean and focused.
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Visual Cluster Zones:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-2">
                  <li>Soft, semi-transparent background zones for each privacy cluster</li>
                  <li>Subtle borders matching privacy colors (spring green, amber, violet)</li>
                  <li>Gentle blur/glow effect to distinguish zones without being harsh</li>
                  <li>Zones should be organic/rounded, not rigid rectangles</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Other Clustering Modes (For Reference) */}
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Other Clustering Modes (For Future Reference)
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
              These clustering modes are documented for future implementation but not used in the MVP:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><strong>By skill category/domain:</strong> Group related skills (e.g., "Aztec Protocol", "Rust Foundations")</li>
              <li><strong>By participant count:</strong> Size-based clustering (large vs small communities)</li>
              <li><strong>By quest count:</strong> Skills with many quests vs few quests</li>
              <li><strong>By relationships/overlaps:</strong> Skills that share participants or have connections</li>
              <li><strong>By activity level:</strong> Recently active skills vs dormant ones</li>
            </ul>
          </div>
        </div>

        {/* Data & Relationships Questions */}
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Data & Relationships Questions (For Future)
          </h3>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Questions to answer when implementing relationships:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Do skills have explicit relationships/overlaps (like the old <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">overlaps</code> array)?</li>
              <li>Should relationships be shown as connection lines between trees in the constellation?</li>
              <li>What additional metadata exists? (categories, tags, skill levels, etc.)</li>
              <li>How should we determine "related" skills? (shared participants, similar topics, etc.)</li>
              <li>Should connection lines be interactive? (click to see relationship details)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Design Notes */}
      <section className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Design Notes
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Active Color Palette:</strong> Simplified to one color per privacy preference for clarity:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Public-Heavy:</strong> Spring green (#7dd87d)</li>
            <li><strong>Mixed:</strong> Amber (#f4a460)</li>
            <li><strong>Private-Heavy:</strong> Violet (#9370db)</li>
          </ul>
          <p className="mt-4">
            <strong>Technical Features:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Pure SVG vectors - no external images</li>
            <li>Scalable to any size (sm: 32px, md: 48px, lg: 64px)</li>
            <li>Subtle drop-shadow glows using privacy-based colors</li>
            <li>Linear and radial gradients for depth</li>
            <li>Clean silhouettes optimized for dark backgrounds</li>
            <li>Harmonized proportions across all variants</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

