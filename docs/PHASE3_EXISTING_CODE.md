# Phase 3: Existing Code Documentation

This document catalogs what already exists in the codebase that Team B can reuse for Phase 3 features.

## 1. Self Verification + SBT Checks

### Contract Integration

**Location:** `packages/contracts-public/contracts/SelfHumanSBT.sol`

**What exists:**
- ✅ `SelfHumanSBT` contract that inherits from `SelfVerificationRoot`
- ✅ `verifyAndMint(bytes proofPayload, bytes userContextData)` - Entry point for Self verification
- ✅ `hasValidSBT(address user)` - Check if user has valid SBT
- ✅ `ownerOf(uint256 tokenId)` - Get SBT owner
- ✅ `balanceOf(address owner)` - Get SBT balance
- ✅ Event: `HumanVerified(address indexed user, uint256 tokenId)`

**Contract Addresses:**
- Location: `packages/core-logic/src/contracts.ts`
- Function: `getSelfHumanSBTAddress(chainId: SupportedChainId)`
- Default (local): `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- Chain configs: Local (31337), Sepolia (11155111)

**ABI:**
- Location: `packages/core-logic/src/contracts.ts`
- Export: `SelfHumanSBTAbi`
- Also exported from: `packages/common/src/index.ts`

**Documentation:**
- Location: `docs/self-integration.md`
- Complete integration guide with:
  - Self Protocol flow explanation
  - Scope and security guidelines
  - Data extraction from verification output
  - References to Self.xyz docs

**Helper Scripts:**
- Location: `scripts/verify-sbt.ts`
- Usage: `pnpm verify:sbt <address>`
- Verifies SBT ownership on-chain

**Playground Example:**
- Location: `playground/main.ts`
- Lines 337-405: Complete SBT verification flow example
- Shows how to check `hasValidSBT`, `ownerOf`, `balanceOf`

### Frontend Integration Points

**What's needed:**
- Self SDK integration for proof generation
- Frontend config matching contract config
- Proof payload generation from Self SDK
- Contract interaction via wagmi/viem

**What exists:**
- ✅ Contract ABI and addresses in `@hidden-garden/common`
- ✅ Contract interaction utilities in `packages/core-logic/src/contracts.ts`
- ✅ Example in playground showing verification flow

---

## 2. Skill Proof Generation + Leaderboard Submission

### Contract Integration

**Location:** `packages/contracts-public/contracts/SkillLeaderboard.sol`

**What exists:**
- ✅ `submitSkillTier(bytes32 skillHash, uint8 tier)` - V1 plain submission (requires SBT)
- ✅ `submitSkillTierWithProof(bytes32 skillHash, uint8 minLevel, bytes proof, bytes publicInputs)` - V2 ZK proof submission
- ✅ `skillTier(bytes32 skillHash, address user)` - View function to check user's tier
- ✅ Event: `SkillRevealed(address indexed user, bytes32 indexed skillHash, uint8 tier)`
- ✅ SBT requirement: Both functions check `selfHumanSBT.hasValidSBT(msg.sender)`

**Contract Addresses:**
- Location: `packages/core-logic/src/contracts.ts`
- Function: `getSkillLeaderboardAddress(chainId: SupportedChainId)`
- Default (local): `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`

**ABI:**
- Location: `packages/core-logic/src/contracts.ts`
- Export: `SkillLeaderboardAbi`
- Also exported from: `packages/common/src/index.ts`

**Skill Hashing:**
- Location: `packages/core-logic/src/skills.ts`
- Function: `hashSkillName(skillName: string): SkillHash`
- Returns: `keccak256(utf8(skillName))` as `0x${string}`

**Public Inputs Format:**
- Format: `abi.encode(userAddress, skillHash, minLevel)`
- userAddress: `address` (20 bytes)
- skillHash: `bytes32` (32 bytes)
- minLevel: `uint8` (1 byte)
- Total: 53 bytes

### Proof Generation (Aztec/Noir)

**Circuit Location:** `packages/core-logic/src/main.nr`

**What exists:**
- ✅ Noir circuit for skill tier proofs
- ✅ Function: `prove_skill_threshold(owner, skill_hash, min_level)`
- ✅ Public outputs for L1 verification
- ✅ Private skill tree state management

**Aztec Integration:**
- Location: `packages/circuits-aztec/`
- Aztec-specific circuit implementations
- Integration with Aztec L2 for private execution

**Documentation:**
- Location: `docs/aztecbat_curriculum.md`
- Lines 902-972: Step-by-step proof generation and submission flow
- Includes backend API endpoint: `POST /api/aztec/generate-proof`

### Leaderboard Client

**Location:** `packages/core-logic/src/leaderboardClient.ts`

**What exists:**
- ✅ `LeaderboardClient` class for indexer API interaction
- ✅ `getLeaderboard(skillHash: SkillHash): Promise<LeaderboardEntry[]>`
- ✅ `getUserSkills(address: Address): Promise<UserSkill[]>`
- ✅ Helper: `getAztecBuilderLeaderboard(client: LeaderboardClient)`

**Indexer API:**
- Base URL configurable via `LeaderboardClientConfig`
- Endpoints:
  - `GET /leaderboard?skillHash=0x...`
  - `GET /user/{address}/skills`

**Types:**
- `LeaderboardEntry` - Includes user_address, skill_hash, tier, timestamp, ensName
- `UserSkill` - Similar structure for user-specific queries

### Playground Examples

**Location:** `playground/main.ts`

**What exists:**
- Lines 469-518: Plain skill tier submission example
- Lines 521-577: ZK proof submission example
- Shows contract interaction, transaction handling, error management

---

## 3. ENS Integration

### Utilities

**Location:** `packages/common/src/ens.ts` (also in `packages/core-logic/src/ens.ts`)

**What exists:**
- ✅ `shortenAddress(address: string): string` - Format address as `0x1234…abcd`
- ✅ `getEnsName(client: EnsPublicClient, address: 0x${string}): Promise<string | null>`
- ✅ `EnsPublicClient` interface - Generic interface for ENS resolution

**Interface:**
```typescript
export interface EnsPublicClient {
  getEnsName(args: { address: `0x${string}` }): Promise<string | null>;
}
```

### Viem Client Setup

**Location:** `apps/web/lib/viemClients.ts` (if exists in web app)

**What exists:**
- ✅ `mainnetPublicClient` - Viem public client for Ethereum mainnet
- ✅ Configured with LlamaRPC as default RPC
- ✅ Environment variable: `NEXT_PUBLIC_MAINNET_RPC_URL`

**Usage Pattern:**
```typescript
import { mainnetPublicClient } from '../lib/viemClients';
import { getEnsName } from '@hidden-garden/common';

