# Team A: Aztec Devnet Integration Status for First Quest

**Goal:** Implement real Aztec devnet integration for `aztec_concept_quiz` end-to-end.

**Date:** November 2025  
**Status:** Discovery Phase - Documentation Only

---

## Summary of Current State

### PrivateIdentityGarden Contract API

The `PrivateIdentityGarden` contract (`packages/core-logic/src/main.nr`) provides two key functions for the quest flow:

1. **`add_quest_completion(owner, quest_id_hash, score)`**
   - Stores quest completion as a private `QuestNote` in the user's Aztec vault
   - Uses `pedersen_hash` to compute category hash from "aztec_builder" string bytes
   - Stores best score in private storage: `quest_scores[owner][quest_id_hash]`
   - Creates a private note: `Note::new(QuestNote { quest_id_hash, category_hash, score, timestamp })`
   - **Current Status:** ✅ Implemented in Noir, ⚠️ Not yet called via real Aztec SDK

2. **`prove_aztec_builder_tier(owner, min_tier, min_average_score) -> AztecAddress`**
   - Queries private storage for quest scores
   - Hardcodes quest→tier mapping using `pedersen_hash`:
     - Tier 1: `pedersen_hash("aztec_concept_quiz" bytes)`
     - Tier 2: `pedersen_hash("noir_basic_puzzle" bytes)`
     - Tier 3: `pedersen_hash("first_private_tx" bytes)`
     - Tier 4: `pedersen_hash("identity_architect_scenario" bytes)`
   - Computes achieved tier and average score
   - Asserts: `achieved_tier >= min_tier` AND `average_score >= min_average_score`
   - Returns owner address as public output
   - **Current Status:** ✅ Implemented in Noir, ⚠️ Not yet called via real Aztec SDK

**QuestNote Structure:**
```noir
struct QuestNote {
    quest_id_hash: Field,
    category_hash: Field,  // pedersen_hash("aztec_builder")
    score: u8,              // 0-100
    timestamp: u64,         // Currently 0 (not easily accessible)
}
```

---

## File Locations & Responsibilities

### Core Logic (Team A Owns)

#### Noir Contract
- **`packages/core-logic/src/main.nr`**
  - Contains `PrivateIdentityGarden` contract
  - Implements `add_quest_completion()` and `prove_aztec_builder_tier()`
  - Uses `pedersen_hash` for string hashing (NOT keccak256)
  - **Aztec Version:** `aztec-packages-v0.90.0` (from `Nargo.toml`)
  - **Status:** ✅ Implemented, needs compilation for latest devnet

#### Aztec Client Interface
- **`packages/core-logic/src/aztecClient.ts`**
  - Defines `AztecClient` interface with:
    - `getAddress()` - Get user's Aztec address
    - `addQuestCompletion(questIdHash, score)` - Store quest in private vault
    - `proveAztecBuilderTier(minTier, minAverageScore)` - Generate tier proof
  - Provides `MockAztecClient` implementation (simulates SDK calls)
  - **Status:** ✅ Interface defined, ⚠️ Mock implementation only

#### Quest Hashing Utilities
- **`packages/core-logic/src/quests/hashing.ts`**
  - `computeQuestIdHash(questId)` - Uses **keccak256** (ethers.js)
  - `computeCategoryHash(categoryId)` - Uses **keccak256**
  - `computePathHash(pathName)` - Uses **keccak256**
  - **⚠️ CRITICAL MISMATCH:** Noir uses `pedersen_hash`, TypeScript uses `keccak256`
  - **Status:** ✅ Implemented, but hash algorithm mismatch with Noir

#### Quest Mapping & Types
- **`packages/core-logic/src/quests/mapping.ts`**
  - Defines `AZTEC_BUILDER_CATEGORY`, `AZTEC_BUILDER_CATEGORY_HASH`, `PATH_HASH`
  - Uses `computeCategoryHash()` and `computePathHash()` (keccak256)
  - **Status:** ✅ Implemented, but hash mismatch with Noir

- **`packages/core-logic/src/quests/types.ts`**
  - Core quest types: `QuestId`, `QuestIdHash`, `TierNumber`, `PuzzleType`, etc.
  - Submission types: `MultipleChoiceSubmission`, `NumericInputSubmission`, etc.
  - **Status:** ✅ Stable, no changes needed

