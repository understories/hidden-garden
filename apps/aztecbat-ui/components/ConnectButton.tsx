'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import type { EnsPublicClient } from '@hidden-garden/core-logic';
import { shortenAddress, getEnsName } from '@hidden-garden/core-logic';
import { mainnetPublicClient } from '../lib/viemClients';

export const ConnectButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [ensName, setEnsName] = React.useState<string | null>(null);
  const [ensLoading, setEnsLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function resolveEns() {
      if (!address || !isConnected) {
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
  }, [address, isConnected]);

  // Get the injected connector (first one, typically MetaMask/browser wallet)
  const injectedConnector = connectors.find((c) => c.id === 'injected' || c.type === 'injected') ?? connectors[0];

  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={() => injectedConnector && connect({ connector: injectedConnector })}
        disabled={isPending || !injectedConnector}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Connecting…' : 'Connect Wallet'}
      </button>
    );
  }

  // Format display name: show ENS.eth if available, otherwise shortened address
  const displayName = ensLoading 
    ? 'Resolving ENS…' 
    : ensName 
    ? `${ensName}${ensName.endsWith('.eth') ? '' : '.eth'}` // Ensure .eth suffix
    : (address ? shortenAddress(address) : 'Connected');
  
  // Use ENS name for profile link if available, otherwise address
  const profileIdentifier = ensName || address;
  const profileHref = profileIdentifier ? `/u/${profileIdentifier}` : null;

  return (
    <div className="flex items-center gap-2">
      {profileHref ? (
        <Link
          href={profileHref}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {displayName}
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200">
          {displayName}
        </span>
      )}
      <button
        type="button"
        onClick={() => disconnect()}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        title="Disconnect wallet"
      >
        Disconnect
      </button>
    </div>
  );
};

