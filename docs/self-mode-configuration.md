# Self Mode Configuration

**Purpose:** Support dev mode for Self SBT integration, allowing use of test/dev SBT contracts instead of production Self SBT.

---

## Environment Variables

### Frontend (Next.js)

Add to `apps/aztecbat-ui/.env.local`:

```bash
# Self SBT Mode
# Set to "dev" to use a dev/test SBT contract
# Set to "real" (or omit) to use production Self SBT
NEXT_PUBLIC_SELF_MODE=dev

# Dev SBT Contract Address (only used when SELF_MODE=dev)
# This should be the address of a test/deployed SelfHumanSBT contract
# For local Hardhat, this is typically the deployed SelfHumanSBT address
NEXT_PUBLIC_DEV_SELF_SBT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

### Backend/Server

For server-side code (API routes, scripts), you can also use:

```bash
# Server-side (Node.js) environment variables
SELF_MODE=dev
DEV_SELF_SBT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

---

## How It Works

The `getSelfHumanSBTAddress()` function in `packages/core-logic/src/contracts.ts` checks:

1. **If `SELF_MODE=dev`:**
   - Uses `NEXT_PUBLIC_DEV_SELF_SBT_ADDRESS` (or `DEV_SELF_SBT_ADDRESS` for server-side)
   - Returns this address regardless of chainId
   - Falls back to `CHAINS[chainId].selfHumanSBT` if dev address not set

2. **If `SELF_MODE=real` (or not set):**
   - Uses real Self SBT address from `CHAINS[chainId].selfHumanSBT`
   - Falls back to `REAL_SELF_SBT_ADDRESSES[chainId]` if not in CHAINS

---

## Example Usage

### Dev Mode (Local Testing)

```bash
# .env.local
NEXT_PUBLIC_SELF_MODE=dev
NEXT_PUBLIC_DEV_SELF_SBT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

```typescript
import { getSelfHumanSBTAddress } from '@hidden-garden/core-logic';

// Will return 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
// regardless of chainId
const sbtAddress = getSelfHumanSBTAddress(11155111);
```

### Real Mode (Production)

```bash
# .env.local (or omit SELF_MODE)
NEXT_PUBLIC_SELF_MODE=real
# NEXT_PUBLIC_DEV_SELF_SBT_ADDRESS not needed
```

```typescript
import { getSelfHumanSBTAddress } from '@hidden-garden/core-logic';

// Will return address from CHAINS[11155111].selfHumanSBT
// or REAL_SELF_SBT_ADDRESSES[11155111]
const sbtAddress = getSelfHumanSBTAddress(11155111);
```

---

## Implementation Details

**File:** `packages/core-logic/src/contracts.ts`

**Function:** `getSelfHumanSBTAddress(chainId: SupportedChainId)`

**Logic:**
1. Check `process.env.NEXT_PUBLIC_SELF_MODE` or `process.env.SELF_MODE`
2. If `=== 'dev'`:
   - Read `process.env.NEXT_PUBLIC_DEV_SELF_SBT_ADDRESS` or `process.env.DEV_SELF_SBT_ADDRESS`
   - Return dev address if set
   - Fall back to `CHAINS[chainId].selfHumanSBT` with warning
3. Otherwise (real mode):
   - Return `CHAINS[chainId].selfHumanSBT` if available
   - Fall back to `REAL_SELF_SBT_ADDRESSES[chainId]`

**Note:** The function works in both browser (Next.js client) and Node.js (server/API routes) environments.

---

## Updating Real Self SBT Addresses

When real Self SBT contracts are deployed, update `REAL_SELF_SBT_ADDRESSES` in `contracts.ts`:

```typescript
const REAL_SELF_SBT_ADDRESSES: Partial<Record<SupportedChainId, Address>> = {
  11155111: '0x...' as Address, // Sepolia
  1: '0x...' as Address, // Mainnet
};
```

Or update `CHAINS` configuration:

```typescript
export const CHAINS: Record<SupportedChainId, ChainConfig> = {
  11155111: {
    chainId: 11155111,
    name: 'Sepolia',
    selfHumanSBT: '0x...' as Address, // Real Self SBT address
    // ...
  },
};
```

---

## Testing

### Test Dev Mode

1. Set environment variables:
   ```bash
   NEXT_PUBLIC_SELF_MODE=dev
   NEXT_PUBLIC_DEV_SELF_SBT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
   ```

2. Call `getSelfHumanSBTAddress(anyChainId)` - should return dev address

3. Verify in Aztec Lab UI:
   - Load skill profile
   - Check that SBT verification uses dev address

### Test Real Mode

1. Set environment variables:
   ```bash
   NEXT_PUBLIC_SELF_MODE=real
   # or omit NEXT_PUBLIC_SELF_MODE
   ```

2. Call `getSelfHumanSBTAddress(chainId)` - should return address from CHAINS

3. Verify it uses production Self SBT contract

---

## Migration Notes

- **Default behavior:** If `SELF_MODE` is not set, function behaves as before (uses `CHAINS[chainId].selfHumanSBT`)
- **Backward compatible:** Existing code continues to work without changes
- **Dev mode override:** When `SELF_MODE=dev`, dev address takes precedence over chain-specific addresses

---

**Last Updated:** 2025-11-22

