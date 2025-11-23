/**
 * Compute Pedersen Hashes for Quest System
 * 
 * This script computes the Pedersen hash values that match the Noir circuit.
 * Run: ts-node scripts/compute-pedersen-hashes.ts
 * 
 * The output can be directly copied into src/quests/hashing.ts
 */

import { Barretenberg, Fr } from '@aztec/bb.js';

/**
 * Convert string to bytes array (matching Noir's byte representation)
 */
function stringToBytes(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

/**
 * Convert Field (bigint) to hex string (0x-prefixed, 64 hex chars)
 */
function fieldToHex(field: bigint): string {
  const hex = field.toString(16);
  return `0x${hex.padStart(64, '0')}`;
}

/**
 * Compute Pedersen hash for a string using Barretenberg
 */
async function computeHash(input: string): Promise<{ input: string; bytes: number[]; hash: string }> {
  const bytes = stringToBytes(input);
  
  // Initialize Barretenberg
  const api = await Barretenberg.new();
  
  // Convert bytes to Field elements
  // Pedersen hash expects an array of Field elements
  const fields = bytes.map(b => new Fr(BigInt(b)));
  
  // Compute Pedersen hash
  // Barretenberg's pedersenCommit takes an array of fields
  const hash = api.pedersenCommit(fields);
  
  // Convert to hex string
  const hashHex = fieldToHex(hash.value);
  
  // Clean up
  await api.destroy();
  
  return {
    input,
    bytes,
    hash: hashHex,
  };
}

// Compute all required hashes
async function main() {
  console.log('Computing Pedersen hashes...\n');

  const questHash = await computeHash('aztec_concept_quiz');
  const categoryHash = await computeHash('aztec_builder');
  const pathHash = await computeHash('aztec_builder_path');

  console.log('Results:\n');
  console.log('1. Quest ID: "aztec_concept_quiz"');
  console.log(`   Bytes: [${questHash.bytes.join(', ')}]`);
  console.log(`   Hash:  ${questHash.hash}`);
  console.log('');

  console.log('2. Category: "aztec_builder"');
  console.log(`   Bytes: [${categoryHash.bytes.join(', ')}]`);
  console.log(`   Hash:  ${categoryHash.hash}`);
  console.log('');

  console.log('3. Path: "aztec_builder_path"');
  console.log(`   Bytes: [${pathHash.bytes.join(', ')}]`);
  console.log(`   Hash:  ${pathHash.hash}`);
  console.log('');

  console.log('Copy these values into src/quests/hashing.ts:\n');
  console.log('PEDERSEN_HASH_LOOKUP:');
  console.log(`  'aztec_concept_quiz': '${questHash.hash}' as QuestIdHash,`);
  console.log(`  'aztec_builder': '${categoryHash.hash}' as QuestIdHash,`);
  console.log(`  'aztec_builder_path': '${pathHash.hash}' as QuestIdHash,`);
}

main().catch(console.error);

