# Blog Post Prompt

Write a blog post in markdown (`.mdx`-friendly).

You may add custom tags for suggested interactive elements/graphics. Keep them as plain text tags in the draft. Use this exact shape:

```md
[Custom: <mini-description-of-the-interactive-widget>]
[R: Reason as to why it would make sense to add here]
[V: Text description of the visual representation of the widget].
```

## Style

- Be witty, but to the point.
- This is not an editorial piece.
- Write it like a page for my public mind palace.
- Prefer strong opinions, concrete details, and clean structure over fluff.
- Keep the prose readable and sharp. No generic AI enthusiasm.

## Output

- Return a complete MDX post.
- Include metadata only if explicitly requested.
- If metadata is included, keep it valid for a typical MDX post.
- Include a short blockquote version of the description near the top if it fits the piece.
- Add `[Custom: ...]` tags wherever an interactive widget, diagram, mockup, or visual would materially improve comprehension.
- Do not implement the interactive elements. Only propose them via the custom tag syntax.

## Inputs

Use these inputs to write the post:

- title: `<title>`
- description: `<description>`
- core thesis: `<what this post is really arguing or documenting>`
- audience: `<who this is for>`
- sections:
  - `<section-name>`: `<section goal>`
  - `<section-name>`: `<section goal>`
- things I want to mention:
  1. `<topic-group>`
     - `<item>`
     - `<item>`
  2. `<topic-group>`
     - `<item>`
     - `<item>`
- constraints:
  - `<must include>`
  - `<must avoid>`

## Writing Rules

- Keep the structure intentional. Use headings that earn their keep.
- If listing tools, skills, workflows, or opinions, add the "why" not just the name.
- Favor specifics, tradeoffs, and first-hand reasoning.
- Use profanity only if it improves voice and feels natural for the piece.
- Avoid sounding like a review roundup, press release, or thought leadership sludge.
- Treat the custom tags as drafting markers for later post-processing.

## Example Invocation

```md
Write a blog post in markdown (MDX).

Title: "<title>"
Description: "<description>"
Core thesis: "<core thesis>"
Audience: "<audience>"

Things I want to mention:
1. <topic-group>
- <item>
- <item>
2. <topic-group>
- <item>
- <item>

Constraints:
- <must include>
- <must avoid>
```
