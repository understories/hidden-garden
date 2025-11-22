#!/usr/bin/env ts-node
// Script to verify SBT ownership on-chain
// Usage: pnpm verify:sbt <address>

import { ethers } from 'ethers';
import {
  SELF_HUMAN_SBT_ADDRESS,
  SelfHumanSBTAbi,
} from '../packages/common/src/contracts';

const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';

async function verifySBT(address: string) {
  console.log('🔍 Verifying SBT ownership...\n');

  if (!ethers.isAddress(address)) {
    console.error('❌ Invalid address:', address);
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(
    SELF_HUMAN_SBT_ADDRESS,
    SelfHumanSBTAbi,
    provider
  );

  try {
    console.log(`Address: ${address}`);
    console.log(`Contract: ${SELF_HUMAN_SBT_ADDRESS}`);
    console.log(`Network: ${(await provider.getNetwork()).name}\n`);

    // Check if address has valid SBT
    const hasSBT = await contract.hasValidSBT(address);
    console.log(`✅ hasValidSBT(${address}): ${hasSBT}`);

    if (hasSBT) {
      // Calculate token ID (same logic as contract)
      const tokenId = BigInt(address);
      console.log(`   Token ID: ${tokenId.toString()}`);

      // Try to get owner
      try {
        const owner = await contract.ownerOf(tokenId);
        console.log(`   Owner: ${owner}`);
        console.log(`   ✅ Owner matches address: ${owner.toLowerCase() === address.toLowerCase()}`);
      } catch (e: any) {
        console.log(`   ⚠️  Could not fetch owner: ${e.message}`);
      }

      // Check balance (should be 1)
      try {
        const balance = await contract.balanceOf(address);
        console.log(`   Balance: ${balance.toString()}`);
      } catch (e: any) {
        console.log(`   ⚠️  Could not fetch balance: ${e.message}`);
      }

      // Get recent events
      console.log('\n📋 Recent HumanVerified events:');
      const filter = contract.filters.HumanVerified(address);
      const events = await contract.queryFilter(filter, -100); // Last 100 blocks
      
      if (events.length > 0) {
        events.forEach((event: any) => {
          console.log(`   Block ${event.blockNumber}: User ${event.args.user}, Token ID ${event.args.tokenId.toString()}`);
        });
      } else {
        console.log('   No events found in recent blocks');
      }
    } else {
      console.log('❌ Address does not have a valid SBT');
    }

    // Get current block
    const blockNumber = await provider.getBlockNumber();
    console.log(`\n📦 Current block: ${blockNumber}`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

const address = process.argv[2];
if (!address) {
  console.error('Usage: pnpm verify:sbt <address>');
  console.error('Example: pnpm verify:sbt 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  process.exit(1);
}

verifySBT(address)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

