# Menu architecture

## Goals

- Keyboard-first (arrow keys + enter), then pointer and touch.
- Cursor interpolation, idle “breathing,” layered composition.
- Keep the “Atlus touch” without sacrificing legibility.

## Structure

- `MenuShell` owns:
  - scrim, frame, header
  - focus trap + Escape + click-outside
  - open/close animation
- `MenuList` owns:
  - roving focus
  - cursor target measurement + interpolation (via CSS transitions)
  - per-item overlay layer for “tint” / blend effects

