# Team B Route Changes - For Team A Review

## Summary

Team B has added three new routes to support the MVP challenge flow. These changes are **additive only** - no existing routes were modified or removed.

## Changes Made

### New Routes Added

1. **`/skills`** - Skills list page
   - File: `apps/aztecbat-ui/app/skills/page.tsx`
   - Status: Stub (minimal structure, no implementation)
   - Purpose: Entry point for skill challenge flow

2. **`/skills/[skillId]`** - Skill detail page
   - File: `apps/aztecbat-ui/app/skills/[skillId]/page.tsx`
   - Status: Stub (minimal structure, no implementation)
   - Purpose: Challenge entry point (Step 1 of user flow)
   - Parameter: `skillId` (normalized skill identifier)

3. **`/proof`** - Proof/result/disclosure flow page
   - File: `apps/aztecbat-ui/app/proof/page.tsx`
   - Status: Stub (minimal structure, no implementation)
   - Purpose: Handles steps 2-4 of user flow (result, disclosure, submission)

### Existing Routes (Unchanged)

All existing routes remain functional and unchanged:
- `/leaderboard/[skillName]` - Preserved
- `/u/[identifier]` - Preserved
- `/me` - Preserved
- `/quests/[questId]` - Preserved
- `/` (home) - Preserved

## User Flow

The new routes support this flow:

```
/skills → /skills/[skillId] → /proof → /leaderboard/[skillName] or /u/[identifier]
```

This is a simplified challenge flow separate from the existing quest flow (`/quests/[questId]`).

## Implementation Status

**Current State**: Route structure only (stubs)
- ✅ Routes created and accessible
- ✅ TypeScript types correct
- ✅ No data fetching or backend calls
- ⏳ UI implementation pending
- ⏳ Backend integration pending

## Naming Convention Note

- New route uses: `/skills/[skillId]` (normalized ID, e.g., "rust")
- Existing route uses: `/leaderboard/[skillName]` (human-readable name, e.g., "Rust")

**Recommendation**: Consider standardizing in future (non-breaking change). For now, both work independently.

## Merge Safety

✅ **Safe to merge** - No breaking changes
- All new routes are additive
- Existing routes untouched
- No dependencies on Team A code
- Stubs only (no implementation that could conflict)

## Documentation

Full route structure documentation: `docs/ROUTE_STRUCTURE.md`

## Next Steps (Team B)

1. Implement UI for new routes
2. Add navigation between routes
3. Integrate with backend/contracts (when ready)
4. Add state management for flow

## Questions for Team A

1. Should `/proof` integrate with existing `/quests/[questId]` flow, or remain separate?
2. Do you have preferences for `skillId` vs `skillName` standardization?
3. Any concerns about route naming or structure?

---

**Created**: Phase 3 - Route Structure  
**Status**: ✅ Complete (stubs only)  
**Impact**: Additive only, no breaking changes

