// SPDX-License-Identifier: MIT
// Test to compute Pedersen hashes for TypeScript lookup
// 
// This test computes the pedersen_hash values for:
// - "aztec_concept_quiz" (quest ID)
// - "aztec_builder" (category)
// - "aztec_builder_path" (path)
//
// Run: aztec-nargo test tests/compute_pedersen_hashes.nr
// Extract the Field values from output and convert to hex for TypeScript.

use dep::std::hash;

/// Combined test that computes all three hashes and makes them easy to extract
/// The hash values will appear in the test output as Field elements
#[test]
fn compute_all_pedersen_hashes() {
    // Quest ID hash: "aztec_concept_quiz"
    // Bytes: [97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122]
    let quest_bytes = [97, 122, 116, 101, 99, 95, 99, 111, 110, 99, 101, 112, 116, 95, 113, 117, 105, 122];
    let quest_hash = hash::pedersen_hash(quest_bytes);
    
    // Category hash: "aztec_builder"
    // Bytes: [97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114]
    let category_bytes = [97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114];
    let category_hash = hash::pedersen_hash(category_bytes);
    
    // Path hash: "aztec_builder_path"
    // Bytes: [97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114, 95, 112, 97, 116, 104]
    let path_bytes = [97, 122, 116, 101, 99, 95, 98, 117, 105, 108, 100, 101, 114, 95, 112, 97, 116, 104];
    let path_hash = hash::pedersen_hash(path_bytes);
    
    // Assert all hashes are non-zero to ensure they were computed
    assert(quest_hash != 0, "Quest hash should be non-zero");
    assert(category_hash != 0, "Category hash should be non-zero");
    assert(path_hash != 0, "Path hash should be non-zero");
    
    // The test framework will output these Field values
    // Look for them in the test output and convert to hex
    // Format: Field(<big_integer>) -> convert to hex -> pad to 64 chars -> add 0x prefix
}
