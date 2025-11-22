// SPDX-License-Identifier: MIT
// Test to compute Pedersen hashes for TypeScript lookup
// 
// This test computes the pedersen_hash values for all quest IDs, categories, and paths.
//
// Run: nargo test compute_pedersen_hashes
// Extract the Field values from output and convert to hex for TypeScript.

use dep::std::hash;

/// Test that computes all Pedersen hashes needed for the application
/// The hash values will appear in the test output as Field elements
#[test]
fn compute_pedersen_hashes() {
    // Quest ID: "aztec_concept_quiz"
    // Bytes: [97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122]
    let q1_bytes = [97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122];
    let q1 = hash::pedersen_hash(q1_bytes);
    
    // Quest ID: "noir_syntax_basics"
    // Bytes: [110, 111, 105, 114, 95, 115, 121, 110, 116, 97, 120, 95, 98, 97, 115, 105, 99, 115]
    let q2_bytes = [110, 111, 105, 114, 95, 115, 121, 110, 116, 97, 120, 95, 98, 97, 115, 105, 99, 115];
    let q2 = hash::pedersen_hash(q2_bytes);
    
    // Quest ID: "aztec_storage_intro"
    // Bytes: [97, 122, 116, 101, 99, 95, 115, 116, 111, 114, 97, 103, 101, 95, 105, 110, 116, 114, 111]
    let q3_bytes = [97, 122, 116, 101, 99, 95, 115, 116, 111, 114, 97, 103, 101, 95, 105, 110, 116, 114, 111];
    let q3 = hash::pedersen_hash(q3_bytes);
    
    // Category: "aztec_builder"
    // Bytes: [97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114]
    let cat_bytes = [97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114];
    let cat = hash::pedersen_hash(cat_bytes);
    
    // Path: "aztec_builder_path"
    // Bytes: [97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114, 95, 112, 97, 116, 104]
    let path_bytes = [97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114, 95, 112, 97, 116, 104];
    let path = hash::pedersen_hash(path_bytes);
    
    // Dummy constraints so the values are printed in test output
    constrain q1 == q1;
    constrain q2 == q2;
    constrain q3 == q3;
    constrain cat == cat;
    constrain path == path;
    
    // Assert all hashes are non-zero to ensure they were computed
    assert(q1 != 0, "Quest 1 hash should be non-zero");
    assert(q2 != 0, "Quest 2 hash should be non-zero");
    assert(q3 != 0, "Quest 3 hash should be non-zero");
    assert(cat != 0, "Category hash should be non-zero");
    assert(path != 0, "Path hash should be non-zero");
}
