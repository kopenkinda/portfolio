/**
 * Terminal-style Open Graph image generator.
 *
 * Renders a 1200×630 PNG per blog post in the portfolio's paper/ink aesthetic
 * (JetBrains Mono, oklch-derived hex tokens, terminal affordances) using
 * satori (JSX → SVG) and @resvg/resvg-js (SVG → PNG).
 *
 * Design tokens mirror DESIGN.md / src/styles/global.css so an OG card reads
 * as an authentic slice of the site.
 */
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { BLOG, CONFIG, USER } from "../consts";

// oklch tokens (see global.css :root) → sRGB hex. Satori's CSS engine is
// happiest with plain hex, so we pre-compute once.
const C = {
  background: "#f5f2ec", // oklch(0.962 0.009 85)
  foreground: "#211d1a", // oklch(0.235 0.008 70)
  mutedForeground: "#79736d", // oklch(0.56 0.012 70)
  accent: "#a5492b", // oklch(0.52 0.13 38)
  border: "#cecac3", // oklch(0.84 0.011 78)
} as const;

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
const FONT = "JetBrains Mono";
// JetBrains Mono fixed advance width ≈ 0.6 em. Used for line-fit estimates.
const GLYPH = 0.6;

export interface OgImageInput {
  title: string;
  slug: string;
  pubDate: Date;
  reading?: string;
  tags: string[];
}

// --- fonts (lazy, cached) -------------------------------------------------
const require = createRequire(import.meta.url);
const fontFile = (weight: number) =>
  require.resolve(
    `@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${weight}-normal.woff`,
  );

const WEIGHTS = [400, 500, 700] as const;
type OgFont = {
  name: string;
  data: Buffer;
  weight: (typeof WEIGHTS)[number];
  style: "normal";
};
let fontsPromise: Promise<OgFont[]> | undefined;

function loadFonts(): Promise<OgFont[]> {
  if (!fontsPromise) {
    fontsPromise = Promise.all(
      WEIGHTS.map(async (weight) => ({
        name: FONT,
        data: await readFile(fontFile(weight)),
        weight,
        style: "normal" as const,
      })),
    );
  }
  return fontsPromise;
}

// --- element helper (plain VNode objects; no React) -----------------------
type VNode = {
  type: string;
  props: { style: Record<string, unknown>; children: unknown[] };
};

function h(
  type: string,
  style: Record<string, unknown>,
  ...children: unknown[]
): VNode {
  return { type, props: { style, children: children.flat() } };
}

// --- text fitting ---------------------------------------------------------
interface Fit {
  size: number;
  charsPerLine: number;
  cap: number;
}

/** Greedy word-wrap line count for `text` at `charsPerLine` columns. Satori
 * wraps on word boundaries, so a char-count estimate undercounts lines and
 * causes vertical overflow. This mirrors the actual wrap. */
function wrapLines(text: string, charsPerLine: number): number {
  const words = text.split(/\s+/).filter(Boolean);
  let lines = 0;
  let len = 0;
  for (const word of words) {
    if (len === 0) {
      len = word.length;
      lines = 1;
    } else if (len + 1 + word.length <= charsPerLine) {
      len += 1 + word.length;
    } else {
      lines += 1;
      len = word.length;
    }
  }
  return Math.max(1, lines);
}

/** Choose the font size (from `sizes`, descending) that yields the *fewest*
 * wrapped lines for `text` at `maxWidth`, tie-breaking toward the largest
 * size. `cap` is the character budget for ellipsizing, gated by `maxLines`. */
function fit(
  text: string,
  maxWidth: number,
  sizes: number[],
  maxLines: number,
): Fit {
  const norm = text.replace(/\s+/g, " ").trim();
  let best: { size: number; charsPerLine: number; lines: number } | undefined;
  for (const size of sizes) {
    const charsPerLine = Math.max(1, Math.floor(maxWidth / (size * GLYPH)));
    const lines = wrapLines(norm, charsPerLine);
    if (!best || lines < best.lines) best = { size, charsPerLine, lines };
  }
  const used = Math.min(maxLines, best!.lines);
  return {
    size: best!.size,
    charsPerLine: best!.charsPerLine,
    cap: best!.charsPerLine * used,
  };
}

