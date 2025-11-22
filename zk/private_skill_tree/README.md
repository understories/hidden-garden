# Private Skill Tree Contract

This Aztec.nr contract manages private skill nodes per user on Aztec Protocol.

## Purpose

This contract will enable users to:
- Store skill nodes privately (encrypted notes)
- Submit skill tiers without revealing individual values
- Maintain privacy while participating in the Hidden Garden skill leaderboard

## Future Integration

We will later connect proof outputs to an L1 verifier / SkillLeaderboard contract on Ethereum, enabling:
- Private skill submissions on Aztec L2
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

The contract includes tests for the `prove_skill_threshold` function:

```bash
# Run all tests
nargo test

# Tests verify:
# - Level 5 >= threshold 3 (should pass)
# - Level 2 >= threshold 3 (should fail)
# - Edge cases (equality, boundaries)
```

Test files are located in `tests/prove_skill_threshold_test.nr`.

## Development

This contract uses:
- **Aztec.nr framework**: For private smart contract functionality
- **Noir language**: For zero-knowledge circuit compilation
- **UTXO model**: For private state management

## Structure

- `src/main.nr`: Main contract file
- `Nargo.toml`: Noir package configuration with Aztec dependencies
- `package.json`: Node.js package for build scripts


