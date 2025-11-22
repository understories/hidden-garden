import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: http(
    process.env.NEXT_PUBLIC_MAINNET_RPC_URL ??
      'https://cloudflare-eth.com',
  ),
});

