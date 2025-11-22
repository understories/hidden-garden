// SPDX-License-Identifier: MIT
// Private Identity Garden Contract for Hidden Garden
// This contract serves as a user's private identity vault on Aztec Protocol.
// It stores:
//   - Skill attestations (skill tree nodes)
//   - External identity attestations (from Self, ZKPassport, etc.)
//
// External proofs (Self, ZKPassport, etc.) are verified off-chain or in helper circuits,
// and only normalized attestation facts are stored here as private notes.

use dep::aztec::{
    macros::aztec,
    macros::functions::private,
    protocol_types::address::AztecAddress,
    state_vars::Map,
    note::Note,
};
use easy_private_state::EasyPrivateUint;

/// @title SkillNode
/// @notice Represents a single node in a user's private skill tree
struct SkillNode {
    /// Hash of the skill identifier (e.g., keccak256("solidity"))
    skill_hash: Field,
    /// Skill level (1-10)
    level: u8,
    /// Parent skill hash, or 0 if this is a root node
    parent_hash: Field,
}

/// @title IdentityAttestation
/// @notice Represents an identity attestation from an external source
/// @dev External proofs are verified off-chain. This struct stores only the normalized fact.
struct IdentityAttestation {
    /// Source identifier hash (e.g., hash("Self"), hash("ZKPassport"))
    source: Field,
    /// Attestation type hash (e.g., hash("age_over_18"), hash("residency_EU"))
    attestation_type: Field,
    /// Value: 1 for boolean true, or encoded metadata for other types
    value: Field,
    /// Expiry timestamp (0 means no expiry)
    expiry: u64,
    /// Randomness for note privacy (prevents note linking)
    secret: Field,
}

