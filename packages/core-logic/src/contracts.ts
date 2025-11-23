/**
 * Contract addresses, ABIs, and chain configurations for Hidden Garden
 * 
 * This module provides the single source of truth for contract integration.
 * Contract addresses should be updated after deployments.
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Ethereum address type (0x-prefixed hex string, 42 characters)
 */
export type Address = `0x${string}`;

/**
 * Supported chain ID
 */
export type SupportedChainId = number;

// ============================================================================
// Chain Configurations
// ============================================================================

/**
 * Chain configuration interface
 */
export interface ChainConfig {
  chainId: SupportedChainId;
  name: string;
  rpcUrl?: string;
  blockExplorerUrl?: string;
  selfHumanSBT?: Address;
  skillLeaderboard?: Address;
}

/**
 * Supported chains with contract addresses
 * 
 * NOTE: Contract addresses should be updated after deployments.
 * For local development, use the addresses from Hardhat deployment.
 */
export const CHAINS: Record<SupportedChainId, ChainConfig> = {
  // Local Hardhat network (default for development)
  31337: {
    chainId: 31337,
    name: 'Local (Hardhat)',
    rpcUrl: 'http://localhost:8545',
    blockExplorerUrl: 'http://localhost:8545', // Hardhat node doesn't have explorer, but we can show RPC URL
    // Updated addresses from latest deployment (run: pnpm --filter @hidden-garden/contracts-public deploy:node)
    selfHumanSBT: '0x0165878A594ca255338adfa4d48449f69242Eb8F' as Address,
    skillLeaderboard: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853' as Address,
  },
  // Sepolia testnet
  11155111: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    // TODO: Update with deployed addresses
    // selfHumanSBT: '0x...' as Address,
    // skillLeaderboard: '0x...' as Address,
  },
};

// ============================================================================
// Contract Addresses (convenience exports)
// ============================================================================

/**
 * Real Self SBT addresses by chain ID
 * These are the production Self SBT contract addresses
 * TODO: Update with actual deployed addresses after Self integration
 */
const REAL_SELF_SBT_ADDRESSES: Partial<Record<SupportedChainId, Address>> = {
  // Add real Self SBT addresses here when deployed
  // Example:
  // 11155111: '0x...' as Address, // Sepolia
  // 1: '0x...' as Address, // Mainnet
};

/**
 * Get SelfHumanSBT address for a given chain
 * 
 * Supports dev mode via SELF_MODE environment variable:
 * - If NEXT_PUBLIC_SELF_MODE=dev: Uses NEXT_PUBLIC_DEV_SELF_SBT_ADDRESS
 * - Otherwise: Uses real Self SBT address from CHAINS or REAL_SELF_SBT_ADDRESSES
 * 
 * @param chainId Chain ID to get address for
 * @returns SelfHumanSBT contract address, or undefined if not configured
 */
export function getSelfHumanSBTAddress(chainId: SupportedChainId): Address | undefined {
  // Check for dev mode (works in both browser and Node.js)
  const selfMode = 
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SELF_MODE) ||
    (typeof process !== 'undefined' && process.env?.SELF_MODE);
  
  if (selfMode === 'dev') {
    const devAddress = 
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DEV_SELF_SBT_ADDRESS) ||
      (typeof process !== 'undefined' && process.env?.DEV_SELF_SBT_ADDRESS);
    
    if (devAddress) {
      return devAddress as Address;
    }
    
    // If dev mode is set but no dev address, fall back to CHAINS
    console.warn(
      `SELF_MODE=dev but NEXT_PUBLIC_DEV_SELF_SBT_ADDRESS not set. ` +
      `Falling back to CHAINS[${chainId}].selfHumanSBT`
    );
  }
  
  // Real mode: check CHAINS first, then REAL_SELF_SBT_ADDRESSES
  const chainAddress = CHAINS[chainId]?.selfHumanSBT;
  if (chainAddress) {
    return chainAddress;
  }
  
  // Fall back to REAL_SELF_SBT_ADDRESSES if not in CHAINS
  return REAL_SELF_SBT_ADDRESSES[chainId];
}

/**
 * Get SkillLeaderboard address for a given chain
 */
export function getSkillLeaderboardAddress(chainId: SupportedChainId): Address | undefined {
  return CHAINS[chainId]?.skillLeaderboard;
}

/**
 * Get blockchain explorer URL for a transaction hash
 * 
 * @param chainId Chain ID
 * @param txHash Transaction hash
 * @returns Explorer URL, or null if not available
 */
export function getExplorerTxUrl(chainId: SupportedChainId, txHash: string): string | null {
  const chainConfig = CHAINS[chainId];
  if (!chainConfig) {
    return null;
  }

  const explorerUrl = chainConfig.blockExplorerUrl;
  if (!explorerUrl) {
    return null;
  }

  // For Hardhat local, there's no real explorer, so return null
  if (chainId === 31337) {
    return null; // Hardhat doesn't have a block explorer
  }

  // For other chains, construct the transaction URL
  // Most explorers use: {baseUrl}/tx/{txHash}
  return `${explorerUrl}/tx/${txHash}`;
}

/**
 * Default SelfHumanSBT address (local development)
 * @deprecated Use getSelfHumanSBTAddress(chainId) instead
 */
export const SELF_HUMAN_SBT_ADDRESS: Address = CHAINS[31337].selfHumanSBT!;

/**
 * Default SkillLeaderboard address (local development)
 * @deprecated Use getSkillLeaderboardAddress(chainId) instead
 */
export const SKILL_LEADERBOARD_ADDRESS: Address = CHAINS[31337].skillLeaderboard!;

// ============================================================================
// Contract ABIs
// ============================================================================

/**
 * SelfHumanSBT ABI
 * 
 * Minimal ABI for interacting with the SelfHumanSBT contract.
 * Full ABI is available in packages/contracts-public/artifacts/
 */
export const SelfHumanSBTAbi = [
  {
    inputs: [
      { internalType: 'bytes', name: 'proofPayload', type: 'bytes' },
      { internalType: 'bytes', name: 'userContextData', type: 'bytes' },
    ],
    name: 'verifyAndMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'hasValidSBT',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * SkillLeaderboard ABI
 * 
 * Minimal ABI for interacting with the SkillLeaderboard contract.
 * Full ABI is available in packages/contracts-public/artifacts/
 */
export const SkillLeaderboardAbi = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'skillHash', type: 'bytes32' },
      { internalType: 'uint8', name: 'tier', type: 'uint8' },
    ],
    name: 'submitSkillTier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'skillHash', type: 'bytes32' },
      { internalType: 'uint8', name: 'minLevel', type: 'uint8' },
      { internalType: 'bytes', name: 'proof', type: 'bytes' },
      { internalType: 'bytes', name: 'publicInputs', type: 'bytes' },
    ],
    name: 'submitSkillTierWithProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '', type: 'bytes32' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'skillTier',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'bytes32', name: 'skillHash', type: 'bytes32' },
      { indexed: false, internalType: 'uint8', name: 'tier', type: 'uint8' },
    ],
    name: 'SkillRevealed',
    type: 'event',
  },
] as const;

