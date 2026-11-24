// Every page's share card (src/components/og/card.ts), at /og/<page path>.png; the home page's is
// /og/index.png. Layout links each page to its card by path, so a new page needs a card here.
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { card } from "../../components/og/card";
import { readingTime } from "../../content.config";

/** The file behind a post's cover. Astro keeps it on the image as `fsPath`, a property it doesn't
    document, so fail loudly if a release drops it rather than quietly showing the valley. */
const coverFile = (cover?: ImageMetadata) => {
  if (!cover) return undefined;
  const file = (cover as ImageMetadata & { fsPath?: string }).fsPath;
  if (!file) throw new Error(`No file path on cover ${cover.src}; Astro may have renamed fsPath.`);
  return file;
};

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog");
  return [
    { params: { page: "index" }, props: { heading: "Dmitrii Kopenkin", line: "Product engineer in Andorra. Open to remote roles." } },
    { params: { page: "blog" }, props: { heading: "Blog", line: "Notes on building software" } },
    { params: { page: "wall" }, props: { heading: "Wall", line: "Stills, sounds and links" } },
    ...posts.map((post) => ({
      params: { page: `blog/${post.id}` },
      props: { heading: post.data.title, line: readingTime(post.body), cover: coverFile(post.data.cover) },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await card(props.heading, props.line, props.cover)), { headers: { "Content-Type": "image/png" } });
