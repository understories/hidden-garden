# Falling Leaves Animation - Step-by-Step Plan

## Overview
Create an 8-bit neon style falling leaves animation for the landing page background, with leaves colored according to skill-tree privacy modes and sized based on data types.

## Step-by-Step Logic

### Step 1: Create Test Route
- Create `/test` route (`app/test/page.tsx`)
- Simple page to preview the animation before applying to landing page
- Include the falling leaves component

### Step 2: Create FallingLeaves Component Structure
- Component: `components/FallingLeaves.tsx`
- Client component (`'use client'`)
- Uses React hooks for animation state

### Step 3: Define Data Model for Leaves
- Each leaf represents a skill/data point
- Properties:
  - `id`: unique identifier
  - `privacyMode`: 'public-heavy' | 'mixed' | 'mostly-private'
  - `size`: based on participant count or skill type (sm/md/lg)
  - `startX`: random horizontal position (0-100%)
  - `delay`: animation delay (0-10s)
  - `duration`: fall duration (10-20s)
  - `rotation`: random rotation angle
  - `drift`: horizontal drift amount

### Step 4: Map Privacy Modes to 8-bit Neon Colors
- **Public-heavy**: Bright neon emerald/cyan (#00ff88, #00ffff)
- **Mixed**: Bright neon amber/orange (#ffaa00, #ff6600)
- **Mostly-private**: Bright neon blue/purple (#0066ff, #aa00ff)
- Use CSS filters for neon glow effect (drop-shadow, text-shadow)
- Pixelated/8-bit aesthetic via `image-rendering: pixelated` or similar

### Step 5: Generate Mock Leaf Data
- Generate 30-50 leaves
- Distribute privacy modes (mix of all three)
- Size distribution:
  - Small (sm): < 500 participants → 8px × 8px
  - Medium (md): 500-1000 participants → 12px × 12px
  - Large (lg): > 1000 participants → 16px × 16px

### Step 6: Create 8-bit Leaf SVG Shapes
- Simple pixelated leaf shapes (not organic)
- Options:
  - Square/rectangular pixels
  - Diamond shape (rotated square)
  - Simple 8-bit leaf silhouette (blocky, pixelated)
- Use inline SVG with `image-rendering: pixelated` or `crisp-edges`

### Step 7: Implement Falling Animation
- CSS keyframes animation:
  - Start: `translateY(-100vh)` (above viewport)
  - End: `translateY(100vh)` (below viewport)
  - Include horizontal drift (`translateX`)
  - Include rotation (`rotate`)
- Each leaf has unique:
  - Animation duration (10-20s)
  - Delay (0-10s)
  - Horizontal position
  - Rotation speed

### Step 8: Add Neon Glow Effects
- CSS filters for neon glow:
  - `filter: drop-shadow(0 0 4px currentColor) drop-shadow(0 0 8px currentColor)`
  - Bright, saturated colors
  - Glow intensity varies by privacy mode

### Step 9: Implement Pixelated/8-bit Style
- CSS properties:
  - `image-rendering: pixelated` or `crisp-edges`
  - `image-rendering: -moz-crisp-edges`
  - `image-rendering: crisp-edges`
- Sharp, blocky edges (no anti-aliasing)
- Retro game aesthetic

### Step 10: Optimize Performance
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid layout-triggering properties
- Use `will-change: transform` for animated elements
- Limit number of leaves (30-50 max)

### Step 11: Respect prefers-reduced-motion
- If `prefers-reduced-motion: reduce`:
  - Disable animations
  - Show static leaves or minimal movement
  - Use `@media (prefers-reduced-motion: reduce)`

### Step 12: Test on `/test` Route
- Render component on test page
- Verify:
  - Colors match skill-tree scheme
  - Leaves fall smoothly
  - Sizes vary correctly
  - Neon glow is visible
  - 8-bit pixelated style works
  - Performance is acceptable
  - Dark mode compatibility

### Step 13: Apply to Landing Page
- Once tested, replace or complement `IvyBackground` on landing page
- Ensure it doesn't conflict with existing content
- Maintain z-index hierarchy (background behind content)

## Technical Implementation Details

### Color Palette (8-bit Neon)
```css
/* Public-heavy (Spring canopy) */
--neon-emerald: #00ff88;
--neon-cyan: #00ffff;

/* Mixed (Autumn blend) */
--neon-amber: #ffaa00;
--neon-orange: #ff6600;

/* Mostly-private (Moonlit branches) */
--neon-blue: #0066ff;
--neon-purple: #aa00ff;
```

### Animation Keyframes
```css
@keyframes fall {
  0% {
    transform: translateY(-100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(var(--drift)) rotate(360deg);
    opacity: 0;
  }
}
```

### Leaf Size Mapping
- Small: 8px × 8px (participants < 500)
- Medium: 12px × 12px (500 ≤ participants < 1000)
- Large: 16px × 16px (participants ≥ 1000)

## Files to Create/Modify

1. `app/test/page.tsx` - Test route
2. `components/FallingLeaves.tsx` - Main component
3. `app/page.tsx` - Update landing page (after testing)

## Constraints

- No external animation libraries (pure CSS/React)
- Must work in dark mode
- Must respect prefers-reduced-motion
- Performance: 60fps target
- Mobile-friendly (reduce leaf count on small screens)

