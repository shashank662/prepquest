# Daily Activity Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated XP-per-day line chart to the overview tab backed by a new `activity_log` SQLite table.

**Architecture:** New `activity_log` table records XP earned per calendar day; each `/api/log` call upserts into it. A new `/api/activity?days=N` endpoint serves the last N days (zero-filled). A pure-SVG React component renders the chart with CSS animations and sits at the top of the overview tab.

**Tech Stack:** better-sqlite3, Express, React 18, inline SVG, CSS keyframe animations

---

## File Map

| File | What changes |
|------|-------------|
| `server/db.js` | Add `activity_log` table DDL; add `upsertActivity(date, xp)` and `getActivity(days)`; update `resetAll()` |
| `server/index.js` | Import `upsertActivity` and `getActivity`; call `upsertActivity` inside `POST /api/log`; add `GET /api/activity` |
| `src/index.css` | Add CSS keyframe animations for chart line draw, area fade, dot pop, today pulse |
| `src/App.jsx` | Add `ActivityGraph` component; render it at the top of `OverviewTab` |

---

## Task 1: DB — activity_log table + functions

**Files:**
- Modify: `server/db.js`

- [ ] **Step 1: Add the table DDL**

In `server/db.js`, add `activity_log` to the existing `db.exec(...)` block (after the `java_topics` table):

```js
  CREATE TABLE IF NOT EXISTS activity_log (
    date TEXT PRIMARY KEY,
    xp   INTEGER DEFAULT 0
  );
```

The full `db.exec` block should now end with:

```js
  CREATE TABLE IF NOT EXISTS java_topics (
    topic TEXT    PRIMARY KEY,
    done  INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    date TEXT PRIMARY KEY,
    xp   INTEGER DEFAULT 0
  );
`);
```

- [ ] **Step 2: Add `upsertActivity`**

After the existing `export function upsertJava(...)` block, add:

```js
export function upsertActivity(date, xp) {
  db.prepare(`
    INSERT INTO activity_log (date, xp) VALUES (?, ?)
    ON CONFLICT(date) DO UPDATE SET xp = xp + excluded.xp
  `).run(date, xp);
}
```

- [ ] **Step 3: Add `getActivity`**

After `upsertActivity`, add:

```js
export function getActivity(days) {
  const start = (() => {
    const d = new Date();
    d.setDate(d.getDate() - days + 1);
    return d.toISOString().slice(0, 10);
  })();
  const rows = db.prepare(
    'SELECT date, xp FROM activity_log WHERE date >= ? ORDER BY date ASC'
  ).all(start);
  const map = Object.fromEntries(rows.map(r => [r.date, r.xp]));
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    result.push({ date, xp: map[date] ?? 0 });
  }
  return result;
}
```

- [ ] **Step 4: Update `resetAll` to clear activity_log**

Find the existing `resetAll` function and add one line:

```js
export function resetAll() {
  db.prepare(`UPDATE profile SET xp=0, streak=0, last_date=NULL,
    easy=0, medium=0, hard=0, sd_done=0, java_done=0, achievements='[]'
    WHERE id=1`).run();
  db.prepare('DELETE FROM dsa_topics').run();
  db.prepare('DELETE FROM sd_topics').run();
  db.prepare('DELETE FROM java_topics').run();
  db.prepare('DELETE FROM activity_log').run();   // ← add this line
}
```

- [ ] **Step 5: Verify the server starts without errors**

```bash
cd /Users/shashankhr/Downloads/prepquest
node -e "import('./server/db.js').then(() => console.log('DB OK')).catch(e => console.error(e))"
```

Expected output: `DB OK`

- [ ] **Step 6: Commit**

```bash
git add server/db.js
git commit -m "feat: add activity_log table with upsert and query functions"
```

---

## Task 2: API — wire up activity_log + new endpoint

**Files:**
- Modify: `server/index.js`

- [ ] **Step 1: Import the new DB functions**

At the top of `server/index.js`, update the import line from:

```js
import { getAll, saveProfile, upsertDSA, upsertSD, upsertJava, resetAll } from './db.js';
```

to:

```js
import { getAll, saveProfile, upsertDSA, upsertSD, upsertJava, resetAll, upsertActivity, getActivity } from './db.js';
```

- [ ] **Step 2: Call `upsertActivity` inside `POST /api/log`**

In the `POST /api/log` handler, `saveProfile(finalProfile)` is the last DB write before `res.json(...)`. Add the `upsertActivity` call right after it. The total XP earned in this call is the difference between `finalProfile.xp` and the original `profile.xp` before any mutations — but it's simpler to track the delta directly.

Replace the bottom of the `/api/log` handler:

```js
    const { profile: finalProfile, earned } = checkAchievements(profile, dsa);
    saveProfile(finalProfile);

    res.json({ profile: finalProfile, dsa, sd, java, msg, newAchievements: earned });
