/**
 * Create Aztec Account from Environment Variables
 * 
 * Follows Aztec starter pattern for env-based account creation.
 * Uses Schnorr key generation from environment variables.
 */

import type { PXE } from '@aztec/aztec.js/node';

export interface AccountFromEnvConfig {
  /** PXE client instance */
  pxe: PXE;
  /** Private key from environment (optional, will generate if not provided) */
  privateKey?: string;
  /** Account salt (optional) */
  salt?: number;
}

/**
 * Create an Aztec account from environment variables
 * 
 * Environment variables:
 * - AZTEC_PRIVATE_KEY: Schnorr private key (hex string, optional)
 * - AZTEC_ACCOUNT_SALT: Account salt (number, optional)
 * 
 * If AZTEC_PRIVATE_KEY is not set, will attempt to use test accounts from sandbox.
 * 
 * @param config Configuration for account creation
 * @returns Account wallet instance
 */
export async function createAccountFromEnv(
  config: AccountFromEnvConfig
): Promise<any> {
  const { pxe, privateKey, salt } = config;
  
  // Try to load Aztec SDK dynamically
  let getDeployedTestAccountsWallets: any;
  let AccountManager: any;
  let Fr: any;
  
  try {
    const aztecAccountsTesting = await import('@aztec/accounts/testing');
    getDeployedTestAccountsWallets = aztecAccountsTesting.getDeployedTestAccountsWallets;
    
    const aztecAccount = await import('@aztec/aztec.js/account');
    AccountManager = aztecAccount.AccountManager;
    
    const aztecFields = await import('@aztec/aztec.js/fields');
    Fr = aztecFields.Fr;
  } catch (error) {
    throw new Error(
      `Failed to load Aztec SDK for account creation: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  
  // If private key is provided, create account from it
  if (privateKey || process.env.AZTEC_PRIVATE_KEY) {
    const key = privateKey || process.env.AZTEC_PRIVATE_KEY!;
    
    // Convert hex string to Fr (field element)
    const privateKeyField = Fr.fromString(key);
    const accountSalt = salt ?? (process.env.AZTEC_ACCOUNT_SALT ? Number(process.env.AZTEC_ACCOUNT_SALT) : undefined);
    
    // Create account manager
    const accountManager = new AccountManager(pxe, privateKeyField, accountSalt);
    
    // Get or create the account
    const account = await accountManager.getAccount();
    
    return account;
  }
  
  // Otherwise, use test accounts from sandbox
  if (getDeployedTestAccountsWallets) {
    const wallets = await getDeployedTestAccountsWallets(pxe);
    if (wallets.length > 0) {
      return wallets[0];
    }
  }
  
  throw new Error(
    'No account available. Either set AZTEC_PRIVATE_KEY environment variable ' +
    'or ensure sandbox is running with test accounts.'
  );
}

