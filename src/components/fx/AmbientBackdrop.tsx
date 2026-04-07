import { useEffect, useMemo, useRef } from "react";

export function AmbientBackdrop({ reducedMotion }: { reducedMotion: boolean }) {
  const seed = useMemo(() => Math.random().toString(16).slice(2), []);
  const grainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = grainRef.current;
    if (!el) return;
    // Cheap “alive” feeling without heavy canvases.
    // We only animate background-position (single layer) and keep it subtle.
    if (reducedMotion) {
      el.style.animation = "none";
    } else {
      el.style.animation = "grainShift 4.2s steps(2, end) infinite";
    }
  }, [reducedMotion]);

  return (
    <div className="AmbientBackdrop" aria-hidden="true" data-seed={seed}>
      <div className="AmbientBackdrop__vignette" />
      <div ref={grainRef} className="AmbientBackdrop__grain" />
      <div className="AmbientBackdrop__paperNoise" />
    </div>
  );
}

