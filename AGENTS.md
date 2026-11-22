## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Blog

Posts are MDX files in `src/content/blog/`. A post's interactive elements live in
`src/components/blog/<post-slug>/`, one component per element, imported by that post only.
Write client behaviour as a custom element in a TypeScript `<script>`, and add `not-prose`
to the component's root so post text styles don't leak into it.
Set `unlisted: true` on a post that should only be reached from the wall, not the blog list.

## Type

Only headings (`h1`–`h6`) use the heading font (`font-display`, Mona Sans). Everything else,
including navigation, links, labels and captions, uses the body font (Literata).

## Wall

One file per entry in `src/content/wall/`. It's a wall, not a timeline: `date` only orders
entries (newest first) and is never shown. Every other field is optional; the page shows whatever
an entry has (images, quote, source, link, post, note body). A link and a post are separate
entries, and the schema rejects one file with both. One image fills the column, two sit side by
side, three or more become a rail across the window. Each image has required `alt` text (for
screen readers) and can have its own `source` and `theme`, shown on a line under it.

Keep the text roles consistent: an entry's main line (link or post title, quote) is `text-lg` in
paper; supporting text (notes, post descriptions) is body size in ash; captions are `text-sm` ash.
For a quote, `source` is the attribution: who said it, and where.
Images live in `src/assets/wall/`.

An image's `theme` recolours the whole site: `ink` (background), `paper` (text), `ash`
(secondary text) and `accent` (link underlines). Pick the colours by hand; the build fails when a
colour doesn't contrast enough with `ink`. Themes change colours only, never fonts.
A theme can also set `texture` (`dots` or `bricks`) to replace the page's background texture.

## Site controls

The top bar (`site-controls` in `src/layouts/Layout.astro`) has two icon buttons. The first switches
between the dark and light mode (`data-mode="light"` on `<html>`, palette in `global.css`); while a
wall theme is on, the theme's name replaces it, and pressing the name resets the theme. The second
turns link sounds on and off (`data-sound="on"`). Sound is on by default, but browsers block audio
until the first click or key press, so the icon shows muted until then; only pressing the speaker
saves a choice. Choices are saved in localStorage and re-applied by the inline script in the
layout's head before paint. Icons show the current state.

## Home scene

The painted map at the top of the home page is Escaldes-Engordany around Caldea, drawn from the real
OpenStreetMap layout. All of it lives in `src/components/andorra/`:

- `build-map.mjs` fetches the area from OpenStreetMap and writes `map.json` (buildings, streets,
  river, parks, Caldea's footprint) in scene units: 1200 × 500, 0.75 m each, north up. Run it by
  hand to refresh the map or move the frame (`CENTER`, `METRES_PER_UNIT`).
- `scene.ts` loads it and derives what both layers share: Caldea's dome and spire positions, and
  streets joined into continuous routes for traffic and walkers.
- `painting.ts` paints the static base at build time (seeded, so it's stable); `src/pages/andorra.svg.ts`
  serves it. The image address carries a hash of the painting, so a cached old painting never
  shows under a newer moving layer.
- `AndorraScene.astro` draws what moves on one canvas above the painting, and handles the pokes.

Keep moving parts out of the painting and on the canvas: the painting's watercolour filters are
expensive and must render once, while the canvas redraws every frame. Don't move animated parts
into SVG elements over the painting; repainting them re-renders the filtered image underneath. Map data is © OpenStreetMap
contributors (ODbL), credited in the README and the scene's label.

## Home graphics

The home page shows one graphic, picked by `graphicFor` in `src/scripts/theme.ts` (and the same rule
in Layout's head script, as `data-graphic` on `<html>`): a wall theme's `graphic` if it sets one,
otherwise the painted map in light mode and the dots valley in dark mode. To add a graphic, add its
name to the `Graphic` type and the theme schema, and hide it unless `data-graphic` names it.

The dots valley lives in `src/components/dots/`. `grid.ts` turns `photo.jpg` into a small PNG at build
time (served by `src/pages/dots.png.ts`): one pixel per dot, rgb is the dot's finished colour, alpha
is its density, and alpha 0 marks the sky, where the canvas draws stars. The mountain layers come
from seed points placed by hand (`LAYERS`), like the peak glint (`GLINT` in `DotsScene.astro`); place
both again when the photo changes.

The sixth tap breaks the valley into a jigsaw (`puzzle.ts`). Loose pieces are small canvases in a
layer fixed to the bottom of the window; each copies its part of the scene's canvas every frame, so
the scene keeps drawing while a puzzle is open, even off screen. Placed pieces are the scene's own
canvas, clipped to their shapes. A piece let go away from its place falls again, with the speed
the pointer gave it. Because pieces copy the scene, nothing the pointer does over the picture may
reach a loose piece: it would appear on the piece that belongs under the pointer. So the pointer
counts only on placed pieces, their cursor effect is drawn after the loose pieces have copied the
frame, a loose piece draws the effect for the cursor on it itself, and taps wait until the picture
is whole. Switching to another graphic ends the puzzle.

## Open source

The open source list on the home page lives in `src/components/open-source/`. `projects.ts` lists the
projects; their cards show a contribution grid and totals of the agent work that went into each.
`usage.ts` reads that from the Codex, Claude Code and Pi session logs on the author's machine and
writes `usage.json`, so the site builds anywhere. Run it by hand to refresh the numbers
(`node src/components/open-source/usage.ts`). It only counts the listed projects and only writes
totals: tokens per day, sessions and each model's share, never prompts or paths.

## Texture

The background texture is an SVG mask in `src/styles/global.css`, painted in `ash`, so it follows
the theme without its own colours. Pages default to `dots`; the wall uses `bricks` (Layout's
`texture` prop), with a sparse damage layer of cracked and chipped bricks in
`public/textures/brick-damage.svg`, sized to the brick grid. Keep textures faint through the SVG's `fill-opacity`: they must never compete with
text. To add one, add a `--texture-<name>` variable and the name to the Layout prop and theme schema.

Use Hugeicons (`@hugeicons/core-free-icons` through `src/components/Icon.astro`) for any icon.
