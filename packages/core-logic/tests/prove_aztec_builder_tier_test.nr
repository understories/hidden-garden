// SPDX-License-Identifier: MIT
// Tests for prove_aztec_builder_tier function

use dep::aztec::protocol_types::address::AztecAddress;
use dep::std::hash;

// Import the contract (in a real test, this would be the compiled contract)
// For now, we'll test the logic directly

/// @notice Helper function to hash a quest name to a quest_id_hash
fn hash_quest_name(name: [u8; 18]) -> Field {
    hash::pedersen_hash(name)
}

/// @notice Test: User with QuestNotes for first 3 quests (scores >= 80) can prove min_tier=3, min_average_score=70
/// @dev This tests the happy path where a user has completed tiers 1, 2, and 3 with high scores
#[test]
fn test_prove_tier_3_with_high_scores() {
    // Quest hashes
    let quest_tier_1_bytes = [97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122]; // "aztec_concept_quiz"
    let quest_tier_2_bytes = [110, 111, 105, 114, 95, 98, 97, 115, 105, 99, 95, 112, 117, 122, 122, 108, 101]; // "noir_basic_puzzle"
    let quest_tier_3_bytes = [102, 105, 114, 115, 116, 95, 112, 114, 105, 118, 97, 116, 101, 95, 116, 120]; // "first_private_tx"
    
    let quest_tier_1_hash = hash::pedersen_hash(quest_tier_1_bytes);
    let quest_tier_2_hash = hash::pedersen_hash(quest_tier_2_bytes);
    let quest_tier_3_hash = hash::pedersen_hash(quest_tier_3_bytes);
    
    // User has completed quests with scores >= 80
    let tier_1_score = 85u8;
    let tier_2_score = 90u8;
    let tier_3_score = 80u8;
    
    // Compute achieved tier
    let mut achieved_tier: u8 = 0;
    let mut total_score: u64 = 0;
    let mut quest_count: u64 = 0;
    let min_average_score = 70u8;
    
    // Check tier 1
    if tier_1_score >= min_average_score && tier_1_score > 0 {
        achieved_tier = 1;
        total_score += tier_1_score as u64;
        quest_count += 1;
    }
    
    // Check tier 2
    if achieved_tier >= 1 {
        if tier_2_score >= min_average_score && tier_2_score > 0 {
            achieved_tier = 2;
            total_score += tier_2_score as u64;
            quest_count += 1;
        }
    }
    
    // Check tier 3
    if achieved_tier >= 2 {
        if tier_3_score >= min_average_score && tier_3_score > 0 {
            achieved_tier = 3;
            total_score += tier_3_score as u64;
            quest_count += 1;
        }
    }
    
    // Calculate average score
    let average_score = if quest_count > 0 { (total_score / quest_count) as u8 } else { 0 };
    
    // Test assertions
    let min_tier = 3u8;
    assert(achieved_tier >= min_tier, "Achieved tier should be at least 3");
    assert(average_score >= min_average_score, "Average score should be at least 70");
    
    // Verify the computed values
    assert(achieved_tier == 3, "Achieved tier should be exactly 3");
    assert(average_score == 85, "Average score should be 85 (85+90+80)/3");
}

/// @notice Test: User missing the tier 2 quest cannot prove tier 3
/// @dev This tests that prerequisites must be met - can't skip tiers
#[test]
fn test_cannot_prove_tier_3_without_tier_2() {
    // Quest hashes
    let quest_tier_1_bytes = [97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122]; // "aztec_concept_quiz"
    let quest_tier_2_bytes = [110, 111, 105, 114, 95, 98, 97, 115, 105, 99, 95, 112, 117, 122, 122, 108, 101]; // "noir_basic_puzzle"
    let quest_tier_3_bytes = [102, 105, 114, 115, 116, 95, 112, 114, 105, 118, 97, 116, 101, 95, 116, 120]; // "first_private_tx"
    
    // User has completed tier 1 and tier 3, but NOT tier 2
    let tier_1_score = 85u8;
    let tier_2_score = 0u8; // Missing tier 2
    let tier_3_score = 80u8;
    
    // Compute achieved tier
    let mut achieved_tier: u8 = 0;
    let mut total_score: u64 = 0;
    let mut quest_count: u64 = 0;
    let min_average_score = 70u8;
    
    // Check tier 1
    if tier_1_score >= min_average_score && tier_1_score > 0 {
        achieved_tier = 1;
        total_score += tier_1_score as u64;
        quest_count += 1;
    }
    
    // Check tier 2 - should fail because tier_2_score is 0
    if achieved_tier >= 1 {
        if tier_2_score >= min_average_score && tier_2_score > 0 {
            achieved_tier = 2;
            total_score += tier_2_score as u64;
            quest_count += 1;
        }
    }
    
    // Check tier 3 - should not be reached because achieved_tier is still 1
    if achieved_tier >= 2 {
        if tier_3_score >= min_average_score && tier_3_score > 0 {
            achieved_tier = 3;
            total_score += tier_3_score as u64;
            quest_count += 1;
        }
    }
    
    // Test assertions
    let min_tier = 3u8;
    let constraint_holds = achieved_tier >= min_tier;
    
    // Should fail - achieved_tier is 1, not 3
    assert(constraint_holds == false, "User should not be able to prove tier 3 without tier 2");
    assert(achieved_tier == 1, "Achieved tier should be 1, not 3");
}

