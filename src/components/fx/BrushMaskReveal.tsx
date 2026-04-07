import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * BrushMaskReveal
 * A lightweight “brush wipe” reveal to get Atlus-like layered transitions
 * without heavy shaders. Designed to be safe under reduced motion.
 */
export function BrushMaskReveal({
  play,
  reducedMotion,
  children,
}: {
  play: boolean;
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const edgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const edge = edgeRef.current;
    if (!root || !edge) return;

    gsap.killTweensOf([root, edge]);

    if (reducedMotion) {
      root.style.setProperty("--reveal", "1");
      edge.style.opacity = "0";
      return;
    }

    if (play) {
      root.style.setProperty("--reveal", "0");
      edge.style.opacity = "1";

      const tl = gsap.timeline();
      tl.to(root, {
        duration: 0.48,
        ease: "power3.out",
        onUpdate: () => {
          // no-op; CSS variable tween below
        },
        ...( { "--reveal": 1 } as unknown as gsap.TweenVars ),
      });
      tl.fromTo(
        edge,
        { xPercent: -65, yPercent: -5, rotation: -6, opacity: 0.0 },
        { xPercent: 70, yPercent: 2, rotation: 2, opacity: 0.9, duration: 0.48, ease: "power3.out" },
        0,
      );
      tl.to(edge, { opacity: 0, duration: 0.18, ease: "power1.out" }, 0.36);
      return () => {
        tl.kill();
      };
    }
  }, [play, reducedMotion]);

  return (
    <div className="BrushMaskReveal" ref={rootRef}>
      <div className="BrushMaskReveal__content">{children}</div>
      <div className="BrushMaskReveal__edge" ref={edgeRef} aria-hidden="true" />
    </div>
  );
}

