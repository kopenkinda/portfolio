import { useMemo, useState } from "react";
import {
  IconAlignLeft,
  IconCopy,
  IconCopyOff,
  IconLineDashed,
} from "@tabler/icons-react";
import useCopy from "~/hooks/use-copy";

const map: Record<string, string | undefined> = {
  а: "А́нна",
  б: "Бори́с",
  в: "Васи́лий",
  г: "Григо́рий",
  д: "Дми́трий",
  е: "Еле́на",
  ё: "Ёлка",
  ж: "Жук",
  з: "Зо́я",
  и: "Ива́н",
  й: "Йот",
  к: "Константи́н",
  л: "Леони́д",
  м: "Михаи́л",
  н: "Никола́й",
  о: "О́льга",
  п: "Па́вел",
  р: "Рома́н",
  с: "Семён",
  т: "Татья́на",
  у: "Улья́на",
  ф: "Фёдор",
  х: "Харито́н",
  ц: "Центр",
  ч: "Челове́к",
  ш: "Шу́ра",
  щ: "Щу́ка",
  ъ: "Твёрдый знак",
  ы: "Еры́",
  ь: "Мягкий знак",
  э: "Э́хо",
  ю: "Ю́рий",
  я: "Я́ков",
  a: "Álfa",
  b: "Brávo",
  c: "Chárlie",
  d: "Délta",
  e: "Écho",
  f: "Fóxtrot",
  g: "Gólf",
  h: "Hotél",
  i: "Índia",
  j: "Júliet",
  k: "Kílo",
  l: "Líma",
  m: "Mike",
  n: "Novémber",
  o: "Óscar",
  p: "Papá",
  q: "Quebéc",
  r: "Rómeo",
  s: "Siérra",
  t: "Tángo",
  u: "Úniform",
  v: "Víctor",
  w: "Whískey",
  x: "X-Ray",
  y: "Yánkee",
  z: "Zúlu",
};

function buzzer(input: string): string {
  return input
    .toLocaleLowerCase()
    .split("")
    .map((item) => map[item] ?? item);
}

export default function Buzzer() {
  const [value, setValue] = useState("");
  const [inline, setInline] = useState(false);
  const result = useMemo(() => buzzer(value), [value]);
  const [copied, copy, setCopied] = useCopy(result.join(inline ? " " : "\n"));
  return (
    <div className="flex w-full flex-col">
      <div className="mb-2 flex gap-2">
        <input
          type="text"
          className="w-full rounded-md border border-neutral-200 p-4 dark:border-neutral-700 dark:bg-neutral-800"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Put your text here"
        />
        <div className="flex rounded-md border border-neutral-200 dark:border-neutral-700">
          <button
            className={`border-r border-neutral-200 px-3 transition-all dark:border-neutral-700 ${
              inline ? "bg-neutral-200 dark:bg-neutral-800" : ""
            }`}
            onClick={() => setInline(true)}
          >
            <IconLineDashed stroke={1} size={18} />
          </button>
          <button
            className={`px-3 transition-all ${
              !inline ? "bg-neutral-200 dark:bg-neutral-800" : ""
            }`}
            onClick={() => setInline(false)}
          >
            <IconAlignLeft stroke={1} size={18} />
          </button>
        </div>
      </div>
      <pre className="relative w-full whitespace-break-spaces rounded-md border border-neutral-200 p-4 pr-8 font-mono text-sm dark:border-neutral-700">
        {result.length > 0 ? (
          <button
            onClick={() => {
              copy();
              setTimeout(() => {
                setCopied(false);
              }, 1000);
            }}
            disabled={copied}
            className="absolute right-0 top-0 rounded-bl-md border border-r-0 border-t-0 border-neutral-200 p-2 transition-all disabled:cursor-not-allowed dark:border-neutral-700 disabled:dark:bg-neutral-800"
          >
            {copied ? (
              <IconCopyOff stroke={1} size={18} />
            ) : (
              <IconCopy stroke={1} size={18} />
            )}
          </button>
        ) : null}
        {result.length === 0 ? "The result will be here" : null}
        {result.map((item, index) => (
          <span
            key={index}
            className={`${
              inline ? "inline-block" : "block"
            } mr-[1ch] whitespace-nowrap`}
          >
            {item === " " ? <>&nbsp;</> : null}
            <span className="text-lg font-bold text-green-600">{item[0]}</span>
            {item.slice(1)}
          </span>
        ))}
      </pre>
    </div>
  );
}
