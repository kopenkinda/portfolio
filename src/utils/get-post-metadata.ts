import { readFile } from "fs/promises";
import matter from "gray-matter";
import getReadingTime from "./get-reading-time";

export interface PostMetadata {
  title: string;
  description: string;
  thumbnail: string;
  keywords: string[];
  slug: string;
  readTime: number;
  date: Date;
  draft?: boolean;
}

export default async function getPostMetadata(path: string) {
  const contents = await readFile(path);
  const { data, content } = matter(contents.toString());
  switch (true) {
    case data.title === undefined || typeof data.title !== "string":
    case data.description === undefined || typeof data.description !== "string":
    case data.thumbnail === undefined || typeof data.thumbnail !== "string":
    case data.keywords === undefined || !Array.isArray(data.keywords):
    case data.date === undefined ||
      typeof data.date !== "string" ||
      Number.isNaN(new Date(data.date).valueOf()): {
      throw new Error(`Invalid metadata in ${path}`);
    }
  }

  return {
    ...data,
    date: new Date(data.date),
    slug: path.slice("/src/pages".length - 1, ".md".length * -1),
    readTime: getReadingTime(content),
  } as PostMetadata;
}
