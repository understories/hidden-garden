# Core API Surface (Frozen)

**Status:** ✅ **FROZEN** - No breaking changes allowed  
**Purpose:** Stable API contract for UI team integration  
**Last Updated:** [Current Date]

---

## Stable Functions

### `getSkillProfile`

Get a complete skill profile for a user.

```typescript
function getSkillProfile(params: {
  chainId: number;
  address: string;
  indexerBaseUrl?: string;
}): Promise<SkillProfile>
```

**Returns:**
```typescript
type SkillProfile = {
  address: string;
  humanVerified: boolean;
  aztecBuilderTier: number | null;
  aztecBuilderSkillHash: string | null;
  aztecAverageScore?: number | null;
  questsCompleted?: number | null;
  externalBadges: ExternalBadge[];
  allowAgents: boolean;
}
```

---

### `publishAndFetchAztecBuilderLeaderboard`

Publish tier proof to L1 and wait for indexer to ingest, then return updated leaderboard.

```typescript
function publishAndFetchAztecBuilderLeaderboard(
  params: PublishAndFetchParams
): Promise<PublishAndFetchResult>
```

**Parameters:**
```typescript
interface PublishAndFetchParams {
  chainId: number;
  userAddress: string;
  minTier: number;
  minAverageScore: number;
  signer: ethers.Signer;
  aztecClient: AztecClient;
  indexerBaseUrl?: string;
  pollIntervalMs?: number;
  maxAttempts?: number;
}
```

**Returns:**
```typescript
interface PublishAndFetchResult {
  txHash: string;
  skillHash: string;
  leaderboard: LeaderboardEntry[];
  isHumanVerified: boolean;
  indexerAvailable?: boolean;
  warning?: string;
}
```

---

### `submitTierProofWithSBTCheck`

Submit tier proof to L1 with optional SBT verification.

```typescript
function submitTierProofWithSBTCheck(
  params: SubmitTierProofParams
): Promise<SubmitTierProofResult>
```

**Parameters:**
```typescript
interface SubmitTierProofParams {
  chainId: number;
  userAddress: string;
  minTier: number;
  minAverageScore: number;
  skillPathId?: string;
  signer: ethers.Signer;
  aztecClient: AztecClient;
}
```

**Returns:**
```typescript
interface SubmitTierProofResult {
  txHash: string;
  skillHash: string;
  isHumanVerified: boolean;
}
```

---

## Stable Classes

### `LeaderboardClient`

Client for interacting with the leaderboard indexer API.

```typescript
class LeaderboardClient {
  constructor(config: LeaderboardClientConfig)
  
  async getLeaderboard(
    skillHash: SkillHash,
    humanOnly?: boolean,
    chainId?: number
  ): Promise<LeaderboardEntry[]>
  
  async getUserSkills(address: Address): Promise<UserSkill[]>
}
```

**Configuration:**
```typescript
interface LeaderboardClientConfig {
  baseUrl: string;
}
```

---

### `MockLeaderboardClient`

Mock implementation for development/testing.

```typescript
class MockLeaderboardClient extends LeaderboardClient {
  constructor(config?: LeaderboardClientConfig)
  
  setMockData(data: LeaderboardEntry[]): void
  
  async getLeaderboard(
    skillHash: SkillHash
  ): Promise<LeaderboardEntry[]>
  
  async getUserSkills(address: Address): Promise<UserSkill[]>
}
```

---

## Type Definitions

### `LeaderboardEntry`

```typescript
interface LeaderboardEntry {
  id: number;
  user_address: Address;
  skill_hash: SkillHash;
  tier: number;
  block_number: number;
  tx_hash: string;
  timestamp: number;
  created_at: number;
  ensName?: string;
  isHumanVerified?: boolean;
}
```

### `UserSkill`

```typescript
interface UserSkill {
  id: number;
  user_address: Address;
  skill_hash: SkillHash;
  tier: number;
  block_number: number;
  tx_hash: string;
  timestamp: number;
  created_at: number;
  ensName?: string;
}
```

### `ExternalBadge`

```typescript
type ExternalBadge = {
  id: string;
  label: string;
  source: 'poap' | 'sbt' | 'github' | 'other';
  chainId?: number;
  contract?: string;
  tokenId?: string;
  url?: string;
}
```

---

## Import Path

All functions and classes are exported from:

```typescript
import {
  getSkillProfile,
  publishAndFetchAztecBuilderLeaderboard,
  submitTierProofWithSBTCheck,
  LeaderboardClient,
  MockLeaderboardClient,
  type SkillProfile,
  type LeaderboardEntry,
  type UserSkill,
  type ExternalBadge,
} from '@hidden-garden/core-logic';
```

---

## Stability Guarantee

✅ **These APIs are frozen and will not change in breaking ways.**

- Function signatures will remain stable
- Return types will remain stable
- Required parameters will not be removed
- Optional parameters may be added (backward compatible)

❌ **Breaking changes are not allowed:**
- Removing parameters
- Changing parameter types
- Changing return types
- Removing exported functions/classes

✅ **Safe changes (allowed):**
- Adding optional parameters
- Adding new functions (non-breaking)
- Adding new optional fields to return types
- Bug fixes and performance improvements

---

**For questions or clarifications, contact the backend team (Team A).**

