// The painted base of the Escaldes-Engordany scene on the home page, generated at build time from
// the real map (map.json) and served as a static image by src/pages/andorra.svg.ts, so the browser
// paints its watercolour filters once instead of on every animation frame. The moving parts live
// in AndorraScene.astro.
import { createHash } from "node:crypto";
import { caldeaDome, caldeaSpire, HEIGHT, map, random, toPath, WIDTH, type Point } from "./scene";

const rand = random(14);
const between = (a: number, b: number) => a + rand() * (b - a);
const pick = <T>(items: T[]) => items[Math.floor(rand() * items.length)];

// Light comes from the top left; shadows fall down-right.
const TO_LIGHT: Point = [-Math.SQRT1_2, -Math.SQRT1_2];
const SHADOW: Point = [Math.SQRT1_2, Math.SQRT1_2];
const shade = ([x, y]: Point) => x * TO_LIGHT[0] + y * TO_LIGHT[1];

const fmt = (n: number) => n.toFixed(1);
const poly = (points: Point[]) => points.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(" ");
const shift = (points: Point[], by: number): Point[] => points.map(([x, y]) => [x + SHADOW[0] * by, y + SHADOW[1] * by]);

/** A colour nudged lighter or darker by up to `amount`, so repeated shapes don't look stamped. */
const jitter = (hex: string, amount = 0.08) => {
  const k = 1 + between(-amount, amount);
  const channels = [1, 3, 5].map((i) => Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k)));
  return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};

/** Convex hull (monotone chain), for shadows cast by tall shapes. */
function hull(points: Point[]) {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Point, a: Point, b: Point) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: Point[]) => {
    const out: Point[] = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    return out.slice(0, -1);
  };
  return [...half(sorted), ...half([...sorted].reverse())];
}

function inside([x, y]: Point, ring: Point[]) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}
const bounds = (ring: Point[]) => {
  const xs = ring.map((p) => p[0]);
  const ys = ring.map((p) => p[1]);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};
function distanceToLine([x, y]: Point, line: Point[]) {
  let best = Infinity;
  for (let i = 1; i < line.length; i++) {
    const [ax, ay] = line[i - 1];
    const [bx, by] = line[i];
    const len = (bx - ax) ** 2 + (by - ay) ** 2 || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / len));
    best = Math.min(best, Math.hypot(x - (ax + t * (bx - ax)), y - (ay + t * (by - ay))));
  }
  return best;
}

const roadWidth: Record<string, number> = {
  primary: 17,
  secondary: 14,
  tertiary: 11,
  residential: 8,
  unclassified: 8,
  living_street: 7,
  service: 5,
};
const blocked = (p: Point) =>
  map.buildings.some((b) => inside(p, b.pts)) ||
  map.caldea.outer.some((r) => inside(p, r)) ||
  map.water.some((w) => inside(p, w)) ||
  map.pitches.some((w) => inside(p, w.pts)) ||
  map.roads.some((r) => distanceToLine(p, r.pts) < (roadWidth[r.kind] ?? 6) / 2 + 3);

// Ground: warm stone town ground, washed with greens and ochres.
const blotches = Array.from({ length: 110 }, () => {
  const fill = pick(["#cfc4a6", "#bfb894", "#d9cfb4", "#b6b98e", "#c7bd9c"]);
  return `<ellipse cx="${fmt(between(-50, WIDTH + 50))}" cy="${fmt(between(-50, HEIGHT + 50))}" rx="${fmt(between(40, 140))}" ry="${fmt(between(25, 80))}" fill="${fill}" opacity="${between(0.3, 0.6).toFixed(2)}"/>`;
}).join("");