#### Contract Integration
- **`packages/core-logic/src/contracts.ts`**
  - L1 contract addresses and ABIs
  - `SkillLeaderboardAbi` includes `submitSkillTierWithProof()`
  - **Status:** ✅ Ready for L1 submission

#### Tests
- **`packages/core-logic/tests/prove_aztec_builder_tier_test.nr`**
  - Noir tests for tier proof circuit
  - Tests tier progression, score assertions, edge cases
  - **Status:** ✅ Tests exist, need to verify with latest Aztec version

### Game Engine (Shared)

#### Quest Registry
- **`packages/game-engine/src/registry.ts`**
  - Contains `questRegistry` with all 19 quest definitions
  - `aztec_concept_quiz` has **implemented** validation function
  - Uses `computeQuestIdHash()` to set `questIdHash` (keccak256)
  - **Status:** ✅ First quest implemented, ⚠️ Hash mismatch with Noir

### UI (Team B Owns)

#### Quest Completion Page
- **`apps/aztecbat-ui/app/quests/[questId]/page.tsx`**
  - Complete UI flow: validate → store in Aztec → generate proof → publish to L1
  - Currently uses `MockAztecClient` (line 45)
  - Calls `aztecClient.addQuestCompletion()` and `aztecClient.proveAztecBuilderTier()`
  - Uses wagmi for L1 contract submission
  - **Status:** ✅ UI flow complete, ⚠️ Uses mock Aztec client

---

## What is Currently Mocked

### 1. Aztec SDK Client (`MockAztecClient`)

**Location:** `packages/core-logic/src/aztecClient.ts` (lines 94-147)

**What it mocks:**
- ✅ `getAddress()` - Returns mock address: `'aztec1mockuser123456789'`
- ✅ `addQuestCompletion()` - Stores in-memory Map, returns fake transaction hash
- ✅ `proveAztecBuilderTier()` - Returns mock proof: `0x0000...` (128 zeros)

**What needs to be real:**
- Real Aztec SDK initialization and connection
- Real private function calls to `add_quest_completion()`
- Real proof generation via Aztec SDK
- Real transaction submission to Aztec devnet

### 2. Proof Generation

**Current:** Mock proof with all zeros

**Needs:** Real ZK proof from `prove_aztec_builder_tier()` circuit execution

### 3. On-Chain Submission

**Current:** L1 contract submission is real (via wagmi), but proof is fake

**Needs:** Real proof that can be verified by L1 contract

---

## Critical Gaps & TODOs

### 🔴 Critical: Hash Algorithm Mismatch

**Problem:**
- Noir contract uses `pedersen_hash()` for string hashing
- TypeScript code uses `keccak256()` (ethers.js)

**Impact:**
- Quest ID hashes won't match between TypeScript and Noir
- Category hashes won't match
- Path hashes won't match
- Circuit will fail to find quest completions

**Files Affected:**
- `packages/core-logic/src/quests/hashing.ts` - Uses keccak256
- `packages/core-logic/src/quests/mapping.ts` - Uses keccak256 hashes
- `packages/game-engine/src/registry.ts` - Uses keccak256 for questIdHash

**Solution Needed:**
- Either: Update Noir to use keccak256 (if Aztec supports it)
- Or: Update TypeScript to use pedersen_hash (requires Aztec SDK or compatible library)
- **Must be consistent across both codebases**

### 🟡 High Priority: Aztec SDK Integration

**Missing:**
- No `@aztec/aztec.js` or similar SDK package installed
- No Aztec client initialization code
- No connection to Aztec devnet
- No private function call implementation

**Needed:**
- Install Aztec JS SDK: `@aztec/aztec.js` (or latest equivalent)
- Create real `AztecClient` implementation
- Initialize Aztec client with devnet connection
- Implement `addQuestCompletion()` using SDK's private function call API
- Implement `proveAztecBuilderTier()` using SDK's proof generation API

### 🟡 High Priority: Contract Compilation & Deployment

**Missing:**
- Contract not compiled for latest Aztec devnet
- Contract not deployed to devnet
- No contract address available

**Needed:**
- Compile `main.nr` with latest Aztec tooling
- Deploy to Aztec devnet
- Update contract address in codebase
- Verify contract functions are callable

### 🟡 Medium Priority: Hash Computation Consistency

**Current State:**
- Noir: `pedersen_hash([97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122])` for "aztec_concept_quiz"
- TypeScript: `keccak256(toUtf8Bytes("aztec_concept_quiz"))`

