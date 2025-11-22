# Aztec Protocol Privacy Integration Guide

## Overview

This document summarizes how to integrate Aztec Protocol's privacy features with our Hidden Garden skill leaderboard system. Aztec enables private smart contracts with confidential transactions while maintaining composability with Ethereum.

## Key Components

### 1. Execution Environments

**Private Functions:**
- Executed client-side on user devices
- Generate zero-knowledge proofs locally
- Transaction details remain confidential
- Cannot read current public state (only historical)

**Public Functions:**
- Executed on Aztec Virtual Machine (by sequencers)
- Similar to Ethereum's execution model
- Can read current public state
- Cannot access private state directly

**Utility Execution:**
- Local queries that don't affect network state
- No proofs required
- Useful for read-only operations

### 2. State Management

**Private State (UTXO Model):**
- Stored as Unspent Transaction Outputs (UTXOs)
- Encrypted notes that only the owner can decrypt
- Each note contains: value, owner, randomness
- Supports confidential balances and data

**Public State (Merkle Tree):**
- Stored in a public Merkle tree
- Accessible to all contracts
- Similar to Ethereum's storage model
- Used for transparent operations

**State Separation:**
- Private functions can read historical public state
- Public functions cannot access private state
- Cross-domain interactions require explicit messaging

### 3. Noir Language

**Purpose:**
- Domain-specific language for writing zero-knowledge circuits
- Compiles to smart contracts on Aztec
- Similar syntax to Rust for developer familiarity

**Key Features:**
- Private and public function definitions
- Note structures for private state
- Cryptographic primitives (Poseidon hashing, etc.)
- Contract composability

## Architecture

### Private Transaction Flow

1. **User Initiates Transaction:**
   - Frontend calls private function
   - User's device executes function locally
   - Generates zero-knowledge proof

2. **Proof Generation:**
   - Proves transaction validity without revealing details
   - Includes note commitments and nullifiers
   - Validates private state transitions

3. **Transaction Submission:**
   - Submit proof + encrypted notes to sequencer
   - Sequencer validates proof
   - Updates private state tree

4. **State Update:**
   - Old notes are nullified (spent)
   - New notes are created (unspent)
   - Public state can be updated via public functions

### Public Transaction Flow

1. **Function Call:**
   - Similar to Ethereum transactions
   - Executed by sequencers
   - Updates public Merkle tree

2. **State Access:**
   - Can read current public state
   - Can emit public events
   - Cannot access private notes directly

### Cross-Domain Messaging

**L1 ↔ L2 Communication:**
- Public messages: Transparent, verifiable
- Private messages: Encrypted, confidential
- Bridge contracts on both sides
- Message ordering and finality guarantees

## Integration Flow for Hidden Garden

### Current State (Public v1)

Our current `SkillLeaderboard` contract:
- Public skill tier submissions
- Transparent leaderboard queries
- No privacy for user skills or rankings

### Target State (Private v2)

**Private Skill Submissions:**
- Users submit skill tiers privately
- Only aggregate statistics are public
- Individual rankings remain confidential

**Hybrid Approach:**
- Keep public contract for backward compatibility
- Add private Aztec contract for privacy-preserving submissions
- Bridge between public and private states

## Required Components

### 1. Aztec Contract (Noir)

**Contract Structure:**
```noir
contract SkillLeaderboardPrivate {
    // Private state: encrypted notes
    struct SkillNote {
        owner: AztecAddress,
        skill_hash: Field,
        tier: u8,
        secret: Field,
    }

    // Public state: aggregate statistics
    struct PublicStats {
        total_submissions: u64,
        skill_count: u64,
    }

    // Private function: submit skill tier
    #[private]
    fn submit_skill_tier(
        skill_hash: Field,
        tier: u8,
        secret: Field
    ) -> Note<SkillNote> {
        // Create private note
        // Validate tier range
        // Emit encrypted event
    }

    // Public function: update aggregate stats
    #[public]
    fn update_stats(skill_hash: Field) {
        // Increment public counters
        // No access to private notes
    }
}
```

### 2. Bridge Contract (Solidity)

**Purpose:**
- Connect Ethereum L1 with Aztec L2
- Handle message passing
- Maintain state synchronization

**Key Functions:**
```solidity
contract SkillLeaderboardBridge {
    // Receive messages from Aztec
    function receiveFromAztec(bytes calldata message) external;
    
    // Send messages to Aztec
    function sendToAztec(bytes calldata message) external;
    
    // Query aggregated stats
    function getAggregateStats(bytes32 skillHash) external view returns (uint256);
}
```

### 3. Frontend Integration

