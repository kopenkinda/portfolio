This is using the latest Astro docs. Lookup documentation for best practices instead of guessing what to do based on what you think is correct.
Client oriented components should be defined as custom elements for ease of prop passing between astro and client.
The code inside `<script>` tags can and must be written in TypeScript.
Use tailwind classes for styling. If needed to add custom styles try to use tailwind @apply directives. Custom css is the last resort.
Follow DESIGN.md for styling decisions.