**Needed:**
- Single source of truth for hash computation
- Helper function that computes hashes the same way in both environments
- Tests to verify hash consistency

### 🟡 Medium Priority: Timestamp Handling

**Current:**
- Noir contract sets `timestamp: u64 = 0` (not easily accessible)

**Considerations:**
- May need to pass timestamp from client
- Or use Aztec's block timestamp API if available
- Or keep 0 for now (acceptable for MVP)

### 🟢 Low Priority: Test Coverage

**Current:**
- Noir tests exist but may need updates for latest Aztec version
- No integration tests for full flow
- No tests for hash consistency

**Needed:**
- Verify Noir tests pass with latest Aztec tooling
- Add integration tests for quest → Aztec → proof → L1 flow
- Add hash consistency tests

---

## File Inventory

### Team A Core Files

| File | Purpose | Status |
|------|---------|--------|
| `packages/core-logic/src/main.nr` | Noir contract with quest functions | ✅ Implemented |
| `packages/core-logic/src/aztecClient.ts` | Aztec SDK interface + mock | ✅ Interface ready, ⚠️ Mock only |
| `packages/core-logic/src/quests/hashing.ts` | Quest ID hash computation | ✅ Implemented, ⚠️ Wrong algorithm |
| `packages/core-logic/src/quests/mapping.ts` | Quest→Tier mappings, category hashes | ✅ Implemented, ⚠️ Hash mismatch |
| `packages/core-logic/src/quests/types.ts` | Core quest type definitions | ✅ Stable |
| `packages/core-logic/src/contracts.ts` | L1 contract addresses & ABIs | ✅ Ready |
| `packages/core-logic/tests/prove_aztec_builder_tier_test.nr` | Noir circuit tests | ✅ Exists, needs verification |
| `packages/core-logic/Nargo.toml` | Noir package config | ✅ Uses aztec-packages-v0.90.0 |

### Shared Files

| File | Purpose | Status |
|------|---------|--------|
| `packages/game-engine/src/registry.ts` | Quest registry with validators | ✅ First quest implemented |

### Team B Files (Reference Only)

| File | Purpose | Status |
|------|---------|--------|
| `apps/aztecbat-ui/app/quests/[questId]/page.tsx` | Quest completion UI | ✅ Complete, uses mock client |

---

## Next Steps for Real Integration

### Phase 1: Fix Hash Mismatch
1. Determine which hash algorithm to use (pedersen vs keccak256)
2. Update either Noir or TypeScript to match
3. Add tests to verify hash consistency

### Phase 2: Install & Configure Aztec SDK
1. Install `@aztec/aztec.js` (or latest equivalent)
2. Set up Aztec devnet connection
3. Create real `AztecClient` implementation

### Phase 3: Compile & Deploy Contract
1. Compile `main.nr` with latest Aztec tooling
2. Deploy to devnet
3. Update contract address in codebase

### Phase 4: Implement Real SDK Calls
1. Implement `addQuestCompletion()` with real private function call
2. Implement `proveAztecBuilderTier()` with real proof generation
3. Test end-to-end flow

### Phase 5: Integration Testing
1. Test quest completion → Aztec storage
2. Test tier proof generation
3. Test L1 submission with real proof
4. Verify proof verification on L1

---

## Key Decisions Needed

1. **Hash Algorithm:** pedersen_hash (Noir) vs keccak256 (TypeScript) - which to standardize on?
2. **Aztec SDK Version:** What's the latest stable version for devnet?
3. **Contract Deployment:** Who deploys? Where? How to manage addresses?
4. **Proof Format:** What format does Aztec SDK return? How to encode for L1?

---

## Notes

- The Noir contract is well-structured and ready for integration
- The TypeScript interface is clean and well-defined
- The UI flow is complete and ready to use real client
- **Main blocker:** Hash algorithm mismatch must be resolved first
- **Secondary blocker:** No Aztec SDK installed or configured

---

## Aztec Tooling Setup

### Installed Packages

**Aztec JS SDK:**
- `@aztec/aztec.js@3.0.0-devnet.5` - Installed in `packages/core-logic/package.json`
- Provides TypeScript/JavaScript client for interacting with Aztec contracts
- Used for calling private functions and generating proofs

