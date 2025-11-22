# Phase 3: Codebase Reconnaissance Report

This document catalogs all existing code, contracts, APIs, and setup that Team B can reuse for Phase 3 implementation.

## 1. Smart Contract ABIs & Addresses

### SelfHumanSBT Contract

**Location:** `packages/core-logic/src/contracts.ts`

**ABI Export:** `SelfHumanSBTAbi`
```typescript
export const SelfHumanSBTAbi = [
  {
    name: 'verifyAndMint',
    inputs: [
      { name: 'proofPayload', type: 'bytes' },
      { name: 'userContextData', type: 'bytes' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    name: 'hasValidSBT',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    name: 'ownerOf',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    name: 'balanceOf',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;
```

**Address Functions:**
- `getSelfHumanSBTAddress(chainId: SupportedChainId): Address | undefined`
- `SELF_HUMAN_SBT_ADDRESS` (deprecated, local dev only)

**Contract Addresses:**
- **Local (Hardhat) - Chain ID 31337:**
  - `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- **Sepolia - Chain ID 11155111:**
  - Not yet deployed (TODO in code)

**Also Exported From:**
- `packages/common/src/index.ts` - Re-exports all contract utilities

**Contract Source:**
- `packages/contracts-public/contracts/SelfHumanSBT.sol`

---

### SkillLeaderboard Contract

**Location:** `packages/core-logic/src/contracts.ts`

**ABI Export:** `SkillLeaderboardAbi`
```typescript
export const SkillLeaderboardAbi = [
  {
    name: 'submitSkillTier',
    inputs: [
      { name: 'skillHash', type: 'bytes32' },
      { name: 'tier', type: 'uint8' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    name: 'submitSkillTierWithProof',
    inputs: [
      { name: 'skillHash', type: 'bytes32' },
      { name: 'minLevel', type: 'uint8' },
      { name: 'proof', type: 'bytes' },
      { name: 'publicInputs', type: 'bytes' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    name: 'skillTier',
    inputs: [
      { name: '', type: 'bytes32' },
      { name: '', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    name: 'SkillRevealed',
    type: 'event',
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: true, name: 'skillHash', type: 'bytes32' },
      { indexed: false, name: 'tier', type: 'uint8' },
    ],
  },
] as const;
```

**Address Functions:**
- `getSkillLeaderboardAddress(chainId: SupportedChainId): Address | undefined`
- `SKILL_LEADERBOARD_ADDRESS` (deprecated, local dev only)

**Contract Addresses:**
- **Local (Hardhat) - Chain ID 31337:**
  - `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`
- **Sepolia - Chain ID 11155111:**
  - Not yet deployed (TODO in code)

**Also Exported From:**
- `packages/common/src/index.ts` - Re-exports all contract utilities

**Contract Source:**
- `packages/contracts-public/contracts/SkillLeaderboard.sol`

---

### Chain Configuration

**Location:** `packages/core-logic/src/contracts.ts`

**Type:** `ChainConfig`
```typescript
export interface ChainConfig {
  chainId: SupportedChainId;
  name: string;
  rpcUrl?: string;
  blockExplorerUrl?: string;
  selfHumanSBT?: Address;
  skillLeaderboard?: Address;
}
```

**Available Chains:**
- `CHAINS[31337]` - Local Hardhat
- `CHAINS[11155111]` - Sepolia testnet

---

## 2. Wagmi / Viem / Ethers Setup

### Wagmi Configuration

**Location:** `apps/aztecbat-ui/lib/walletConfig.ts`

**Config:**
```typescript
import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ?? 'https://rpc.sepolia.org'
    ),
  },
  ssr: true,
});
```

**Features:**
- ✅ Sepolia testnet configured
- ✅ Injected connector (MetaMask, browser wallets)
- ✅ SSR support for Next.js
- ✅ Environment variable for custom RPC URL

---

### Viem Public Client (ENS)

**Location:** `apps/aztecbat-ui/lib/viemClients.ts`

**Config:**
```typescript
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: http(
    process.env.NEXT_PUBLIC_MAINNET_RPC_URL ?? 'https://eth.llamarpc.com'
  ),
});
```

**Purpose:**
- ENS resolution (mainnet only)
- Read-only operations

---

### Wallet Provider

**Location:** `apps/aztecbat-ui/components/WalletProvider.tsx`

**Setup:**
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../lib/walletConfig';

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </QueryClientProvider>
  );
}
```

