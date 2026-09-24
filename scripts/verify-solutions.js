/**
 * verify-solutions.js — compiles and runs every Java solution in server/sheet/solutions-*.js.
 *
 * Each solution's main() prints results with a trailing "// expected" comment:
 *     System.out.println(maxSubArray(new int[]{-2,1,-3,4})); // 4
 * The script checks that the program's output lines match those comments, in order.
 *
 * Usage: npm run verify [-- slug-filter]      (needs a JDK: javac + java on PATH)
 */

import fs   from 'fs';
import os   from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath, pathToFileURL } from 'url';

const run = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHEET_DIR = path.join(__dirname, '../server/sheet');
const filter    = process.argv[2];

const solutions = [];
for (const f of fs.readdirSync(SHEET_DIR).filter(f => /^solutions-.*\.js$/.test(f)).sort()) {
  const mod = await import(pathToFileURL(path.join(SHEET_DIR, f)).href);
  for (const [slug, sol] of Object.entries(mod.default))
    if (!filter || slug.includes(filter)) solutions.push({ slug, file: f, ...sol });
}

function expectations(code) {
  const main = code.slice(code.indexOf('public static void main'));
  return main.split('\n')
    .filter(l => l.includes('System.out.print'))
    .map(l => l.includes('//') ? l.slice(l.lastIndexOf('//') + 2).trim() : '<missing // expected comment>');
}

async function verify(sol) {
  const problems = [];
  for (const k of ['difficulty', 'statement', 'intuition', 'time', 'space', 'code'])
    if (!sol[k]) problems.push(`missing field "${k}"`);
  if (sol.difficulty && !['Easy', 'Medium', 'Hard'].includes(sol.difficulty))
    problems.push(`bad difficulty "${sol.difficulty}"`);
  if (!sol.code) return problems;

  const cls = sol.code.match(/public\s+class\s+(\w+)/)?.[1];
  if (!cls) return [...problems, 'no public class'];
  const expected = expectations(sol.code);
  if (!expected.length) problems.push('no "// expected" comments in main');

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pq-'));
  try {
    fs.writeFileSync(path.join(dir, `${cls}.java`), sol.code);
    try { await run('javac', ['-nowarn', '-d', dir, path.join(dir, `${cls}.java`)]); }
    catch (e) { return [...problems, 'compile error:\n' + e.stderr]; }
    let out;
    try { out = (await run('java', ['-cp', dir, cls], { timeout: 10000 })).stdout; }
    catch (e) { return [...problems, 'runtime error:\n' + (e.stderr || e.message)]; }
    const actual = out.split('\n').map(l => l.trim()).filter(Boolean);
    if (actual.length !== expected.length)
      problems.push(`printed ${actual.length} lines, expected ${expected.length}\n    got: ${JSON.stringify(actual)}`);
    expected.forEach((exp, i) => {
      if (actual[i] !== undefined && actual[i] !== exp)
        problems.push(`line ${i + 1}: got "${actual[i]}", expected "${exp}"`);
    });
    return problems;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

let failed = 0, next = 0;
async function worker() {
  while (next < solutions.length) {
    const sol = solutions[next++];
    const problems = await verify(sol);
    if (problems.length) {
      failed++;
      console.log(`✗ ${sol.slug} (${sol.file})\n  - ${problems.join('\n  - ')}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.max(2, os.cpus().length - 1) }, worker));
console.log(`\n${solutions.length - failed}/${solutions.length} solutions passed.`);
process.exit(failed ? 1 : 0);