**Aztec Noir Dependencies:**
- Updated `packages/core-logic/Nargo.toml` to use `v3.0.0-devnet.5` tag
- `aztec` - Aztec.nr standard library
- `easy-private-state` - Private state utilities

**Aztec CLI Tools (Global Installation Required):**
- `aztec` - Main CLI tool
- `aztec-nargo` - Noir compiler for Aztec
- `aztec-up` - Local devnet/sandbox manager
- `aztec-wallet` - Wallet management

**Installation:**
```bash
# Install Aztec CLI tools globally (one-time setup)
bash -i <(curl -s https://install.aztec.network)

# Install npm dependencies (already done)
pnpm install
```

### Available Scripts

**Root Package Scripts:**
- `pnpm aztec:devnet` - Start local Aztec devnet (requires Docker)
  - Runs: `aztec-up 3.0.0-devnet.5`
  - Starts local sandbox environment
- `pnpm aztec:compile` - Compile Noir contract
  - Runs: `aztec-nargo compile` in `packages/core-logic/`
  - Compiles `PrivateIdentityGarden` contract
- `pnpm aztec:test` - Run Aztec integration tests
  - Runs: `aztec-nargo test` in `packages/core-logic/`
  - Executes Noir test files

**Core Logic Package Scripts:**
- `pnpm --filter @hidden-garden/core-logic aztec:compile` - Direct compile
- `pnpm --filter @hidden-garden/core-logic aztec:test` - Direct test

### How to Start Local Devnet

1. **Prerequisites:**
   - Docker must be installed and running
   - Aztec CLI tools installed globally (see Installation above)
   - If `aztec-up` command not found, run: `bash -i <(curl -s https://install.aztec.network)`

2. **Start Devnet:**
   ```bash
   pnpm aztec:devnet
   ```
   This will:
   - Download and start Aztec Sandbox v3.0.0-devnet.5 (first time only)
   - Expose RPC endpoint (typically `http://localhost:8080`)
   - Create pre-funded accounts for testing

3. **Verify Devnet is Running:**
   ```bash
   aztec status
   ```

4. **Stop Devnet:**
   ```bash
   aztec-down
   ```

### How to Compile Noir Contract

1. **Prerequisites:**
   - Aztec CLI tools installed globally (see Installation above)
   - If `aztec-nargo` command not found, run: `bash -i <(curl -s https://install.aztec.network)`

2. **Compile:**
   ```bash
   # From root:
   pnpm aztec:compile
   
   # Or directly:
   cd packages/core-logic
   pnpm aztec:compile
   ```

3. **Expected Output:**
   - Compiled contract artifacts in `target/` directory
   - TypeScript types generated (if configured)
   - Contract bytecode ready for deployment

### How to Run Aztec Tests

1. **Prerequisites:**
   - Aztec CLI tools installed globally (see Installation above)
   - If `aztec-nargo` command not found, run: `bash -i <(curl -s https://install.aztec.network)`

2. **Run Tests:**
   ```bash
   # From root:
   pnpm aztec:test
   
   # Or directly:
   cd packages/core-logic
   pnpm aztec:test
   ```

3. **Test Files:**
   - `packages/core-logic/tests/prove_aztec_builder_tier_test.nr`
   - `packages/core-logic/tests/prove_skill_threshold_test.nr`

4. **Expected Output:**
   - Test results for tier proof logic
   - Verification of quest completion storage
   - Pass/fail status for each test case

### Version Requirements

**This project expects:**
- Aztec Sandbox >= 3.0.0-devnet.5
- Aztec CLI tools (latest from install script)
- Docker (for local devnet)
- Node.js >= 20.9.0 (for Next.js compatibility)

**Pinned Versions:**
- `@aztec/aztec.js`: `3.0.0-devnet.5` (exact version)
- Aztec.nr dependencies: `v3.0.0-devnet.5` tag

### Environment Variables (Optional)

For connecting to remote devnet instead of local sandbox:

```bash
export VERSION=3.0.0-devnet.5
export NODE_URL=https://devnet.aztec.network/
export SPONSORED_FPC_ADDRESS=0x280e5686a148059543f4d0968f9a18cd4992520fcd887444b8689bf2726a1f97
```

**Note:** Local sandbox (`aztec-up`) is recommended for development as it provides pre-funded accounts and faster iteration.

---

**Last Updated:** After Aztec tooling installation (Nov 2025)  
**Next Update:** After hash mismatch resolution and real SDK integration

