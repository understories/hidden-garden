# Team B Phase 3: Backend & Integration Map

Quick reference guide for where to call contracts, APIs, and reuse existing components.

---

## 1. Self / Identity Verification

### On-Chain Contract Calls

**Contract:** `SelfHumanSBT`

**Import:**
```typescript
import {
  SelfHumanSBTAbi,
  getSelfHumanSBTAddress,
} from '@hidden-garden/core-logic';
import { useReadContract, useWriteContract } from 'wagmi';
import { useChainId } from 'wagmi';
```

**Check SBT Status:**
```typescript
const chainId = useChainId();
const sbtAddress = getSelfHumanSBTAddress(chainId);

const { data: hasSBT } = useReadContract({
  address: sbtAddress,
  abi: SelfHumanSBTAbi,
  functionName: 'hasValidSBT',
  args: [userAddress], // `0x${string}`
});
```

**Function Signature:**
```solidity
function hasValidSBT(address user) external view returns (bool)
```

**Verify & Mint SBT (Self Verification):**
```typescript
const { writeContract, isPending, isSuccess } = useWriteContract();

await writeContract({
  address: sbtAddress,
  abi: SelfHumanSBTAbi,
  functionName: 'verifyAndMint',
  args: [
    proofPayload,      // bytes - from Self SDK
    userContextData,   // bytes - optional context
  ],
});
```

**Function Signature:**
```solidity
function verifyAndMint(
  bytes calldata proofPayload,
  bytes calldata userContextData
) external
```

**Contract Addresses:**
- Local (Hardhat, chainId 31337): `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- Sepolia (chainId 11155111): Not yet deployed (use `getSelfHumanSBTAddress(chainId)`)

**Other View Functions:**
```typescript
// Get SBT owner
const { data: owner } = useReadContract({
  address: sbtAddress,
  abi: SelfHumanSBTAbi,
  functionName: 'ownerOf',
  args: [tokenId], // uint256 - tokenId = uint256(uint160(address))
});

// Get SBT balance
const { data: balance } = useReadContract({
  address: sbtAddress,
  abi: SelfHumanSBTAbi,
  functionName: 'balanceOf',
  args: [ownerAddress],
});
```

**Backend API:** ❌ No backend endpoint exists. Query contract directly.

### Self Verification UX

**Hook:** `useHasValidSBT(address?: Address)`

**Location:** `apps/aztecbat-ui/hooks/useHasValidSBT.ts`

**Usage in `/me` page:**
```typescript
import { useHasValidSBT } from '../../hooks/useHasValidSBT';

