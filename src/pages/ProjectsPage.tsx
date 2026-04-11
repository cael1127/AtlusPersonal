import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PROJECT_ENTRIES = [
  {
    id: "hub",
    rank: "I",
    title: "Metaphor Portfolio Hub",
    subtitle: "Command routing and layered UI scene",
    progress: "7/5",
    bullets: [
      "Menu-first route navigation system",
      "GSAP segmented timelines with keyboard parity",
      "Procedural scanline/grain/overlay stack",
    ],
  },
  {
    id: "transitions",
    rank: "II",
    title: "Transition Variant Engine",
    subtitle: "Per-route overlay choreography",
    progress: "5/5",
    bullets: [
      "Direction-aware route transitions",
      "Variant-driven panel behavior",
      "Reduced-motion deterministic fallback",
    ],
  },
  {
    id: "design-system",
    rank: "III",
    title: "Screen Archetype System",
    subtitle: "Bespoke pages without template lock-in",
    progress: "4/5",
    bullets: [
      "Route-scoped component namespaces",
      "Distinct visual grammar per page",
      "Reusable token-driven motion tuning",
    ],
  },
  {
    id: "lab",
    rank: "IV",
    title: "Procedural FX Lab",
    subtitle: "Clip paths and texture iteration",
    progress: "3/5",
    bullets: [
      "CSS-only masks and gradients",
      "Interaction-state micro FX",
      "Composable accent passes",
    ],
  },
] as const;

export default function ProjectsPage() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const activeEntry = useMemo(() => PROJECT_ENTRIES[active], [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((v) => (v === 0 ? PROJECT_ENTRIES.length - 1 : v - 1));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((v) => (v + 1) % PROJECT_ENTRIES.length);
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
    <div className="PageFrame ProjectsScreen">
      <header className="ProjectsScreen__header">
        <Link className="ProjectsScreen__back" to="/?menu=1">◀ Back</Link>
        <h1 className="ProjectsScreen__title">PROJECT LIST</h1>
      </header>

      <main className="ProjectsScreen__layout">
        <section className="ProjectsScreen__list" aria-label="Project entries">
          {PROJECT_ENTRIES.map((entry, idx) => (
            <button
              key={entry.id}
              type="button"
              className={`ProjectsScreen__card${idx === active ? " is-active" : ""}`}
              onMouseEnter={() => setActive(idx)}
              onClick={() => setActive(idx)}
            >
              <span className="ProjectsScreen__badge">{entry.rank}</span>
              <div className="ProjectsScreen__cardMain">
                <span className="ProjectsScreen__name">{entry.title}</span>
                <span className="ProjectsScreen__sub">{entry.subtitle}</span>
              </div>
              <span className="ProjectsScreen__progress">{entry.progress}</span>
            </button>
          ))}
        </section>

        <aside className="ProjectsScreen__detail">
          <div className="ProjectsScreen__detailTop">
            <span className="ProjectsScreen__detailIndex">{activeEntry.rank}</span>
            <h2 className="ProjectsScreen__detailTitle">{activeEntry.title}</h2>
            <span className="ProjectsScreen__detailProgress">{activeEntry.progress}</span>
          </div>
          <p className="ProjectsScreen__detailSub">{activeEntry.subtitle}</p>
          <ul className="ProjectsScreen__detailList">
            {activeEntry.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}
