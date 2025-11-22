import { ethers } from 'ethers';
import type { SkillRevealInsert } from './db/types';
import { SkillRevealsRepository } from './db/skillReveals';
import {
  SKILL_LEADERBOARD_ADDRESS,
  SkillLeaderboardAbi,
} from '../../../packages/common/src/contracts';

export class SkillLeaderboardIndexer {
  private repository: SkillRevealsRepository;
  private contract: ethers.Contract;
  private provider: ethers.Provider;
  private isRunning = false;

  constructor(repository: SkillRevealsRepository, provider: ethers.Provider) {
    this.repository = repository;
    this.provider = provider;
    this.contract = new ethers.Contract(
      SKILL_LEADERBOARD_ADDRESS,
      SkillLeaderboardAbi,
      provider
    );
  }

  async start(fromBlock?: number): Promise<void> {
    if (this.isRunning) {
      console.log('Indexer already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting SkillLeaderboard indexer...');

    const startBlock = fromBlock ?? this.repository.getLastIndexedBlock() ?? 0;
    console.log(`Starting from block: ${startBlock}`);

    this.contract.on('SkillRevealed', async (...args) => {
      const event = args[args.length - 1] as ethers.Log;
      await this.handleSkillRevealed(event);
    });

    if (startBlock > 0) {
      await this.scanHistoricalLogs(startBlock);
    }

    console.log('Indexer started, listening for new events');
  }

  stop(): void {
    this.contract.removeAllListeners();
    this.isRunning = false;
    console.log('Indexer stopped');
  }

  private async handleSkillRevealed(event: ethers.Log): Promise<void> {
    try {
      const parsedLog = this.contract.interface.parseLog({
        topics: event.topics as string[],
        data: event.data,
      });

      if (!parsedLog) {
        console.error('Failed to parse event log');
        return;
      }

      const user = parsedLog.args[0] as string;
      const skillHash = parsedLog.args[1] as string;
      const tier = Number(parsedLog.args[2]);

      const block = await this.provider.getBlock(event.blockNumber);
      const timestamp = block?.timestamp ?? Math.floor(Date.now() / 1000);

      const data: SkillRevealInsert = {
        user_address: user,
        skill_hash: skillHash,
        tier,
        block_number: event.blockNumber,
        tx_hash: event.transactionHash,
        timestamp,
      };

      this.repository.upsert(data);

      console.log(
        `Indexed: user=${user} skillHash=${skillHash} tier=${tier} block=${event.blockNumber}`
      );
    } catch (error) {
      console.error('Error handling SkillRevealed event:', error);
    }
  }

  private async scanHistoricalLogs(fromBlock: number): Promise<void> {
    console.log(`Scanning historical logs from block ${fromBlock}...`);
    const currentBlock = await this.provider.getBlockNumber();
    const toBlock = currentBlock;

    if (fromBlock > toBlock) {
      console.log('No new blocks to scan');
      return;
    }

    const filter = this.contract.filters.SkillRevealed();
    const logs = await this.provider.getLogs({
      ...filter,
      fromBlock,
      toBlock,
    });

    console.log(`Found ${logs.length} historical events`);

    for (const log of logs) {
      await this.handleSkillRevealed(log);
    }

    console.log('Historical scan complete');
  }
}

