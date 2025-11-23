import type { ReactNode } from 'react';
import Link from 'next/link';
import { WalletProvider } from '../components/WalletProvider';
import { DarkModeToggle } from '../components/DarkModeToggle';
import './globals.css';

export const metadata = {
  title: 'Hidden Garden',
  description: 'Skill tree + leaderboard',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <WalletProvider>
          <header className="w-full border-b border-gray-200 dark:border-gray-700 mb-4 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
              <div className="flex items-center gap-6">
                <Link href="/" className="font-semibold text-lg hover:opacity-80 transition-opacity">
                  Hidden Garden 🌱
                </Link>
                <nav className="flex items-center gap-4">
                  <Link
                    href="/skills"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    Skills
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                {/* Placeholder for user identity - no wallet connection yet */}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Connected wallet
                </span>
                <DarkModeToggle />
              </div>
            </div>
          </header>
          <main className="max-w-4xl mx-auto p-4">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}

