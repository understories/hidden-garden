/**
 * Typography Test Page
 *
 * Test different typography options for "Hidden Garden" in Ghibli style
 */

import { SeedlingLogo } from '../../components/SeedlingLogo';
import Link from 'next/link';

export default function TypographyTestPage() {
  const typographyOptions = [
    {
      id: 'nunito',
      name: 'Nunito',
      className: 'font-nunito',
      description: 'Rounded, friendly, and approachable',
      import: "@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');",
      fontFamily: "'Nunito', sans-serif",
    },
    {
      id: 'comfortaa',
      name: 'Comfortaa',
      className: 'font-comfortaa',
      description: 'Soft, rounded, and modern',
      import: "@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap');",
      fontFamily: "'Comfortaa', sans-serif",
    },
    {
      id: 'quicksand',
      name: 'Quicksand',
      className: 'font-quicksand',
      description: 'Light, airy, and whimsical',
      import: "@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');",
      fontFamily: "'Quicksand', sans-serif",
    },
    {
      id: 'poppins',
      name: 'Poppins',
      className: 'font-poppins',
      description: 'Geometric but friendly',
      import: "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');",
      fontFamily: "'Poppins', sans-serif",
    },
    {
      id: 'inter',
      name: 'Inter',
      className: 'font-inter',
      description: 'Clean and modern (current)',
      import: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');",
      fontFamily: "'Inter', sans-serif",
    },
    {
      id: 'cabin',
      name: 'Cabin',
      className: 'font-cabin',
      description: 'Warm and rounded',
      import: "@import url('https://fonts.googleapis.com/css2?family=Cabin:wght@400;600;700&display=swap');",
      fontFamily: "'Cabin', sans-serif",
    },
    {
      id: 'raleway',
      name: 'Raleway',
      className: 'font-raleway',
      description: 'Elegant and flowing',
      import: "@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap');",
      fontFamily: "'Raleway', sans-serif",
    },
    {
      id: 'work-sans',
      name: 'Work Sans',
      className: 'font-work-sans',
      description: 'Friendly and readable',
      import: "@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;700&display=swap');",
      fontFamily: "'Work Sans', sans-serif",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto space-y-8 py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Typography Options for "Hidden Garden"</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ghibli-style typography test - choose your favorite
        </p>
      </div>

      {/* Inject Google Fonts */}
      <style dangerouslySetInnerHTML={{
        __html: typographyOptions.map(opt => opt.import).join('\n')
      }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {typographyOptions.map((option) => (
          <div
            key={option.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800/50 space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {option.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </div>

            {/* Header style preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span
                  style={{ fontFamily: option.fontFamily }}
                  className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
                >
                  Hidden Garden
                </span>
                <SeedlingLogo size="sm" />
              </div>

              {/* Large title style (landing page) */}
              <div className="flex items-center gap-4">
                <span
                  style={{ fontFamily: option.fontFamily }}
                  className="text-4xl font-bold text-gray-900 dark:text-gray-100"
                >
                  Hidden Garden
                </span>
                <SeedlingLogo size="md" />
              </div>

              {/* Body text preview */}
              <p
                style={{ fontFamily: option.fontFamily }}
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                A privacy-preserving skill tree and leaderboard.
              </p>
            </div>

            {/* Font details */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <code className="text-xs text-gray-500 dark:text-gray-400">
                font-family: {option.fontFamily}
              </code>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="text-center pt-8">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}

