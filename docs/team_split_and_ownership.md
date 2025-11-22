# Team Split and Ownership

**Purpose:** Define clear ownership boundaries between Team A (core logic) and Team B (UI/game layer) to enable parallel development.

---

## Directory Ownership

### Team A Owns

**Core Logic & Circuits:**
- `packages/core-logic/` - All files
  - Noir circuits (`src/main.nr`, `tests/`)
  - Quest logic interfaces (`quests/types.ts`, `quests/mapping.ts`)
  - Evaluation engine (quest validation interfaces)
  - Contract integration (`contracts.ts`)
  - Core types (`types.ts`, `utils.ts`)
  - **Aztec client (`aztecClient.ts`):** `RealAztecClient` and `MockAztecClient` implementations
  - **Quest hashing (`quests/hashing.ts`):** Pedersen hash utilities matching Noir circuit

**Contracts:**
- `packages/contracts-public/` - All Solidity contracts and deployment scripts

**Documentation:**
- `docs/aztecbat_curriculum.md` - Canonical puzzle specification
- `docs/aztec-integration.md` - Aztec Protocol integration guide
- `docs/teamA_phase2_phase3_summary.md` - Team A handoff documentation

### Team B Owns

**UI & Game Layer:**
- `apps/aztecbat-ui/` - All files
  - Frontend components and pages
  - UI/UX implementation
  - Game progression UI (XP, levels, achievements, dashboards)
  - Quest interaction UI
  - Leaderboard display

