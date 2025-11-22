# Playground Setup Guide

## Quick Answer: Do you need the web app?

**No, you don't need the web app (`apps/web`)**. The playground is a standalone testing tool that works independently.

## What You Need

To make the playground work, you need:

1. **Hardhat node** (local blockchain)
2. **Contracts deployed** to that node
3. **MetaMask** connected to localhost:8545
4. **(Optional) Indexer** - only if you want to test leaderboard queries

## Step-by-Step Setup

### Step 1: Start Hardhat Node

Open **Terminal 1** and run:

```bash
cd packages/contracts-public
pnpm node
```

This starts a local Hardhat node on `http://localhost:8545`. **Keep this terminal running.**

You should see output like:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### Step 2: Deploy Contracts

Open **Terminal 2** (new terminal) and run:

```bash
cd packages/contracts-public
pnpm deploy:node
```

**Note:** The deploy script has been updated to handle all contract constructor arguments automatically.

### Step 3: Start Playground

Open **Terminal 3** (new terminal) and run:

```bash
pnpm dev:playground
```

This starts the playground at `http://localhost:3001`.

### Step 4: Connect MetaMask

1. Open `http://localhost:3001` in your browser
2. Make sure MetaMask is installed
3. In MetaMask, add the local Hardhat network:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`
4. Click "Connect Wallet" in the playground
5. Import one of the Hardhat test accounts (private keys are shown in Terminal 1)

### Step 5: (Optional) Start Indexer

If you want to test leaderboard queries, open **Terminal 4** and run:

```bash
pnpm dev:indexer
```

This starts the indexer at `http://localhost:4000` and will listen for `SkillRevealed` events.

## How the Deploy Script Works

The `deploy.ts` script automatically:

1. Deploys `MockIdentityVerificationHubV2` (needed by SelfHumanSBT)
2. Deploys `MockAztecVerifier` (needed by SkillLeaderboard)
3. Deploys `SelfHumanSBT` with proper constructor args (`hubV2`, `scopeSeed`, `rawConfig`)
4. Deploys `SkillLeaderboard` with both dependencies

All contracts are deployed in the correct order with the required dependencies.

## Testing Flow

Once everything is set up:

1. ✅ **Connect Wallet** - Should show your address
2. ✅ **Mint SBT** - Click "Mint SelfHumanSBT" (uses mock proof for now)
3. ✅ **Verify SBT** - Click "Verify SBT On-Chain" to confirm
4. ✅ **Submit Skill** - Enter a skill name (e.g., "solidity") and tier (1-10)
5. ✅ **Query Leaderboard** - If indexer is running, query by skill name or hash

## Troubleshooting

### "Contract not deployed!" error
- Make sure Hardhat node is running (Terminal 1)
- Make sure contracts are deployed (Terminal 2)
- Check that contract addresses in playground match deployed addresses

### MetaMask connection issues
- Make sure MetaMask is connected to localhost:8545
- Check that Chain ID is 31337
- Try refreshing the page

### Transaction failures
- Make sure you're using a Hardhat test account with ETH
- Check the Hardhat node terminal for error messages
- Verify contract addresses are correct

## Summary

**You only need:**
- Hardhat node (Terminal 1)
- Deployed contracts (Terminal 2) 
- Playground dev server (Terminal 3)
- MetaMask connected to localhost

**You don't need:**
- The web app (`apps/web`)
- The indexer (unless testing leaderboard queries)

The playground is completely self-contained for contract testing!

