import express from 'express';
import cors    from 'cors';
import { db, getAll, saveProfile, upsertDSA, upsertSD, upsertJava, resetAll, upsertActivity, getActivity, insertEvent, getEventsForDate, deleteEventsForDate } from './db.js';

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DSA_TOPICS = [
  "Arrays & Hashing", "Two Pointers", "Sliding Window", "Stack",
  "Binary Search", "Linked Lists", "Trees", "Tries",
  "Heap / Priority Queue", "Backtracking", "Graphs",
  "Dynamic Programming", "Greedy", "Intervals", "Bit Manipulation",
];
const SD_TOPICS = [
  "URL Shortener", "Rate Limiter", "Cache System", "Message Queue",
  "Notification System", "Twitter Feed", "Ride Sharing",
  "File Storage (S3)", "Search Autocomplete", "Payment System",
  "Load Balancer", "API Gateway", "Chat System", "Video Streaming",
];
const JAVA_TOPICS = [
  "Collections Framework", "Concurrency & Threads", "JVM Internals",
  "Generics & Streams", "Design Patterns", "Spring Boot Internals",
  "SOLID Principles", "Memory Management",
];

const XP_EARN = { easy: 15, medium: 35, hard: 70, sd: 50, java: 40 };

const ACHIEVEMENTS = [
  // ── Existing ────────────────────────────────────────────────────────────────
  { id: "first_blood", cond: (p)      => (p.easy + p.medium + p.hard + p.sdDone + p.javaDone) >= 1, xpBonus: 0   },
  { id: "easy_5",      cond: (p)      => p.easy >= 5,                                              xpBonus: 15  },
  { id: "dsa_10",      cond: (p)      => (p.easy + p.medium + p.hard) >= 10,                       xpBonus: 50  },
  { id: "easy_10",     cond: (p)      => p.easy >= 10,                                             xpBonus: 50  },
  { id: "medium_10",   cond: (p)      => p.medium >= 10,                                           xpBonus: 75  },
  { id: "hard_5",      cond: (p)      => p.hard >= 5,                                              xpBonus: 100 },
  { id: "streak_3",    cond: (p)      => p.streak >= 3,                                            xpBonus: 30  },
  { id: "sd_3",        cond: (p)      => p.sdDone >= 3,                                            xpBonus: 40  },
  { id: "java_3",      cond: (p)      => p.javaDone >= 3,                                          xpBonus: 30  },
  { id: "dsa_25",      cond: (p)      => (p.easy + p.medium + p.hard) >= 25,                       xpBonus: 125 },
  { id: "streak_7",    cond: (p)      => p.streak >= 7,                                            xpBonus: 100 },
  { id: "medium_25",   cond: (p)      => p.medium >= 25,                                           xpBonus: 150 },
  { id: "hard_10",     cond: (p)      => p.hard >= 10,                                             xpBonus: 200 },
  { id: "xp_1000",     cond: (p)      => p.xp >= 1000,                                            xpBonus: 75  },
  { id: "sd_5",        cond: (p)      => p.sdDone >= 5,                                            xpBonus: 100 },
  { id: "java_half",   cond: (p)      => p.javaDone >= Math.ceil(JAVA_TOPICS.length / 2),          xpBonus: 100 },
  { id: "streak_14",   cond: (p)      => p.streak >= 14,                                           xpBonus: 200 },
  { id: "hard_20",     cond: (p)      => p.hard >= 20,                                             xpBonus: 300 },
  { id: "dsa_50",      cond: (p)      => (p.easy + p.medium + p.hard) >= 50,                       xpBonus: 250 },
  { id: "sd_10",       cond: (p)      => p.sdDone >= 10,                                           xpBonus: 150 },
  { id: "medium_50",   cond: (p)      => p.medium >= 50,                                           xpBonus: 300 },
  { id: "xp_3000",     cond: (p)      => p.xp >= 3000,                                            xpBonus: 200 },
  { id: "streak_21",   cond: (p)      => p.streak >= 21,                                           xpBonus: 300 },
  { id: "java_all",    cond: (p)      => p.javaDone >= JAVA_TOPICS.length,                         xpBonus: 250 },
  { id: "full_stack",  cond: (p)      => p.sdDone >= 5 && p.javaDone >= 5,                        xpBonus: 175 },
  { id: "dsa_half",    cond: (p, dsa) => dsaCleared(dsa) >= Math.ceil(DSA_TOPICS.length / 2),     xpBonus: 200 },
  { id: "hard_30",     cond: (p)      => p.hard >= 30,                                             xpBonus: 500 },
  { id: "dsa_100",     cond: (p)      => (p.easy + p.medium + p.hard) >= 100,                      xpBonus: 600 },
  { id: "sd_all",      cond: (p)      => p.sdDone >= SD_TOPICS.length,                             xpBonus: 400 },
  { id: "streak_30",   cond: (p)      => p.streak >= 30,                                           xpBonus: 500 },
  { id: "dsa_all",     cond: (p, dsa) => dsaCleared(dsa) >= DSA_TOPICS.length,                    xpBonus: 500 },
];