// Trees: scattered through parks, gardens and the wooded slopes, and lining the river.
type Tree = { at: Point; r: number; pine: boolean };
const trees: Tree[] = [];
for (const [areas, spacing, pine] of [
  [map.wild, 11, true],
  [map.green, 17, false],
] as const) {
  for (const ring of areas) {
    const b = bounds(ring);
    for (let x = b.x0; x < b.x1; x += spacing) {
      for (let y = b.y0; y < b.y1; y += spacing) {
        const at: Point = [x + between(-4, 4), y + between(-4, 4)];
        if (at[0] < -20 || at[0] > WIDTH + 20 || at[1] < -20 || at[1] > HEIGHT + 20) continue;
        if (rand() < (pine ? 0.15 : 0.45) || !inside(at, ring) || blocked(at)) continue;
        trees.push({ at, r: pine ? between(5, 8) : between(6, 10), pine });
      }
    }
  }
}
for (const river of map.rivers) {
  for (let i = 1; i < river.length; i++) {
    const [ax, ay] = river[i - 1];
    const [bx, by] = river[i];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    const [nx, ny] = [-(by - ay) / len, (bx - ax) / len];
    for (let d = 0; d < len; d += 13) {
      for (const side of [-1, 1]) {
        const off = side * between(17, 22);
        const at: Point = [ax + ((bx - ax) * d) / len + nx * off, ay + ((by - ay) * d) / len + ny * off];
        if (rand() < 0.35 || blocked(at)) continue;
        trees.push({ at, r: between(5, 8), pine: false });
      }
    }
  }
}

const buildingShadows = map.buildings.map((b) => `<polygon points="${poly(shift(b.pts, Math.min(14, (b.levels ?? 5) * 1.7)))}"/>`).join("");
const roofColors = ["#6f7683", "#6f7683", "#5f6672", "#8d9097", "#d7cfbd", "#b9b3a6", "#7b7f86"];
const roofs = map.buildings.map((b) => `<polygon points="${poly(b.pts)}" fill="${jitter(pick(roofColors))}"/>`).join("");
const treeShadows = trees.map(({ at, r }) => `<circle cx="${fmt(at[0] + r * 0.7)}" cy="${fmt(at[1] + r * 0.7)}" r="${fmt(r)}"/>`).join("");
const treeCrowns = trees
  .map(({ at: [x, y], r, pine }) => {
    const base = jitter(pine ? pick(["#3e6a40", "#47744a", "#355f39"]) : pick(["#6d9a47", "#7aa651", "#62903f"]), 0.1);
    const light = pine ? "#5e8a52" : "#a6c66a";
    return (
      `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(r)}" fill="${base}"/>` +
      `<circle cx="${fmt(x - r * 0.3)}" cy="${fmt(y - r * 0.3)}" r="${fmt(r * 0.55)}" fill="${light}" opacity=".7"/>`
    );
  })
  .join("");

// Roads: a pale kerb, then asphalt; centre dashes on the main two-way streets.
const roadsByWidth = [...map.roads].sort((a, b) => (roadWidth[a.kind] ?? 6) - (roadWidth[b.kind] ?? 6));
const kerbs = roadsByWidth.map((r) => `<path d="${toPath(r.pts)}" stroke-width="${(roadWidth[r.kind] ?? 6) + 3}"/>`).join("");
const asphalt = roadsByWidth.map((r) => `<path d="${toPath(r.pts)}" stroke-width="${roadWidth[r.kind] ?? 6}"/>`).join("");
const dashes = map.roads
  .filter((r) => (r.kind === "primary" || r.kind === "secondary") && !r.oneway)
  .map((r) => `<path d="${toPath(r.pts)}"/>`)
  .join("");

