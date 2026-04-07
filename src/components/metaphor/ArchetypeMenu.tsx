import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

type Archetype = {
  id: string;
  name: string;
  title: string;
  desc: string;
  tags: string[];
};

const ARCHETYPES: Archetype[] = [
  {
    id: "seeker",
    name: "Seeker",
    title: "The one who walks forward",
    desc: "Balanced instincts. A versatile path that adapts to the shape of the trial.",
    tags: ["Balanced", "Initiation"],
  },
  {
    id: "mage",
    name: "Mage",
    title: "Scholar of unseen laws",
    desc: "A discipline of patterns and pressure. Converts knowledge into force.",
    tags: ["Arcane", "Burst"],
  },
  {
    id: "knight",
    name: "Knight",
    title: "Shield of the vow",
    desc: "Turns danger into structure. Holds the line when the world tilts.",
    tags: ["Guard", "Resolve"],
  },
  {
    id: "thief",
    name: "Thief",
    title: "Hands faster than doubt",
    desc: "Wins by misdirection—slips between rules rather than breaking them.",
    tags: ["Evasion", "Tempo"],
  },
  {
    id: "healer",
    name: "Healer",
    title: "Mercy with a cost",
    desc: "Restores the party’s rhythm. Keeps the outcome within reach.",
    tags: ["Sustain", "Support"],
  },
];