```

with:

```js
    const { profile: finalProfile, earned } = checkAchievements(profile, dsa);
    saveProfile(finalProfile);
    upsertActivity(todayStr(), finalProfile.xp - originalXp);

    res.json({ profile: finalProfile, dsa, sd, java, msg, newAchievements: earned });
```

Then capture `originalXp` at the very top of the try block, right after `let { profile, dsa, sd, java } = getAll();`:

```js
    let { profile, dsa, sd, java } = getAll();
    const originalXp = profile.xp;   // ← add this line
    let msg = '';
```

- [ ] **Step 3: Add `GET /api/activity` endpoint**

Add this route after the existing `GET /api/data` route:

```js
// GET /api/activity?days=N
app.get('/api/activity', (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 365);
  try { res.json({ data: getActivity(days) }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
```

- [ ] **Step 4: Manually verify the endpoint**

Start the dev server (`npm run dev`) in a terminal, then in another terminal:

```bash
curl "http://localhost:3001/api/activity?days=7"
```

Expected: `{"data":[{"date":"2026-04-06","xp":0},{"date":"2026-04-07","xp":0},...,{"date":"2026-04-12","xp":0}]}`
(All zeros is correct — no activity logged yet.)

- [ ] **Step 5: Log one activity and verify it records**

In the app UI, log a DSA problem. Then:

```bash
curl "http://localhost:3001/api/activity?days=7"
```

Expected: today's entry has `xp > 0`.

- [ ] **Step 6: Commit**

```bash
git add server/index.js
git commit -m "feat: record daily xp in activity_log, add GET /api/activity endpoint"
```

---

## Task 3: CSS — chart animation keyframes

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Append animation keyframes**

Add the following block to the end of `src/index.css`:

```css
/* ── ActivityGraph animations ─────────────────────────────── */

/* Line draws left → right */
.xp-line {
  stroke-dasharray: 3000;
  stroke-dashoffset: 3000;
  animation: xp-draw-line 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes xp-draw-line {
  to { stroke-dashoffset: 0; }
}

/* Area fill fades in after line finishes */
.xp-area {
  opacity: 0;
  animation: xp-fade-area 0.6s ease forwards 0.7s;
}
@keyframes xp-fade-area {
  to { opacity: 1; }
}

/* Individual dots pop in (spring bounce) — delay set per-dot via inline style */
.xp-dot {
  transform-origin: center;
  transform-box: fill-box;
  opacity: 0;
  transform: scale(0);
  animation: xp-pop-dot 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes xp-pop-dot {
  to { opacity: 1; transform: scale(1); }
}

/* Today dot: continuous amber pulse */
.xp-pulse {
  transform-origin: center;
  transform-box: fill-box;
  animation: xp-pulse 2s ease-in-out infinite;
}
@keyframes xp-pulse {
  0%, 100% { opacity: 1;   transform: scale(1);    }
  50%       { opacity: 0.6; transform: scale(1.25); }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat: add CSS keyframe animations for activity graph"
```

---

## Task 4: Frontend — ActivityGraph component

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add the `ActivityGraph` component**

Add the following complete component to `src/App.jsx`, between the closing `}` of `OverviewTab` and the opening of `DSATab` (i.e. before `function DSATab`):

```jsx
function ActivityGraph() {
  const [days,        setDays]      = useState(7);
  const [data,        setData]      = useState([]);
  const [activePreset,setPreset]    = useState(7);   // 7 | 30 | null (custom)
  const [customVal,   setCustomVal] = useState('');
  const [hovered,     setHovered]   = useState(null);
  const [chartKey,    setChartKey]  = useState(0);
  const wrapRef   = useRef(null);
  const customRef = useRef(null);
  const [wrapW,   setWrapW]         = useState(560);

  // Read container width once on mount
  useEffect(() => {
    if (wrapRef.current) setWrapW(wrapRef.current.clientWidth || 560);
  }, []);

  // Fetch activity data whenever days changes; bump chartKey to re-trigger animations
  useEffect(() => {
    fetch(`/api/activity?days=${days}`)
      .then(r => r.json())
      .then(json => { setData(json.data || []); setChartKey(k => k + 1); })
      .catch(() => {});
  }, [days]);

  // Attach native DOM 'change' listener so spinner arrows apply immediately.
  // React's onChange maps to the DOM 'input' event (fires on every keystroke).
  // The native 'change' event fires on spinner clicks and on blur — both are fine here.
  useEffect(() => {
    const el = customRef.current;
    if (!el) return;
    function handleNativeChange() {
      const n = Math.min(Math.max(parseInt(el.value, 10) || 0, 1), 365);
      if (n) { setPreset(null); setDays(n); }
    }
    el.addEventListener('change', handleNativeChange);
    return () => el.removeEventListener('change', handleNativeChange);
  }, []);

  function pickPreset(n) {
    setPreset(n);
    setCustomVal('');
    setDays(n);
  }

  function submitCustom() {
    const n = Math.min(Math.max(parseInt(customVal, 10) || 0, 1), 365);
    if (n) { setPreset(null); setDays(n); }
  }

  // ── Chart geometry ──────────────────────────────────────────
  const W   = wrapW;
  const H   = 130;
  const pad = { top: 14, right: 8, bottom: 20, left: 30 };
  const iW  = W - pad.left - pad.right;
  const iH  = H - pad.top  - pad.bottom;
  const maxXP = Math.max(...data.map(d => d.xp), 40);
  const step  = data.length > 1 ? iW / (data.length - 1) : iW;

  const pts = data.map((d, i) => ({
    x:       pad.left + i * step,
    y:       pad.top  + iH - (d.xp / maxXP) * iH,
    xp:      d.xp,
    date:    d.date,
    isToday: i === data.length - 1,
    isEmpty: d.xp === 0,
  }));

  // Smooth cubic bezier path through all points
  function smoothPath(ps) {
    if (ps.length < 2) return '';
    let d = `M ${ps[0].x} ${ps[0].y}`;
    for (let i = 1; i < ps.length; i++) {
      const mx = (ps[i - 1].x + ps[i].x) / 2;
      d += ` C ${mx} ${ps[i-1].y}, ${mx} ${ps[i].y}, ${ps[i].x} ${ps[i].y}`;
    }
    return d;
  }

  const linePath = smoothPath(pts);
  const areaPath = linePath
    ? `${linePath} L${pts[pts.length-1].x},${pad.top+iH} L${pts[0].x},${pad.top+iH} Z`
    : '';

  // X-axis label for a given data point
  function xLabel(d, i) {
    if (i === data.length - 1) return 'Today';
    if (days <= 7)  return new Date(d.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' });
    if (days <= 30 && i % 7 === 0) return `W${Math.floor(i / 7) + 1}`;
    if (days >  30 && i % Math.ceil(days / 6) === 0) return `W${Math.floor(i / 7) + 1}`;
    return '';
  }

  // Summary stats
  const total  = data.reduce((s, d) => s + d.xp, 0);
  const active = data.filter(d => d.xp > 0).length;
  const best   = data.length ? Math.max(...data.map(d => d.xp)) : 0;
  const avg    = active ? Math.round(total / active) : 0;

  const showDots = days <= 30;

  // ── Render ──────────────────────────────────────────────────
  return (
    <div style={S.card}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={S.sectionLabel}>XP per day</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[7, 30].map(n => (
            <button key={n} onClick={() => pickPreset(n)} style={{
              fontSize: 10, padding: '3px 10px',
              background: activePreset === n ? 'var(--color-background-secondary)' : 'transparent',
              color:      activePreset === n ? 'var(--color-text-primary)'          : 'var(--color-text-tertiary)',
              border: `0.5px solid ${activePreset === n ? 'var(--color-border-secondary)' : 'var(--color-border-tertiary)'}`,
              borderRadius: 'var(--border-radius-md)',
            }}>{n}d</button>
          ))}
          <div style={{ width: 1, height: 14, background: 'var(--color-border-tertiary)', margin: '0 2px' }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            border: `0.5px solid ${activePreset === null ? 'var(--color-border-secondary)' : 'var(--color-border-tertiary)'}`,
            borderRadius: 'var(--border-radius-md)',
            background: activePreset === null ? 'var(--color-background-secondary)' : 'transparent',
            padding: '2px 6px 2px 8px',
          }}>
            <input
              ref={customRef}
              type="number" min="1" max="365"
              value={customVal}
              placeholder="—"
              onChange={e => { setCustomVal(e.target.value); setPreset(null); }}
              onKeyDown={e => e.key === 'Enter' && submitCustom()}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, width: 28,
                background: 'none', border: 'none', outline: 'none',
                color: 'var(--color-text-primary)', textAlign: 'center',
              }}
            />
            <span style={{ fontSize: 9, color: 'var(--color-text-tertiary)' }}>d</span>
            <button onClick={submitCustom} style={{
              fontSize: 9, padding: '1px 5px', marginLeft: 2,
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              background: 'var(--color-background-secondary)',
              color: 'var(--color-text-secondary)',
            }}>↵</button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div ref={wrapRef} style={{ position: 'relative', height: H, marginBottom: 6 }}>

        {/* Tooltip */}
        {hovered && (
          <div style={{
            position: 'absolute', top: 2, pointerEvents: 'none', zIndex: 10,
            left: Math.min(Math.max(hovered.x - 44, 0), W - 120),
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-secondary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '5px 10px', fontSize: 11,
          }}>
            <div style={{ color: 'var(--color-text-info)', fontWeight: 500 }}>
              {hovered.isEmpty ? '0 XP — rest day' : `+${hovered.xp} XP`}
            </div>
            <div style={{ fontSize: 9, color: 'var(--color-text-tertiary)', marginTop: 1 }}>
              {hovered.isToday
                ? 'Today'
                : new Date(hovered.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })
              }
            </div>
          </div>
        )}

        <svg key={chartKey} width={W} height={H} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="xpAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Y-axis gridlines + labels */}
          {[0, 0.5, 1].map(f => {
            const y = pad.top + iH - f * iH;
            return (
              <g key={f}>
                <line x1={pad.left} y1={y} x2={pad.left + iW} y2={y}
                  stroke="var(--color-border-tertiary)" strokeWidth="0.5" />
                <text x={pad.left - 4} y={y + 3} textAnchor="end"
                  fontSize="8" fill="var(--color-text-tertiary)" fontFamily="var(--font-mono)">
                  {Math.round(f * maxXP)}
                </text>
              </g>
            );
          })}

          {/* Crosshair */}
          {hovered && (
            <line x1={hovered.x} y1={pad.top} x2={hovered.x} y2={pad.top + iH}
              stroke="var(--color-border-secondary)" strokeWidth="1" strokeDasharray="3 3" />
          )}

          {/* Area fill */}
          {areaPath && <path d={areaPath} fill="url(#xpAreaGrad)" className="xp-area" />}

          {/* Line */}
          {linePath && (
            <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="1.8"
              strokeLinejoin="round" strokeLinecap="round" className="xp-line" />
          )}

          {/* Dots */}
          {pts.map((p, i) => p.isToday ? (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="9" fill="none"
                stroke="#f59e0b" strokeOpacity="0.2" className="xp-pulse" />
              <circle cx={p.x} cy={p.y} r="5" fill="#f59e0b" className="xp-pulse" />
            </g>
          ) : showDots ? (
            <circle key={i} cx={p.x} cy={p.y}
              r={p.isEmpty ? '2.5' : '3.5'}
              fill={p.isEmpty ? 'var(--color-background-primary)' : 'var(--color-background-secondary)'}
              stroke={p.isEmpty ? 'var(--color-border-tertiary)' : '#3b82f6'}
              strokeWidth="1.5"
              className="xp-dot"
              style={{ animationDelay: `${0.7 + i * Math.min(0.03, 0.6 / pts.length)}s` }}
            />
          ) : null)}

          {/* Invisible hover zones */}
          {pts.map((p, i) => (
            <rect key={`z${i}`}
              x={p.x - Math.max(step, 20) / 2} y={pad.top}
              width={Math.max(step, 20)} height={iH}
              fill="transparent"
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
      </div>

      {/* X-axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        {data.map((d, i) => (
          <span key={i} style={{
            fontSize: 9, flex: 1, textAlign: 'center',
            color: i === data.length - 1 ? 'var(--color-text-warning)' : 'var(--color-text-tertiary)',
          }}>
            {xLabel(d, i)}
          </span>
        ))}
      </div>

      {/* Summary row */}
      <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '0.5px solid var(--color-border-tertiary)' }}>
        {[
          { val: total,  lbl: 'total XP'         },
          { val: active, lbl: 'active days'       },
          { val: best,   lbl: 'best day'          },
          { val: avg,    lbl: 'avg / active day'  },
        ].map(s => (
          <div key={s.lbl} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>{s.val}</div>
            <div style={{ fontSize: 9, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
```

- [ ] **Step 2: Add `useRef` to the React import**

At the top of `src/App.jsx`, update the import from:

```js
import { useState, useEffect, useCallback } from "react";
```

to:

```js
import { useState, useEffect, useCallback, useRef } from "react";
```

- [ ] **Step 3: Render `ActivityGraph` inside `OverviewTab`**

In the `OverviewTab` function, add `<ActivityGraph />` as the first element inside the returned `<div>`:

```jsx
function OverviewTab({ profile, dsa, sd, java, achSet }) {
  const dsaCleared = DSA_TOPICS.filter(t => (dsa[t]?.e||0)+(dsa[t]?.m||0)+(dsa[t]?.h||0) >= 3).length;
  const sdDone     = Object.values(sd).filter(Boolean).length;
  const javaDone   = Object.values(java).filter(Boolean).length;
  const cats = [
    { label:"DSA Coverage",  val:dsaCleared, total:DSA_TOPICS.length,  color:"info"    },
    { label:"System Design", val:sdDone,      total:SD_TOPICS.length,   color:"success" },
    { label:"Java Depth",    val:javaDone,    total:JAVA_TOPICS.length, color:"warning" },
  ];
  return (
    <div>
      <ActivityGraph />    {/* ← add this line */}
      <div style={S.card}>
        ...
```

- [ ] **Step 4: Verify in browser**

With `npm run dev` running, open the app and go to the Overview tab. Confirm:
- The chart card renders above category progress
- Chart shows 7 days by default, all zeros if no activity yet
- 7d / 30d buttons switch the range and re-animate the line
- Custom input: typing a number + Enter applies; spinner up/down applies immediately
- Log an activity → refresh (or re-navigate to overview) → today's bar has XP

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat: add animated XP activity graph to overview tab"
```

---

## Self-Review Checklist

- `upsertActivity` is imported in `server/index.js` ✓
- `getActivity` is imported and used in `GET /api/activity` ✓
- `originalXp` is captured before any mutations in `/api/log` ✓
- `resetAll()` clears `activity_log` ✓
- `useRef` added to React import ✓
- `ActivityGraph` has no props — fetches its own data ✓
- Spinner apply uses native DOM `change` event via `useEffect` ref attachment ✓
- `chartKey` bumped on each data fetch to re-trigger CSS animations ✓
- Dots hidden for `days > 30` to avoid density issues ✓
- Today dot always visible regardless of `days` ✓
- Summary stats: total, active, best, avg — all derived from current view data ✓
