# Indexer Service Setup Guide

**Purpose:** Quick reference for setting up and running the Hidden Garden indexer service for leaderboard functionality.

---

## Overview

The indexer service:
- Listens for `SkillRevealed` events from the `SkillLeaderboard` contract
- Stores skill tier submissions in a local SQLite database
- Exposes REST API endpoints for querying leaderboards
- Optionally resolves ENS names for user addresses

---

## Prerequisites

1. **Node.js and pnpm** installed
2. **L1 RPC URL** (local Hardhat, Sepolia testnet, or mainnet)
3. **SkillLeaderboard contract** deployed and address known

---

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Environment Variables

Create a `.env` file in `services/indexer/` or set environment variables:

```bash
# Required: RPC URL for the chain where SkillLeaderboard is deployed
RPC_URL=http://localhost:8545  # Local Hardhat
# OR
RPC_URL=https://rpc.sepolia.org  # Sepolia testnet

# Optional: Port for the indexer service (default: 4000)
PORT=4000

# Optional: Enable/disable ENS resolution (default: true)
ENS_ENABLED=true

# Optional: ENS lookup timeout in milliseconds (default: 2000)
ENS_TIMEOUT_MS=2000
```

### 3. Start the Indexer

```bash
# From project root
pnpm --filter @hidden-garden/indexer dev

# OR from services/indexer directory
cd services/indexer
pnpm dev
```

**Expected output:**
```
Indexer service running on port 4000
Connected to RPC: http://localhost:8545
ENS resolution: enabled (timeout: 2000ms)
Starting indexer...
Listening for SkillRevealed events...
```

---

## API Endpoints

### Health Check

```bash
curl http://localhost:4000/health
```

**Response:**
```json
{ "status": "ok" }
```

### Get Leaderboard

```bash
curl "http://localhost:4000/leaderboard?skillHash=0x..."
```

**Response:**
```json
[
  {
    "id": 1,
    "user_address": "0x1234...",
    "skill_hash": "0xabcd...",
    "tier": 3,
    "block_number": 12345,
    "tx_hash": "0x5678...",
    "timestamp": 1234567890,
    "created_at": 1234567890,
    "ensName": "vitalik.eth"  // Optional, if resolved
  }
]
```

### Get User Skills

```bash
curl "http://localhost:4000/user/0x1234.../skills"
```

**Response:** Same format as leaderboard (array of skill reveals for that user)

---

## Using the LeaderboardClient

### Real Indexer (Production)

```typescript
import { LeaderboardClient, checkIndexerReachable } from '@hidden-garden/core-logic';

const client = new LeaderboardClient({
  baseUrl: 'http://localhost:4000',
});

// Check if indexer is reachable
const isReachable = await checkIndexerReachable('http://localhost:4000');
if (!isReachable) {
  console.warn('Indexer not reachable, using mock client');
}

// Get leaderboard
const entries = await client.getLeaderboard(skillHash);
```

### Mock Indexer (Offline Development)

```typescript
import { MockLeaderboardClient } from '@hidden-garden/core-logic';

const mockClient = new MockLeaderboardClient();

// Set mock data for testing
mockClient.setMockData([
  {
    id: 1,
    user_address: '0x1234...',
    skill_hash: '0xabcd...',
    tier: 3,
    block_number: 12345,
    tx_hash: '0x5678...',
    timestamp: 1234567890,
    created_at: 1234567890,
  },
]);

// Use same API as real client
const entries = await mockClient.getLeaderboard(skillHash);
```

---

## Troubleshooting

### Indexer Not Starting

**Error:** `Cannot connect to RPC`
- **Solution:** Check `RPC_URL` is correct and RPC endpoint is accessible
- **Test:** `curl $RPC_URL` should return JSON-RPC response

**Error:** `Port already in use`
- **Solution:** Change `PORT` environment variable or stop other service on port 4000

### No Events Indexed

**Issue:** Indexer running but no leaderboard entries
- **Check:** Has anyone submitted tier proofs to the SkillLeaderboard contract?
- **Check:** Is the contract address correct? (indexer listens to all SkillLeaderboard contracts)
- **Check:** Are events being emitted? Check contract on block explorer

### ENS Resolution Not Working

**Issue:** `ensName` field missing from responses
- **Check:** `ENS_ENABLED=true` (default)
- **Check:** RPC URL supports ENS (mainnet RPC required for ENS resolution)
- **Note:** ENS resolution is best-effort and may timeout - responses still work without ENS names

---

## Database

The indexer uses SQLite database stored at:
- **Location:** `services/indexer/data/indexer.db` (created automatically)
- **Schema:** See `services/indexer/src/db/schema.ts`
- **Backup:** Copy the `.db` file to backup indexer data

---

## Development Workflow

1. **Start local Hardhat node:**
   ```bash
   cd packages/contracts-public
   pnpm hardhat node
   ```

2. **Deploy contracts:**
   ```bash
   pnpm hardhat run scripts/deploy.ts --network localhost
   ```

3. **Start indexer:**
   ```bash
   RPC_URL=http://localhost:8545 pnpm --filter @hidden-garden/indexer dev
   ```

4. **Submit tier proof** (via UI or script)

5. **Query leaderboard:**
   ```bash
   curl "http://localhost:4000/leaderboard?skillHash=0x..."
   ```

---

## Production Deployment

For production:
1. Set `RPC_URL` to production RPC endpoint (Infura, Alchemy, etc.)
2. Set `PORT` to desired port (or use reverse proxy)
3. Run as a service (systemd, PM2, Docker, etc.)
4. Monitor logs for errors
5. Set up database backups

---

## Integration with Frontend

The UI can use `LeaderboardClient` with automatic fallback:

```typescript
import { LeaderboardClient, MockLeaderboardClient, checkIndexerReachable } from '@hidden-garden/core-logic';

const indexerUrl = process.env.NEXT_PUBLIC_INDEXER_URL || 'http://localhost:4000';

// Check if indexer is available
const isReachable = await checkIndexerReachable(indexerUrl);

const client = isReachable
  ? new LeaderboardClient({ baseUrl: indexerUrl })
  : new MockLeaderboardClient();

// Use client normally
const leaderboard = await client.getLeaderboard(skillHash);
```

---

**Last Updated:** After backend readiness report  
**Maintained By:** Team A

