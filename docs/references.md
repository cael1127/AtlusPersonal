# References + extracted principles (Metaphor / Persona UI)

This doc is here to keep the “why” close to the implementation. The goal is **Metaphor-first** tone, with Persona best-practices for legibility and “choreographed” UI.

## Primary sources (interviews / talks)

- **Metaphor UI = “emotional accelerator”** (Koji Ise): UI/animations are tuned to what the player *should be feeling* moment-to-moment; combat should feel faster/more aggressive via UI pacing.  
  Source: The Verge interview: `https://www.theverge.com/games/636243/metaphor-refantazio-ui-menu-interview-koji-ise`
  - **Implementation translation**:
    - Our menu transitions should have **two modes**: calm (slower, floaty) and action (snappier, sharper).
    - Use **staggered layers** (backdrop → panels → titles → list → hints) so the UI feels “composed,” not just fading in.

- **Metaphor UI = uniquely tied to the title**: “cool” comes from tying the UI to tone + narrative; early concept iterations explored travel/parchment, retro boxes, anxiety motif; final blend aims for “timeless” medieval art + modern poster typography/motion.  
  Source: Eurogamer GDC interview: `https://www.eurogamer.net/how-metaphor-refantazios-ui-escaped-the-shadow-of-persona`
  - **Implementation translation**:
    - Our theme needs a **coherent texture language** (paper/ink/grain) and **poster-like typography**.
    - Make “background ornament” layers that can swap per section (e.g., About vs Projects) to feel bespoke.

- **Persona UI pipeline = color/font first, then usability via composition**: decide main color, logo, key font early; in Persona 5 they minimized sub-colors and used line-of-sight guides (central line), lighting priority, and layout angles to keep readability; lots of iteration and close designer↔programmer collaboration.  
  Source: Persona Central panel summary: `https://personacentral.com/persona-5-panel-concept-development-ui/`
  - **Implementation translation**:
    - Use a strong **token system** (main color + ink + paper + 1–2 accents) and avoid rainbow palettes.
    - Add **eye-guiding rules** (rules/lines/frames) inside the menu so it’s readable even with texture.

- **Persona UI craft = “manual” bespoke screens, performance-sensitive**: designers avoid relying on automation; menu should appear without lag (resident data / responsiveness emphasized).  
  Source: Persona Central UI interview: `https://personacentral.com/persona-5-interview-ui-design-sound-music/`
  - **Implementation translation**:
    - Prioritize **instant interaction**: animations should never block input longer than ~150–250ms.
    - Prefer transform-based animation; keep heavy FX optional and disable under reduced motion.

## Practical recreation / technical breakdown reference

- **Persona 3 Reload pause menu recreation (UE5)**: breaks screen into functional components vs cosmetic; underwater distortion uses render-target + color grading + sine-wave UV displacement; cursor/text color change can be additive blending; highlights trade-offs between hard-coded layout (better animation) vs dynamic grid (maintainability).  
  Source: Adrian Kowalik: `https://adrian-kowalik.com/projects/persona-3-reload-ui-recreation`
  - **Implementation translation (web)**:
    - Treat the menu as **functional core + cosmetic layers**.
    - Implement “underwater” feel as an **optional effect layer** (grain + displacement) so we can budget performance.
    - Cursor overlay that “tints” underlying labels can be done with **blend modes / duplicated text layers**.

## Reusable UI principles we’ll bake into code

- **Layered composition**: background texture → vignette → panels → typography → cursor → hints.
- **Motion primitives** (few, consistent):
  - enter/exit (layered wipe + snap)
  - focus move (interpolated cursor)
  - idle (breathing / drift)
- **Legibility guardrails**:
  - contrast floor for real text
  - texture intensity variable (turn down on small screens)
  - reduced motion support

