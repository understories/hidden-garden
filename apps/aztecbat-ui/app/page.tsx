import { FallingLeaves } from '@/components/FallingLeaves';

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4 text-center">
      <FallingLeaves />
      <div className="relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Hidden Garden 🌱
        </h1>
        <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
          A privacy-preserving skill tree and leaderboard.
        </p>
      </div>
    </main>
  );
}

