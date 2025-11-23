/**
 * Arkiv Client Setup
 * 
 * Thin wrapper around Arkiv's wallet + public clients for reading/writing to Arkiv network.
 */

import {
  createWalletClient,
  createPublicClient,
  http,
} from '@arkiv-network/sdk';
import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';
import { mendoza } from '@arkiv-network/sdk/chains';

/**
 * Read and validate Arkiv private key from environment variable
 * 
 * Server-side only - this should never be imported in browser code.
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
export const arkivPublicClient = rpcUrl
  ? createPublicClient({
      chain,
      transport: http(rpcUrl),
    })
  : null;

// Wallet client – write operations (create entities)
// Server-side only - this module should never be imported in browser code
// Note: If ARKIV_PRIVATE_KEY is set but invalid, this will throw at module load time
export const arkivWalletClient =
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

