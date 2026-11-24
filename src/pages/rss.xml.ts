// The blog as an RSS feed, at the address earlier versions of the site used, so existing
// subscribers keep getting posts. Unlisted posts stay out, as they do on the blog list.
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("blog", (post) => !post.data.unlisted);
  return rss({
    title: "Dmitrii Kopenkin",
    description: "Posts by Dmitrii Kopenkin on building software, coding agents and technical hiring.",
    site: site!,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/blog/${post.id}/`,
      })),
  });
};
