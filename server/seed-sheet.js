/**
 * seed-sheet.js
 *
 * Populates the sheet_problems table with Striver's 180 – Master DSA Patterns
 * (takeuforward.org/prep-hub/strivers-180-master-dsa-patterns).
 *
 *   sheet/striver180.meta.json  — problem list, grouping and links, as scraped from TUF
 *   sheet/solutions-*.js        — statement, intuition, complexities and Java code, keyed by TUF slug
 *
 * Re-running is safe: the table is cleared and rebuilt. User progress is never touched.
 *
 * Usage: npm run seed
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { db } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHEET_DIR = path.join(__dirname, 'sheet');

const meta = JSON.parse(fs.readFileSync(path.join(SHEET_DIR, 'striver180.meta.json'), 'utf8'));

const solutions = {};
const files = fs.readdirSync(SHEET_DIR).filter(f => /^solutions-.*\.js$/.test(f)).sort();
for (const f of files) {
  const mod = await import(pathToFileURL(path.join(SHEET_DIR, f)).href);
  for (const [slug, sol] of Object.entries(mod.default)) {
    if (solutions[slug]) throw new Error(`Duplicate solution for "${slug}" in ${f}`);
    solutions[slug] = sol;
  }
}

const unknown = Object.keys(solutions).filter(slug => !meta.some(m => m.slug === slug));
if (unknown.length) throw new Error(`Solutions for unknown slugs: ${unknown.join(', ')}`);

const missing = meta.filter(m => !solutions[m.slug]);
if (missing.length) {
  console.warn(`Warning: ${missing.length} problems have no solution yet:`);
  for (const m of missing) console.warn(`  #${m.position} ${m.title} (${m.slug})`);
}

const insert = db.prepare(`
  INSERT INTO sheet_problems
    (id, slug, title, module, pattern, tier, difficulty, leetcode_url, tuf_url, article_url,
     statement, intuition, time_complexity, space_complexity, code)
  VALUES
    (@id, @slug, @title, @module, @pattern, @tier, @difficulty, @leetcode_url, @tuf_url, @article_url,
     @statement, @intuition, @time_complexity, @space_complexity, @code)
`);

db.transaction(() => {
  db.exec('DROP TABLE IF EXISTS amazon_problems');   // replaced by this sheet
  db.exec('DELETE FROM sheet_problems');
  for (const m of meta) {
    const s = solutions[m.slug] || {};
    insert.run({
      id:               m.position,
      slug:             m.slug,
      title:            m.title,
      module:           m.module,
      pattern:          m.pattern,
      tier:             m.tier,
      difficulty:       s.difficulty ?? 'Medium',
      leetcode_url:     m.leetcode_url,
      tuf_url:          m.tuf_url,
      article_url:      m.article_url,
      statement:        s.statement ?? null,
      intuition:        s.intuition ?? null,
      time_complexity:  s.time ?? null,
      space_complexity: s.space ?? null,
      code:             s.code ?? null,
    });
  }
})();

const { n } = db.prepare('SELECT COUNT(*) AS n FROM sheet_problems').get();
console.log(`Seeded ${n} problems (${n - missing.length} with solutions).`);
for (const row of db.prepare('SELECT module, COUNT(*) AS cnt FROM sheet_problems GROUP BY module ORDER BY MIN(id)').all())
  console.log(`  ${row.module}: ${row.cnt}`);
