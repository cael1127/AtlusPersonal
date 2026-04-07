import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PaintSplashProps {
  /** Y-offset (px) to position the splash behind the active item */
  y: number;
  /** Unique key that changes on selection to trigger re-animation */
  trigger: string;
  reducedMotion: boolean;
}

export function PaintSplash({ y, trigger, reducedMotion }: PaintSplashProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      gsap.set(el, { opacity: 1, scale: 1, rotate: 0 });
      return;
    }
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.4, rotate: -8 },
      { opacity: 1, scale: 1, rotate: 0, duration: 0.35, ease: "power3.out" },
    );
  }, [trigger, reducedMotion]);

  return (
    <div
      ref={ref}
      className="PaintSplash"
      style={{ top: `${y}px` }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 420 220"
        className="PaintSplash__svg"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="paintWarp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025"
              numOctaves="4"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="28"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <radialGradient id="splashGrad" cx="0.4" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#d42070" stopOpacity="0.92" />
            <stop offset="0.5" stopColor="#c946a8" stopOpacity="0.7" />
            <stop offset="1" stopColor="#8b1a4a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx="200"
          cy="110"
          rx="190"
          ry="95"
          fill="url(#splashGrad)"
          filter="url(#paintWarp)"
        />
      </svg>
      {/* Splatter particles */}
      <span className="PaintSplash__dot PaintSplash__dot--1" />
      <span className="PaintSplash__dot PaintSplash__dot--2" />
      <span className="PaintSplash__dot PaintSplash__dot--3" />
      <span className="PaintSplash__dot PaintSplash__dot--4" />
      <span className="PaintSplash__dot PaintSplash__dot--5" />
    </div>
  );
}
