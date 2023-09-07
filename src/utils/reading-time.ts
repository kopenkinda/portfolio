import rt from "reading-time";

export const readingTime = (content: string) => {
  const times = rt(content);
  const time = Math.floor(times.minutes) + 1;
  return time;
};
