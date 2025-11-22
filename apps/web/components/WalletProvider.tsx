'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../lib/walletConfig';

type WalletProviderProps = {
  children: React.ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
}

