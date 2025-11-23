# Quick Start - Downloading Assets

## 📥 Download Logos

The logo files are ready to download:

1. **`logo.svg`** - Green seedling logo (for light backgrounds)
2. **`logo-white.svg`** - White seedling logo (for dark backgrounds)

Both are in the `assets/` directory and can be:
- Downloaded directly from GitHub
- Used in any design tool (Figma, Illustrator, etc.)
- Converted to PNG/JPG using online tools

## 🖼️ Generate Cover Image

1. Open `assets/generate-cover.html` in your browser
2. The cover image (1280x640px) will be displayed
3. **To capture:**
   - **Chrome/Edge**: Right-click the cover → Inspect → Right-click element → "Capture node screenshot"
   - **Firefox**: Use a screenshot extension
   - **Manual**: Take a screenshot of the browser window

4. Save as `cover.png` or `cover.jpg`

## 📸 Take Screenshots

### Quick Method (Chrome DevTools)

1. Start your app: `pnpm dev:web`
2. Navigate to the page you want (e.g., `http://localhost:3000`)
3. Open DevTools (F12)
4. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
5. Type "Capture node screenshot"
6. Click on the main content area
7. Screenshot saves automatically

### Recommended Pages to Screenshot

1. **Landing Page** (`/`)
2. **Skill Forest** (`/skill-forest`)
3. **Interactive Forest** (`/skill-forest/interactive`)
4. **Leaderboard** (`/leaderboard/[skillId]`)
5. **My Garden** (`/garden`)

See `screenshot-guide.md` for detailed instructions.

## 🚀 Add to GitHub

### Logo
1. Go to repository Settings → General
2. Scroll to "Social preview"
3. Upload `logo.svg` or a PNG version

### Cover Image
1. Upload `cover.png` to the root directory
2. Or add to `.github/` directory
3. GitHub will automatically use it for social previews

### Screenshots
1. Create a `screenshots/` directory
2. Add all screenshots there
3. Reference in README.md:

```markdown
## Screenshots

![Landing Page](./screenshots/landing-page.png)
![Skill Forest](./screenshots/skill-forest.png)
```

## 💡 Pro Tips

- **Enable Mock Wallet**: Makes screenshots consistent (no wallet popups)
- **Use Dark Mode**: Some screenshots look better in dark mode
- **Crop Browser UI**: Remove address bar, bookmarks, etc.
- **Optimize Images**: Use TinyPNG before uploading to reduce file size

## 🎨 Converting SVG to PNG

### Online (Easiest)
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Convertio](https://convertio.co/svg-png/)

### Command Line (ImageMagick)
```bash
convert assets/logo.svg -resize 256x256 assets/logo.png
```

### Inkscape
```bash
inkscape assets/logo.svg --export-filename=assets/logo.png --export-width=256
```

---

**All assets are ready in the `assets/` directory!**

