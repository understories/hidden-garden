# Deploying Contracts to Sepolia Testnet

## Prerequisites

1. **Get Sepolia ETH**: You need Sepolia testnet ETH for gas fees. Get it from:
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

2. **Get an RPC URL** (optional, defaults to public RPC):
   - [Alchemy](https://www.alchemy.com/) - Free tier available
   - [Infura](https://www.infura.io/) - Free tier available
   - Or use the public RPC: `https://rpc.sepolia.org`

3. **Set up your private key**:
   - Export your deployer wallet's private key from MetaMask
   - **⚠️ Never commit your private key to git!**

## Deployment Steps

### Option 1: Using Environment Variables (Recommended)

```bash
# Set your private key (from MetaMask or your wallet)
export PRIVATE_KEY=your_private_key_here

# Optional: Set custom RPC URL (defaults to public Sepolia RPC)
export SEPOLIA_RPC_URL=https://your-rpc-url-here

# Deploy to Sepolia
cd packages/contracts-public
pnpm deploy:sepolia
```

### Option 2: Using .env file (More Secure)

1. Create a `.env` file in `packages/contracts-public/`:
   ```
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_RPC_URL=https://your-rpc-url-here  # Optional
   ```

2. Install `dotenv` package (if not already installed):
   ```bash
   pnpm add -D dotenv
   ```

3. Update `hardhat.config.ts` to load `.env`:
   ```typescript
   import * as dotenv from 'dotenv';
   dotenv.config();
   ```

4. Deploy:
   ```bash
   pnpm deploy:sepolia
   ```

## Getting the Contract Addresses

After deployment, the script will print the addresses to the console:

```
SelfHumanSBT deployed to: 0x...
SkillLeaderboard deployed to: 0x...

Deployment complete!
Addresses: {
  "SelfHumanSBT": "0x...",
  "SkillLeaderboard": "0x..."
}
```

**Copy these addresses** and paste them into the playground:
1. Open the playground at http://localhost:3001
2. Select "Ethereum Sepolia Testnet" from the network dropdown
3. Paste the addresses into the input fields
4. Connect your wallet and start testing!

## Verify on Etherscan (Optional)

After deployment, you can verify your contracts on [Sepolia Etherscan](https://sepolia.etherscan.io/):

1. Go to your contract address on Etherscan
2. Click "Contract" tab
3. Click "Verify and Publish"
4. Follow the verification wizard

