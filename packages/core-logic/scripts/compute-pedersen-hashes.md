# Computing Pedersen Hashes

**Purpose:** Compute Pedersen hash values that match the Noir circuit implementation.

## Overview

The Noir circuit (`packages/core-logic/src/main.nr`) uses `hash::pedersen_hash()` to compute hashes for:
- Quest IDs (e.g., "aztec_concept_quiz")
- Categories (e.g., "aztec_builder")
- Paths (e.g., "aztec_builder_path")

These hashes **MUST match** between Noir and TypeScript. The TypeScript code in `packages/core-logic/src/quests/hashing.ts` uses hardcoded values that must be computed from the Noir circuit.

## Method 1: Using aztec-nargo (Recommended)

This is the **official method** recommended by the backend team.

### Prerequisites

1. **Install Aztec CLI:**
   ```bash
   bash -i <(curl -s https://install.aztec.network)
   ```

2. **Verify installation:**
   ```bash
   aztec --version
   aztec-nargo --version
   ```

### Steps

1. **Run the Noir test:**
   ```bash
   cd packages/core-logic
   aztec-nargo test tests/compute_pedersen_hashes.nr
   ```

2. **Extract Field values from output:**
   The test output will show Field values like:
   ```
   Field(1234567890123456789012345678901234567890)
   ```

3. **Convert Field to hex:**
   ```bash
   node scripts/convert-field-to-hex.js <field_value>
   ```

   Example:
   ```bash
   node scripts/convert-field-to-hex.js 1234567890123456789012345678901234567890
   ```

4. **Update `hashing.ts`:**
   Copy the hex values into `packages/core-logic/src/quests/hashing.ts`:
   ```typescript
   const PEDERSEN_HASH_LOOKUP: Record<string, QuestIdHash> = {
     'aztec_concept_quiz': '0x<computed_hex_value>' as QuestIdHash,
     'aztec_builder': '0x<computed_hex_value>' as QuestIdHash,
     'aztec_builder_path': '0x<computed_hex_value>' as QuestIdHash,
   };
   ```

### Automated Script

You can use the provided script:
```bash
cd packages/core-logic
./scripts/get-hashes.sh
```

This will:
1. Run the Noir test
2. Show the output
3. Provide instructions for conversion

## Method 2: Using @aztec/bb.js (Alternative)

If you can't install aztec-nargo, you can try using `@aztec/bb.js` directly, but this requires understanding the Barretenberg API.

**Note:** The current script (`scripts/compute-pedersen-hashes.ts`) attempts this but needs the correct Barretenberg API usage.

## Required Hashes

You need to compute these three hashes:

1. **Quest ID:** `"aztec_concept_quiz"`
   - Bytes: `[97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122]`
   - Must match: `AZTEC_CONCEPT_QUIZ_HASH` in `main.nr`

2. **Category:** `"aztec_builder"`
   - Bytes: `[97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114]`
   - Must match: `AZTEC_BUILDER_CATEGORY_HASH` in `main.nr`

3. **Path:** `"aztec_builder_path"`
   - Bytes: `[97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114, 95, 112, 97, 116, 104]`
   - Must match: `AZTEC_BUILDER_PATH_HASH` in `main.nr`

## Verification

After updating the hashes:

1. **Run consistency tests:**
   ```bash
   cd packages/core-logic
   pnpm test hash_consistency
   ```

2. **Verify format:**
   - Each hash should be `0x` followed by 64 hex characters
   - Total length: 66 characters
   - Example: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

## Current Status

**MVP Workaround:** The code now uses placeholder values (`0x0000...`) if hashes aren't computed yet. This allows the app to run, but you should compute the actual hashes for production.

**To compute hashes:**
1. Install aztec-nargo (see Method 1 above)
2. Run the test
3. Extract and convert values
4. Update `hashing.ts`

---

**Last Updated:** Hash Computation Instructions  
**Maintained By:** Backend Team (Team A)

