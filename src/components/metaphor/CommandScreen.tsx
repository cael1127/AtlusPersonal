import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { useParallax } from "../../lib/motion/useParallax";
import { PaintSplash } from "../fx/PaintSplash";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface MenuItem {
  id: string;
  label: string;
  sub: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: "about", label: "About", sub: "Who I am" },
  { id: "projects", label: "Projects", sub: "Selected works" },
  { id: "skills", label: "Skills", sub: "Tools & craft" },
  { id: "experience", label: "Experience", sub: "The journey so far" },
  { id: "contact", label: "Contact", sub: "Let\u2019s connect" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface CommandScreenProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (id: string) => void;
  reducedMotion: boolean;
}

export function CommandScreen({
  open,
  onClose,
  onSelect,
  reducedMotion,
}: CommandScreenProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = MENU_ITEMS[activeIdx];

  const rootRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const parallaxRaf = useRef<number>(0);

  const getParallax = useParallax(!reducedMotion && open);

  /* ----- Parallax render loop ----------------------------------- */
  useEffect(() => {
    if (reducedMotion || !open) {
      cancelAnimationFrame(parallaxRaf.current);
      return;
    }
    const scene = sceneRef.current;
    if (!scene) return;

    const bg = scene.querySelector<HTMLElement>(".CommandScreen__bg");
    const portrait = scene.querySelector<HTMLElement>(".CommandScreen__portrait");
    const chrome = scene.querySelector<HTMLElement>(".CommandScreen__chrome");
    const textStack = scene.querySelector<HTMLElement>(".CommandScreen__textStack");

    const tick = () => {
      const p = getParallax();
      const rx = p.y * -2;
      const ry = p.x * 3;
      scene.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

      if (bg) bg.style.transform = `translate(${p.x * -8}px, ${p.y * -6}px)`;
      if (portrait) portrait.style.transform = `translate(${p.x * 15}px, ${p.y * 10}px)`;
      if (chrome) chrome.style.transform = `translate(${p.x * 22}px, ${p.y * 16}px)`;
      if (textStack) textStack.style.transform = `translateY(-50%) translate(${p.x * -5}px, ${p.y * -4}px)`;

      parallaxRaf.current = requestAnimationFrame(tick);
    };
    parallaxRaf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(parallaxRaf.current);
  }, [reducedMotion, open, getParallax]);

  /* ----- Entry animation ---------------------------------------- */
  useLayoutEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);

    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tlRef.current = tl;

    if (reducedMotion) {
      gsap.set(root, { autoAlpha: 1 });
      return;
    }

    tl.fromTo(q(".CommandScreen__scrim"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0);
    tl.fromTo(q(".CommandScreen__bg"), { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.5 }, 0);
    tl.fromTo(
      q(".CommandScreen__portrait"),
      { x: 80, opacity: 0, scale: 1.04 },
      { x: 0, opacity: 1, scale: 1, duration: 0.55 },
      0.08,
    );

    const items = q(".CommandScreen__item");
    tl.fromTo(
      items,
      { x: -70, opacity: 0, skewY: 3 },
      { x: 0, opacity: 1, skewY: 0, duration: 0.4, stagger: 0.07 },
      0.12,
    );

    tl.fromTo(q(".PaintSplash"), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35 }, 0.35);
    tl.fromTo(
      q(".CommandScreen__chromeCircle"),
      { scale: 0.85, opacity: 0, rotate: -30 },
      { scale: 1, opacity: 0.18, rotate: 0, duration: 0.5 },
      0.3,
    );
    tl.fromTo(
      q(".CommandScreen__chromeLabel"),
      { opacity: 0 },
      { opacity: 0.32, duration: 0.3 },
      0.4,
    );
    tl.fromTo(
      q(".CommandScreen__chromeLine"),
      { scaleX: 0, scaleY: 0 },
      { scaleX: 1, scaleY: 1, duration: 0.4, stagger: 0.06 },
      0.35,
    );
    tl.fromTo(q(".CommandScreen__infoBar"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0.45);
    tl.fromTo(q(".CommandScreen__hints"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 }, 0.5);

    return () => {
      tl.kill();
    };
  }, [open, reducedMotion]);

  /* ----- Selection-change animation ----------------------------- */
  const prevIdx = useRef(activeIdx);
  useEffect(() => {
    if (prevIdx.current === activeIdx) return;
    prevIdx.current = activeIdx;
    if (reducedMotion || !open) return;

    const root = rootRef.current;
    if (!root) return;

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === activeIdx) {
        gsap.fromTo(el, { scale: 0.92 }, { scale: 1, duration: 0.22, ease: "power2.out" });
      }
    });

    const scene = sceneRef.current;
    if (scene) {
      gsap.fromTo(
        scene,
        { x: (Math.random() - 0.5) * 6 },
        { x: 0, duration: 0.12, ease: "power2.out" },
      );
    }
  }, [activeIdx, reducedMotion, open]);

  /* ----- Keyboard nav ------------------------------------------- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIdx((i) => Math.min(MENU_ITEMS.length - 1, i + 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIdx((i) => Math.max(0, i - 1));
          break;
        case "Home":
          e.preventDefault();
          setActiveIdx(0);
          break;
        case "End":
          e.preventDefault();
          setActiveIdx(MENU_ITEMS.length - 1);
          break;
        case "Enter":
          e.preventDefault();
          onSelect?.(MENU_ITEMS[activeIdx].id);
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, activeIdx, onClose, onSelect]);

  /* ----- Splash Y position -------------------------------------- */
  const [splashY, setSplashY] = useState(0);
  useLayoutEffect(() => {
    const el = itemRefs.current[activeIdx];
    if (!el) {
      setSplashY(activeIdx * 80);
      return;
    }
    setSplashY(el.offsetTop + el.offsetHeight / 2 - 120);
  }, [activeIdx]);

  /* ----- Font size per item ------------------------------------- */
  const getFontSize = useCallback(
    (idx: number) => {
      if (idx === activeIdx) return "clamp(4rem, 10vw, 9rem)";
      const dist = Math.abs(idx - activeIdx);
      if (dist === 1) return "clamp(2.8rem, 6.5vw, 6rem)";
      return "clamp(2.2rem, 5vw, 4.8rem)";
    },
    [activeIdx],
  );

  if (!open) return null;

  return (
    <div className="CommandScreen" ref={rootRef} role="dialog" aria-modal="true" aria-label="Command menu">
      <div className="CommandScreen__scrim" onClick={onClose} />

      <div className="CommandScreen__scene" ref={sceneRef}>
        {/* BG */}
        <div className="CommandScreen__bg" aria-hidden="true" />
        <div className="CommandScreen__grain" aria-hidden="true" />
        <div className="CommandScreen__vignette" aria-hidden="true" />

        {/* Portrait */}
        <div className="CommandScreen__portrait" aria-hidden="true">
          <img
            className="CommandScreen__portraitImg"
            src="/me.jpg"
            alt=""
            draggable={false}
          />
        </div>

        {/* Text stack */}
        <nav className="CommandScreen__textStack" role="menu" aria-label="Main navigation">
          {/* Paint splash behind active item */}
          <PaintSplash
            y={splashY}
            trigger={active.id}
            reducedMotion={reducedMotion}
          />

          {MENU_ITEMS.map((item, i) => (
            <button
              key={item.id}
              ref={(el) => { itemRefs.current[i] = el; }}
              type="button"
              role="menuitem"
              className={`CommandScreen__item${i === activeIdx ? " CommandScreen__item--active" : ""}`}
              style={{ fontSize: getFontSize(i) }}
              onClick={() => {
                setActiveIdx(i);
                onSelect?.(item.id);
              }}
              onMouseEnter={() => setActiveIdx(i)}
            >
              {item.label}
              <span className="CommandScreen__itemSub">{item.sub}</span>
            </button>
          ))}
        </nav>

        {/* Chrome overlay */}
        <div className="CommandScreen__chrome" aria-hidden="true">
          <ChromeCircle />
          <span className="CommandScreen__chromeLabel CommandScreen__chromeLabel--command">
            Command
          </span>
          <span className="CommandScreen__chromeLabel CommandScreen__chromeLabel--section">
            Main Menu
          </span>
          <div className="CommandScreen__chromeLine CommandScreen__chromeLine--h" />
          <div className="CommandScreen__chromeLine CommandScreen__chromeLine--v" />
        </div>

        {/* Info bar */}
        <div className="CommandScreen__infoBar">
          <div className="CommandScreen__infoRow">
            <span className="CommandScreen__infoLabel">Projects</span>
            <span className="CommandScreen__infoValue">12</span>
          </div>
          <div className="CommandScreen__infoRow">
            <span className="CommandScreen__infoLabel">Years</span>
            <span className="CommandScreen__infoValue">5</span>
          </div>
        </div>

        {/* Hints */}
        <div className="CommandScreen__hints">
          <span className="CommandScreen__hintItem">
            <span className="CommandScreen__hintKey">↑↓</span>
            <span className="CommandScreen__hintLabel">Navigate</span>
          </span>
          <span className="CommandScreen__hintItem">
            <span className="CommandScreen__hintKey">Enter</span>
            <span className="CommandScreen__hintLabel">Select</span>
          </span>
          <span className="CommandScreen__hintItem">
            <span className="CommandScreen__hintKey">Esc</span>
            <span className="CommandScreen__hintLabel">Close</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chrome circle sub-component                                        */
/* ------------------------------------------------------------------ */

function ChromeCircle() {
  const outerRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    gsap.to(el, {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 24,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <div className="CommandScreen__chromeCircle">
      <svg viewBox="0 0 200 200" className="CommandScreen__chromeSvg">
        {/* Outer dashed ring (rotates) */}
        <circle
          ref={outerRef}
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="rgba(239,231,214,0.45)"
          strokeWidth="0.8"
          strokeDasharray="4 8"
        />
        {/* Middle ring */}
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke="rgba(239,231,214,0.30)"
          strokeWidth="0.6"
        />
        {/* Inner ring */}
        <circle
          cx="100"
          cy="100"
          r="42"
          fill="none"
          stroke="rgba(194,27,42,0.35)"
          strokeWidth="0.6"
        />
        {/* Crosshair */}
        <line x1="100" y1="5" x2="100" y2="195" stroke="rgba(239,231,214,0.15)" strokeWidth="0.5" />
        <line x1="5" y1="100" x2="195" y2="100" stroke="rgba(239,231,214,0.15)" strokeWidth="0.5" />
        {/* Diagonal marks */}
        <line x1="28" y1="28" x2="172" y2="172" stroke="rgba(239,231,214,0.08)" strokeWidth="0.4" />
        <line x1="172" y1="28" x2="28" y2="172" stroke="rgba(239,231,214,0.08)" strokeWidth="0.4" />
        {/* Small triangle accent */}
        <polygon
          points="100,58 106,72 94,72"
          fill="rgba(194,27,42,0.3)"
          stroke="rgba(194,27,42,0.45)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
