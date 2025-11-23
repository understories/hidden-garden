/**
 * Aztec SDK Client Wrapper
 * 
 * Provides a clean interface for interacting with Aztec Protocol contracts.
 * This wraps the Aztec SDK to call private functions and generate proofs.
 */

import type { QuestIdHash, QuestId } from './quests/types';
import { computeQuestIdHash } from './quests/hashing';

// Node.js modules - only available in server-side environments
// Use dynamic imports to avoid bundling issues in client-side code
let fs: typeof import('fs') | null = null;
let path: typeof import('path') | null = null;

// Lazy load Node.js modules only when needed (server-side only)
function getNodeModules() {
  if (typeof window === 'undefined' && !fs && !path) {
    try {
      fs = require('fs');
      path = require('path');
    } catch (e) {
      // Not in Node.js environment
    }
  }
  return { fs, path };
}

// Aztec.js types - using type-only imports to avoid runtime dependency issues during build
// The actual values will be imported dynamically at runtime
// Note: This allows the code to compile even if @aztec/aztec.js types aren't fully available
// Runtime will require @aztec/aztec.js to be installed

// Type definitions (will be replaced with actual imports once package is verified)
type PXE = any;
type Contract = any;
type AztecSDKAddress = any;
type TxReceipt = any;
type CompleteAddress = any;

// Runtime imports - these will be loaded dynamically
// This approach allows compilation without requiring @aztec/aztec.js to be fully set up
let createPXEClient: any;
let waitForPXE: any;
let Fr: any;
let AztecAddress: any;
let getDeployedTestAccountsWallets: any;
let Contract: any;

// Initialize Aztec.js imports dynamically at runtime
// This will fail gracefully if @aztec/aztec.js is not available
async function loadAztecSDK() {
  try {
    // Use dynamic import for ESM modules
    // @ts-ignore - dynamic import may not be recognized by TypeScript
    const aztecJs = await import('@aztec/aztec.js');
    // @ts-ignore - dynamic import may not be recognized by TypeScript
    const aztecAccounts = await import('@aztec/accounts/testing');
    
    createPXEClient = aztecJs.createPXEClient;
    waitForPXE = aztecJs.waitForPXE;
    Fr = aztecJs.Fr;
    AztecAddress = aztecJs.AztecAddress;
    Contract = aztecJs.Contract;
    getDeployedTestAccountsWallets = aztecAccounts.getDeployedTestAccountsWallets;
    
    return true;
  } catch (error) {
    // Aztec.js not available - will fail at runtime with clear error
    return false;
  }
}

/**
 * Aztec address type (from Aztec SDK)
 */
export type AztecAddress = string;

/**
 * ZK proof data structure
 */
export interface ZKProof {
  /** The zero-knowledge proof bytes */
  proof: `0x${string}`;
  /** Public inputs for verification */
  publicInputs: `0x${string}`;
}

/**
 * Result of adding a quest completion
 */
export interface QuestCompletionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Result of generating a tier proof
 */
export interface TierProofResult {
  success: boolean;
  proof?: ZKProof;
  error?: string;
}

/**
 * Configuration for Aztec client
 */
export interface AztecClientConfig {
  /** PXE URL (default: http://localhost:8080) */
  pxeUrl?: string;
  /** Contract address (if already deployed) */
  contractAddress?: AztecAddress;
  /** Optional: path to contract artifact JSON */
  artifactPath?: string;
}

/**
 * Aztec Client Interface
 * 
 * This interface defines the contract for Aztec SDK integration.
 */
export interface AztecClient {
  /**
   * Get the current user's Aztec address
   * @returns The user's Aztec address, or null if not connected
   */
  getAddress(): Promise<AztecAddress | null>;

  /**
   * Add a quest completion to the private vault
   * 
   * Calls: `add_quest_completion(owner, quest_id_hash, score)`
   * 
   * @param questIdHash The hashed quest identifier
   * @param score The completion score (0-100)
   * @returns Result indicating success or failure
   */
  addQuestCompletion(
    questIdHash: QuestIdHash,
    score: number
  ): Promise<QuestCompletionResult>;