const { isLoading, isVerified, error, refetch } = useHasValidSBT(address);
```

**Hook Returns:**
- `isLoading: boolean` - True while checking SBT status
- `isVerified: boolean` - True if user has valid SBT
- `error: Error | null` - Error if contract not deployed or query fails
- `refetch: () => void` - Function to manually re-check SBT status

**Manual Re-check During Demo:**

After completing Self verification flow:
1. Click "I've completed verification" button (appears after clicking "Verify with Self")
2. This triggers `refetch()` automatically after 1 second
3. Or click "Check Verification Status" button to manually refetch immediately

**Status Display States:**
- **Loading:** Shows "Checking verification…" with spinner
- **Verified:** Shows green badge "Verified Human ✅"
- **Not Verified:** Shows "Not verified yet" with "Verify with Self" button
- **Error:** Shows amber warning badge with error message (non-blocking)

---

## 2. Skill → Proof → Leaderboard Flow

### End-to-End Flow

This section documents the complete flow for revealing a skill to the public leaderboard using ZK proofs.

**Flow Overview:**
1. User selects a skill and tier threshold on `/me` page
2. Frontend generates proof using `SkillProofProvider` (Team A's stub for now)
3. Frontend submits proof to `SkillLeaderboard` contract via wagmi
4. Contract verifies proof and records skill tier on-chain
5. UI shows success state and marks skill as "Revealed at Tier X"

**Key Components:**

**UI Component:**
- **Location:** `apps/aztecbat-ui/app/me/page.tsx`
- **Features:**
  - "Reveal this skill" button for each skill
  - Tier selection dropdown (1-5)
  - Proof generation and submission flow
  - Transaction status display (pending, success, error)
  - "Revealed at Tier X" indicator after successful submission

**Proof Provider:**
- **Location:** `packages/game-engine/src/skillProofProvider.ts`
- **Interface:** `SkillProofProvider.generateProof({ skillHash, minTier })`
- **Current Implementation:** `StubSkillProofProvider` (Team A's stub)
  - Returns fake proof data for development
  - Simulates 500ms delay
  - Returns `{ proofData: string, claimedTier: number }`
- **Ownership:** Team A owns the implementation. This is a canonical integration boundary. Team A may update the internals (including replacing the stub with real proof generation in a separate package), but the interface remains stable. Team B must not modify or replace the implementation.

**Contract Integration:**
- **Contract:** `SkillLeaderboard.submitSkillTierWithProof`
- **Location:** `packages/core-logic/src/contracts.ts`
- **Function Signature:**
  ```solidity
  function submitSkillTierWithProof(
    bytes32 skillHash,
    uint8 minLevel,
    bytes calldata proof,
    bytes calldata publicInputs
  ) external
  ```
- **Wagmi Hook:** `useWriteContract` from `wagmi`
- **Transaction Tracking:** `useWaitForTransactionReceipt` from `wagmi`

**Skill Hashing:**
- **Function:** `hashSkillName(skillName: string)`
- **Location:** `packages/core-logic/src/skills.ts`
- **Method:** `keccak256(utf8(skillName))` - canonical hashing from Team A

**Public Inputs Encoding:**
- **Format:** `abi.encode(userAddress, skillHash, minLevel)`
- **Implementation:** Uses `encodeAbiParameters` from `viem`
- **Parameters:**
  - `userAddress`: `address` (20 bytes)
  - `skillHash`: `bytes32` (32 bytes)
  - `minLevel`: `uint8` (1 byte)

**State Management:**
- Proof generation state: `proofGenerating`, `proofError`, `proofResult`
- Transaction state: `submittingSkill`, `isWritePending`, `isConfirming`, `isConfirmed`
- Revealed skills: `revealedSkills` (Record<skillId, tier>)

**UX States:**
- "Generating proof…" - During proof generation
- "Waiting for wallet signature…" - During `writeContract` call
- "Transaction pending…" - Waiting for transaction confirmation
- "Published to leaderboard ✅" - On successful confirmation
- "Transaction failed" - On error
- "✅ Revealed at Tier X" - Persistent indicator after success

**Files:**
- `apps/aztecbat-ui/app/me/page.tsx` - Main UI component with reveal flow
- `packages/game-engine/src/skillProofProvider.ts` - Proof provider interface and stub
- `packages/core-logic/src/contracts.ts` - Contract ABIs and addresses
- `packages/core-logic/src/skills.ts` - Skill hashing utility

**Note:** This implementation uses:
- ✅ Real `SkillLeaderboard` contract (on-chain)
- ✅ Real wagmi/viem setup for contract interactions
- ✅ Real transaction tracking and confirmation
- ⚠️ Stub proof generation (Team A's `StubSkillProofProvider`) – canonical integration point; Team A may update the internals later, but the interface must stay stable and must not be replaced by Team B.

**Rule:** `SkillProofProvider` implementation lives under Team A ownership. Team B (and this repo) MUST NOT replace the stub with a real prover. Real proof generation, when it exists, will come from a separate Team A package behind the same interface.

---

## 3. Skill Proofs / Leaderboard (Legacy Section)

### On-Chain Contract Calls

**Contract:** `SkillLeaderboard`

**Import:**
```typescript
import {
  SkillLeaderboardAbi,
  getSkillLeaderboardAddress,
  hashSkillName,
} from '@hidden-garden/core-logic';
import { useReadContract, useWriteContract } from 'wagmi';
import { useChainId } from 'wagmi';
```

**Submit Skill Tier (V1 - Plain):**
```typescript
const chainId = useChainId();
const leaderboardAddress = getSkillLeaderboardAddress(chainId);
const { writeContract } = useWriteContract();

const skillHash = hashSkillName('rust'); // Returns `0x${string}`

