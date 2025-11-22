// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

/// @title SelfHumanSBT
/// @notice Stub contract for integration with Self. Issues non-transferable SBTs to verified humans.
contract SelfHumanSBT is ERC721 {
    event HumanVerified(address indexed user, uint256 tokenId);

    constructor() ERC721('SelfHumanSBT', 'SHSBT') {}

    /// @notice Verifies and mints an SBT for the caller
    /// @dev Currently mints unconditionally. Will later validate `proof` parameter before minting.
    /// @param proof Proof data for human verification (currently unused, will be validated in future)
    function verifyAndMint(bytes calldata proof) external {
        address user = msg.sender;
        uint256 tokenId = uint256(uint160(user));

        require(_ownerOf(tokenId) == address(0), 'SBT already exists for this address');

        _mint(user, tokenId);
        emit HumanVerified(user, tokenId);
    }

    function hasValidSBT(address user) public view returns (bool) {
        uint256 tokenId = uint256(uint160(user));
        return _ownerOf(tokenId) != address(0);
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != from) {
            revert('SBT is non-transferable');
        }
        return super._update(to, tokenId, auth);
    }
}

