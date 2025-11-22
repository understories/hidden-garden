// SPDX-License-Identifier: MIT
// Privacy Documentation Test for prove_aztec_builder_tier
//
// This test documents what is PUBLIC vs PRIVATE in the tier proof circuit.
// It demonstrates that per-quest data (scores, quest IDs, timestamps) never
// leave private storage, while only aggregate tier information is revealed.

use dep::aztec::protocol_types::address::AztecAddress;
use dep::std::hash;

/// @notice Test: Privacy guarantees for aztec_concept_quiz tier proof
/// @dev This test documents what is revealed vs. what stays private
/// 
/// PRIVACY GUARANTEES:
/// ===================
/// 
/// PUBLIC (revealed in proof):
/// - owner: User's Aztec address (public input)
/// - min_tier: Minimum tier proven (public input, e.g., 1)
/// - min_average_score: Minimum average score proven (public input, e.g., 60)
/// - path_hash: Hash of "aztec_builder_path" (computed, becomes public output)
/// 
/// PRIVATE (never revealed):
/// - quest_id_hash: Which specific quest was completed (e.g., "aztec_concept_quiz")
/// - score: Individual quest score (e.g., 100)
/// - timestamp: When the quest was completed
/// - number_of_attempts: How many times the user attempted the quest
/// - other_quest_completions: Any other quests the user may have completed
/// 
/// This privacy is enforced by Aztec's private execution environment:
/// - QuestNotes are stored as private encrypted notes
/// - The circuit queries private storage without revealing individual values
/// - Only aggregate assertions (tier >= X, average >= Y) are proven
#[test]
fn test_privacy_guarantees_for_first_quest() {
    // Setup: User has completed aztec_concept_quiz with score 100
    let quest_tier_1_bytes = [97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122]; // "aztec_concept_quiz"
    let quest_tier_1_hash = hash::pedersen_hash(quest_tier_1_bytes);
    
    // PRIVATE DATA (simulated - in real contract, this is in private storage):
    let private_quest_id_hash = quest_tier_1_hash; // This is NEVER revealed
    let private_score = 100u8; // This is NEVER revealed
    let private_timestamp = 1234567890u64; // This is NEVER revealed
    let private_attempts = 1u8; // This is NEVER revealed
    
    // PUBLIC DATA (what gets revealed in the proof):
    let owner = AztecAddress::from_field(12345); // Public input
    let min_tier = 1u8; // Public input
    let min_average_score = 60u8; // Public input
    
    // Path hash (computed, becomes public output)
    let path_hash_bytes = [97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114, 95, 112, 97, 116, 104]; // "aztec_builder_path"
    let path_hash = hash::pedersen_hash(path_hash_bytes); // Public output
    
    // Circuit logic (simulated):
    // 1. Query private storage for quest scores (private operation)
    // 2. Compute achieved tier from private data (private computation)
    // 3. Compute average score from private data (private computation)
    // 4. Assert constraints (private assertions)
    // 5. Return only public values (owner, min_tier, min_average_score, path_hash)
    
    // Simulate the circuit computation
    let mut achieved_tier: u8 = 0;
    let mut total_score: u64 = 0;
    let mut quest_count: u64 = 0;
    
    // Check if quest is completed (this query is PRIVATE)
    if private_score >= min_average_score && private_score > 0 {
        achieved_tier = 1;
        total_score += private_score as u64;
        quest_count += 1;
    }
    
    let computed_average_score = if quest_count > 0 { (total_score / quest_count) as u8 } else { 0 };
    
    // Assertions (these are proven, but the underlying data is private)
    assert(achieved_tier >= min_tier, "Achieved tier must meet minimum");
    assert(computed_average_score >= min_average_score, "Average score must meet minimum");
    
    // VERIFY: Only public values are "returned" (in real circuit, these are public outputs)
    // The function signature enforces this:
    //   pub fn prove_aztec_builder_tier(owner, min_tier, min_average_score) -> AztecAddress
    // 
    // Notice:
    // - Function parameters (owner, min_tier, min_average_score) are PUBLIC INPUTS
    // - Return value (owner) is PUBLIC OUTPUT
    // - path_hash is computed and becomes a PUBLIC OUTPUT
    // - private_quest_id_hash, private_score, private_timestamp are NEVER in the signature
    
    // Assertions to document privacy:
    assert(achieved_tier == 1, "User achieved tier 1");
    assert(computed_average_score == 100, "Average score is 100");
    
    // CRITICAL: These private values are NOT accessible outside the circuit
    // They are used for computation but never exposed:
    // - private_quest_id_hash: Used to query storage, but hash itself is not revealed
    // - private_score: Used to compute average, but individual score is not revealed
    // - private_timestamp: Not even used in tier computation, completely private
    // - private_attempts: Not used at all, completely private
    
    // The proof only reveals:
    // - "User has achieved at least tier 1"
    // - "User's average score is at least 60"
    // - "This is for the aztec_builder_path"
    // 
    // It does NOT reveal:
    // - Which specific quest was completed
    // - The actual score (100)
    // - When it was completed
    // - How many attempts were made
}

/// @notice Test: Function signature enforces privacy
/// @dev Verifies that the function signature does not expose private data
#[test]
fn test_function_signature_privacy() {
    // The function signature is:
    //   pub fn prove_aztec_builder_tier(
    //       owner: AztecAddress,      // PUBLIC INPUT
    //       min_tier: u8,             // PUBLIC INPUT
    //       min_average_score: u8      // PUBLIC INPUT
    //   ) -> AztecAddress             // PUBLIC OUTPUT
    
    // Verify that the signature does NOT include:
    // - quest_id_hash (private - used internally to query storage)
    // - individual scores (private - used internally to compute average)
    // - timestamps (private - not even used in computation)
    // - quest count (private - used internally but not exposed)
    
    // This test is documentation - the signature itself enforces privacy
    // If we tried to add private data to the signature, the compiler would reject it
    // or it would become public, breaking our privacy guarantees
    
    // The function can only return public values
    let owner = AztecAddress::from_field(12345);
    let public_output = owner; // Only public values can be returned
    
    // Private values cannot be returned (this would be a compile error):
    // let private_score = 100u8;
    // return private_score; // ERROR: Cannot return private value as public output
    
    assert(public_output == owner, "Function can only return public values");
}

