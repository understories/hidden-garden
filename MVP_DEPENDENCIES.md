# MVP Dependencies - Simplified Setup

This document explains what dependencies are actually needed for the MVP and what has been removed/ignored.

## Core Dependencies (Required)

### Wallet Integration
- **wagmi** (^3.0.1) - React hooks for Ethereum
- **@wagmi/core** (^3.0.0) - Core wagmi functionality
- **viem** (^2.39.3) - Ethereum library
- **@tanstack/react-query** (^5.90.10) - Required by wagmi for state management

### Connector Used
- **injected()** - Only connector used (browser wallet via `window.ethereum`)
  - Works with MetaMask, Coinbase Wallet, Brave, etc.
  - No additional SDK dependencies required
  - Simplest setup for MVP

### Wagmi Hooks Used
- `useAccount` - Get connected wallet address
- `useConnect` - Connect wallet
- `useDisconnect` - Disconnect wallet
- `useWriteContract` - Write to contracts
- `useWaitForTransactionReceipt` - Wait for transaction confirmation
- `useReadContract` - Read from contracts (for SBT checks)
- `useChainId` - Get current chain ID

## Optional Dependencies (Ignored)

The following dependencies are **NOT installed** and are ignored via webpack config:

- `@base-org/account` - Base account connector (not needed)
- `@coinbase/wallet-sdk` - Coinbase Wallet SDK (not needed, injected() works)
- `@gemini-wallet/core` - Gemini wallet connector (not needed)
- `@metamask/sdk` - MetaMask SDK (not needed, injected() works)
- `@walletconnect/ethereum-provider` - WalletConnect (not needed for MVP)
- `@walletconnect/modal` - WalletConnect modal (not needed)
- `@walletconnect/types` - WalletConnect types (not needed)
- `@safe-global/safe-apps-sdk` - Safe wallet SDK (not needed)
- `@safe-global/safe-apps-provider` - Safe wallet provider (not needed)
- `porto` - Porto wallet connector (not needed)

## Why This Works

1. **injected() connector** works with any browser extension that provides `window.ethereum`
2. **No SDK required** - Browser extensions handle all the wallet logic
3. **Webpack ignores** optional dependencies that wagmi tries to dynamically import
4. **Minimal setup** - Only what's needed for MVP functionality

## Configuration

### next.config.js
- Uses webpack (not Turbopack) for better control
- Ignores Node.js modules (`fs`, `path`, `crypto`) in client bundle
- Uses `IgnorePlugin` to prevent webpack from resolving optional wagmi dependencies

### walletConfig.ts
- Only configures `injected()` connector
- Uses Sepolia testnet
- Simple HTTP transport

## Node.js Version

- **Node.js 20.19.5** (required for Next.js 16)
- Verified and set via nvm

## Running the App

```bash
# Ensure Node 20 is active
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20

# Start dev server
pnpm dev:web
```

The app will be available at http://localhost:3000

---

**Last Updated:** MVP Dependencies Setup  
**Status:** ✅ Working with minimal dependencies

