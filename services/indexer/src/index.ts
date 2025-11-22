import express from 'express';
import { ethers } from 'ethers';
import { initializeDatabase } from './db/schema';
import { SkillRevealsRepository } from './db/skillReveals';
import { SkillLeaderboardIndexer } from './indexer';

const app = express();
const PORT = process.env.PORT || 4000;
const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';

const db = initializeDatabase();
const repository = new SkillRevealsRepository(db);
const provider = new ethers.JsonRpcProvider(RPC_URL);
const indexer = new SkillLeaderboardIndexer(repository, provider);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/leaderboard', (req, res) => {
  const { skillHash } = req.query;
  if (!skillHash || typeof skillHash !== 'string') {
    res.status(400).json({ error: 'skillHash query parameter required' });
    return;
  }
  const reveals = repository.findBySkillHash(skillHash);
  res.json(reveals);
});

app.get('/user/:userAddress/skills', (req, res) => {
  const { userAddress } = req.params;
  const reveals = repository.findByUserAddress(userAddress);
  res.json(reveals);
});

app.listen(PORT, async () => {
  console.log(`Indexer service running on port ${PORT}`);
  console.log(`Connected to RPC: ${RPC_URL}`);
  await indexer.start();
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  indexer.stop();
  db.close();
  process.exit(0);
});

