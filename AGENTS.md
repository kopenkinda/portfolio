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
Set `unlisted: true` on a post that should only be reached from the stash, not the blog list.

## Type

Only headings (`h1`–`h6`) use the heading font (`font-display`, Mona Sans). Everything else,
including navigation, links, labels and captions, uses the body font (Literata).

## Stash

One file per entry in `src/content/stash/`, newest first on `/stash/`. Every field is optional
apart from `date`; the page shows whatever an entry has (image, quote, source, link, post, note body).
For a quote, `source` is the attribution: who said it, and where.
Images live in `src/assets/stash/`.

An entry's `theme` recolours the whole site: `ink` (background), `paper` (text), `ash`
(secondary text) and `accent` (link underlines). Pick the colours by hand; the build fails when a
colour doesn't contrast enough with `ink`. Themes change colours only, never fonts.

Use Hugeicons (`@hugeicons/core-free-icons` through `src/components/Icon.astro`) for any icon.
