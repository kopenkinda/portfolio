// The 1200 × 630 share card for a page (og:image), rendered at build time: the dots valley across
// the top, fading into ink, and the page's heading and one line under it. Served for every page by
// src/pages/og/[...page].png.ts; Layout points og:image at it.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import satori from "satori";
import sharp from "sharp";
import { grid } from "../dots/grid";

const WIDTH = 1200;
const HEIGHT = 630;
const VALLEY = 430; // how far down the valley reaches before it has faded out
// The dark palette from global.css: cards are shared out of context, so they don't follow a theme.
const INK = "#0a0a0a";
const PAPER = "#e8e8e5";
const ASH = "#8c8c88";

// From the project root, not this file: the build bundles this module into dist/, away from the fonts.
const font = (file: string) => readFileSync(resolve("src/components/og", file));
const fonts = [
  { name: "Mona Sans", data: font("mona-sans-500.ttf"), weight: 500 as const },
  { name: "Literata", data: font("literata-400.ttf"), weight: 400 as const },
];

/** The valley as DotsScene draws it once settled, in its finished colours: one square per dot,
    kept where the dot's density beats the same ordered dither, cropped to the card's width. */
const valley = await (async () => {
  const CELL = 5;
  const GAP = 1;
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
  const { data, info } = await sharp(grid).raw().toBuffer({ resolveWithObject: true });
  const width = info.width * CELL;
  const pixels = Buffer.alloc(width * info.height * CELL * 4);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      if (data[i + 3] / 255 <= BAYER[(y % 4) * 4 + (x % 4)]) continue;
      for (let dy = 0; dy < CELL - GAP; dy++) {
        for (let dx = 0; dx < CELL - GAP; dx++) {
          const o = ((y * CELL + dy) * width + x * CELL + dx) * 4;
          pixels.set([data[i], data[i + 1], data[i + 2], 255], o);
        }
      }
    }
  }
  return sharp(pixels, { raw: { width, height: info.height * CELL, channels: 4 } })
    .extract({ left: Math.round((width - WIDTH) / 2), top: 0, width: WIDTH, height: VALLEY })
    .png()
    .toBuffer();
})();

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export async function card(heading: string, line: string) {
  const text = await satori(
    el("div", { display: "flex", width: WIDTH, height: HEIGHT }, [
      // The valley fades out behind the text, so a two-line heading can rise into it and stay legible.
      el("div", { position: "absolute", left: 0, top: VALLEY - 200, width: WIDTH, height: 200, backgroundImage: `linear-gradient(to bottom, transparent, ${INK})` }),
      el("div", { position: "absolute", left: 72, right: 72, bottom: 60, display: "flex", flexDirection: "column" }, [
        el("div", { fontFamily: "Mona Sans", fontSize: 68, lineHeight: 1.1, letterSpacing: "-0.02em", color: PAPER }, heading),
        el("div", { display: "flex", justifyContent: "space-between", marginTop: 20, fontFamily: "Literata", fontSize: 28, color: ASH }, [
          el("span", {}, line),
          el("span", {}, "kopenkin.tech"),
        ]),
      ]),
    ]),
    { width: WIDTH, height: HEIGHT, fonts },
  );
  return sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: INK } })
    .composite([{ input: valley, top: 0, left: 0 }, { input: Buffer.from(text) }])
    .png()
    .toBuffer();
}
