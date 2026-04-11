import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import {
  COMMAND_MENU_ITEMS,
  pathForMenuId,
} from "../../config/menuConfig";
import { Motion } from "../../lib/motion/tokens";
import { useParallax } from "../../lib/motion/useParallax";
import { PaintSplash } from "../fx/PaintSplash";

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
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [shouldRender, setShouldRender] = useState(open);
  const active = COMMAND_MENU_ITEMS[activeIdx];

  const rootRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLElement | null>(null);
  const chromeRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const confirmFlashRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const parallaxRaf = useRef<number>(0);

  const getParallax = useParallax(!reducedMotion && open);

  const activateItem = useCallback(
    (id: string) => {
      const runNavigate = () => {
        onSelect?.(id);
        navigate(pathForMenuId(id));
        onClose();
      };

      if (reducedMotion) {
        runNavigate();
        return;
      }

      const root = rootRef.current;
      const flash = confirmFlashRef.current;
      const activeEl = itemRefs.current[activeIdx];
      if (!root || !flash || !activeEl) {
        runNavigate();
        return;
      }

      const tl = gsap.timeline({
        onComplete: runNavigate,
      });
      tl.fromTo(
        flash,
        { autoAlpha: 0, scaleY: 0, transformOrigin: "center center" },
        { autoAlpha: 0.9, scaleY: 1, duration: Motion.dur.fast, ease: Motion.ease.impact },
      );
      tl.fromTo(
        activeEl,
        { scale: 1, x: 0 },
        { scale: 1.06, x: 10, duration: Motion.dur.fast, ease: Motion.ease.impact },
        0,
      );
      tl.to(root, { x: 8, duration: Motion.dur.fast * 0.7, ease: Motion.ease.impact }, 0);
      tl.to(flash, { autoAlpha: 0, duration: Motion.dur.fast }, Motion.dur.fast * 0.6);
      tl.to(root, { x: 0, duration: Motion.dur.fast, ease: Motion.ease.soft }, Motion.dur.fast * 0.5);
      tl.to(
        activeEl,
        { scale: 1, x: 0, duration: Motion.dur.fast, ease: Motion.ease.soft },
        Motion.dur.fast * 0.5,
      );
    },
    [activeIdx, navigate, onClose, onSelect, reducedMotion],
  );

  useEffect(() => {
    if (open) setShouldRender(true);
  }, [open]);

  useEffect(() => {
    if (reducedMotion || !open || !shouldRender) {
      cancelAnimationFrame(parallaxRaf.current);
      return;
    }
    const scene = sceneRef.current;
    const backdrop = backdropRef.current;
    const stack = stackRef.current;
    const chrome = chromeRef.current;
    if (!scene || !backdrop || !stack || !chrome) return;

    const tick = () => {
      const p = getParallax();
      const rx = p.y * -2;
      const ry = p.x * 3;
      scene.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      backdrop.style.transform = `translate(${p.x * -Motion.menu.parallax.backdrop}px, ${p.y * -6}px)`;
      stack.style.transform = `translateY(-50%) translate(${p.x * -Motion.menu.parallax.stack}px, ${p.y * -4}px)`;
      chrome.style.transform = `translate(${p.x * Motion.menu.parallax.chrome}px, ${p.y * 14}px)`;

      parallaxRaf.current = requestAnimationFrame(tick);
    };
    parallaxRaf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(parallaxRaf.current);
  }, [reducedMotion, open, shouldRender, getParallax]);

  useLayoutEffect(() => {
    if (!open || !shouldRender) return;
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);

    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tlRef.current = tl;
    gsap.set(root, { autoAlpha: 1, y: 0 });

    if (reducedMotion) {
      gsap.set(root, { autoAlpha: 1 });
      return;
    }

    tl.addLabel("scrim", 0);
    tl.addLabel("backdrop", 0.04);
    tl.addLabel("stack", 0.1);
    tl.addLabel("chrome", 0.24);
    tl.addLabel("hints", 0.4);

    tl.fromTo(
      root,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: Motion.dur.fast, ease: Motion.ease.soft },
      "scrim",
    );
    tl.fromTo(
      q(".CommandScreen__scrim"),
      { opacity: 0 },
      { opacity: 1, duration: Motion.menu.enter.scrim },
      "scrim",
    );
    tl.fromTo(
      q(".CommandScreen__menuBackdrop"),
      { opacity: 0, scale: 1.14, rotate: -1.2 },
      { opacity: 1, scale: 1, duration: Motion.menu.enter.backdrop, ease: Motion.ease.glide },
      "backdrop",
    );
    tl.fromTo(
      q(".CommandScreen__menuOverlay"),
      { opacity: 0 },
      { opacity: 1, duration: Motion.menu.enter.backdrop * 0.8 },
      "backdrop+=0.08",
    );
    tl.fromTo(
      q(".CommandScreen__menuStack .CommandScreen__item"),
      { x: -180, opacity: 0, skewY: 6, rotate: -1.6 },
      {
        x: 0,
        opacity: 1,
        skewY: 0,
        rotate: 0,
        duration: Motion.menu.enter.stack,
        stagger: Motion.menu.stagger.item,
        ease: Motion.ease.impact,
      },
      "stack",
    );
    tl.fromTo(
      q(".PaintSplash"),
      { scale: 0.4, opacity: 0 },
      { scale: 1, opacity: 1, duration: Motion.dur.med, ease: Motion.ease.impact },
      "stack+=0.1",
    );
    tl.fromTo(
      q(".CommandScreen__menuChrome .CommandScreen__chromeCircle"),
      { scale: 0.72, opacity: 0, rotate: -34 },
      { scale: 1, opacity: 0.2, rotate: 0, duration: Motion.menu.enter.chrome },
      "chrome",
    );
    tl.fromTo(
      q(".CommandScreen__menuChrome .CommandScreen__chromeLabel"),
      { opacity: 0 },
      { opacity: 0.35, duration: Motion.dur.fast },
      "chrome+=0.08",
    );
    tl.fromTo(
      q(".CommandScreen__menuChrome .CommandScreen__chromeLine"),
      { scaleX: 0, scaleY: 0 },
      { scaleX: 1, scaleY: 1, duration: Motion.dur.med, stagger: Motion.menu.stagger.chrome },
      "chrome",
    );
    tl.fromTo(
      q(".CommandScreen__menuChrome .CommandScreen__infoBar"),
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: Motion.dur.med },
      "chrome+=0.08",
    );
    tl.fromTo(
      q(".CommandScreen__menuHints"),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: Motion.menu.enter.hints, ease: Motion.ease.soft },
      "hints",
    );

    return () => {
      tl.kill();
    };
  }, [open, reducedMotion, shouldRender]);

  useLayoutEffect(() => {
    if (open || !shouldRender) return;
    const root = rootRef.current;
    if (!root) {
      setShouldRender(false);
      return;
    }
    const q = gsap.utils.selector(root);
    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline({
      onComplete: () => {
        setShouldRender(false);
        gsap.set(root, { clearProps: "all" });
      },
    });
    tlRef.current = tl;

    if (reducedMotion) {
      setShouldRender(false);
      return;
    }

    tl.to(q(".CommandScreen__menuHints"), { y: 8, opacity: 0, duration: Motion.dur.fast }, 0);
    tl.to(
      q(".CommandScreen__menuStack .CommandScreen__item"),
      { x: 16, opacity: 0, duration: Motion.menu.exit.stack, stagger: 0.03, ease: Motion.ease.soft },
      0,
    );
    tl.to(q(".CommandScreen__menuChrome"), { y: 10, opacity: 0, duration: Motion.menu.exit.stack }, 0);
    tl.to(q(".CommandScreen__scrim"), { opacity: 0, duration: Motion.menu.exit.scrim }, 0);
    tl.to(root, { autoAlpha: 0, y: 12, duration: Motion.menu.exit.root, ease: Motion.ease.soft }, 0);
  }, [open, reducedMotion, shouldRender]);

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
        gsap.fromTo(
          el,
          { scale: 0.94, filter: "brightness(1.15)" },
          { scale: 1, filter: "brightness(1)", duration: Motion.menu.interaction.focusPulse, ease: Motion.ease.impact },
        );
      }
    });

    const scene = sceneRef.current;
    if (scene) {
      gsap.fromTo(
        scene,
        { x: (Math.random() - 0.5) * 6 },
        { x: 0, duration: Motion.menu.interaction.sceneKick, ease: Motion.ease.impact },
      );
    }
  }, [activeIdx, reducedMotion, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIdx((i) => (i + 1) % COMMAND_MENU_ITEMS.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIdx((i) => (i === 0 ? COMMAND_MENU_ITEMS.length - 1 : i - 1));
          break;
        case "Home":
          e.preventDefault();
          setActiveIdx(0);
          break;
        case "End":
          e.preventDefault();
          setActiveIdx(COMMAND_MENU_ITEMS.length - 1);
          break;
        case "Enter":
          e.preventDefault();
          window.setTimeout(
            () => activateItem(COMMAND_MENU_ITEMS[activeIdx].id),
            Motion.menu.interaction.confirmDelay * 1000,
          );
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, activeIdx, onClose, activateItem]);

  const [splashY, setSplashY] = useState(0);
  useLayoutEffect(() => {
    if (!shouldRender || !open) return;
    const el = itemRefs.current[activeIdx];
    if (!el) {
      setSplashY(activeIdx * 80);
      return;
    }
    setSplashY(el.offsetTop + el.offsetHeight / 2 - 120);
  }, [activeIdx, open, shouldRender]);

  useLayoutEffect(() => {
    if (!open || !shouldRender) return;
    const cursor = cursorRef.current;
    const stack = stackRef.current;
    const target = itemRefs.current[activeIdx];
    if (!cursor || !stack || !target) return;

    const stackRect = stack.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const y = targetRect.top - stackRect.top + targetRect.height * 0.14;
    const h = targetRect.height * 0.72;

    if (reducedMotion) {
      gsap.set(cursor, { y, height: h, autoAlpha: 1 });
      return;
    }
    gsap.to(cursor, {
      y,
      height: h,
      autoAlpha: 1,
      duration: Motion.menu.interaction.cursorGlide,
      ease: Motion.ease.glide,
    });
  }, [activeIdx, open, reducedMotion, shouldRender]);

  const getFontSize = useCallback(
    (idx: number) => {
      const scale = COMMAND_MENU_ITEMS[idx]?.scale ?? 1;
      if (idx === activeIdx) {
        return `clamp(${3.9 * scale}rem, ${8.9 * scale}vw, ${8.8 * scale}rem)`;
      }
      const dist = Math.abs(idx - activeIdx);
      if (dist === 1) {
        return `clamp(${2.5 * scale}rem, ${6 * scale}vw, ${5.2 * scale}rem)`;
      }
      return `clamp(${1.65 * scale}rem, ${4.2 * scale}vw, ${3.9 * scale}rem)`;
    },
    [activeIdx],
  );

  const getDepthStyle = useCallback(
    (idx: number) => {
      const dist = Math.abs(idx - activeIdx);
      const bias = COMMAND_MENU_ITEMS[idx]?.depthBias ?? 1;
      const opacity = Math.max(0.12, (1 - dist * 0.34) * bias);
      const blur = Math.min(4.5, dist * 1.35);
      const shift = Math.min(56, dist * 15);
      return {
        opacity: idx === activeIdx ? 1 : Number(opacity.toFixed(3)),
        filter: idx === activeIdx ? "none" : `blur(${blur.toFixed(2)}px)`,
        transform: idx === activeIdx ? "translateX(0px)" : `translateX(${shift}px)`,
      } as const;
    },
    [activeIdx],
  );

  if (!shouldRender) return null;

  return (
    <div className="CommandScreen" ref={rootRef} role="dialog" aria-modal="true" aria-label="Command menu">
      <div className="CommandScreen__scrim" onClick={onClose} />

      <section className="CommandScreen__scene" ref={sceneRef}>
        <div className="CommandScreen__menuBackdrop" ref={backdropRef} aria-hidden="true">
          <div className="CommandScreen__bg" />
          <div className="CommandScreen__grain" />
          <div className="CommandScreen__scanlines" />
          <div className="CommandScreen__sceneMask" />
          <div className="CommandScreen__vignette" />
          <div className="CommandScreen__watermark">COMMAND</div>
          <div className="CommandScreen__stripe" />
          <div className="CommandScreen__stripe2" />
          <div className="CommandScreen__gridGlow" />
        </div>
        <div className="CommandScreen__menuOverlay" aria-hidden="true" />
        <div className="CommandScreen__confirmFlash" ref={confirmFlashRef} aria-hidden="true" />

        <nav
          className="CommandScreen__menuStack CommandScreen__textStack"
          ref={stackRef}
          role="menu"
          aria-label="Main navigation"
        >
          <div className="CommandScreen__cursor" ref={cursorRef} aria-hidden="true" />
          <PaintSplash
            y={splashY}
            trigger={active.id}
            reducedMotion={reducedMotion}
          />

          {COMMAND_MENU_ITEMS.map((item, i) => {
            const clip = item.clipVariant ?? (i % 3) as 0 | 1 | 2;
            const ox = item.offsetX ?? 0;
            const oy = item.offsetY ?? 0;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitem"
                className={`CommandScreen__item CommandScreen__item--clip${clip}${
                  i === activeIdx ? " CommandScreen__item--active" : ""
                }`}
                style={{ fontSize: getFontSize(i), ...getDepthStyle(i) }}
                aria-current={i === activeIdx ? "page" : undefined}
                onClick={() => {
                  setActiveIdx(i);
                  window.setTimeout(
                    () => activateItem(item.id),
                    Motion.menu.interaction.confirmDelay * 1000,
                  );
                }}
                onMouseEnter={() => setActiveIdx(i)}
              >
                <span
                  className="CommandScreen__itemLabelRow"
                  style={{ transform: `translate(${ox}px, ${oy}px)` }}
                >
                  <span className="CommandScreen__itemLabel">{item.label}</span>
                </span>
                <span className="CommandScreen__itemSub">{item.sub}</span>
              </button>
            );
          })}
        </nav>

        <div className="CommandScreen__menuChrome CommandScreen__chrome" ref={chromeRef} aria-hidden="true">
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

        <div className="CommandScreen__menuHints CommandScreen__hints">
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
      </section>
    </div>
  );
}

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
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke="rgba(239,231,214,0.30)"
          strokeWidth="0.6"
        />
        <circle
          cx="100"
          cy="100"
          r="42"
          fill="none"
          stroke="rgba(194,27,42,0.35)"
          strokeWidth="0.6"
        />
        <line x1="100" y1="5" x2="100" y2="195" stroke="rgba(239,231,214,0.15)" strokeWidth="0.5" />
        <line x1="5" y1="100" x2="195" y2="100" stroke="rgba(239,231,214,0.15)" strokeWidth="0.5" />
        <line x1="28" y1="28" x2="172" y2="172" stroke="rgba(239,231,214,0.08)" strokeWidth="0.4" />
        <line x1="172" y1="28" x2="28" y2="172" stroke="rgba(239,231,214,0.08)" strokeWidth="0.4" />
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
