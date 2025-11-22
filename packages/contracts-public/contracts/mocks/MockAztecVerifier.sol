// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '../interfaces/IAztecVerifier.sol';

/// @title MockAztecVerifier
/// @notice DEV ONLY / MOCK - Always returns true for any proof verification
/// @dev This is a mock implementation for testing purposes only.
///      DO NOT use in production. It does not perform any actual proof verification.
///      Use this to test contracts that depend on IAztecVerifier without
///      requiring a real Aztec verifier or bridge contract.
contract MockAztecVerifier is IAztecVerifier {
    /// @notice Emitted when verify() is called
    /// @param caller Address that called verify()
    /// @param proofLength Length of the proof bytes
    /// @param publicInputsLength Length of the public inputs bytes
    event VerificationCalled(
        address indexed caller,
        uint256 proofLength,
        uint256 publicInputsLength
    );

    /// @notice Mock verification function that always returns true
    /// @dev DEV ONLY - This is a mock that does not perform real verification.
    ///      Always returns true regardless of proof or public inputs.
    ///      Emits VerificationCalled event for debugging purposes.
    /// @param proof The zkSNARK proof bytes (ignored in mock)
    /// @param publicInputs Encoded public inputs (ignored in mock)
    /// @return Always returns true
    function verify(bytes calldata proof, bytes calldata publicInputs)
        external
        override
        returns (bool)
    {
        // Emit event for debugging (logs caller and input sizes)
        emit VerificationCalled(msg.sender, proof.length, publicInputs.length);
        
        // Always return true (mock behavior)
        return true;
    }
}

