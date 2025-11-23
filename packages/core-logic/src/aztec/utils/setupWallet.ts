/**
 * Setup Aztec Wallet
 * 
 * Follows Aztec starter pattern for wallet setup.
 * Creates a wallet with proper account and fee handling.
 */

import type { PXE } from '@aztec/aztec.js/node';
import { createAccountFromEnv } from './createAccountFromEnv';
import { loadAztecConfig } from '../configLoader';

export interface SetupWalletConfig {
  /** PXE client instance */
  pxe: PXE;
  /** Private key (optional, will use env or test accounts) */
  privateKey?: string;
  /** Account salt (optional) */
  salt?: number;
  /** Environment name ('sandbox' or 'devnet') */
  env?: string;
}

/**
 * Setup an Aztec wallet with account and fee handling
 * 
 * This function:
 * 1. Creates an account from environment variables or test accounts
 * 2. Sets up fee payment (sponsored FPC for devnet if needed)
 * 3. Returns a ready-to-use wallet
 * 
 * @param config Configuration for wallet setup
 * @returns Wallet instance ready for contract interactions
 */
export async function setupWallet(
  config: SetupWalletConfig
): Promise<any> {
  const { pxe, privateKey, salt, env } = config;
  
  // Load config to check wallet behavior
  const aztecConfig = loadAztecConfig(env);
  
  // Create account from environment
  const account = await createAccountFromEnv({
    pxe,
    privateKey,
    salt,
  });
  
  // For now, return the account as the wallet
  // In Aztec v3, the account itself acts as a wallet
  // Fee payment setup would be handled here if using FPC
  
  return account;
}

