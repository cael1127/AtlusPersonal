# Motion primitives (website)

These are the reusable “Persona/Metaphor” motion building blocks used throughout the UI.

## Primitives

- **enter/exit**: layered reveal (scrim → frame → title → list → hints). Duration: ~320–450ms, ease: snap/out.
- **focus move**: cursor interpolates between items, never teleports. Duration: ~250–320ms.
- **idle**: subtle breathing on cursor + low-amplitude grain drift. Always disabled under reduced motion.

## Guardrails

- Don’t block input for more than ~150–250ms after a user action.
- Animate transforms/opacity, not layout properties.
- Under `prefers-reduced-motion`, animations collapse to near-instant.

