import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    date: z.coerce.date(),
    keywords: z.array(z.string()),
    draft: z.boolean().default(true),
  }),
});

export const collections = {
  blog: blogCollection,
};
