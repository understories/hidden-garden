'use client';

import * as React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import type { EnsPublicClient } from '@hidden-garden/core-logic';
import { shortenAddress, getEnsName } from '@hidden-garden/core-logic';
import { mainnetPublicClient } from '../lib/viemClients';
import { MOCK_WALLET_ADDRESS, isMockWalletEnabled, enableMockWallet } from '../lib/mockWallet';

export const ConnectButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [ensName, setEnsName] = React.useState<string | null>(null);
  const [ensLoading, setEnsLoading] = React.useState(false);
  const [isMockMode, setIsMockMode] = React.useState(false);

  // Check if mock wallet is enabled
  React.useEffect(() => {
    setIsMockMode(isMockWalletEnabled());
  }, []);

  // Auto-connect mock wallet if enabled and not connected
  React.useEffect(() => {
    if (isMockMode && !isConnected && typeof window !== 'undefined') {
      const injectedConnector = connectors.find((c) => c.id === 'injected' || c.type === 'injected');
      if (injectedConnector) {
        // Small delay to ensure wagmi is ready
        setTimeout(() => {
          connect({ connector: injectedConnector });
        }, 100);
      }
    }
  }, [isMockMode, isConnected, connectors, connect]);

  React.useEffect(() => {
    let cancelled = false;

    async function resolveEns() {
      if (!address || !isConnected) {
        setEnsName(null);
        return;
      }

      // Skip ENS resolution for mock wallet
      if (isMockMode && address === MOCK_WALLET_ADDRESS) {
        setEnsName(null);
        return;
      }

      setEnsLoading(true);
      try {
        // Create an adapter that matches EnsPublicClient interface
        const ensClient: EnsPublicClient = {
          getEnsName: async (args: { address: `0x${string}` }) => {
            return mainnetPublicClient.getEnsName({ address: args.address });
          },
        };
        const name = await getEnsName(ensClient, address as `0x${string}`);
        if (!cancelled) {
          setEnsName(name);
        }
      } catch (err: any) {
        // Log error details for debugging
        console.error('ENS resolution error:', {
          message: err?.message,
          name: err?.name,
          cause: err?.cause,
          error: err,
        });
        if (!cancelled) {
          setEnsName(null);
        }
      } finally {
        if (!cancelled) {
          setEnsLoading(false);
        }
      }
    }

    resolveEns();

    return () => {
      cancelled = true;
    };
  }, [address, isConnected, isMockMode]);

  // Get the injected connector (first one, typically MetaMask/browser wallet)
  const injectedConnector = connectors.find((c) => c.id === 'injected' || c.type === 'injected') ?? connectors[0];

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => injectedConnector && connect({ connector: injectedConnector })}
          disabled={isPending || !injectedConnector}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Connecting…' : 'Connect wallet'}
        </button>
        {(!injectedConnector || isMockMode) && (
          <button
            type="button"
            onClick={() => {
              enableMockWallet();
              window.location.reload();
            }}
            className="px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            title="Use mock wallet for development"
          >
            {isMockMode ? '🎭 Mock' : 'Use Mock Wallet'}
          </button>
        )}
      </div>
    );
  }

  const label =
    ensLoading ? 'Resolving ENS…' : ensName ?? (address ? shortenAddress(address) : 'Connected');

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => disconnect()}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {isMockMode && <span className="mr-2 text-xs">🎭</span>}
        {label}
      </button>
      {isMockMode && (
        <span className="text-xs text-amber-600 dark:text-amber-400" title="Mock wallet mode">
          Mock
        </span>
      )}
    </div>
  );
};

