// The 1200 × 630 share card for a page (og:image), rendered at build time: the dots valley (or a
// post's cover, in dots) across the top, fading into ink, and the page's heading and one line under
// it. Served for every page by
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

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

/** A small RGBA grid drawn as dots the way DotsScene draws them once settled: one square of `cell`
    pixels per grid pixel, in its rgb, kept where its alpha (the density) beats an ordered dither. */
function dots(data: Uint8Array, cols: number, rows: number, cell: number) {
  const width = cols * cell;
  const pixels = Buffer.alloc(width * rows * cell * 4);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      if (data[i + 3] / 255 <= BAYER[(y % 4) * 4 + (x % 4)]) continue;
      for (let dy = 0; dy < cell - 1; dy++) {
        for (let dx = 0; dx < cell - 1; dx++) {
          pixels.set([data[i], data[i + 1], data[i + 2], 255], ((y * cell + dy) * width + x * cell + dx) * 4);
        }
      }
    }
  }
  return sharp(pixels, { raw: { width, height: rows * cell, channels: 4 } });
}

/** The home page's valley, in its finished colours, cropped to the card's width. */
const valley = await (async () => {
  const CELL = 5;
  const { data, info } = await sharp(grid).raw().toBuffer({ resolveWithObject: true });
  return dots(data, info.width, info.height, CELL)
    .extract({ left: Math.round((info.width * CELL - WIDTH) / 2), top: 0, width: WIDTH, height: VALLEY })
    .png()
    .toBuffer();
})();

/** Any other picture (a post's `cover`) in dots, cropped to the valley's area. The valley's densities
    were shaped by hand; here brightness sets them, after stretching the contrast so walls and skies
    read as solid and shadows thin out. Each dot is lifted to a lightness that reads on ink, keeping
    its hue, and dark areas keep a few dots so a dark subject doesn't vanish into the background. */
async function picture(file: string) {
  const CELL = 4;
  const [cols, rows] = [WIDTH / CELL, Math.ceil(VALLEY / CELL)];
  const rgb = await sharp(file).removeAlpha().normalise().resize(cols, rows, { fit: "cover" }).raw().toBuffer();
  const data = new Uint8Array(cols * rows * 4);
  for (let i = 0; i < cols * rows; i++) {
    const [r, g, b] = rgb.subarray(i * 3, i * 3 + 3);
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const lift = Math.min(2.2, Math.max(1, 0.8 / Math.max(lum, 0.05)));
    const density = Math.min(1, Math.max(0, (lum - 0.04) / 0.76));
    data.set([r, g, b].map((c) => Math.min(255, c * lift)).concat(255 * density), i * 4);
  }
  return dots(data, cols, rows, CELL).extract({ left: 0, top: 0, width: WIDTH, height: VALLEY }).png().toBuffer();
}

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

/** A card over the valley, or over `cover` (an image file) when given. */
export async function card(heading: string, line: string, cover?: string) {
  const art = cover ? await picture(cover) : valley;
  const text = await satori(
    el("div", { display: "flex", width: WIDTH, height: HEIGHT }, [
      // The picture fades out behind the text, so a two-line heading can rise into it and stay legible.
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
    .composite([{ input: art, top: 0, left: 0 }, { input: Buffer.from(text) }])
    .png()
    .toBuffer();
}