function ellipsize(text: string, cap: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > cap ? `${clean.slice(0, cap - 1).trimEnd()}…` : clean;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// --- template -------------------------------------------------------------
const PAD = 72;
const INNER = OG_WIDTH - PAD * 2;

const sep = () => h("span", { color: C.border, marginHorizontal: 14 }, "·");

function header(rightLabel?: string): VNode {
  const left = h(
    "div",
    { display: "flex", flexDirection: "row" },
    h("span", { color: C.accent }, "~"),
    h("span", {}, `/${CONFIG.meta.siteLabel}`),
  );
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: INNER,
      paddingBottom: 22,
      borderBottom: `2px solid ${C.border}`,
      fontSize: 27,
      color: C.mutedForeground,
    },
    ...(rightLabel ? [left, h("span", {}, rightLabel)] : [left]),
  );
}

function promptRow(command: string): VNode {
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "row",
      fontSize: 27,
      color: C.mutedForeground,
    },
    h("span", { color: C.accent }, "$"),
    h("span", {}, ` ${command}`),
  );
}

function titleBlock(title: string): VNode {
  const lower = title.toLowerCase();
  const { size, cap } = fit(lower, INNER, [64, 56, 48], 3);
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      width: INNER,
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1.14,
      letterSpacing: -1,
      color: C.foreground,
    },
    ellipsize(lower, cap),
  );
}

function footer(children: unknown[]): VNode {
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      width: INNER,
      paddingTop: 22,
      borderTop: `2px solid ${C.border}`,
      fontSize: 27,
      color: C.mutedForeground,
    },
    ...children,
  );
}

function frame(...children: VNode[]): VNode {
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: OG_WIDTH,
      height: OG_HEIGHT,
      padding: PAD,
      backgroundColor: C.background,
      fontFamily: FONT,
    },
    ...children,
  );
}

// Per-post blog card: ~/kopenkin.tech · mind palace / $ cat … / title /
// date · reading · #tags.
function blogTree(input: OgImageInput): VNode {
  return frame(
    header(BLOG.title.toLowerCase()),
    h(
      "div",
      { display: "flex", flexDirection: "column", width: INNER, rowGap: 28 },
      promptRow(`cat ./mind-palace/${input.slug}.mdx`),
      titleBlock(input.title),
    ),
    metaLine(input),
  );
}

// Site card (homepage / fallback): ~/kopenkin.tech / $ whoami / name /
// role (tagline) / location · site.
function siteTree(): VNode {
  const emailHref =
    USER.socials.find((social) => social.label === "mail")?.href ?? "";
  const [mailProtocol, email] = emailHref.split(/(?<=:)/);

  return frame(
    header(),
    h(
      "div",
      { display: "flex", flexDirection: "column", width: INNER, rowGap: 22 },
      promptRow(CONFIG.ui.terminalCommand),
      titleBlock(USER.name),
      h(
        "div",
        {
          display: "flex",
          flexDirection: "row",
          fontSize: 33,
          color: C.mutedForeground,
        },
        USER.role,
      ),
    ),
    footer([
      h("span", {}, USER.location),
      sep(),
      h("span", {}, mailProtocol),
      h("span", { color: C.accent }, email),
    ]),
  );
}

function metaLine(input: OgImageInput): VNode {
  const children: unknown[] = [h("span", {}, fmtDate(input.pubDate))];
  if (input.reading) {
    children.push(sep(), h("span", {}, `${input.reading} read`));
  }
  for (const tag of input.tags.slice(0, 5)) {
    children.push(
      sep(),
      h(
        "span",
        { display: "flex", flexDirection: "row" },
        h("span", { color: C.accent }, "#"),
        h("span", {}, tag),
      ),
    );
  }
  return footer(children);
}

// --- public API -----------------------------------------------------------
async function renderPng(node: VNode): Promise<Uint8Array> {
  const fonts = await loadFonts();
  const svg = await satori(node, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });
  return new Resvg(svg, { background: C.background }).render().asPng();
}

export async function renderOgImagePng(
  input: OgImageInput,
): Promise<Uint8Array> {
  return renderPng(blogTree(input));
}

export async function renderSiteOgImagePng(): Promise<Uint8Array> {
  return renderPng(siteTree());
}
