// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol';
import '@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol';
import '@selfxyz/contracts/contracts/libraries/SelfStructs.sol';
import '@selfxyz/contracts/contracts/libraries/SelfUtils.sol';
import '@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol';

/// @title SelfHumanSBT
/// @notice Issues non-transferable SBTs to Self-verified humans. Minting happens asynchronously
///         after Self's IdentityVerificationHub V2 validates the proof.
contract SelfHumanSBT is ERC721, SelfVerificationRoot {
    event HumanVerified(address indexed user, uint256 tokenId);

    bytes32 public immutable verificationConfigId;

    /// @notice Initialize the contract with Self's Hub V2 and verification config
    /// @param hubV2 Address of IdentityVerificationHub V2
    /// @param scopeSeed Unique scope seed for this contract (≤31 ASCII bytes, e.g., "proof-of-human")
    /// @param rawConfig Unformatted verification config (e.g., olderThan: 18, no restricted countries)
    constructor(
        address hubV2,
        string memory scopeSeed,
        SelfUtils.UnformattedVerificationConfigV2 memory rawConfig
    ) ERC721('SelfHumanSBT', 'SHSBT') SelfVerificationRoot(hubV2, scopeSeed) {
        SelfStructs.VerificationConfigV2 memory verificationConfig = SelfUtils.formatVerificationConfigV2(rawConfig);
        verificationConfigId = IIdentityVerificationHubV2(hubV2).setVerificationConfigV2(verificationConfig);
    }

    /// @notice Request human verification and SBT minting
    /// @dev This function only *requests* verification. Actual minting happens asynchronously
    ///      in `customVerificationHook` after Self's Hub validates the proof. Replays are prevented
    ///      via Self's scope and nullifier system.
    /// @param proofPayload Proof data from Self SDK (frontend)
    /// @param userContextData Optional user-defined context data
    function verifyAndMint(bytes calldata proofPayload, bytes calldata userContextData) external {
        verifySelfProof(proofPayload, userContextData);
    }

    /// @notice Returns the verification config ID for this contract
    /// @return The verification config ID registered with the Hub
    function getConfigId(
        bytes32, // destinationChainId (unused, for cross-chain support)
        bytes32, // userIdentifier (unused, for per-user configs)
        bytes memory // userDefinedData (unused, for dynamic configs)
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }

    /// @notice Called by Self's Hub after successful proof verification
    /// @dev Extracts user address from output and mints SBT if not already minted.
    ///      Replays are prevented by Self's nullifier system (scope-specific).
    /// @param output Disclosed attributes from the verification proof
    /// @param userData User-defined context data passed from verifyAndMint
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        address userAddress = address(uint160(output.userIdentifier));
        uint256 tokenId = uint256(uint160(userAddress));

        require(_ownerOf(tokenId) == address(0), 'SBT already exists for this address');

        _mint(userAddress, tokenId);
        emit HumanVerified(userAddress, tokenId);
    }

    /// @notice Check if an address has a valid SBT
    /// @param user Address to check
    /// @return true if user owns an SBT
    function hasValidSBT(address user) public view returns (bool) {
        uint256 tokenId = uint256(uint160(user));
        return _ownerOf(tokenId) != address(0);
    }

    /// @notice Prevent transfers of SBTs (non-transferable)
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != from) {
            revert('SBT is non-transferable');
        }
        return super._update(to, tokenId, auth);
    }
}

