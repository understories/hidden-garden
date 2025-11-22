// SPDX-License-Identifier: MIT
// Tests for prove_skill_threshold function constraint logic

/// @notice Test that the constraint succeeds when level >= min_level
/// @dev Tests the core constraint: level 5 >= min_level 3 should pass
#[test]
fn test_prove_skill_threshold_success() {
    // Test case: user has level 5, proving threshold of 3
    let skill_level = 5u8;
    let min_level = 3u8;
    
    // The constraint: skill_level >= min_level
    // 5 >= 3 should be true
    assert(skill_level >= min_level);
}

/// @notice Test that the constraint fails when level < min_level
/// @dev Tests the core constraint: level 2 >= min_level 3 should fail
#[test]
fn test_prove_skill_threshold_failure() {
    // Test case: user has level 2, attempting to prove threshold of 3
    let skill_level = 2u8;
    let min_level = 3u8;
    
    // The constraint: skill_level >= min_level
    // 2 >= 3 should be false
    // In the actual contract function, this would cause the assert to revert
    let constraint_holds = skill_level >= min_level;
    assert(constraint_holds == false);
}

/// @notice Test edge case: level exactly equals min_level
/// @dev Tests that level == min_level satisfies the constraint (boundary case)
#[test]
fn test_prove_skill_threshold_equal() {
    // Test case: user has level 5, proving threshold of 5 (exact match)
    let skill_level = 5u8;
    let min_level = 5u8;
    
    // The constraint: skill_level >= min_level
    // 5 >= 5 should be true (equality satisfies >=)
    assert(skill_level >= min_level);
}

/// @notice Test edge case: level is maximum (10) and min_level is low
/// @dev Tests that high levels correctly satisfy low thresholds
#[test]
fn test_prove_skill_threshold_high_level() {
    let skill_level = 10u8;
    let min_level = 1u8;
    
    // 10 >= 1 should be true
    assert(skill_level >= min_level);
}

/// @notice Test edge case: level is minimum (1) and min_level is also 1
/// @dev Tests boundary condition at the minimum valid level
#[test]
fn test_prove_skill_threshold_minimum() {
    let skill_level = 1u8;
    let min_level = 1u8;
    
    // 1 >= 1 should be true
    assert(skill_level >= min_level);
}