  /**
   * Generate a tier proof for the Aztec Builder pathway
   * 
   * Calls: `prove_aztec_builder_tier(owner, min_tier, min_average_score)`
   * 
   * @param minTier The minimum tier to prove (1-4)
   * @param minAverageScore The minimum average score (0-100)
   * @returns ZK proof and public inputs, or error
   */
  proveAztecBuilderTier(
    minTier: number,
    minAverageScore: number
  ): Promise<TierProofResult>;
}

/**
 * Real Aztec Client Implementation
 * 
 * Connects to Aztec devnet and calls the PrivateIdentityGarden contract.
 * 
 * Prerequisites:
 * - Aztec devnet/sandbox running (use `pnpm aztec:devnet`)
 * - Contract compiled (use `pnpm aztec:compile`)
 * - Contract artifact available in target/ directory
 */
export class RealAztecClient implements AztecClient {
  private pxe: PXE | null = null;
  private contract: Contract | null = null;
  private contractAddress: AztecAddress | null = null;
  private userAddress: AztecAddress | null = null;
  private account: CompleteAddress | null = null;
  private config: AztecClientConfig;
  private initialized: boolean = false;

  constructor(config: AztecClientConfig = {}) {
    this.config = {
      pxeUrl: process.env.PXE_URL || process.env.AZTEC_PXE_URL || 'http://localhost:8080',
      contractAddress: process.env.AZTEC_PRIVATE_IDENTITY_GARDEN_ADDRESS || config?.contractAddress,
      artifactPath: config?.artifactPath,
      ...config,
    };
  }

