# Screenshot Guide for Hidden Garden

This guide helps you capture high-quality screenshots of the Hidden Garden application for your GitHub repository.

## 🎯 Key Pages to Screenshot

### 1. Landing Page (`/`)

**What to capture:**
- Falling leaves animation in background
- "Hidden Garden" title with logo
- Tagline: "A privacy-preserving skill tree and leaderboard"
- Clean, centered layout

**Tips:**
- Wait for leaves animation to be visible
- Capture in both light and dark mode
- Ensure logo is clearly visible

### 2. Skill Forest Grid (`/skill-forest`)

**What to capture:**
- Grid of skill tiles (6 tiles visible)
- Each tile showing:
  - Skill name
  - Tree icon
  - Participant count
  - Privacy-based color gradient
- Legend showing privacy color meanings
- "Enter the Skill Forest" button

**Tips:**
- Scroll to show all tiles if needed
- Capture with legend visible
- Show hover state on one tile (optional)

### 3. Interactive Skill Forest (`/skill-forest/interactive`)

**What to capture:**
- Constellation visualization
- Skills clustered by privacy mode
- Center silver pine tree
- Connection lines
- Cluster background zones
- Zoom/pan controls visible

**Tips:**
- Zoom to show good detail
- Capture with a cluster info panel open (hover state)
- Show the legend at the bottom

### 4. Leaderboard (`/leaderboard/[skillId]`)

**What to capture:**
- Skill name header
- Leaderboard table with:
  - Rank numbers
  - User addresses/ENS names
  - Tier badges
  - Participant counts
- "Humans only" filter toggle
- Privacy disclaimer

**Tips:**
- Show at least 5-10 entries
- Include the filter toggle
- Capture with dark mode for contrast

### 5. My Garden (`/garden`)

**What to capture:**
- "My Garden" header
- Badges section
- Private Quest Completions
- Expandable skill sections
- Quest completion statuses

**Tips:**
- Expand at least one skill section
- Show both completed and in-progress quests
- Include the mock wallet indicator if using mock mode

### 6. Profile Page (`/profile/[address]`)

**What to capture:**
- User address/ENS name
- Public achievements list
- Skill names and tiers
- Reveal dates
- "Proof of Human" indicators

**Tips:**
- Use a profile with multiple achievements
- Show the profile header clearly
- Include privacy mode indicators

## 📐 Screenshot Specifications

### Recommended Settings

- **Resolution**: 1920x1080 or higher
- **Format**: PNG (for transparency) or JPG (for smaller file size)
- **Aspect Ratio**: 16:9 for wide screenshots, or match page content
- **Browser**: Chrome or Firefox (best DevTools support)

### Browser Window Size

For consistent screenshots:
- Set browser window to 1920x1080
- Use browser zoom at 100% (not zoomed in/out)
- Hide browser extensions that add UI elements

## 🛠️ Capture Methods

### Method 1: Chrome DevTools (Best Quality)

1. Open the page in Chrome
2. Press `F12` or `Cmd+Option+I` to open DevTools
3. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
4. Type "Capture node screenshot"
5. Click on the element you want to capture
6. Screenshot saves automatically

**Advantages:**
- Perfect pixel capture
- No browser UI elements
- Exact element boundaries
- High quality

### Method 2: Full Page Screenshot Extension

1. Install "Full Page Screen Capture" extension
2. Click extension icon
3. Select "Capture visible area" or "Capture full page"
4. Download the screenshot

**Extensions:**
- Full Page Screen Capture (Chrome)
- FireShot (Chrome/Firefox)
- Awesome Screenshot (Chrome/Firefox)

### Method 3: Manual Screenshot

**Mac:**
- `Cmd+Shift+4`: Select area
- `Cmd+Shift+3`: Full screen
- `Cmd+Shift+4` then `Space`: Capture window

**Windows:**
- `Win+Shift+S`: Snipping Tool
- `Print Screen`: Full screen
- `Alt+Print Screen`: Active window

**Linux:**
- `gnome-screenshot`: GUI tool
- `scrot`: Command line tool

## 🎨 Post-Processing Tips

### Before Uploading

1. **Crop**: Remove unnecessary browser UI
2. **Resize**: Keep original resolution or scale down proportionally
3. **Optimize**: Use tools like TinyPNG to reduce file size
4. **Annotate**: Add arrows or labels if needed (optional)

### Tools

- **Image Editing**: GIMP, Photoshop, Figma
- **Optimization**: TinyPNG, ImageOptim
- **Annotation**: Figma, Canva, Skitch

## 📁 File Naming Convention

Use descriptive names:

```
screenshot-landing-page.png
screenshot-skill-forest-grid.png
screenshot-interactive-forest.png
screenshot-leaderboard.png
screenshot-my-garden.png
screenshot-profile.png
```

Or organize in folders:

```
screenshots/
  ├── landing-page.png
  ├── skill-forest/
  │   ├── grid.png
  │   └── interactive.png
  ├── leaderboard.png
  ├── garden.png
  └── profile.png
```

## 🚀 Adding to GitHub

### Option 1: README Gallery

Add screenshots to your README:

```markdown
## Screenshots

### Landing Page
![Landing Page](./screenshots/landing-page.png)

### Skill Forest
![Skill Forest](./screenshots/skill-forest-grid.png)
```

### Option 2: Screenshots Directory

1. Create `screenshots/` directory in root
2. Add all screenshots there
3. Reference in README

### Option 3: GitHub Wiki

Create a "Screenshots" page in your repository wiki.

## ✅ Checklist

Before publishing:

- [ ] All key pages captured
- [ ] Screenshots are clear and readable
- [ ] Consistent styling (all light mode or all dark mode, or both)
- [ ] No sensitive data visible (mock data is fine)
- [ ] File sizes optimized (< 1MB each recommended)
- [ ] Proper file naming
- [ ] Screenshots added to README or screenshots directory

## 💡 Pro Tips

1. **Use Mock Wallet**: Enable mock wallet mode for consistent screenshots
2. **Clear Browser Cache**: Ensure you're seeing latest UI
3. **Disable Animations**: Temporarily disable CSS animations for static screenshots
4. **Multiple Views**: Capture both light and dark mode versions
5. **Responsive**: Consider capturing mobile views too (optional)

## 🎬 Animated GIFs (Optional)

For more dynamic presentations, consider creating animated GIFs:

- **Tools**: LICEcap, ScreenToGif, Kap
- **Use Cases**: 
  - Falling leaves animation
  - Interactive forest zoom/pan
  - Hover effects on tiles
  - Cluster info panel appearing

---

**Need help?** Open an issue or check the main README for more information.

