# FX architecture

We treat FX as **background layers** so the UI remains readable and performant.

## Implemented

- `AmbientBackdrop`: vignette + grain drift + subtle paper lines.

## Planned (stretch)

- `DistortionLayer`: SVG filter or WebGL displacement behind UI only.
- `BrushMaskReveal`: SVG mask-driven wipes for screen transitions.

