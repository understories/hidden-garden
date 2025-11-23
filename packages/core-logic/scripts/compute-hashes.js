#!/usr/bin/env node
/**
 * Script to compute Pedersen hashes using @aztec/bb.js
 * 
 * Usage:
 *   node scripts/compute-hashes.js
 * 
 * This will output the hex hashes that can be copied into hashing.ts
 */

const { Barretenberg } = require('@aztec/bb.js');

function stringToBytes(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

async function computeHash(input) {
  const bb = await Barretenberg.new();
  const bytes = stringToBytes(input);
  const bytesArray = new Uint8Array(bytes);
  const hash = await bb.pedersenHashWithHashIndex(bytesArray, 0);
  const hex = hash.toString(16).padStart(64, '0');
  return `0x${hex}`;
}

async function main() {
  console.log('Computing Pedersen hashes...\n');
  
  const inputs = [
    { name: 'aztec_concept_quiz', desc: 'Quest ID' },
    { name: 'aztec_builder', desc: 'Category' },
    { name: 'aztec_builder_path', desc: 'Path' },
  ];
  
  for (const { name, desc } of inputs) {
    const hash = await computeHash(name);
    console.log(`${desc}: "${name}"`);
    console.log(`Hash: ${hash}\n`);
  }
  
  console.log('Copy these values into PEDERSEN_HASH_LOOKUP in src/quests/hashing.ts');
}

main().catch(console.error);

