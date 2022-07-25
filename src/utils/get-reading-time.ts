export default function getReadingTime(content: string) {
  const wordCount = content?.replace(/[^\w ]/g, "")?.split(/\s+/)?.length;
  return Math.floor((wordCount ?? 0) / 228) + 1;
}