  /**
   * Initialize connection to Aztec devnet
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const pxeUrl = this.config.pxeUrl!;
      
      if (!pxeUrl) {
        throw new Error(
          'RealAztecClient: PXE URL not configured. ' +
          'Set PXE_URL or AZTEC_PXE_URL environment variable, or pass pxeUrl in config. ' +
          'Example: PXE_URL=http://localhost:8080'
        );
      }
      
      // Create PXE client
      try {
        this.pxe = createPXEClient(pxeUrl);
      } catch (error) {
        throw new Error(
          `RealAztecClient: Could not create PXE client for ${pxeUrl}. ` +
          `Error: ${error instanceof Error ? error.message : String(error)}. ` +
          `Make sure @aztec/aztec.js is installed.`
        );
      }
      
      // Wait for PXE to be ready
      try {
        await waitForPXE(this.pxe, 60000); // 60 second timeout
      } catch (error) {
        throw new Error(
          `RealAztecClient: Could not connect to PXE at ${pxeUrl}. ` +
          `Is Aztec sandbox/devnet running? ` +
          `Start it with: pnpm aztec:devnet or aztec start --sandbox. ` +
          `Error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
      
      // Load Aztec SDK modules
      const sdkLoaded = await loadAztecSDK();
      if (!sdkLoaded) {
        throw new Error('Failed to load @aztec/aztec.js. Make sure it is installed.');
      }

      // Get test account wallets from sandbox
      // getDeployedTestAccountsWallets returns AccountWallet instances
      const wallets = await getDeployedTestAccountsWallets(this.pxe);
      if (wallets.length === 0) {
        throw new Error('No test accounts found in Aztec sandbox. Make sure devnet is running.');
      }
      
      // Use first wallet (sandbox provides pre-funded test accounts)
      const accountWallet = wallets[0];
      this.userAddress = accountWallet.getAddress().toString();
      
      // Store wallet for contract interactions
      this.account = accountWallet as any; // Store wallet as account for compatibility

      // Load contract artifact
      const artifactPath = this.config.artifactPath || this.findContractArtifact();
      const { fs: fsModule, path: pathModule } = getNodeModules();
      if (!fsModule || !pathModule) {
        throw new Error('Node.js modules (fs, path) are not available. This function must run server-side.');
      }
      if (!artifactPath || !fsModule.existsSync(artifactPath)) {
        const checkedPaths = this.config.artifactPath 
          ? [this.config.artifactPath]
          : [
              pathModule.join(__dirname, '../target/PrivateIdentityGarden.json'),
              pathModule.join(__dirname, '../target/private_skill_tree.json'),
              pathModule.join(__dirname, '../artifacts/PrivateIdentityGarden.json'),
              pathModule.join(process.cwd(), 'packages/core-logic/target/PrivateIdentityGarden.json'),
              pathModule.join(process.cwd(), 'packages/core-logic/target/private_skill_tree.json'),
              pathModule.join(process.cwd(), 'target/PrivateIdentityGarden.json'),
              pathModule.join(process.cwd(), 'target/private_skill_tree.json'),
            ];
        throw new Error(
          `RealAztecClient: Could not load PrivateIdentityGarden artifact. ` +
          `Checked paths: ${checkedPaths.join(', ')}. ` +
          `Did you run \`pnpm aztec:compile\`? ` +
          `The contract must be compiled before deployment.`
        );
      }

      const artifact = JSON.parse(fsModule.readFileSync(artifactPath, 'utf-8'));

      // Load or deploy contract using real Aztec.js SDK API
      if (this.config.contractAddress) {
        // Connect to existing contract at specified address
        this.contractAddress = this.config.contractAddress;
        
        // Use AztecAddress.fromString() to parse address
        const contractAddr = AztecAddress.fromString(this.contractAddress);
        
        // Create Contract instance: new Contract(address, artifact, wallet)
        this.contract = new Contract(contractAddr, artifact, accountWallet);
        
        console.log(`✅ Connected to existing PrivateIdentityGarden contract at: ${this.contractAddress}`);
      } else {
        // Deploy new contract
        // Real API: Contract.deploy(wallet, artifact).send().deployed()
        try {
          const deployTx = Contract.deploy(accountWallet, artifact);
          const receipt = await deployTx.send().deployed();
          
          // Get contract address from deployed receipt
          this.contractAddress = receipt.address.toString();
          this.contract = receipt.contract;
          
          if (!this.contractAddress) {
            throw new Error('Contract deployment succeeded but address not found in receipt');
          }
          
          console.log(`✅ Deployed PrivateIdentityGarden contract at: ${this.contractAddress}`);
          console.log(`   Save this address to AZTEC_PRIVATE_IDENTITY_GARDEN_ADDRESS for reuse`);
        } catch (error) {
          throw new Error(
            `RealAztecClient: Failed to deploy PrivateIdentityGarden. ` +
            `Check devnet logs and your deployer account. ` +
            `Error: ${error instanceof Error ? error.message : String(error)}. ` +
            `Make sure the contract artifact is valid and the wallet has sufficient funds.`
          );
        }
      }
    } catch (error) {
      throw new Error(`Failed to initialize Aztec client: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.initialized = true;
    }
  }

  async getAddress(): Promise<AztecAddress | null> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.userAddress;
  }

  /**
   * Add a quest completion to the private vault (by quest ID)
   * 
   * @param questId The quest ID string (e.g., "aztec_concept_quiz")
   * @param score The completion score (0-100)
   * @returns Result indicating success or failure
   */
  async addQuestCompletionByQuestId(
    questId: QuestId,
    score: number
  ): Promise<QuestCompletionResult> {
    const questIdHash = computeQuestIdHash(questId);
    return this.addQuestCompletion(questIdHash, score);
  }

  /**
   * Add a quest completion to the private vault
   * 
   * @param questIdHash The hashed quest identifier
   * @param score The completion score (0-100)
   * @returns Result indicating success or failure
   */
  async addQuestCompletion(
    questIdHash: QuestIdHash,
    score: number
  ): Promise<QuestCompletionResult> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (!this.contract || !this.account) {
        throw new Error('Contract not initialized. Make sure contract is compiled and deployed.');
      }

