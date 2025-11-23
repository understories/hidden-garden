#!/usr/bin/env ts-node

/**
 * Quick script to mint a SelfHumanSBT to a test address for demo purposes
 * 
 * Usage:
 *   pnpm tsx scripts/mint-sbt-for-demo.ts <address> [chainId]
 * 
 * Example:
 *   pnpm tsx scripts/mint-sbt-for-demo.ts 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 31337
 */

import { ethers } from 'ethers';
import { getSelfHumanSBTAddress, SelfHumanSBTAbi } from '../packages/core-logic/src/contracts';

const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Hardhat default

async function main() {
  const address = process.argv[2];
  const chainIdArg = process.argv[3];

  if (!address) {
    console.error('❌ Error: Address is required');
    console.log('\nUsage: pnpm tsx scripts/mint-sbt-for-demo.ts <address> [chainId]');
    console.log('Example: pnpm tsx scripts/mint-sbt-for-demo.ts 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 31337');
    process.exit(1);
  }

  if (!ethers.isAddress(address)) {
    console.error(`❌ Error: Invalid address: ${address}`);
    process.exit(1);
  }

  const chainId = chainIdArg ? parseInt(chainIdArg, 10) : 31337; // Default to Hardhat local

  console.log('🌱 Minting SelfHumanSBT for Demo\n');
  console.log(`📡 RPC URL: ${RPC_URL}`);
  console.log(`⛓️  Chain ID: ${chainId}`);
  console.log(`👤 Target Address: ${address}\n`);

  // Connect to provider
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log(`🔑 Signer Address: ${signer.address}\n`);

  // Get SBT contract address
  const sbtAddress = getSelfHumanSBTAddress(chainId as any);
  if (!sbtAddress) {
    console.error(`❌ Error: SelfHumanSBT address not found for chain ID ${chainId}`);
    console.log('💡 Make sure contracts are deployed and addresses are configured in contracts.ts');
    process.exit(1);
  }

  console.log(`📝 SelfHumanSBT Contract: ${sbtAddress}\n`);

  const sbtContract = new ethers.Contract(sbtAddress, SelfHumanSBTAbi, signer);

  // Check if SBT already exists
  try {
    const hasSBT = await sbtContract.hasValidSBT(address);
    if (hasSBT) {
      console.log('✅ SBT already exists for this address!');
      console.log(`   Token ID: ${BigInt(address)}`);
      process.exit(0);
    }
  } catch (error) {
    console.warn('⚠️  Could not check existing SBT (this is okay if contract is new)');
  }

  // For mock hub, we can use verifyAndMint with a dummy proof
  // In production, this would be called by the Self Hub callback
  console.log('📤 Minting SBT...');

  try {
    // For mock/testing, we use a dummy proof
    // In real deployment, this would come from Self Hub
    const dummyProof = '0x1234'; // Mock proof for testing

    const tx = await sbtContract.verifyAndMint(dummyProof);
    console.log(`   Transaction: ${tx.hash}`);
    console.log('   Waiting for confirmation...');

    const receipt = await tx.wait();
    console.log(`   ✅ Confirmed in block ${receipt.blockNumber}`);

    // Verify the SBT was minted
    const hasSBT = await sbtContract.hasValidSBT(address);
    if (hasSBT) {
      console.log('\n✅ Success! SBT minted and verified.');
      console.log(`   Address: ${address}`);
      console.log(`   Token ID: ${BigInt(address)}`);
    } else {
      console.warn('\n⚠️  Transaction succeeded but SBT verification failed.');
      console.warn('   This might be expected if using a mock hub.');
    }
  } catch (error: any) {
    if (error.message?.includes('SBT already exists')) {
      console.log('✅ SBT already exists for this address!');
    } else {
      console.error('\n❌ Error minting SBT:');
      console.error(error.message || error);
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