export function ArchetypeMenu({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeId, setActiveId] = useState(ARCHETYPES[0].id);
  const activeIndex = useMemo(
    () => Math.max(0, ARCHETYPES.findIndex((a) => a.id === activeId)),
    [activeId],
  );
  const active = useMemo(
    () => ARCHETYPES.find((a) => a.id === activeId) ?? ARCHETYPES[0],
    [activeId],
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inkFlashRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline();
    tl.fromTo(
      q(".ArchetypeMenu__left"),
      { x: -18, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
      0,
    );
    tl.fromTo(
      q(".ArchetypeMenu__wheel"),
      { scale: 0.96, opacity: 0, rotate: -2 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.5, ease: "power3.out" },
      0.06,
    );
    tl.fromTo(
      q(".ArchetypeMenu__right"),
      { x: 18, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
      0.1,
    );
    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(
      q(".ArchetypeMenu__right .ArchetypeMenu__card"),
      { y: 6, opacity: 0.6 },
      { y: 0, opacity: 1, duration: 0.22, ease: "power2.out" },
    );

    const ink = inkFlashRef.current;
    if (ink) {
      gsap.killTweensOf(ink);
      gsap.fromTo(
        ink,
        { opacity: 0, scale: 0.98, rotate: -1 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.14, ease: "power2.out" },
      );
      gsap.to(ink, { opacity: 0, duration: 0.24, delay: 0.06, ease: "power2.out" });
    }
  }, [activeId, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(ARCHETYPES.length - 1, activeIndex + 1);
        setActiveId(ARCHETYPES[next].id);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(0, activeIndex - 1);
        setActiveId(ARCHETYPES[prev].id);
      }
      if (e.key === "Home") {
        e.preventDefault();
        setActiveId(ARCHETYPES[0].id);
      }
      if (e.key === "End") {
        e.preventDefault();
        setActiveId(ARCHETYPES[ARCHETYPES.length - 1].id);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  return (
    <div className="ArchetypeMenu" ref={rootRef}>
      <div className="ArchetypeMenu__chrome" aria-hidden="true">
        <div className="ArchetypeMenu__chromeRule" />
        <div className="ArchetypeMenu__chromeRule ArchetypeMenu__chromeRule--bottom" />
      </div>

      <div className="ArchetypeMenu__grid">
        <aside className="ArchetypeMenu__left">
          <div className="ArchetypeMenu__sectionTitle">Archetypes</div>
          <div className="ArchetypeMenu__list" role="menu" aria-label="Archetypes">
            {ARCHETYPES.map((a) => {
              const selected = a.id === activeId;
              return (
                <button
                  key={a.id}
                  type="button"
                  className="ArchetypeMenu__listItem"
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => setActiveId(a.id)}
                >
                  <span className="ArchetypeMenu__listInk" aria-hidden="true" />
                  <span className="ArchetypeMenu__listName">{a.name}</span>
                  <span className="ArchetypeMenu__listMeta">
                    {selected ? "Selected" : "—"}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="ArchetypeMenu__hint">
            Navigate with <kbd>↑</kbd>/<kbd>↓</kbd>. Press <kbd>Esc</kbd> to
            close.
          </div>
        </aside>

        <section className="ArchetypeMenu__center">
          <div className="ArchetypeMenu__wheel">
            <SigilWheel label={active.name} reducedMotion={reducedMotion} />
          </div>
          <div className="ArchetypeMenu__caption">
            “The menu is the face of the title.”
          </div>
        </section>

        <aside className="ArchetypeMenu__right">
          <div className="ArchetypeMenu__sectionTitle">Record</div>
          <div className="ArchetypeMenu__card">
            <div className="ArchetypeMenu__inkFlash" ref={inkFlashRef} aria-hidden="true" />
            <div className="ArchetypeMenu__cardTitle">{active.name}</div>
            <div className="ArchetypeMenu__cardSub">{active.title}</div>
            <div className="ArchetypeMenu__cardBody">{active.desc}</div>
            <div className="ArchetypeMenu__tags">
              {active.tags.map((t) => (
                <span className="ArchetypeMenu__tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="ArchetypeMenu__sideNote">
            This is a **visual target screen**. Next we’ll bind items to your
            real site sections.
          </div>
        </aside>
      </div>
    </div>
  );
}

function SigilWheel({
  label,
  reducedMotion,
}: {
  label: string;
  reducedMotion: boolean;
}) {
  const ringRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ringRef.current;
    if (!el) return;
    gsap.to(el, { rotation: 360, transformOrigin: "50% 50%", duration: 18, repeat: -1, ease: "none" });
  }, [reducedMotion]);

  return (
    <div className="SigilWheel" aria-label={`Sigil: ${label}`}>
      <div className="SigilWheel__watermark" aria-hidden="true" />
      <svg viewBox="0 0 100 100" className="SigilWheel__svg" aria-hidden="true">
        <defs>
          <filter id="ink">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
            <feColorMatrix
              type="matrix"
              values="
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 .6 0"
            />
          </filter>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(202,163,74,0.65)" />
            <stop offset="0.5" stopColor="rgba(239,231,214,0.35)" />
            <stop offset="1" stopColor="rgba(202,163,74,0.55)" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="44" fill="none" stroke="url(#gold)" strokeWidth="1.2" opacity="0.9" />
        <circle
          ref={ringRef}
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="rgba(239,231,214,0.35)"
          strokeDasharray="2 5"
          strokeWidth="1"
        />
        <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(194,27,42,0.35)" strokeWidth="1" />

        {/* spokes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 50 + Math.cos(a) * 30;
          const y1 = 50 + Math.sin(a) * 30;
          const x2 = 50 + Math.cos(a) * 44;
          const y2 = 50 + Math.sin(a) * 44;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(239,231,214,0.18)"
              strokeWidth="0.8"
            />
          );
        })}

        <path
          d="M50 21 L56 38 L74 38 L59 49 L64 67 L50 56 L36 67 L41 49 L26 38 L44 38 Z"
          fill="rgba(11,11,13,0.35)"
          stroke="rgba(239,231,214,0.22)"
          strokeWidth="0.8"
          filter="url(#ink)"
        />
      </svg>

      <div className="SigilWheel__label">
        <div className="SigilWheel__labelTop">Archetype</div>
        <div className="SigilWheel__labelMain">{label}</div>
      </div>
    </div>
  );
}

