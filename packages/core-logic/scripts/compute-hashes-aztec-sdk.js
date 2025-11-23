#!/usr/bin/env node
/**
 * Script to compute Pedersen hashes using Aztec SDK
 * 
 * This script uses the Aztec SDK's hash utilities to compute Pedersen hashes
 * that match Noir's pedersen_hash output.
 * 
 * Usage:
 *   node scripts/compute-hashes-aztec-sdk.js
 * 
 * Prerequisites:
 *   - @aztec/aztec.js must be installed
 *   - This computes hashes using Aztec SDK's hash utilities
 */

async function main() {
  try {
    // Dynamic import for ESM module
    const aztecJs = await import('@aztec/aztec.js');
    
    // Check if hash utilities are available
    if (!aztecJs.pedersenHash || !aztecJs.Fr) {
      console.error('❌ Aztec SDK hash utilities not available');
      console.error('Available exports:', Object.keys(aztecJs).filter(k => 
        k.toLowerCase().includes('hash') || 
        k.toLowerCase().includes('pedersen') ||
        k.toLowerCase().includes('fr')
      ).join(', '));
      process.exit(1);
    }

    const { pedersenHash, Fr } = aztecJs;

    function stringToBytes(str) {
      const bytes = [];
      for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
      }
      return bytes;
    }

    function bytesToFields(bytes) {
      // Convert bytes to Field elements
      // Aztec's pedersenHash expects Field[] or specific format
      // We may need to chunk bytes into Field elements
      const fields = [];
      for (let i = 0; i < bytes.length; i++) {
        fields.push(Fr.fromNumber(bytes[i]));
      }
      return fields;
    }

    async function computeHash(input) {
      const bytes = stringToBytes(input);
      const fields = bytesToFields(bytes);
      
      // Try different hash methods
      let hash;
      try {
        // Method 1: Direct pedersenHash with fields
        hash = pedersenHash(fields);
      } catch (e) {
        console.error(`Error computing hash for "${input}":`, e.message);
        return null;
      }
      
      // Convert Field to hex
      const hex = hash.toString(16).padStart(64, '0');
      return `0x${hex}`;
    }

    console.log('Computing Pedersen hashes using Aztec SDK...\n');

    const inputs = [
      { name: 'aztec_concept_quiz', desc: 'Quest ID' },
      { name: 'noir_syntax_basics', desc: 'Quest ID' },
      { name: 'aztec_storage_intro', desc: 'Quest ID' },
      { name: 'aztec_builder', desc: 'Category' },
      { name: 'aztec_builder_path', desc: 'Path' },
    ];

    const results = {};
    
    for (const { name, desc } of inputs) {
      const hash = await computeHash(name);
      if (hash) {
        results[name] = hash;
        console.log(`${desc}: "${name}"`);
        console.log(`Hash: ${hash}\n`);
      } else {
        console.error(`❌ Failed to compute hash for "${name}"`);
      }
    }

    if (Object.keys(results).length === inputs.length) {
      console.log('✅ All hashes computed successfully!');
      console.log('\nCopy these values into PEDERSEN_HASH_LOOKUP in src/quests/hashing.ts:');
      console.log(JSON.stringify(results, null, 2));
    } else {
      console.error('❌ Some hashes failed to compute');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nNote: This script requires @aztec/aztec.js to be installed.');
    console.error('If hash utilities are not available, use Noir test instead:');
    console.error('  1. Install Aztec CLI: bash -i <(curl -s https://install.aztec.network)');
    console.error('  2. Run: aztec-nargo test tests/compute_pedersen_hashes.nr');
    process.exit(1);
  }
}

main();

