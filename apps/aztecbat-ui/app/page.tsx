import { FallingLeaves } from '@/components/FallingLeaves';
import { SeedlingLogo } from '@/components/SeedlingLogo';

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4 text-center">
      <FallingLeaves />
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
            Hidden Garden
          </h1>
          <SeedlingLogo size="lg" />
        </div>
        <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
          A privacy-preserving skill tree and leaderboard.
        </p>
      </div>
    </main>
  );
}

