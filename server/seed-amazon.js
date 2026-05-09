/**
 * seed-amazon.js
 *
 * One-time setup script. Populates the amazon_problems table in the PrepQuest
 * SQLite DB with all 147 problems and their pre-generated Java solutions.
 *
 * Usage: node server/seed-amazon.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

import { batch1 } from './seed-data-1.js';
import { batch2 } from './seed-data-2.js';
import { batch3 } from './seed-data-3.js';
import { batch4 } from './seed-data-4.js';
import { batch5 } from './seed-data-5.js';
import { batch6 } from './seed-data-6.js';
import { batch7 } from './seed-data-7.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'prepquest.db');

const db = new Database(DB_PATH);

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

// Create table if it doesn't exist, then clear for idempotent re-seeding
db.exec(`
  CREATE TABLE IF NOT EXISTS amazon_problems (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    topic            TEXT NOT NULL,
    title            TEXT NOT NULL,
    difficulty       TEXT NOT NULL,
    practice_url     TEXT,
    statement        TEXT,
    intuition        TEXT,
    time_complexity  TEXT,
    space_complexity TEXT,
    code             TEXT
  );
`);

// Clear existing rows so re-running is idempotent
db.exec('DELETE FROM amazon_problems');
db.exec("DELETE FROM sqlite_sequence WHERE name = 'amazon_problems'");

const allProblems = [
  ...batch1,
  ...batch2,
  ...batch3,
  ...batch4,
  ...batch5,
  ...batch6,
  ...batch7,
];

const insert = db.prepare(`
  INSERT OR REPLACE INTO amazon_problems
    (topic, title, difficulty, practice_url, statement, intuition, time_complexity, space_complexity, code)
  VALUES
    (@topic, @title, @difficulty, @practice_url, @statement, @intuition, @time_complexity, @space_complexity, @code)
`);

const insertAll = db.transaction((problems) => {
  for (const p of problems) {
    insert.run({
      topic:            p.topic,
      title:            p.title,
      difficulty:       p.difficulty,
      practice_url:     p.practice_url ?? null,
      statement:        p.statement ?? null,
      intuition:        p.intuition ?? null,
      time_complexity:  p.time_complexity ?? null,
      space_complexity: p.space_complexity ?? null,
      code:             p.code ?? null,
    });
  }
});

console.log(`Seeding ${allProblems.length} Amazon SDE Sheet problems...`);
insertAll(allProblems);

const count = db.prepare('SELECT COUNT(*) AS n FROM amazon_problems').get();
console.log(`Done. amazon_problems now has ${count.n} rows.`);

// Print topic breakdown
const topics = db.prepare(
  'SELECT topic, COUNT(*) AS cnt FROM amazon_problems GROUP BY topic ORDER BY MIN(id)'
).all();
console.log('\nTopic breakdown:');
for (const row of topics) {
  console.log(`  ${row.topic}: ${row.cnt}`);
}

db.close();
