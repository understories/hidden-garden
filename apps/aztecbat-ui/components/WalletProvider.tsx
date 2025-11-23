'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../lib/walletConfig';
import { isMockWalletEnabled, MOCK_WALLET_ADDRESS } from '../lib/mockWallet';

type WalletProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export { MOCK_WALLET_ADDRESS };

export function WalletProvider({ children }: WalletProviderProps) {
  const mockMode = isMockWalletEnabled();
  
  // Expose mock mode toggle to window for easy debugging
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__toggleMockWallet = () => {
        const enabled = isMockWalletEnabled();
        if (enabled) {
          localStorage.removeItem('mockWallet');
        } else {
          localStorage.setItem('mockWallet', 'true');
        }
        window.location.reload();
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        {mockMode ? (
          <MockWalletProvider>{children}</MockWalletProvider>
        ) : (
          children
        )}
      </WagmiProvider>
    </QueryClientProvider>
  );
}

// Mock wallet provider that simulates a connected wallet
function MockWalletProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Inject mock ethereum provider if it doesn't exist
    if (typeof window !== 'undefined' && !window.ethereum) {
      (window as any).ethereum = {
        isMetaMask: false,
        isMockWallet: true,
        request: async ({ method, params }: any) => {
          console.log('[Mock Wallet]', method, params);
          
          if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
            return [MOCK_WALLET_ADDRESS];
          }
          
          if (method === 'eth_chainId') {
            return '0xaa36a7'; // Sepolia chain ID
          }
          
          if (method === 'wallet_switchEthereumChain') {
            return null;
          }
          
          // Default mock response
          return null;
        },
        on: () => {},
        removeListener: () => {},
      };
    }
  }, []);

  return <>{children}</>;
}

