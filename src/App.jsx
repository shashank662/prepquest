import { useState, useEffect, useCallback, useRef, useId } from "react";

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

const LEVELS = [
  { xp: 0,    title: "Bootcamp Grad",    icon: "🧑‍💻" },
  { xp: 150,  title: "Junior Dev",       icon: "🗡️"  },
  { xp: 400,  title: "Problem Solver",   icon: "🗡️"  },
  { xp: 800,  title: "Consistent Coder", icon: "🛡️"  },
  { xp: 1400, title: "Algorithm Adept",  icon: "🛡️"  },
  { xp: 2200, title: "Systems Thinker",  icon: "⚔️"  },
  { xp: 3300, title: "Senior Aspirant",  icon: "⚔️"  },
  { xp: 4700, title: "Elite Engineer",   icon: "🧙"  },
  { xp: 6500, title: "Offer-Ready",      icon: "🧙"  },
  { xp: 9000, title: "FAANG Caliber",    icon: "👑"  },
];

const ACHIEVEMENTS = [
  // reward = real-world prize earned when this unlocks
  { id: "first_blood", icon: "⚔️",  title: "First Blood",          desc: "Log your first activity",                  reward: null                        },
  { id: "easy_5",      icon: "🌱",  title: "Just Warming Up",      desc: "Solve 5 easy problems",                    reward: "1 episode"                 },
  { id: "dsa_10",      icon: "🎯",  title: "Double Digits",        desc: "10 DSA problems total",                    reward: "1 hr PS5"                  },
  { id: "easy_10",     icon: "✅",  title: "Warm-Up Done",         desc: "Solve 10 easy problems",                   reward: "1 episode"                 },
  { id: "medium_10",   icon: "⚡",  title: "Finding My Stride",    desc: "Solve 10 medium problems",                 reward: "1 episode"                 },
  { id: "hard_5",      icon: "💀",  title: "Pain Embracer",        desc: "Solve 5 hard problems",                    reward: "2 episodes"                },
  { id: "streak_3",    icon: "🔥",  title: "On Fire",              desc: "3-day streak",                             reward: "1 episode"                 },
  { id: "sd_3",        icon: "🏗️", title: "Architect Cadet",      desc: "Design 3 systems",                         reward: "1 episode"                 },
  { id: "java_3",      icon: "☕",  title: "Coffee Initiated",     desc: "Study 3 Java topics",                      reward: "1 episode"                 },
  { id: "dsa_25",      icon: "🎯",  title: "Quarter Century",      desc: "25 DSA problems total",                    reward: "2 episodes"                },
  { id: "streak_7",    icon: "🔥",  title: "Week Warrior",         desc: "7-day streak",                             reward: "1 hr PS5"                  },
  { id: "medium_25",   icon: "⚡",  title: "Getting Real",         desc: "Solve 25 medium problems",                 reward: "2 hrs PS5"                 },
  { id: "hard_10",     icon: "💀",  title: "Pain Connoisseur",     desc: "Solve 10 hard problems",                   reward: "2 hrs PS5"                 },
  { id: "xp_1000",     icon: "✨",  title: "Four Figures",         desc: "Earn 1000 XP",                             reward: "1 hr PS5"                  },
  { id: "sd_5",        icon: "🏗️", title: "Architect Initiate",   desc: "Design 5 systems",                         reward: "1 hr PS5"                  },
  { id: "java_half",   icon: "☕",  title: "JVM Intern",           desc: "Study 4 Java topics",                      reward: "1 hr PS5"                  },
  { id: "streak_14",   icon: "🔥",  title: "Two-Week Terror",      desc: "14-day streak",                            reward: "2 episodes"                },
  { id: "hard_20",     icon: "💀",  title: "Masochist",            desc: "Solve 20 hard problems",                   reward: "2 hrs PS5"                 },
  { id: "dsa_50",      icon: "🎯",  title: "Half Century",         desc: "50 DSA problems total",                    reward: "2 hrs PS5"                 },
  { id: "sd_10",       icon: "🏗️", title: "Senior Architect",     desc: "Design 10 systems",                        reward: "1 hr PS5"                  },
  { id: "medium_50",   icon: "⚡",  title: "Battle-Tested",        desc: "Solve 50 medium problems",                 reward: "3 hrs PS5"                 },
  { id: "xp_3000",     icon: "💫",  title: "XP Hoarder",           desc: "Earn 3000 XP",                             reward: "2 hrs PS5"                 },
  { id: "streak_21",   icon: "💎",  title: "Three-Week Flame",     desc: "21-day streak",                            reward: "movie night (2 hrs)"       },
  { id: "java_all",    icon: "☕",  title: "JVM Whisperer",        desc: "Study all Java topics",                    reward: "2 hrs PS5"                 },
  { id: "full_stack",  icon: "🧩",  title: "Full-Stack Prep",      desc: "5 SD + 5 Java topics done",               reward: "2 episodes"                },
  { id: "dsa_half",    icon: "📐",  title: "Halfway There",        desc: "Clear 50% of DSA topics (3+ each)",       reward: "2 hrs PS5"                 },
  { id: "hard_30",     icon: "💀",  title: "Absolute Masochist",   desc: "Solve 30 hard problems",                   reward: "3 hrs PS5"                 },
  { id: "dsa_100",     icon: "💯",  title: "Centurion",            desc: "100 DSA problems total",                   reward: "evening session (3 hrs PS5)" },
  { id: "sd_all",      icon: "🏛️", title: "System Architect",     desc: "Complete all SD topics",                   reward: "3 hrs PS5"                 },
  { id: "streak_30",   icon: "💎",  title: "Diamond Grind",        desc: "30-day streak",                            reward: "free gaming Saturday"      },
  { id: "dsa_all",     icon: "🏆",  title: "DSA Master",           desc: "Clear all DSA topics (3+ each)",           reward: "guilt-free gaming day"     },
];

