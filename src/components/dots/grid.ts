// Turns photo.jpg into the data behind DotsScene.astro, at build time: a small PNG with one pixel
// per dot. Its alpha is how densely the dots show there. Its colour is the dot's finished colour:
// the photo's hue, muted, at a lightness the scene also uses for the dot before it has colour.
// Alpha 0 marks the sky, where the scene draws its stars instead. Served by src/pages/dots.png.ts.
//
// The land is split into layers (the far ranges, each mountain, the near slopes), and every layer
// is shaded as its own shape: bright and solid along its ridge, thinning and dimming toward its
// base, and fainter the farther away it is. That is what makes the ridges read as overlapping
// silhouettes instead of one field of dots. The photo's own detail (tone and edges) sits on top.
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const PHOTO = fileURLToPath(new URL("./photo.jpg", import.meta.url));
const ROWS = 110;
const KEEP = 0.8; // how much of the photo, from the top, to use: the foreground below is too busy as dots
const FINE = 4; // edges are measured at this many pixels per dot, where a silhouette is still a sharp line

// The layers, far to near, each marked by a few points inside it (pixels in photo.jpg). They are
// placed by hand because colour can't find them: the cloud shadows on the near mountains are as
// blue as the far ranges. The points only say which mountain is which; the outlines come from the
// photo (see the watershed below). A layer needs a second point where a strong edge inside it (a
// crease, a hard shadow) would otherwise cut it in two. Place them again when the photo changes.
const LAYERS = [
  [[1490, 155], [1840, 190]], // the far ranges behind everything
  [[1160, 220]], // the dark blue mountain with the snowy peak
  [[1590, 260], [1243, 381], [1150, 392]], // the olive mountain with the zigzag track, and its shadowed foot
  [[300, 220], [150, 315]], // the big mountain on the left
  [[1200, 520]], // the green hill across the right
  [[100, 370], [400, 530]], // the slope on the left
  [[60, 520], [700, 800]], // the foreground: the near spur, roads and town
];

const luminance = (r: number, g: number, b: number) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
/** Clouds and haze: grey, or very light. Mountains, even the snowy and distant ones, have more colour. */
const skyLike = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b, 1);
  return (max - Math.min(r, g, b)) / max < 0.2 || luminance(r, g, b) > 0.72;
};

/** A photo colour as a dot's colour, in OKLCH: the photo's hue at the given lightness, with the
    chroma cut so the colours read as muted, not neon. */
