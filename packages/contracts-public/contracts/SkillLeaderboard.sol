// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './SelfHumanSBT.sol';

/// @title SkillLeaderboard
/// @notice Public v1 leaderboard for skill tiers. Only human-verified users (SBT holders) can submit skill tiers.
/// @dev This is a non-private v1 implementation that will later be extended with ZK/Aztec integrations for privacy.
contract SkillLeaderboard {
    SelfHumanSBT public immutable selfHumanSBT;

    mapping(bytes32 => mapping(address => uint8)) public skillTier;

    event SkillRevealed(address indexed user, bytes32 indexed skillHash, uint8 tier);

    constructor(address _selfHumanSBT) {
        require(_selfHumanSBT != address(0), 'SelfHumanSBT address cannot be zero');
        selfHumanSBT = SelfHumanSBT(_selfHumanSBT);
    }

    /// @notice Submit or update a skill tier for the caller
    /// @dev Only human-verified users (SBT holders) can submit. Latest tier overwrites previous value.
    /// @param skillHash Hash of the skill identifier
    /// @param tier Skill tier (1-10)
    function submitSkillTier(bytes32 skillHash, uint8 tier) external {
        require(tier > 0, 'Tier must be greater than 0');
        require(tier <= 10, 'Tier must be at most 10');
        require(selfHumanSBT.hasValidSBT(msg.sender), 'Only human-verified users can submit skill tiers');

        skillTier[skillHash][msg.sender] = tier;
        emit SkillRevealed(msg.sender, skillHash, tier);
    }
}