**Usage:**
- Wraps app in `apps/aztecbat-ui/app/layout.tsx`
- Provides wagmi hooks to all components

---

### Connect Button Component

**Location:** `apps/aztecbat-ui/components/ConnectButton.tsx`

**Features:**
- ✅ Uses `useAccount`, `useConnect`, `useDisconnect` from wagmi
- ✅ ENS resolution via `mainnetPublicClient`
- ✅ Displays ENS name or shortened address
- ✅ Handles connection/disconnection

**Hooks Used:**
- `useAccount()` - Get connected address
- `useConnect()` - Connect wallet
- `useDisconnect()` - Disconnect wallet

**Note:** No contract interaction hooks found yet (no `useContractRead`, `useContractWrite`, `useReadContract`, `useWriteContract`)

---

### Ethers Usage (Playground)

**Location:** `playground/main.ts`

**Pattern:**
```typescript
import { ethers } from 'ethers';

// Initialize contracts
const selfHumanSBT = new ethers.Contract(
  SELF_HUMAN_SBT_ADDRESS,
  SelfHumanSBTAbi,
  signer
);

const skillLeaderboard = new ethers.Contract(
  SKILL_LEADERBOARD_ADDRESS,
  SkillLeaderboardAbi,
  signer
);

// Read operations
const hasSBT = await selfHumanSBT.hasValidSBT(address);

// Write operations
const tx = await skillLeaderboard.submitSkillTier(skillHash, tier);
await tx.wait();
```

**Note:** This is in the playground, not the main web app. The web app should use wagmi hooks instead.

---

## 3. Backend API / Indexer Endpoints

### Indexer Service

**Location:** `services/indexer/src/index.ts`

**Base URL:** Configurable via environment variable
- Default port: `4000`
- Default RPC: `http://localhost:8545`

---

### Endpoints

#### 1. Health Check
```
GET /health
```
**Response:**
```json
{ "status": "ok" }
```

---

#### 2. Get Leaderboard
```
GET /leaderboard?skillHash=0x...
```

**Query Parameters:**
- `skillHash` (required) - Skill hash as hex string

**Response:**
```typescript
Array<{
  id: number;
  user_address: string; // Address
  skill_hash: string;   // Skill hash
  tier: number;
  block_number: number;
  tx_hash: string;
  timestamp: number;
  created_at: number;
  ensName?: string;     // Optional ENS name if resolved
}>
```

**Features:**
- ✅ ENS enrichment (automatic)
- ✅ Returns all entries for a skill hash
- ✅ Sorted by tier (descending)

**Example:**
```bash
curl "http://localhost:4000/leaderboard?skillHash=0x1234..."
```

---

#### 3. Get User Skills
```
GET /user/:userAddress/skills
```

**Path Parameters:**
- `userAddress` - Ethereum address

**Response:**
```typescript
Array<{
  id: number;
  user_address: string;
  skill_hash: string;
  tier: number;
  block_number: number;
  tx_hash: string;
  timestamp: number;
  created_at: number;
  ensName?: string;
}>
```

**Features:**
- ✅ ENS enrichment (automatic)
- ✅ Returns all skills for a user
- ✅ Includes all skill reveals

**Example:**
```bash
curl "http://localhost:4000/user/0x1234.../skills"
```

---

### Leaderboard Client (TypeScript)

**Location:** `packages/core-logic/src/leaderboardClient.ts`

**Class:** `LeaderboardClient`

**Usage:**
```typescript
import { LeaderboardClient } from '@hidden-garden/core-logic';

const client = new LeaderboardClient({
  baseUrl: 'http://localhost:4000',
});

// Get leaderboard
const entries = await client.getLeaderboard(skillHash);

// Get user skills
const skills = await client.getUserSkills(address);
```

**Methods:**
- `getLeaderboard(skillHash: SkillHash): Promise<LeaderboardEntry[]>`
- `getUserSkills(address: Address): Promise<UserSkill[]>`

**Types:**
- `LeaderboardEntry` - Includes user_address, skill_hash, tier, timestamp, ensName
- `UserSkill` - Similar structure

---

### SBT Verification Endpoint

**Status:** ❌ **NOT FOUND**

**What's Missing:**
- No backend endpoint for "has valid SBT" check
- Must query contract directly via wagmi/viem

