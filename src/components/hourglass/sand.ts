// The sand in the 3D hourglass: a grid of grains that fall, pile up and slide the way sand does.
// Each cell is a grain or empty. A grain moves only to a free cell that lies within 57° of straight
// down, so a slope steeper than about 35° slides and a gentler one stays put, whichever way the
// glass is turned. Nothing here knows about drawing; the shader reads `cells` as a 3D texture.

export const W = 0.4; // a bulb's widest radius; the glass is 2 tall
export const NECK = 0.03;
export const WIDEST = 0.58; // where along the bulb it's widest; past it, the end is rounded
export const NX = 48; // cells across (x and z)
export const NY = 120; // cells along the glass
export const STEP = 1 / 60; // seconds one step stands for

const CELL = 2 / NY;
const HALF = NY / 2;
const SLIDE = Math.cos((57 * Math.PI) / 180);
const REACH = 3; // cells a grain can move in one step
const FALL = 2.5; // how fast the stream falls, in glass heights per second
const LAVENDER = 255;
const CORAL = 0;

/** The bulb's inner radius at `u`, 0 at the neck and 1 at its far end. The shader has the same. */
export const profile = (u: number) =>
  u < WIDEST ? NECK + ((W - NECK) * (1 - Math.cos((Math.PI * u) / WIDEST))) / 2 : W * Math.sqrt(Math.max(0, 1 - ((u - WIDEST) / (1 - WIDEST)) ** 2));

