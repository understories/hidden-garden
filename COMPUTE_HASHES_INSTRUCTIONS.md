# Computing Pedersen Hashes - Instructions

## Current Status

✅ **App is running** with placeholder hash values  
⚠️ **Hashes need to be computed** for production use

The app currently uses placeholder values (`0x0000...`) to allow it to run. These need to be replaced with actual Pedersen hash values computed from the Noir circuit.

## Quick Summary

**What needs to be computed:**
- `aztec_builder` category hash
- `aztec_builder_path` path hash  
- `aztec_concept_quiz` quest ID hash (and others as needed)

**How to compute:**
1. Install Aztec CLI: `bash -i <(curl -s https://install.aztec.network)`
2. Run: `cd packages/core-logic && aztec-nargo test tests/compute_pedersen_hashes.nr`
3. Extract Field values from output
4. Convert to hex using: `node scripts/convert-field-to-hex.js <field_value>`
5. Update `packages/core-logic/src/quests/hashing.ts` with computed values

## Detailed Instructions

See: `packages/core-logic/scripts/compute-pedersen-hashes.md`

## Files to Update

After computing hashes, update:
- `packages/core-logic/src/quests/hashing.ts` - Update `PEDERSEN_HASH_LOOKUP` with computed values
- `packages/core-logic/src/quests/mapping.ts` - Remove try/catch workaround once hashes are computed

## Verification

After updating:
```bash
cd packages/core-logic
pnpm test hash_consistency
```

---

**Note:** The app will run with placeholders, but you should compute the actual hashes for production.