**Workaround:**
- Use `useReadContract` or `readContract` from wagmi/viem
- Call `hasValidSBT(address)` on `SelfHumanSBT` contract

**Example (using wagmi):**
```typescript
import { useReadContract } from 'wagmi';
import { SelfHumanSBTAbi, getSelfHumanSBTAddress } from '@hidden-garden/core-logic';

const { data: hasSBT } = useReadContract({
  address: getSelfHumanSBTAddress(chainId),
  abi: SelfHumanSBTAbi,
  functionName: 'hasValidSBT',
  args: [address],
});
```

---

## 4. Profile Pages

### /me Page (My Garden)

**Location:** `apps/aztecbat-ui/app/me/page.tsx`

**Features:**
- ✅ Client component (`'use client'`)
- ✅ Local skill tree editor (React state)
- ✅ Wallet connection via `useAccount` hook
- ✅ ENS resolution for connected wallet
- ✅ "View my public profile" button
- ✅ Links to `/u/[identifier]` when connected

**Current State:**
- Uses `SkillNode` type from `@hidden-garden/core-logic`
- Uses `normalizeSkillId` utility
- Uses `shortenAddress` and `getEnsName` for ENS
- **Does NOT yet check SBT status**
- **Does NOT yet submit skills to contract**

**Wallet Integration:**
```typescript
const { address, isConnected } = useAccount();
const [ensName, setEnsName] = React.useState<string | null>(null);

// ENS resolution
const name = await getEnsName(
  mainnetPublicClient as any,
  address as `0x${string}`
);
```

**Profile Link:**
```typescript
const profileIdentifier = ensName ?? address;
const profileHref = profileIdentifier ? `/u/${profileIdentifier}` : null;
```

---

### /u/[identifier] Page (Public Profile)

**Location:** `apps/aztecbat-ui/app/u/[identifier]/page.tsx`

**Features:**
- ✅ Server component (async)
- ✅ Accepts ENS names (`.eth`) or addresses
- ✅ Resolves ENS → address
- ✅ Reverse ENS lookup for addresses
- ✅ Fetches user skills from mock API
- ✅ Displays public skills list

**Current State:**
- Uses `mockLeaderboardApi.getUserSkills(address)` - **MOCK DATA**
- **Does NOT yet use real indexer API**
- **Does NOT yet show SBT verification status**

**ENS Resolution:**
```typescript
async function resolveIdentifierToAddress(identifier: string) {
  if (identifier.endsWith('.eth')) {
    const address = await mainnetPublicClient.getEnsAddress({ name: identifier });
    return { address, primaryEnsName: identifier };
  }
  // Reverse lookup
  const reverseName = await mainnetPublicClient.getEnsName({ address: identifier });
  return { address: identifier, primaryEnsName: reverseName };
}
```

**Data Fetching:**
```typescript
const publicSkills = await mockLeaderboardApi.getUserSkills(address);
```

**Note:** Should be replaced with:
```typescript
import { LeaderboardClient } from '@hidden-garden/core-logic';
const client = new LeaderboardClient({ baseUrl: process.env.INDEXER_URL });
const skills = await client.getUserSkills(address);
```

---

## 5. Summary: What Exists vs What's Needed

### ✅ What Exists

1. **Contract ABIs & Addresses:**
   - ✅ `SelfHumanSBTAbi` and `SkillLeaderboardAbi` exported
   - ✅ Address getter functions for multi-chain support
   - ✅ Chain configuration system

2. **Wagmi Setup:**
   - ✅ `wagmiConfig` with Sepolia chain
   - ✅ `WalletProvider` wrapping the app
   - ✅ `ConnectButton` component
   - ✅ Basic wallet connection hooks

3. **ENS Integration:**
   - ✅ `mainnetPublicClient` for ENS resolution
   - ✅ `getEnsName` and `shortenAddress` utilities
   - ✅ ENS resolution in profile pages

4. **Backend API:**
   - ✅ Indexer service with `/leaderboard` and `/user/:address/skills` endpoints
   - ✅ `LeaderboardClient` TypeScript class
   - ✅ ENS enrichment in indexer responses

5. **Profile Pages:**
   - ✅ `/me` page with wallet integration
   - ✅ `/u/[identifier]` page with ENS resolution

---

### ❌ What's Missing / Needs Integration

1. **Contract Interaction Hooks:**
   - ❌ No `useReadContract` for SBT checks
   - ❌ No `useWriteContract` for contract submissions
   - ❌ No contract read/write utilities in web app

