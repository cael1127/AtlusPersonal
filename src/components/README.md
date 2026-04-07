# Components

This project treats the “Persona/Metaphor” vibe as **system + choreography**.

## `components/menu/*`

- `MenuShell`: full-screen overlay dialog with focus trap + click-outside + Escape.
- `MenuList`: keyboard-first list with roving tabindex + cursor interpolation.
- `ActionHints`: hint pills (Enter/Esc/etc.).

## `components/fx/*`

- `AmbientBackdrop`: ambient vignette + grain drift (cheap, transform-safe).

## Accessibility / perf

- Every overlay is `role="dialog"` + `aria-modal`.
- Focus is trapped inside the menu; focus restores on close.
- Heavy FX are optional and always reduced under `prefers-reduced-motion`.

