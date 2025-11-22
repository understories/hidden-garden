import type { ReactNode } from 'react';
import { WalletProvider } from '../components/WalletProvider';
import { ConnectButton } from '../components/ConnectButton';

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
    <html lang="en">
      <body>
        <WalletProvider>
          <header className="w-full border-b mb-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
              <div className="font-semibold">Hidden Garden 🌱</div>
              <ConnectButton />
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

