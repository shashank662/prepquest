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
  const [view,            setView]            = useState('topics');
  const [selectedTopic,   setSelectedTopic]   = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [allProblems,     setAllProblems]     = useState([]);
  const [detail,          setDetail]          = useState(null);
  const [loadingDetail,   setLoadingDetail]   = useState(false);
  const [detailError,     setDetailError]     = useState(null);
  const [hoveredCard,     setHoveredCard]     = useState(null);
  const [problemsError,   setProblemsError]   = useState(null);

  useEffect(() => {
    fetch('/api/amazon/problems')
      .then(r => { if (!r.ok) throw new Error('Failed to load problems'); return r.json(); })
      .then(data => setAllProblems(Array.isArray(data) ? data : []))
      .catch(() => setProblemsError('Failed to load problems. Is the server running?'));
  }, []);

  const topicCounts = {};
  for (const p of allProblems) {
    topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
  }

  function openTopic(topic) {
    setHoveredCard(null);
    setSelectedTopic(topic);
    setView('problems');
  }

  function openProblem(problem) {
    setHoveredCard(null);
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
          {problemsError && <div style={{ color: '#f44336', fontSize: 13, marginBottom: 16 }}>{problemsError}</div>}
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
