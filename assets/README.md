# Hidden Garden - Brand Assets

This directory contains downloadable assets for the Hidden Garden project.

## 📦 Available Assets

### Logos

- **`logo.svg`** - Main logo with green seedling (for light backgrounds)
- **`logo-white.svg`** - White version of logo (for dark backgrounds)

Both logos are scalable SVG files that can be resized without quality loss.

### Cover Image Generator

- **`generate-cover.html`** - Interactive HTML page to generate GitHub social preview image (1280x640px)

## 🎨 Logo Usage

### Recommended Sizes

- **Small**: 32x32px (favicon, small icons)
- **Medium**: 64x64px (app icons, buttons)
- **Large**: 128x128px (profile images)
- **Extra Large**: 256x256px (cover images, headers)

### Color Variants

- **Green** (`logo.svg`): Use on light backgrounds, white backgrounds, or when you want the brand color
- **White** (`logo-white.svg`): Use on dark backgrounds, gradients, or when you need high contrast

## 📸 Screenshots

To capture screenshots of the application:

### Method 1: Browser DevTools (Recommended)

1. Open the app in your browser (e.g., `http://localhost:3000`)
2. Open DevTools (F12 or Cmd+Option+I)
3. Navigate to the page you want to screenshot
4. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
5. Type "Capture node screenshot" and select it
6. The screenshot will be saved automatically

### Method 2: Browser Extension

Install a browser extension like:
- **Full Page Screen Capture** (Chrome/Edge)
- **FireShot** (Chrome/Firefox)
- **Awesome Screenshot** (Chrome/Firefox)

### Method 3: Manual Screenshot

- **Mac**: `Cmd+Shift+4` (select area) or `Cmd+Shift+3` (full screen)
- **Windows**: `Win+Shift+S` (Snipping Tool) or `Print Screen`
- **Linux**: Use `gnome-screenshot` or `scrot`

### Recommended Screenshots

Capture these key pages for your GitHub repository:

1. **Landing Page** (`/`)
   - Shows the falling leaves animation
   - Main title and tagline
   - Clean, welcoming first impression

2. **Skill Forest** (`/skill-forest`)
   - Grid of skill tiles
   - Privacy-based color coding
   - Legend showing privacy modes

3. **Interactive Skill Forest** (`/skill-forest/interactive`)
   - Constellation visualization
   - Clustered skills
   - Center silver tree
   - Zoom/pan controls

4. **Leaderboard** (`/leaderboard/[skillId]`)
   - Skill leaderboard table
   - Participant rankings
   - Privacy indicators

5. **My Garden** (`/garden`)
   - User's private progress
   - Skill tree visualization
   - Quest completions

6. **Profile Page** (`/profile/[address]`)
   - Public profile view
   - Revealed achievements
   - User stats

## 🖼️ Cover Image Generation

### Using the HTML Generator

1. Open `generate-cover.html` in your browser
2. The cover image will be displayed at 1280x640px
3. Use browser DevTools to capture:
   - Right-click on the cover container
   - Select "Capture node screenshot"
   - Save as `cover.png` or `cover.jpg`

### Manual Creation

If you prefer to create a custom cover image:

- **Dimensions**: 1280x640px (GitHub social preview standard)
- **Format**: PNG or JPG
- **Content**: Logo, project name, tagline, key features
- **Style**: Match the app's Ghibli-inspired aesthetic

## 📋 Asset Checklist

Before publishing to GitHub, ensure you have:

- [ ] Logo in SVG format (green and white variants)
- [ ] Cover image (1280x640px) for social preview
- [ ] Screenshot of landing page
- [ ] Screenshot of Skill Forest
- [ ] Screenshot of Interactive Skill Forest
- [ ] Screenshot of Leaderboard
- [ ] Screenshot of Profile/My Garden

## 🎯 GitHub Repository Settings

After generating assets:

1. **Logo**: Upload to repository settings → General → Social preview
2. **Cover Image**: Upload as `cover.png` in root or `.github/` directory
3. **Screenshots**: Add to README.md or create a `screenshots/` directory

## 🔧 Converting SVG to Other Formats

If you need PNG or other formats:

### Using Online Tools
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Convertio](https://convertio.co/svg-png/)

### Using Command Line (ImageMagick)
```bash
convert logo.svg -resize 256x256 logo.png
```

### Using Inkscape
```bash
inkscape logo.svg --export-filename=logo.png --export-width=256
```

## 📝 License

These assets are part of the Hidden Garden project and follow the same license terms.