await writeContract({
  address: leaderboardAddress,
  abi: SkillLeaderboardAbi,
  functionName: 'submitSkillTier',
  args: [
    skillHash,  // bytes32
    tier,       // uint8 (1-10)
  ],
});
```

**Function Signature:**
```solidity
function submitSkillTier(
  bytes32 skillHash,
  uint8 tier
) external
```

**Submit Skill Tier with ZK Proof (V2):**
```typescript
await writeContract({
  address: leaderboardAddress,
  abi: SkillLeaderboardAbi,
  functionName: 'submitSkillTierWithProof',
  args: [
    skillHash,      // bytes32
    minLevel,       // uint8 (1-10)
    proof,          // bytes - ZK proof from Aztec/Noir
    publicInputs,   // bytes - abi.encode(userAddress, skillHash, minLevel)
  ],
});
```

**Function Signature:**
```solidity
function submitSkillTierWithProof(
  bytes32 skillHash,
  uint8 minLevel,
  bytes calldata proof,
  bytes calldata publicInputs
) external
```

**Public Inputs Encoding:**
```typescript
import { encodeAbiParameters, parseAbiParameters } from 'viem';

const publicInputs = encodeAbiParameters(
  parseAbiParameters('address, bytes32, uint8'),
  [userAddress, skillHash, minLevel]
);
```

**Check User's Skill Tier:**
```typescript
const { data: tier } = useReadContract({
  address: leaderboardAddress,
  abi: SkillLeaderboardAbi,
  functionName: 'skillTier',
  args: [skillHash, userAddress],
});
```

**Function Signature:**
```solidity
function skillTier(
  bytes32 skillHash,
  address user
) external view returns (uint8)
```

**Contract Addresses:**
- Local (Hardhat, chainId 31337): `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`
- Sepolia (chainId 11155111): Not yet deployed (use `getSkillLeaderboardAddress(chainId)`)

**Skill Hashing:**
```typescript
import { hashSkillName } from '@hidden-garden/core-logic';

const skillHash = hashSkillName('rust'); // Returns `0x${string}`
// Uses keccak256(utf8(skillName.toLowerCase().trim()))
```

---

### Backend API (Indexer)

**Import:**
```typescript
import { LeaderboardClient } from '@hidden-garden/core-logic';
```

**Initialize Client:**
```typescript
const client = new LeaderboardClient({
  baseUrl: process.env.NEXT_PUBLIC_INDEXER_URL || 'http://localhost:4000',
});
```

**Get Leaderboard:**
```typescript
const entries = await client.getLeaderboard(skillHash);
// Returns: LeaderboardEntry[]
// Includes: user_address, skill_hash, tier, timestamp, ensName
```

**Endpoint:** `GET /leaderboard?skillHash=0x...`

**Get User Skills:**
```typescript
const skills = await client.getUserSkills(userAddress);
// Returns: UserSkill[]
// Includes: user_address, skill_hash, tier, timestamp, ensName
```

**Endpoint:** `GET /user/:userAddress/skills`

**Types:**
```typescript
import type {
  LeaderboardEntry,
  UserSkill,
  SkillHash,
} from '@hidden-garden/core-logic';
```

**Environment Variable:**
```bash
NEXT_PUBLIC_INDEXER_URL=http://localhost:4000
```

---

## 3. ENS Resolution & Text Records

### ENS Resolution

**Import:**
```typescript
import { getEnsName, shortenAddress } from '@hidden-garden/core-logic';
import { mainnetPublicClient } from '../lib/viemClients'; // or your path
import type { EnsPublicClient } from '@hidden-garden/core-logic';
```

**Resolve Address → ENS Name:**
```typescript
const ensName = await getEnsName(
  mainnetPublicClient as unknown as EnsPublicClient,
  address as `0x${string}`
);
// Returns: string | null
```

**Resolve ENS Name → Address:**
```typescript
import { useEnsAddress } from 'wagmi';