function dsaCleared(dsa) {
  return DSA_TOPICS.filter(t => (dsa[t]?.e || 0) + (dsa[t]?.m || 0) + (dsa[t]?.h || 0) >= 3).length;
}

function localDateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function todayStr() { return localDateStr(); }
function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return localDateStr(d);
}

function applyStreak(profile) {
  const today     = todayStr();
  const yesterday = yesterdayStr();
  if (profile.lastDate === today) return { profile, bonus: 0 };
  const newStreak = profile.lastDate === yesterday ? profile.streak + 1 : 1;
  const bonus     = newStreak > 1 ? Math.min(newStreak * 5, 50) : 0;
  return { profile: { ...profile, streak: newStreak, lastDate: today }, bonus };
}

function checkAchievements(profile, dsa) {
  const prev   = profile.achievements || [];
  const earned = [];
  for (const a of ACHIEVEMENTS) {
    if (!prev.includes(a.id) && a.cond && a.cond(profile, dsa)) {
      profile = { ...profile, xp: profile.xp + a.xpBonus };
      earned.push(a.id);
    }
  }
  return { profile: { ...profile, achievements: [...prev, ...earned] }, earned };
}

// GET /api/data
app.get('/api/data', (_req, res) => {
  try { res.json(getAll()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/activity?days=N
app.get('/api/activity', (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 365);
  try { res.json({ data: getActivity(days) }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/events?date=YYYY-MM-DD
app.get('/api/events', (req, res) => {
  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date))
    return res.status(400).json({ error: 'date query param required (YYYY-MM-DD)' });
  try {
    const events = getEventsForDate(date);
    res.json({ date, events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/log
app.post('/api/log', (req, res) => {
  const { type, topic, difficulty } = req.body;
  if (!type || !topic) return res.status(400).json({ error: 'type and topic required' });

  try {
    let { profile, dsa, sd, java } = getAll();
    const originalXp = profile.xp;
    let msg = '';

    const { profile: p1, bonus } = applyStreak(profile);
    profile = p1;

    if (type === 'dsa') {
      if (!['easy','medium','hard'].includes(difficulty))
        return res.status(400).json({ error: 'invalid difficulty' });
      profile.xp += XP_EARN[difficulty] + bonus;
      profile[difficulty] += 1;
      const prev    = dsa[topic] || { e: 0, m: 0, h: 0 };
      const updated = { ...prev, [difficulty[0]]: (prev[difficulty[0]] || 0) + 1 };
      dsa = { ...dsa, [topic]: updated };
      upsertDSA(topic, updated.e, updated.m, updated.h);
      msg = `+${XP_EARN[difficulty]} XP (${difficulty})`;

    } else if (type === 'sd') {
      if (sd[topic]) return res.status(409).json({ error: 'Already logged this topic' });
      profile.xp += XP_EARN.sd + bonus;
      profile.sdDone += 1;
      sd = { ...sd, [topic]: true };
      upsertSD(topic, true);
      msg = `+${XP_EARN.sd} XP (system design)`;

    } else if (type === 'java') {
      if (java[topic]) return res.status(409).json({ error: 'Already logged this topic' });
      profile.xp += XP_EARN.java + bonus;
      profile.javaDone += 1;
      java = { ...java, [topic]: true };
      upsertJava(topic, true);
      msg = `+${XP_EARN.java} XP (java)`;

    } else {
      return res.status(400).json({ error: 'invalid type' });
    }

    if (bonus > 0) msg += ` + ${bonus} streak bonus!`;

    const { profile: finalProfile, earned } = checkAchievements(profile, dsa);
    saveProfile(finalProfile);
    upsertActivity(todayStr(), profile.xp - originalXp);
    const xpForEvent = type === 'dsa' ? XP_EARN[difficulty] : XP_EARN[type];
    insertEvent(todayStr(), type, topic, difficulty ?? null, xpForEvent);

    res.json({ profile: finalProfile, dsa, sd, java, msg, newAchievements: earned });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reset-day
app.post('/api/reset-day', (req, res) => {
  const { date } = req.body;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date))
    return res.status(400).json({ error: 'date required (YYYY-MM-DD)' });

  try {
    const events = getEventsForDate(date);
    if (events.length === 0)
      return res.status(404).json({ error: 'No events found for that date' });

    const dayLog = db.prepare('SELECT xp FROM activity_log WHERE date = ?').get(date);
    const dayXp  = dayLog ? dayLog.xp : 0;

    const resetTx = db.transaction(() => {
      let { profile, dsa, sd, java } = getAll();

      // 1. Deduct the day's XP (includes streak bonus)
      profile = { ...profile, xp: Math.max(0, profile.xp - dayXp) };

      // 2. Reverse DSA events: decrement topic counts and profile difficulty counters
      for (const ev of events) {
        if (ev.type !== 'dsa') continue;
        const diff = ev.difficulty; // 'easy' | 'medium' | 'hard'
        const key  = diff[0];      // 'e' | 'm' | 'h'
        const prev = dsa[ev.topic] || { e: 0, m: 0, h: 0 };
        dsa = { ...dsa, [ev.topic]: { ...prev, [key]: Math.max(0, (prev[key] || 0) - 1) } };
        profile = { ...profile, [diff]: Math.max(0, (profile[diff] || 0) - 1) };
      }

      // 3. Reverse SD events (unique topics only)
      const sdTopics = [...new Set(events.filter(e => e.type === 'sd').map(e => e.topic))];
      for (const topic of sdTopics) {
        sd = { ...sd, [topic]: false };
        profile = { ...profile, sdDone: Math.max(0, profile.sdDone - 1) };
      }

      // 4. Reverse Java events (unique topics only)
      const javaTopics = [...new Set(events.filter(e => e.type === 'java').map(e => e.topic))];
      for (const topic of javaTopics) {
        java = { ...java, [topic]: false };
        profile = { ...profile, javaDone: Math.max(0, profile.javaDone - 1) };
      }

      // 5. Re-evaluate achievements AFTER topic state is updated
      const updatedAchs = (profile.achievements || []).filter(id => {
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        if (!ach) return false;
        if (ach.cond(profile, dsa)) return true;
        // Achievement no longer met — revoke and subtract its XP bonus
        profile = { ...profile, xp: Math.max(0, profile.xp - ach.xpBonus) };
        return false;
      });
      profile = { ...profile, achievements: updatedAchs };

      // 6. Delete activity_log entry for that date
      db.prepare('DELETE FROM activity_log WHERE date = ?').run(date);

      // 7. Recompute streak from remaining activity_log
      const remaining = db.prepare(
        'SELECT date FROM activity_log WHERE xp > 0 ORDER BY date DESC'
      ).all();
      if (remaining.length === 0) {
        profile = { ...profile, streak: 0, lastDate: null };
      } else {
        profile = { ...profile, lastDate: remaining[0].date };
        let streak = 1;
        for (let i = 1; i < remaining.length; i++) {
          const prev = new Date(remaining[i - 1].date + 'T12:00:00');
          const cur  = new Date(remaining[i].date     + 'T12:00:00');
          const diffDays = Math.round((prev - cur) / 86400000);
          if (diffDays === 1) streak++;
          else break;
        }
        profile = { ...profile, streak };
      }

      // 8. Delete activity_events for that date
      deleteEventsForDate(date);

      // 9. Persist all changes
      saveProfile(profile);
      for (const topic of Object.keys(dsa)) {
        const t = dsa[topic];
        upsertDSA(topic, t.e, t.m, t.h);
      }
      for (const topic of sdTopics)   upsertSD(topic, false);
      for (const topic of javaTopics) upsertJava(topic, false);
    });

    resetTx();
    res.json(getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reset
app.post('/api/reset', (_req, res) => {
  try { resetAll(); res.json(getAll()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => {
  console.log(`PrepQuest API running on http://localhost:${PORT}`);
});
