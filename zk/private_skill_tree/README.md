# Private Identity Garden Contract

This Aztec.nr contract serves as a **private identity vault** for users on Aztec Protocol.

## Purpose

This contract enables users to:
- Store skill nodes privately (encrypted notes)
- Store identity attestations from external sources (Self, ZKPassport, etc.)
- Submit skill tiers without revealing individual values
- Prove identity attributes without revealing the underlying data
- Maintain privacy while participating in the Hidden Garden ecosystem

## Architecture

### Private Identity Vault

This contract is the user's private identity vault on Aztec. External proofs (Self, ZKPassport, etc.) are verified off-chain or in helper circuits, and only normalized attestation facts are stored here as private notes.

### Two Types of Private Data

1. **Skill Nodes**: Represents skills in a user's skill tree
   - `skill_hash`: Hash of the skill identifier
   - `level`: Skill level (1-10)
   - `parent_hash`: Parent skill hash (for tree structure)

2. **Identity Attestations**: External identity proofs
   - `source`: Source identifier (e.g., hash("Self"), hash("ZKPassport"))
   - `attestation_type`: Type of attestation (e.g., hash("age_over_18"))
   - `value`: Attestation value (1 for boolean true, or encoded metadata)
   - `expiry`: Expiry timestamp (0 means no expiry)
   - `secret`: Randomness for note privacy

## Key Features

### Skill Management
- `init_skills()`: Initialize a user's skill tree with initial nodes
- `update_skill()`: Update a skill's level
- `get_skill()`: Retrieve skill data (private view)
- `prove_skill_threshold()`: Prove skill level >= threshold without revealing actual level

### Identity Attestations
- `add_identity_attestation()`: Add a new identity attestation as a private note
- `revoke_identity_attestation()`: Revoke an attestation using nullifiers
- `prove_identity_attestation()`: Prove possession of a valid attestation

## Privacy Guarantees

- **Encrypted Notes**: All attestations are stored as encrypted notes
- **Zero-Knowledge Proofs**: Can prove attributes without revealing values
- **Nullifiers**: Revocation prevents future use without revealing which attestation was revoked
- **Private State**: Skill levels are stored in private state, not revealed in proofs

## Future Integration

This contract will connect proof outputs to an L1 verifier / SkillLeaderboard contract on Ethereum, enabling:
- Private skill submissions on Aztec L2
- Private identity verification on Aztec L2
- Public aggregate statistics on Ethereum L1
- Bridge between private and public states

## Prerequisites

Install Aztec tooling (includes `nargo` and `aztec-cli`):

```bash
bash -i <(curl -s https://install.aztec.network)
```

Or install Noir separately:
```bash
# Follow instructions at https://noir-lang.org/getting_started/installation
```

## Building

```bash
# Compile the contract
nargo build

# Or use the npm script from root
pnpm build --filter @hidden-garden/private-skill-tree

# Check for compilation errors without building
nargo check

# Run tests
nargo test
```

## Testing

The contract includes tests for:
- Skill tree initialization and updates
- Skill threshold proofs
- Identity attestation management (when implemented)

```bash
# Run all tests
nargo test
```

## Development

This contract uses:
- **Aztec.nr framework**: For private smart contract functionality
- **Noir language**: For zero-knowledge circuit compilation
- **UTXO model**: For private state management (notes)
- **Easy Private State**: Simplified abstractions for private storage

## Design Choices

### Why Two Storage Mechanisms?

1. **Skills use EasyPrivateUint**: Skills are frequently updated and benefit from mutable storage
2. **Attestations use Notes**: Attestations are immutable once created and benefit from note-based revocation

### Why Hash-Based Identifiers?

- `source` and `attestation_type` are hashed to:
  - Keep attestation contents private
  - Enable efficient lookups
  - Prevent linking between different attestations

### Why Secret Field in Attestations?

- The `secret` field provides randomness for:
  - Note privacy (prevents linking)
  - Nullifier computation (for revocation)
  - Uniqueness guarantees

## Structure

- `src/main.nr`: Main contract file
- `Nargo.toml`: Noir package configuration with Aztec dependencies
- `package.json`: Node.js package for build scripts
- `tests/`: Test files for contract functions
