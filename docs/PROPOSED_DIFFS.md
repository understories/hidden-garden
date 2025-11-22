# Proposed Diffs for Merge

This document shows the key changes made by Team B for Phase 3 implementation.

---

## 1. Team A-Owned File Changes

### `packages/core-logic/src/index.ts`

**Change Type:** Non-breaking addition (export quest system types)

**Diff:**
```diff
// Re-export all core-logic exports
export * from './contracts';
export * from './leaderboardClient';
export * from './skills';
export * from './ens';
export * from './api';

// Export types (prioritize skillTree.ts version of SkillNode which has children)
export type { AztecBuilderTierProofInputs } from './types';
export type { SkillNode } from './skillTree';
export { normalizeSkillId } from './skillTree';

+// Export quest system types and utilities
+export * from './quests/types';
+export * from './quests/mapping';
```

**Reason:** Required for `packages/game-engine` to import quest types from `@hidden-garden/core-logic`

**Impact:** Low - Only adds exports, doesn't change existing behavior

---

## 2. Team B-Owned File Changes

### `packages/game-engine/package.json`

**Change Type:** Add dependency on `@hidden-garden/core-logic`

**Diff:**
```diff
{
  "name": "@hidden-garden/game-engine",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "echo 'No build step needed - TypeScript source files'"
  },
+  "dependencies": {
+    "@hidden-garden/core-logic": "workspace:*"
+  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

**Reason:** `game-engine` needs to import quest types from `core-logic`

**Impact:** Low - Expected dependency addition

---

### `packages/game-engine/src/index.ts`

**Change Type:** Export skill proof provider

**Diff:**
```diff
// Export quest registry
export * from './registry';
export * from './quests';

+// Export skill proof provider
+export * from './skillProofProvider';
```

**Reason:** Make `skillProofProvider` available to UI code

**Impact:** Low - Only adds export

---

### `apps/aztecbat-ui/package.json`

**Change Type:** Add testing dependencies

**Diff:**
```diff
  "devDependencies": {
+    "@testing-library/jest-dom": "^6.1.5",
+    "@testing-library/react": "^14.1.2",
+    "@testing-library/user-event": "^14.5.1",
+    "@types/jest": "^29.5.11",
+    "jest": "^29.7.0",
+    "jest-environment-jsdom": "^29.7.0",
    "typescript": "^5.9.3"
  }
```

**Reason:** Enable unit testing for Phase 3 features

**Impact:** Low - Only adds dev dependencies

---

### Root `package.json`

**Change Type:** Script name update

**Diff:**
```diff
  "scripts": {
    "lint": "turbo lint",
    "build": "turbo build",
    "test": "turbo test",
-    "dev:web": "pnpm --filter @hidden-garden/web dev",
+    "dev:web": "pnpm --filter @hidden-garden/aztecbat-ui dev",
    "dev:indexer": "pnpm --filter @hidden-garden/indexer dev",
    "dev:playground": "pnpm --filter @hidden-garden/playground dev",
    "e2e:skills": "ts-node --project scripts/tsconfig.json scripts/e2e-skill-test.ts",
    "verify:sbt": "ts-node --project scripts/tsconfig.json scripts/verify-sbt.ts"
  },