const { data: address } = useEnsAddress({
  name: 'alice.eth',
  chainId: 1, // mainnet
});
```

**Or with viem client:**
```typescript
const address = await mainnetPublicClient.getEnsAddress({
  name: 'alice.eth',
});
```

**Shorten Address:**
```typescript
const short = shortenAddress('0x1234567890123456789012345678901234567890');
// Returns: "0x1234…7890"
```

**Viem Client Location:**
- `apps/aztecbat-ui/lib/viemClients.ts`
- Exports: `mainnetPublicClient`

**ENS Text Records:** ❌ Not yet implemented. Use viem's `getEnsText()` if needed:
```typescript
const text = await mainnetPublicClient.getEnsText({
  name: 'alice.eth',
  key: 'description', // or other text record key
});
```

---

## 4. Existing React Components / Hooks to Reuse

### WalletProvider

**Location:** `apps/aztecbat-ui/components/WalletProvider.tsx`

**Usage:**
```typescript
import { WalletProvider } from '../components/WalletProvider';

// Already wraps app in layout.tsx
// Provides wagmi hooks to all components
```

**What it provides:**
- `WagmiProvider` with configured chains
- `QueryClientProvider` for React Query
- All wagmi hooks available in child components

---

### ConnectButton

**Location:** `apps/aztecbat-ui/components/ConnectButton.tsx`

**Usage:**
```typescript
import { ConnectButton } from '../components/ConnectButton';

<ConnectButton />
```

**Features:**
- ✅ Wallet connection/disconnection
- ✅ ENS name resolution
- ✅ Shortened address fallback
- ✅ Loading states

**Hooks it uses:**
- `useAccount()` - Get connected address
- `useConnect()` - Connect wallet
- `useDisconnect()` - Disconnect wallet

**Reuse pattern:** Import and use directly, or copy the ENS resolution logic.

---

### Wagmi Hooks (Available Everywhere)

**Import:**
```typescript
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
  usePublicClient,
  useEnsAddress,
  useEnsName,
} from 'wagmi';
```

**Common Patterns:**

**Get Connected Account:**
```typescript
const { address, isConnected } = useAccount();
```

**Get Current Chain:**
```typescript
const chainId = useChainId();
```

**Read Contract:**
```typescript
const { data, isLoading, error } = useReadContract({
  address: contractAddress,
  abi: contractAbi,
  functionName: 'functionName',
  args: [arg1, arg2],
});
```

**Write Contract:**
```typescript
const { writeContract, isPending, isSuccess, error } = useWriteContract();

await writeContract({
  address: contractAddress,
  abi: contractAbi,
  functionName: 'functionName',
  args: [arg1, arg2],
});
```

**Get Public Client (for read operations):**
```typescript
const publicClient = usePublicClient();
```

---

### ENS Resolution Pattern (Reusable)

**Location:** `apps/aztecbat-ui/components/ConnectButton.tsx` (lines 17-61)

**Pattern:**
```typescript
import * as React from 'react';
import { getEnsName } from '@hidden-garden/core-logic';
import { mainnetPublicClient } from '../lib/viemClients';
import type { EnsPublicClient } from '@hidden-garden/core-logic';

const [ensName, setEnsName] = React.useState<string | null>(null);
const [ensLoading, setEnsLoading] = React.useState(false);

React.useEffect(() => {
  let cancelled = false;

  async function resolveEns() {
    if (!address || !isConnected) {
      setEnsName(null);
      return;
    }

    setEnsLoading(true);
    try {
      const ensClient = mainnetPublicClient as unknown as EnsPublicClient;
      const name = await getEnsName(ensClient, address as `0x${string}`);
      if (!cancelled) {
        setEnsName(name);
      }
    } catch (err) {
      if (!cancelled) {
        setEnsName(null);
      }
    } finally {
      if (!cancelled) {
        setEnsLoading(false);
      }
    }
  }

  resolveEns();
  return () => {
    cancelled = true;
  };
}, [address, isConnected]);
```

**Reuse:** Copy this pattern for any component that needs ENS resolution.

---

## 5. File Locations Reference

### Contracts & ABIs
- `packages/core-logic/src/contracts.ts` - All ABIs, addresses, chain configs
- `packages/common/src/index.ts` - Re-exports for easy import

### Utilities
- `packages/core-logic/src/skills.ts` - `hashSkillName()` function
- `packages/core-logic/src/leaderboardClient.ts` - `LeaderboardClient` class
- `packages/core-logic/src/ens.ts` - ENS utilities (also in common)

### Components
- `apps/aztecbat-ui/components/WalletProvider.tsx` - Wagmi provider wrapper
- `apps/aztecbat-ui/components/ConnectButton.tsx` - Wallet connect button

### Config
- `apps/aztecbat-ui/lib/walletConfig.ts` - Wagmi configuration
- `apps/aztecbat-ui/lib/viemClients.ts` - Viem public clients

### Pages (Reference)
- `apps/aztecbat-ui/app/me/page.tsx` - My Garden page (has wallet integration)
- `apps/aztecbat-ui/app/u/[identifier]/page.tsx` - Public profile page (has ENS resolution)

---

## 6. Quick Start Examples

### Check if User Has SBT
```typescript
'use client';