// Caldea: the glass complex, the lagoon's faceted dome, and the spire. From above the spire is a
// glass diamond; its long shadow carries the silhouette.
const caldeaGlass = `<path d="${[...map.caldea.outer, ...map.caldea.inner].map((r) => toPath(r, true)).join("")}" fill="#9db9c6" fill-rule="evenodd"/>`;
const domeSides = 16;
const dome = Array.from({ length: domeSides }, (_, i) => {
  const a0 = (i / domeSides) * Math.PI * 2;
  const a1 = ((i + 1) / domeSides) * Math.PI * 2;
  const r = 30;
  const p0: Point = [caldeaDome[0] + Math.cos(a0) * r, caldeaDome[1] + Math.sin(a0) * r];
  const p1: Point = [caldeaDome[0] + Math.cos(a1) * r, caldeaDome[1] + Math.sin(a1) * r];
  const lit = shade([Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2)]);
  const fill = i % 2 ? (lit > 0 ? "#8fb2c4" : "#5d7f95") : lit > 0 ? "#a9c7d4" : "#6e91a6";
  return `<polygon points="${poly([p0, p1, caldeaDome])}" fill="${fill}"/>`;
}).join("");
const spireAngle = (33 * Math.PI) / 180;
const along: Point = [Math.cos(spireAngle), Math.sin(spireAngle)];
const across: Point = [-along[1], along[0]];
const spireBase: Point[] = [
  [caldeaSpire[0] - along[0] * 46, caldeaSpire[1] - along[1] * 46],
  [caldeaSpire[0] - across[0] * 22, caldeaSpire[1] - across[1] * 22],
  [caldeaSpire[0] + along[0] * 46, caldeaSpire[1] + along[1] * 46],
  [caldeaSpire[0] + across[0] * 22, caldeaSpire[1] + across[1] * 22],
];
const spireFacets = spireBase
  .map((corner, i) => {
    const next = spireBase[(i + 1) % 4];
    const mid: Point = [(corner[0] + next[0]) / 2 - caldeaSpire[0], (corner[1] + next[1]) / 2 - caldeaSpire[1]];
    const len = Math.hypot(...mid);
    const lit = shade([mid[0] / len, mid[1] / len]);
    const fill = lit > 0.5 ? "#f1f8fa" : lit > 0 ? "#bcd8e2" : lit > -0.5 ? "#7ea6ba" : "#55788d";
    return `<polygon points="${poly([corner, next, caldeaSpire])}" fill="${fill}"/>`;
  })
  .join("");
const spireEdges = spireBase.map((corner) => `<polyline points="${poly([corner, caldeaSpire])}"/>`).join("");
const spireShadow = `<polygon points="${poly(hull([...spireBase, [caldeaSpire[0] + SHADOW[0] * 170, caldeaSpire[1] + SHADOW[1] * 170]]))}"/>`;

const riffles = map.rivers
  .flatMap((river) =>
    river.slice(1).map((b, i) => {
      const a = river[i];
      const t = between(0.2, 0.8);
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const [dx, dy] = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
      const side = between(-6, 6);
      const p: Point = [a[0] + (b[0] - a[0]) * t - dy * side, a[1] + (b[1] - a[1]) * t + dx * side];
      return `<polyline points="${poly([p, [p[0] + dx * 9, p[1] + dy * 9]])}"/>`;
    }),
  )
  .join("");

export const painting = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">
<defs>
  <!-- Watercolour edges: a slight wobble, and pigment pooling darker at the rim. -->
  <filter id="wash" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="shape"/>
    <feMorphology in="shape" operator="erode" radius="1.4" result="inner"/>
    <feComposite in="shape" in2="inner" operator="out" result="rim"/>
    <feFlood flood-color="#2b2a1e" flood-opacity=".28"/>
    <feComposite in2="rim" operator="in" result="rimDark"/>
    <feMerge><feMergeNode in="shape"/><feMergeNode in="rimDark"/></feMerge>
  </filter>
  <filter id="bleed" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="9" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G"/>
    <feGaussianBlur stdDeviation="5"/>
  </filter>
  <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="5" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/>
    <feGaussianBlur stdDeviation="1.4"/>
  </filter>
  <!-- Pigment unevenness and paper grain, laid over everything. -->
  <filter id="pigment" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="4" seed="21"/>
    <feColorMatrix values="0 0 0 0 .32  0 0 0 0 .3  0 0 0 0 .2  1.1 0 0 0 -.42"/>
  </filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/>
    <feColorMatrix values="0 0 0 0 .25  0 0 0 0 .22  0 0 0 0 .18  .9 0 0 0 -.32"/>
  </filter>
  <radialGradient id="sun" cx=".2" cy=".1" r=".8">
    <stop offset="0" stop-color="#fff6dc" stop-opacity=".35"/>
    <stop offset="1" stop-color="#fff6dc" stop-opacity="0"/>
  </radialGradient>
