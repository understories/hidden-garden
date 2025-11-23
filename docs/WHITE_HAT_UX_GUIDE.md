# White-Hat UX Implementation Guide

This guide maps White-Hat Octalysis principles to specific UI components in the codebase.

**Reference:** See `docs/WHITE_HAT_OCTALYSIS_REFERENCE.md` for full principles.

## Quick Checklist for UI Components

Before implementing or updating any leaderboard/progression UI, verify:

- ✅ Shows personal progress (not just rank)
- ✅ Transparent rules and scoring
- ✅ Supportive, informative copy
- ✅ No urgency or fear-based messaging
- ✅ Highlights contributions and growth
- ✅ User always visible (even if low rank)
- ✅ Clear next steps provided

## Component-Specific Guidelines

### 1. Leaderboard Page (`apps/aztecbat-ui/app/leaderboard/[skillName]/page.tsx`)

**Current Status:** Basic table implementation

**White-Hat Enhancements Needed:**

- [ ] Add personal progress panel (if user is logged in)
  - Current level/XP for this skill
  - Rank delta ("+3 ranks this week")
  - "Top X% this season" context
- [ ] Highlight user's row (even if not in top 10)
- [ ] Add helpful context:
  - "This leaderboard shows skills revealed to the community"
  - "Your rank reflects your contributions and growth"
- [ ] Show recent accomplishments/activity (not just tier)
- [ ] Add "View my progress" link to `/me` page

**Copywriting Examples:**
- ✅ "You're ranked #42 out of 150 contributors"
- ✅ "Top 28% this season"
- ❌ "You dropped 5 places" (avoid rank-loss warnings)
- ❌ "At risk of losing rewards" (avoid fear-based messaging)

### 2. My Garden Page (`apps/aztecbat-ui/app/me/page.tsx`)

**Current Status:** Skill editing, Self verification, skill reveal flow

**White-Hat Enhancements Needed:**

- [ ] Add progress visualization:
  - XP progress bars for each skill
  - Level-up indicators
  - Recent accomplishments timeline
- [ ] Improve skill reveal messaging:
  - ✅ "Reveal this skill to share your progress with the community"
  - ✅ "Choose the tier threshold you've achieved"
  - ❌ "Reveal now or miss out" (avoid urgency)
- [ ] Add helpfulness indicators:
  - Sessions helped
  - Validations given
  - Contributions made
- [ ] Show clear next steps:
  - "Complete quest X to reach Tier Y"
  - "Help 3 more sessions to unlock..."

**Copywriting Examples:**
- ✅ "Your skill garden grows as you learn and contribute"
- ✅ "Reveal skills to inspire others in the community"
- ❌ "You're falling behind" (avoid shame)
- ❌ "Limited time: Reveal now!" (avoid urgency)

### 3. Public Profile Page (`apps/aztecbat-ui/app/u/[identifier]/page.tsx`)

**Current Status:** Shows public skills list

**White-Hat Enhancements Needed:**

- [ ] Add contribution context:
  - "This profile shows skills shared with the community"
  - "Total contributions: X"
- [ ] Highlight helpfulness (if tracked):
  - "Helped Y sessions"
  - "Validated Z proofs"
- [ ] Show growth trajectory (if available):
  - "Joined X months ago"
  - "Active contributor"
- [ ] Add supportive messaging:
  - "Every contribution strengthens the ecosystem"

**Copywriting Examples:**
- ✅ "Public skills shared with the community"
- ✅ "Contributing to the Hidden Garden ecosystem"
- ❌ "Incomplete profile" (avoid negative framing)
- ❌ "Missing skills" (avoid shame)

### 4. Skill Reveal Flow (in `/me` page)

**Current Status:** Tier selection → proof generation → contract submission

**White-Hat Enhancements Needed:**

- [ ] Add context before reveal:
  - "Sharing your progress helps others learn"
  - "You can reveal at any tier - choose what feels right"
- [ ] Show benefits of revealing:
  - "Inspire others in the community"
  - "Contribute to the collective knowledge"
- [ ] Avoid pressure:
  - No countdown timers
  - No "limited time" messaging
  - No fear of missing out

**Copywriting Examples:**
- ✅ "Reveal this skill to share your progress"
- ✅ "Choose the tier you've achieved"
- ❌ "Reveal now before it's too late" (avoid urgency)
- ❌ "Only top contributors reveal" (avoid exclusivity)

### 5. Identity Verification Flow (in `/me` page)

**Current Status:** "Verify with Self" button, status display

**White-Hat Enhancements Needed:**

- [ ] Add context:
  - "Verification helps maintain a healthy community"
  - "Prove you're human to unlock additional features"
- [ ] Show benefits:
  - "Verified contributors help build trust"
  - "Join a community of verified learners"
- [ ] Avoid pressure:
  - No urgency messaging
  - No shaming for unverified status

**Copywriting Examples:**
- ✅ "Verify your identity to unlock additional features"
- ✅ "Join verified contributors in the community"
- ❌ "Verify now or lose access" (avoid coercion)
- ❌ "Unverified users can't participate" (avoid exclusion)

## Implementation Priority

### Phase 1 (High Priority)
1. Add personal progress context to leaderboard
2. Improve skill reveal messaging
3. Add supportive copy to all flows

### Phase 2 (Medium Priority)
1. Add progress visualization to `/me` page
2. Add helpfulness indicators
3. Enhance public profile with contribution context

### Phase 3 (Nice to Have)
1. Add rank delta tracking
2. Add "Top X%" calculations
3. Add accomplishment timeline

## Code Locations

- **Leaderboard:** `apps/aztecbat-ui/app/leaderboard/[skillName]/page.tsx`
- **My Garden:** `apps/aztecbat-ui/app/me/page.tsx`
- **Public Profile:** `apps/aztecbat-ui/app/u/[identifier]/page.tsx`
- **Reference Doc:** `docs/WHITE_HAT_OCTALYSIS_REFERENCE.md`

## Testing Checklist

When implementing White-Hat UX, verify:

- [ ] No urgency or countdown timers
- [ ] No fear-based or shaming language
- [ ] Progress is visible and transparent
- [ ] User is supported, not pressured
- [ ] Contributions are highlighted
- [ ] Clear next steps are provided
- [ ] Rules and scoring are transparent

---

**Remember:** White-Hat design promotes long-term engagement through empowerment, not short-term engagement through coercion.