**Aztec.js SDK:**
- Initialize Aztec client
- Create user accounts
- Send private transactions
- Query private state (with user's key)

**Example:**
```typescript
import { createAztecClient } from '@aztec/aztec.js';

const client = await createAztecClient();
const user = await client.createUser();
const contract = await client.getContract('SkillLeaderboardPrivate');

// Submit private skill tier
await contract.methods.submit_skill_tier(skillHash, tier, secret)
  .send({ from: user });
```

## Minimal Setup for Private Skill Leaderboard

### What you need:

1. **Aztec Development Environment**
   - Install Aztec CLI: `npm install -g @aztec/cli`
   - Start local sandbox: `aztec start`
   - Deploy contracts: `aztec deploy`

2. **Noir Contract**
   - Create contract in `packages/circuits-aztec/`
   - Define private note structure
   - Implement private submission function
   - Add public aggregation functions

3. **Bridge Contract**
   - Deploy on Ethereum L1
   - Deploy on Aztec L2
   - Implement message passing

4. **Frontend Integration**
   - Install `@aztec/aztec.js`
   - Initialize Aztec client
   - Handle private transactions
   - Display aggregate stats (public)

5. **State Synchronization**
   - Keep public contract for v1 compatibility
   - Bridge private submissions to public aggregates
   - Maintain dual state (public + private)

### Minimal Example Structure:

```noir
// packages/circuits-aztec/src/skill_leaderboard.nr
contract SkillLeaderboardPrivate {
    use dep::aztec::{
        state_vars::Map,
        note::Note,
    };

    // Private note structure
    struct SkillNote {
        owner: AztecAddress,
        skill_hash: Field,
        tier: u8,
        secret: Field,
    }

    // Private state: user's skill notes
    #[private]
    fn submit_skill_tier(
        skill_hash: Field,
        tier: u8,
        secret: Field
    ) -> Note<SkillNote> {
        require(tier > 0 && tier <= 10, "Invalid tier");
        
        let note = SkillNote {
            owner: context.msg_sender(),
            skill_hash,
            tier,
            secret,
        };
        
        Note::new(note)
    }

    // Public function: get aggregate stats (no private data)
    #[public]
    fn get_aggregate_stats(skill_hash: Field) -> u64 {
        // Return public aggregate statistics
        // No access to individual private notes
    }
}
```

## Privacy Guarantees

### What is Private:
- Individual skill tier submissions
- User's skill profile
- Ranking positions
- Submission timestamps (if desired)

### What is Public:
- Aggregate statistics (total submissions per skill)
- Skill hash identifiers
- Public events (encrypted or unencrypted)
- Contract addresses

### Zero-Knowledge Proofs:
- Prove skill tier submission without revealing tier value
- Prove ownership of skill note without revealing identity
- Prove aggregate statistics are computed correctly

## Security Considerations

### Note Management:
- **Nullifiers:** Prevent double-spending of notes
- **Commitments:** Hide note contents while proving existence
- **Secrets:** User-controlled randomness for privacy

### State Consistency:
- **Private State:** Only accessible by note owner
- **Public State:** Verifiable by all, but no private data leakage
- **Cross-Domain:** Message ordering and finality guarantees

### Key Management:
- Users manage their own private keys
- Keys never leave user's device
- Proof generation happens client-side

## Composability

### Private ↔ Public Interactions:
- Private functions can call public functions
- Public functions cannot call private functions directly
- Use events and messages for cross-domain communication

### Contract Interactions:
- Private contracts can call other private contracts
- Public contracts can call other public contracts
- Cross-domain calls require explicit messaging

### Ethereum Integration:
- Bridge contracts on both L1 and L2
- Message passing with ordering guarantees
- State synchronization mechanisms

## Development Workflow

### 1. Local Development:
```bash
# Start Aztec sandbox
aztec start

# Compile Noir contract
cd packages/circuits-aztec
nargo compile

# Deploy contract
aztec deploy SkillLeaderboardPrivate

# Run tests
aztec test
```

### 2. Testing:
- Unit tests for private functions (local execution)
- Integration tests with Aztec sandbox
- Cross-domain message testing
- Privacy verification (ensure no data leakage)

### 3. Deployment:
- Deploy to Aztec testnet
- Deploy bridge contracts to Ethereum testnet
- Test end-to-end flow
- Deploy to mainnet after thorough testing

## Migration Strategy

### Phase 1: Parallel Systems
- Keep existing public `SkillLeaderboard` contract
- Deploy private Aztec contract
- Users can choose public or private submissions

### Phase 2: Bridge Integration
- Implement bridge between public and private
- Aggregate private submissions to public stats
- Maintain backward compatibility

### Phase 3: Full Privacy (Optional)
- Deprecate public submissions
- Migrate to fully private system
- Maintain public aggregates only

## Data Structures

### Private Note (UTXO):
```noir
struct SkillNote {
    owner: AztecAddress,      // Note owner (private)
    skill_hash: Field,        // Skill identifier
    tier: u8,                // Skill tier (1-10)
    secret: Field,           // Randomness for privacy
}
```

### Public State:
```noir
struct PublicStats {
    skill_hash: Field,
    total_submissions: u64,
    average_tier: u64,      // Computed from private notes
    last_updated: u64,
}
```

## References

- [Aztec Documentation](https://docs.aztec.network/)
- [Noir Language Docs](https://noir-lang.org/)
- [Aztec.nr Framework](https://github.com/AztecProtocol/aztec-packages/tree/main/yarn-project/aztec-nr)
- [Aztec.js SDK](https://github.com/AztecProtocol/aztec-packages/tree/main/yarn-project/aztec.js)
- [Aztec Monorepo](https://github.com/AztecProtocol/aztec-packages)
- [Private Token Tutorial](https://docs.aztec.network/developers/docs/tutorials/contract_tutorials/token_contract)

