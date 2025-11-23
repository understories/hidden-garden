# Aztec Lab UI Implementation

**Date:** 2025-11-22  
**Purpose:** Developer testing UI for Aztec integration flow  
**Route:** `/dev/aztec-lab`

---

## Files Created

### 1. Page Component
**File:** `apps/aztecbat-ui/app/dev/aztec-lab/page.tsx`

- Client component using `useAccount` from wagmi
- Two main sections:
  - **Section 1: Skill Profile** - Tests `getSkillProfile()`
  - **Section 2: Reveal Tier** - Tests `publishAndFetchAztecBuilderLeaderboard()`
- Auto-fills address from connected wallet
- Displays JSON results and leaderboard table
- Minimal styling with inline styles

### 2. API Route: Skill Profile
**File:** `apps/aztecbat-ui/app/api/dev/skill-profile/route.ts`

- **Method:** GET
- **Query Parameters:**
  - `address` (required): User's Ethereum address
  - `chainId` (optional): Chain ID (default: 11155111 for Sepolia)
- **Returns:**
  - `{ ok: true, profile: SkillProfile }` on success
  - `{ ok: false, error: string }` on error
- **Environment Variables:**
  - `NEXT_PUBLIC_INDEXER_BASE_URL` (optional): Indexer service URL

### 3. API Route: Publish and Fetch
**File:** `apps/aztecbat-ui/app/api/dev/publish-and-fetch/route.ts`

- **Method:** POST
- **Body:**
  ```json
  {
    "address": "0x...",
    "chainId": 11155111,
    "minTier": 1,
    "minAverageScore": 60
  }
  ```
- **Returns:**
  - `{ ok: true, txHash, skillHash, leaderboard }` on success
  - `{ ok: false, error: string }` on error
