# Self.xyz Integration Guide

## Overview

This document summarizes how to integrate Self.xyz's identity verification system with our `SelfHumanSBT` contract for proof-of-human verification.

## Key Components

### 1. SelfVerificationRoot

**What it does:**
- Abstract base contract that wires your contract to `IdentityVerificationHub V2`
- Handles proof forwarding to the Hub
- Computes a unique `scope` (Poseidon hash of contract address + scopeSeed) to prevent cross-contract proof replay
- Provides callback mechanism when verification succeeds

**Constructor parameters:**
- `IdentityVerificationHub` address
- `scopeSeed` (string, ≤31 ASCII bytes, e.g., "proof-of-human")

## On-Chain Flow

### Step 1: `verifySelfProof(bytes proofPayload, bytes userContextData)`

Your contract exposes this function (inherited from `SelfVerificationRoot`):

1. Takes the user's proof payload from frontend
2. Calls `getConfigId()` internally to get verification config ID
3. Forwards packed input to Hub V2
4. Hub validates the proof

### Step 2: Hub V2 Callback

If proof is valid, Hub calls back:
- `onVerificationSuccess(bytes output, bytes userData)` (internal function in `SelfVerificationRoot`)

### Step 3: `customVerificationHook(bytes output, bytes userData)`

You implement this override:

- Called after successful verification
- Receives disclosed attributes in `output` parameter
- Your custom logic:
  - Mark user as verified
  - Mint SBT
  - Emit events
  - Gate features

## Required Overrides

### 1. `getConfigId(...)`

```solidity
function getConfigId(...) public view returns (uint256) {
    // Return your verification config ID
    // Simple case: return stored configId
    // Advanced: compute dynamic config based on context
}
```

**Purpose:** Return the verification config ID that the Hub should enforce for this request.

### 2. `customVerificationHook(bytes output, bytes userData)`

```solidity
function customVerificationHook(bytes memory output, bytes memory userData) internal override {
    // Extract data from output if needed
    // Mark user as verified
    // Mint SBT
    // Emit events
}
```

**Purpose:** Implement your business logic after successful verification.

## Proof of Human - Minimal Setup

For a simple "Proof of Human / Sybil resistance" integration (no fancy attributes):

### What you need:

1. **Inherit from `SelfVerificationRoot`**
   - Pass Hub address + scopeSeed to constructor
   - Example: `constructor(address hub, string memory scopeSeed) SelfVerificationRoot(hub, scopeSeed)`

2. **Override `getConfigId()`**
   - Store a single `configId` in storage
   - Return it from `getConfigId()`
   - This config should enforce "human verified" (no age/country restrictions needed)

3. **Override `customVerificationHook()`**
   - Extract `userIdentifier` from `output` (if needed for address derivation)
   - Mint SBT for the user
   - Mark user as verified
   - Emit `HumanVerified` event

4. **Register verification config**
   - Off-chain or via setup contract
   - Config should enforce basic human verification
   - No need for specific attributes (age, country, etc.)

5. **Frontend config must match contract config**
   - Same config ID
   - Same scope (contract address + scopeSeed)

### Minimal Example Structure:

```solidity
contract SelfHumanSBT is ERC721, SelfVerificationRoot {
    uint256 public configId;
    mapping(address => bool) public verified;
    
    constructor(
        address hub,
        string memory scopeSeed,
        uint256 _configId
    ) ERC721("SelfHumanSBT", "SHSBT") SelfVerificationRoot(hub, scopeSeed) {
        configId = _configId;
    }
    
    function getConfigId(...) public view override returns (uint256) {
        return configId;
    }
    
    function customVerificationHook(bytes memory output, bytes memory userData) internal override {
        // Extract userIdentifier from output
        // Derive address: address(uint160(userIdentifier))
        // Mint SBT
        // Mark as verified
    }
}
```

## Scope & Security

### Scope Calculation

- Computed at deploy time: `PoseidonHash(contractAddress, scopeSeed)`
- Prevents cross-contract proof replay
- Allows anonymity between different applications (nullifier is scope-specific)

### Guidelines

- Keep `scopeSeed` short (≤31 ASCII bytes)
- Example: `"proof-of-human"`
- Changing contract address changes the scope (by design)
- Re-deployments need fresh frontend config
- Read current scope on-chain: `scope() public view returns (uint256)`

## Data Extraction

From the `output` parameter in `customVerificationHook()`:

**Always available:**
- `attestationId`
- `userIdentifier` (can derive address: `address(uint160(userIdentifier))`)
- `nullifier`
- `forbiddenCountriesListPacked`
- `olderThan`
- `ofac`

**Only if app requests disclosure:**
- `issuingState`
- `name`
- `idNumber`
- `nationality`
- `dateOfBirth`
- `gender`
- `expiryDate`

For proof-of-human, you typically only need `userIdentifier` to derive the user's address.

## References

- [Basic Integration Docs](https://docs.self.xyz/contract-integration/basic-integration)
- [Architecture Docs](https://docs.self.xyz/technical-docs/architecture)
- [Deployed Contract Addresses](https://docs.self.xyz/contract-integration/deployed-contract)

