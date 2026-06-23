import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { renderOgImagePng } from "../../lib/og";

export const prerender = true;

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;
  const words = (post.body ?? "").trim().split(/\s+/).filter(Boolean).length;
  const reading =
    post.data.reading ?? `${Math.max(1, Math.ceil(words / 220))} min`;

  const png = await renderOgImagePng({
    title: post.data.title,
    slug: post.id,
    pubDate: post.data.pubDate,
    reading,
    tags: post.data.tags,
  });

  return new Response(png as BodyInit, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};