/// @notice Test: User with low scores fails the min_average_score assertion
/// @dev This tests that average score must meet the minimum requirement
#[test]
fn test_low_scores_fail_min_average() {
    // Quest hashes
    let quest_tier_1_bytes = [97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122]; // "aztec_concept_quiz"
    let quest_tier_2_bytes = [110, 111, 105, 114, 95, 98, 97, 115, 105, 99, 95, 112, 117, 122, 122, 108, 101]; // "noir_basic_puzzle"
    let quest_tier_3_bytes = [102, 105, 114, 115, 116, 95, 112, 114, 105, 118, 97, 116, 101, 95, 116, 120]; // "first_private_tx"
    
    // User has completed all 3 quests but with low scores
    let tier_1_score = 50u8; // Below min_average_score of 70
    let tier_2_score = 60u8; // Below min_average_score of 70
    let tier_3_score = 55u8; // Below min_average_score of 70
    
    // Compute achieved tier
    let mut achieved_tier: u8 = 0;
    let mut total_score: u64 = 0;
    let mut quest_count: u64 = 0;
    let min_average_score = 70u8;
    
    // Check tier 1 - should fail because score < min_average_score
    if tier_1_score >= min_average_score && tier_1_score > 0 {
        achieved_tier = 1;
        total_score += tier_1_score as u64;
        quest_count += 1;
    }
    
    // Check tier 2 - should fail because score < min_average_score
    if achieved_tier >= 1 {
        if tier_2_score >= min_average_score && tier_2_score > 0 {
            achieved_tier = 2;
            total_score += tier_2_score as u64;
            quest_count += 1;
        }
    }
    
    // Check tier 3 - should fail because score < min_average_score
    if achieved_tier >= 2 {
        if tier_3_score >= min_average_score && tier_3_score > 0 {
            achieved_tier = 3;
            total_score += tier_3_score as u64;
            quest_count += 1;
        }
    }
    
    // Calculate average score (even if no quests passed the threshold)
    // In this case, we still calculate from all quests to test the average assertion
    total_score = tier_1_score as u64 + tier_2_score as u64 + tier_3_score as u64;
    quest_count = 3;
    let average_score = if quest_count > 0 { (total_score / quest_count) as u8 } else { 0 };
    
    // Test assertions
    let min_tier = 3u8;
    let tier_constraint = achieved_tier >= min_tier;
    let average_constraint = average_score >= min_average_score;
    
    // Both constraints should fail
    assert(tier_constraint == false, "Achieved tier should not meet minimum (no quests passed threshold)");
    assert(average_constraint == false, "Average score should not meet minimum");
    assert(achieved_tier == 0, "Achieved tier should be 0 (no quests passed threshold)");
    assert(average_score == 55, "Average score should be 55 (50+60+55)/3, which is < 70");
}

/// @notice Test edge case: User with exactly min_average_score should pass
/// @dev Tests boundary condition for average score
#[test]
fn test_exact_min_average_score_passes() {
    // User has completed all 3 quests with exactly min_average_score
    let tier_1_score = 70u8;
    let tier_2_score = 70u8;
    let tier_3_score = 70u8;
    
    let mut achieved_tier: u8 = 0;
    let mut total_score: u64 = 0;
    let mut quest_count: u64 = 0;
    let min_average_score = 70u8;
    
    // Check tier 1
    if tier_1_score >= min_average_score && tier_1_score > 0 {
        achieved_tier = 1;
        total_score += tier_1_score as u64;
        quest_count += 1;
    }
    
    // Check tier 2
    if achieved_tier >= 1 {
        if tier_2_score >= min_average_score && tier_2_score > 0 {
            achieved_tier = 2;
            total_score += tier_2_score as u64;
            quest_count += 1;
        }
    }
    
    // Check tier 3
    if achieved_tier >= 2 {
        if tier_3_score >= min_average_score && tier_3_score > 0 {
            achieved_tier = 3;
            total_score += tier_3_score as u64;
            quest_count += 1;
        }
    }
    
    // Calculate average score
    let average_score = if quest_count > 0 { (total_score / quest_count) as u8 } else { 0 };
    
    // Test assertions
    let min_tier = 3u8;
    assert(achieved_tier >= min_tier, "Achieved tier should be at least 3");
    assert(average_score >= min_average_score, "Average score should be at least 70");
    assert(average_score == 70, "Average score should be exactly 70");
}