**Game Engine Extensions:**
- `packages/game-engine/` - Extension points only
  - Custom quest validators (implementing Team A's interfaces)
  - Game-specific orchestration logic
  - Progression tracking
  - Achievement system

**Documentation:**
- `docs/team_split_and_ownership.md` - This document (maintained by both teams)
- UI/UX design docs
- User-facing documentation

### Shared / Collaborative

**Game Engine Core:**
- `packages/game-engine/` - Core orchestration
  - Quest registry (Team A defines structure, Team B implements validators)
  - Quest→Tier mapping (Team A owns correctness, Team B can extend)
  - Curriculum→Quest translation (Team A owns spec, Team B implements UI flow)

**Shared Infrastructure:**
- `packages/core-logic/src/leaderboardClient.ts` - API client (Team A owns interface, Team B uses)
- `packages/core-logic/src/api.ts` - API types (Team A owns, Team B consumes)

**Documentation:**
- `docs/README.md` - Project overview (both teams contribute)
- `docs/team_split_and_ownership.md` - Ownership definitions (both teams maintain)

---

## Stable API Contract

### `packages/core-logic` → `packages/game-engine` / `apps/aztecbat-ui`

**What is Stable:**

1. **Quest Logic Interfaces** (`packages/core-logic/src/quests/types.ts`)
   ```typescript
   // These interfaces are STABLE - Team A will not break them
   export interface QuestDefinition {
     questId: QuestId;
     questIdHash: QuestIdHash;
     tier: TierNumber;
     category: CategoryId;
     type: PuzzleType;
     name: string;
     prompt: string;
     validate(submission: QuestSubmission): Promise<ValidationResult> | ValidationResult;
   }
   
   export interface ValidationResult {
     success: boolean;
     score: number; // 0-100
     feedback?: string;
   }
   ```

2. **Quest Mapping Functions** (`packages/core-logic/src/quests/mapping.ts`)
   ```typescript
   // These functions are STABLE
   export function getTierForQuest(questId: QuestId): TierNumber | undefined;
   export function getQuestsForTier(tier: TierNumber): QuestId[];
   export function getAllQuestIds(): QuestId[];
   ```

3. **Contract Integration** (`packages/core-logic/src/contracts.ts`)
   ```typescript
   // Contract addresses and ABIs are STABLE
   export const SelfHumanSBTAbi: readonly AbiFunction[];
   export const SkillLeaderboardAbi: readonly AbiFunction[];
   export function getSelfHumanSBTAddress(chainId: SupportedChainId): Address | undefined;
   export function getSkillLeaderboardAddress(chainId: SupportedChainId): Address | undefined;
   ```

4. **Core Types** (`packages/core-logic/src/types.ts`)
   ```typescript
   // These types are STABLE
   export type QuestId = string;
   export type QuestIdHash = `0x${string}`;
   export type TierNumber = 1 | 2 | 3 | 4;
   export type PuzzleType = "multiple_choice" | "numeric_input" | "structured_text" | "devnet_tx" | "puzzle_logic";
   ```

**What Can Change:**

- Internal implementation of quest validation (Team A can refactor, but interface stays)
- Additional quest types (Team A can add new `PuzzleType` values with proper versioning)
- New functions (Team A can add new exports, but won't remove existing ones)
- Noir circuit implementation (Team A can optimize, but public function signatures stay stable)

**Versioning Policy:**

- Breaking changes to stable APIs require:
  1. Major version bump in `package.json`
  2. Migration guide in `docs/`
  3. 2-week notice before breaking change
- Non-breaking additions (new functions, optional parameters) are allowed in minor versions

---

## Team B Usage Examples

### Example 1: Importing Quest Types

```typescript
// ✅ CORRECT: Import from core-logic
import type {
  QuestDefinition,
  QuestSubmission,
  ValidationResult,
  QuestId,
  TierNumber,
} from '@hidden-garden/core-logic';

// ❌ WRONG: Don't import from internal paths
// import type { QuestDefinition } from '@hidden-garden/core-logic/src/quests/types';
```

### Example 2: Implementing Quest Validator

```typescript
// In packages/game-engine/src/validators/multipleChoice.ts
import type {
  QuestDefinition,
  MultipleChoiceSubmission,
  ValidationResult,
} from '@hidden-garden/core-logic';

export function createMultipleChoiceValidator(
  correctOptionId: string
): QuestDefinition['validate'] {
  return (submission: QuestSubmission): ValidationResult => {
    // Type guard
    if (!('selectedOptionId' in submission)) {
      return {
        success: false,
        score: 0,
        feedback: 'Invalid submission type',
      };
    }
    
    const mcSubmission = submission as MultipleChoiceSubmission;
    const isCorrect = mcSubmission.selectedOptionId === correctOptionId;
    
    return {
      success: isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: isCorrect 
        ? 'Correct!' 
        : `Incorrect. The correct answer is option ${correctOptionId}`,
    };
  };
}
```

### Example 3: Calling Contract Functions

```typescript
// In apps/aztecbat-ui/app/quests/[questId]/page.tsx
import {
  SkillLeaderboardAbi,
  getSkillLeaderboardAddress,
  type Address,
} from '@hidden-garden/core-logic';
import { createPublicClient, http } from 'viem';

export async function submitQuestCompletion(
  questIdHash: `0x${string}`,
  score: number,
  chainId: number
) {
  const address = getSkillLeaderboardAddress(chainId);
  if (!address) {
    throw new Error(`No SkillLeaderboard address for chain ${chainId}`);
  }
  
  const client = createPublicClient({
    chain: getChainById(chainId),
    transport: http(),
  });
  
  // Use the stable ABI from core-logic
  const result = await client.writeContract({
    address,
    abi: SkillLeaderboardAbi,
    functionName: 'submitSkillTier',
    args: [questIdHash, Math.floor(score / 10)], // Convert 0-100 to tier 1-10
  });
  
  return result;
}
```

### Example 4: Error Handling

```typescript
// In packages/game-engine/src/orchestrator.ts
import {
  getQuestDefinition,
  type QuestId,
  type ValidationResult,
} from '@hidden-garden/core-logic';

export async function validateQuestSubmission(
  questId: QuestId,
  submission: unknown
): Promise<ValidationResult> {
  try {
    // Get quest definition (may throw if quest not found)
    const quest = getQuestDefinition(questId);
    if (!quest) {
      return {
        success: false,
        score: 0,
        feedback: `Quest ${questId} not found`,
      };
    }
    
    // Validate submission
    const result = await quest.validate(submission);
    return result;
    
  } catch (error) {
    // Handle errors from core-logic gracefully
    if (error instanceof Error) {
      // Check if it's the "not implemented" error
      if (error.message.includes('not implemented')) {
        return {
          success: false,
          score: 0,
          feedback: 'Quest validation not yet implemented',
        };
      }
      
      // Re-throw unexpected errors
      throw error;
    }
    
    // Unknown error type
    return {
      success: false,
      score: 0,
      feedback: 'Unknown validation error',
    };
  }
}
```

### Example 5: Using Leaderboard Client

```typescript
// In apps/aztecbat-ui/app/leaderboard/page.tsx
import { LeaderboardClient, hashSkillName } from '@hidden-garden/core-logic';

export async function getLeaderboardData(skillName: string) {
  const client = new LeaderboardClient({
    baseUrl: process.env.NEXT_PUBLIC_INDEXER_URL || 'http://localhost:4000',
  });
  
  try {
    const skillHash = hashSkillName(skillName);
    const entries = await client.getLeaderboard(skillHash);
    return entries;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    // Return empty array or show error to user
    return [];
  }
}
```

---

## Extension Points for Team B

### 1. Quest Validator Implementation

Team B can implement validators by creating functions that match the `QuestDefinition['validate']` signature:

```typescript
// packages/game-engine/src/validators/
export const validators = {
  multipleChoice: createMultipleChoiceValidator,
  numericInput: createNumericInputValidator,
  structuredText: createStructuredTextValidator,
  devnetTx: createDevnetTxValidator,
  puzzleLogic: createPuzzleLogicValidator,
};
```

### 2. Game Progression Logic

Team B can add game-specific logic in `packages/game-engine/`:

```typescript
// packages/game-engine/src/progression.ts
import type { QuestId, TierNumber } from '@hidden-garden/core-logic';

export interface UserProgress {
  completedQuests: QuestId[];
  currentTier: TierNumber;
  xp: number;
  achievements: string[];
}

export function calculateXP(completedQuests: QuestId[]): number {
  // Team B's XP calculation logic
}
```

### 3. UI Components

Team B owns all UI in `apps/aztecbat-ui/`:

```typescript
// apps/aztecbat-ui/components/QuestCard.tsx
import type { QuestDefinition } from '@hidden-garden/core-logic';

export function QuestCard({ quest }: { quest: QuestDefinition }) {
  // Team B's UI implementation
}
```

---

## Branching Model

See `CONTRIBUTING.md` for the complete branching model. Summary:

- **Long-lived branches:**
  - `team-a/core` - Team A's integration branch
  - `team-b/game-ui` - Team B's integration branch
  - `main` - Final integration branch

- **Feature branches:**
  - Team A: `feat/team-a/<description>`
  - Team B: `feat/team-b/<description>`

- **PR flow:**
  - Team A: `feat/team-a/*` → `team-a/core` → `main`
  - Team B: `feat/team-b/*` → `team-b/game-ui` → `main`

## Development Workflow

### Team A Workflow

1. **Making Changes to Core Logic:**
   - Update `packages/core-logic/` files
   - Ensure stable API contracts are maintained
   - If breaking change needed, bump major version and document migration
   - Run tests: `pnpm --filter @hidden-garden/core-logic test`

2. **Adding New Quest Types:**
   - Add to `PuzzleType` union in `packages/core-logic/src/quests/types.ts`
   - Document in `docs/aztecbat_curriculum.md`
   - Team B will implement validators

3. **Updating Noir Circuits:**
   - Update `packages/core-logic/src/main.nr`
   - Update tests in `packages/core-logic/tests/`
   - Ensure public function signatures remain stable

### Team B Workflow

1. **Implementing Quest Validators:**
   - Create validators in `packages/game-engine/src/validators/`
   - Wire up in quest registry
   - Test using dev UI at `/dev/aztecbat-status`

2. **Building UI:**
   - Create components in `apps/aztecbat-ui/`
   - Import types from `@hidden-garden/core-logic`
   - Use game engine for orchestration

3. **Adding Game Features:**
   - Add to `packages/game-engine/` for shared logic
   - Add to `apps/aztecbat-ui/` for UI-specific features

### Collaboration Points

1. **Quest Registry Updates:**
   - Team A defines quest structure in curriculum
   - Team B implements validators and wires up registry
   - Both teams review before merging

2. **API Changes:**
   - Team A proposes changes to stable APIs
   - Both teams discuss breaking changes
   - Migration plan created before implementation

3. **New Features:**
   - Team B proposes UI/game features
   - Team A reviews for core logic impact
   - Extension points added if needed

---

## Package Dependencies

```
apps/aztecbat-ui
  └── depends on: @hidden-garden/game-engine
       └── depends on: @hidden-garden/core-logic
            └── (no internal dependencies)
```

**Rule:** Dependencies only flow downward. Team B packages can depend on Team A packages, but never the reverse.

---

## Testing Strategy

### Team A Tests

- **Location:** `packages/core-logic/tests/`
- **Scope:** Noir circuit tests, type system tests, contract integration tests
- **Command:** `pnpm --filter @hidden-garden/core-logic test`

### Team B Tests

- **Location:** `packages/game-engine/tests/`, `apps/aztecbat-ui/__tests__/`
- **Scope:** Validator tests, UI component tests, integration tests
- **Command:** `pnpm --filter @hidden-garden/game-engine test`, `pnpm --filter @hidden-garden/aztecbat-ui test`

### Integration Tests

- **Location:** `tests/integration/`
- **Scope:** End-to-end flows (Team A + Team B code together)
- **Ownership:** Both teams maintain

---

## Questions & Disputes

If there's uncertainty about ownership or API stability:

1. **Check this document first** - Most cases should be covered
2. **Check `docs/teamA_phase2_phase3_summary.md`** - For Team A's implementation details
3. **Open a discussion** - Tag both teams for clarification
4. **Update this document** - Once resolved, update ownership definitions

---

**Last Updated:** Initial version (Nov 2025)  
**Maintained By:** Both teams (update when ownership changes)

