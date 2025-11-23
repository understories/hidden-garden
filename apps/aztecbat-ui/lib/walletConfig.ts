import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
// Only import injected connector - MVP only needs browser wallet support
import { injected } from 'wagmi/connectors';

/**
 * Wagmi Configuration - MVP Setup
 * 
 * Only uses injected() connector for browser wallet support (MetaMask, etc.)
 * This is the simplest setup and doesn't require any optional SDK dependencies.
 */
export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    // Only use injected connector - works with window.ethereum (MetaMask, etc.)
    // No optional dependencies required
    injected(),
  ],
  transports: {
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ??
        'https://rpc.sepolia.org',
    ),
  },
  ssr: true,
});

