// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@selfxyz/contracts/contracts/libraries/SelfStructs.sol';

/// @title MockIdentityVerificationHubV2
/// @notice Minimal mock Hub for testing - only implements setVerificationConfigV2
contract MockIdentityVerificationHubV2 {
    mapping(bytes32 => SelfStructs.VerificationConfigV2) public configs;

    /// @notice Set a verification config and return a configId
    /// @dev This is the only method our contract calls during construction
    function setVerificationConfigV2(
        SelfStructs.VerificationConfigV2 memory config
    ) external returns (bytes32) {
        // Use abi.encode instead of abi.encodePacked for structs
        bytes32 configId = keccak256(abi.encode(config, block.timestamp, msg.sender));
        configs[configId] = config;
        return configId;
    }

    /// @notice Get a stored config (for test verification)
    function getVerificationConfigV2(bytes32 configId) external view returns (SelfStructs.VerificationConfigV2 memory) {
        return configs[configId];
    }
}

