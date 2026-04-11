import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ABOUT_ROWS = [
  {
    id: "bio",
    role: "Lead",
    label: "Profile",
    title: "Cael Findley",
    lines: [
      "Front-end engineer focused on expressive interfaces and game-inspired navigation.",
      "I prototype interaction language first, then turn it into reusable systems.",
    ],
  },
  {
    id: "facts",
    role: "Party",
    label: "Fast Facts",
    title: "Creative Notes",
    lines: [
      "I care about keyboard parity as much as visual polish.",
      "I prefer procedural visual systems over heavy asset dependencies.",
    ],
  },
  {
    id: "focus",
    role: "Party",
    label: "Current Focus",
    title: "What I Build",
    lines: [
      "High-fidelity route transitions and command-driven UI architecture.",
      "Portfolio systems that can grow into full product shells.",
    ],
  },
] as const;

export default function AboutPage() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  const activeItem = useMemo(() => ABOUT_ROWS[active], [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((v) => (v === 0 ? ABOUT_ROWS.length - 1 : v - 1));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((v) => (v + 1) % ABOUT_ROWS.length);
      }
      if (e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        setRevealed(true);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setRevealed(false);
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
    <div className="PageFrame AboutScreen">
      <header className="AboutScreen__header">
        <Link className="AboutScreen__back" to="/?menu=1">◀ Back</Link>
        <p className="AboutScreen__eyebrow">Character Log</p>
        <h1 className="AboutScreen__title">ABOUT</h1>
      </header>

      <main className="AboutScreen__body">
        <section className="AboutScreen__list" aria-label="About options">
          {ABOUT_ROWS.map((row, idx) => (
            <button
              key={row.id}
              type="button"
              className={`AboutScreen__row${idx === active ? " is-active" : ""}`}
              onClick={() => {
                setActive(idx);
                setRevealed(true);
              }}
              onMouseEnter={() => setActive(idx)}
            >
              <span className="AboutScreen__rowRole">{row.role}</span>
              <span className="AboutScreen__rowMain">
                <span className="AboutScreen__rowLabel">{row.label}</span>
                <span className="AboutScreen__rowTitle">{row.title}</span>
              </span>
            </button>
          ))}
        </section>

        <aside className={`AboutScreen__panel${revealed ? " is-revealed" : ""}`} aria-live="polite">
          <div className="AboutScreen__panelTop">
            <div className="AboutScreen__panelTag">{activeItem.label}</div>
            <h2 className="AboutScreen__panelTitle">{activeItem.title}</h2>
          </div>
          <div className="AboutScreen__panelLines">
            {activeItem.lines.map((line, i) => (
              <p key={line}>
                <span className="AboutScreen__lineIndex">{String(i + 1).padStart(2, "0")}</span>
                {line}
              </p>
            ))}
          </div>
          <div className="AboutScreen__panelHint">Enter / → reveal, ← hide</div>
        </aside>
      </main>
    </div>
  );
}