const ensName = await getEnsName(
  mainnetPublicClient as unknown as EnsPublicClient,
  address
);
```

### Indexer ENS Resolution

**Location:** `services/indexer/src/ens.ts`

**What exists:**
- ✅ ENS resolution utilities for indexer service
- ✅ Batch resolution capabilities
- ✅ Caching mechanisms

### Current Usage

**In Web App:**
- ✅ `ConnectButton` component resolves ENS for connected wallet
- ✅ `/u/[identifier]` page resolves ENS names and addresses
- ✅ Leaderboard displays ENS names when available

**In Indexer:**
- ✅ Leaderboard entries include optional `ensName` field
- ✅ User skills include optional `ensName` field

---

## Summary: What Team B Can Reuse

### ✅ Ready to Use

1. **SelfHumanSBT Contract:**
   - Contract addresses and ABIs exported from `@hidden-garden/common`
   - `hasValidSBT()` check function
   - `verifyAndMint()` for Self verification flow
   - Complete documentation in `docs/self-integration.md`

2. **SkillLeaderboard Contract:**
   - Contract addresses and ABIs exported from `@hidden-garden/common`
   - `submitSkillTier()` for plain submissions
   - `submitSkillTierWithProof()` for ZK proof submissions
   - `skillTier()` view function
   - `hashSkillName()` utility for skill hashing

3. **ENS Utilities:**
   - `shortenAddress()` helper
   - `getEnsName()` helper with generic interface
   - Viem client setup pattern
   - Already integrated in web app

4. **Leaderboard Client:**
   - `LeaderboardClient` class for indexer API
   - Type definitions for `LeaderboardEntry` and `UserSkill`
   - Helper functions for common queries

### 🔧 Needs Frontend Integration

1. **Self SDK Integration:**
   - Install Self SDK packages
   - Configure verification config matching contract
   - Generate proof payload from Self SDK
   - Call `verifyAndMint()` with proof

2. **Proof Generation Flow:**
   - Connect to Aztec devnet (if using Aztec)
   - Generate proofs using Noir circuits
   - Encode public inputs correctly
   - Submit via `submitSkillTierWithProof()`

3. **UI Components:**
   - SBT verification status display
   - Self verification flow UI
   - Proof generation UI
   - Leaderboard submission UI

---

## Key Files Reference

### Contracts
- `packages/contracts-public/contracts/SelfHumanSBT.sol`
- `packages/contracts-public/contracts/SkillLeaderboard.sol`

### Core Logic
- `packages/core-logic/src/contracts.ts` - Addresses, ABIs, chain configs
- `packages/core-logic/src/skills.ts` - Skill hashing utilities
- `packages/core-logic/src/leaderboardClient.ts` - Indexer API client
- `packages/core-logic/src/ens.ts` - ENS utilities

### Common Package
- `packages/common/src/index.ts` - Re-exports all contract utilities
- `packages/common/src/ens.ts` - ENS utilities

### Documentation
- `docs/self-integration.md` - Self Protocol integration guide
- `docs/aztecbat_curriculum.md` - Proof generation flow
- `docs/ens-resolution.md` - ENS resolution guide (if exists)

### Examples
- `playground/main.ts` - Complete working examples
- `scripts/verify-sbt.ts` - SBT verification script

---

## Next Steps for Team B

1. **Review existing code** in the files listed above
2. **Understand contract interfaces** from ABIs and Solidity code
3. **Set up frontend dependencies** (Self SDK, wagmi/viem already installed)
4. **Build UI components** that use existing contract utilities
5. **Integrate proof generation** flow (may need backend coordination)
6. **Test with local contracts** using Hardhat addresses

