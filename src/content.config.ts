import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    /** Unlisted posts have a page but don't appear on the blog list; link to them from the wall. */
    unlisted: z.boolean().default(false),
  }),
});

// WCAG contrast ratio between two #rrggbb colours.
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const hex = z.string().regex(/^#[0-9a-f]{6}$/i, "Use a #rrggbb colour");

/** A site-wide recolour: background, text, secondary text and link accent, and optionally a
    background texture that replaces the page's own. */
const theme = z
  .object({
    name: z.string(),
    ink: hex,
    paper: hex,
    ash: hex,
    accent: hex,
    texture: z.enum(["dots", "bricks"]).optional(),
    /** The home page graphic while the theme is on: the painted "map" or the valley in "dots". */
    graphic: z.enum(["map", "dots"]).optional(),
  })
  .superRefine((t, ctx) => {
    // The build fails on an unreadable theme, so a picked palette can't ship broken.
    const minimums = { paper: 7, ash: 4.5, accent: 3 } as const;
    for (const [key, min] of Object.entries(minimums) as [keyof typeof minimums, number][]) {
      const ratio = contrast(t[key], t.ink);
      if (ratio < min) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: `${key} on ink is ${ratio.toFixed(2)}:1, needs at least ${min}:1`,
        });
      }
    }
  });

/** Where something came from, e.g. { title: "Bleach", detail: "Episode 14, 03:54" }. */
const source = z.object({ title: z.string(), detail: z.string().optional(), url: z.url().optional() });

const wall = defineCollection({
  loader: glob({ base: "./src/content/wall", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z
      .object({
        date: z.coerce.date(),
        /** One image fills the column, two sit side by side, three or more scroll sideways.
            `alt` is read by screen readers; `source` and `theme` show on a line under the image. */
        images: z
          .array(z.object({ src: image(), alt: z.string(), source: source.optional(), theme: theme.optional() }))
          .min(1)
          .optional(),
        /** A quote; `source` then says who said it and where. */
        quote: z.string().optional(),
        /** Where the entry came from; for a quote, who said it and where. */
        source: source.optional(),
        /** Something found on the web. A link and a post are separate entries. */
        link: z.object({ title: z.string(), url: z.url() }).optional(),
        /** One of my posts pinned to the wall, usually an unlisted one. */
        post: reference("blog").optional(),
      })
      .refine((entry) => !(entry.link && entry.post), {
        message: "A link and a post are separate entries; split them into two files",
        path: ["post"],
      }),
});

export const collections = { blog, wall };

/** Shared view-transition name, so a post's title travels from the blog list into the post page. */
export const postTitleTransition = (id: string) => `post-${id.replace(/[^a-zA-Z0-9-]/g, "-")}`;
