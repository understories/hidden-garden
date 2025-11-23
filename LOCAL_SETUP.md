# Local Setup Guide

Quick guide to run the Hidden Garden app locally.

## Prerequisites

1. **Node.js 20+** (required for Next.js 16)
   ```bash
   # Using nvm (recommended)
   nvm install 20
   nvm use 20
   
   # Verify
   node --version  # Should be v20.x.x
   ```

2. **pnpm** (package manager)
   ```bash
   npm install -g pnpm@10.23.0
   # or
   corepack enable
   corepack prepare pnpm@10.23.0 --activate
   ```

## Installation

1. **Install dependencies:**
   ```bash
   cd /Users/knobs/Documents/GitHub/hidden-garden
   pnpm install
   ```

   This may take a few minutes. You might see some warnings about peer dependencies - these are expected and won't prevent the app from running.

## Running the App

### Start the Development Server

```bash
# Make sure you're using Node 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20

# Start the dev server
pnpm dev:web
```

The server will start on **http://localhost:3000**

### Access the App

- **Home page:** http://localhost:3000
- **My Garden:** http://localhost:3000/me
- **Public Profile:** http://localhost:3000/u/[address-or-ens]
- **Leaderboard:** http://localhost:3000/leaderboard/[skillName]

## Environment Variables (Optional)

The app works with defaults, but you can customize:

Create `apps/aztecbat-ui/.env.local`:

```bash
# RPC URLs (optional - defaults provided)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.sepolia.org
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth.llamarpc.com

# Indexer API (optional - for leaderboard data)
NEXT_PUBLIC_INDEXER_URL=http://localhost:4000

# Aztec Integration (optional - for quest features)
NEXT_PUBLIC_USE_REAL_AZTEC=false
NEXT_PUBLIC_PXE_URL=http://localhost:8080
```

## Troubleshooting

### "Module not found: Can't resolve 'fs'"

**Fixed!** The `aztecClient.ts` file now uses conditional imports for Node.js modules. If you still see this error:

1. Make sure `next.config.js` has the webpack config (already updated)
2. Restart the dev server: `pnpm dev:web`

### "Node version too old"

Next.js 16 requires Node.js >= 20.9.0:

```bash
nvm install 20
nvm use 20
```

### "Port 3000 already in use"

Kill the process on port 3000:

```bash
lsof -ti:3000 | xargs kill -9
```

Or use a different port:

```bash
PORT=3001 pnpm dev:web
```

### "Cannot find module '@hidden-garden/core-logic'"

Make sure dependencies are installed:

```bash
pnpm install
```

### Build Errors

If you see build errors, try:

```bash
# Clean and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

## What's Fixed

1. ✅ **Node.js modules in client bundle** - Fixed by making `fs` and `path` imports conditional
2. ✅ **Next.js webpack config** - Updated to exclude Node.js modules from client bundle
3. ✅ **Dependencies** - All packages properly linked via workspace

## Next Steps

Once the server is running:

1. **Connect a wallet** - Use MetaMask or another injected wallet
2. **Visit `/me`** - See your skill garden
3. **Try features:**
   - Self verification (opens docs for now)
   - Skill reveal (requires wallet connection)
   - View public profile

## Need Help?

- Check the browser console for errors
- Check the terminal for build errors
- Verify Node.js version: `node --version`
- Verify pnpm: `pnpm --version`

---

**Last Updated:** Local Setup Guide  
**Status:** Ready to run

