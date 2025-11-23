/**
 * Arkiv Client Setup
 * 
 * Thin wrapper around Arkiv's wallet + public clients for reading/writing to Arkiv network.
 * Can be completely disabled via DISABLE_ARKIV or NEXT_PUBLIC_DISABLE_ARKIV env vars.
 */

// Feature flag: Arkiv can be disabled for demos that don't need it
const ARKIV_DISABLED =
  process.env.DISABLE_ARKIV === 'true' ||
  process.env.NEXT_PUBLIC_DISABLE_ARKIV === 'true';

// Stub clients for when Arkiv is disabled
const createStubPublicClient = () => ({
  buildQuery: () => ({
    where: () => ({
      orderBy: () => ({
        limit: () => ({
          withAttributes: () => ({
            withPayload: () => ({
              fetch: async () => ({ entities: [] }),
            }),
          }),
        }),
      }),
    }),
  }),
});

const createStubWalletClient = () => ({
  createEntity: async () => {
    throw new Error('Arkiv is disabled for this demo. Set DISABLE_ARKIV=false to enable.');
  },
});

// Initialize clients based on feature flag
let arkivPublicClient: any;
let arkivWalletClient: any;

if (ARKIV_DISABLED) {
  console.log('[arkiv] Arkiv is disabled (DISABLE_ARKIV=true). Using stub clients.');
  arkivPublicClient = createStubPublicClient();
  arkivWalletClient = createStubWalletClient();
} else {
  // Only import and initialize Arkiv SDK when enabled
  try {
    const {
      createWalletClient,
      createPublicClient,
      http,
    } = require('@arkiv-network/sdk');
    const { privateKeyToAccount } = require('@arkiv-network/sdk/accounts');
    const { mendoza } = require('@arkiv-network/sdk/chains');

    /**
     * Read and validate Arkiv private key from environment variable
     * 
     * Server-side only - this should never be imported in browser code.
     * Only called when Arkiv is enabled and wallet client is being created.
     * 
     * @returns Validated private key as 0x-prefixed hex string
     * @throws Error if key is missing or invalid format
     */
    function readArkivPrivateKey(): `0x${string}` {
      const raw = process.env.ARKIV_PRIVATE_KEY;

      if (!raw) {
        throw new Error(
          'ARKIV_PRIVATE_KEY is not set. Add ARKIV_PRIVATE_KEY=0x<64-hex> to your .env.local (server-only, no quotes).',
        );
      }

      const trimmed = raw.trim();
      const isHex = /^0x[0-9a-fA-F]{64}$/.test(trimmed);

      if (!isHex) {
        throw new Error(
          `ARKIV_PRIVATE_KEY has invalid format: "${trimmed.slice(0, 10)}...". Expected 0x-prefixed 64-hex string (66 chars total).`,
        );
      }

      return trimmed as `0x${string}`;
    }

    const rpcUrl = process.env.ARKIV_RPC_URL;
    const chainIdFromEnv = process.env.ARKIV_CHAIN_ID
      ? Number(process.env.ARKIV_CHAIN_ID)
      : undefined;

    // Default to Mendoza testnet if env not set
    const chain = {
      ...mendoza,
      id: chainIdFromEnv ?? mendoza.id,
    };

    if (!rpcUrl) {
      console.warn('[arkiv] ARKIV_RPC_URL not set; Arkiv public client will be disabled.');
    }

    // Public client – read only
    arkivPublicClient = rpcUrl
      ? createPublicClient({
          chain,
          transport: http(rpcUrl),
        })
      : null;

    // Wallet client – write operations (create entities)
    // Server-side only - this module should never be imported in browser code
    // Note: readArkivPrivateKey() is only called here, not at module top-level
    arkivWalletClient =
      rpcUrl && process.env.ARKIV_PRIVATE_KEY
        ? (() => {
            // Debug logging in development (server-side only)
            if (process.env.NODE_ENV === 'development') {
              const raw = process.env.ARKIV_PRIVATE_KEY;
              console.log('[Arkiv] ARKIV_PRIVATE_KEY present:', !!raw);
              if (raw) {
                console.log('[Arkiv] ARKIV_PRIVATE_KEY length:', raw.trim().length);
                console.log('[Arkiv] ARKIV_PRIVATE_KEY startsWith0x:', raw.trim().startsWith('0x'));
              }
            }
            
            return createWalletClient({
              chain,
              transport: http(rpcUrl),
              account: privateKeyToAccount(readArkivPrivateKey()),
            });
          })()
        : null;
  } catch (error) {
    // If Arkiv SDK is not installed, use stub clients
    console.warn('[arkiv] Arkiv SDK not available, using stub clients:', error instanceof Error ? error.message : String(error));
    arkivPublicClient = createStubPublicClient();
    arkivWalletClient = createStubWalletClient();
  }
}

export { arkivPublicClient, arkivWalletClient };
