# Daily Activity Graph — Design Spec

**Date:** 2026-04-12
**Status:** Approved

---

## Overview

Add an animated XP-per-day line chart to the overview tab so the user can see daily activity ups and downs at a glance. No new dependencies — pure SVG rendered in React.

---

## Data Layer

### New DB table — `activity_log`

```sql
CREATE TABLE IF NOT EXISTS activity_log (
  date  TEXT PRIMARY KEY,  -- "YYYY-MM-DD"
  xp    INTEGER DEFAULT 0
);
```

- One row per calendar day.
- On every `/api/log` call, upsert today's row: `xp = xp + <earned>` (including streak bonus and achievement XP bonuses).
- Inserted in `db.js` alongside the existing `saveProfile` call.

### New DB function — `getActivity(days)`

```js
// Returns last `days` rows, filling in zeros for missing dates
export function getActivity(days) { ... }
```

Returns an array of `{ date, xp }` objects ordered oldest→newest, length = `days`. Missing days are filled with `xp: 0`.

### New API endpoint — `GET /api/activity?days=N`

- `N` is an integer, 1–365. Defaults to 7 if omitted or invalid.
- Returns `{ data: [{ date, xp }, ...] }`.

---

## Frontend Component — `ActivityGraph`

### Placement

Rendered at the top of `<OverviewTab>`, above the existing category progress bars.

### Props

```js
// No props — fetches its own data
function ActivityGraph() { ... }
```

Fetches `/api/activity?days=N` on mount and whenever `days` changes.

### State

| State | Default | Description |
|-------|---------|-------------|
| `days` | `7` | Number of days to display |
| `data` | `[]` | Array of `{ date, xp }` from API |

### Controls

- **7d / 30d preset buttons** — click sets `days` and clears custom input.
- **Custom number input** — `type="number"`, min=1, max=365.
  - Spinner (up/down) arrows: `onchange` → apply immediately.
  - Keyboard: `Enter` → apply. Any other typing does not apply until Enter.
- Active control (preset or custom) is visually highlighted.

### Chart — Pure SVG

- **Size**: full width of card, 130px tall, 30px left padding for Y-axis labels.
- **Line**: smooth bezier cubic path, `stroke: #3b82f6`, `stroke-width: 1.8`.
- **Area fill**: gradient from `rgba(59,130,246,0.3)` at top to `rgba(59,130,246,0.02)` at bottom.
- **Y-axis**: 3 gridlines (0, 50%, 100%) with XP labels. Max Y = highest XP day in view.
- **X-axis labels**: day-of-week labels (7d), week markers (8–30d), sparse markers (>30d). "Today" label always shown in amber.

### Animations

All animations trigger on each render (chart rebuild):

| Element | Animation | Timing |
|---------|-----------|--------|
| Line path | Draw left→right via `stroke-dashoffset` | 0.9s, cubic-bezier(.4,0,.2,1) |
| Area fill | Fade in | 0.6s ease, 0.7s delay |
| Dots | Scale pop-in, staggered per dot | 0.3s spring, 700ms base + 30ms×i |
| Today dot | Continuous amber pulse ring | 2s ease-in-out infinite |

### Hover interaction

- Invisible rect hit zones per day column.
- On hover: dashed vertical crosshair, tooltip above the chart showing `+{xp} XP` and day label.
- Rest days show `0 XP — rest day` in the tooltip.

### Dot visibility

- `days <= 30`: individual dots shown for each day.
- `days > 30`: dots hidden (too dense); only today's amber dot shown.

### Summary row

Below the chart, 4 stats in a row:

| Stat | Formula |
|------|---------|
| Total XP | sum of all XP in view |
| Active days | count of days with xp > 0 |
| Best day | max single-day XP |
| Avg XP / active day | total / active days |

---

## Files Changed

| File | Change |
|------|--------|
| `server/db.js` | Add `activity_log` table, `getActivity(days)`, `upsertActivity(date, xp)` functions. Update `resetAll()` to clear the table. |
| `server/index.js` | Call `upsertActivity` inside `/api/log`. Add `GET /api/activity` endpoint. |
| `src/App.jsx` | Add `ActivityGraph` component. Render it at top of `OverviewTab`. |

---

## Out of Scope

- Multiple metrics on the same chart (fitness, etc.) — deferred.
- Historical data backfill for activity logged before this feature ships — not attempted; graph starts from zero on deploy.