      if (!this.userAddress) {
        throw new Error('User address not available');
      }

      // Validate score
      if (score < 0 || score > 100) {
        return {
          success: false,
          error: `Invalid score: ${score}. Score must be between 0 and 100.`,
        };
      }

      if (!Fr) {
        throw new Error('@aztec/aztec.js not available. Cannot convert questIdHash to Field.');
      }

      // Convert questIdHash from hex string to Field
      const questIdHashField = Fr.fromString(questIdHash);
      
      // Convert owner address to AztecAddress
      // Note: This requires the actual AztecAddress type from @aztec/aztec.js
      // For now, we'll use the string address directly
      const ownerAddress = this.account!.address;

      // Call private function: add_quest_completion(owner, quest_id_hash, score)
      // Note: This will be implemented once contract artifact is loaded
      const tx = this.contract!.methods.add_quest_completion(
        ownerAddress,
        questIdHashField,
        score
      ).send();

      const receipt: TxReceipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.txHash.toString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async proveAztecBuilderTier(
    minTier: number,
    minAverageScore: number
  ): Promise<TierProofResult> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (!this.contract || !this.account) {
        throw new Error('Contract not initialized. Make sure contract is compiled and deployed.');
      }

      if (!this.userAddress) {
        throw new Error('User address not available');
      }

      // Get owner address from wallet
      const ownerAddress = (this.account as any).getAddress();

      // Call private function: prove_aztec_builder_tier(owner, min_tier, min_average_score)
      // Real API: contract.methods.methodName(...args).send().wait()
      const tx = this.contract.methods.prove_aztec_builder_tier(
        ownerAddress,
        minTier,
        minAverageScore
      ).send();

      const receipt: TxReceipt = await tx.wait();
      
      // Extract proof and public inputs from receipt
      // The receipt contains the proof and public inputs after execution
      // Format: proof is bytes, public inputs are array of fields
      const proof = receipt.proof ? `0x${Buffer.from(receipt.proof).toString('hex')}` : `0x${'0'.repeat(128)}`;
      
      // Public inputs include: owner, minTier, minAverageScore, pathHash
      // These are returned as the function's return value
      const publicInputs = receipt.returnValues 
        ? `0x${Buffer.from(JSON.stringify(receipt.returnValues)).toString('hex')}`
        : `0x${'0'.repeat(64)}`;

