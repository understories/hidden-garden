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
    // These are example addresses from local Hardhat deployment
    // Update after running: pnpm --filter @hidden-garden/contracts-public deploy
    selfHumanSBT: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as Address,
    skillLeaderboard: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9' as Address,
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
 * Get SelfHumanSBT address for a given chain
 */
export function getSelfHumanSBTAddress(chainId: SupportedChainId): Address | undefined {
  return CHAINS[chainId]?.selfHumanSBT;
}

/**
 * Get SkillLeaderboard address for a given chain
 */
export function getSkillLeaderboardAddress(chainId: SupportedChainId): Address | undefined {
  return CHAINS[chainId]?.skillLeaderboard;
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

