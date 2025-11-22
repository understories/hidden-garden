import Database from 'better-sqlite3';
import type { SkillReveal, SkillRevealInsert } from './types';

export class SkillRevealsRepository {
  constructor(private db: Database.Database) {}

  getLastIndexedBlock(): number | null {
    const result = this.db
      .prepare('SELECT MAX(block_number) as max_block FROM skill_reveals')
      .get() as { max_block: number | null } | undefined;
    return result?.max_block ?? null;
  }

  findByUserAndSkill(
    userAddress: string,
    skillHash: string
  ): SkillReveal | undefined {
    return this.db
      .prepare(
        'SELECT * FROM skill_reveals WHERE user_address = ? AND skill_hash = ?'
      )
      .get(userAddress, skillHash) as SkillReveal | undefined;
  }

  upsert(data: SkillRevealInsert): void {
    const existing = this.findByUserAndSkill(data.user_address, data.skill_hash);

    if (existing) {
      const updateStmt = this.db.prepare(`
        UPDATE skill_reveals SET
          tier = ?,
          block_number = ?,
          tx_hash = ?,
          timestamp = ?
        WHERE user_address = ? AND skill_hash = ?
      `);
      updateStmt.run(
        data.tier,
        data.block_number,
        data.tx_hash,
        data.timestamp,
        data.user_address,
        data.skill_hash
      );
    } else {
      const insertStmt = this.db.prepare(`
        INSERT INTO skill_reveals (
          user_address, skill_hash, tier, block_number, tx_hash, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);
      insertStmt.run(
        data.user_address,
        data.skill_hash,
        data.tier,
        data.block_number,
        data.tx_hash,
        data.timestamp
      );
    }
  }

  findBySkillHash(skillHash: string): SkillReveal[] {
    return this.db
      .prepare('SELECT * FROM skill_reveals WHERE skill_hash = ? ORDER BY tier DESC')
      .all(skillHash) as SkillReveal[];
  }

  findByUserAddress(userAddress: string): SkillReveal[] {
    return this.db
      .prepare('SELECT * FROM skill_reveals WHERE user_address = ?')
      .all(userAddress) as SkillReveal[];
  }
}