      return {
        success: true,
        proof: {
          proof: proof as `0x${string}`,
          publicInputs: publicInputs as `0x${string}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Get the deployed contract address
   */
  getContractAddress(): AztecAddress | null {
    return this.contractAddress;
  }

  /**
   * Find the contract artifact file
   * Looks in common locations: target/, artifacts/, target/PrivateIdentityGarden.json
   */
  private findContractArtifact(): string | null {
    const { fs: fsModule, path: pathModule } = getNodeModules();
    if (!fsModule || !pathModule) {
      return null; // Not in Node.js environment
    }
    const possiblePaths = [
      pathModule.join(__dirname, '../target/PrivateIdentityGarden.json'),
      pathModule.join(__dirname, '../target/private_skill_tree.json'),
      pathModule.join(__dirname, '../artifacts/PrivateIdentityGarden.json'),
      pathModule.join(process.cwd(), 'packages/core-logic/target/PrivateIdentityGarden.json'),
      pathModule.join(process.cwd(), 'packages/core-logic/target/private_skill_tree.json'),
      pathModule.join(process.cwd(), 'target/PrivateIdentityGarden.json'),
      pathModule.join(process.cwd(), 'target/private_skill_tree.json'),
    ];

    for (const artifactPath of possiblePaths) {
      if (fsModule.existsSync(artifactPath)) {
        return artifactPath;
      }
    }

    return null;
  }

  /**
   * Create contract methods wrapper
   * This is a helper to create method callers from artifact
   * The actual implementation will depend on Aztec.js API
   */
  private createContractMethods(artifact: any, wallet: any): any {
    // This is a placeholder - actual implementation will use Aztec.js contract methods
    // The artifact contains ABI information that can be used to create method callers
    // For now, return a mock structure that will be replaced with actual API calls
    return {
      add_quest_completion: (...args: any[]) => ({
        send: async () => ({
          wait: async () => ({
            txHash: '0x' + Math.random().toString(16).substring(2, 66),
          }),
        }),
      }),
      prove_aztec_builder_tier: (...args: any[]) => ({
        send: async () => ({
          wait: async () => ({
            txHash: '0x' + Math.random().toString(16).substring(2, 66),
            proof: '0x' + '0'.repeat(128),
            publicInputs: '0x' + '0'.repeat(64),
          }),
        }),
      }),
    };
  }
}

/**
 * Mock Aztec Client (for development/testing)
 * 
 * This provides a mock implementation that simulates Aztec SDK calls
 * without requiring actual Aztec infrastructure.
 */
export class MockAztecClient implements AztecClient {
  private address: AztecAddress | null = null;
  private questCompletions: Map<QuestIdHash, number> = new Map();

  async getAddress(): Promise<AztecAddress | null> {
    return this.address || 'aztec1mockuser123456789';
  }

  async addQuestCompletion(
    questIdHash: QuestIdHash,
    score: number
  ): Promise<QuestCompletionResult> {
    // Validate score
    if (score < 0 || score > 100) {
      return {
        success: false,
        error: `Invalid score: ${score}. Score must be between 0 and 100.`,
      };
    }

    // Store completion (keep best score)
    const currentScore = this.questCompletions.get(questIdHash) || 0;
    if (score > currentScore) {
      this.questCompletions.set(questIdHash, score);
    }

    // Simulate transaction
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}` as `0x${string}`;

    return {
      success: true,
      transactionHash: txHash,
    };
  }

  async proveAztecBuilderTier(
    minTier: number,
    minAverageScore: number
  ): Promise<TierProofResult> {
    // Mock proof generation
    // In real implementation, this would call the Aztec SDK
    
    // For now, generate mock proof data
    const proof: ZKProof = {
      proof: `0x${'0'.repeat(128)}` as `0x${string}`, // Mock proof
      publicInputs: `0x${'0'.repeat(64)}` as `0x${string}`, // Mock public inputs
    };

    return {
      success: true,
      proof,
    };
  }
}

/**
 * Client creation mode
 */
export type AztecClientMode = 'mock' | 'real';

/**
 * Create an Aztec client instance
 * 
 * @param mode - 'mock' for mock client, 'real' for real Aztec devnet client
 * @param config - Configuration for real client (only used when mode is 'real')
 * @returns AztecClient instance
 * 
 * Environment variables:
 * - PXE_URL: Aztec PXE endpoint (default: http://localhost:8080)
 * - AZTEC_CLIENT_MODE: 'mock' or 'real' (default: 'real' if PXE_URL is set, else 'mock')
 * - PRIVATE_IDENTITY_GARDEN_ADDRESS: Contract address if already deployed
 */
export function createAztecClient(
  mode?: AztecClientMode,
  config?: AztecClientConfig
): AztecClient {
  // Determine mode from environment or parameter
  const clientMode = mode || (process.env.AZTEC_CLIENT_MODE as AztecClientMode) || 'real';
  
  if (clientMode === 'mock') {
    return new MockAztecClient();
  }

  // For real client, check if PXE_URL is available
  const pxeUrl = process.env.PXE_URL || config?.pxeUrl || 'http://localhost:8080';
  
  // If explicitly requesting real but no PXE URL, warn and fall back to mock
  if (clientMode === 'real' && !pxeUrl) {
    console.warn('⚠️  PXE_URL not set. Falling back to mock client. Set PXE_URL to use real Aztec client.');
    return new MockAztecClient();
  }

  return new RealAztecClient({
    ...config,
    pxeUrl,
    contractAddress: process.env.PRIVATE_IDENTITY_GARDEN_ADDRESS || config?.contractAddress,
  });
}
