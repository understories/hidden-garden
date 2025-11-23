/**
 * Test Page
 *
 * Test route for previewing the falling leaves animation
 * before applying it to the landing page.
 */

import { FallingLeaves } from '../../components/FallingLeaves';

export default function TestPage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen py-8 px-4 text-center bg-gray-900 dark:bg-black">
      <FallingLeaves />
      <div className="relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
          Test Page
        </h1>
        <p className="text-xl md:text-2xl font-medium text-gray-300 max-w-2xl leading-relaxed">
          Preview of 8-bit neon falling leaves animation
        </p>
      </div>
    </main>
  );
}

