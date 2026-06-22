# DESIGN.md

Stylistic guidelines for this portfolio.

## Philosophy

- Text is the interface.
- Prefer terminal/TUI affordances: `[+]`, `[-]`, `>`, `#tag`, `├─`, `└─`, `┆`.
- No decorative UI: no gradients, blobs, filler images, icons-as-decoration.
- Richness comes from behavior, not ornament.
- Keep real selectable text where possible. If canvas is used, keep an accessible DOM fallback.
- Respect reduced motion.

## Color

Monochrome paper/ink with one warm accent.

| Token                | Role              | Value                   |
| -------------------- | ----------------- | ----------------------- |
| `--background`       | warm paper        | `oklch(0.962 0.009 85)` |
| `--foreground`       | ink               | `oklch(0.235 0.008 70)` |
| `--muted`            | subtle fill       | `oklch(0.93 0.009 85)`  |
| `--muted-foreground` | secondary text    | `oklch(0.56 0.012 70)`  |
| `--accent`           | terracotta accent | `oklch(0.52 0.13 38)`   |
| `--border`           | hairlines         | `oklch(0.84 0.011 78)`  |

Rules:

- One chromatic accent only.
- No purple/violet.
- No gradients.
- In inverted states, flip foreground/background for contrast.
- Browser UI should match paper background where possible.

## Typography

- One font family: JetBrains Mono.
- Use it globally as both sans and mono.
- Lowercase is preferred for labels, metadata, and navigation.
- Body text should stay readable: relaxed line-height, never tiny.
- Use weight and spacing instead of extra fonts.

## Shape and layout

- Zero border radius.
- No shadows.
- No cards.
- Separate with whitespace, dashed rules, and hairline borders.
- Prefer one constrained text column.
- Use Tailwind spacing scale.
- Avoid arbitrary custom CSS unless Tailwind cannot express it cleanly.

## Interaction

- Links may use dotted underlines and a hover/focus decode/scramble effect.
- Expandable rows should use text markers (`[+]` / `[-]`).
- Active state should use both color and a text/cursor marker.
- Keyboard interaction is encouraged where it fits:
  - `↑` / `↓` or `j` / `k` for movement.
  - `Enter` / `Space` for toggles.
  - `g` / `G` for top/bottom jumps.
- Pointer interactions should mirror keyboard interactions.

## Motion

- Motion should be sparse and purposeful.
- Blink/caret effects should use hard steps, not fades.
- All motion must respect `prefers-reduced-motion`.

## Selection and accessibility

- Use inverted block selection:
  - `background: foreground`
  - `color: background`
- Do not use color as the only state signal.
- Preserve semantic HTML.
- Keep focus states visible.

## Do

- Keep it text-only.
- Express affordances as characters.
- Reuse existing tokens.
- Keep one accent, one font, square corners.
- Prefer Tailwind utilities and `@apply`.

## Don’t

- Add buttons, cards, shadows, rounded corners, gradients, or decorative imagery.
- Add a second accent or second font.
- Hide essential content in canvas-only rendering.
- Add motion without reduced-motion handling.
