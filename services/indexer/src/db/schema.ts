import Database from 'better-sqlite3';
import * as path from 'path';

export function initializeDatabase(dbPath?: string): Database.Database {
  const databasePath = dbPath || path.join(__dirname, '../../data/indexer.db');
  const db = new Database(databasePath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS skill_reveals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_address TEXT NOT NULL,
      skill_hash TEXT NOT NULL,
      tier INTEGER NOT NULL,
      block_number INTEGER NOT NULL,
      tx_hash TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      UNIQUE(user_address, skill_hash)
    );

    CREATE INDEX IF NOT EXISTS idx_skill_reveals_skill_hash ON skill_reveals(skill_hash);
    CREATE INDEX IF NOT EXISTS idx_skill_reveals_user_address ON skill_reveals(user_address);
    CREATE INDEX IF NOT EXISTS idx_skill_reveals_skill_user ON skill_reveals(skill_hash, user_address);
    CREATE INDEX IF NOT EXISTS idx_skill_reveals_block_number ON skill_reveals(block_number);
    CREATE INDEX IF NOT EXISTS idx_skill_reveals_tx_hash ON skill_reveals(tx_hash);
  `);

  return db;
}

