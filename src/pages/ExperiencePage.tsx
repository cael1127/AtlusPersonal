import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const EXPERIENCE_LOG = [
  {
    id: "senior",
    period: "2023 — Present",
    role: "Senior Front-End Engineer",
    details: [
      "Led interaction system implementation for portfolio and marketing shells.",
      "Set animation standards and accessibility checks across teams.",
    ],
  },
  {
    id: "uiux",
    period: "2021 — 2023",
    role: "UI/UX Engineer",
    details: [
      "Converted high-fidelity prototypes into production front-end modules.",
      "Built keyboard-first UI interactions for complex menus and panels.",
    ],
  },
  {
    id: "freelance",
    period: "2019 — 2021",
    role: "Freelance Front-End Developer",
    details: [
      "Delivered custom client websites with bespoke visual identity systems.",
      "Created reusable component kits for quick iteration and consistency.",
    ],
  },
] as const;

export default function ExperiencePage() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const activeEntry = useMemo(() => EXPERIENCE_LOG[active], [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((v) => (v === 0 ? EXPERIENCE_LOG.length - 1 : v - 1));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((v) => (v + 1) % EXPERIENCE_LOG.length);
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
    <div className="PageFrame ExperienceScreen">
      <header className="ExperienceScreen__header">
        <Link className="ExperienceScreen__back" to="/?menu=1">◀ Back</Link>
        <h1 className="ExperienceScreen__title">MISSION LOG</h1>
      </header>

      <main className="ExperienceScreen__layout">
        <section className="ExperienceScreen__timeline">
          {EXPERIENCE_LOG.map((entry, idx) => (
            <button
              key={entry.id}
              type="button"
              className={`ExperienceScreen__entry${idx === active ? " is-active" : ""}`}
              onMouseEnter={() => setActive(idx)}
              onClick={() => setActive(idx)}
            >
              <span className="ExperienceScreen__entryRole">{entry.role}</span>
              <span className="ExperienceScreen__entryPeriod">{entry.period}</span>
            </button>
          ))}
        </section>

        <aside className="ExperienceScreen__detail">
          <div className="ExperienceScreen__detailTop">
            <h2>{activeEntry.role}</h2>
            <span className="ExperienceScreen__detailRank">{String(active + 1).padStart(2, "0")}</span>
          </div>
          <p className="ExperienceScreen__detailPeriod">{activeEntry.period}</p>
          <ul>
            {activeEntry.details.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}
