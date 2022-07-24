export default function Keywords({ words }: { words: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {words.map((word, i) => (
        <span
          key={i}
          className="rounded-md bg-zinc-200 px-2 py-1 text-sm font-semibold text-zinc-500"
        >
          {word}
        </span>
      ))}
    </div>
  );
}
