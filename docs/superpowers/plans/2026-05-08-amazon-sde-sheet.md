# Amazon SDE Sheet Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate a 14-topic, 147-problem Amazon SDE Sheet into PrepQuest — with pre-generated Java solutions stored in SQLite and served via the existing Express API — accessible as a visually distinct page at `/amazon`.

**Architecture:** New `amazon_problems` table in the existing `prepquest.db`; two read-only GET endpoints added to the Express server; `src/AmazonSDE.jsx` is a self-contained React component mounted at the `/amazon` route via a pathname check in `main.jsx`; a one-time seed script populates all solutions.

**Tech Stack:** better-sqlite3, Express 4, React 18, Vite 5, JetBrains Mono (already in index.html)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `server/db.js` | Modify | Add `amazon_problems` DDL + 3 new export functions |
| `server/index.js` | Modify | Add `GET /api/amazon/problems` and `GET /api/amazon/problem/:id` |
| `server/seed-amazon.js` | Create | One-time script to populate all 147 problems + solutions |
| `src/main.jsx` | Modify | Add pathname check to mount `AmazonSDE` at `/amazon` |
| `src/AmazonSDE.jsx` | Create | Full Amazon SDE Sheet UI — topic grid → problem list → detail |
| `src/App.jsx` | Modify | Add "Amazon SDE Sheet" button to `OverviewTab` |

---

## Task 1: DB Schema and Functions

**Files:**
- Modify: `server/db.js`

- [ ] **Step 1: Add the `amazon_problems` table DDL and three export functions**

In `server/db.js`, after the existing `db.exec(`` ... ``)` block (around line 57), add the new table creation. Then add three export functions after the existing `deleteEventsForDate` function.

The full additions — add the CREATE TABLE to the existing `db.exec` call by appending inside the template literal before the closing backtick:

```js
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
```

Then add these three functions at the end of `server/db.js` (after `deleteEventsForDate`):

```js
export function getAllAmazonProblems() {
  return db.prepare(
    'SELECT id, topic, title, difficulty, practice_url FROM amazon_problems ORDER BY id ASC'
  ).all();
}

export function getAmazonProblem(id) {
  return db.prepare(
    'SELECT * FROM amazon_problems WHERE id = ?'
  ).get(id);
}

export function upsertAmazonSolution(id, statement, intuition, timeComplexity, spaceComplexity, code) {
  db.prepare(`
    UPDATE amazon_problems
    SET statement = ?, intuition = ?, time_complexity = ?, space_complexity = ?, code = ?
    WHERE id = ?
  `).run(statement, intuition, timeComplexity, spaceComplexity, code, id);
}
```

- [ ] **Step 2: Verify the server still starts**

```bash
cd /Users/shashankhr/Downloads/prepquest
node --input-type=module <<'EOF'
import { db, getAllAmazonProblems } from './server/db.js';
console.log('DB ok, amazon rows:', getAllAmazonProblems().length);
EOF
```

Expected output: `DB ok, amazon rows: 0`

- [ ] **Step 3: Commit**

```bash
git add server/db.js
git commit -m "feat: add amazon_problems table and DB functions"
```

---

## Task 2: API Routes

**Files:**
- Modify: `server/index.js`

- [ ] **Step 1: Import the two new DB functions**

At the top of `server/index.js`, update the import line from `./db.js` to include the new functions:

```js
import { db, getAll, saveProfile, upsertDSA, upsertSD, upsertJava, resetAll,
         upsertActivity, getActivity, insertEvent, getEventsForDate,
         deleteEventsForDate, getAllAmazonProblems, getAmazonProblem } from './db.js';
```

- [ ] **Step 2: Add the two GET endpoints**

Add these two routes after the existing `GET /api/events` handler (around line 124):

```js
// GET /api/amazon/problems
app.get('/api/amazon/problems', (_req, res) => {
  try { res.json(getAllAmazonProblems()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/amazon/problem/:id
app.get('/api/amazon/problem/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
  try {
    const row = getAmazonProblem(id);
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
```

- [ ] **Step 3: Verify the routes respond (server must be running in another terminal)**

```bash
curl -s http://localhost:3001/api/amazon/problems | head -c 100
```

Expected: `[]` (empty array until seed runs)

```bash
curl -s http://localhost:3001/api/amazon/problem/999
```

Expected: `{"error":"not found"}`

- [ ] **Step 4: Commit**

```bash
git add server/index.js
git commit -m "feat: add GET /api/amazon/problems and /api/amazon/problem/:id"
```

---

## Task 3: Routing Setup

**Files:**
- Modify: `src/main.jsx`

- [ ] **Step 1: Update main.jsx to route `/amazon` to AmazonSDE**

Replace the entire contents of `src/main.jsx` with:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