</defs>

<rect width="${WIDTH}" height="${HEIGHT}" fill="#cbc2a6"/>
<g filter="url(#bleed)">${blotches}</g>

<g filter="url(#wash)">
  ${map.wild.map((r) => `<polygon points="${poly(r)}" fill="${jitter("#4f7a45", 0.1)}"/>`).join("")}
  ${map.green.map((r) => `<polygon points="${poly(r)}" fill="${jitter("#8fb35b", 0.08)}"/>`).join("")}
  ${map.parking.map((r) => `<polygon points="${poly(r)}" fill="${jitter("#a9a59b", 0.05)}"/>`).join("")}
  ${map.plazas.map((r) => `<polygon points="${poly(r)}" fill="${jitter("#ddd3bd", 0.04)}"/>`).join("")}
  ${map.pitches
    .map(({ pts, sport }) => {
      const fill = sport === "swimming_pool" ? "#7cc0d2" : sport === "skateboard" ? "#c9c5bb" : jitter("#6aa653", 0.05);
      return `<polygon points="${poly(pts)}" fill="${fill}" stroke="#f4f1e6" stroke-opacity=".8" stroke-width="1.4"/>`;
    })
    .join("")}
</g>

<g filter="url(#wash)">${map.water.map((r) => `<polygon points="${poly(r)}" fill="#4e8fa6"/>`).join("")}</g>
<g filter="url(#soft)" fill="none" stroke-linecap="round" stroke-linejoin="round">
  ${map.rivers.map((r) => `<path d="${toPath(r)}" stroke="#6aa8ba" stroke-width="10" stroke-opacity=".8"/>`).join("")}
  ${map.rivers.map((r) => `<path d="${toPath(r)}" stroke="#93c6cf" stroke-width="4" stroke-opacity=".5"/>`).join("")}
  <g stroke="#eef8f6" stroke-width="1.4" stroke-opacity=".55">${riffles}</g>
</g>

<g filter="url(#soft)" fill="none" stroke="#e3d7bb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".85">
  ${map.walks.map((w) => `<path d="${toPath(w.pts)}"/>`).join("")}
</g>
<g filter="url(#wash)" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <g stroke="#b3ada0">${kerbs}</g>
  <g stroke="#88867f">${asphalt}</g>
</g>
<g fill="none" stroke="#f1ebdc" stroke-width="1.2" stroke-dasharray="8 8" opacity=".7">${dashes}</g>

<g fill="#24331f" opacity=".3" filter="url(#soft)">${buildingShadows}${treeShadows}</g>
<g filter="url(#wash)">${roofs}</g>

<g filter="url(#wash)">${caldeaGlass}</g>
<g fill="#24331f" opacity=".3" filter="url(#soft)">${spireShadow}</g>
<g filter="url(#wash)">
  ${dome}
  ${spireFacets}
  <g stroke="#ffffff" stroke-opacity=".75" stroke-width="1.2" fill="none">${spireEdges}</g>
</g>

<g filter="url(#wash)">${treeCrowns}</g>

<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#sun)"/>
<rect width="${WIDTH}" height="${HEIGHT}" filter="url(#pigment)" style="mix-blend-mode:multiply" opacity=".8"/>
<rect width="${WIDTH}" height="${HEIGHT}" filter="url(#grain)" style="mix-blend-mode:multiply" opacity=".6"/>
</svg>`;

/** Changes whenever the painting does. It goes in the image's address, so a cached copy of an old
    painting is never shown under a newer moving layer. */
export const paintingVersion = createHash("sha256").update(painting).digest("hex").slice(0, 10);
