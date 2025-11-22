// SPDX-License-Identifier: MIT
// Private Skill Tree Contract for Hidden Garden
// Manages private skill nodes per user on Aztec

use dep::aztec::macros::aztec;

/// @title PrivateSkillTree
/// @notice Manages private skill nodes per user on Aztec Protocol
/// @dev This contract will later connect proof outputs to an L1 verifier / SkillLeaderboard
#[aztec]
pub contract PrivateSkillTree {
    /// @notice Public no-op function for initial contract setup
    /// @dev This is a placeholder function to ensure the contract compiles
    /// @return Always returns 0
    #[external]
    pub fn initialize() -> Field {
        0
    }
}

