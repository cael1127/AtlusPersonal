import { useEffect, useLayoutEffect, useState } from "react";
import { CommandScreen } from "../components/metaphor/CommandScreen";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("menu") !== "1") return;
    setMenuOpen(true);
    params.delete("menu");
    const qs = params.toString();
    const path = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    window.history.replaceState(null, "", path);
  }, []);

  return (
    <>
      <div className="PageFrame">
        <header className="TopBar">
          <div className="BrandBlock">
            <div className="BrandTitle">Persona Portfolio</div>
            <div className="BrandSub">Metaphor-inspired command interface</div>
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
            <h1 className="HeroTitle">Build a &quot;game UI&quot; website.</h1>
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
              <span className="HintPill">
                Press <kbd>M</kbd> to toggle · deep link{" "}
                <code className="HintPill__code">?menu=1</code>
              </span>
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
    </>
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
