import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH   = path.join(__dirname, '../prepquest.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id           INTEGER PRIMARY KEY CHECK (id = 1),
    xp           INTEGER DEFAULT 0,
    streak       INTEGER DEFAULT 0,
    last_date    TEXT,
    easy         INTEGER DEFAULT 0,
    medium       INTEGER DEFAULT 0,
    hard         INTEGER DEFAULT 0,
    sd_done      INTEGER DEFAULT 0,
    java_done    INTEGER DEFAULT 0,
    achievements TEXT    DEFAULT '[]'
  );

  INSERT OR IGNORE INTO profile (id) VALUES (1);

  CREATE TABLE IF NOT EXISTS dsa_topics (
    topic  TEXT PRIMARY KEY,
    easy   INTEGER DEFAULT 0,
    medium INTEGER DEFAULT 0,
    hard   INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS sd_topics (
    topic TEXT    PRIMARY KEY,
    done  INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS java_topics (
    topic TEXT    PRIMARY KEY,
    done  INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    date TEXT PRIMARY KEY,
    xp   INTEGER DEFAULT 0
  );
`);

export function getAll() {
  const row = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  const profile = {
    xp:           row.xp,
    streak:       row.streak,
    lastDate:     row.last_date,
    easy:         row.easy,
    medium:       row.medium,
    hard:         row.hard,
    sdDone:       row.sd_done,
    javaDone:     row.java_done,
    achievements: JSON.parse(row.achievements || '[]'),
  };

  const dsaRows = db.prepare('SELECT * FROM dsa_topics').all();
  const dsa = Object.fromEntries(
    dsaRows.map(r => [r.topic, { e: r.easy, m: r.medium, h: r.hard }])
  );

  const sdRows = db.prepare('SELECT * FROM sd_topics').all();
  const sd = Object.fromEntries(sdRows.map(r => [r.topic, r.done === 1]));

  const javaRows = db.prepare('SELECT * FROM java_topics').all();
  const java = Object.fromEntries(javaRows.map(r => [r.topic, r.done === 1]));

  return { profile, dsa, sd, java };
}

const stmtUpdateProfile = db.prepare(`
  UPDATE profile SET
    xp = @xp, streak = @streak, last_date = @lastDate,
    easy = @easy, medium = @medium, hard = @hard,
    sd_done = @sdDone, java_done = @javaDone,
    achievements = @achievements
  WHERE id = 1
`);

export function saveProfile(p) {
  stmtUpdateProfile.run({ ...p, achievements: JSON.stringify(p.achievements) });
}

export function upsertDSA(topic, e, m, h) {
  db.prepare(`
    INSERT INTO dsa_topics (topic, easy, medium, hard) VALUES (?, ?, ?, ?)
    ON CONFLICT(topic) DO UPDATE SET easy = excluded.easy, medium = excluded.medium, hard = excluded.hard
  `).run(topic, e, m, h);
}

export function upsertSD(topic, done) {
  db.prepare(`
    INSERT INTO sd_topics (topic, done) VALUES (?, ?)
    ON CONFLICT(topic) DO UPDATE SET done = excluded.done
  `).run(topic, done ? 1 : 0);
}

export function upsertJava(topic, done) {
  db.prepare(`
    INSERT INTO java_topics (topic, done) VALUES (?, ?)
    ON CONFLICT(topic) DO UPDATE SET done = excluded.done
  `).run(topic, done ? 1 : 0);
}

export function upsertActivity(date, xp) {
  if (typeof xp !== 'number' || xp <= 0) return;
  db.prepare(`
    INSERT INTO activity_log (date, xp) VALUES (?, ?)
    ON CONFLICT(date) DO UPDATE SET xp = xp + excluded.xp
  `).run(date, xp);
}

export function getActivity(days) {
  if (!Number.isInteger(days) || days < 1) return [];
  function localDateStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  const start = (() => {
    const d = new Date();
    d.setDate(d.getDate() - days + 1);
    return localDateStr(d);
  })();
  const rows = db.prepare(
    'SELECT date, xp FROM activity_log WHERE date >= ? ORDER BY date ASC'
  ).all(start);
  const map = Object.fromEntries(rows.map(r => [r.date, r.xp]));
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = localDateStr(d);
    result.push({ date, xp: map[date] ?? 0 });
  }
  return result;
}

export function resetAll() {
  db.prepare(`UPDATE profile SET xp=0, streak=0, last_date=NULL,
    easy=0, medium=0, hard=0, sd_done=0, java_done=0, achievements='[]'
    WHERE id=1`).run();
  db.prepare('DELETE FROM dsa_topics').run();
  db.prepare('DELETE FROM sd_topics').run();
  db.prepare('DELETE FROM java_topics').run();
  db.prepare('DELETE FROM activity_log').run();
}