if (window.location.pathname.startsWith('/amazon')) {
  // Lazy-load AmazonSDE only when on the /amazon route
  import('./AmazonSDE.jsx').then(({ default: AmazonSDE }) => {
    root.render(
      <React.StrictMode>
        <AmazonSDE />
      </React.StrictMode>
    );
  });
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
```

- [ ] **Step 2: Verify the main app still loads**

With dev server running (`npm run dev`), open `http://localhost:5173` — PrepQuest should load normally.

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx
git commit -m "feat: add pathname-based routing for /amazon"
```

---

## Task 4: AmazonSDE UI Component

**Files:**
- Create: `src/AmazonSDE.jsx`

- [ ] **Step 1: Create `src/AmazonSDE.jsx`**

Create the file with the full component:

```jsx
import { useState, useEffect } from 'react';

// ── Constants ──────────────────────────────────────────────────────────────────
const ORANGE  = '#FF9900';
const BG      = '#0f1111';
const CARD_BG = '#1a1a1a';
const FONT    = "'JetBrains Mono', monospace";

const TOPICS_META = {
  'Array':                   { icon: '▦', desc: 'Contiguous memory, O(1) access. Master Kadane\'s, two-pointer, matrix traversal, prefix sums, and Dutch flag.' },
  'String':                  { icon: '⌨', desc: 'Character arrays with rich patterns. Sliding window, two-pointer, hashing, and classic string algorithms.' },
  'Linked List':             { icon: '⛓', desc: 'Dynamic memory, O(1) insert/delete. Reversal, cycle detection, merging, and two-pointer patterns.' },
  'Searching':               { icon: '🔍', desc: 'Binary search and its variants. Eliminate half the search space per step. Apply on sorted, rotated, and answer-space problems.' },
  'Sorting':                 { icon: '↕', desc: 'QuickSort, MergeSort, Dutch Flag, heap-based sorting, and sort-driven interval and platform problems.' },
  'Stack':                   { icon: '📚', desc: 'LIFO. Balanced brackets, monotonic stack (NGE), expression evaluation, and queue simulation.' },
  'Queue':                   { icon: '⇉', desc: 'FIFO. BFS, level-order traversal, sliding window max, rotten oranges, and rope-cost problems.' },
  'Tree':                    { icon: '🌳', desc: 'Hierarchical structure. DFS traversals, BFS level-order, BST properties, LCA, diameter, and serialization.' },
  'Graph':                   { icon: '◉', desc: 'Vertices + edges. BFS, DFS, cycle detection, topological sort, Dijkstra, SCC, and shortest paths.' },
  'Trie':                    { icon: '🌐', desc: 'Prefix tree for efficient string lookups. O(L) insert/search. Powers autocomplete, spell-check, and XOR problems.' },
  'Heap & Hash':             { icon: '⊕', desc: 'Priority queues, median streams, frequency-based problems. HashMap-driven O(1) lookups and set operations.' },
  'Bit Magic':               { icon: '⚡', desc: 'XOR tricks, bit manipulation, power-of-2 checks. O(1) space solutions to classic number problems.' },
  'Recursion & Backtracking':{ icon: '↩', desc: 'Recursive decomposition + constraint pruning. N-Queens, Sudoku, combination sum, and path-finding classics.' },
  'Dynamic Programming':     { icon: '🧩', desc: 'Overlapping subproblems + optimal substructure. Knapsack, LCS, LIS, edit distance, and coin change families.' },
};

const TOPIC_ORDER = [
  'Array', 'String', 'Linked List', 'Searching', 'Sorting',
  'Stack', 'Queue', 'Tree', 'Graph', 'Trie',
  'Heap & Hash', 'Bit Magic', 'Recursion & Backtracking', 'Dynamic Programming',
];

const DIFF_COLOR = {
  Easy:   { color: '#4CAF50' },
  Medium: { color: ORANGE },
  Hard:   { color: '#f44336' },
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: BG,
    fontFamily: FONT,
    color: '#e0e0e0',
    padding: '24px 16px',
    boxSizing: 'border-box',
  },
  inner: {
    maxWidth: 780,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
    borderBottom: `1px solid #2a2a2a`,
    paddingBottom: 16,
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    color: ORANGE,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: 11,
    color: '#666',
    marginLeft: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12,
  },
  topicCard: (hovered) => ({
    background: CARD_BG,
    border: `1px solid ${hovered ? ORANGE : '#2a2a2a'}`,
    borderRadius: 8,
    padding: '16px 14px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: hovered ? `0 0 0 1px ${ORANGE}22` : 'none',
  }),
  topicIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  topicName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: 4,
  },
  topicDesc: {
    fontSize: 10,
    color: '#555',
    lineHeight: 1.5,
    marginBottom: 8,
  },
  topicCount: {
    fontSize: 10,
    color: ORANGE,
    fontWeight: 500,
  },
  backBtn: {
    background: 'none',
    border: `1px solid #2a2a2a`,
    borderRadius: 6,
    color: '#888',
    fontSize: 12,
    padding: '6px 12px',
    cursor: 'pointer',
    marginBottom: 20,
    fontFamily: FONT,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#e0e0e0',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 11,
    color: '#555',
    marginBottom: 20,
  },
  problemRow: (hovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    background: CARD_BG,
    border: `1px solid ${hovered ? ORANGE : '#2a2a2a'}`,
    borderRadius: 6,
    cursor: 'pointer',
    marginBottom: 6,
    transition: 'border-color 0.15s',
  }),
  problemTitle: {
    flex: 1,
    fontSize: 13,
    color: '#d0d0d0',
  },
  diffBadge: (diff) => ({
    fontSize: 10,
    fontWeight: 600,
    color: DIFF_COLOR[diff]?.color || '#888',
    whiteSpace: 'nowrap',
  }),
  detailTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#e0e0e0',
    marginBottom: 6,
  },
  practiceLink: {
    display: 'inline-block',
    fontSize: 11,
    color: ORANGE,
    textDecoration: 'none',
    border: `1px solid ${ORANGE}44`,
    borderRadius: 4,
    padding: '3px 10px',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: ORANGE,
    marginBottom: 8,
    marginTop: 20,
  },
  prose: {
    fontSize: 13,
    color: '#b0b0b0',
    lineHeight: 1.7,
    background: CARD_BG,
    border: '1px solid #2a2a2a',
    borderRadius: 6,
    padding: '12px 16px',
  },
  complexRow: {
    display: 'flex',
    gap: 12,
    marginTop: 20,
  },
  complexCard: {
    flex: 1,
    background: CARD_BG,
    border: '1px solid #2a2a2a',
    borderRadius: 6,
    padding: '10px 14px',
  },
  complexLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#555',
    marginBottom: 4,
  },
  complexVal: {
    fontSize: 14,
    fontWeight: 700,
    color: ORANGE,
  },
  codeBlock: {
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: 6,
    padding: '16px',
    overflowX: 'auto',
    fontSize: 12,
    lineHeight: 1.6,
    color: '#c8c8c8',
    whiteSpace: 'pre',
    fontFamily: FONT,
  },
  loadingBox: {
    color: '#555',
    fontSize: 13,
    padding: '40px 0',
    textAlign: 'center',
  },
  errorBox: {
    color: '#f44336',
    fontSize: 13,
    padding: '20px 0',
  },
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function AmazonSDE() {
  const [view,            setView]            = useState('topics');  // 'topics' | 'problems' | 'detail'
  const [selectedTopic,   setSelectedTopic]   = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [allProblems,     setAllProblems]     = useState([]);
  const [detail,          setDetail]          = useState(null);
  const [loadingDetail,   setLoadingDetail]   = useState(false);
  const [detailError,     setDetailError]     = useState(null);
  const [hoveredCard,     setHoveredCard]     = useState(null);

  useEffect(() => {
    fetch('/api/amazon/problems')
      .then(r => r.json())
      .then(data => setAllProblems(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Topic counts
  const topicCounts = {};
  for (const p of allProblems) {
    topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
  }

  function openTopic(topic) {
    setSelectedTopic(topic);
    setView('problems');
  }

  function openProblem(problem) {
    setSelectedProblem(problem);
    setDetail(null);
    setDetailError(null);
    setLoadingDetail(true);
    setView('detail');
    fetch(`/api/amazon/problem/${problem.id}`)
      .then(r => r.json())
      .then(d => { setDetail(d); setLoadingDetail(false); })
      .catch(() => { setDetailError('Failed to load solution.'); setLoadingDetail(false); });
  }

  const topicProblems = allProblems.filter(p => p.topic === selectedTopic);

  // ── Topic Grid ───────────────────────────────────────────────────────────────
  if (view === 'topics') {
    return (
      <div style={S.page}>
        <div style={S.inner}>
          <div style={S.header}>
            <span style={S.logo}>Amazon SDE Sheet</span>
            <span style={S.subtitle}>{allProblems.length} problems · 14 topics · Java solutions</span>
          </div>
          <div style={S.grid}>
            {TOPIC_ORDER.map(topic => {
              const meta = TOPICS_META[topic] || {};
              const count = topicCounts[topic] || 0;
              const hov = hoveredCard === topic;
              return (
                <div
                  key={topic}
                  style={S.topicCard(hov)}
                  onClick={() => openTopic(topic)}
                  onMouseEnter={() => setHoveredCard(topic)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={S.topicIcon}>{meta.icon}</div>
                  <div style={S.topicName}>{topic}</div>
                  <div style={S.topicDesc}>{meta.desc}</div>
                  <div style={S.topicCount}>{count} problems</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Problem List ─────────────────────────────────────────────────────────────
  if (view === 'problems') {
    return (
      <div style={S.page}>
        <div style={S.inner}>
          <button style={S.backBtn} onClick={() => setView('topics')}>← All Topics</button>
          <div style={S.sectionTitle}>{TOPICS_META[selectedTopic]?.icon} {selectedTopic}</div>
          <div style={S.sectionSub}>{TOPICS_META[selectedTopic]?.desc}</div>
          {topicProblems.map(p => {
            const hov = hoveredCard === p.id;
            return (
              <div
                key={p.id}
                style={S.problemRow(hov)}
                onClick={() => openProblem(p)}
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <span style={S.problemTitle}>{p.title}</span>
                <span style={S.diffBadge(p.difficulty)}>{p.difficulty}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Problem Detail ───────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      <div style={S.inner}>
        <button style={S.backBtn} onClick={() => setView('problems')}>← {selectedTopic}</button>

        {selectedProblem && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ ...S.diffBadge(selectedProblem.difficulty), fontSize: 11, border: `1px solid ${DIFF_COLOR[selectedProblem.difficulty]?.color || '#888'}44`, borderRadius: 4, padding: '2px 8px' }}>
                {selectedProblem.difficulty}
              </span>
            </div>
            <div style={S.detailTitle}>{selectedProblem.title}</div>
            {selectedProblem.practice_url && (
              <a href={selectedProblem.practice_url} target="_blank" rel="noreferrer" style={S.practiceLink}>
                Practice on GFG ↗
              </a>
            )}
          </>
        )}

        {loadingDetail && <div style={S.loadingBox}>Loading solution…</div>}
        {detailError  && <div style={S.errorBox}>{detailError}</div>}

        {detail && !loadingDetail && (
          <>
            <div style={S.sectionLabel}>Problem Statement</div>
            <div style={S.prose}>{detail.statement}</div>

            <div style={S.sectionLabel}>Intuition</div>
            <div style={S.prose}>{detail.intuition}</div>

            <div style={S.complexRow}>
              <div style={S.complexCard}>
                <div style={S.complexLabel}>Time Complexity</div>
                <div style={S.complexVal}>{detail.time_complexity}</div>
              </div>
              <div style={S.complexCard}>
                <div style={S.complexLabel}>Space Complexity</div>
                <div style={S.complexVal}>{detail.space_complexity}</div>
              </div>
            </div>

            <div style={S.sectionLabel}>Java Solution</div>
            <div style={S.codeBlock}>{detail.code}</div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the component loads at `/amazon`**

With dev server running, open `http://localhost:5173/amazon` in browser. You should see the Amazon SDE Sheet topic grid with orange accents on a dark `#0f1111` background. The grid will show "0 problems" per topic until the seed runs.

- [ ] **Step 3: Commit**

```bash
git add src/AmazonSDE.jsx
git commit -m "feat: add AmazonSDE component with 3-level navigation"
```

---

## Task 5: Overview Button

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add the Amazon SDE Sheet button to `OverviewTab`**

In `src/App.jsx`, find the `OverviewTab` function. The return JSX ends with the achievements card followed by the closing root `</div>`. Insert a new card **after** the achievements `</div>` and **before** the root `</div>`.

Find this exact string (end of the achievements card):
```jsx
        </div>
      </div>
    </div>
  );
}

function ActivityGraph
```

Replace it with:
```jsx
        </div>
      </div>
      <div style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={S.sectionLabel}>Amazon SDE Sheet</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>147 problems · 14 topics · Java solutions</div>
        </div>
        <button
          onClick={() => window.open('/amazon', '_blank')}
          style={{ fontSize: 12, padding: '8px 14px', cursor: 'pointer', background: '#FF9900', border: 'none', borderRadius: 6, color: '#000', fontWeight: 600, fontFamily: 'var(--font-mono)' }}
        >
          Open ↗
        </button>
      </div>
    </div>
  );
}

function ActivityGraph
```

```jsx
      <div style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={S.sectionLabel}>Amazon SDE Sheet</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>147 problems · 14 topics · Java solutions</div>
        </div>
        <button
          onClick={() => window.open('/amazon', '_blank')}
          style={{ fontSize: 12, padding: '8px 14px', cursor: 'pointer', background: '#FF9900', border: 'none', borderRadius: 6, color: '#000', fontWeight: 600, fontFamily: 'var(--font-mono)' }}
        >
          Open ↗
        </button>
      </div>
```

- [ ] **Step 2: Verify the button appears**

With dev server running, open `http://localhost:5173`. On the overview tab, scroll to the bottom — you should see the "Amazon SDE Sheet" card with an orange "Open ↗" button. Clicking it opens `http://localhost:5173/amazon` in a new tab.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add Amazon SDE Sheet button to overview tab"
```

---

## Task 6: Seed Script — All 147 Problems + Solutions

**Files:**
- Create: `server/seed-amazon.js`

This task creates the seed script with all problem metadata and full Java solutions for every problem. The script is run once (`node server/seed-amazon.js`) to populate the DB.

**Solution format for every problem:**
```js
{
  topic: 'TopicName',
  title: 'Exact Problem Title',
  difficulty: 'Easy' | 'Medium' | 'Hard',
  practice_url: 'https://www.geeksforgeeks.org/problems/...',
  statement: 'Clear 2-3 sentence problem description with input/output constraints.',
  intuition: 'Key insight and approach in 2-4 sentences. Name the algorithm/pattern.',
  time_complexity: 'O(...) — brief explanation',
  space_complexity: 'O(...) — brief explanation',
  code: `full runnable Java class with:
    - Correct imports
    - The solution method with real logic
    - A main() method with 2-3 test cases printing actual vs expected output`
}
```

- [ ] **Step 1: Create `server/seed-amazon.js`**

Generate a complete Java solution for EVERY problem in the list below, following the format above exactly. Write the complete file:

```js
import { db } from './db.js';

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
  )
`);

const problems = [
  // ── COMPLETE SOLUTIONS REQUIRED FOR ALL 147 PROBLEMS BELOW ──
  // Generate a full solution object for each. See format above.
  // Problems are listed in order: fill in statement, intuition,
  // time_complexity, space_complexity, and code for every one.

  // ── Array (10 problems) ───────────────────────────────────────
  {
    topic: 'Array', title: "Largest Sum Contiguous Subarray (Kadane's)",
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1',
    statement: `Given an array of integers (possibly negative), find the contiguous subarray with the largest sum and return that sum. The array has at least one element.`,
    intuition: `Kadane's algorithm tracks the maximum sum ending at the current position. At each element, decide whether to extend the existing subarray or start fresh — whichever gives a larger value. Track the global maximum as you scan once left to right.`,
    time_complexity: 'O(n) — single pass through the array',
    space_complexity: 'O(1) — two variables only',
    code: `public class KadanesAlgorithm {
    public static long maxSubarraySum(int[] arr) {
        long maxSoFar = arr[0], maxEndingHere = arr[0];
        for (int i = 1; i < arr.length; i++) {
            maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        return maxSoFar;
    }

    public static void main(String[] args) {
        System.out.println(maxSubarraySum(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // 6
        System.out.println(maxSubarraySum(new int[]{1}));                       // 1
        System.out.println(maxSubarraySum(new int[]{-1,-2,-3,-4}));             // -1
    }
}`,
  },
  {
    topic: 'Array', title: 'Search in Row-wise and Column-wise Sorted Matrix',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/search-in-a-matrix17201720/1',
    statement: `Given an n×m matrix where each row and column is sorted in ascending order, determine whether a target value exists in the matrix.`,
    intuition: `Start from the top-right corner. If the current element equals target, return true. If it is greater than target, move left (eliminate the column). If it is less, move down (eliminate the row). This eliminates one row or column per step.`,
    time_complexity: 'O(n + m) — at most n+m steps',
    space_complexity: 'O(1) — no extra space',
    code: `public class SearchMatrix {
    public static boolean search(int[][] mat, int target) {
        int r = 0, c = mat[0].length - 1;
        while (r < mat.length && c >= 0) {
            if      (mat[r][c] == target) return true;
            else if (mat[r][c] > target)  c--;
            else                          r++;
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] m = {{1,4,7},{2,5,8},{3,6,9}};
        System.out.println(search(m, 5)); // true
        System.out.println(search(m, 10)); // false
        System.out.println(search(m, 1)); // true
    }
}`,
  },
  {
    topic: 'Array', title: 'Print Matrix in Spiral Form',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/spirally-traversing-a-matrix-1587115621/1',
    statement: `Given a 2D matrix, print all elements in spiral order: traverse the outermost ring left-to-right, top-to-bottom, right-to-left, bottom-to-top, then move inward and repeat.`,
    intuition: `Maintain four boundaries: top, bottom, left, right. Peel off one layer at a time — traverse right along top, down along right, left along bottom, up along left — then shrink all four boundaries inward. Stop when top > bottom or left > right.`,
    time_complexity: 'O(n×m) — each element visited once',
    space_complexity: 'O(1) — output list aside',
    code: `import java.util.*;
public class SpiralMatrix {
    public static List<Integer> spiral(int[][] mat) {
        List<Integer> res = new ArrayList<>();
        int top = 0, bottom = mat.length - 1, left = 0, right = mat[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++)  res.add(mat[top][c]);
            top++;
            for (int r = top; r <= bottom; r++)  res.add(mat[r][right]);
            right--;
            if (top <= bottom) { for (int c = right; c >= left; c--) res.add(mat[bottom][c]); bottom--; }
            if (left <= right) { for (int r = bottom; r >= top; r--) res.add(mat[r][left]);  left++;  }
        }
        return res;
    }

    public static void main(String[] args) {
        int[][] m = {{1,2,3},{4,5,6},{7,8,9}};
        System.out.println(spiral(m)); // [1,2,3,6,9,8,7,4,5]
    }
}`,
  },
  {
    topic: 'Array', title: 'Program for Array Rotation',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1',
    statement: `Given an array of n integers and a number d, rotate the array left by d positions. Elements shifted off the left end wrap to the right.`,
    intuition: `The three-reversal trick rotates in O(n) time and O(1) space. Reverse the first d elements, reverse the remaining n-d elements, then reverse the entire array. The result is a left rotation by d.`,
    time_complexity: 'O(n) — three reversal passes',
    space_complexity: 'O(1) — in-place',
    code: `import java.util.Arrays;
public class ArrayRotation {
    static void reverse(int[] a, int l, int r) {
        while (l < r) { int t = a[l]; a[l++] = a[r]; a[r--] = t; }
    }
    public static void rotate(int[] arr, int d) {
        int n = arr.length; d %= n;
        reverse(arr, 0, d - 1);
        reverse(arr, d, n - 1);
        reverse(arr, 0, n - 1);
    }

    public static void main(String[] args) {
        int[] a = {1,2,3,4,5,6,7}; rotate(a, 2);
        System.out.println(Arrays.toString(a)); // [3,4,5,6,7,1,2]
        int[] b = {1,2,3}; rotate(b, 1);
        System.out.println(Arrays.toString(b)); // [2,3,1]
    }
}`,
  },
  {
    topic: 'Array', title: 'Trapping Rain Water',
    difficulty: 'Hard',
    practice_url: 'https://www.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1',
    statement: `Given n non-negative integers representing an elevation map where each bar has width 1, compute how much water it can trap after raining.`,
    intuition: `Use two pointers starting at both ends. The amount of water above any bar is min(leftMax, rightMax) - height[i]. Move the pointer on the side with the smaller max inward — that side's contribution is fully determined. This avoids the need for prefix/suffix max arrays.`,
    time_complexity: 'O(n) — single two-pointer pass',
    space_complexity: 'O(1) — no extra arrays',
    code: `public class TrappingRainWater {
    public static long trap(int[] h) {
        int l = 0, r = h.length - 1, lMax = 0, rMax = 0;
        long water = 0;
        while (l < r) {
            if (h[l] <= h[r]) {
                if (h[l] >= lMax) lMax = h[l]; else water += lMax - h[l];
                l++;
            } else {
                if (h[r] >= rMax) rMax = h[r]; else water += rMax - h[r];
                r--;
            }
        }
        return water;
    }

    public static void main(String[] args) {
        System.out.println(trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})); // 6
        System.out.println(trap(new int[]{4,2,0,3,2,5}));               // 9
        System.out.println(trap(new int[]{1,0,1}));                     // 1
    }
}`,
  },
  {
    topic: 'Array', title: 'Count Pairs With Given Sum',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/count-pairs-with-given-sum5022/1',
    statement: `Given an array of integers and a target sum k, count the number of pairs (i, j) with i < j such that arr[i] + arr[j] equals k.`,
    intuition: `Use a frequency HashMap. For each element x, the number of valid pairs it can form is the count of (k - x) already seen. Add that count to the result, then increment x's frequency. This is a single O(n) pass.`,
    time_complexity: 'O(n) — one pass with a HashMap',
    space_complexity: 'O(n) — HashMap storage',
    code: `import java.util.*;
public class CountPairsWithSum {
    public static int countPairs(int[] arr, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        int count = 0;
        for (int x : arr) {
            count += freq.getOrDefault(k - x, 0);
            freq.merge(x, 1, Integer::sum);
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countPairs(new int[]{1,5,7,-1,5}, 6));  // 3
        System.out.println(countPairs(new int[]{1,1,1,1}, 2));     // 6
        System.out.println(countPairs(new int[]{10,12,10,15,-1}, 125)); // 0
    }
}`,
  },
  {
    topic: 'Array', title: 'Find the Subarray with Least Average',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/subarray-with-least-average5031/1',
    statement: `Given an array of integers and an integer k, find the starting index of the contiguous subarray of length k that has the minimum average.`,
    intuition: `Compute the sum of the first window of size k, then slide the window right by adding the next element and removing the leftmost. Track the minimum window sum and its starting index.`,
    time_complexity: 'O(n) — single sliding window pass',
    space_complexity: 'O(1)',
    code: `public class MinAvgSubarray {
    public static int findMinAvgSubarray(int[] arr, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) sum += arr[i];
        int minSum = sum, minIdx = 0;
        for (int i = k; i < arr.length; i++) {
            sum += arr[i] - arr[i - k];
            if (sum < minSum) { minSum = sum; minIdx = i - k + 1; }
        }
        return minIdx;
    }

    public static void main(String[] args) {
        System.out.println(findMinAvgSubarray(new int[]{3,7,90,20,10,50,40}, 3)); // 3 (subarray 20,10,50 avg=26.67? No: 20,10,50 vs 10,50,40 — check: [3,7,90]=100/3, [7,90,20]=117/3, [90,20,10]=120/3, [20,10,50]=80/3, [10,50,40]=100/3 → min is [20,10,50] idx=3)
        System.out.println(findMinAvgSubarray(new int[]{1,2,3,4,5}, 2)); // 0
    }
}`,
  },
  {
    topic: 'Array', title: 'Convert Array into Zig-Zag Fashion',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/convert-array-into-zig-zag-fashion1638/1',
    statement: `Given an array, rearrange its elements such that it follows the pattern a < b > c < d > e ... (elements alternate between being smaller and larger than their neighbors). Modify in-place.`,
    intuition: `Iterate through the array. At even indices, the element should be less than the next; at odd indices, greater. If this invariant is violated, swap the two adjacent elements. Swapping never breaks previously satisfied constraints.`,
    time_complexity: 'O(n) — single pass',
    space_complexity: 'O(1) — in-place',
    code: `import java.util.Arrays;
public class ZigZagArray {
    public static void zigzag(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            if ((i % 2 == 0 && arr[i] > arr[i+1]) ||
                (i % 2 == 1 && arr[i] < arr[i+1])) {
                int t = arr[i]; arr[i] = arr[i+1]; arr[i+1] = t;
            }
        }
    }

    public static void main(String[] args) {
        int[] a = {4,3,7,8,6,2,1}; zigzag(a);
        System.out.println(Arrays.toString(a)); // valid zig-zag e.g. [3,7,4,8,2,6,1]
        int[] b = {1,4,3,2}; zigzag(b);
        System.out.println(Arrays.toString(b)); // e.g. [1,4,2,3]
    }
}`,
  },
  {
    topic: 'Array', title: 'Find Duplicates in an Array',
    difficulty: 'Easy',
    practice_url: 'https://www.geeksforgeeks.org/problems/find-duplicates-in-an-array/1',
    statement: `Given an array of n integers where elements are in range [1, n], find all elements that appear more than once. Return them in sorted order; return [-1] if no duplicates exist.`,
    intuition: `Use the array itself as a visited marker. For each value x, negate arr[|x|-1]. If the element at that index is already negative, x is a duplicate. Requires only O(1) extra space and restores original signs at the end.`,
    time_complexity: 'O(n) — two passes',
    space_complexity: 'O(1) — no extra space beyond output',
    code: `import java.util.*;
public class FindDuplicates {
    public static List<Integer> findDuplicates(int[] arr) {
        List<Integer> res = new ArrayList<>();
        for (int x : arr) {
            int i = Math.abs(x) - 1;
            if (arr[i] < 0) res.add(i + 1);
            else arr[i] = -arr[i];
        }
        Collections.sort(res);
        return res.isEmpty() ? List.of(-1) : res;
    }

    public static void main(String[] args) {
        System.out.println(findDuplicates(new int[]{4,3,2,7,8,2,3,1})); // [2,3]
        System.out.println(findDuplicates(new int[]{1,2,3,4}));          // [-1]
        System.out.println(findDuplicates(new int[]{1,1,2}));            // [1]
    }
}`,
  },
  {
    topic: 'Array', title: 'Find a Triplet That Sums to a Given Value',
    difficulty: 'Medium',
    practice_url: 'https://www.geeksforgeeks.org/problems/triplet-sum-in-array-1587115621/1',
    statement: `Given an array of n integers and a target sum, determine whether there exist three elements in the array that sum to the target. Return true or false.`,
    intuition: `Sort the array. For each element arr[i], use two pointers (j = i+1, k = n-1) to find a pair summing to target - arr[i]. If sum is too small, advance j; if too large, retreat k. O(n²) total.`,
    time_complexity: 'O(n²) — outer loop × two-pointer inner loop; O(n log n) sort',
    space_complexity: 'O(1) — in-place sort',
    code: `import java.util.Arrays;
public class TripletSum {
    public static boolean hasTriplet(int[] arr, int target) {
        Arrays.sort(arr);
        for (int i = 0; i < arr.length - 2; i++) {
            int j = i + 1, k = arr.length - 1;
            while (j < k) {
                int s = arr[i] + arr[j] + arr[k];
                if      (s == target) return true;
                else if (s < target)  j++;
                else                  k--;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println(hasTriplet(new int[]{1,4,45,6,10,8}, 22)); // true (4+10+8)
        System.out.println(hasTriplet(new int[]{1,2,4,3,6}, 10));     // true (1+3+6)
        System.out.println(hasTriplet(new int[]{1,2,3,4,5}, 50));     // false
    }
}`,
  },

  // ── String (14 problems) ─────────────────────────────────────────────────────
  // Generate complete solution objects for all 14 String problems following
  // the exact same format as the Array solutions above.
  // Problem list:
  // 1.  "Validate an IP Address"                                      Medium
  // 2.  "Multiply Strings"                                            Medium
  // 3.  "Implement Atoi"                                              Easy
  // 4.  "Check if String is Rotated by Two Places"                    Easy
  // 5.  "Permutations of a Given String"                              Medium
  // 6.  "Longest Repeating Subsequence"                               Medium
  // 7.  "Roman Number to Integer"                                      Easy
  // 8.  "Length of Longest Substring (no repeats)"                    Medium
  // 9.  "String Formation from Substring"                              Easy
  // 10. "Check Whether Two Strings Are Anagrams"                      Easy
  // 11. "Look-and-Say Sequence"                                        Easy
  // 12. "Remove Minimum Characters to Make Strings Anagram"           Easy
  // 13. "Smallest Window Containing All Characters of Another String"  Hard
  // 14. "Length of Longest Substring Without Repeating Characters"     Medium
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/validate-an-ip-address-1587115621/1
  // https://www.geeksforgeeks.org/problems/multiply-two-strings/1
  // https://www.geeksforgeeks.org/problems/implement-atoi/1
  // https://www.geeksforgeeks.org/problems/check-if-string-is-rotated-by-two-places-1587115620/1
  // https://www.geeksforgeeks.org/problems/permutations-of-a-given-string2041/1
  // https://www.geeksforgeeks.org/problems/longest-repeating-subsequence2004/1
  // https://www.geeksforgeeks.org/problems/roman-number-to-integer3201/1
  // https://www.geeksforgeeks.org/problems/length-of-the-longest-substring3036/1
  // https://www.geeksforgeeks.org/problems/string-formation-from-substring2734/1
  // https://www.geeksforgeeks.org/problems/anagram-1587115620/1
  // https://www.geeksforgeeks.org/problems/decode-the-pattern1138/1
  // https://www.geeksforgeeks.org/problems/anagram-of-string/1
  // https://www.geeksforgeeks.org/problems/smallest-window-in-a-string-containing-all-the-characters-of-another-string-1587115621/1
  // https://www.geeksforgeeks.org/problems/longest-distinct-characters-in-string5848/1

  // ── Linked List (14 problems) ────────────────────────────────────────────────
  // Generate complete solution objects for all 14 Linked List problems.
  // Problem list:
  // 1.  "Reverse a Linked List"                                         Easy
  // 2.  "Segregate Even and Odd Nodes in Linked List"                   Medium
  // 3.  "Detect Loop in a Linked List"                                  Easy
  // 4.  "Delete All Occurrences of a Given Key"                         Easy
  // 5.  "Remove Loop in Linked List"                                    Medium
  // 6.  "Nth Node from End of Linked List"                              Easy
  // 7.  "Merge K Sorted Linked Lists"                                   Hard
  // 8.  "Flatten a Binary Tree into Linked List"                        Medium
  // 9.  "Add Two Numbers Represented by Linked Lists"                   Medium
  // 10. "Check if Singly Linked List is Palindrome"                     Medium
  // 11. "Clone a Linked List with Next and Random Pointer"              Hard
  // 12. "Delete Node Without Head Pointer"                              Easy
  // 13. "Sort a Linked List of 0s, 1s and 2s"                          Easy
  // 14. "Intersection of Two Linked Lists"                              Medium
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/reverse-a-linked-list/1
  // https://www.geeksforgeeks.org/problems/segregate-even-and-odd-nodes-in-a-linked-list5035/1
  // https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1
  // https://www.geeksforgeeks.org/problems/delete-keys-in-a-linked-list/1
  // https://www.geeksforgeeks.org/problems/remove-loop-in-linked-list/1
  // https://www.geeksforgeeks.org/problems/nth-node-from-end-of-linked-list/1
  // https://www.geeksforgeeks.org/problems/merge-k-sorted-linked-lists/1
  // https://www.geeksforgeeks.org/problems/flatten-binary-tree-to-linked-list/1
  // https://www.geeksforgeeks.org/problems/add-two-numbers-represented-by-linked-lists/1
  // https://www.geeksforgeeks.org/problems/check-if-linked-list-is-pallindrome/1
  // https://www.geeksforgeeks.org/problems/clone-a-linked-list-with-next-and-random-pointer/1
  // https://www.geeksforgeeks.org/problems/delete-without-head-pointer/1
  // https://www.geeksforgeeks.org/problems/given-a-linked-list-of-0s-1s-and-2s-sort-it/1
  // https://www.geeksforgeeks.org/problems/intersection-of-two-linked-list/1

  // ── Searching (8 problems) ───────────────────────────────────────────────────
  // Generate complete solution objects for all 8 Searching problems.
  // Problem list:
  // 1. "Search in Sorted and Rotated Array"                   Medium
  // 2. "Square Root of an Integer"                            Easy
  // 3. "First and Last Occurrences of X"                      Medium
  // 4. "Find a Peak Element"                                  Medium
  // 5. "Find Smallest Positive Number Missing from Unsorted Array" Medium
  // 6. "Allocate Minimum Number of Pages"                     Hard
  // 7. "Counting Elements in Two Arrays"                      Easy
  // 8. "Median of Two Sorted Arrays of Different Sizes"       Hard
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/search-in-a-rotated-array4618/1
  // https://www.geeksforgeeks.org/problems/square-root/1
  // https://www.geeksforgeeks.org/problems/first-and-last-occurrences-of-x3116/1
  // https://www.geeksforgeeks.org/problems/peak-element/1
  // https://www.geeksforgeeks.org/problems/smallest-positive-missing-number-1587115621/1
  // https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1
  // https://www.geeksforgeeks.org/problems/counting-elements-in-two-arrays/1
  // https://www.geeksforgeeks.org/problems/median-of-2-sorted-arrays-of-different-sizes/1

  // ── Sorting (9 problems) ─────────────────────────────────────────────────────
  // Generate complete solution objects for all 9 Sorting problems.
  // Problem list:
  // 1. "K Largest (or Smallest) Elements in an Array"         Medium
  // 2. "Sort an Array of 0s, 1s, and 2s (Dutch Flag)"        Easy
  // 3. "Count Inversions in an Array"                         Medium
  // 4. "Merge Two Sorted Arrays Without Extra Space"          Hard
  // 5. "Minimum Platforms Required"                           Medium
  // 6. "Quick Sort"                                           Medium
  // 7. "Heap Sort"                                            Medium
  // 8. "Merge K Sorted Arrays"                                Medium
  // 9. "Merge Overlapping Intervals"                          Medium
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/kth-smallest-element5635/1
  // https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1
  // https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1
  // https://www.geeksforgeeks.org/problems/merge-two-sorted-arrays-1587115620/1
  // https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1
  // https://www.geeksforgeeks.org/problems/quick-sort/1
  // https://www.geeksforgeeks.org/problems/heap-sort/1
  // https://www.geeksforgeeks.org/problems/merge-k-sorted-arrays/1
  // https://www.geeksforgeeks.org/problems/overlapping-intervals--170633/1

  // ── Stack (5 problems) ───────────────────────────────────────────────────────
  // Generate complete solution objects for all 5 Stack problems.
  // Problem list:
  // 1. "Check for Balanced Brackets (Well-formedness)"  Easy
  // 2. "Sort a Stack Using Recursion"                   Medium
  // 3. "The Celebrity Problem"                          Medium
  // 4. "Next Greater Element"                           Medium
  // 5. "Queue Using Two Stacks"                         Easy
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/valid-expression1025/1
  // https://www.geeksforgeeks.org/problems/sort-a-stack/1
  // https://www.geeksforgeeks.org/problems/the-celebrity-problem/1
  // https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/1
  // https://www.geeksforgeeks.org/problems/queue-using-two-stacks/1

  // ── Queue (5 problems) ───────────────────────────────────────────────────────
  // Generate complete solution objects for all 5 Queue problems.
  // Problem list:
  // 1. "Stack Using Two Queues"                              Easy
  // 2. "Connect N Ropes with Minimum Cost"                  Medium
  // 3. "Minimum Time to Rot All Oranges"                    Medium
  // 4. "First Negative Integer in Every Window of Size K"   Medium
  // 5. "Reversing a Queue"                                  Easy
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/stack-using-two-queues/1
  // https://www.geeksforgeeks.org/problems/minimum-cost-of-ropes-1587115620/1
  // https://www.geeksforgeeks.org/problems/rotten-oranges2536/1
  // https://www.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1
  // https://www.geeksforgeeks.org/problems/queue-reversal/1

  // ── Tree (16 problems) ──────────────────────────────────────────────────────
  // Generate complete solution objects for all 16 Tree problems.
  // Problem list:
  // 1.  "Inorder Traversal"                                Easy
  // 2.  "Preorder Traversal"                               Easy
  // 3.  "Kth Largest Element in BST"                       Medium
  // 4.  "Left View of Binary Tree"                         Easy
  // 5.  "Right View of Binary Tree"                        Easy
  // 6.  "Check for BST"                                    Easy
  // 7.  "Diameter of a Binary Tree"                        Medium
  // 8.  "Boundary Traversal of Binary Tree"                Medium
  // 9.  "Height of Binary Tree"                            Easy
  // 10. "Lowest Common Ancestor in a Binary Tree"          Medium
  // 11. "Binary Tree to Doubly Linked List"                Hard
  // 12. "Root to Leaf Path Sum"                            Medium
  // 13. "Reverse Level Order Traversal"                    Easy
  // 14. "Construct Tree from Inorder and Preorder"         Medium
  // 15. "ZigZag Tree Traversal"                            Medium
  // 16. "Serialize and Deserialize a Binary Tree"          Hard
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/inorder-traversal/1
  // https://www.geeksforgeeks.org/problems/preorder-traversal/1
  // https://www.geeksforgeeks.org/problems/kth-largest-element-in-bst/1
  // https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1
  // https://www.geeksforgeeks.org/problems/right-view-of-binary-tree/1
  // https://www.geeksforgeeks.org/problems/check-for-bst/1
  // https://www.geeksforgeeks.org/problems/diameter-of-binary-tree/1
  // https://www.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1
  // https://www.geeksforgeeks.org/problems/height-of-binary-tree/1
  // https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-binary-tree/1
  // https://www.geeksforgeeks.org/problems/binary-tree-to-dll/1
  // https://www.geeksforgeeks.org/problems/root-to-leaf-path-sum/1
  // https://www.geeksforgeeks.org/problems/reverse-level-order-traversal/1
  // https://www.geeksforgeeks.org/problems/construct-tree-1/1
  // https://www.geeksforgeeks.org/problems/zigzag-tree-traversal/1
  // https://www.geeksforgeeks.org/problems/serialize-and-deserialize-a-binary-tree/1

  // ── Graph (10 problems) ──────────────────────────────────────────────────────
  // Generate complete solution objects for all 10 Graph problems.
  // Problem list:
  // 1.  "BFS of Graph"                                    Easy
  // 2.  "DFS of Graph"                                    Easy
  // 3.  "Find the Number of Islands"                      Medium
  // 4.  "Topological Sort"                                Medium
  // 5.  "Steps by Knight (Min Steps)"                     Medium
  // 6.  "Strongly Connected Components (Kosaraju's)"      Hard
  // 7.  "Alien Dictionary"                                Hard
  // 8.  "Dijkstra's Shortest Path Algorithm"              Medium
  // 9.  "Detect Cycle in a Directed Graph"                Medium
  // 10. "Detect Cycle in an Undirected Graph"             Medium
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1
  // https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1
  // https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1
  // https://www.geeksforgeeks.org/problems/topological-sort/1
  // https://www.geeksforgeeks.org/problems/steps-by-knight5927/1
  // https://www.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1
  // https://www.geeksforgeeks.org/problems/alien-dictionary/1
  // https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1
  // https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1
  // https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1

  // ── Trie (6 problems) ────────────────────────────────────────────────────────
  // Generate complete solution objects for all 6 Trie problems.
  // Problem list:
  // 1. "Trie Insert and Search"                  Medium
  // 2. "Trie Delete"                             Medium
  // 3. "Print Unique Rows in a Binary Matrix"    Medium
  // 4. "Longest Common Prefix Using Trie"        Medium
  // 5. "Minimum XOR Value Pair"                  Medium
  // 6. "Palindrome Pairs"                        Hard
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/trie-insert-and-search0651/1
  // https://www.geeksforgeeks.org/problems/trie-delete/1
  // https://www.geeksforgeeks.org/problems/unique-rows-in-boolean-matrix/1
  // https://www.geeksforgeeks.org/problems/longest-common-prefix-in-an-array5129/1
  // https://www.geeksforgeeks.org/problems/minimum-xor-value-pair/0
  // https://www.geeksforgeeks.org/problems/palindrome-pairs/1

  // ── Heap & Hash (13 problems) ────────────────────────────────────────────────
  // Generate complete solution objects for all 13 Heap & Hash problems.
  // Problem list:
  // 1.  "Minimum Cost of Ropes"                          Medium
  // 2.  "K Largest Elements"                             Medium
  // 3.  "Kth Element in Sorted Matrix"                   Hard
  // 4.  "Find Median in a Stream"                        Hard
  // 5.  "Kth Largest Element in a Stream"                Medium
  // 6.  "Rearrange Characters (No Two Adjacent Same)"    Medium
  // 7.  "Sort a Nearly Sorted Array"                     Medium
  // 8.  "Nuts and Bolts Problem"                         Medium
  // 9.  "Check if Two Strings are K-Anagrams"            Easy
  // 10. "Sort Array According to Another Array"          Medium
  // 11. "Swapping Pairs to Make Sum Equal"               Easy
  // 12. "Smallest Distinct Window"                       Hard
  // 13. "Find First Repeated Character"                  Easy
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/minimum-cost-of-ropes-1587115620/1
  // https://www.geeksforgeeks.org/problems/k-largest-elements4206/1
  // https://www.geeksforgeeks.org/problems/kth-element-in-matrix/1
  // https://www.geeksforgeeks.org/problems/find-median-in-a-stream-1587115620/1
  // https://www.geeksforgeeks.org/problems/kth-largest-element-in-a-stream2220/1
  // https://www.geeksforgeeks.org/problems/rearrange-characters4649/1
  // https://www.geeksforgeeks.org/problems/nearly-sorted-1587115620/1
  // https://www.geeksforgeeks.org/problems/nuts-and-bolts-problem0431/1
  // https://www.geeksforgeeks.org/problems/check-if-two-strings-are-k-anagrams-or-not/1
  // https://www.geeksforgeeks.org/problems/relative-sorting4323/1
  // https://www.geeksforgeeks.org/problems/swapping-pairs-make-sum-equal4142/1
  // https://www.geeksforgeeks.org/problems/smallest-distant-window3132/1
  // https://www.geeksforgeeks.org/problems/find-first-repeated-character4108/1

  // ── Bit Magic (8 problems) ───────────────────────────────────────────────────
  // Generate complete solution objects for all 8 Bit Magic problems.
  // Problem list:
  // 1. "Find the Missing Number"                                Easy
  // 2. "Power of 2"                                            Easy
  // 3. "Reverse Bits"                                          Easy
  // 4. "Maximum Subset XOR"                                    Hard
  // 5. "Check Set Bits"                                        Easy
  // 6. "Minimum X such that X XOR A is Minimized"              Medium
  // 7. "Longest Consecutive 1s in Binary Representation"       Easy
  // 8. "Number of 1 Bits (Hamming Weight)"                     Easy
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/missing-number-in-array1416/1
  // https://www.geeksforgeeks.org/problems/power-of-2-1587115620/1
  // https://www.geeksforgeeks.org/problems/reverse-bits-1611130171/1
  // https://www.geeksforgeeks.org/problems/maximum-subset-xor/1
  // https://www.geeksforgeeks.org/problems/check-set-bits5408/1
  // https://www.geeksforgeeks.org/problems/minimum-x-xor-a--170645/1
  // https://www.geeksforgeeks.org/problems/longest-consecutive-1s-1587115620/1
  // https://www.geeksforgeeks.org/problems/set-bits0143/1

  // ── Recursion & Backtracking (12 problems) ───────────────────────────────────
  // Generate complete solution objects for all 12 Recursion & Backtracking problems.
  // Problem list:
  // 1.  "Print All Permutations of a String"              Medium
  // 2.  "Rat in a Maze"                                   Medium
  // 3.  "Josephus Problem"                                Medium
  // 4.  "Combination Sum"                                 Medium
  // 5.  "Partition Equal Subset Sum"                      Medium
  // 6.  "N-Queen Problem"                                 Hard
  // 7.  "Shuffle Integers (A1 B1 A2 B2 format)"           Hard
  // 8.  "Hamiltonian Path"                                Hard
  // 9.  "Find the String in Grid (Word Search)"           Medium
  // 10. "Pascal Triangle"                                 Easy
  // 11. "Solve the Sudoku"                                Hard
  // 12. "Largest Number in K Swaps"                       Medium
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/permutations-of-a-given-string2041/1
  // https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1
  // https://www.geeksforgeeks.org/problems/josephus-problem/1
  // https://www.geeksforgeeks.org/problems/combination-sum-1587115620/1
  // https://www.geeksforgeeks.org/problems/subset-sum-problem2014/1
  // https://www.geeksforgeeks.org/problems/n-queen-problem0315/1
  // https://www.geeksforgeeks.org/problems/shuffle-integers2401/1
  // https://www.geeksforgeeks.org/problems/hamiltonian-path2522/1
  // https://www.geeksforgeeks.org/problems/find-the-string-in-grid0111/1
  // https://www.geeksforgeeks.org/problems/pascal-triangle0652/1
  // https://www.geeksforgeeks.org/problems/solve-the-sudoku-1587115621/1
  // https://www.geeksforgeeks.org/problems/largest-number-in-k-swaps-1587115620/1

  // ── Dynamic Programming (17 problems) ───────────────────────────────────────
  // Generate complete solution objects for all 17 DP problems.
  // Problem list:
  // 1.  "0/1 Knapsack Problem"                  Medium
  // 2.  "Partition Equal Subset Sum"             Medium
  // 3.  "Coin Change (Number of Ways)"           Medium
  // 4.  "Longest Common Subsequence"             Medium
  // 5.  "Stock Buy and Sell"                     Easy
  // 6.  "Interleaved Strings"                    Hard
  // 7.  "Edit Distance"                          Hard
  // 8.  "Stickler Thief (House Robber)"          Medium
  // 9.  "Longest Common Substring"               Medium
  // 10. "Number of Coins (Minimum Coins)"        Medium
  // 11. "Egg Dropping Puzzle"                    Hard
  // 12. "Word Break"                             Medium
  // 13. "Wildcard Pattern Matching"              Hard
  // 14. "Total Decoding Messages"                Medium
  // 15. "Jump Game (Minimum Jumps)"              Medium
  // 16. "Special Keyboard (Max A's)"             Medium
  // 17. "Longest Palindromic Subsequence"        Medium
  //
  // practice_url for each (in order):
  // https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1
  // https://www.geeksforgeeks.org/problems/subset-sum-problem2014/1
  // https://www.geeksforgeeks.org/problems/coin-change2448/1
  // https://www.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1
  // https://www.geeksforgeeks.org/problems/stock-buy-and-sell-1587115621/1
  // https://www.geeksforgeeks.org/problems/interleaved-strings/1
  // https://www.geeksforgeeks.org/problems/edit-distance3702/1
  // https://www.geeksforgeeks.org/problems/stickler-theif-1587115621/1
  // https://www.geeksforgeeks.org/problems/longest-common-substring1452/1
  // https://www.geeksforgeeks.org/problems/number-of-coins1824/1
  // https://www.geeksforgeeks.org/problems/egg-dropping-puzzle-1587115620/1
  // https://www.geeksforgeeks.org/problems/word-break1352/1
  // https://www.geeksforgeeks.org/problems/wildcard-pattern-matching/1
  // https://www.geeksforgeeks.org/problems/total-decoding-messages1235/1
  // https://www.geeksforgeeks.org/problems/jump-game/1
  // https://www.geeksforgeeks.org/problems/special-keyboard3018/1
  // https://www.geeksforgeeks.org/problems/longest-palindromic-subsequence-1612327878/1
];

const insert = db.prepare(`
  INSERT OR REPLACE INTO amazon_problems
    (topic, title, difficulty, practice_url, statement, intuition,
     time_complexity, space_complexity, code)
  VALUES
    (@topic, @title, @difficulty, @practice_url, @statement, @intuition,
     @time_complexity, @space_complexity, @code)
`);

const insertAll = db.transaction((probs) => {
  for (const p of probs) insert.run(p);
});

insertAll(problems);
console.log(`✓ Seeded ${problems.length} problems into amazon_problems`);
```

- [ ] **Step 2: Verify the file is syntactically valid before running**

```bash
node --input-type=module --eval "import './server/seed-amazon.js'" 2>&1 | head -5
```

This will also seed the DB if it runs clean.

- [ ] **Step 3: Commit**

```bash
git add server/seed-amazon.js
git commit -m "feat: add seed script with 147 Amazon SDE problems and Java solutions"
```

---

## Task 7: Run Seed Script and Verify

**Files:** None (runtime only)

- [ ] **Step 1: Run the seed script**

```bash
cd /Users/shashankhr/Downloads/prepquest
node server/seed-amazon.js
```

Expected output:
```
✓ Seeded 147 problems into amazon_problems
```

- [ ] **Step 2: Verify all topics are present in the DB**

```bash
node --input-type=module --eval "
import { getAllAmazonProblems } from './server/db.js';
const probs = getAllAmazonProblems();
const byTopic = {};
for (const p of probs) byTopic[p.topic] = (byTopic[p.topic]||0)+1;
console.log(JSON.stringify(byTopic, null, 2));
console.log('Total:', probs.length);
"
```

Expected: 14 topics listed, total 147.

- [ ] **Step 3: Verify a specific problem detail loads via the API**

With the server running:
```bash
curl -s http://localhost:3001/api/amazon/problem/1 | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['title'], '|', d['time_complexity'])"
```

Expected: `Largest Sum Contiguous Subarray (Kadane's) | O(n) — single pass through the array`

- [ ] **Step 4: Smoke-test the full UI flow**

Open `http://localhost:5173/amazon`. Confirm:
1. Topic grid shows 14 cards with correct problem counts
2. Clicking "Array" shows 10 problems
3. Clicking a problem loads the detail page with statement, intuition, complexities, and Java code
4. Back buttons work at both levels

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: complete Amazon SDE Sheet integration — 147 problems seeded and UI verified"
```
