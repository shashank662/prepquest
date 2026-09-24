import { useState, useEffect } from 'react';

// Striver's 180 – Master DSA Patterns (takeuforward.org). Three levels:
// modules → problems grouped by pattern → problem detail. The current view lives in the
// URL hash (#/m/<module>, #/p/<id>) so refresh and the browser back button work.

const MODULE_ICONS = {
  'Arrays': '▦', 'Hashing': '#', 'Binary Search': '⌕', 'Sliding Window and Two Pointers': '⇆',
  'Recursion and Backtracking': '↩', 'Linked List': '⛓', 'Stack and Queues': '▤',
  'Greedy Algorithms': '✦', 'Heaps': '△', 'Binary Trees': '⑂', 'Binary Search Trees': '⑃',
  'Graphs': '◉', 'Dynamic Programming': '▣', 'Tries': '⋔', 'Strings': '❝',
  'Bit Manipulation': '⊕', 'Mathematics': '∑',
};

const DIFF = {
  Easy:   { c: 'success' },
  Medium: { c: 'warning' },
  Hard:   { c: 'danger'  },
};

function parseHash() {
  const h = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));
  if (h.startsWith('m/')) return { view: 'module', module: h.slice(2) };
  if (h.startsWith('p/')) return { view: 'problem', id: parseInt(h.slice(2), 10) };
  return { view: 'modules' };
}
function go(hash) { window.location.hash = hash; }