const tint = (r: number, g: number, b: number, lightness: number) => {
  const lin = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [lr, lg, lb] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.min(0.085, Math.hypot(A, B) * 0.6);
  const H = Math.atan2(B, A);
  const [a, bb] = [C * Math.cos(H), C * Math.sin(H)];
  const l2 = (lightness + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const m2 = (lightness - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const s2 = (lightness - 0.0894841775 * a - 1.291485548 * bb) ** 3;
  const out = (v: number) => 255 * Math.min(1, Math.max(0, v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055));
  return [
    out(4.0767416621 * l2 - 3.3077115913 * m2 + 0.2309699292 * s2),
    out(-1.2684380046 * l2 + 2.6097574011 * m2 - 0.3413193965 * s2),
    out(-0.0041960863 * l2 - 0.7034186147 * m2 + 1.707614701 * s2),
  ];
};

async function build() {
  const { width = 0, height = 0 } = await sharp(PHOTO).metadata();
  const kept = Math.round(height * KEEP);
  const cols = Math.round((ROWS * width) / kept);
  const cells = cols * ROWS;
  const photo = () => sharp(PHOTO).extract({ left: 0, top: 0, width, height: kept });

  const color = await photo().removeAlpha().resize(cols, ROWS, { kernel: "lanczos3" }).raw().toBuffer();
  // Sky: scan each column of the grid down from the top until the ridge. At grid size the clouds'
  // darker patches average out, and a column only ends after a run of land, not one odd cell.
  const ridge = Array.from({ length: cols }, (_, x) => {
    let land = 0;
    let lastSky = -1;
    for (let y = 0; y < ROWS && land < 3; y++) {
      const i = (y * cols + x) * 3;
      if (skyLike(color[i], color[i + 1], color[i + 2])) [lastSky, land] = [y, 0];
      else land++;
    }
    return lastSky + 1;
  });
  // A median across neighbouring columns smooths the ridge: it drops thin spikes (poles, pylons)
  // that would poke into the night sky, and narrow dips where hazy far peaks read as sky.
  const sky = new Uint8Array(cells);
  for (let x = 0; x < cols; x++) {
    const near = ridge.slice(Math.max(0, x - 8), x + 9).sort((a, b) => a - b);
    const line = near[near.length >> 1];
    for (let y = 0; y < line; y++) sky[y * cols + x] = 1;
  }

  // Edges: the sharpest colour step inside each dot, measured on a finer copy of the photo. Sharp
  // is the point: a silhouette is a hard line, a cloud shadow's edge is soft and scores low. The
  // median drops grass and rock texture first.
  const [fineCols, fineRows] = [cols * FINE, ROWS * FINE];
  const fine = await photo().removeAlpha().median(5).resize(fineCols, fineRows).raw().toBuffer();
  const edge = new Uint8Array(cells);
  for (let y = 1; y < fineRows - 1; y++) {
    for (let x = 1; x < fineCols - 1; x++) {
      let step = 0;
      for (let c = 0; c < 3; c++) {
        const i = (y * fineCols + x) * 3 + c;
        step += (fine[i + 3] - fine[i - 3]) ** 2 + (fine[i + fineCols * 3] - fine[i - fineCols * 3]) ** 2;
      }
      const cell = Math.floor(y / FINE) * cols + Math.floor(x / FINE);
      edge[cell] = Math.max(edge[cell], Math.min(255, Math.sqrt(step)));
    }
  }

  // Layers: a seeded watershed. Every layer grows outward from its marked points, always into the
  // dot with the weakest edge next, so two layers meet on the strongest edge between them: the
  // silhouette. `queue[level]` holds the dots (and the layer reaching them) to fill at that level.
  const layer = new Int8Array(cells).fill(-1);
  const queue: number[][] = Array.from({ length: 256 }, () => []);
  const spread = (i: number, level: number) => {
    const x = i % cols;
    for (const j of [x > 0 ? i - 1 : -1, x < cols - 1 ? i + 1 : -1, i - cols, i + cols]) {
      if (j >= 0 && j < cells && !sky[j] && layer[j] < 0) queue[Math.max(level, edge[j])].push(j, layer[i]);
    }
  };
  LAYERS.forEach((points, k) => {
    for (const [x, y] of points) layer[Math.floor((y / kept) * ROWS) * cols + Math.floor((x / width) * cols)] = k;
  });
  for (let i = 0; i < cells; i++) if (layer[i] >= 0) spread(i, 0);
  for (let level = 0; level < 256; level++) {
    const waiting = queue[level];
    for (let p = 0; p < waiting.length; p += 2) {
      const i = waiting[p];
      if (layer[i] >= 0) continue;
      layer[i] = waiting[p + 1];
      spread(i, level);
    }
  }

  const tone = await photo().greyscale().clahe({ width: 60, height: 60, maxSlope: 4 }).resize(cols, ROWS, { kernel: "lanczos3" }).extractChannel(0).raw().toBuffer();

  const out = Buffer.alloc(cells * 4);
  for (let x = 0; x < cols; x++) {
    let top = 0; // where the layer this column is passing through starts: its ridge
    let base = 0; // and where it ends
    for (let y = 0; y < ROWS; y++) {
      const i = y * cols + x;
      if (sky[i]) continue; // alpha 0: sky
      if (y === 0 || sky[i - cols] || layer[i - cols] !== layer[i]) {
        top = base = y;
        while (base + 1 < ROWS && layer[i + (base + 1 - y) * cols] === layer[i]) base++;
      }
      // The layer's own shape. Each nearer ridge is a bright line over the dim base of the layer
      // behind it, which is what separates the silhouettes.
      const below = y - top;
      const line = Math.exp(-below / 1.5); // the ridge itself: solid and bright, a dot or two thick
      const body = 1 - smooth(below / (base - top + 1)); // 1 at the ridge, falling to 0 at the layer's base
      const haze = 1 - 0.3 * (1 - layer[i] / (LAYERS.length - 1)); // farther layers are sparser and dimmer
      // The photo's own detail: its light and shadow (tone, stretched to the range the land uses),
      // and edges so roads, tracks and snow come through.
      const lit = smooth((tone[i] / 255 - 0.28) / 0.42);
      const detail = Math.min(1, lit * 0.8 + (edge[i] / 255) * 2);
      const density = Math.min(1, line * 0.9 + (0.2 + 0.8 * detail) * (0.55 + 0.45 * body) * haze);
      const light = Math.min(1, line * 0.5 + (0.15 + 0.35 * body + 0.45 * lit) * haze);
      // Lightness stays in the upper half, so even the dimmest dot shows on the dark page.
      out.set(tint(color[i * 3], color[i * 3 + 1], color[i * 3 + 2], 0.48 + 0.5 * light), i * 4);
      // At least 1, so even the faintest land isn't taken for sky.
      out[i * 4 + 3] = Math.max(1, Math.round(density * 255));
    }
  }
  return sharp(out, { raw: { width: cols, height: ROWS, channels: 4 } }).png().toBuffer();
}

export const grid = await build();
/** Changes whenever the grid does; it goes in the image's address so a stale copy isn't used. */
export const gridVersion = createHash("sha256").update(grid).digest("hex").slice(0, 10);