/** Sand that takes `cycle` seconds to run from one bulb into the other. */
export function createSand(cycle: number) {
  const count = NX * NY * NX;
  // Two bytes per cell, as the texture wants them: 255 for a grain, then its colour.
  const cells = new Uint8Array(count * 2);
  const open = new Uint8Array(count); // inside the glass
  const stamp = new Uint8Array(count); // the step a grain last moved in, so it moves once per step
  const index = (x: number, y: number, z: number) => x + NX * (y + NY * z);
  const free = (i: number) => open[i] === 1 && cells[2 * i] === 0;
  const put = (i: number, tone: number) => ((cells[2 * i] = 255), (cells[2 * i + 1] = tone));
  /** The cell at a point in the glass's space, or -1 outside the grid. */
  const cellAt = (px: number, py: number, pz: number) => {
    const [x, y, z] = [Math.floor((px + W) / CELL), Math.floor((py + 1) / CELL), Math.floor((pz + W) / CELL)];
    return x < 0 || x >= NX || y < 0 || y >= NY || z < 0 || z >= NX ? -1 : index(x, y, z);
  };

  // The top bulb starts most of the way full, coral under lavender like the picture, with the dip
  // of sand already running; the bottom starts with a small coral heap.
  let total = 0;
  for (let z = 0; z < NX; z++)
    for (let y = 0; y < NY; y++)
      for (let x = 0; x < NX; x++) {
        const [px, py, pz] = [(x + 0.5) * CELL - W, (y + 0.5) * CELL - 1, (z + 0.5) * CELL - W];
        const r = Math.hypot(px, pz);
        // A little past the wall, so sand reaches the glass; the shader cuts it at the wall.
        if (r >= profile(Math.abs(py)) + 1.2 * CELL) continue;
        const i = index(x, y, z);
        open[i] = 1;
        const sand = py > 0 ? py < 0.62 - Math.max(0, 0.1 - r * 0.9) : py + 1 < 0.2 - r * 0.9;
        if (!sand) continue;
        put(i, py > 0.36 ? LAVENDER : CORAL);
        total++;
      }
  const rate = total / cycle; // grains through the neck per second

  const air: number[] = []; // the colours of the grains falling in the stream, oldest first
  const stream = { tail: 0, head: 0, tone: 0 }; // where the stream starts and ends below the neck
  let owed = 0;
  let tick = 0;
  let felt = [0, 0, 0]; // the gravity of the last step
  let settled = false; // nothing can move until gravity changes or the neck runs
  // The moves a grain can make this step, best first.
  const moves = { x: new Int8Array(342), y: new Int8Array(342), z: new Int8Array(342), to: new Int32Array(342), n: 0 };

  /** One step under gravity `g` (in the glass's space). `flow` is how freely the neck runs, 0 to 1.
      Returns whether anything moved. */
  const step = (g: number[], flow: number) => {
    // Through the neck. The stream falls from the neck along gravity until it meets sand or glass.
    let reach = 0;
    for (let s = CELL; s < 2.2 && free(cellAt(g[0] * s, g[1] * s, g[2] * s)); s += CELL / 2) reach = s;
    let flowing = false;
    let taken = 0; // grains that left the neck or landed this step
    if (flow > 0 && reach > 3 * CELL) {
      owed += rate * flow * STEP;
      flowing = owed < 1;
      // Take the grains nearest the neck in the bulb above it; the sand over them falls in after.
      for (let layer = 0; layer < 4 && owed >= 1; layer++) {
        const y = g[1] < 0 ? HALF + layer : HALF - 1 - layer;
        for (let z = NX / 2 - 4; z < NX / 2 + 4; z++)
          for (let x = NX / 2 - 4; x < NX / 2 + 4; x++) {
            const i = index(x, y, z);
            if (owed < 1 || !cells[2 * i]) continue;
            air.push(cells[2 * i + 1]);
            cells[2 * i] = cells[2 * i + 1] = 0;
            owed--;
            taken++;
            flowing = true;
          }
      }
      owed = Math.min(owed, 1); // no sand at the neck: nothing banks up
    }
    if (flowing) [stream.tail, stream.head] = [0, Math.min(reach, stream.head + FALL * STEP)];
    else stream.tail += FALL * STEP;
    stream.head = Math.min(stream.head, reach);
    const ended = stream.tail >= stream.head;
    // Once the stream reaches the heap, grains land as fast as they leave the neck; when the neck
    // stops, what's still in the air lands as the stream's end comes down.
    const landed = stream.head >= reach - CELL;
    let landing = ended ? air.length : !landed ? 0 : flowing ? taken : Math.ceil((air.length * FALL * STEP) / (stream.head - stream.tail));
    // They land around the stream's foot, wider when there's no room, and roll from there.
    for (let tries = 0; landing > 0 && tries < 400; tries++) {
      const spread = () => (Math.random() - 0.5) * CELL * (3 + tries * 0.05);
      const i = cellAt(g[0] * reach + spread(), g[1] * reach + spread(), g[2] * reach + spread());
      if (!free(i)) continue;
      put(i, air.shift()!);
      landing--;
      taken++;
    }
    if (ended) stream.tail = stream.head = 0;
    if (air.length) stream.tone = air[0] / 255;

    // Sand at rest stays at rest: nothing to look for until something changes.
    const ran = taken > 0;
    if (ran || g.some((v, i) => v !== felt[i])) settled = false;
    felt = g;
    if (settled) return false;

    // The moves: every cell up to three away that lies within the slide angle of straight down.
    // Reaching that far gives directions enough for heaps to come out round, not as pyramids.
    // They are tried most downward first, by a gravity nudged at random so ties don't lean one way.
    // A grain may pass over others on the way: that's how it rolls down a slope.
    const nudged = g.map((v) => v + (Math.random() - 0.5) * 0.08);
    const found: { x: number; y: number; z: number; rank: number }[] = [];
    for (let z = -REACH; z <= REACH; z++)
      for (let y = -REACH; y <= REACH; y++)
        for (let x = -REACH; x <= REACH; x++) {
          const length = Math.hypot(x, y, z);
          if (!length || (x * g[0] + y * g[1] + z * g[2]) / length < SLIDE) continue;
          // The longer of two moves the same way goes first, so sand in the air falls fast.
          found.push({ x, y, z, rank: (x * nudged[0] + y * nudged[1] + z * nudged[2]) / length + length * 1e-3 });
        }
    found.sort((a, b) => b.rank - a.rank);
    moves.n = found.length;
    found.forEach(({ x, y, z }, k) => {
      [moves.x[k], moves.y[k], moves.z[k]] = [x, y, z];
      moves.to[k] = index(x, y, z);
    });

    // Lowest grains first, so a whole column can drop in one step.
    let moved = false;
    tick = (tick % 255) + 1;
    const [dx, dy, dz] = [1, NX, NX * NY];
    for (let c = 0; c < NX; c++) {
      const z = g[2] > 0 ? NX - 1 - c : c;
      for (let b = 0; b < NY; b++) {
        const y = g[1] > 0 ? NY - 1 - b : b;
        for (let a = 0; a < NX; a++) {
          const x = g[0] > 0 ? NX - 1 - a : a;
          const i = index(x, y, z);
          if (!cells[2 * i] || stamp[i] === tick) continue;
          // Packed in on all sides: it can't move, and most grains are.
          if (!free(i - dx) && !free(i + dx) && !free(i - dy) && !free(i + dy) && !free(i - dz) && !free(i + dz)) continue;
          for (let k = 0; k < moves.n; k++) {
            const j = i + moves.to[k];
            if (!free(j)) continue;
            const nx = x + moves.x[k];
            const ny = y + moves.y[k];
            const nz = z + moves.z[k];
            if (nx < 0 || nx >= NX || ny < 0 || ny >= NY || nz < 0 || nz >= NX) continue;
            if (y < HALF !== ny < HALF) continue; // only the stream crosses the neck
            put(j, cells[2 * i + 1]);
            cells[2 * i] = cells[2 * i + 1] = 0;
            stamp[j] = tick;
            moved = true;
            break;
          }
        }
      }
    }
    settled = !moved;
    return moved || ran;
  };

  return { cells, stream, step };
}