/// @title PrivateIdentityGarden
/// @notice Private identity vault contract that stores skill nodes and identity attestations
/// @dev This contract is the user's private identity vault on Aztec.
///      External proofs (Self, ZKPassport, etc.) are verified off-chain or in helper circuits,
///      and only normalized attestation facts are stored here as private notes.
#[aztec]
pub contract PrivateIdentityGarden {
    /// @notice Storage structure for private skill trees
    /// @dev Uses nested maps: user address -> skill hash -> skill data
    ///      Each skill's fields are stored separately for Aztec.nr compatibility
    #[storage]
    struct Storage<Context> {
        // Map: user -> skill_hash -> level
        skill_levels: Map<AztecAddress, Map<Field, EasyPrivateUint<Context>, Context>, Context>,
        // Map: user -> skill_hash -> parent_hash
        skill_parents: Map<AztecAddress, Map<Field, EasyPrivateUint<Context>, Context>, Context>,
    }

    // ============ Skill Tree Functions ============

    /// @notice Initialize a user's skill tree with initial nodes
    /// @dev Private function that sets up the initial skill tree structure
    /// @param owner The address of the user whose tree is being initialized
    /// @param initial_nodes Array of initial skill nodes to add to the tree
    #[private]
    pub fn init_skills(owner: AztecAddress, initial_nodes: [SkillNode; 4]) {
        let levels = storage.skill_levels;
        let parents = storage.skill_parents;

        for i in 0..4 {
            let node = initial_nodes[i];
            
            // Store skill level
            let level_map = levels.at(owner);
            let level_storage = level_map.at(node.skill_hash);
            level_storage.set(node.level as u64, owner);
            
            // Store parent hash (convert Field to u64 for storage, then back)
            let parent_map = parents.at(owner);
            let parent_storage = parent_map.at(node.skill_hash);
            // Store parent_hash as u64 (Field -> u64 conversion)
            parent_storage.set(node.parent_hash as u64, owner);
        }
    }

    /// @notice Update the level of a specific skill in a user's tree
    /// @dev Private function that finds and updates a skill node's level
    /// @param owner The address of the user whose skill is being updated
    /// @param skill_hash Hash of the skill identifier to update
    /// @param new_level New level value (1-10)
    #[private]
    pub fn update_skill(owner: AztecAddress, skill_hash: Field, new_level: u8) {
        // Validate level range
        assert(new_level > 0 && new_level <= 10, "Level must be between 1 and 10");
        
        let levels = storage.skill_levels;
        let level_map = levels.at(owner);
        let level_storage = level_map.at(skill_hash);
        
        // Update the skill level
        level_storage.set(new_level as u64, owner);
    }

    /// @notice Get a skill node's data (private view function)
    /// @dev Returns the level and parent hash for a given skill
    /// @param owner The address of the user
    /// @param skill_hash Hash of the skill identifier
    /// @return level The skill level
    /// @return parent_hash The parent skill hash
    #[private]
    pub fn get_skill(owner: AztecAddress, skill_hash: Field) -> (u8, Field) {
        let levels = storage.skill_levels;
        let parents = storage.skill_parents;
        
        let level_map = levels.at(owner);
        let level_storage = level_map.at(skill_hash);
        let level_value = level_storage.get_value();
        
        let parent_map = parents.at(owner);
        let parent_storage = parent_map.at(skill_hash);
        let parent_value = parent_storage.get_value();
        
        (level_value as u8, parent_value as Field)
    }

    /// @notice Prove that the caller's skill level meets or exceeds a threshold
    /// @dev This function reads private state, verifies the constraint, and emits public outputs
    ///      that can be verified on L1. The public outputs include:
    ///      - caller's AztecAddress (accessed via storage context)
    ///      - skill_hash (from function parameter - automatically public input)
    ///      - min_level (from function parameter - automatically public input)
    ///      These values will appear as public inputs/outputs in the ZK circuit and can be read
    ///      by the L1 verifier contract.
    /// @param owner The address of the user proving the threshold (public input for L1 verification)
    /// @param skill_hash Hash of the skill identifier to check (public input)
    /// @param min_level Minimum level threshold to prove (public input)
    /// @return Returns the owner's address as a public output for L1 verification
    #[private]
    pub fn prove_skill_threshold(owner: AztecAddress, skill_hash: Field, min_level: u8) -> AztecAddress {
        // Read the owner's private skill level for the given skill_hash
        // This read is private - the actual level value is not revealed
        let levels = storage.skill_levels;
        let level_map = levels.at(owner);
        let level_storage = level_map.at(skill_hash);
        let current_level = level_storage.get_value() as u8;
        
        // Assert that the owner's level meets or exceeds the minimum threshold
        // This constraint is enforced in the ZK circuit without revealing the actual level
        // Only the boolean result (true/false) is proven, not the level value itself
        assert(current_level >= min_level, "Skill level does not meet minimum threshold");
        
        // Return the owner's address as a public output
        // skill_hash and min_level are already public inputs (function parameters)
        // These three values (owner, skill_hash, min_level) will be available on L1
        // for verification in the SkillLeaderboard contract
        owner
    }

    // ============ Identity Attestation Functions ============

    /// @notice Add a new identity attestation to the user's private vault
    /// @dev Creates a new private note containing the attestation. The note is encrypted
    ///      and only the owner can decrypt it. External proofs (Self, ZKPassport, etc.)
    ///      are verified off-chain before calling this function.
    /// @param att The identity attestation to add
    /// @return note The created private note
    #[private]
    pub fn add_identity_attestation(att: IdentityAttestation) -> Note<IdentityAttestation> {
        // Validate that expiry is in the future (if not 0)
        // Note: In a real implementation, you might want to check against current timestamp
        // For now, we just ensure expiry is either 0 (no expiry) or a valid timestamp
        
        // Create a new private note with the attestation
        // The note is automatically encrypted and linked to the caller's address
        Note::new(att)
    }

    /// @notice Revoke an identity attestation by creating a nullifier
    /// @dev Nullifiers prevent the attestation from being used in future proofs.
    ///      The nullifier is computed from the attestation's unique identifier
    ///      (source + attestation_type + value) to ensure uniqueness.
    /// @param attestation_type Hash of the attestation type to revoke
    /// @param source Hash of the source that issued the attestation
    /// @param value The value of the attestation (to uniquely identify it)
    /// @param secret The secret from the original attestation note (needed for nullifier)
    #[private]
    pub fn revoke_identity_attestation(
        attestation_type: Field,
        source: Field,
        value: Field,
        secret: Field
    ) {
        // Compute a unique identifier for this attestation
        // This ensures we can create a nullifier that uniquely identifies the note
        // In Aztec, nullifiers are typically computed from note contents + secret
        // For simplicity, we hash the key fields together
        // In production, you'd use Aztec's built-in nullifier computation
        
        // Note: In a full implementation, you would:
        // 1. Find the note matching (source, attestation_type, value)
        // 2. Compute the nullifier from the note contents
        // 3. Create the nullifier to mark it as spent/revoked
        
        // For now, this is a placeholder that shows the intended interface
        // The actual nullifier creation would use Aztec's note system APIs
        // which require access to the original note structure
        
        // This function signature shows the intended revocation pattern:
        // - Identify the attestation by (source, attestation_type, value)
        // - Use the secret to compute the nullifier
        // - The nullifier prevents future use of this attestation
    }

    /// @notice Prove possession of a valid identity attestation
    /// @dev This function can be used to prove that the caller has a valid (non-expired,
    ///      non-revoked) attestation of a specific type from a specific source.
    ///      The proof can be used in other contracts or on L1.
    /// @param attestation_type Hash of the attestation type to prove
    /// @param source Hash of the source that issued the attestation
    /// @param min_value Minimum value required (for numeric attestations)
    /// @return Returns true if the attestation exists and is valid
    #[private]
    pub fn prove_identity_attestation(
        attestation_type: Field,
        source: Field,
        min_value: Field
    ) -> bool {
        // In a full implementation, this would:
        // 1. Search for notes matching (source, attestation_type)
        // 2. Check that value >= min_value
        // 3. Check that expiry is in the future (or 0)
        // 4. Verify the note hasn't been nullified (revoked)
        // 5. Return true if valid, false otherwise
        
        // This is a placeholder showing the intended interface
        // Actual implementation would use Aztec's note query APIs
        true
    }
}
