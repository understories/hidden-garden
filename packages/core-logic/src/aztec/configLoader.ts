/**
 * Aztec Configuration Loader
 * 
 * Loads sandbox or devnet configuration based on AZTEC_ENV environment variable.
 * Follows Aztec starter patterns for explicit environment selection.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface AztecConfig {
  pxeUrl: string;
  timeout: number;
  pollingInterval: number;
  maxPollingAttempts: number;
  wallet: {
    useTestAccounts: boolean;
    createIfMissing: boolean;
  };
  description?: string;
}

/**
 * Load Aztec configuration based on AZTEC_ENV
 * 
 * @param env Environment name ('sandbox' or 'devnet'), defaults to 'sandbox'
 * @returns Aztec configuration object
 */
export function loadAztecConfig(env?: string): AztecConfig {
  const aztecEnv = env || process.env.AZTEC_ENV || 'sandbox';
  
  // Determine config file path
  const configDir = path.join(__dirname, '../config');
  const configFile = aztecEnv === 'devnet' 
    ? path.join(configDir, 'devnet.json')
    : path.join(configDir, 'sandbox.json');
  
  // Load config file
  let config: AztecConfig;
  try {
    if (fs.existsSync(configFile)) {
      const configData = fs.readFileSync(configFile, 'utf-8');
      config = JSON.parse(configData);
    } else {
      // Fallback to default sandbox config if file doesn't exist
      console.warn(`[aztec/configLoader] Config file not found: ${configFile}. Using defaults.`);
      config = getDefaultConfig(aztecEnv);
    }
  } catch (error) {
    console.warn(`[aztec/configLoader] Failed to load config from ${configFile}. Using defaults.`, error);
    config = getDefaultConfig(aztecEnv);
  }
  
  // Override with environment variables if provided
  if (process.env.AZTEC_PXE_URL || process.env.PXE_URL || process.env.NEXT_PUBLIC_AZTEC_PXE_URL) {
    config.pxeUrl = process.env.AZTEC_PXE_URL || process.env.PXE_URL || process.env.NEXT_PUBLIC_AZTEC_PXE_URL || config.pxeUrl;
  }
  
  return config;
}

/**
 * Get default configuration for an environment
 */
function getDefaultConfig(env: string): AztecConfig {
  if (env === 'devnet') {
    return {
      pxeUrl: 'http://localhost:8080',
      timeout: 120000,
      pollingInterval: 5000,
      maxPollingAttempts: 20,
      wallet: {
        useTestAccounts: false,
        createIfMissing: true,
      },
      description: 'Default devnet configuration',
    };
  }
  
  // Default to sandbox
  return {
    pxeUrl: 'http://localhost:8080',
    timeout: 60000,
    pollingInterval: 3000,
    maxPollingAttempts: 10,
    wallet: {
      useTestAccounts: true,
      createIfMissing: true,
    },
    description: 'Default sandbox configuration',
  };
}