const XP_EARN = { easy: 15, medium: 35, hard: 70, sd: 50, java: 40 };

function getLvl(xp) {
  let l = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) l = i;
  return l;
}
function getXPBar(xp) {
  const l   = getLvl(xp);
  const cur = LEVELS[l].xp;
  const nxt = LEVELS[l + 1]?.xp ?? (cur + 3000);
  return { pct: Math.round(((xp - cur) / (nxt - cur)) * 100), toNext: nxt - xp };
}

const S = {
  card: {
    background: "var(--color-background-primary)",
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: "var(--border-radius-lg)",
    padding: "1rem 1.25rem",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: 500,
    color: "var(--color-text-tertiary)",
    textTransform: "uppercase", letterSpacing: "0.1em",
    marginBottom: 12,
  },
};

export default function App() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);
  const [tab,     setTab]     = useState("overview");
  const [modal,   setModal]   = useState(false);
  const [lType,   setLType]   = useState("dsa");
  const [lTopic,  setLTopic]  = useState(DSA_TOPICS[0]);
  const [lDiff,   setLDiff]   = useState("medium");
  const [toast,   setToast]   = useState(null);
  const [newAch,  setNewAch]  = useState([]);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error();
      setData(await res.json());
      setError(null);
    } catch {
      setError('Cannot reach server — run: npm run dev');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function logActivity() {
    setSaving(true);
    try {
      const res  = await fetch('/api/log', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ type: lType, topic: lTopic, difficulty: lDiff }),
      });
      const json = await res.json();
      if (!res.ok) { showToast(json.error || 'Error'); setModal(false); return; }
      setData({ profile: json.profile, dsa: json.dsa, sd: json.sd, java: json.java });
      setModal(false);
      showToast(json.msg);
      if (json.newAchievements?.length) {
        setNewAch(json.newAchievements);
        setTimeout(() => setNewAch([]), 5000);
      }
    } catch {
      showToast('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function resetData() {
    if (!window.confirm('Reset ALL progress? This cannot be undone.')) return;
    const res = await fetch('/api/reset', { method: 'POST' });
    setData(await res.json());
    showToast('Progress reset.');
  }

  if (loading) return <Centered>Loading...</Centered>;
  if (error)   return <Centered style={{ color: "var(--color-text-danger)" }}>{error}</Centered>;
  if (!data)   return null;

  const { profile, dsa, sd, java } = data;
  const lvlIdx = getLvl(profile.xp);
  const lvl    = LEVELS[lvlIdx];
  const bar    = getXPBar(profile.xp);
  const total  = profile.easy + profile.medium + profile.hard;
  const sdCnt  = Object.values(sd).filter(Boolean).length;
  const jvCnt  = Object.values(java).filter(n => n > 0).length;
  const achSet = new Set(profile.achievements || []);
  const TABS   = ["overview", "dsa", "system design", "java", "achievements"];

  return (
    <div style={{ width: "100%", maxWidth: 680, fontFamily: "var(--font-mono)", fontSize: 13 }}>

      {toast && (
        <div style={{ background: "var(--color-background-success)", color: "var(--color-text-success)", padding: "8px 14px", borderRadius: "var(--border-radius-md)", fontSize: 12, marginBottom: 10, display: "inline-block" }}>
          {toast}
        </div>
      )}

      {newAch.length > 0 && (
        <div style={{ background: "var(--color-background-warning)", border: "0.5px solid var(--color-border-warning)", borderRadius: "var(--border-radius-md)", padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>🏆</span>
          <span style={{ color: "var(--color-text-warning)", fontSize: 12, fontWeight: 500 }}>
            Achievement unlocked: {newAch.map(id => ACHIEVEMENTS.find(a => a.id === id)?.title).join(", ")}
          </span>
          <button onClick={() => setNewAch([])} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-warning)", fontSize: 14 }}>✕</button>
        </div>
      )}

      {/* Character Card */}
      <div style={S.card}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
            {lvl.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>Shashank</span>
              <span style={{ fontSize: 10, background: "var(--color-background-info)", color: "var(--color-text-info)", padding: "2px 7px", borderRadius: "var(--border-radius-md)" }}>LVL {lvlIdx + 1}</span>
              <span style={{ fontSize: 10, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", padding: "2px 7px", borderRadius: "var(--border-radius-md)" }}>{lvl.title}</span>
              {profile.streak >= 3 && (
                <span style={{ fontSize: 10, background: "var(--color-background-danger)", color: "var(--color-text-danger)", padding: "2px 7px", borderRadius: "var(--border-radius-md)" }}>
                  🔥 {profile.streak}d streak
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 10 }}>
              Backend Engineer · Targeting 18–25 LPA · {achSet.size}/{ACHIEVEMENTS.length} achievements
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 5, background: "var(--color-background-secondary)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${bar.pct}%`, background: "var(--color-text-warning)", borderRadius: 3, transition: "width 0.6s ease" }} />
              </div>
              <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>
                {profile.xp} XP · {bar.toNext} to next
              </span>
            </div>
          </div>
          <button onClick={() => setModal(true)} style={{ fontSize: 12, padding: "8px 12px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            + Log ↗
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, marginBottom: 12 }}>
        {[
          { label: "streak",     val: `${profile.streak}d`, sub: "days active" },
          { label: "DSA solved", val: total, sub: `${profile.easy}E ${profile.medium}M ${profile.hard}H` },
          { label: "sys design", val: `${sdCnt}/${SD_TOPICS.length}`,   sub: "topics" },
          { label: "java depth", val: `${jvCnt}/${JAVA_TOPICS.length}`, sub: "topics" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1.1 }}>{s.val}</div>
            <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 14, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "7px 10px", fontSize: 11, background: "none", cursor: "pointer",
            borderBottom: tab === t ? "2px solid var(--color-text-primary)" : "2px solid transparent",
            borderTop: "none", borderLeft: "none", borderRight: "none", borderRadius: 0,
            color: tab === t ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            fontWeight: tab === t ? 500 : 400,
          }}>{t}</button>
        ))}
      </div>

      {tab === "overview"      && <OverviewTab profile={profile} dsa={dsa} sd={sd} java={java} achSet={achSet} loadData={loadData} />}
      {tab === "dsa"           && <DSATab dsa={dsa} />}
      {tab === "system design" && <SDTab sd={sd} />}
      {tab === "java"          && <JavaTab java={java} />}
      {tab === "achievements"  && <AchievementsTab achSet={achSet} />}

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button onClick={resetData} style={{ fontSize: 10, padding: "5px 12px", color: "var(--color-text-tertiary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: "none", cursor: "pointer" }}>
          Reset all progress
        </button>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", width: 340, maxWidth: "90vw" }}>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 14, color: "var(--color-text-primary)" }}>Log Activity</div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 6 }}>Category</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["dsa","DSA"],["sd","Sys Design"],["java","Java"]].map(([v, label]) => (
                  <button key={v} onClick={() => { setLType(v); setLTopic(v==="dsa"?DSA_TOPICS[0]:v==="sd"?SD_TOPICS[0]:JAVA_TOPICS[0]); }} style={{
                    flex: 1, padding: "7px 4px", fontSize: 10, cursor: "pointer",
                    background: lType===v ? "var(--color-background-info)" : "var(--color-background-secondary)",
                    color:      lType===v ? "var(--color-text-info)"       : "var(--color-text-secondary)",
                    border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)",
                  }}>{label}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 6 }}>Topic</div>
              <select value={lTopic} onChange={e => setLTopic(e.target.value)}>
                {(lType==="dsa"?DSA_TOPICS:lType==="sd"?SD_TOPICS:JAVA_TOPICS).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {lType === "dsa" && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 6 }}>Difficulty</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[["easy","+15 XP","success"],["medium","+35 XP","warning"],["hard","+70 XP","danger"]].map(([d,x,c]) => (
                    <button key={d} onClick={() => setLDiff(d)} style={{
                      flex: 1, padding: "8px 4px", fontSize: 10, cursor: "pointer", lineHeight: 1.5,
                      background: lDiff===d ? `var(--color-background-${c})` : "var(--color-background-secondary)",
                      color:      lDiff===d ? `var(--color-text-${c})`       : "var(--color-text-secondary)",
                      border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)",
                    }}>{d}<br/><span style={{fontSize:9}}>{x}</span></button>
                  ))}
                </div>
              </div>
            )}

            {lType !== "dsa" && (
              <div style={{ marginBottom: 14, fontSize: 11, color: "var(--color-text-secondary)" }}>
                Earns +{lType==="sd"?XP_EARN.sd:XP_EARN.java} XP{lType==="sd"?" · one-time per topic":" · per study session"}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setModal(false)} style={{ fontSize: 12, padding: "8px 12px", cursor: "pointer" }}>Cancel</button>
              <button onClick={logActivity} disabled={saving} style={{
                fontSize: 12, padding: "8px 14px", cursor: saving?"not-allowed":"pointer", fontWeight: 500,
                background: "var(--color-background-info)", color: "var(--color-text-info)",
                border: "0.5px solid var(--color-border-info)", borderRadius: "var(--border-radius-md)",
                opacity: saving ? 0.6 : 1,
              }}>{saving ? "Saving..." : "Earn XP →"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Centered({ children, style }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh", color:"var(--color-text-secondary)", fontFamily:"var(--font-mono)", fontSize:13, ...style }}>
      {children}
    </div>
  );
}

function OverviewTab({ profile, dsa, sd, java, achSet, loadData }) {
  const dsaCleared = DSA_TOPICS.filter(t => (dsa[t]?.e||0)+(dsa[t]?.m||0)+(dsa[t]?.h||0) >= 3).length;
  const sdDone     = Object.values(sd).filter(Boolean).length;
  const javaDone   = Object.values(java).filter(n => n > 0).length;
  const cats = [
    { label:"DSA Coverage",  val:dsaCleared, total:DSA_TOPICS.length,  color:"info"    },
    { label:"System Design", val:sdDone,      total:SD_TOPICS.length,   color:"success" },
    { label:"Java Depth",    val:javaDone,    total:JAVA_TOPICS.length, color:"warning" },
  ];
  return (
    <div>
      <ActivityGraph loadData={loadData} />
      <div style={S.card}>
        <div style={S.sectionLabel}>Category Progress</div>
        {cats.map(c => (
          <div key={c.label} style={{ marginBottom: 14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
              <span style={{ color:"var(--color-text-primary)" }}>{c.label}</span>
              <span style={{ color:"var(--color-text-secondary)" }}>{c.val}/{c.total}</span>
            </div>
            <div style={{ height:6, background:"var(--color-background-secondary)", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:3, width:`${Math.round((c.val/c.total)*100)}%`, background:`var(--color-text-${c.color})`, transition:"width 0.5s ease" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={S.sectionLabel}>Achievements ({achSet.size}/{ACHIEVEMENTS.length})</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:8 }}>
          {ACHIEVEMENTS.map(a => {
            const done = achSet.has(a.id);
            return (
              <div key={a.id} style={{ padding:"10px", borderRadius:"var(--border-radius-md)", background:done?"var(--color-background-secondary)":"transparent", border:`0.5px solid ${done?"var(--color-border-secondary)":"var(--color-border-tertiary)"}`, opacity:done?1:0.4 }}>
                <div style={{ fontSize:15, marginBottom:4 }}>{a.icon}</div>
                <div style={{ fontSize:11, fontWeight:500, color:"var(--color-text-primary)", marginBottom:2 }}>{a.title}</div>
                <div style={{ fontSize:10, color:"var(--color-text-tertiary)" }}>{a.desc}</div>
                {a.reward && <div style={{ fontSize:9, marginTop:4, color: done ? "var(--color-text-success)" : "var(--color-text-warning)" }}>🎁 {a.reward}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ActivityGraph({ loadData }) {
  const [days,        setDays]      = useState(7);
  const [data,        setData]      = useState([]);
  const [activePreset,setPreset]    = useState(7);   // 7 | 30 | null (custom)
  const [customVal,   setCustomVal] = useState('');
  const [hovered,     setHovered]   = useState(null);
  const [chartKey,    setChartKey]  = useState(0);
  const wrapRef   = useRef(null);
  const customRef = useRef(null);
  const [wrapW,   setWrapW]         = useState(560);
  const gradId    = useId();
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents,    setDayEvents]    = useState(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting,    setResetting]    = useState(false);
  const abortRef = useRef(null);

  // Track container width with ResizeObserver so chart redraws on resize
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWrapW(entry.contentRect.width || 560);
    });
    ro.observe(el);
    return () => ro.disconnect();
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
      setPreset(null); setDays(n);
    }
    el.addEventListener('change', handleNativeChange);
    return () => el.removeEventListener('change', handleNativeChange);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setSelectedDate(null);
        setDayEvents(null);
        setResetConfirm(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function pickPreset(n) {
    setPreset(n);
    setCustomVal('');
    setDays(n);
  }

  function submitCustom() {
    const n = Math.min(Math.max(parseInt(customVal, 10) || 0, 1), 365);
    setPreset(null); setDays(n);
  }

  function selectDate(p) {
    if (selectedDate === p.date) {
      setSelectedDate(null);
      setDayEvents(null);
      setResetConfirm(false);
      setResetting(false);
      return;
    }
    setSelectedDate(p.date);
    setDayEvents(null);
    setResetConfirm(false);
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    fetch(`/api/events?date=${p.date}`, { signal: abortRef.current.signal })
      .then(r => r.json())
      .then(json => setDayEvents(json.events || []))
      .catch(err => { if (err.name !== 'AbortError') setDayEvents([]); });
  }

  async function confirmReset() {
    setResetting(true);
    try {
      const res = await fetch('/api/reset-day', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ date: selectedDate }),
      });
      if (res.ok) {
        setSelectedDate(null);
        setDayEvents(null);
        setResetConfirm(false);
        await loadData();
        const actRes  = await fetch(`/api/activity?days=${days}`);
        const actJson = await actRes.json();
        setData(actJson.data || []);
        setChartKey(k => k + 1);
      } else {
        setResetConfirm(false);
      }
    } catch {
      // silently swallow — panel stays open
    } finally {
      setResetting(false);
    }
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
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
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
          {areaPath && <path d={areaPath} fill={`url(#${gradId})`} className="xp-area" />}

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
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => selectDate(p)}
            />
          ))}
        </svg>
      </div>

      {/* Detail panel */}
      {selectedDate && (
        <div style={{
          margin: '10px 0',
          padding: '12px 14px',
          background: 'var(--color-background-secondary)',
          border: '0.5px solid var(--color-border-secondary)',
          borderRadius: 'var(--border-radius-md)',
          fontSize: 11,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            <button
              onClick={() => { setSelectedDate(null); setDayEvents(null); setResetConfirm(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', fontSize: 13, lineHeight: 1 }}
            >✕</button>
          </div>

          {dayEvents === null ? (
            <div style={{ color: 'var(--color-text-tertiary)' }}>Loading…</div>
          ) : dayEvents.length === 0 ? (
            <div style={{ color: 'var(--color-text-tertiary)' }}>No individual events recorded for this day.</div>
          ) : (() => {
            const dayData     = data.find(d => d.date === selectedDate);
            const dayXp       = dayData ? dayData.xp : 0;
            const baseXp      = dayEvents.reduce((s, e) => s + e.xp_earned, 0);
            const streakBonus = Math.max(0, dayXp - baseXp);
            return (
              <div>
                {dayEvents.map(ev => (
                  <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: 'var(--color-text-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                    <span>
                      {ev.topic}
                      {ev.difficulty ? ` · ${ev.difficulty}` : ''}
                      {ev.type !== 'dsa' ? ` · ${ev.type}` : ''}
                    </span>
                    <span style={{ color: 'var(--color-text-info)', fontFamily: 'var(--font-mono)' }}>+{ev.xp_earned} XP</span>
                  </div>
                ))}
                {streakBonus > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: 'var(--color-text-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                    <span>Streak bonus</span>
                    <span style={{ color: 'var(--color-text-info)', fontFamily: 'var(--font-mono)' }}>+{streakBonus} XP</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 4px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  <span>Total</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{dayXp} XP</span>
                </div>
                {!resetConfirm ? (
                  <button
                    onClick={() => setResetConfirm(true)}
                    style={{
                      marginTop: 8, width: '100%', padding: '7px', fontSize: 11, cursor: 'pointer',
                      background: 'var(--color-background-danger)', color: 'var(--color-text-danger)',
                      border: '0.5px solid var(--color-border-danger)', borderRadius: 'var(--border-radius-md)',
                    }}
                  >Reset this day</button>
                ) : (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      onClick={confirmReset}
                      disabled={resetting}
                      style={{
                        flex: 1, padding: '7px', fontSize: 11, cursor: resetting ? 'not-allowed' : 'pointer',
                        background: 'var(--color-background-danger)', color: 'var(--color-text-danger)',
                        border: '0.5px solid var(--color-border-danger)', borderRadius: 'var(--border-radius-md)',
                        opacity: resetting ? 0.6 : 1,
                      }}
                    >{resetting ? 'Resetting…' : 'Confirm reset ↩'}</button>
                    <button
                      onClick={() => setResetConfirm(false)}
                      disabled={resetting}
                      style={{
                        padding: '7px 14px', fontSize: 11, cursor: 'pointer',
                        background: 'none', color: 'var(--color-text-secondary)',
                        border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)',
                      }}
                    >Cancel</button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

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

function DSATab({ dsa }) {
  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>DSA Topic Breakdown</div>
      <div style={{ display:"grid", gap:8 }}>
        {DSA_TOPICS.map(t => {
          const data  = dsa[t] || { e:0, m:0, h:0 };
          const total = (data.e||0)+(data.m||0)+(data.h||0);
          return (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:150, fontSize:11, color:"var(--color-text-primary)", flexShrink:0 }}>{t}</div>
              <div style={{ display:"flex", gap:5, flex:1 }}>
                {[["e","success","E"],["m","warning","M"],["h","danger","H"]].map(([k,c,label]) => (
                  <div key={k} style={{ padding:"3px 8px", borderRadius:"var(--border-radius-md)", fontSize:10, background:(data[k]||0)>0?`var(--color-background-${c})`:"var(--color-background-secondary)", color:(data[k]||0)>0?`var(--color-text-${c})`:"var(--color-text-tertiary)", minWidth:28, textAlign:"center" }}>
                    {label}{(data[k]||0)>0?`×${data[k]}`:""}
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10, color:"var(--color-text-tertiary)", minWidth:28, textAlign:"right" }}>
                {total>0?`×${total}`:"—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SDTab({ sd }) {
  const done = Object.values(sd).filter(Boolean).length;
  return (
    <div style={S.card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={S.sectionLabel}>System Design Topics</div>
        <div style={{ fontSize:11, color:"var(--color-text-secondary)" }}>{done}/{SD_TOPICS.length}</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, minmax(0, 1fr))", gap:6 }}>
        {SD_TOPICS.map(t => (
          <div key={t} style={{ padding:"10px 12px", borderRadius:"var(--border-radius-md)", background:sd[t]?"var(--color-background-success)":"var(--color-background-secondary)", border:`0.5px solid ${sd[t]?"var(--color-border-success)":"var(--color-border-tertiary)"}`, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:11, color:sd[t]?"var(--color-text-success)":"var(--color-text-tertiary)" }}>{sd[t]?"✓":"○"}</span>
            <span style={{ fontSize:11, color:sd[t]?"var(--color-text-success)":"var(--color-text-primary)" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JavaTab({ java }) {
  const done = Object.values(java).filter(n => n > 0).length;
  return (
    <div style={S.card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={S.sectionLabel}>Java Depth Topics</div>
        <div style={{ fontSize:11, color:"var(--color-text-secondary)" }}>{done}/{JAVA_TOPICS.length}</div>
      </div>
      <div style={{ display:"grid", gap:6 }}>
        {JAVA_TOPICS.map(t => {
          const count = java[t] || 0;
          return (
            <div key={t} style={{ padding:"12px 14px", borderRadius:"var(--border-radius-md)", background:count>0?"var(--color-background-warning)":"var(--color-background-secondary)", border:`0.5px solid ${count>0?"var(--color-border-warning)":"var(--color-border-tertiary)"}`, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, color:count>0?"var(--color-text-warning)":"var(--color-text-tertiary)" }}>{count>0?"✓":"○"}</span>
              <span style={{ fontSize:12, color:count>0?"var(--color-text-warning)":"var(--color-text-primary)", flex:1 }}>{t}</span>
              {count > 0 && <span style={{ fontSize:10, color:"var(--color-text-warning)", fontFamily:"var(--font-mono)" }}>×{count}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AchievementsTab({ achSet }) {
  const unlocked = ACHIEVEMENTS.filter(a =>  achSet.has(a.id));
  const locked   = ACHIEVEMENTS.filter(a => !achSet.has(a.id));
  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>All Achievements ({achSet.size}/{ACHIEVEMENTS.length})</div>
      {unlocked.length > 0 && <>
        <div style={{ fontSize:10, color:"var(--color-text-tertiary)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Earned</div>
        <div style={{ display:"grid", gap:6, marginBottom:16 }}>{unlocked.map(a => <AchRow key={a.id} a={a} done />)}</div>
      </>}
      <div style={{ fontSize:10, color:"var(--color-text-tertiary)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>Locked</div>
      <div style={{ display:"grid", gap:6 }}>{locked.map(a => <AchRow key={a.id} a={a} done={false} />)}</div>
    </div>
  );
}

function AchRow({ a, done }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:"var(--border-radius-md)", opacity:done?1:0.45, background:done?"var(--color-background-secondary)":"transparent", border:`0.5px solid ${done?"var(--color-border-secondary)":"var(--color-border-tertiary)"}` }}>
      <span style={{ fontSize:15, flexShrink:0 }}>{a.icon}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12, fontWeight:500, color:"var(--color-text-primary)", marginBottom:2 }}>{a.title}</div>
        <div style={{ fontSize:10, color:"var(--color-text-tertiary)" }}>{a.desc}</div>
        {a.reward && (
          <div style={{ fontSize:10, marginTop:3, color: done ? "var(--color-text-success)" : "var(--color-text-warning)" }}>
            {done ? "🎁 " : "🔒 "}{a.reward}
          </div>
        )}
      </div>
      <div style={{ fontSize:10, color:done?"var(--color-text-success)":"var(--color-text-tertiary)", whiteSpace:"nowrap" }}>
        {done?"✓ earned":""}
      </div>
    </div>
  );
}
