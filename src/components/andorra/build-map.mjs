// Builds map.json for the home page scene from OpenStreetMap: the real streets, river, buildings
// and parks of Escaldes-Engordany around Caldea. Run it by hand when the map should be refreshed:
//
//   node src/components/andorra/build-map.mjs
//
// Map data © OpenStreetMap contributors, available under the Open Database Licence (see README).
import { writeFileSync } from "node:fs";

// The scene is 1200 × 500 units, north up, centred near Prat del Roure, 0.75 m per unit.
const WIDTH = 1200;
const HEIGHT = 500;
const CENTER = { lat: 42.51086, lon: 1.53572 };
const METRES_PER_UNIT = 0.75;
const BBOX = "42.5060,1.5280,42.5150,1.5450";

const kx = Math.cos((CENTER.lat * Math.PI) / 180) * 111320;
const ky = 110540;
const project = ({ lat, lon }) => [
  round(((lon - CENTER.lon) * kx) / METRES_PER_UNIT + WIDTH / 2),
  round((-(lat - CENTER.lat) * ky) / METRES_PER_UNIT + HEIGHT / 2),
];
const round = (n) => Math.round(n * 10) / 10;

const query = `[out:json][timeout:60];(
  way["building"](${BBOX}); relation["building"](${BBOX});
  way["highway"](${BBOX});
  way["natural"="water"](${BBOX}); relation["natural"="water"](${BBOX});
  way["waterway"="river"](${BBOX});
  way["leisure"](${BBOX}); way["landuse"](${BBOX}); way["natural"~"wood|heath|scrub|tree_row"](${BBOX});
  way["amenity"="parking"](${BBOX});
);out geom;`;

const response = await fetch("https://overpass-api.de/api/interpreter", {
  method: "POST",
  headers: { "User-Agent": "kopenkin-portfolio/1.0", Accept: "application/json" },
  body: new URLSearchParams({ data: query }),
});
const { elements } = await response.json();

// Keep what's in view, with a margin so shapes run off the edges cleanly.
const MARGIN = 80;
const inView = (points) =>
  points.some(([x, y]) => x > -MARGIN && x < WIDTH + MARGIN && y > -MARGIN && y < HEIGHT + MARGIN);

/** Douglas-Peucker: drops points that don't change the shape by more than `tolerance` units. */
function simplify(points, tolerance = 0.6) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points.at(-1)];
  let index = 0;
  let max = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    // A closed ring starts and ends at the same point: measure from that point instead.
    const d = len ? Math.abs((b[0] - a[0]) * (a[1] - y) - (a[0] - x) * (b[1] - a[1])) / len : Math.hypot(x - a[0], y - a[1]);
    if (d > max) [index, max] = [i, d];
  }
  if (max <= tolerance) return [a, b];
  return [...simplify(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplify(points.slice(index), tolerance)];
}

/** Joins a relation's member ways into closed rings. */
function rings(members, role) {
  const pieces = members.filter((m) => m.role === role && m.geometry).map((m) => m.geometry.map(project));
  const out = [];
  while (pieces.length) {
    let ring = pieces.shift();
    let joined = true;
    while (joined && (ring[0][0] !== ring.at(-1)[0] || ring[0][1] !== ring.at(-1)[1])) {
      joined = false;
      for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i];
        const same = (u, v) => u[0] === v[0] && u[1] === v[1];
        if (same(ring.at(-1), p[0])) ring = [...ring, ...p.slice(1)];
        else if (same(ring.at(-1), p.at(-1))) ring = [...ring, ...p.reverse().slice(1)];
        else continue;
        pieces.splice(i, 1);
        joined = true;
        break;
      }
    }
    out.push(ring);
  }
  return out;
}

const green = new Set(["park", "garden", "grass", "meadow", "dog_park", "playground", "village_green", "recreation_ground"]);
const wild = new Set(["wood", "forest", "heath", "scrub", "orchard", "farmland"]);
const roadKinds = new Set(["primary", "primary_link", "secondary", "secondary_link", "tertiary", "residential", "living_street", "unclassified", "service"]);
const walkKinds = new Set(["footway", "pedestrian", "path", "steps", "cycleway"]);

const map = { buildings: [], water: [], rivers: [], roads: [], walks: [], plazas: [], green: [], wild: [], pitches: [], parking: [], caldea: null };

for (const e of elements) {
  const t = e.tags ?? {};
  if (e.type === "relation") {
    const outer = rings(e.members, "outer").map((r) => simplify(r));
    if (!outer.some(inView)) continue;
    const inner = rings(e.members, "inner").map((r) => simplify(r));
    if (t.name === "Caldea") map.caldea = { outer, inner };
    else if (t.building) map.buildings.push(...outer.map((pts) => ({ pts, levels: Number(t["building:levels"]) || undefined })));
    else if (t.natural === "water") map.water.push(...outer);
    continue;
  }
  if (!e.geometry) continue;
  const pts = simplify(e.geometry.map(project));
  if (!inView(pts)) continue;
  const underground = Number(t.layer) < 0 || t.tunnel;

  if (t.building) map.buildings.push({ pts, levels: Number(t["building:levels"]) || undefined });
  else if (t.natural === "water") map.water.push(pts);
  else if (t.waterway === "river" && !underground) map.rivers.push(pts);
  else if (t.highway && t.area === "yes") map.plazas.push(pts);
  else if (roadKinds.has(t.highway) && !underground)
    map.roads.push({ pts, kind: t.highway.replace("_link", ""), name: t.name, oneway: t.oneway === "yes", bridge: t.bridge === "yes" });
  else if (walkKinds.has(t.highway) && !underground) map.walks.push({ pts, name: t.name });
  else if (t.leisure === "pitch" || t.leisure === "swimming_pool") map.pitches.push({ pts, sport: t.sport ?? t.leisure });
  else if (t.amenity === "parking" && !underground) map.parking.push(pts);
  else if (green.has(t.leisure) || green.has(t.landuse)) map.green.push(pts);
  else if (wild.has(t.landuse) || wild.has(t.natural)) map.wild.push(pts);
}

const out = new URL("./map.json", import.meta.url);
writeFileSync(out, JSON.stringify(map));
console.log(Object.fromEntries(Object.entries(map).map(([k, v]) => [k, Array.isArray(v) ? v.length : v ? "yes" : "no"])));