- **Environment Variables:**
  - `NEXT_PUBLIC_USE_REAL_AZTEC` (optional): Set to "true" for real Aztec devnet
  - `NEXT_PUBLIC_PXE_URL` (optional): PXE URL for real Aztec (default: http://localhost:8080)
  - `INDEXER_BASE_URL` or `NEXT_PUBLIC_INDEXER_BASE_URL`: Indexer service URL
  - `SERVER_PRIVATE_KEY` (optional): Private key for real signer in production
  - `RPC_URL` (optional): RPC URL for signer provider

---

## Current Mode: MOCK

The `/api/dev/publish-and-fetch` route currently operates in **MOCK mode** by default:

- Uses `MockAztecClient` (no real Aztec devnet required)
- Uses a mock signer (Hardhat default private key)
- Transactions are simulated, not actually sent to L1
- Works without any external services running

This allows developers to test the flow end-to-end without setting up:
- Aztec devnet
- L1 RPC connection
- Real wallet/signer
- Indexer service

---

## Switching to Real Aztec Devnet Mode

To enable real Aztec devnet integration:

### 1. Set Environment Variables

Create or update `.env.local` in `apps/aztecbat-ui/`:

```bash
# Enable real Aztec mode
NEXT_PUBLIC_USE_REAL_AZTEC=true

# PXE URL (Aztec devnet)
NEXT_PUBLIC_PXE_URL=http://localhost:8080

# Indexer service (if available)
NEXT_PUBLIC_INDEXER_BASE_URL=http://localhost:4000

# Server-side signer (for API route)
SERVER_PRIVATE_KEY=0x...your_private_key_here...
RPC_URL=http://localhost:8545  # Or your L1 RPC URL
```

### 2. Start Required Services

```bash
# Terminal 1: Start Aztec devnet
pnpm aztec:devnet

# Terminal 2: Start indexer (if using)
cd services/indexer
RPC_URL=http://localhost:8545 pnpm dev

# Terminal 3: Start UI
pnpm dev:web
```

### 3. Update API Route Code

The route will automatically detect `NEXT_PUBLIC_USE_REAL_AZTEC=true` and:
- Use `RealAztecClient` instead of `MockAztecClient`
- Use real signer from `SERVER_PRIVATE_KEY` if provided
- Actually submit transactions to L1

**Note:** The route currently uses a server-side signer pattern. For production, you may want to:
- Accept a signed transaction from the client
- Use a dedicated service account
- Implement proper authentication/authorization

---

## Testing the UI

### 1. Start Development Server

```bash
pnpm dev:web
```

### 2. Navigate to Aztec Lab

Visit: `http://localhost:3000/dev/aztec-lab`

### 3. Test Skill Profile

1. Enter an address (or use connected wallet)
2. Set chain ID (default: 11155111)
3. Click "Load Skill Profile"
4. Verify JSON response shows:
   - `humanVerified`: boolean
   - `aztecBuilderTier`: number | null
   - `aztecBuilderSkillHash`: string
   - `externalBadges`: array
   - `allowAgents`: boolean

### 4. Test Reveal Tier (Mock Mode)

1. Enter address, chain ID, minTier (1), minAverageScore (60)
2. Click "Reveal Tier + Fetch Leaderboard"
3. In mock mode, you should see:
   - Mock transaction hash
   - Skill hash
   - Empty leaderboard (or mock entries if indexer is running)

### 5. Test Reveal Tier (Real Mode)

**Prerequisites:**
- Aztec devnet running
- Indexer service running (optional, for leaderboard)
- `NEXT_PUBLIC_USE_REAL_AZTEC=true` set
- Valid `SERVER_PRIVATE_KEY` set

1. Follow steps above
2. Should see real transaction hash
3. Leaderboard should populate after indexer ingests event

---

## API Route Console Logging

Both API routes include detailed console logging for debugging:

- `[skill-profile]` prefix for skill profile route
- `[publish-and-fetch]` prefix for publish route
- Logs include: request parameters, mode detection, success/error states

Check server console (where `pnpm dev:web` is running) for detailed logs.

---

## Error Handling

### Skill Profile Route
- **400:** Missing or invalid `address` or `chainId`
- **500:** Error from `getSkillProfile()` (e.g., unsupported chain, RPC error)

### Publish and Fetch Route
- **400:** Missing or invalid request body fields
- **500:** Error from `publishAndFetchAztecBuilderLeaderboard()` (e.g., SBT check fails, indexer timeout)

All errors return JSON: `{ ok: false, error: "message" }`

---

## Integration Points

### For UI Team

The Aztec Lab demonstrates how to:

1. **Call `getSkillProfile()`:**
   - Via API route: `GET /api/dev/skill-profile?address=...&chainId=...`
   - Or directly in client component (if you have provider access)

2. **Call `publishAndFetchAztecBuilderLeaderboard()`:**
   - Via API route: `POST /api/dev/publish-and-fetch` with JSON body
   - Requires server-side signer (or client-side signing pattern)

3. **Handle responses:**
   - Skill profile: Display `humanVerified`, `aztecBuilderTier`, badges
   - Leaderboard: Render table with rank, address, tier, ENS name

### For Backend Team

The API routes show:
- How to create signers server-side
- How to switch between mock/real Aztec clients
- How to handle environment variables
- Error handling patterns

---

## Future Improvements

1. **Client-Side Signing:**
   - Accept signed transactions from client wallet
   - Remove need for server-side private key

2. **Real-Time Updates:**
   - WebSocket connection to indexer
   - Auto-refresh leaderboard when new entries appear

3. **Better Error Messages:**
   - More specific error types
   - User-friendly error messages

4. **Transaction Status:**
   - Show transaction confirmation status
   - Link to block explorer

---

## Summary

**Files Created:**
1. `apps/aztecbat-ui/app/dev/aztec-lab/page.tsx` - Main UI page
2. `apps/aztecbat-ui/app/api/dev/skill-profile/route.ts` - Skill profile API
3. `apps/aztecbat-ui/app/api/dev/publish-and-fetch/route.ts` - Publish and fetch API

**How to Switch to Real Aztec:**
1. Set `NEXT_PUBLIC_USE_REAL_AZTEC=true`
2. Set `NEXT_PUBLIC_PXE_URL` to your PXE URL
3. Set `SERVER_PRIVATE_KEY` for signer (or implement client-side signing)
4. Start Aztec devnet: `pnpm aztec:devnet`
5. Start indexer (optional): `cd services/indexer && pnpm dev`

**Current Status:**
- ✅ All files created
- ✅ Mock mode working (no external services required)
- ✅ Real mode ready (requires environment setup)
- ✅ Console logging for debugging
- ✅ Error handling implemented

