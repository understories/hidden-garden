# Vercel Deployment Checklist

This document contains all dependencies, configurations, and requirements needed to deploy the Hidden Garden application to Vercel.

## 📦 Package Manager

- **Package Manager**: `pnpm@10.23.0`
- **Workspace**: Monorepo using pnpm workspaces
- **Lock File**: `pnpm-lock.yaml` (must be committed)

## 🔧 Build Configuration

### Root Package.json Dependencies

```json
{
  "dependencies": {
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.6",
    "@types/react-dom": "^19.2.3",
    "next": "^16.0.3",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "typescript": "^5.9.3"
  },
  "devDependencies": {
    "ethers": "^6.15.0",
    "ts-node": "^10.9.2",
    "turbo": "^2.6.1"
  }
}
```

### App Package (`apps/aztecbat-ui/package.json`) Dependencies

```json
{
  "dependencies": {
    "@hidden-garden/core-logic": "workspace:*",
    "@hidden-garden/game-engine": "workspace:*",
    "@tanstack/react-query": "^5.90.10",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.6",
    "@types/react-dom": "^19.2.3",
    "@wagmi/core": "^3.0.0",
    "ethers": "^6.0.0",
    "next": "^16.0.3",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "viem": "^2.39.3",
    "wagmi": "^3.0.1"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.17"
  }
}
```

## 🏗️ Build Settings for Vercel

### Project Settings

1. **Framework Preset**: Next.js
2. **Root Directory**: `apps/aztecbat-ui`
3. **Build Command**: `pnpm build` (or `cd apps/aztecbat-ui && pnpm build`)
4. **Output Directory**: `.next` (default for Next.js)
5. **Install Command**: `pnpm install` (from root)
6. **Node.js Version**: `20.x` (recommended, check `nvm` or `.nvmrc` if exists)

### Vercel Configuration

Create `vercel.json` in the root directory (optional, for advanced config):

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev:web",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": "apps/aztecbat-ui/.next"
}
```

**OR** configure in Vercel Dashboard:
- **Build Command**: `pnpm build --filter @hidden-garden/aztecbat-ui`
- **Install Command**: `pnpm install`
- **Root Directory**: Leave empty (monorepo root)

## 📁 Required Files & Configurations

### Essential Configuration Files

1. **`pnpm-workspace.yaml`** (root)
   ```yaml
   packages:
     - 'apps/*'
     - 'packages/*'
     - 'services/*'
     - 'playground'
     - 'zk/*'
   ```

2. **`apps/aztecbat-ui/next.config.js`**
   - Contains webpack configuration for:
     - Node.js module exclusions (fs, path, crypto)
     - Optional wagmi connector dependencies ignored
   - **Must be present** for build to succeed

3. **`apps/aztecbat-ui/tailwind.config.js`**
   - Tailwind CSS configuration
   - Includes Quicksand font family

4. **`apps/aztecbat-ui/postcss.config.cjs`**
   - PostCSS configuration for Tailwind
   - Must be `.cjs` extension (not `.js`)

5. **`apps/aztecbat-ui/tsconfig.json`**
   - TypeScript configuration
   - Extends `tsconfig.base.json`
   - Path alias: `@/*` → `./*`

6. **`tsconfig.base.json`** (root)
   - Base TypeScript configuration for monorepo

### Workspace Dependencies

The app depends on these workspace packages (must be built):
- `@hidden-garden/core-logic` (in `packages/core-logic/`)
- `@hidden-garden/game-engine` (in `packages/game-engine/`)

These are referenced as `workspace:*` in package.json and must be available during build.

## 🌐 External Dependencies

### Google Fonts (Runtime)

- **Quicksand**: Loaded from Google Fonts CDN
- URL: `https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap`
- Loaded in `apps/aztecbat-ui/app/globals.css`
- No build-time dependency, but must be accessible at runtime

## 🔐 Environment Variables

**Currently**: No environment variables are required for the UI build.

If you need to add environment variables later:
- Add them in Vercel Dashboard → Project Settings → Environment Variables
- Or create `.env.local` (not committed, add to `.gitignore`)

## 🚀 Build Process

### Local Build (for testing)

```bash
# From root directory
pnpm install
pnpm build --filter @hidden-garden/aztecbat-ui
```

### Vercel Build Process

1. **Install**: `pnpm install` (installs all workspace dependencies)
2. **Build**: `pnpm build --filter @hidden-garden/aztecbat-ui` or `cd apps/aztecbat-ui && pnpm build`
3. **Output**: `.next` directory in `apps/aztecbat-ui/`

## ⚠️ Important Notes

### Webpack Configuration

The `next.config.js` includes special webpack configuration to:
- Exclude Node.js modules (`fs`, `path`, `crypto`) from client bundle
- Ignore optional wagmi connector dependencies that aren't needed for MVP

**This configuration is critical** - without it, the build will fail with module resolution errors.

### Turbopack vs Webpack

- **Dev command uses**: `--webpack` flag (see `package.json`: `"dev": "next dev --webpack"`)
- **Build uses**: Webpack (default for Next.js 16)
- Vercel will use the build command, which defaults to webpack

### Monorepo Considerations

- Vercel needs to understand the monorepo structure
- Workspace dependencies must be resolved correctly
- Consider using Vercel's monorepo support or configure root directory

## 📋 Pre-Deployment Checklist

- [ ] `pnpm-lock.yaml` is committed to repository
- [ ] All workspace packages are present (`packages/core-logic`, `packages/game-engine`)
- [ ] `next.config.js` is present in `apps/aztecbat-ui/`
- [ ] `postcss.config.cjs` is present (note `.cjs` extension)
- [ ] `tailwind.config.js` is present
- [ ] `tsconfig.json` files are present
- [ ] No `.env` files are committed (check `.gitignore`)
- [ ] Google Fonts CDN is accessible (no firewall blocking)
- [ ] All TypeScript types compile without errors
- [ ] Build succeeds locally: `pnpm build --filter @hidden-garden/aztecbat-ui`

## 🔍 Troubleshooting

### Common Issues

1. **"Module not found: Can't resolve 'fs'"**
   - Ensure `next.config.js` webpack config is present
   - Check that Node.js modules are excluded from client bundle

2. **"Cannot find module '@hidden-garden/core-logic'"**
   - Ensure workspace packages are built
   - Check `pnpm-workspace.yaml` is correct
   - Verify `pnpm install` runs from root

3. **"PostCSS Configuration Error"**
   - Ensure `postcss.config.cjs` uses `.cjs` extension
   - Check that `tailwindcss` and `autoprefixer` are in devDependencies

4. **"Tailwind classes not working"**
   - Verify `tailwind.config.js` content paths are correct
   - Check `globals.css` imports Tailwind directives

5. **"Font not loading"**
   - Check Google Fonts CDN is accessible
   - Verify `globals.css` has the `@import` statement

## 📝 Vercel Project Settings Summary

```
Framework Preset: Next.js
Root Directory: (leave empty for monorepo, or set to apps/aztecbat-ui)
Build Command: pnpm build --filter @hidden-garden/aztecbat-ui
Install Command: pnpm install
Output Directory: apps/aztecbat-ui/.next (if root dir is set) or .next (if root dir is apps/aztecbat-ui)
Node.js Version: 20.x
```

## 🔗 Related Documentation

- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel Monorepo Guide: https://vercel.com/docs/monorepos
- pnpm Workspaces: https://pnpm.io/workspaces

