import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SKILL_GROUPS = [
  { id: "frontend", title: "Front-End", level: 92, items: ["React", "TypeScript", "Vite", "Accessibility"], score: "S" },
  { id: "motion", title: "Motion", level: 88, items: ["GSAP", "Timeline design", "Interaction choreography"], score: "A+" },
  { id: "systems", title: "Systems", level: 84, items: ["Design tokens", "UI architecture", "State orchestration"], score: "A" },
  { id: "creative", title: "Creative", level: 79, items: ["Procedural visuals", "Clip paths", "Visual polish"], score: "B+" },
] as const;

export default function SkillsPage() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const current = SKILL_GROUPS[active];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActive((v) => (v === 0 ? SKILL_GROUPS.length - 1 : v - 1));
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setActive((v) => (v + 1) % SKILL_GROUPS.length);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        navigate("/?menu=1");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div className="PageFrame SkillsScreen">
      <header className="SkillsScreen__header">
        <Link className="SkillsScreen__back" to="/?menu=1">◀ Back</Link>
        <h1 className="SkillsScreen__title">LOADOUT</h1>
      </header>

      <main className="SkillsScreen__layout">
        <section className="SkillsScreen__wheel" aria-label="Skill groups">
          {SKILL_GROUPS.map((group, idx) => (
            <button
              key={group.id}
              type="button"
              className={`SkillsScreen__node${idx === active ? " is-active" : ""}`}
              onMouseEnter={() => setActive(idx)}
              onClick={() => setActive(idx)}
            >
              <span className="SkillsScreen__nodeLabel">{group.title}</span>
              <span className="SkillsScreen__nodePct">{group.level}%</span>
              <span className="SkillsScreen__nodeScore">{group.score}</span>
            </button>
          ))}
        </section>

        <aside className="SkillsScreen__panel">
          <div className="SkillsScreen__panelTop">
            <h2>{current.title}</h2>
            <span className="SkillsScreen__panelScore">{current.score}</span>
          </div>
          <div className="SkillsScreen__meter">
            <div className="SkillsScreen__meterFill" style={{ width: `${current.level}%` }} />
          </div>
          <ul className="SkillsScreen__panelList">
            {current.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}
