/**
 * Quest Logic Types
 * 
 * Core type definitions for the AztecBat learning pathway.
 * These types are based on the curriculum specification at `/docs/aztecbat_curriculum.md`.
 */

// ============================================================================
// Base Types
// ============================================================================

/**
 * Quest ID string
 * Human-readable identifier for a quest (e.g., "aztec_concept_quiz")
 * This will be hashed to create the quest_id_hash for storage
 */
export type QuestId = string;

/**
 * Quest ID Hash
 * The hashed version of a quest_id (Field in Noir, bytes32 in Solidity)
 * Represented as a 0x-prefixed hex string in TypeScript
 * Computed using keccak256 hash of the quest_id string
 */
export type QuestIdHash = `0x${string}`;

/**
 * Tier number (1-4)
 * Represents the mastery level in the Aztec Builder pathway
 */
export type TierNumber = 1 | 2 | 3 | 4;

/**
 * Category identifier
 * Currently only "aztec_builder" is supported, but allows for future extension
 * to other learning pathways (e.g., "zkpassport_basics", "noir_advanced")
 */
export type CategoryId = 'aztec_builder';

/**
 * Category Hash
 * The hashed version of the category (Field in Noir, bytes32 in Solidity)
 * Computed using keccak256 hash of the category string
 */
export type CategoryHash = `0x${string}`;

// ============================================================================
// Puzzle Types
// ============================================================================

/**
 * Puzzle type identifiers
 * Defines the different types of puzzles that can be presented to users
 * Aligned with the curriculum specification
 */
export type PuzzleType =
  | 'multiple_choice'
  | 'numeric_input'
  | 'structured_text'
  | 'devnet_tx'
  | 'puzzle_logic';

/**
 * Tier type alias (for backward compatibility and clarity)
 * @deprecated Use TierNumber instead
 */
export type Tier = TierNumber;

/**
 * Quest Category type alias (for backward compatibility)
 * @deprecated Use CategoryId instead
 */
export type QuestCategory = CategoryId;

/**
 * Score value (0-100)
 * Represents the completion score for a quest
 */
export type QuestScore = number; // 0-100

/**
 * Validation result
 * Result of validating a quest submission
 */
export interface ValidationResult {
  /** Whether the submission is valid/passing */
  success: boolean;
  /** Calculated score (0-100) as per curriculum */
  score: number;
  /** Optional human-readable feedback message for the user */
  feedback?: string;
}

/**
 * Multiple choice submission
 * User selects an option by ID
 */
export interface MultipleChoiceSubmission {
  selectedOptionId: string;
}

/**
 * Numeric input submission
 * User enters a number
 */
export interface NumericInputSubmission {
  value: number;
}

/**
 * Structured text submission
 * User provides structured text (code snippet, JSON, etc.)
 */
export interface StructuredTextSubmission {
  text: string;
}

/**
 * Devnet transaction submission
 * User submits a transaction hash from Aztec devnet
 */
export interface DevnetTxSubmission {
  txHash: `0x${string}`;
}

/**
 * Puzzle logic submission
 * Can be one of the above or custom structure; keep it generic
 */
export interface PuzzleLogicSubmission {
  payload: unknown;
}

/**
 * Quest submission union type
 * Represents any valid submission type for a quest
 */
export type QuestSubmission =
  | MultipleChoiceSubmission
  | NumericInputSubmission
  | StructuredTextSubmission
  | DevnetTxSubmission
  | PuzzleLogicSubmission;

/**
 * Puzzle metadata
 * Static metadata about a puzzle (does not include validation logic)
 * Used for registry and metadata lookups
 */
export interface PuzzleMetadata {
  /** Unique quest identifier (human-readable) */
  questId: QuestId;
  /** Puzzle name for display */
  name: string;
  /** Tier this puzzle belongs to */
  tier: TierNumber;
  /** Type of puzzle */
  puzzleType: PuzzleType;
  /** Puzzle prompt/question text */
  prompt: string;
  /** Optional: Additional context or code snippets */
  context?: string;
  /** Optional: Whether this puzzle is optional/extra credit */
  optional?: boolean;
  /** Optional: Dependencies on other quests */
  dependencies?: QuestId[];
}

/**
 * Quest definition
 * Complete quest specification including validation logic
 * Based on the curriculum specification at `/docs/aztecbat_curriculum.md`
 * 
 * Note: The `validate` function implementation will be provided by concrete
 * quest implementations. This interface defines the contract that all quest
 * implementations must satisfy.
 */
export interface QuestDefinition {
  /** Unique quest identifier (human-readable) */
  questId: QuestId;
  /** Hashed quest identifier (computed from questId) */
  questIdHash: QuestIdHash;
  /** Tier this quest belongs to */
  tier: TierNumber;
  /** Category identifier (e.g., "aztec_builder") */
  category: CategoryId;
  /** Type of puzzle */
  type: PuzzleType;
  /** Quest name for display */
  name: string;
  /** User-facing prompt/question text */
  prompt: string;
  
  /** 
   * Structured metadata derived from the curriculum document
   * Description of the expected answer format or correct answer
   */
  expectedAnswerDescription?: string;
  
  /** 
   * Dependencies on other quests
   * Quests that must be completed before this quest can be attempted
   */
  dependencies?: QuestId[];
  
  /**
   * Validation function
   * Validates a quest submission and returns a validation result
   * 
   * Implementation note: This function will be implemented by concrete
   * quest classes. The implementation should:
   * - Parse the submission based on puzzle type
   * - Apply validation logic as specified in the curriculum
   * - Return a ValidationResult with success, score (0-100), and optional feedback
   * 
   * @param submission The user's submission for this quest
   * @returns Validation result with success status, score, and feedback
   */
  validate(submission: QuestSubmission): Promise<ValidationResult> | ValidationResult;
}

/**
 * Puzzle definition (legacy alias)
 * @deprecated Use QuestDefinition instead
 */
export interface PuzzleDefinition extends QuestDefinition {}

/**
 * Quest completion record
 * Represents a completed quest with score
 */
export interface QuestCompletion {
  /** Quest identifier */
  questId: QuestId;
  /** Completion score (0-100) */
  score: QuestScore;
  /** Whether the quest passed (score >= passing threshold) */
  completed: boolean;
  /** Timestamp of completion (Unix timestamp in seconds) */
  timestamp: number;
}

/**
 * Tier requirements
 * Defines what is required to achieve a tier
 */
export interface TierRequirements {
  /** Tier number */
  tier: TierNumber;
  /** Required quest IDs for this tier */
  requiredQuests: QuestId[];
  /** Minimum average score across required quests */
  minAverageScore: QuestScore;
  /** Prerequisite tier (must complete this tier first) */
  prerequisiteTier?: TierNumber;
}

/**
 * Tier proof inputs
 * Inputs required to generate a tier proof
 */
export interface TierProofInputs {
  /** Minimum tier to prove */
  minTier: TierNumber;
  /** Minimum average score required */
  minAverageScore: QuestScore;
  /** User's Aztec address */
  userAddress: string; // Will be converted to AztecAddress in Noir
}

/**
 * Quest registry entry
 * Entry in the quest registry mapping quest IDs to quest definitions
 */
export interface QuestRegistryEntry {
  /** Quest metadata */
  metadata: PuzzleMetadata;
  /** Reference to quest definition (may be lazy-loaded) */
  quest?: QuestDefinition;
}

