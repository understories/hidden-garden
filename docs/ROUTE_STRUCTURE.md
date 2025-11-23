# Route Structure Documentation

This document describes the route structure for the Hidden Garden MVP UI, including recent additions and the complete user flow.

## Route Overview

### New Routes (Phase 3 - Team B)

#### `/skills`
- **Purpose**: List of all available skills
- **Component**: `apps/aztecbat-ui/app/skills/page.tsx`
- **Status**: Stub (minimal structure)
- **Next Steps**: Add skill list UI, data fetching

#### `/skills/[skillId]`
- **Purpose**: Single skill detail page with "Attempt challenge" entry point
- **Component**: `apps/aztecbat-ui/app/skills/[skillId]/page.tsx`
- **Params**: `skillId` (normalized skill identifier, e.g., "rust", "zk")
- **Status**: Stub (minimal structure)
- **Flow Step**: Step 1 - Attempt Challenge (Private Compute)
- **Next Steps**: Add challenge UI, link to `/proof` flow

#### `/proof`
- **Purpose**: Proof/result/disclosure flow page
- **Component**: `apps/aztecbat-ui/app/proof/page.tsx`
- **Status**: Stub (minimal structure)
- **Flow Steps**: 
  - Step 2: Result Screen (Private by Default)
  - Step 3: Choose What to Reveal
  - Step 4: Submit Transaction
- **Next Steps**: Add result display, disclosure selection UI, transaction submission

### Existing Routes (Preserved)

#### `/leaderboard/[skillName]`
- **Purpose**: Leaderboard for a specific skill
- **Component**: `apps/aztecbat-ui/app/leaderboard/[skillName]/page.tsx`
- **Params**: `skillName` (skill name string, e.g., "rust", "zk")
- **Status**: Implemented (with mock data)
- **Flow Step**: Step 5 - Leaderboard Reflects Public Results
- **Note**: Uses `skillName` parameter (not `skillId`). Consider standardizing in future.

#### `/u/[identifier]`
- **Purpose**: Public profile view
- **Component**: `apps/aztecbat-ui/app/u/[identifier]/page.tsx`
- **Params**: `identifier` (ENS name like "alice.eth" or address like "0x1234...")
- **Status**: Implemented (with ENS resolution)
- **Flow Step**: Step 5 - Profile Reflects Public Results
- **Note**: Handles both ENS names and addresses. More flexible than `/profile/[address]`.

#### `/me`
- **Purpose**: User's private skill garden
- **Component**: `apps/aztecbat-ui/app/me/page.tsx`
- **Status**: Implemented (with skill editing, Self verification, skill reveal)
- **Note**: Different flow from challenge flow. Used for managing private skills.

#### `/quests/[questId]`
- **Purpose**: Quest completion page with full ZK flow
- **Component**: `apps/aztecbat-ui/app/quests/[questId]/page.tsx`
- **Status**: Implemented (full quest flow with Aztec integration)
- **Note**: More complex than `/proof` flow. May be integrated or kept separate.

## User Flow

### Challenge Flow (New - MVP)

```
1. /skills
   ↓ (user clicks skill)
2. /skills/[skillId]
   ↓ (user clicks "Attempt challenge")
3. /proof
   ├─ Step 2: Result Screen (Private by Default)
   ├─ Step 3: Choose What to Reveal
   └─ Step 4: Submit Transaction
   ↓ (after submission)
4. /leaderboard/[skillName] or /u/[identifier]
   └─ Step 5: Leaderboard and Profile Reflect Public Results
```

### Existing Flows

#### Quest Flow
```
/quests/[questId] → (completion) → /leaderboard/[skillName]
```

#### Skill Garden Flow
```
/me → (edit skills, reveal skills) → /u/[identifier]
```

## Route Naming Conventions

### `skillId` vs `skillName`
- **`skillId`**: Normalized identifier (e.g., `normalizeSkillId('Rust')` → `'rust'`)
- **`skillName`**: Human-readable name (e.g., `'Rust'`, `'Zero-Knowledge Proofs'`)
- **Current State**: 
  - `/skills/[skillId]` uses `skillId` (normalized)
  - `/leaderboard/[skillName]` uses `skillName` (human-readable)
- **Future Consideration**: Standardize on one naming convention across all routes

### Profile Routes
- **`/u/[identifier]`**: Flexible, handles ENS names and addresses
- **`/profile/[address]`**: Not implemented (would be less flexible)
- **Decision**: Keep `/u/[identifier]` for maximum flexibility

## Implementation Status

### Phase 1: Route Structure (✅ Complete)
- [x] `/skills` route created
- [x] `/skills/[skillId]` route created
- [x] `/proof` route created
- [x] Documentation created

### Phase 2: UI Implementation (⏳ Pending)
- [ ] `/skills` - Skill list UI
- [ ] `/skills/[skillId]` - Challenge entry point UI
- [ ] `/proof` - Result display, disclosure selection, transaction submission
- [ ] Navigation between routes
- [ ] State management for flow

### Phase 3: Integration (⏳ Pending)
- [ ] Connect to backend/contracts
- [ ] Data fetching for skills
- [ ] Proof generation integration
- [ ] Transaction submission
- [ ] Leaderboard/profile updates

## Files Created/Modified

### New Files
- `apps/aztecbat-ui/app/skills/page.tsx` - Skills list page
- `apps/aztecbat-ui/app/skills/[skillId]/page.tsx` - Skill detail page
- `apps/aztecbat-ui/app/proof/page.tsx` - Proof flow page
- `docs/ROUTE_STRUCTURE.md` - This documentation

### Existing Files (No Changes)
- `apps/aztecbat-ui/app/leaderboard/[skillName]/page.tsx` - Preserved
- `apps/aztecbat-ui/app/u/[identifier]/page.tsx` - Preserved
- `apps/aztecbat-ui/app/me/page.tsx` - Preserved
- `apps/aztecbat-ui/app/quests/[questId]/page.tsx` - Preserved

## Team A Integration Notes

### For Future Merges

1. **Route Compatibility**: 
   - New routes (`/skills`, `/skills/[skillId]`, `/proof`) are additive
   - No breaking changes to existing routes
   - Existing routes preserved for backward compatibility

2. **Naming Convention**:
   - `/skills/[skillId]` uses normalized skill IDs
   - `/leaderboard/[skillName]` uses skill names
   - Consider standardizing in future (non-breaking change)

3. **Flow Integration**:
   - `/proof` route is a simplified flow compared to `/quests/[questId]`
   - May want to integrate or keep separate based on use case
   - Both can coexist

4. **Data Dependencies**:
   - New routes are stubs (no data fetching yet)
   - Will need backend/contract integration in future
   - Team A's existing contracts/APIs can be integrated when ready

5. **No Breaking Changes**:
   - All existing routes remain functional
   - New routes are additive only
   - Safe to merge without affecting existing functionality

## Next Steps

1. **UI Implementation**: Add basic UI structure to new routes
2. **Navigation**: Add links between routes in the flow
3. **State Management**: Determine how to pass state between `/skills/[skillId]` → `/proof`
4. **Backend Integration**: Connect to existing contracts/APIs
5. **Testing**: Add tests for new routes

---

**Last Updated**: Phase 3 - Route Structure Complete  
**Status**: ✅ Routes created, documentation complete  
**Next Phase**: UI Implementation

