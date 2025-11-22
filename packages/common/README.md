# @hidden-garden/common

Shared SDK package for the Hidden Garden project.

## Purpose

This package provides a unified interface for interacting with Hidden Garden contracts and services. It serves as the **single source of truth** for:

- Contract addresses and ABIs
- Leaderboard API client
- Skill hashing utilities
- Shared types

## Usage

**Team B (Web App) should import from this package, NOT from `/chain` directly.**

```typescript
import {
  LeaderboardClient,
  hashSkillName,
  SkillLeaderboardAbi,
  SKILL_LEADERBOARD_ADDRESS,
  SELF_HUMAN_SBT_ADDRESS,
  CHAINS,
  type Address,
  type SkillHash,
} from '@hidden-garden/common';
```

## Modules

### Contracts

- Contract addresses by chain ID
- Contract ABIs
- Type definitions (`Address`, `SupportedChainId`)

### Leaderboard Client

- `LeaderboardClient` class for querying the indexer API
- Types: `LeaderboardEntry`, `UserSkill`, `SkillHash`

### Skills

- `hashSkillName()` - Hash a skill name to a skill hash (consistent with contracts)

## Example

```typescript
import { LeaderboardClient, hashSkillName } from '@hidden-garden/common';

// Initialize client
const client = new LeaderboardClient({
  baseUrl: 'http://localhost:4000',
});

// Hash a skill name
const skillHash = hashSkillName('solidity');

// Get leaderboard
const entries = await client.getLeaderboard(skillHash);

// Get user skills
const skills = await client.getUserSkills('0x...');
```

## Architecture

This package is the shared SDK between:
- `/chain` - Contract deployment and artifacts
- `/indexer` - Backend indexer service
- `/web` - Frontend application

By using this package, teams can work independently without direct dependencies on each other's code.

