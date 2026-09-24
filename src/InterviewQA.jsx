import { useState, useMemo, Fragment } from 'react';

// Java + Spring Boot interview Q&A, served at /qa. Content lives in src/qa/java-spring.json,
// which is personal prep material and is gitignored. The glob keeps the build working when
// the file is absent (fresh clone, deploys); the page then explains where the file goes.
const found = Object.values(import.meta.glob('./qa/java-spring.json', { eager: true, import: 'default' }));
const data = found[0] ?? null;

// Each answer is a list of blocks: say (what to say out loud), p/h/list/code (the mechanism),
// warn (a trap worth volunteering), story (resume tie-in), push (likely follow-ups).

const S = {
  page:  { width: '100%', maxWidth: 780, fontFamily: 'var(--font-mono)', fontSize: 13 },
  card:  { background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '1rem 1.25rem', marginBottom: 12 },
  label: { fontSize: 10, fontWeight: 500, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 },
  prose: { fontSize: 13, lineHeight: 1.7, color: 'var(--color-text-primary)', margin: '0 0 10px' },
  code:  { margin: '0 0 10px', padding: '12px 14px', overflowX: 'auto', fontSize: 12, lineHeight: 1.55, fontFamily: 'var(--font-mono)', fontVariantLigatures: 'none', background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', color: 'var(--color-text-primary)' },
  tone:  (c) => ({ borderLeft: `3px solid var(--color-border-${c})`, background: `var(--color-background-${c})`, borderRadius: 'var(--border-radius-md)', padding: '10px 14px', margin: '0 0 12px' }),
  btn:   { fontSize: 11, padding: '5px 10px', color: 'var(--color-text-secondary)' },
  pill:  (c) => ({ fontSize: 9, padding: '1px 6px', borderRadius: 'var(--border-radius-md)', background: `var(--color-background-${c})`, color: `var(--color-text-${c})`, whiteSpace: 'nowrap' }),
};

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const unescape = (s) => s.replace(/&(amp|lt|gt|quot|#39);/g, m => ENTITIES[m]);

// Renders the small inline subset used in the data (<b>, <em>, <code>) as React elements.
// Anything else is plain text, so no HTML from the data is ever injected into the page.
function Rich({ html }) {
  const out = [];
  const stack = [out];
  const re = /<(\/?)(b|em|code)>/g;
  let last = 0, m, key = 0;
  const pushText = (t) => { if (t) stack[stack.length - 1].push(unescape(t)); };
  while ((m = re.exec(html))) {
    pushText(html.slice(last, m.index));
    last = re.lastIndex;
    if (!m[1]) { const kids = []; kids.tag = m[2]; stack.push(kids); }
    else if (stack.length > 1) {
      const kids = stack.pop();
      const Tag = kids.tag;
      const style = Tag === 'code'
        ? { fontFamily: 'var(--font-mono)', fontVariantLigatures: 'none', fontSize: '0.92em', background: 'var(--color-background-secondary)', padding: '0 4px', borderRadius: 4 }
        : Tag === 'b' ? { fontWeight: 600 } : undefined;
      stack[stack.length - 1].push(<Tag key={key++} style={style}>{kids}</Tag>);
    }
  }
  pushText(html.slice(last));
  while (stack.length > 1) { const kids = stack.pop(); stack[stack.length - 1].push(...kids); }
  return <>{out.map((x, i) => <Fragment key={i}>{x}</Fragment>)}</>;
}

function Block({ b }) {
  switch (b.type) {
    case 'say':   return <div style={S.tone('success')}><div style={{ ...S.label, color: 'var(--color-text-success)' }}>Say this</div><p style={{ ...S.prose, margin: 0 }}><Rich html={b.html} /></p></div>;
    case 'warn':  return <div style={S.tone('danger')}><p style={{ ...S.prose, margin: 0 }}><Rich html={b.html} /></p></div>;
    case 'story': return <div style={S.tone('info')}><p style={{ ...S.prose, margin: 0 }}><Rich html={b.html} /></p></div>;
    case 'push':  return (
      <div style={S.tone('warning')}>
        <div style={{ ...S.label, color: 'var(--color-text-warning)' }}>If they push</div>
        {b.items.map((t, i) => <p key={i} style={{ ...S.prose, margin: i === b.items.length - 1 ? 0 : '0 0 8px' }}><Rich html={t} /></p>)}
      </div>
    );
    case 'h':     return <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', margin: '14px 0 6px' }}>{b.text}</div>;
    case 'code':  return <pre style={S.code}>{b.text}</pre>;
    case 'list':  {
      const L = b.ordered ? 'ol' : 'ul';
      return <L style={{ ...S.prose, paddingLeft: 20 }}>{b.items.map((t, i) => <li key={i} style={{ marginBottom: 4 }}><Rich html={t} /></li>)}</L>;
    }
    default:      return <p style={S.prose}><Rich html={b.html} /></p>;
  }
}

// Search text for one question. Only html fields carry markup and entities; code/heading text is
// raw, so a generic tag strip there would eat things like List<String>.
const fromHtml = (h) => unescape(h.replace(/<\/?(b|em|code)>/g, ''));

function plainText(q) {
  const parts = [q.id, q.title, q.tag || ''];
  for (const b of q.blocks) {
    if (b.text) parts.push(b.text);
    if (b.html) parts.push(fromHtml(b.html));
    if (b.items) parts.push(...b.items.map(fromHtml));
  }
  return parts.join(' ').toLowerCase();
}

export default function InterviewQA() {
  if (!data) {
    return (
      <div style={{ ...S.page, paddingTop: 40, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        The Q&amp;A content isn't in this copy of PrepQuest. It is kept out of the public repo; put
        <code style={{ margin: '0 4px' }}>java-spring.json</code> in <code>src/qa/</code> and reload.
        <div style={{ marginTop: 12 }}><a href="/" style={{ color: 'var(--color-text-info)' }}>← PrepQuest</a></div>
      </div>
    );
  }
  return <QA />;
}

function QA() {
  const [open,  setOpen]  = useState(() => new Set());
  const [query, setQuery] = useState('');
  // While searching every match starts open; this tracks the ones closed by hand, per query.
  const [closed, setClosed] = useState(() => new Set());

  const index = useMemo(
    () => data.sections.flatMap(s => s.questions.map(q => [q.id, plainText(q)])),
    [],
  );
  const q = query.trim().toLowerCase();
  const matches = q ? new Set(index.filter(([, t]) => t.includes(q)).map(([id]) => id)) : null;
  const total = index.length;
  const added = data.sections.reduce((n, s) => n + s.questions.filter(x => x.added).length, 0);
  const reviewed = data.sections.reduce((n, s) => n + s.questions.filter(x => x.review).length, 0);

  const flip = (set, id) => { const n = new Set(set); n.has(id) ? n.delete(id) : n.add(id); return n; };
  const toggle = (id) => matches ? setClosed(prev => flip(prev, id)) : setOpen(prev => flip(prev, id));
  const allIds = () => new Set(index.map(([id]) => id));
  const expandAll = () => matches ? setClosed(new Set()) : setOpen(allIds());
  const collapseAll = () => matches ? setClosed(allIds()) : setOpen(new Set());

  return (
    <div style={S.page}>
      <div style={{ ...S.card, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 500, fontSize: 15, color: 'var(--color-text-primary)' }}>{data.title}</span>
        <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{data.subtitle} · {total} questions</span>
        <a href="/" style={{ marginLeft: 'auto', fontSize: 11, padding: '4px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>← PrepQuest</a>
      </div>

      <div style={{ ...S.card, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        {data.howto}
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--color-text-tertiary)' }}>
          Reviewed: {reviewed} answers corrected (marked <span style={S.pill('danger')}>corrected</span>), {added} questions added (marked <span style={S.pill('info')}>added</span>).
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setClosed(new Set()); }}
          placeholder="Search questions and answers…"
          aria-label="Search questions and answers"
          style={{ flex: 1, minWidth: 180, fontFamily: 'var(--font-mono)', fontSize: 12, padding: '7px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', outline: 'none' }}
        />
        <button style={S.btn} onClick={expandAll}>Expand all</button>
        <button style={S.btn} onClick={collapseAll}>Collapse all</button>
      </div>

      {data.sections.map(sec => {
        const qs = sec.questions.filter(x => !matches || matches.has(x.id));
        if (!qs.length) return null;
        return (
          <div key={sec.num} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-info)' }}>{sec.num}</span>
              <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>{sec.title}</span>
              <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginLeft: 'auto' }}>{sec.questions.length} questions</span>
            </div>
            {sec.note && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 10 }}><Rich html={sec.note} /></div>}
            {qs.map(item => {
              const isOpen = matches ? !closed.has(item.id) : open.has(item.id);
              return (
                <div key={item.id} style={{ ...S.card, padding: 0, overflow: 'hidden', marginBottom: 8 }}>
                  <button
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: 'none', borderRadius: 0, background: 'none', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)', minWidth: 26 }}>{item.id}</span>
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--color-text-primary)' }}>{item.title}</span>
                    {item.added  && <span style={S.pill('info')}>added</span>}
                    {item.review && <span style={S.pill('danger')}>corrected</span>}
                    <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '4px 14px 12px', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
                      {item.tag && <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', margin: '8px 0' }}>{item.tag}</div>}
                      <div style={{ height: 8 }} />
                      {item.blocks.map((b, i) => <Block key={i} b={b} />)}
                      {item.review && (
                        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', borderTop: '0.5px dashed var(--color-border-tertiary)', paddingTop: 8, marginTop: 4 }}>
                          <span style={{ color: 'var(--color-text-danger)' }}>Corrected in review: </span>{item.review.join(' ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {matches && matches.size === 0 && <div style={{ ...S.card, color: 'var(--color-text-tertiary)' }}>No questions match “{query}”.</div>}

      {!matches && (
        <div style={S.card}>
          <div style={S.label}>{data.closing.title}</div>
          {data.closing.paragraphs.map((t, i) => <p key={i} style={S.prose}>{t}</p>)}
        </div>
      )}
    </div>
  );
}
