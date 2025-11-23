import type { ReactNode } from 'react';
import Link from 'next/link';
import { WalletProvider } from '../components/WalletProvider';
import { ConnectButton } from '../components/ConnectButton';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { SeedlingLogo } from '../components/SeedlingLogo';
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
  // Mock: in production this would come from auth/wallet state
  const isLoggedIn = true;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors"
        suppressHydrationWarning
      >
        <WalletProvider>
          <header className="w-full border-b border-gray-200 dark:border-gray-700 mb-4 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
                  <span>Hidden Garden</span>
                  <SeedlingLogo size="sm" />
                </Link>
                <nav className="flex items-center gap-4">
                  <Link
                    href="/skills"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    Skills
                  </Link>
                  <Link
                    href="/leaderboards"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    Leaderboards
                  </Link>
                  <Link
                    href="/skill-forest"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    Skill Forest
                  </Link>
                  {isLoggedIn && (
                    <Link
                      href="/garden"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      My Garden
                    </Link>
                  )}
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <ConnectButton />
                <DarkModeToggle />
              </div>
            </div>
          </header>
          <main className="max-w-4xl mx-auto p-4 relative min-h-[calc(100vh-8rem)]">
            {children}
          </main>
          {/* Logo at bottom right of each page */}
          <div className="fixed bottom-4 right-4 z-10 opacity-50 hover:opacity-100 transition-opacity">
            <Link href="/" className="block" aria-label="Hidden Garden home">
              <SeedlingLogo size="sm" />
            </Link>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}

