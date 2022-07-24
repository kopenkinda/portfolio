import { readFile } from "fs/promises";
import matter from "gray-matter";

export interface BlogPageMetadata {
  title: string;
  description: string;
  thumbnail: string;
  keywords: string[];
  slug: string;
  draft?: boolean;
}

export default async function getFrontmatter(path: string) {
  const contents = await readFile(path);
  const data = matter(contents.toString()).data;
  switch (true) {
    case data.title === undefined || typeof data.title !== "string":
    case data.description === undefined || typeof data.description !== "string":
    case data.thumbnail === undefined || typeof data.thumbnail !== "string":
    case data.keywords === undefined || !Array.isArray(data.keywords):
      throw new Error(`Invalid frontmatter in ${path}`);
  }
  return {
    ...data,
    slug: path.slice("/src/pages".length - 1, ".md".length * -1),
  } as BlogPageMetadata;
}
