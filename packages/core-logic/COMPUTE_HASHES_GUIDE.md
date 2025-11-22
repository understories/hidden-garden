# Guide: Computing Real Pedersen Hashes

## Prerequisites

1. **Install Aztec CLI:**
   ```bash
   bash -i <(curl -s https://install.aztec.network)
   ```

2. **Verify installation:**
   ```bash
   aztec --version
   # Should show: aztec 3.0.0-devnet.5 (or similar)
   ```

## Step 1: Run Noir Test

From `packages/core-logic` directory:

```bash
cd packages/core-logic
aztec-nargo test tests/compute_pedersen_hashes.nr
```

## Step 2: Extract Field Values

The test output will show Field values like:
```
Field(1234567890123456789012345678901234567890123456789012345678901234)
```

Look for these values in the output for:
- `q1` (aztec_concept_quiz)
- `q2` (noir_syntax_basics)
- `q3` (aztec_storage_intro)
- `cat` (aztec_builder)
- `path` (aztec_builder_path)

## Step 3: Convert to Hex

For each Field value, convert to hex:

```bash
node scripts/convert-field-to-hex.js <field_value>
```

Example:
```bash
node scripts/convert-field-to-hex.js 1234567890123456789012345678901234567890123456789012345678901234
```

Output will be: `0x<64_hex_chars>`

## Step 4: Update hashing.ts

Update `packages/core-logic/src/quests/hashing.ts`:

1. Update `PEDERSEN_HASH_LOOKUP`:
   ```typescript
   const PEDERSEN_HASH_LOOKUP: Record<string, QuestIdHash> = {
     'aztec_concept_quiz': '0x<q1_hex>' as QuestIdHash,
     'noir_syntax_basics': '0x<q2_hex>' as QuestIdHash,
     'aztec_storage_intro': '0x<q3_hex>' as QuestIdHash,
     'aztec_builder': '0x<cat_hex>' as QuestIdHash,
     'aztec_builder_path': '0x<path_hex>' as QuestIdHash,
   };
   ```

2. Update `EXPECTED_*_HASH` constants:
   ```typescript
   export const EXPECTED_AZTEC_CONCEPT_QUIZ_HASH: QuestIdHash = '0x<q1_hex>' as QuestIdHash;
   export const EXPECTED_AZTEC_BUILDER_CATEGORY_HASH: QuestIdHash = '0x<cat_hex>' as QuestIdHash;
   export const EXPECTED_AZTEC_BUILDER_PATH_HASH: QuestIdHash = '0x<path_hex>' as QuestIdHash;
   ```

## Step 5: Verify

Run tests to verify consistency:

```bash
pnpm --filter @hidden-garden/core-logic test
```

All hash consistency tests should pass.

## Alternative: Automated Extraction

You can use the extraction script:

```bash
aztec-nargo test tests/compute_pedersen_hashes.nr | ./scripts/extract-noir-hashes.sh
```

This will help identify Field values in the output.

