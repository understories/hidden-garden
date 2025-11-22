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

---

## 2. Skill Proofs / Leaderboard

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

**Last Updated:** Phase 3 Backend Map  
**Status:** ✅ Ready for implementation

