'use client';

import * as React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export const ConnectButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

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

  return (
    <button
      type="button"
      onClick={() => disconnect()}
      className="px-3 py-1 rounded border text-sm"
    >
      {address ? shortenAddress(address) : 'Disconnect'}
    </button>
  );
};

