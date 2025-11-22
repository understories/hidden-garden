// SPDX-License-Identifier: MIT
// Private Skill Tree Contract for Hidden Garden
// Manages private skill nodes per user on Aztec

use dep::aztec::{
    macros::aztec,
    macros::functions::private,
    protocol_types::address::AztecAddress,
    state_vars::Map,
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

/// @title PrivateSkillTree
/// @notice Manages private skill nodes per user on Aztec Protocol
/// @dev This contract will later connect proof outputs to an L1 verifier / SkillLeaderboard
#[aztec]
pub contract PrivateSkillTree {
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

    /// @notice Initialize a user's skill tree with initial nodes
    /// @dev Private function that sets up the initial skill tree structure
    /// @param owner The address of the user whose tree is being initialized
    /// @param initial_nodes Array of initial skill nodes to add to the tree
    #[private]
    pub fn init_tree(owner: AztecAddress, initial_nodes: [SkillNode; 4]) {
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
}

