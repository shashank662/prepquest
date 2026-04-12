# PrepQuest

Gamified DSA / System Design / Java prep tracker.
**Stack:** React + Vite (frontend) · Express + SQLite (backend)
**Storage:** `prepquest.db` — a local SQLite file in the project root.

---

## Prerequisites

- **Node.js** (v18+) — check with `node -v`. Download from https://nodejs.org if needed.
- **Xcode Command Line Tools** — needed to compile `better-sqlite3`.
  Run this if you haven't already:
  ```
  xcode-select --install
  ```

---

## Setup

```bash
# 1. Enter the project folder
cd prepquest

# 2. Install all dependencies
npm install

# 3. Start everything (API server + Vite dev server)
npm run dev
```

- **Mac browser:** http://localhost:5173
- **Phone (same WiFi):** Vite will print a `Network:` URL like `http://192.168.x.x:5173` — open that on your phone.

---

## How it works

```
prepquest/
  server/
    index.js     ← Express API (port 3001) — all game logic lives here
    db.js        ← SQLite queries (better-sqlite3)
  src/
    App.jsx      ← React frontend — fetches /api/* endpoints
    index.css    ← CSS variables (light + dark mode)
    main.jsx     ← React entry point
  prepquest.db   ← created automatically on first run
  vite.config.js ← proxies /api → localhost:3001, exposes on LAN (host: true)
```

**API endpoints:**
- `GET  /api/data`  — fetch all current state
- `POST /api/log`   — log an activity `{ type, topic, difficulty? }`
- `POST /api/reset` — wipe all progress

---

## Data

All progress lives in `prepquest.db` (SQLite). It's a single file — easy to back up:
```bash
cp prepquest.db prepquest.db.backup
```

To inspect your data directly:
```bash
npx sql-cli prepquest.db
# or install: brew install sqlite3
sqlite3 prepquest.db "SELECT * FROM profile;"
```
