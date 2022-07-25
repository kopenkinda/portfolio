import { readFile } from "fs/promises";
import { join, parse } from "path";
import matter from "gray-matter";
import getReadingTime from "reading-time";

export interface PostMetadata {
  title: string;
  description: string;
  thumbnail: string;
  keywords: string[];
  body: string;
  slug: string;
  file: string;
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
  const readTime = getReadingTime(content).minutes;

  return {
    ...data,
    date: new Date(data.date),
    slug: parse(path).base.slice(0, ".md".length * -1),
    file: join(process.cwd(), path),
    readTime: readTime > 1 ? Math.ceil(readTime) : 1,
    body: content,
  } as PostMetadata;
}