```

**Reason:** Reflect package rename from `web` to `aztecbat-ui`

**Impact:** Low - Only script name change

---

## 3. New Files Created

### Team B UI Files

**New Files:**
- `apps/aztecbat-ui/hooks/useHasValidSBT.ts` - SBT status checking hook
- `apps/aztecbat-ui/lib/selfVerification.ts` - Self verification flow initiation
- `apps/aztecbat-ui/app/me/__tests__/verification-status.test.tsx` - Verification tests
- `apps/aztecbat-ui/app/me/__tests__/skill-reveal.test.tsx` - Skill reveal tests
- `apps/aztecbat-ui/jest.config.js` - Jest configuration
- `apps/aztecbat-ui/jest.setup.js` - Jest setup

**Ownership:** Team B (all in `apps/aztecbat-ui/`)

---

### Team A-Owned File (Created During Phase 3)

**New File:**
- `packages/game-engine/src/skillProofProvider.ts` - Proof provider interface and stub

**Ownership:** Team A (per documentation)

**Note:** This file was created during Phase 3, but Team A owns it. Team B treats it as a canonical integration boundary and does not modify it.

---

## 4. Modified Files (Team B Domain)

### `apps/aztecbat-ui/app/me/page.tsx`

**Changes:**
- Added Self verification UI section (lines ~60-150)
- Added skill reveal flow (lines ~200-400)
- Added ENS resolution for connected wallet
- Added contract integration for skill submission

**Key Additions:**
- `useHasValidSBT` hook integration
- `startSelfVerificationFlow` function call
- `stubSkillProofProvider.generateProof` integration
- `SkillLeaderboard.submitSkillTierWithProof` contract call
- Transaction state management
- Revealed skills tracking

**Ownership:** Team B (in `apps/aztecbat-ui/`)

---

## 5. Documentation Files

### New Documentation

**Files Created:**
- `docs/teamB_phase3_implementation_summary.md` - Comprehensive Team A documentation
- `docs/MERGE_PREPARATION.md` - Merge safety checklist and instructions
- `docs/PROPOSED_DIFFS.md` - This file

**Purpose:** Help Team A understand Team B's implementation and prepare for merge

---

## 6. Summary of Changes

### Files Modified: 7
- `packages/core-logic/src/index.ts` (Team A - non-breaking addition)
- `packages/game-engine/package.json` (Team B)
- `packages/game-engine/src/index.ts` (Team B)
- `apps/aztecbat-ui/package.json` (Team B)
- `apps/aztecbat-ui/app/me/page.tsx` (Team B)
- `package.json` (root - script name only)
- `pnpm-lock.yaml` (root - dependency updates)

### Files Created: 9
- `apps/aztecbat-ui/hooks/useHasValidSBT.ts` (Team B)
- `apps/aztecbat-ui/lib/selfVerification.ts` (Team B)
- `apps/aztecbat-ui/app/me/__tests__/verification-status.test.tsx` (Team B)
- `apps/aztecbat-ui/app/me/__tests__/skill-reveal.test.tsx` (Team B)
- `apps/aztecbat-ui/jest.config.js` (Team B)
- `apps/aztecbat-ui/jest.setup.js` (Team B)
- `packages/game-engine/src/skillProofProvider.ts` (Team A-owned)
- `docs/teamB_phase3_implementation_summary.md` (Team B)
- `docs/MERGE_PREPARATION.md` (Team B)

### Total Changes
- **Modified:** 7 files
- **Created:** 9 files
- **Deleted:** 0 files

---

## 7. Merge Risk Assessment

### Low Risk Changes ✅
- All Team B-owned files (in `apps/aztecbat-ui/`)
- Root `package.json` (script name only)
- `pnpm-lock.yaml` (additive dependency updates)

### Medium Risk Changes ⚠️
- `packages/core-logic/src/index.ts` - Non-breaking addition, but Team A should review
- `packages/game-engine/src/skillProofProvider.ts` - Team A ownership, should confirm

### No Risk Changes ✅
- Documentation files (separate files)
- Test files (Team B domain)

---

## 8. Recommended Review Process

1. **Review Team A-Owned Changes:**
   - `packages/core-logic/src/index.ts` - Quest exports addition
   - `packages/game-engine/src/skillProofProvider.ts` - Ownership confirmation

2. **Review Team B Implementation:**
   - Read `docs/teamB_phase3_implementation_summary.md`
   - Test UI at `/me` page
   - Run tests: `pnpm test`

3. **Verify Merge Safety:**
   - Check `docs/MERGE_PREPARATION.md`
   - Run `pnpm install` to verify dependencies
   - Run `pnpm build` to verify build

4. **Merge:**
   - Merge Team B's branch
   - Resolve any conflicts (expected minimal)
   - Verify post-merge checklist

---

**Last Updated:** Merge Preparation  
**Status:** ✅ Ready for Review  
**Next Step:** Team A review and merge

