import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { CONFIG } from "../consts";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: CONFIG.meta.title,
    description: CONFIG.meta.description,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.id}/`,
    })),
  });
}
