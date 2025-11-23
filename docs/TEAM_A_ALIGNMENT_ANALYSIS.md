# Team A Golden Path Alignment Analysis

## Overview
This document outlines the changes needed to align the UI with Team A's golden-path demo story, which treats challenges as "quests" and emphasizes private Aztec storage with selective tier revelation.

## Key Changes Required

### 1. Terminology Updates: "Challenges" → "Quests"
**Current State:**
- Uses "challenges" throughout UI
- Single challenge per skill

**Required Changes:**
- Replace "challenge" with "quest" in all user-facing text
- Support multiple quests per skill (placeholder: Quest 1, Quest 2, Quest 3)
- Update routes/comments to reflect quest terminology

**Files to Update:**
- `app/skills/[skillId]/page.tsx` - "Attempt Challenge" → "Start Quest"
- `app/proof/page.tsx` - "Challenge Result" → "Quest Result"
- `app/skills/page.tsx` - Update descriptions
- All component comments and documentation

**Difficulty:** ⭐ Easy - Mostly find/replace with some UI structure changes

---

### 2. Multiple Quests Per Skill
**Current State:**
- Single challenge/quest per skill
- Direct navigation from skill → proof

**Required Changes:**
- Show list of quests (Quest 1, Quest 2, Quest 3) on skill detail page
- Each quest should be clickable/selectable
- Navigation: Skill → Quest Selection → Quest Detail → Proof

**Files to Update:**
- `app/skills/[skillId]/page.tsx` - Add quest list UI
- Potentially new route: `app/skills/[skillId]/quests/[questId]/page.tsx`

**Difficulty:** ⭐⭐ Moderate - Requires new UI structure and routing

---

### 3. Add Aztec Privacy Disclaimer
**Current State:**
- Info block mentions privacy but doesn't have the specific disclaimer

**Required Changes:**
- Add disclaimer: "We store quest completions privately in Aztec; this local list mirrors what lives there, but the only thing we reveal publicly is the ZK proof of tier."
- Show this disclaimer in logical places:
  - `/garden` or `/me` page (private view)
  - `/proof` page (before reveal)
  - Skill detail page (when showing quests)

**Files to Update:**
- `app/proof/page.tsx` - Add disclaimer section
- `app/garden/page.tsx` or `app/me/page.tsx` - Add disclaimer
- `app/skills/[skillId]/page.tsx` - Add disclaimer

**Difficulty:** ⭐ Easy - Just adding text blocks

---

### 4. Update Reveal Flow on `/proof` Page
**Current State:**
- Radio buttons: "Reveal full", "Reveal completion only", "Keep private"
- Simple tier-based reveal

**Required Changes (Team A's Flow):**
- **Tier to reveal**: Dropdown/select (1, 2, 3, 4, etc.)
- **Min average score**: Number input field
- **Toggle**: "Require proof of human (Self SBT)" vs "Allow agents"
- **Button**: "Reveal selected tier" (instead of generic options)

**Files to Update:**
- `app/proof/page.tsx` - Complete redesign of reveal controls

**Difficulty:** ⭐⭐⭐ Moderate-Hard - Significant UI restructure, but logic is straightforward

---

### 5. Simplify Leaderboard Display
**Current State:**
- Shows: Rank, Learner (with avatar), Mastery Level (tier), Verification
- May show more info than needed

**Required Changes:**
- Show **minimum** info only:
  - Address / ENS
  - Tier
  - Human / Agent badge
- **Remove**: Quest scores, per-puzzle data, any detailed breakdowns

**Files to Update:**
- `app/leaderboard/[skillId]/page.tsx` - Simplify table columns
- `components/LeaderboardEntry.tsx` - Remove unnecessary fields

**Difficulty:** ⭐ Easy - Just removing/hiding columns

---

### 6. Add "Humans Only" vs "Include Agents" Filter
**Current State:**
- Shows all entries with Human/Agent badge
- No filtering capability

**Required Changes:**
- Add toggle/filter: "Humans only" vs "Include agents"
- White-hat design: filters, not shame
- Shows why Self SBT matters

**Files to Update:**
- `app/leaderboard/[skillId]/page.tsx` - Add filter toggle
- Filter logic (client-side for now, mocked)

**Difficulty:** ⭐⭐ Moderate - Need filter state and UI toggle

---

### 7. Update Private Progress View
**Current State:**
- `/garden` page is placeholder
- `/me` page exists but may not align with Team A's vision

**Required Changes:**
- Show full private progress (quests, scores, timestamps)
- Show badges (e.g., "Aztec Builder Path Explorer")
- Padlock icon next to "private" label
- List of quests with completion status
- Emphasize this mirrors what's in Aztec

**Files to Update:**
- `app/garden/page.tsx` - Build out private view
- Or update `app/me/page.tsx` if that's the canonical private view

**Difficulty:** ⭐⭐⭐ Moderate - Requires building out the private view UI

---

## Implementation Priority

### Phase 1: Quick Wins (Easy Alignment)
1. ✅ Terminology: "challenges" → "quests" (find/replace)
2. ✅ Add Aztec privacy disclaimer
3. ✅ Simplify leaderboard (remove extra columns)

### Phase 2: Core Flow Updates (Moderate)
4. ✅ Update reveal controls on `/proof` page
5. ✅ Add "Humans only" filter on leaderboard
6. ✅ Add multiple quests placeholder on skill detail page

### Phase 3: Enhanced Features (Moderate-Hard)
7. ✅ Build out private progress view (`/garden` or `/me`)
8. ✅ Quest selection/routing structure

---

## Alignment Assessment

### ✅ Easy to Align
- Terminology changes
- Adding disclaimers
- Simplifying leaderboard
- Adding filter toggle

### ⚠️ Moderate Effort
- Multiple quests structure
- Reveal controls redesign
- Private progress view

### 🔄 Integration Points
- Backend will handle ZK proof generation
- Backend will handle Aztec storage
- UI just needs to prepare the right data structure and calls

---

## Recommended Approach

1. **Start with Phase 1** - Quick terminology and disclaimer updates
2. **Then Phase 2** - Update reveal flow to match Team A's controls
3. **Finally Phase 3** - Build out quest structure and private views

The changes are **mostly UI restructuring** with minimal backend logic needed. The hardest part is the reveal controls redesign, but it's still straightforward React state management.

---

## Key Takeaways

- **Overall Difficulty**: ⭐⭐ Moderate - Mostly UI changes
- **Backend Integration**: Minimal - UI prepares data, backend handles proofs
- **Breaking Changes**: None - Can be done incrementally
- **Timeline**: Can be done in phases, starting with easy wins

The alignment is **very achievable** and doesn't require major architectural changes. Most changes are presentational and can be done incrementally.