import { useAccount, useChainId, useReadContract } from 'wagmi';
import {
  SelfHumanSBTAbi,
  getSelfHumanSBTAddress,
} from '@hidden-garden/core-logic';

export function SBTStatus() {
  const { address } = useAccount();
  const chainId = useChainId();
  const sbtAddress = getSelfHumanSBTAddress(chainId);

  const { data: hasSBT, isLoading } = useReadContract({
    address: sbtAddress,
    abi: SelfHumanSBTAbi,
    functionName: 'hasValidSBT',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!sbtAddress,
    },
  });

  if (isLoading) return <div>Checking SBT...</div>;
  if (!address) return <div>Connect wallet</div>;
  if (!sbtAddress) return <div>Contract not deployed on this chain</div>;

  return <div>{hasSBT ? '✅ Verified Human' : '❌ Not Verified'}</div>;
}
```

### Submit Skill Tier
```typescript
'use client';

import { useAccount, useChainId, useWriteContract } from 'wagmi';
import {
  SkillLeaderboardAbi,
  getSkillLeaderboardAddress,
  hashSkillName,
} from '@hidden-garden/core-logic';

export function SubmitSkillButton({ skillName, tier }: { skillName: string; tier: number }) {
  const { address } = useAccount();
  const chainId = useChainId();
  const leaderboardAddress = getSkillLeaderboardAddress(chainId);
  const { writeContract, isPending, isSuccess } = useWriteContract();

  const handleSubmit = async () => {
    if (!address || !leaderboardAddress) return;

    const skillHash = hashSkillName(skillName);

    await writeContract({
      address: leaderboardAddress,
      abi: SkillLeaderboardAbi,
      functionName: 'submitSkillTier',
      args: [skillHash, tier],
    });
  };

  return (
    <button onClick={handleSubmit} disabled={isPending || !address}>
      {isPending ? 'Submitting...' : isSuccess ? '✅ Submitted' : 'Submit Skill'}
    </button>
  );
}
```

### Fetch Leaderboard from API
```typescript
'use client';

import { useEffect, useState } from 'react';
import { LeaderboardClient } from '@hidden-garden/core-logic';
import type { LeaderboardEntry } from '@hidden-garden/core-logic';

export function Leaderboard({ skillHash }: { skillHash: `0x${string}` }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new LeaderboardClient({
      baseUrl: process.env.NEXT_PUBLIC_INDEXER_URL || 'http://localhost:4000',
    });

    client
      .getLeaderboard(skillHash)
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [skillHash]);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          {entry.ensName || entry.user_address} - Tier {entry.tier}
        </li>
      ))}
    </ul>
  );
}
```

---

## 7. Environment Variables

```bash
# Required
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.sepolia.org
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth.llamarpc.com
NEXT_PUBLIC_INDEXER_URL=http://localhost:4000

