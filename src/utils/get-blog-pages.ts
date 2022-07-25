import { readdir } from "fs/promises";
import { join } from "path";
import getPostMetadata from "./get-post-metadata";

export default async function getBlogPages() {
  const location = join(".", "_posts");
  const posts = (await readdir(location)).filter((file) =>
    file.endsWith(".md")
  );
  const parsed = await Promise.all(
    posts.map((post) => getPostMetadata(join(location, post)))
  );
  return parsed.filter((post) => post.draft !== undefined && !post.draft);
}
