# Pedersen Hashes - Merge Ready Status

## Current Status: ✅ MVP Placeholders in Place

The codebase is set up to use **placeholder hash values** (`0x0000...`) for MVP/UI development. This allows Team B to continue UI work while Team A computes the actual hashes.

## What's Set Up

### ✅ Placeholder System
- `packages/core-logic/src/quests/hashing.ts` - Uses placeholders with clear warnings
- `packages/core-logic/src/quests/mapping.ts` - Gracefully handles missing hashes
- App runs without errors using placeholder values

### ✅ Documentation
- `packages/core-logic/scripts/compute-pedersen-hashes.md` - Instructions for Team A
- `COMPUTE_HASHES_INSTRUCTIONS.md` - Quick reference
- Clear comments in code marking placeholders

## For Backend Team (Team A) - When Computing Hashes

### Files to Update

**1. `packages/core-logic/src/quests/hashing.ts`**

Update the `PEDERSEN_HASH_LOOKUP` object:

```typescript
const PEDERSEN_HASH_LOOKUP: Record<string, QuestIdHash> = {
  // Replace placeholders with actual computed hashes:
  'aztec_concept_quiz': '0x<ACTUAL_COMPUTED_HASH>' as QuestIdHash,
  'aztec_builder': '0x<ACTUAL_COMPUTED_HASH>' as QuestIdHash,
  'aztec_builder_path': '0x<ACTUAL_COMPUTED_HASH>' as QuestIdHash,
  // ... other quest IDs
};
```

**2. `packages/core-logic/src/quests/hashing.ts`**

Update the expected hash constants:

```typescript
export const EXPECTED_AZTEC_BUILDER_CATEGORY_HASH: QuestIdHash = '0x<ACTUAL_HASH>' as QuestIdHash;
export const EXPECTED_AZTEC_BUILDER_PATH_HASH: QuestIdHash = '0x<ACTUAL_HASH>' as QuestIdHash;
// ... etc
```

### How to Compute

1. **Install aztec-nargo:**
   ```bash
   bash -i <(curl -s https://install.aztec.network)
   ```

2. **Run Noir test:**
   ```bash
   cd packages/core-logic
   aztec-nargo test tests/compute_pedersen_hashes.nr
   ```

3. **Extract and convert:**
   - Extract Field values from output
   - Convert to hex: `node scripts/convert-field-to-hex.js <field_value>`
   - Update `hashing.ts` with computed values

4. **Verify:**
   ```bash
   pnpm test hash_consistency
   ```

## Merge Strategy

### Current State (MVP)
- ✅ App runs with placeholders
- ✅ No errors or crashes
- ✅ UI development can continue
- ⚠️ Placeholder values clearly marked

### After Backend Team Computes Hashes
- Team A updates `hashing.ts` with actual values
- Remove placeholder warnings/comments
- Run consistency tests
- Merge to main

### No Conflicts Expected
- Team B only uses the hash functions (doesn't modify them)
- Team A owns `hashing.ts` and will update it
- Clean separation of concerns

## Files Team B Should NOT Modify

- `packages/core-logic/src/quests/hashing.ts` - Team A owns this
- `packages/core-logic/src/quests/mapping.ts` - Team A owns this (but Team B can use exports)
- `packages/core-logic/tests/compute_pedersen_hashes.nr` - Team A owns this

## Files Team B Can Use

- `computeCategoryHash()`, `computePathHash()`, `computeQuestIdHash()` - Use these functions
- `AZTEC_BUILDER_CATEGORY_HASH`, `PATH_HASH` - Use these constants
- All exports from `@hidden-garden/core-logic`

## Testing After Hash Update

Once Team A provides actual hashes:

```bash
# Run consistency tests
cd packages/core-logic
pnpm test hash_consistency

# Verify app still works
cd ../..
pnpm dev:web
# Visit http://localhost:3000/me
```

---

**Status:** ✅ Ready for merge  
**Next Step:** Team A computes hashes and updates `hashing.ts`  
**No Action Required:** Team B can continue UI development

