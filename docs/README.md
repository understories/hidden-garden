# Hidden Garden Documentation

This directory contains reference documentation for the Hidden Garden project.

## Integration Guides

- **[Self Integration](./self-integration.md)** - Integration with Self.xyz for human verification
  - Architecture overview
  - Contract integration with `SelfVerificationRoot`
  - Proof flow through IdentityVerificationHub V2

- **[Aztec Integration](./aztec-integration.md)** - Integration with Aztec Protocol for private skill trees
  - Aztec.nr contract structure
  - Private state management
  - ZK proof generation and verification

## Setup & Deployment

- **[Playground Setup](./playground-setup.md)** - How to set up and use the contract playground
  - Starting Hardhat node
  - Deploying contracts locally
  - Connecting MetaMask
  - Testing contract interactions

- **[Deploy to Sepolia](./deploy-sepolia.md)** - Deploying contracts to Sepolia testnet
  - Prerequisites
  - Environment setup
  - Deployment steps
  - Contract address management

## Service Documentation

- **[ENS Resolution](./ens-resolution.md)** - ENS name resolution in the indexer service
  - Configuration
  - Features and caching
  - API response format
  - Testing

## Quick Links

- **Contracts**: `packages/contracts-public/`
- **Playground**: `playground/`
- **Indexer**: `services/indexer/`
- **Common SDK**: `packages/common/`
- **Aztec Circuits**: `zk/private_skill_tree/`

