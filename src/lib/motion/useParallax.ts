import { useEffect, useRef, useCallback } from "react";

export interface ParallaxValues {
  x: number;
  y: number;
}

/**
 * Tracks mouse position relative to viewport center and returns
 * smoothly interpolated normalized values (-1..1) via a ref.
 * Layers read from the ref and apply their own depth multiplier.
 */
export function useParallax(enabled: boolean) {
  const target = useRef<ParallaxValues>({ x: 0, y: 0 });
  const current = useRef<ParallaxValues>({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      current.current = { x: 0, y: 0 };
      return;
    }

    const onMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const SMOOTH = 0.08;

    const tick = () => {
      current.current = {
        x: lerp(current.current.x, target.current.x, SMOOTH),
        y: lerp(current.current.y, target.current.y, SMOOTH),
      };
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  const get = useCallback(() => current.current, []);
  return get;
}
