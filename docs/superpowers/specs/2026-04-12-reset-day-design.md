# Reset Day — Design Spec

**Date:** 2026-04-12
**Status:** Approved

---

## Overview

Allow the user to fully undo all activity logged on a specific day — reversing XP, topic progress, and achievements — triggered by clicking a dot on the activity graph.

---

## Data Layer

### New table — `activity_events`

```sql
CREATE TABLE IF NOT EXISTS activity_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT NOT NULL,     -- "YYYY-MM-DD" local date
  type       TEXT NOT NULL,     -- "dsa" | "sd" | "java"
  topic      TEXT NOT NULL,
  difficulty TEXT,              -- "easy"|"medium"|"hard" for DSA, NULL for SD/Java
  xp_earned  INTEGER NOT NULL   -- base XP only (XP_EARN[type]), no streak/achievement bonuses
);
```

One row per individual log call. Multiple rows per date are valid (DSA can be logged many times). At most one row per SD/Java topic per lifetime (enforced by the existing 409 check in `/api/log`).

`xp_earned` stores base XP for **display only**. The authoritative daily XP total (including streak bonus) lives in `activity_log.xp` and is used for the XP deduction during reset.

`resetAll()` updated to `DELETE FROM activity_events`.

### New DB functions

| Function | Description |
|----------|-------------|
| `insertEvent(date, type, topic, difficulty, xp)` | Insert one activity event row |
| `getEventsForDate(date)` | Return all events for a date, ordered by id ASC |
| `deleteEventsForDate(date)` | Delete all events for a date |

---

## API Changes

### Modify `POST /api/log`

After `saveProfile(finalProfile)`, insert into `activity_events`:

```js
insertEvent(todayStr(), type, topic, difficulty ?? null, XP_EARN[type]);
```

Note: `XP_EARN[type]` is the base XP (`easy=15`, `medium=35`, `hard=70`, `sd=50`, `java=40`). Streak bonus and achievement bonuses are excluded.

### New `GET /api/events?date=YYYY-MM-DD`

Returns events for a date (used by the UI to populate the reset panel before the user confirms).

- Returns `{ date, events: [{ id, type, topic, difficulty, xp_earned }, ...] }`
- Returns `{ date, events: [] }` if no events for that date (not a 404)

### New `POST /api/reset-day`

Body: `{ date: "YYYY-MM-DD" }`

**Validation:**
- 400 if `date` missing or not a valid `YYYY-MM-DD` string
- 404 if `activity_events` has no rows for that date

**Reset logic (all inside a single SQLite transaction):**

1. Fetch all events for that date from `activity_events`
2. Fetch `activity_log.xp` for that date → this is the XP to deduct
3. Load current state via `getAll()`
4. Subtract `activity_log.xp` from `profile.xp`; clamp to `Math.max(0, xp)`
5. For each DSA event: decrement `dsa_topics[topic][difficulty[0]]` by 1; decrement `profile[difficulty]` (easy/medium/hard) by 1
6. For each unique SD topic in events: set `sd_topics[topic] = false`; decrement `profile.sdDone`
7. For each unique Java topic in events: set `java_topics[topic] = false`; decrement `profile.javaDone`
8. Re-evaluate achievements **after** topic state is updated:
   - For each id in `profile.achievements`: run its `cond(profile, dsa)` against the updated state
   - If condition no longer met: remove from `profile.achievements`; subtract `achievement.xpBonus` from `profile.xp`; clamp to 0 again
9. Delete `activity_log` entry for that date
10. Recompute streak from remaining `activity_log`:
    - Fetch all dates with `xp > 0` ordered DESC
    - If empty: `profile.streak = 0`, `profile.lastDate = null`
    - Else: `profile.lastDate = dates[0]`; count consecutive days backwards from `dates[0]` → `profile.streak`
11. Delete `activity_events` rows for that date
12. Persist: `saveProfile`, `upsertDSA` for all touched topics, `upsertSD` for all touched topics, `upsertJava` for all touched topics

**Returns:** Full app state `{ profile, dsa, sd, java }` — same shape as `GET /api/data`.

---

## Frontend — `ActivityGraph` changes

### New state

| State | Type | Description |
|-------|------|-------------|
| `selectedDate` | `string \| null` | Date string of clicked dot, null = panel closed |
| `dayEvents` | `array \| null` | Events for selected date; null = loading |
| `resetConfirm` | `boolean` | Whether "confirm reset" step is active |
| `resetting` | `boolean` | Whether reset API call is in progress |

### Interaction

**Hover** — unchanged: lightweight tooltip.

**Click** — `onClick` added to existing invisible hover zone `<rect>` elements. Clicking a dot sets `selectedDate` and triggers a fetch to `GET /api/events?date=...`. Clicking the same dot again, or pressing Escape, closes the panel.

### Detail panel

Rendered below the chart (above the summary row) when `selectedDate` is set. Contents:

- Date header: full date string (e.g. "Wednesday, Apr 9")
- Activity list: one row per event — `{topic} · {difficulty} · +{xp_earned} XP`
- Streak bonus row (only if `activity_log.xp − sum(xp_earned) > 0`): `Streak bonus · +{N} XP`
- Total: `activity_log.xp` for that date (sourced from the already-fetched `data` array)
- "Reset this day" button (danger color)

### Two-step confirmation (inline, no modal)

1. Click "Reset this day" → `resetConfirm = true` → button row becomes: **"Confirm reset ↩"** + **"Cancel"**
2. Click "Confirm reset" → `resetting = true` → `POST /api/reset-day` → on success: call `loadData()` (passed as prop from `App`) to refresh full app state; re-fetch activity chart data; close panel
3. Click "Cancel" → `resetConfirm = false`

### `ActivityGraph` prop change

`loadData` must be passed down from `App` so the component can trigger a full state refresh after a reset:

```jsx
// In App's render:
<ActivityGraph loadData={loadData} />

// In ActivityGraph signature:
function ActivityGraph({ loadData }) { ... }
```

---

## Files Changed

| File | Change |
|------|--------|
| `server/db.js` | Add `activity_events` DDL; add `insertEvent`, `getEventsForDate`, `deleteEventsForDate`; update `resetAll` |
| `server/index.js` | Call `insertEvent` in `POST /api/log`; add `GET /api/events`; add `POST /api/reset-day` |
| `src/App.jsx` | Add `selectedDate`, `dayEvents`, `resetConfirm`, `resetting` state to `ActivityGraph`; add click handler on hover zones; add detail panel; add `loadData` prop; pass `loadData` from `App` |

---

## Edge Cases

| Case | Handling |
|------|---------|
| Reset today (same as `lastDate`) | Streak recompute finds no entry for today → `lastDate` becomes yesterday (or earlier); streak recalculated correctly |
| Reset a day in the middle of a streak | Gap created → streak count drops to consecutive days from most recent date |
| Reset a day with only a streak bonus (xp_earned=0 events somehow) | Guarded by 404 when `activity_events` is empty for that date |
| `profile.xp` going negative | Clamped to 0 at steps 4 and 8 |
| SD/Java topic logged, reset, then logged again later | Reset correctly unmarks; subsequent log on different date re-marks as expected |
| Achievement with `xpBonus: 0` (e.g. `first_blood`) revoked | Removed from achievements list, 0 XP subtracted — correct |

---

## Out of Scope

- Resetting individual events within a day (only whole-day reset)
- Undo history / redo after reset