2. **SBT Verification:**
   - ❌ No SBT status check in `/me` page
   - ❌ No SBT status display in `/u/[identifier]` page
   - ❌ No Self verification flow UI

3. **Real API Integration:**
   - ❌ `/u/[identifier]` still uses `mockLeaderboardApi`
   - ❌ Should use `LeaderboardClient` with real indexer URL

4. **Skill Submission:**
   - ❌ No UI for submitting skills to contract
   - ❌ No proof generation flow
   - ❌ No leaderboard submission integration

5. **Backend SBT Endpoint:**
   - ❌ No `/user/:address/sbt` or similar endpoint
   - ❌ Must query contract directly

---

## 6. Next Steps for Team B

### Immediate Tasks:

1. **Add Contract Read Hooks:**
   - Create `useSBTStatus(address)` hook using `useReadContract`
   - Add SBT check to `/me` page
   - Display SBT status in `/u/[identifier]` page

2. **Replace Mock API:**
   - Replace `mockLeaderboardApi` with `LeaderboardClient`
   - Configure indexer base URL via environment variable
   - Update `/u/[identifier]` to use real API

3. **Add Contract Write Hooks:**
   - Create `useSubmitSkillTier()` hook using `useWriteContract`
   - Add skill submission UI to `/me` page
   - Handle transaction states (pending, success, error)

4. **Self Verification Flow:**
   - Integrate Self SDK
   - Create verification flow component
   - Connect to `verifyAndMint` contract function

5. **Proof Generation (Future):**
   - Integrate Aztec/Noir proof generation
   - Create proof submission flow
   - Connect to `submitSkillTierWithProof` contract function

---

## 7. Key File Locations

### Contracts
- `packages/core-logic/src/contracts.ts` - ABIs, addresses, chain configs
- `packages/common/src/index.ts` - Re-exports for easy import

### Wagmi/Viem
- `apps/aztecbat-ui/lib/walletConfig.ts` - Wagmi config
- `apps/aztecbat-ui/lib/viemClients.ts` - Viem public client
- `apps/aztecbat-ui/components/WalletProvider.tsx` - Provider wrapper
- `apps/aztecbat-ui/components/ConnectButton.tsx` - Connect button

### Backend API
- `services/indexer/src/index.ts` - Express API server
- `packages/core-logic/src/leaderboardClient.ts` - TypeScript client

### Pages
- `apps/aztecbat-ui/app/me/page.tsx` - My Garden page
- `apps/aztecbat-ui/app/u/[identifier]/page.tsx` - Public profile page

### Utilities
- `packages/core-logic/src/skills.ts` - `hashSkillName()` function
- `packages/core-logic/src/ens.ts` - ENS utilities

---

## 8. Environment Variables Needed

```bash
# Wagmi/Viem
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.sepolia.org
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth.llamarpc.com

# Indexer API
NEXT_PUBLIC_INDEXER_URL=http://localhost:4000

# Contract Addresses (optional, uses defaults from contracts.ts)
NEXT_PUBLIC_SELF_HUMAN_SBT_ADDRESS=0x...
NEXT_PUBLIC_SKILL_LEADERBOARD_ADDRESS=0x...
```

---

## 9. Import Examples

### Contract ABIs & Addresses
```typescript
import {
  SelfHumanSBTAbi,
  SkillLeaderboardAbi,
  getSelfHumanSBTAddress,
  getSkillLeaderboardAddress,
} from '@hidden-garden/core-logic';
```

### Leaderboard Client
```typescript
import { LeaderboardClient } from '@hidden-garden/core-logic';

const client = new LeaderboardClient({
  baseUrl: process.env.NEXT_PUBLIC_INDEXER_URL || 'http://localhost:4000',
});
```

### Skill Hashing
```typescript
import { hashSkillName } from '@hidden-garden/core-logic';

const skillHash = hashSkillName('rust'); // Returns 0x...
```

### ENS Utilities
```typescript
import { shortenAddress, getEnsName } from '@hidden-garden/core-logic';
import { mainnetPublicClient } from '../lib/viemClients';

const short = shortenAddress('0x1234...');
const ens = await getEnsName(mainnetPublicClient as any, address);
```

---

**Document Version:** 1.0  
**Last Updated:** Phase 3 Reconnaissance  
**Status:** ✅ Complete

