'use client';

import * as React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { shortenAddress } from '@hidden-garden/common';
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
        // Use getEnsName with a timeout and better error handling
        const name = await Promise.race([
          mainnetPublicClient.getEnsName({
            address: address as `0x${string}`,
          }),
          new Promise<string | null>((_, reject) =>
            setTimeout(() => reject(new Error('ENS resolution timeout')), 5000),
          ),
        ]) as string | null;
        
        if (!cancelled) {
          setEnsName(name);
        }
      } catch (err: any) {
        // Silently fail - not all addresses have ENS names
        // Only log if it's not a contract execution error (which is expected for addresses without ENS)
        if (err?.message && !err.message.includes('reverted')) {
          console.warn('ENS resolution warning:', err.message);
        }
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
        className="px-3 py-1 rounded border text-sm"
      >
        {isPending ? 'Connecting…' : 'Connect wallet'}
      </button>
    );
  }

  const label =
    ensLoading ? 'Resolving ENS…' : ensName ?? (address ? shortenAddress(address) : 'Connected');

  return (
    <button
      type="button"
      onClick={() => disconnect()}
      className="px-3 py-1 rounded border text-sm"
    >
      {label}
    </button>
  );
};

