import { useState, useEffect, useCallback } from "react";

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
  { id: "first_blood", icon: "⚔️",  title: "First Blood",        desc: "Log your first activity"             },
  { id: "streak_3",    icon: "🔥",  title: "On Fire",             desc: "3-day streak"                        },
  { id: "streak_7",    icon: "🔥",  title: "Week Warrior",        desc: "7-day streak"                        },
  { id: "streak_30",   icon: "💎",  title: "Diamond Grind",       desc: "30-day streak"                       },
  { id: "easy_10",     icon: "✅",  title: "Warm-Up Done",        desc: "Solve 10 easy problems"              },
  { id: "medium_25",   icon: "⚡",  title: "Getting Real",        desc: "Solve 25 medium problems"            },
  { id: "medium_50",   icon: "⚡",  title: "Battle-Tested",       desc: "Solve 50 medium problems"            },
  { id: "hard_5",      icon: "💀",  title: "Pain Embracer",       desc: "Solve 5 hard problems"               },
  { id: "hard_20",     icon: "💀",  title: "Masochist",           desc: "Solve 20 hard problems"              },
  { id: "sd_5",        icon: "🏗️", title: "Architect Initiate",  desc: "Design 5 systems"                    },
  { id: "sd_all",      icon: "🏛️", title: "System Architect",    desc: "Complete all SD topics"              },
  { id: "java_all",    icon: "☕",  title: "JVM Whisperer",       desc: "Study all Java topics"               },
  { id: "dsa_half",    icon: "📐",  title: "Halfway There",       desc: "Clear 50% of DSA topics (3+ each)"  },
  { id: "dsa_all",     icon: "🏆",  title: "DSA Master",          desc: "Clear all DSA topics (3+ each)"     },
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
  const jvCnt  = Object.values(java).filter(Boolean).length;
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

      {tab === "overview"      && <OverviewTab profile={profile} dsa={dsa} sd={sd} java={java} achSet={achSet} />}
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
                Earns +{lType==="sd"?XP_EARN.sd:XP_EARN.java} XP · one-time per topic
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
              </div>
            );
          })}
        </div>
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
  const done = Object.values(java).filter(Boolean).length;
  return (
    <div style={S.card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={S.sectionLabel}>Java Depth Topics</div>
        <div style={{ fontSize:11, color:"var(--color-text-secondary)" }}>{done}/{JAVA_TOPICS.length}</div>
      </div>
      <div style={{ display:"grid", gap:6 }}>
        {JAVA_TOPICS.map(t => (
          <div key={t} style={{ padding:"12px 14px", borderRadius:"var(--border-radius-md)", background:java[t]?"var(--color-background-warning)":"var(--color-background-secondary)", border:`0.5px solid ${java[t]?"var(--color-border-warning)":"var(--color-border-tertiary)"}`, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:12, color:java[t]?"var(--color-text-warning)":"var(--color-text-tertiary)" }}>{java[t]?"✓":"○"}</span>
            <span style={{ fontSize:12, color:java[t]?"var(--color-text-warning)":"var(--color-text-primary)" }}>{t}</span>
          </div>
        ))}
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
      </div>
      <div style={{ fontSize:10, color:done?"var(--color-text-success)":"var(--color-text-tertiary)", whiteSpace:"nowrap" }}>
        {done?"✓ earned":""}
      </div>
    </div>
  );
}
