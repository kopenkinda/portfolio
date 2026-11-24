// Shared geometry for the Escaldes-Engordany scene on the home page: the real streets, river,
// buildings and parks around Caldea, from OpenStreetMap (map.json, made by build-map.mjs). The
// painted base (src/pages/andorra.svg.ts) and the moving layer (AndorraScene.astro) both draw from
// it, so cars stay on the streets and ripples stay on the river.
//
// The scene is 1200 × 500 units (0.75 m each), north up, light from the top left.
import data from "./map.json";

export const WIDTH = 1200;
export const HEIGHT = 500;

export type Point = [number, number];
type Road = { pts: Point[]; kind: string; name?: string; oneway: boolean; bridge: boolean };
type Walk = { pts: Point[]; name?: string };

export const map = data as unknown as {
  buildings: { pts: Point[]; levels?: number }[];
  water: Point[][];
  rivers: Point[][];
  roads: Road[];
  walks: Walk[];
  plazas: Point[][];
  green: Point[][];
  wild: Point[][];
  pitches: { pts: Point[]; sport: string }[];
  parking: Point[][];
  caldea: { outer: Point[][]; inner: Point[][] };
};

export const toPath = (points: Point[], closed = false) =>
  `M${points.map(([x, y]) => `${x} ${y}`).join("L")}${closed ? "Z" : ""}`;

const centroid = (points: Point[]): Point => {
  const [x, y] = points.reduce(([a, b], [c, d]) => [a + c, b + d], [0, 0]);
  return [x / points.length, y / points.length];
};

/** Caldea's footprint centre, and where its two landmarks sit: the lagoon dome in the
    north-west wing of the building, the spire in the middle of the south-east wing. */
export const caldeaCentre = centroid(map.caldea.outer[0]);
export const caldeaDome: Point = [caldeaCentre[0] - 61, caldeaCentre[1] - 37];
export const caldeaSpire: Point = [caldeaCentre[0] + 44, caldeaCentre[1] + 12];

/** The spire's diamond footprint from above, turned to the building's axis: the painting's facets,
    and where a click counts as on the spire. */
const spireAngle = (33 * Math.PI) / 180;
const along: Point = [Math.cos(spireAngle), Math.sin(spireAngle)];
const across: Point = [-along[1], along[0]];
export const caldeaSpireBase: Point[] = [
  [caldeaSpire[0] - along[0] * 46, caldeaSpire[1] - along[1] * 46],
  [caldeaSpire[0] - across[0] * 22, caldeaSpire[1] - across[1] * 22],
  [caldeaSpire[0] + along[0] * 46, caldeaSpire[1] + along[1] * 46],
  [caldeaSpire[0] + across[0] * 22, caldeaSpire[1] + across[1] * 22],
];

/**
 * Streets joined into continuous routes (OpenStreetMap splits a street into many pieces), for
 * traffic and walkers to follow. Only routes long enough to be worth moving along are kept.
 */
function chain<T extends { pts: Point[]; name?: string }>(ways: T[], minLength: number, directed: (w: T) => boolean) {
  const same = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.5;
  const groups = new Map<string, T[]>();
  for (const w of ways) {
    if (!w.name) continue;
    groups.set(w.name, [...(groups.get(w.name) ?? []), w]);
  }
  const routes: { pts: Point[]; name: string; oneway: boolean }[] = [];
  for (const [name, list] of groups) {
    const pieces = list.map((w) => ({ pts: [...w.pts], oneway: directed(w) }));
    while (pieces.length) {
      const route = pieces.shift()!;
      let grew = true;
      while (grew) {
        grew = false;
        for (let i = 0; i < pieces.length; i++) {
          const p = pieces[i];
          if (p.oneway !== route.oneway) continue;
          if (same(route.pts.at(-1)!, p.pts[0])) route.pts.push(...p.pts.slice(1));
          else if (same(p.pts.at(-1)!, route.pts[0])) route.pts.unshift(...p.pts.slice(0, -1));
          else if (!route.oneway && same(route.pts.at(-1)!, p.pts.at(-1)!)) route.pts.push(...p.pts.reverse().slice(1));
          else if (!route.oneway && same(route.pts[0], p.pts[0])) route.pts.unshift(...p.pts.reverse().slice(0, -1));
          else continue;
          pieces.splice(i, 1);
          grew = true;
          break;
        }
      }
      const length = route.pts.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - route.pts[i][0], p[1] - route.pts[i][1]), 0);
      if (length >= minLength) routes.push({ pts: route.pts, name, oneway: route.oneway });
    }
  }
  return routes;
}

export const trafficRoutes = chain(
  map.roads.filter((r) => ["primary", "secondary", "tertiary"].includes(r.kind)),
  140,
  (r) => r.oneway,
);
export const walkRoutes = chain(map.walks, 90, () => false);

/** Seeded random numbers, so the painting comes out the same on every build. */
export function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
