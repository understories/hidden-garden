import type { ReactNode } from 'react';
import { WalletProvider } from '../components/WalletProvider';

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
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}

