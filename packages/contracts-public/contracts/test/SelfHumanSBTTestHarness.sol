// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '../SelfHumanSBT.sol';
import '@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol';

/// @title SelfHumanSBTTestHarness
/// @notice Test harness that exposes customVerificationHook for testing
contract SelfHumanSBTTestHarness is SelfHumanSBT {
    constructor(
        address hubV2,
        string memory scopeSeed,
        SelfUtils.UnformattedVerificationConfigV2 memory rawConfig
    ) SelfHumanSBT(hubV2, scopeSeed, rawConfig) {}

    /// @notice Expose customVerificationHook for testing
    function testCustomVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) external {
        customVerificationHook(output, userData);
    }
}

