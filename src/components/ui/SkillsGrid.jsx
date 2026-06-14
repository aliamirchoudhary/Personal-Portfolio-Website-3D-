import { useState, useEffect, useRef } from "react";

// ─── Data (extracted exactly from old HTML) ───────────────────────────────────

const TECHNICAL_SKILLS = [
  { name: "Python",                pct: 94 },
  { name: "C++",                   pct: 93 },
  { name: "C",                     pct: 90 },
  { name: "JavaScript",            pct: 85 },
  { name: "SQL",                   pct: 87 },
  { name: "React",                 pct: 82 },
  { name: "Flask",                 pct: 80 },
  { name: "MERN",                  pct: 81 },
  { name: "Git / GitHub",          pct: 90 },
  { name: "MultiVariable Calculus",pct: 82 },
  { name: "Linear Algebra",        pct: 85 },
  { name: "Assembly Language",     pct: 79 },
  { name: "Model Training",        pct: 83 },
  { name: "Machine Learning",      pct: 84 },
];

const PROFESSIONAL_SKILLS = [
  { name: "Problem Solving",    pct: 95 },
  { name: "Logical Reasoning",  pct: 92 },
  { name: "Communication",      pct: 88 },
  { name: "Team Collaboration", pct: 90 },
  { name: "Project Management", pct: 85 },
  { name: "Continuous Learning",pct: 98 },
  { name: "Public Speaking",    pct: 95 },
];

// ─── CSS injected once ────────────────────────────────────────────────────────

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@500;700&display=swap');

@keyframes skillShimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%);  }
}

@keyframes skillBarGrow {
  from { width: 0%; }
}

@keyframes skillPopIn {
  0%   { opacity: 0; transform: scale(0.85) translateY(16px); }
  70%  { opacity: 1; transform: scale(1.04) translateY(-2px); }
  100% { opacity: 1; transform: scale(1)    translateY(0);    }
}

@keyframes tabIndicatorSlide {
  from { opacity: 0; transform: scaleX(0); }
  to   { opacity: 1; transform: scaleX(1); }
}

.sg-tab-btn {
  background: transparent;
  border: 2px solid rgba(124, 58, 237, 0.3);
  color: #94a3b8;
  padding: 0.9rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.sg-tab-btn.active,
.sg-tab-btn:hover {
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border-color: #7c3aed;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.35);
}

.sg-skill-card {
  background: linear-gradient(145deg, #12121a, #0e0e16);
  padding: 1.6rem 1.8rem;
  border-radius: 16px;
  border: 1px solid rgba(124, 58, 237, 0.12);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  opacity: 0;
}

.sg-skill-card.visible {
  animation: skillPopIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.sg-skill-card::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.08), transparent);
  transition: left 0.55s;
  z-index: 1;
}

.sg-skill-card:hover::before { left: 100%; }

.sg-skill-card:hover {
  transform: translateY(-5px) scale(1.02);
  border-color: rgba(124, 58, 237, 0.35);
  box-shadow: 0 15px 35px rgba(124, 58, 237, 0.18);
}

.sg-skill-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.9rem;
  position: relative;
  z-index: 2;
}

.sg-bar-track {
  background: rgba(255, 255, 255, 0.08);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.6rem;
  position: relative;
  z-index: 2;
}

.sg-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #06b6d4);
  border-radius: 4px;
  width: 0%;
  position: relative;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.sg-bar-fill::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
  animation: skillShimmer 2.2s infinite;
}

.sg-pct {
  font-family: 'JetBrains Mono', monospace;
  color: #06b6d4;
  font-weight: 700;
  font-size: 0.85rem;
  position: relative;
  z-index: 2;
}

.sg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.6rem;
  max-width: 1000px;
  margin: 0 auto;
}

.sg-scrollable {
  max-height: calc(100vh - 20rem);
  overflow-y: auto;
  padding-right: 6px;
}

.sg-scrollable::-webkit-scrollbar       { width: 6px; }
.sg-scrollable::-webkit-scrollbar-track { background: rgba(124,58,237,0.05); border-radius: 10px; }
.sg-scrollable::-webkit-scrollbar-thumb { background: linear-gradient(to bottom,#7c3aed,#06b6d4); border-radius: 10px; }
.sg-scrollable::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom,#06b6d4,#7c3aed); }
`;

// ─── SkillCard ────────────────────────────────────────────────────────────────

function SkillCard({ name, pct, delay }) {
  const cardRef  = useRef(null);
  const fillRef  = useRef(null);
  const [visible, setVisible] = useState(false);
  const [barWidth, setBarWidth] = useState("0%");

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisible(true);
            setTimeout(() => setBarWidth(`${pct}%`), 80);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, pct]);

  return (
    <div
      ref={cardRef}
      className={`sg-skill-card${visible ? " visible" : ""}`}
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="sg-skill-name">{name}</div>
      <div className="sg-bar-track">
        <div
          ref={fillRef}
          className="sg-bar-fill"
          style={{ width: barWidth }}
        />
      </div>
      <div className="sg-pct">{pct}%</div>
    </div>
  );
}

// ─── SkillsGrid (main export) ─────────────────────────────────────────────────

export default function SkillsGrid() {
  const [activeTab, setActiveTab] = useState("technical");

  // Inject styles once
  useEffect(() => {
    if (document.getElementById("sg-styles")) return;
    const tag = document.createElement("style");
    tag.id = "sg-styles";
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  const skills = activeTab === "technical" ? TECHNICAL_SKILLS : PROFESSIONAL_SKILLS;

  return (
    <div style={{ width: "100%", fontFamily: "'Inter', sans-serif" }}>

      {/* Tab buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2.4rem" }}>
        <button
          className={`sg-tab-btn${activeTab === "technical" ? " active" : ""}`}
          onClick={() => setActiveTab("technical")}
        >
          Technical Skills
        </button>
        <button
          className={`sg-tab-btn${activeTab === "professional" ? " active" : ""}`}
          onClick={() => setActiveTab("professional")}
        >
          Professional Skills
        </button>
      </div>

      {/* Scrollable grid */}
      <div className="sg-scrollable">
        <div className="sg-grid">
          {skills.map((s, i) => (
            <SkillCard
              key={`${activeTab}-${s.name}`}
              name={s.name}
              pct={s.pct}
              delay={i * 15}
            />
          ))}
        </div>
      </div>
    </div>
  );
}