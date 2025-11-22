import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';

// In the future we may switch to Celo or other chains.
export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ??
        'https://rpc.sepolia.org',
    ),
  },
  ssr: true,
});