const S = {
  page:  { width: '100%', maxWidth: 780, fontFamily: 'var(--font-mono)', fontSize: 13 },
  card:  { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '1rem 1.25rem', marginBottom: 12 },
  label: { fontSize: 10, fontWeight: 500, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 },
  back:  { fontSize: 11, padding: '5px 10px', marginBottom: 14, color: 'var(--color-text-secondary)' },
  pill:  (c) => ({ fontSize: 10, padding: '2px 7px', borderRadius: 'var(--border-radius-md)', background: `var(--color-background-${c})`, color: `var(--color-text-${c})`, whiteSpace: 'nowrap' }),
  link:  { fontSize: 11, padding: '4px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-info)', textDecoration: 'none', whiteSpace: 'nowrap' },
  prose: { fontSize: 13, lineHeight: 1.7, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' },
  code:  { margin: 0, padding: '14px 16px', overflowX: 'auto', fontSize: 12, lineHeight: 1.6, fontFamily: 'var(--font-mono)', fontVariantLigatures: 'none', background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', color: 'var(--color-text-primary)' },
};

function DiffPill({ d }) { return <span style={S.pill(DIFF[d]?.c || 'info')}>{d}</span>; }
function TierPill({ t }) { return <span style={{ ...S.pill('info'), background: 'transparent', border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-tertiary)' }}>{t}</span>; }

function Header({ problems }) {
  return (
    <div style={{ ...S.card, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
      <span style={{ fontWeight: 500, fontSize: 15, color: 'var(--color-text-primary)' }}>Striver's 180</span>
      <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Master DSA Patterns · {problems.length} problems · Java solutions</span>
      <a href="/" style={{ ...S.link, marginLeft: 'auto', color: 'var(--color-text-secondary)' }}>← PrepQuest</a>
    </div>
  );
}

export default function StriverSheet() {
  const [route,    setRoute]    = useState(parseHash);
  const [problems, setProblems] = useState(null);
  const [error,    setError]    = useState(null);
  const [detail,   setDetail]   = useState(null);
  const [detailErr,setDetailErr]= useState(null);

  useEffect(() => {
    const onHash = () => { setRoute(parseHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    fetch('/api/sheet/problems')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setProblems(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load the sheet. Is the server running? (npm run dev)'));
  }, []);

  useEffect(() => {
    if (route.view !== 'problem') return;
    const ctrl = new AbortController();
    setDetail(null); setDetailErr(null);
    fetch(`/api/sheet/problem/${route.id}`, { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(r.status === 404 ? 'Problem not found.' : 'Failed to load solution.'); return r.json(); })
      .then(setDetail)
      .catch(err => { if (err.name !== 'AbortError') setDetailErr(err.message); });
    return () => ctrl.abort();
  }, [route]);

  if (error)     return <div style={{ ...S.page, color: 'var(--color-text-danger)', paddingTop: 40 }}>{error}</div>;
  if (!problems) return <div style={{ ...S.page, color: 'var(--color-text-tertiary)', paddingTop: 40 }}>Loading…</div>;
  if (problems.length === 0)
    return <div style={{ ...S.page, color: 'var(--color-text-secondary)', paddingTop: 40 }}>The sheet is empty. Run <code>npm run seed</code> to load the problems.</div>;

  const modules = [];
  for (const p of problems) if (!modules.includes(p.module)) modules.push(p.module);

  // ── Problem detail ────────────────────────────────────────────────────────
  if (route.view === 'problem') {
    const meta = problems.find(p => p.id === route.id);
    const idx  = problems.findIndex(p => p.id === route.id);
    const prev = idx > 0 ? problems[idx - 1] : null;
    const next = idx >= 0 ? problems[idx + 1] : null;
    return (
      <div style={S.page}>
        <Header problems={problems} />
        {meta && <button style={S.back} onClick={() => go(`/m/${encodeURIComponent(meta.module)}`)}>← {meta.module}</button>}
        {!meta && <button style={S.back} onClick={() => go('/')}>← All modules</button>}
        {detailErr && <div style={{ ...S.card, color: 'var(--color-text-danger)' }}>{detailErr}</div>}
        {meta && (
          <div style={S.card}>
            <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>#{meta.id} · {meta.module} › {meta.pattern}</div>
            <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 10 }}>{meta.title}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <DiffPill d={meta.difficulty} /><TierPill t={meta.tier} />
              <span style={{ flex: 1 }} />
              <a style={S.link} href={meta.tuf_url} target="_blank" rel="noreferrer">Practice on TUF ↗</a>
              {meta.leetcode_url && <a style={S.link} href={meta.leetcode_url} target="_blank" rel="noreferrer">LeetCode ↗</a>}
              {meta.article_url && <a style={S.link} href={meta.article_url} target="_blank" rel="noreferrer">Article ↗</a>}
            </div>
          </div>
        )}
        {meta && !detail && !detailErr && <div style={{ ...S.card, color: 'var(--color-text-tertiary)' }}>Loading solution…</div>}
        {detail && (
          <>
            <div style={S.card}><div style={S.label}>Problem</div><div style={S.prose}>{detail.statement || '—'}</div></div>
            <div style={S.card}><div style={S.label}>Intuition</div><div style={S.prose}>{detail.intuition || '—'}</div></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
              {[['Time', detail.time_complexity], ['Space', detail.space_complexity]].map(([k, v]) => (
                <div key={k} style={{ ...S.card, marginBottom: 0 }}>
                  <div style={S.label}>{k} complexity</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{v || '—'}</div>
                </div>
              ))}
            </div>
            {detail.code && (
              <div style={S.card}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ ...S.label, marginBottom: 0 }}>Java solution</div>
                  <CopyButton text={detail.code} />
                </div>
                <pre style={S.code}>{detail.code}</pre>
              </div>
            )}
          </>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
          {prev ? <button style={S.back} onClick={() => go(`/p/${prev.id}`)}>← {prev.title}</button> : <span />}
          {next ? <button style={S.back} onClick={() => go(`/p/${next.id}`)}>{next.title} →</button> : <span />}
        </div>
      </div>
    );
  }

  // ── Problems in one module, grouped by pattern ────────────────────────────
  if (route.view === 'module' && modules.includes(route.module)) {
    const inModule = problems.filter(p => p.module === route.module);
    const patterns = [];
    for (const p of inModule) if (!patterns.includes(p.pattern)) patterns.push(p.pattern);
    return (
      <div style={S.page}>
        <Header problems={problems} />
        <button style={S.back} onClick={() => go('/')}>← All modules</button>
        <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 12 }}>
          {MODULE_ICONS[route.module]} {route.module} <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 400 }}>· {inModule.length} problems</span>
        </div>
        {patterns.map(pat => (
          <div key={pat} style={S.card}>
            <div style={S.label}>{pat}</div>
            {inModule.filter(p => p.pattern === pat).map(p => (
              <a key={p.id} href={`#/p/${p.id}`} className="sheet-row" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 6px', borderRadius: 'var(--border-radius-md)', textDecoration: 'none', color: 'var(--color-text-primary)' }}>
                <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)', minWidth: 28 }}>#{p.id}</span>
                <span style={{ flex: 1, minWidth: 0 }}>{p.title}</span>
                <TierPill t={p.tier} /><DiffPill d={p.difficulty} />
              </a>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // ── Module grid ───────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      <Header problems={problems} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {modules.map(m => {
          const ps = problems.filter(p => p.module === m);
          const count = d => ps.filter(p => p.difficulty === d).length;
          return (
            <a key={m} href={`#/m/${encodeURIComponent(m)}`} className="sheet-card" style={{ ...S.card, marginBottom: 0, textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: 18, marginBottom: 6, color: 'var(--color-text-secondary)' }}>{MODULE_ICONS[m] || '•'}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 4 }}>{m}</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                {ps.length} problems · <span style={{ color: 'var(--color-text-success)' }}>{count('Easy')}E</span> <span style={{ color: 'var(--color-text-warning)' }}>{count('Medium')}M</span> <span style={{ color: 'var(--color-text-danger)' }}>{count('Hard')}H</span>
              </div>
            </a>
          );
        })}
      </div>
      <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 16, lineHeight: 1.6 }}>
        Problem list and grouping from takeUforward's <a href="https://takeuforward.org/prep-hub/strivers-180-master-dsa-patterns" target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-info)' }}>Striver's 180 sheet</a>. Easy/Medium/Hard are LeetCode-style ratings; Basic/Core/Pro is TUF's tier.
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable (e.g. plain http on a phone) */ }
  }
  return <button onClick={copy} style={{ marginLeft: 'auto', fontSize: 10, padding: '3px 8px', color: 'var(--color-text-secondary)' }}>{copied ? 'Copied ✓' : 'Copy'}</button>;
}
