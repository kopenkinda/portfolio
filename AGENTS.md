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
- `src/pages/andorra.svg.ts` paints the static base at build time (seeded, so it's stable).
- `AndorraScene.astro` draws what moves on one canvas above the painting, and handles the pokes.

Keep moving parts out of the painting and on the canvas: the painting's watercolour filters are
expensive and must render once, while the canvas redraws every frame. Don't move animated parts
into SVG elements over the painting; repainting them re-renders the filtered image underneath. Map data is © OpenStreetMap
contributors (ODbL), credited in the README and the scene's label.

## Texture

The background texture is an SVG mask in `src/styles/global.css`, painted in `ash`, so it follows
the theme without its own colours. Pages default to `dots`; the wall uses `bricks` (Layout's
`texture` prop), with a sparse damage layer of cracked and chipped bricks in
`public/textures/brick-damage.svg`, sized to the brick grid. Keep textures faint through the SVG's `fill-opacity`: they must never compete with
text. To add one, add a `--texture-<name>` variable and the name to the Layout prop and theme schema.

Use Hugeicons (`@hugeicons/core-free-icons` through `src/components/Icon.astro`) for any icon.
