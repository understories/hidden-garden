import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Use a more reliable RPC for ENS resolution
// Cloudflare RPC may not support all ENS functions
const mainnetRpcUrl =
  process.env.NEXT_PUBLIC_MAINNET_RPC_URL ??
  'https://eth.llamarpc.com'; // LlamaRPC is more reliable for ENS

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: http(mainnetRpcUrl),
});