# Optional (contracts use defaults from contracts.ts)
NEXT_PUBLIC_SELF_HUMAN_SBT_ADDRESS=0x...
NEXT_PUBLIC_SKILL_LEADERBOARD_ADDRESS=0x...
```

---

## 8. Gaps Team B Must Fill

This section identifies what exists vs. what's missing for each Phase 3 flow, and suggests where new code should live.

---

### Flow 1: Self Verification → SBT → hasValidSBT → "Verified Human ✅"

#### What Exists ✅

**Contract Integration:**
- ✅ `SelfHumanSBT` contract deployed (local Hardhat)
- ✅ `SelfHumanSBTAbi` exported from `@hidden-garden/core-logic`
- ✅ `getSelfHumanSBTAddress(chainId)` function
- ✅ `hasValidSBT(address)` function signature documented
- ✅ `verifyAndMint(proofPayload, userContextData)` function signature documented

**Wagmi Setup:**
- ✅ `wagmiConfig` configured with Sepolia
- ✅ `WalletProvider` wrapping app
- ✅ `useReadContract` and `useWriteContract` hooks available
- ✅ `useAccount` hook for getting connected address

**Documentation:**
- ✅ `docs/self-integration.md` - Complete Self Protocol integration guide
- ✅ Contract flow documented (verifyAndMint → Hub callback → customVerificationHook)

#### What's Missing ❌

**Self SDK Integration:**
- ❌ Self SDK packages not installed in `apps/aztecbat-ui`
- ❌ No Self client initialization
- ❌ No proof generation from Self SDK
- ❌ No verification config setup matching contract

**UI Components:**
- ❌ No Self verification flow component
- ❌ No "Verify with Self" button/UI
- ❌ No proof generation status display
- ❌ No verification success/failure feedback

**Hooks:**
- ❌ No `useSBTStatus(address)` hook for checking SBT
- ❌ No `useSelfVerification()` hook for verification flow
- ❌ No hook for reading verification config from contract

**SBT Status Display:**
- ❌ No SBT status indicator in `/me` page
- ❌ No "Verified Human ✅" badge component
- ❌ No SBT status in `/u/[identifier]` profile page
- ❌ No conditional UI based on SBT status

**Contract Config:**
- ❌ No way to read contract's `scope()` or `verificationConfigId` from frontend
- ❌ No environment variable for Self Hub V2 address
- ❌ No environment variable for verification config ID

#### Suggested File/Paths for New Code

**Self SDK Integration:**
- `apps/aztecbat-ui/lib/selfClient.ts` - Initialize Self SDK client
- `apps/aztecbat-ui/lib/selfConfig.ts` - Verification config matching contract

**Hooks:**
- `apps/aztecbat-ui/hooks/useSBTStatus.ts` - Check if address has valid SBT
- `apps/aztecbat-ui/hooks/useSelfVerification.ts` - Self verification flow hook
- `apps/aztecbat-ui/hooks/useContractConfig.ts` - Read contract scope/config

**Components:**
- `apps/aztecbat-ui/components/SelfVerificationButton.tsx` - "Verify with Self" button
- `apps/aztecbat-ui/components/SelfVerificationFlow.tsx` - Full verification flow UI
- `apps/aztecbat-ui/components/SBTStatusBadge.tsx` - "Verified Human ✅" badge
- `apps/aztecbat-ui/components/SBTStatusIndicator.tsx` - SBT status display component

**Integration Points:**
- Update `apps/aztecbat-ui/app/me/page.tsx` - Add SBT status check and verification button
- Update `apps/aztecbat-ui/app/u/[identifier]/page.tsx` - Display SBT status on profile

**Environment Variables:**
```bash
# Add to .env.local
NEXT_PUBLIC_SELF_HUB_V2_ADDRESS=0x... # IdentityVerificationHub V2 address
NEXT_PUBLIC_SELF_SCOPE_SEED=proof-of-human # Must match contract
NEXT_PUBLIC_SELF_CONFIG_ID=0x... # Verification config ID
```

---

### Flow 2: Skill → Proof → SkillLeaderboard.submitSkillTier

#### What Exists ✅

**Contract Integration:**
- ✅ `SkillLeaderboard` contract deployed (local Hardhat)
- ✅ `SkillLeaderboardAbi` exported from `@hidden-garden/core-logic`
- ✅ `getSkillLeaderboardAddress(chainId)` function
- ✅ `submitSkillTier(skillHash, tier)` function signature documented
- ✅ `submitSkillTierWithProof(skillHash, minLevel, proof, publicInputs)` function signature documented
- ✅ `skillTier(skillHash, address)` view function documented

**Utilities:**
- ✅ `hashSkillName(skillName)` function exported
- ✅ Public inputs encoding format documented (`abi.encode(userAddress, skillHash, minLevel)`)

**Wagmi Setup:**
- ✅ `useWriteContract` hook available
- ✅ `useReadContract` hook available

**UI Foundation:**
- ✅ `/me` page has local skill editor with `SkillNode[]` state
- ✅ Skills can be edited (level, xp) locally
- ✅ Skills can be added with `normalizeSkillId`

**Backend API:**
- ✅ `LeaderboardClient` class for fetching leaderboard data
- ✅ Indexer API endpoints for leaderboard and user skills

#### What's Missing ❌

**Proof Generation:**
- ❌ No Aztec/Noir proof generation integration
- ❌ No backend API endpoint for proof generation (`POST /api/aztec/generate-proof`)
- ❌ No proof generation UI/flow
- ❌ No connection to Aztec devnet
- ❌ No Noir circuit compilation/integration

**Skill Submission UI:**
- ❌ No "Submit to Leaderboard" button in `/me` page
- ❌ No skill submission flow component
- ❌ No transaction status handling (pending, success, error)
- ❌ No confirmation UI after submission

**Hooks:**
- ❌ No `useSubmitSkillTier()` hook for plain submission
- ❌ No `useSubmitSkillTierWithProof()` hook for ZK proof submission
- ❌ No `useSkillTier(skillHash, address)` hook for checking user's tier
- ❌ No hook for checking if user can submit (SBT check + skill validation)

**Skill Validation:**
- ❌ No validation that skill exists in local state before submission
- ❌ No validation that tier is within valid range (1-10)
- ❌ No check that user has SBT before allowing submission

**Integration with Local Skills:**
- ❌ No connection between local `SkillNode[]` state and contract submission
- ❌ No mapping from local skill `id` to contract `skillHash`
- ❌ No sync between local skill level and submitted tier

**Error Handling:**
- ❌ No error handling for contract submission failures
- ❌ No retry logic for failed transactions
- ❌ No user feedback for transaction errors

**Post-Submission:**
- ❌ No redirect to leaderboard after successful submission
- ❌ No refresh of leaderboard data after submission
- ❌ No update of local state after on-chain submission

#### Suggested File/Paths for New Code

**Hooks:**
- `apps/aztecbat-ui/hooks/useSubmitSkillTier.ts` - Plain skill tier submission
- `apps/aztecbat-ui/hooks/useSubmitSkillTierWithProof.ts` - ZK proof submission
- `apps/aztecbat-ui/hooks/useSkillTier.ts` - Read user's skill tier from contract
- `apps/aztecbat-ui/hooks/useCanSubmitSkill.ts` - Check if user can submit (SBT + validation)

**Components:**
- `apps/aztecbat-ui/components/SubmitSkillButton.tsx` - Submit skill to leaderboard button
- `apps/aztecbat-ui/components/SkillSubmissionFlow.tsx` - Full submission flow with confirmation
- `apps/aztecbat-ui/components/TransactionStatus.tsx` - Display transaction pending/success/error
- `apps/aztecbat-ui/components/SkillTierBadge.tsx` - Display skill tier badge

**Proof Generation (Future):**
- `apps/aztecbat-ui/lib/proofGenerator.ts` - Aztec/Noir proof generation client
- `apps/aztecbat-ui/hooks/useGenerateProof.ts` - Hook for proof generation
- `apps/aztecbat-ui/components/ProofGenerationFlow.tsx` - UI for proof generation

**Integration Points:**
- Update `apps/aztecbat-ui/app/me/page.tsx`:
  - Add "Submit to Leaderboard" button for each skill
  - Add SBT check before allowing submission
  - Add transaction status display
  - Add redirect to leaderboard after success
- Update `apps/aztecbat-ui/app/leaderboard/[skillName]/page.tsx`:
  - Refresh data after new submission
  - Show user's position if they're on leaderboard

**Utilities:**
- `apps/aztecbat-ui/lib/skillUtils.ts` - Skill validation, mapping local to contract format
- `apps/aztecbat-ui/lib/publicInputs.ts` - Public inputs encoding utilities

**Environment Variables:**
```bash
# Add to .env.local (for future proof generation)
NEXT_PUBLIC_AZTEC_RPC_URL=https://...
NEXT_PUBLIC_PROOF_API_URL=http://localhost:3001/api/aztec
```

---

### Flow 3: ENS Text Record `skilltree_profile_url`

#### What Exists ✅

**ENS Resolution:**
- ✅ `mainnetPublicClient` configured for mainnet
- ✅ `getEnsName(client, address)` utility function
- ✅ `shortenAddress(address)` utility function
- ✅ ENS resolution pattern in `ConnectButton` component
- ✅ ENS name → address resolution in `/u/[identifier]` page
- ✅ Address → ENS name reverse lookup in `/u/[identifier]` page

**Viem Client:**
- ✅ `mainnetPublicClient` exported from `apps/aztecbat-ui/lib/viemClients.ts`
- ✅ Configured with LlamaRPC as default RPC

**Documentation:**
- ✅ ENS resolution utilities documented in backend map

#### What's Missing ❌

**Text Record Reading:**
- ❌ No function to read ENS text records
- ❌ No `getEnsText()` wrapper utility
- ❌ No hook for reading text records
- ❌ No UI component to display text record value

**Profile URL Integration:**
- ❌ No reading of `skilltree_profile_url` text record
- ❌ No display of profile URL in user profile pages
- ❌ No link to external profile if text record exists
- ❌ No fallback if text record doesn't exist

**Text Record Management:**
- ❌ No UI for users to set their own `skilltree_profile_url`
- ❌ No transaction flow for setting ENS text records
- ❌ No validation of URL format

**Caching:**
- ❌ No caching of text record reads (unlike ENS name resolution)
- ❌ No batch reading of text records

#### Suggested File/Paths for New Code

**Utilities:**
- `apps/aztecbat-ui/lib/ensTextRecords.ts` - ENS text record reading utilities
  - `getEnsText(client, name, key)` - Read text record
  - `getProfileUrl(ensName)` - Read `skilltree_profile_url` specifically

**Hooks:**
- `apps/aztecbat-ui/hooks/useEnsTextRecord.ts` - Hook for reading ENS text records
- `apps/aztecbat-ui/hooks/useProfileUrl.ts` - Hook specifically for profile URL

**Components:**
- `apps/aztecbat-ui/components/ProfileUrlLink.tsx` - Display profile URL if exists
- `apps/aztecbat-ui/components/SetProfileUrlButton.tsx` - UI for setting profile URL (future)

**Integration Points:**
- Update `apps/aztecbat-ui/app/u/[identifier]/page.tsx`:
  - Read `skilltree_profile_url` text record for ENS names
  - Display profile URL link if exists
  - Show external profile link badge
- Update `apps/aztecbat-ui/app/me/page.tsx`:
  - Show user's profile URL if they have ENS name
  - Add "Set Profile URL" button (future feature)

**Example Usage:**
```typescript
// In ensTextRecords.ts
export async function getProfileUrl(
  client: PublicClient,
  ensName: string
): Promise<string | null> {
  try {
    const url = await client.getEnsText({
      name: ensName,
      key: 'skilltree_profile_url',
    });
    return url || null;
  } catch {
    return null;
  }
}
```

**Note:** Setting ENS text records requires:
- User to own the ENS name
- Transaction to ENS resolver contract
- This is a future feature, not Phase 3 priority

---

## 9. Implementation Priority

### Phase 3.1 (High Priority)
1. **SBT Status Check** - Add `useSBTStatus` hook and display in UI
2. **Skill Submission (Plain)** - Add `useSubmitSkillTier` hook and button in `/me`
3. **Replace Mock API** - Use `LeaderboardClient` in `/u/[identifier]` page

### Phase 3.2 (Medium Priority)
4. **Self Verification Flow** - Integrate Self SDK and verification UI
5. **Transaction Status** - Add transaction pending/success/error handling
6. **ENS Text Records** - Read and display `skilltree_profile_url`

### Phase 3.3 (Future)
7. **ZK Proof Generation** - Integrate Aztec/Noir proof generation
8. **Proof Submission** - Add `useSubmitSkillTierWithProof` hook
9. **Set Profile URL** - UI for setting ENS text records

---

**Last Updated:** Phase 3 Backend Map  
**Status:** ✅ Ready for implementation

