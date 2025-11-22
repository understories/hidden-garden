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
        const name = await mainnetPublicClient.getEnsName({
          address: address as `0x${string}`,
        });
        if (!cancelled) {
          setEnsName(name);
        }
      } catch (err) {
        console.error('ENS resolution error:', err);
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

