// The two liquids in the hourglass: lavender water, the heavier, and coral oil, which floats on it.
// The glass is full of them, a bulb's worth of each. In each bulb the water lies lowest along
// gravity, at the level its volume gives; the bulb on top lets its water down through the neck as
// blobs, and oil comes up the other way. Nothing here knows about drawing: the shader gets the
// levels and the blobs, and shapes the liquids from them.

// The glass's shape, measured off the picture: 2 tall inside, slim, each bulb a teardrop.
export const W = 0.375; // a bulb's widest radius
export const NECK = 0.024;
export const WIDEST = 0.66; // where along the bulb it's widest; past it, the end is rounded
export const FLANK = 1.35; // how the bulb opens from the neck: above 1, the neck stays a narrow tube a little way
export const BLOBS = 14; // blobs the shader can draw at once, counting the threads they leave behind

const EVERY = 1.2; // seconds between exchanges at the neck: a drop of water down and a bubble of oil
// up at once, since each takes the other's place; slow enough that each is seen and heard on its own
const HANG = 0.9; // seconds a blob swells at the neck before it lets go
const SPEED = 0.18; // how fast a free blob travels, in glass heights per second: slow, so they string out in a chain
const ASIDE = 0.01; // how far off the neck's middle each liquid passes, water one side and oil the other
const THREAD = 0.007; // how thick the thread is that feeds a hanging blob
const SNAP = 0.16; // seconds the broken thread takes to spring back

/** The bulb's inner radius at `u`, 0 at the neck and 1 at its far end: a short round waist, long
    flanks that swell to the widest point, then a rounded end. The shader's `wall` has the same
    shape, from the same numbers: change them together. */
const profile = (u: number) =>
  u < WIDEST ? Math.hypot(NECK, Math.sqrt(W * W - NECK * NECK) * Math.sin((Math.PI / 2) * (u / WIDEST)) ** FLANK) : W * Math.sqrt(Math.max(0, 1 - ((u - WIDEST) / (1 - WIDEST)) ** 2));

// Points spread through each bulb, to find how high a volume of water stands for any tilt.
const scatter = (sign: number) => {
  const points: number[][] = [];
  while (points.length < 2000) {
    const [x, y, z] = [(Math.random() * 2 - 1) * W, Math.random() * sign, (Math.random() * 2 - 1) * W];
    if (Math.hypot(x, z) < profile(Math.abs(y))) points.push([x, y, z]);
  }
  return points;
};

// A blob is a ball on the end of a thread: `at` is the ball, `tail` the thread's other end. While
// it hangs, the thread runs back through the neck into the pool it comes from. When the thread
// breaks, the blob's half springs into the ball, and the other half is left as a blob of its own
// (`stub`) that springs back into the pool. A free blob's tail sits on its ball: just a ball.
type Blob = {
  at: number[];
  tail: number[];
  kind: 1 | -1; // water, which falls, or oil, which rises
  bulb: 0 | 1; // the bulb it travels into: 0 is the +y one
  size: number; // the ball's radius once it's full
  thread: number; // the thread's radius at the tail
  age: number;
  speed: number;
  landed: boolean;
  stub: boolean;
};

const ease = (from: number, to: number, v: number) => {
  const k = Math.min(1, Math.max(0, (v - from) / (to - from)));
  return k * k * (3 - 2 * k);
};

