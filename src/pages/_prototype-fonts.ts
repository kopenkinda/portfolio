// PROTOTYPE - font pairing comparison for the home page. Dev only, delete once a pair is picked.
// Five heading/body pairings on the existing `/` route, switchable via `?variant=`.
// Each variant overrides the --font-display / --font-sans tokens that Tailwind reads.
import { mountPrototypeSwitcher } from "./_prototype-switcher";

const pairs = [
  { key: "A", heading: "Encode Sans", body: "Outfit" },
  { key: "B", heading: "Brygada 1918", body: "Albert Sans" },
  { key: "C", heading: "Ibarra Real Nova", body: "Literata", italicHeadings: true },
  { key: "D", heading: "Schibsted Grotesk", body: "Atkinson Hyperlegible Next" },
  { key: "E", heading: "Mona Sans", body: "Source Serif 4" },
];

// A is already served by Astro's fonts API; the rest come straight from Google Fonts.
const families = [
  "Brygada+1918:wght@400..700",
  "Albert+Sans:wght@300..700",
  "Ibarra+Real+Nova:ital,wght@0,400..700;1,400..700",
  "Literata:opsz,wght@7..72,300..700",
  "Schibsted+Grotesk:wght@400..700",
  "Atkinson+Hyperlegible+Next:wght@300..700",
  "Mona+Sans:wght@300..700",
  "Source+Serif+4:opsz,wght@8..60,300..700",
];
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
document.head.append(link);

const style = document.createElement("style");
style.textContent = pairs
  .slice(1)
  .map(
    (p) => `
html[data-variant="${p.key}"] { --font-display: "${p.heading}", serif; --font-sans: "${p.body}", sans-serif; }
${p.italicHeadings ? `html[data-variant="${p.key}"] :is(h1, h2) { font-style: italic; }` : ""}`,
  )
  .join("");
document.head.append(style);

const apply = () => {
  const key = new URLSearchParams(location.search).get("variant") ?? "A";
  document.documentElement.dataset.variant = key;
  const pair = pairs.find((p) => p.key === key);
  if (pair) console.info(`[prototype] ${key}: ${pair.heading} / ${pair.body}`);
};
addEventListener("popstate", apply);
apply();

mountPrototypeSwitcher({
  variants: pairs.map((p) => ({ key: p.key, name: `${p.heading} / ${p.body}` })),
});
