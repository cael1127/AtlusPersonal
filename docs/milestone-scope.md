# Milestone scope

## Milestone 1 (minimum shippable): Home overlay menu

**Goal**: you can open a full-screen menu overlay that feels “Metaphor/Persona-ish” and is usable with keyboard/mouse, with a signature ambient backdrop.

### Included (MVP)

- **MenuShell**: overlay + click-outside + Escape + focus trap + restore focus on close.
- **MenuList**: roving tabindex, arrow navigation, pointer hover → focus, Enter/Space to activate.
- **MenuCursor**: interpolated cursor highlight (CSS transition) + idle breath.
- **AmbientBackdrop**: vignette + grain drift (disabled under reduced motion).
- **Reduced motion**: respects `prefers-reduced-motion` (turns off grain drift and fastens transitions).
- **ActionHints**: simple bottom-right hints.

### Not included (yet)

- Real route transitions between pages/sections
- Audio (SFX)
- Brush-mask “wipe” transitions
- Background capture/posterize/distortion (WebGL/SVG filter)
- Persona-style per-screen bespoke layouts

## Stretch effects (next milestone candidates)

Pick 1 at a time to avoid blowing the perf budget.

1. **BrushMaskReveal** (high impact, low compute)
   - SVG mask + clip-path wipes for screen enter/exit.
2. **DistortionLayer** (medium/high compute)
   - SVG turbulence filter or WebGL displacement applied behind the menu frame only.
3. **Additive cursor tint** (medium impact)
   - More accurate “text becomes red under cursor” with duplicated layers and precise masking.
4. **SFX pass** (high emotional payoff)
   - hover, select, back, open/close whoosh (with mute toggle).

