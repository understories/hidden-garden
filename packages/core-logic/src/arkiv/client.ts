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
export const arkivWalletClient =
  rpcUrl && process.env.ARKIV_PRIVATE_KEY
    ? createWalletClient({
        chain,
        transport: http(rpcUrl),
        account: privateKeyToAccount(
          process.env.ARKIV_PRIVATE_KEY as `0x${string}`,
        ),
      })
    : null;

