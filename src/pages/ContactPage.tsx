import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CONTACT_LINKS = [
  {
    id: "email",
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    hint: "Primary collaboration channel",
    metric: "Direct",
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/cael1127",
    href: "https://github.com/cael1127",
    hint: "Code and project history",
    metric: "Public",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/your-handle",
    href: "#",
    hint: "Professional updates and contact",
    metric: "Network",
  },
] as const;

export default function ContactPage() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const activeLink = useMemo(() => CONTACT_LINKS[active], [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((v) => (v === 0 ? CONTACT_LINKS.length - 1 : v - 1));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((v) => (v + 1) % CONTACT_LINKS.length);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        window.open(CONTACT_LINKS[active].href, "_blank");
      }
      if (e.key === "Escape") {
        e.preventDefault();
        navigate("/?menu=1");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate]);

  return (
    <div className="PageFrame ContactScreen">
      <header className="ContactScreen__header">
        <Link className="ContactScreen__back" to="/?menu=1">◀ Back</Link>
        <h1 className="ContactScreen__title">SOCIAL CHANNELS</h1>
      </header>

      <main className="ContactScreen__layout">
        <section className="ContactScreen__list">
          {CONTACT_LINKS.map((item, idx) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={`ContactScreen__row${idx === active ? " is-active" : ""}`}
              onMouseEnter={() => setActive(idx)}
            >
              <span className="ContactScreen__rowLabel">{item.label}</span>
              <span className="ContactScreen__rowValue">{item.value}</span>
              <span className="ContactScreen__rowMetric">{item.metric}</span>
            </a>
          ))}
        </section>

        <aside className="ContactScreen__panel">
          <div className="ContactScreen__panelTop">
            <h2>{activeLink.label}</h2>
            <span className="ContactScreen__panelMetric">{activeLink.metric}</span>
          </div>
          <p>{activeLink.hint}</p>
          <a href={activeLink.href} target="_blank" rel="noreferrer" className="ContactScreen__open">
            Open Channel ↗
          </a>
        </aside>
      </main>
    </div>
  );
}
