import { useEffect, useState } from "react";
import { AmbientBackdrop } from "./components/fx/AmbientBackdrop";
import { CommandScreen } from "./components/metaphor/CommandScreen";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="AppRoot">
      <AmbientBackdrop reducedMotion={reducedMotion} />

      <div className="PageFrame">
        <header className="TopBar">
          <div className="BrandBlock">
            <div className="BrandTitle">Persona Portfolio</div>
            <div className="BrandSub">Metaphor-inspired menu prototype</div>
          </div>

          <button
            className="UiButton"
            type="button"
            onClick={() => setMenuOpen(true)}
          >
            Open Menu
          </button>
        </header>

        <main className="MainStage">
          <section className="HeroPanel">
            <h1 className="HeroTitle">Build a "game UI" website.</h1>
            <p className="HeroBody">
              This is the foundation: theme tokens, a keyboard-first menu shell,
              choreographed motion primitives, and an ambient texture layer.
            </p>
            <div className="HeroRow">
              <button
                className="UiButton UiButton--primary"
                type="button"
                onClick={() => setMenuOpen(true)}
              >
                Enter Menu
              </button>
              <span className="HintPill">Press <kbd>M</kbd> to toggle</span>
            </div>
          </section>
        </main>
      </div>

      <CommandScreen
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        reducedMotion={reducedMotion}
      />

      <MenuHotkeys
        onToggle={() => setMenuOpen((v) => !v)}
        disabled={false}
      />
    </div>
  );
}

function MenuHotkeys({
  onToggle,
  disabled,
}: {
  onToggle: () => void;
  disabled: boolean;
}) {
  useEffect(() => {
    if (disabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "m") onToggle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onToggle, disabled]);

  return null;
}
