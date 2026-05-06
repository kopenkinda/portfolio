---
name: blog-interactive-postprocess
description: Use when post-processing drafted blog posts to turn the first custom interactive marker into an Astro interactive element. Triggers on blog draft post-processing, custom blog syntax like "[Custom: ...] {R: ...} {V: ...}", or requests to implement interactive widgets for blog posts.
---

# Blog Interactive Postprocess

Use this for drafted blog posts that contain this custom marker:

```md
[Custom: <mini-description-of-the-interactive-widget>]
{R: Reason as to why it would make sense to add here}
{V: Text description of the visual representation of the widget}.
```

## Workflow

1. Identify the target post.
   - If the user did not name a post, ask which post to reference.
   - Look for posts in `src/content/blog/*`.
   - Resolve the blog slug from the filename/path unless frontmatter defines a clearer slug.

2. Find the target marker.
   - By default, search for the first `[Custom:` occurrence in the post.
   - Parse the following `{R: ...}` and `{V: ...}` blocks as the design brief.
   - Treat each marker as a separate interactive element with its own component.
   - Do not process later markers unless the user asks.

3. Interview before editing.
   - This step is mandatory by default.
   - Invoking this skill, mentioning the marker syntax, or asking for implementation is not permission to skip the interview.
   - Only skip the interview if the user explicitly says to skip it or clearly states that immediate implementation is desired without further questioning.
   - Relentlessly align with the user on perspective, intent, interaction model, visual style, data/state, and what the reader should learn by using it.
   - Ask concrete questions one at a time or in a short numbered set.
   - Do not implement, edit files, propose a finished design, or start coding until the user explicitly agrees on the direction or explicitly waives the interview.
   - If default agent behavior says "execute when plausible," this skill overrides that behavior. Interview first.

4. Implement after agreement.
   - Follow root `AGENTS.md`.
   - Because this is Astro, consult current Astro docs before using framework-specific APIs or patterns.
   - Build one component for the one marker being processed. Do not create a single catch-all component for multiple markers.
   - Put the component at:

     ```txt
     src/components/blog/<blog-slug>/<interactive-component-name>.astro
     ```

   - Client-oriented pieces should be custom elements for easy prop passing between Astro and client code.
   - TypeScript is required inside `<script>` tags.
   - Prefer Tailwind classes for styling. Use Tailwind `@apply` only when needed. Use custom CSS only as a last resort.

5. Integrate and verify.
   - Replace the exact marker block being processed with the component usage at that same location in the post body.
   - Do not collect components at the top of the post, bottom of the post, or in a separate gallery section unless the user explicitly asks for that layout.
   - Keep the original post text intact except for the exact marker block being replaced.
   - Preserve surrounding paragraph flow and heading structure.
   - Run the project’s relevant checks (`astro check`, build, or existing package scripts) when feasible.
   - If a dev server is needed for frontend verification, start it and provide the local URL.

## Interview Focus

Cover these before implementation:

- Reader perspective: what question the widget answers at that moment in the post.
- Interaction: what the reader can change, click, drag, filter, compare, or reveal.
- Visual: layout, labels, motion, density, empty/error states, and responsive behavior.
- Content boundaries: exact claims/data from the post that the widget may encode.
- Success criteria: what must be true for the widget to feel worth keeping.

## Naming

- Blog slug: kebab-case from the post slug or filename.
- Component directory: `src/components/blog/<blog-slug>/`.
- Component filename: kebab-case, specific to the interaction, ending in `.astro`.
