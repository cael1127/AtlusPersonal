import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

import { Motion } from "../../lib/motion/tokens";
import { BrushMaskReveal } from "../fx/BrushMaskReveal";

function getFocusable(root: HTMLElement) {
  const selector =
    "a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"),
  );
}

export function MenuShell({
  open,
  onClose,
  reducedMotion,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  reducedMotion: boolean;
  title: string;
  children: React.ReactNode;
}) {
  const id = useMemo(
    () => `menu_${Math.random().toString(16).slice(2)}`,
    [],
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      // Focus trap
      if (e.key === "Tab") {
        const root = rootRef.current;
        if (!root) return;
        const focusables = getFocusable(root);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (!active || active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (!active || active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    if (open) {
      lastActive.current = document.activeElement as HTMLElement | null;

      // Initial focus to first button.
      const focusables = getFocusable(root);
      (focusables[0] ?? panel).focus();

      if (reducedMotion) return;
      gsap.killTweensOf(panel);
      gsap.fromTo(
        panel,
        { y: 22, rotation: -0.35, opacity: 0 },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: Motion.dur.med + 0.1,
          ease: "power3.out",
        },
      );
    } else {
      // Restore focus for accessibility
      lastActive.current?.focus?.();
    }
  }, [open, reducedMotion]);

  if (!open) return null;

  return (
    <div
      ref={rootRef}
      className="MenuShell"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}_title`}
      onMouseDown={(e) => {
        // Click-outside closes.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="MenuShell__scrim" />

      <div className="MenuShell__frame" ref={panelRef} tabIndex={-1}>
        <BrushMaskReveal play={true} reducedMotion={reducedMotion}>
          <div className="MenuShell__header">
            <div className="MenuShell__rule" />
            <div className="MenuShell__titleRow">
              <div className="MenuShell__sigil" aria-hidden="true" />
              <div className="MenuShell__title" id={`${id}_title`}>
                {title}
              </div>
            </div>
            <button className="MenuShell__close" type="button" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="MenuShell__body">{children}</div>
        </BrushMaskReveal>
      </div>
    </div>
  );
}

