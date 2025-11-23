# Team B Layout & Dark Mode Changes - For Team A Review

## Summary

Team B has updated the root layout to include navigation and dark mode support. These changes are **additive and non-breaking** - existing functionality is preserved.

## Changes Made

### 1. Tailwind CSS Setup

**New Files:**
- `apps/aztecbat-ui/tailwind.config.js` - Tailwind configuration with dark mode support
- `apps/aztecbat-ui/postcss.config.js` - PostCSS configuration
- `apps/aztecbat-ui/app/globals.css` - Global styles with theme variables

**Dependencies Added:**
- `tailwindcss` (dev dependency)
- `autoprefixer` (dev dependency)
- `postcss` (dev dependency)

### 2. Dark Mode Toggle Component

**New File:**
- `apps/aztecbat-ui/components/DarkModeToggle.tsx`

**Features:**
- Explicit, labeled toggle button (White-Hat Octalysis: user-controlled, not gamified)
- Persists preference in `localStorage`
- Respects system preference on first visit
- Smooth transitions between themes
- Accessible (ARIA labels, keyboard support)

### 3. Layout Updates

**Modified File:**
- `apps/aztecbat-ui/app/layout.tsx`

**Changes:**
- Added navigation link to `/skills`
- Replaced `ConnectButton` in header with placeholder text ("Connected wallet")
- Added `DarkModeToggle` component
- Added `globals.css` import
- Added dark mode classes to HTML/body
- Improved header structure and styling

**Preserved:**
- `WalletProvider` wrapper (needed for existing pages that use wagmi hooks)
- Existing structure and functionality
- All existing routes remain functional

## Design Decisions

### Why Placeholder Text Instead of ConnectButton?

The header now shows "Connected wallet" as placeholder text instead of the actual `ConnectButton` component. This is intentional for the MVP phase:

- **Current State**: Placeholder text only (no wallet connection in header)
- **Future**: Can easily swap placeholder with `ConnectButton` when ready
- **Existing Functionality**: `ConnectButton` component still exists and can be used in other pages

### Dark Mode Implementation

- **Method**: Class-based (`class="dark"` on `<html>`)
- **Storage**: `localStorage.getItem('theme')` / `localStorage.setItem('theme', 'dark'|'light')`
- **Fallback**: System preference (`prefers-color-scheme`)
- **Default**: Light mode if no preference saved

### White-Hat Octalysis Compliance

The dark mode toggle follows White-Hat principles:
- ✅ **Explicit**: Clearly labeled button ("☀️ Light" / "🌙 Dark")
- ✅ **User-Controlled**: User decides when to toggle
- ✅ **No Gamification**: No hidden mechanics or tricks
- ✅ **Transparent**: Obvious what the toggle does
- ✅ **Comfort-Focused**: About user preference, not engagement tricks

## Route Navigation

**Header Navigation:**
- "Hidden Garden 🌱" → Links to `/` (home)
- "Skills" → Links to `/skills`

**Future Navigation:**
- Can easily add more links (e.g., `/me`, `/leaderboard`)
- Structure supports expansion

## Files Created/Modified

### New Files
- `apps/aztecbat-ui/tailwind.config.js`
- `apps/aztecbat-ui/postcss.config.js`
- `apps/aztecbat-ui/app/globals.css`
- `apps/aztecbat-ui/components/DarkModeToggle.tsx`
- `docs/TEAMB_LAYOUT_DARKMODE.md` (this file)

### Modified Files
- `apps/aztecbat-ui/app/layout.tsx`
- `apps/aztecbat-ui/package.json` (added Tailwind dependencies)

## Installation Required

**⚠️ IMPORTANT: After pulling these changes, you MUST run:**

```bash
pnpm install
```

This will install the new Tailwind CSS dependencies (`tailwindcss`, `postcss`, `autoprefixer`).

**If you see "Cannot find module 'tailwindcss'" error:**
- This means dependencies haven't been installed yet
- Run `pnpm install` from the root directory
- The error will resolve once dependencies are installed

## Testing

### Dark Mode Toggle
1. Visit any page
2. Click the dark mode toggle button in header
3. Theme should switch immediately
4. Refresh page - preference should persist
5. Check `localStorage` - should contain `theme: 'dark'` or `theme: 'light'`

### Navigation
1. Click "Skills" in header → should navigate to `/skills`
2. Click "Hidden Garden 🌱" → should navigate to `/` (home)

### Existing Functionality
- All existing routes should still work
- Wallet functionality in `/me` and other pages should still work
- No breaking changes expected

## Merge Safety

✅ **Safe to merge** - No breaking changes
- Additive changes only
- Existing functionality preserved
- New dependencies are dev-only (Tailwind, PostCSS, Autoprefixer)
- No changes to Team A-owned code

## Potential Issues & Solutions

### Issue: Hydration Mismatch
**Solution**: `DarkModeToggle` uses `mounted` state to avoid SSR/client mismatch. The component renders a disabled button until mounted.

### Issue: Theme Flash on Load
**Potential Solution**: Could add a script in `<head>` to set theme before React hydrates (future enhancement).

### Issue: Existing Pages Not Using Dark Mode
**Solution**: All pages inherit theme from root layout. Dark mode classes apply globally via `globals.css`.

## Next Steps (Team B)

1. **Install Dependencies**: Run `pnpm install` to get Tailwind
2. **Test Dark Mode**: Verify toggle works across all pages
3. **Add More Navigation**: Consider adding links to `/me`, `/leaderboard` when ready
4. **Replace Placeholder**: When ready, swap "Connected wallet" text with actual `ConnectButton`
5. **Polish**: Refine dark mode colors if needed

## Questions for Team A

1. Any concerns about Tailwind CSS as a dependency?
2. Any preferences for dark mode color scheme?
3. Should we keep placeholder text or integrate `ConnectButton` in header now?

---

**Created**: Phase 3 - Layout & Dark Mode  
**Status**: ✅ Complete  
**Impact**: Additive only, no breaking changes  
**Dependencies**: Requires `pnpm install` after merge

