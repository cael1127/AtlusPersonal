import { useEffect, useMemo, useRef, useState } from "react";

export type MenuItem = { id: string; label: string };

export function MenuList({
  items,
  onActivate,
}: {
  items: MenuItem[];
  onActivate: (id: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const cursorTarget = useMemo(() => {
    const btn = buttonRefs.current[activeIndex];
    if (!btn) return null;
    const r = btn.getBoundingClientRect();
    return { top: r.top, left: r.left, height: r.height, width: r.width };
  }, [activeIndex]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => {
      // Force react to recompute cursor position by toggling state.
      setActiveIndex((i) => i);
    });
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // When the active index changes (keyboard navigation), ensure overlay tint is visible
    // by toggling a data-attr on the list root for CSS to target.
    const list = listRef.current;
    if (!list) return;
    list.dataset.active = String(activeIndex);
  }, [activeIndex]);

  return (
    <div className="MenuList" ref={listRef}>
      <MenuCursorOverlay target={cursorTarget} />

      <div className="MenuList__stack" role="menu" aria-label="Main menu">
        {items.map((it, idx) => (
          <button
            key={it.id}
            ref={(el) => {
              buttonRefs.current[idx] = el;
            }}
            className="MenuList__item"
            type="button"
            role="menuitem"
            tabIndex={idx === activeIndex ? 0 : -1}
            onFocus={() => setActiveIndex(idx)}
            onPointerEnter={() => setActiveIndex(idx)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((v) => Math.min(items.length - 1, v + 1));
                buttonRefs.current[Math.min(items.length - 1, idx + 1)]?.focus();
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((v) => Math.max(0, v - 1));
                buttonRefs.current[Math.max(0, idx - 1)]?.focus();
              }
              if (e.key === "Home") {
                e.preventDefault();
                setActiveIndex(0);
                buttonRefs.current[0]?.focus();
              }
              if (e.key === "End") {
                e.preventDefault();
                setActiveIndex(items.length - 1);
                buttonRefs.current[items.length - 1]?.focus();
              }
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onActivate(it.id);
              }
            }}
            onClick={() => onActivate(it.id)}
          >
            <span className="MenuList__label">{it.label}</span>
            <span className="MenuList__label MenuList__label--overlay">
              {it.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MenuCursorOverlay({
  target,
}: {
  target: { top: number; left: number; height: number; width: number } | null;
}) {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el || !target) return;
    const root = el.offsetParent as HTMLElement | null;
    if (!root) return;
    const rr = root.getBoundingClientRect();

    const x = target.left - rr.left;
    const y = target.top - rr.top;

    el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(
      y,
    )}px, 0)`;
    el.style.height = `${Math.round(target.height)}px`;
    el.style.width = `${Math.round(target.width)}px`;
  }, [target?.top, target?.left, target?.height, target?.width]);

  return <div ref={cursorRef} className="MenuCursor" aria-hidden="true" />;
}

