import express from 'express';
import { ethers } from 'ethers';
import { initializeDatabase } from './db/schema';
import { SkillRevealsRepository } from './db/skillReveals';
import { SkillLeaderboardIndexer } from './indexer';
import { EnsResolver } from './ens';
import type { SkillRevealWithEns } from './db/types';

const app = express();
const PORT = process.env.PORT || 4000;
const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';
const ENS_TIMEOUT_MS = parseInt(process.env.ENS_TIMEOUT_MS || '2000', 10);
const ENS_ENABLED = process.env.ENS_ENABLED !== 'false'; // Default to true

const db = initializeDatabase();
const repository = new SkillRevealsRepository(db);
const provider = new ethers.JsonRpcProvider(RPC_URL);
const indexer = new SkillLeaderboardIndexer(repository, provider);
const ensResolver = new EnsResolver(provider, {
  timeoutMs: ENS_TIMEOUT_MS,
  enabled: ENS_ENABLED,
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * Enrich skill reveals with ENS names.
 * Best-effort: if ENS lookup fails or times out, reveals are returned without ENS names.
 */
async function enrichWithEns(
  reveals: Array<{ user_address: string }>
): Promise<SkillRevealWithEns[]> {
  if (!ENS_ENABLED || reveals.length === 0) {
    return reveals as SkillRevealWithEns[];
  }

  try {
    // Extract unique addresses
    const addresses = reveals.map((r) => r.user_address);
    const ensMap = await ensResolver.lookupAddresses(addresses);

    // Enrich reveals with ENS names
    return reveals.map((reveal) => {
      const ensName = ensMap.get(reveal.user_address.toLowerCase());
      return {
        ...reveal,
        ...(ensName !== undefined && ensName !== null ? { ensName } : {}),
      } as SkillRevealWithEns;
    });
  } catch (error) {
    // On error, return reveals without ENS enrichment
    console.warn('ENS enrichment failed, returning reveals without ENS names:', error);
    return reveals as SkillRevealWithEns[];
  }
}

app.get('/leaderboard', async (req, res) => {
  const { skillHash } = req.query;
  if (!skillHash || typeof skillHash !== 'string') {
    res.status(400).json({ error: 'skillHash query parameter required' });
    return;
  }
  const reveals = repository.findBySkillHash(skillHash);
  const enriched = await enrichWithEns(reveals);
  res.json(enriched);
});

app.get('/user/:userAddress/skills', async (req, res) => {
  const { userAddress } = req.params;
  const reveals = repository.findByUserAddress(userAddress);
  const enriched = await enrichWithEns(reveals);
  res.json(enriched);
});

app.listen(PORT, async () => {
  console.log(`Indexer service running on port ${PORT}`);
  console.log(`Connected to RPC: ${RPC_URL}`);
  console.log(`ENS resolution: ${ENS_ENABLED ? 'enabled' : 'disabled'} (timeout: ${ENS_TIMEOUT_MS}ms)`);
  await indexer.start();
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  indexer.stop();
  db.close();
  process.exit(0);
});

