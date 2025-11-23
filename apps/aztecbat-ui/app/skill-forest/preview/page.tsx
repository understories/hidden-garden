/**
 * Custom Tree Icons Preview Page
 * 
 * Preview all custom tree and plant graphics in the lunar-punk bioluminescent style.
 */

'use client';

import {
  SpringCanopyTree,
  AutumnBlendTree,
  MoonlitBranchesTree,
  BaseTree,
  BioluminescentMushroom,
  MiniShrub,
} from '../../../components/CustomTreeIcons';

export default function TreePreviewPage() {
  return (
    <main className="max-w-6xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Custom Tree Icons Preview</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Lunar-punk bioluminescent forest graphics in soft Ghibli-inspired style.
        </p>
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

      {/* Design Notes */}
      <section className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Design Notes
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Color Palette:</strong> Soft Ghibli-inspired colors with bioluminescent gradients:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Public-Heavy:</strong> Spring green (#7dd87d) → Cyan (#5dd5d5) → Deeper cyan (#4dd0d0)</li>
            <li><strong>Mixed:</strong> Sandy amber (#f4a460) → Coral orange (#ff8c69) → Soft pink (#ff7f9f)</li>
            <li><strong>Private-Heavy:</strong> Sky blue (#87ceeb) → Violet (#9370db) → Indigo (#6a5acd)</li>
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