/** Liquids that take `cycle` seconds to change bulbs. `onBlob` is called as each exchange lets go. */
export function createLiquids(cycle: number, onBlob: () => void) {
  const points = [scatter(1), scatter(-1)];
  const depths = new Float32Array(2000);
  let top = 0.9; // how much of the +y bulb is water; the rest of the water is in the other
  // The liquids follow gravity with a little lag, so they slosh.
  let feel = [0, -1, 0];
  let feelSpeed = [0, 0, 0];
  let blobs: Blob[] = [];
  let since = 0;

  // What the shader reads.
  const down = new Float32Array([0, -1, 0]); // the gravity the liquids feel
  const level = new Float32Array(2); // where water starts along `down`, in each bulb
  const heads = new Float32Array(BLOBS * 4); // each blob's ball: where it is, and its radius, negative for oil
  const tails = new Float32Array(BLOBS * 4); // the other end of its thread, and the thread's radius there
  const reach = new Float32Array(1); // how far from the glass's middle line any blob gets
  const stretch = new Float32Array(BLOBS); // how far each ball is pulled long (or, below 0, squashed flat)
  const ripple = new Float32Array([9, 0, 9, 0]); // each bulb: seconds since a blob landed, and how hard
  const churn = new Float32Array(1); // how stirred up the surfaces are, 0 to 1

  /** Where water starts along `down` when it fills `share` of a bulb. */
  const levelOf = (bulb: 0 | 1, share: number) => {
    if (share <= 0) return 1e3;
    if (share >= 1) return -1e3;
    points[bulb].forEach(([x, y, z], i) => (depths[i] = x * down[0] + y * down[1] + z * down[2]));
    depths.sort();
    return depths[Math.floor((1 - share) * (depths.length - 1))];
  };

  /** Moves everything on by `dt` seconds under `gravity` (in the glass's space). With `still`, the
      liquids only change level: no slosh and no blobs. Returns whether anything is still moving. */
  const step = (gravity: number[], dt: number, still: boolean) => {
    if (still) [feel, feelSpeed] = [gravity, [0, 0, 0]];
    else {
      feelSpeed = feelSpeed.map((v, i) => v + (60 * (gravity[i] - feel[i]) - 6 * v) * dt);
      feel = feel.map((v, i) => v + feelSpeed[i] * dt);
    }
    const swing = Math.hypot(...feelSpeed);
    const off = Math.hypot(...feel.map((v, i) => v - gravity[i]));
    // Liquids that have come to rest stop for good, so the picture can stop too.
    if (swing < 1e-3 && off < 1e-4) [feel, feelSpeed] = [gravity, [0, 0, 0]];
    down.set(feel.map((v) => v / Math.hypot(...feel)));
    churn[0] = still ? 0 : Math.min(1, churn[0] + swing * dt * 0.6) * Math.exp(-1.6 * dt);
    if (churn[0] < 1e-3) churn[0] = 0;

    // The bulb on top gives up its water, as fast as the glass is upright; on its side, nothing.
    const upper = gravity[1] < 0 ? 0 : 1;
    const above = upper === 0 ? top : 1 - top;
    const flow = above > 0 ? Math.min(1, Math.max(0, (Math.abs(gravity[1]) - 0.3) / 0.4)) : 0;
    top = Math.min(1, Math.max(0, top + ((upper === 0 ? -1 : 1) * flow * dt) / cycle));
    level[0] = levelOf(0, top);
    level[1] = levelOf(1, 1 - top);

    // A drop of water swells below the neck while a bubble of oil swells above it, together.
    since += dt * flow;
    if (!still && flow > 0 && since > EVERY && blobs.length <= BLOBS - 4) {
      since = 0;
      for (const kind of [1, -1] as const) {
        const bulb = (kind > 0 ? 1 - upper : upper) as 0 | 1;
        blobs.push({ at: [0, 0, 0], tail: [0, 0, 0], kind, bulb, size: 0.029 + Math.random() * 0.006, thread: THREAD, age: 0, speed: 0, landed: false, stub: false });
      }
    }
    const stubs: Blob[] = [];
    blobs = blobs.filter((blob) => {
      const way = gravity.map((v) => v * blob.kind);
      // The two liquids share the neck side by side: water down one side, oil up the other.
      const aside = [gravity[1] * blob.kind * ASIDE, -gravity[0] * blob.kind * ASIDE, 0];
      // Where its thread starts: a little way back in the pool it comes from.
      const source = aside.map((v, k) => v - way[k] * 0.04);
      const hanging = blob.age < HANG;
      blob.age += dt;
      if (blob.stub) {
        // The thread's broken end springs back into the pool, thinning as it goes.
        blob.at = blob.at.map((v, k) => v + (source[k] - v) * Math.min(1, dt * 16));
        blob.tail = source;
        blob.size = 0.003 * (1 - blob.age / SNAP);
        return blob.age < SNAP;
      }
      if (hanging) {
        // It creeps out of the neck on its thread, slowly, then faster as it gets heavier. The
        // thread holds until near the end, then necks down.
        const hung = Math.min(1, blob.age / HANG);
        const out = 0.015 + 0.085 * hung ** 2.2;
        blob.speed = (0.085 * 2.2 * hung ** 1.2) / HANG;
        blob.at = aside.map((v, k) => v * (1 - 0.4 * hung) + way[k] * out);
        blob.tail = source;
        blob.thread = THREAD * (1 - 0.65 * ease(0.65, 1, hung));
        if (blob.age >= HANG) {
          // The thread breaks near its middle: one half goes with the blob, the other stays.
          const broken = source.map((v, k) => v + (blob.at[k] - v) * 0.45);
          blob.tail = broken;
          stubs.push({ ...blob, at: broken, tail: source, age: 0, stub: true });
          if (blob.kind > 0) onBlob(); // one sound for the pair, as the drop goes
        }
      } else {
        blob.speed += (SPEED - blob.speed) * Math.min(1, dt * 4);
        // It drifts to the middle of the glass as it goes.
        const along = blob.at[0] * way[0] + blob.at[1] * way[1] + blob.at[2] * way[2];
        blob.at = blob.at.map((v, k) => v + way[k] * blob.speed * dt - (v - way[k] * along) * Math.min(1, dt * 1.2));
        // The glass keeps it in: it slides along the wall, and can't go back through the neck.
        const [x, y, z] = blob.at;
        const room = Math.max(0, profile(Math.min(1, Math.abs(y))) - blob.size * 0.5);
        const r = Math.hypot(x, z);
        if (r > room) [blob.at[0], blob.at[2]] = [(x * room) / r, (z * room) / r];
        blob.at[1] = Math.sign(y) * Math.min(Math.abs(y), 1 - blob.size * 0.5);
        if ((y > 0 ? 0 : 1) !== blob.bulb && Math.abs(y) > 0.03) return false;
        // Its half of the thread springs into the ball, and fills out to the ball's size as it does.
        blob.tail = blob.tail.map((v, k) => v + (blob.at[k] - v) * Math.min(1, dt * 16));
        const left = Math.hypot(...blob.tail.map((v, k) => v - blob.at[k]));
        blob.thread = blob.size - (blob.size - 0.003) * Math.min(1, left / blob.size);
      }
      const [x, y, z] = blob.at;
      // How far inside its own liquid it is: at the surface it lands, and a little deeper it's gone.
      const inside = blob.kind * (x * down[0] + y * down[1] + z * down[2] - level[blob.bulb]);
      if (!blob.landed && !hanging && inside > -blob.size * 0.4) {
        blob.landed = true;
        ripple.set([0, 1], blob.bulb * 2);
      }
      // With the glass on its side nothing carries a blob on: it thins away into the liquid round it.
      if (!hanging && flow === 0) blob.size *= Math.exp(-4 * dt);
      return inside < blob.size && blob.size > 0.008 && blob.age < 14;
    });
    blobs.push(...stubs);
    heads.fill(0);
    reach[0] = 0;
    blobs.forEach((blob, i) => {
      reach[0] = Math.max(reach[0], Math.hypot(blob.at[0], blob.at[2]) + blob.size, Math.hypot(blob.tail[0], blob.tail[2]) + blob.thread);
      // The ball starts no thicker than its thread and swells as it hangs. Let go, it's squashed
      // by its own thread springing in, and wobbles back to round.
      const free = blob.age - HANG;
      const swell = blob.stub || free > 0 ? 1 : 0.25 + 0.75 * (blob.age / HANG) ** 1.5;
      heads.set([...blob.at, blob.kind * blob.size * swell], i * 4);
      tails.set([...blob.tail, blob.thread], i * 4);
      stretch[i] = blob.stub || free < 0 ? 0 : -0.18 * Math.exp(-3 * free) * Math.sin(11 * free);
    });
    ripple[0] += dt;
    ripple[2] += dt;

    return flow > 0 || blobs.length > 0 || feelSpeed.some((v) => v !== 0) || churn[0] > 0 || ripple[0] < 3 || ripple[2] < 3;
  };

  return { down, level, heads, tails, reach, stretch, ripple, churn, step };
}
