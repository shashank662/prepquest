import express from 'express';
import cors    from 'cors';
import { getAll, saveProfile, upsertDSA, upsertSD, upsertJava, resetAll, upsertActivity, getActivity } from './db.js';

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
  { id: "first_blood", cond: (p)      => (p.easy + p.medium + p.hard) >= 1,              xpBonus: 0   },
  { id: "streak_3",    cond: (p)      => p.streak >= 3,                                   xpBonus: 30  },
  { id: "streak_7",    cond: (p)      => p.streak >= 7,                                   xpBonus: 100 },
  { id: "streak_30",   cond: (p)      => p.streak >= 30,                                  xpBonus: 500 },
  { id: "easy_10",     cond: (p)      => p.easy >= 10,                                    xpBonus: 50  },
  { id: "medium_25",   cond: (p)      => p.medium >= 25,                                  xpBonus: 150 },
  { id: "medium_50",   cond: (p)      => p.medium >= 50,                                  xpBonus: 300 },
  { id: "hard_5",      cond: (p)      => p.hard >= 5,                                     xpBonus: 100 },
  { id: "hard_20",     cond: (p)      => p.hard >= 20,                                    xpBonus: 300 },
  { id: "sd_5",        cond: (p)      => p.sdDone >= 5,                                   xpBonus: 100 },
  { id: "sd_all",      cond: (p)      => p.sdDone >= SD_TOPICS.length,                    xpBonus: 400 },
  { id: "java_all",    cond: (p)      => p.javaDone >= JAVA_TOPICS.length,                xpBonus: 250 },
  { id: "dsa_half",    cond: (p, dsa) => dsaCleared(dsa) >= Math.ceil(DSA_TOPICS.length / 2), xpBonus: 200 },
  { id: "dsa_all",     cond: (p, dsa) => dsaCleared(dsa) >= DSA_TOPICS.length,           xpBonus: 500 },
];

function dsaCleared(dsa) {
  return DSA_TOPICS.filter(t => (dsa[t]?.e || 0) + (dsa[t]?.m || 0) + (dsa[t]?.h || 0) >= 3).length;
}

function todayStr() { return new Date().toISOString().slice(0, 10); }
function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
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
    upsertActivity(todayStr(), finalProfile.xp - originalXp);

    res.json({ profile: finalProfile, dsa, sd, java, msg, newAchievements: earned });
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
