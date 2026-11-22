// The dots valley as a jigsaw: the picture breaks into pieces that fall to the bottom of the window,
// and the visitor drags them back into place. A piece let go anywhere else falls again, with the
// speed the pointer gave it.
//
// The scene keeps drawing itself on its one canvas the whole time. A loose piece is a small canvas
// that copies its part of the scene every frame, so stars keep twinkling on it. Placed pieces are
// not copies: the scene's canvas is clipped to their shapes and shows through. Loose pieces live in
// a layer fixed to the bottom of the window, so they stay in reach while the page scrolls. Each one
// is clipped to its jigsaw shape with CSS, which also limits where it takes clicks: links under the
// empty space around a piece keep working.
//
// Nothing the pointer does over an empty place may reach a loose piece, or the piece that belongs
// under the pointer would show it and give its place away. So a loose piece shows the cursor's
// effect on its own canvas, where the cursor is on it, and the scene draws the effect for placed
// pieces only after the loose ones have taken their copy of the frame.

import { complete, rip, snap } from "../../scripts/sounds";

const COLS = 6;
const ROWS = 2; // every piece gets a part of the ridge; a third row would be all sky
const CRACK = 0.4; // seconds the pieces take to come apart before they fall
const GRAVITY = 2600; // CSS pixels per second squared
const THROW = 1800; // the fastest a piece leaves the hand, in CSS pixels per second: it stays in the window
const TURN = Math.PI * 2;

type Point = [number, number];
type Spot = { x: number; y: number };

type Piece = {
  col: number;
  row: number;
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  /** Where its canvas sits on the scene's canvas, in device pixels: whole ones, so the copy is sharp. */
  sx: number;
  sy: number;
  /** Its shape in the scene's coordinates, and the same shape on its own canvas. */
  shape: string;
  outline: Path2D;
  /** Position in the layer (from the window's bottom left corner, so y is negative) and rotation. */
  x: number;
  y: number;
  turn: number;
  state: "cracking" | "falling" | "loose" | "held" | "snapping" | "placed";
  /** While falling: its speed, and how fast it spins. Once it stops spinning it comes upright. */
  vx: number;
  vy: number;
  spin: number;
  /** The slight tilt it lies at. */
  lean: number;
  /** The first fall: when it starts, and the spot in the heap it lands on. Later falls have no
      set spot: they land on the bottom of the window, or on a piece lying there. */
  delay: number;
  rest: Spot | null;
};

export type Puzzle = {
  /** Move the pieces on by `dt` seconds. */
  step(dt: number): void;
  /** Copy the scene onto the loose pieces; call after each draw of the scene. */
  paint(outline: string): void;
  /** The shapes of the placed pieces, in the scene's CSS pixels. */
  placed(): Path2D;
  /** Put the picture back together at once. */
  close(): void;
};

const hash = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};
const ease = (t: number) => 1 - (1 - t) ** 3;

/** The cut between two neighbours, from `a` to `b`: three curves that swell into a round knob on one
    side. `knob` is its size; the seed picks the side and shifts the knob a little off centre. */
function cut(a: Point, b: Point, knob: number, seed: number): Point[] {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const [ux, uy] = [(b[0] - a[0]) / length, (b[1] - a[1]) / length];
  const side = hash(seed) < 0.5 ? -1 : 1;
  const mid = length * (0.5 + (hash(seed + 0.5) - 0.5) * 0.16);
  // Points as [distance along the cut, distance out of it].
  const points: Point[] = [
    [0, 0],
    [mid - 3 * knob, 0],
    [mid, -knob * 0.6],
    [mid - knob, knob * 0.9],
    [mid - 2.3 * knob, 2.9 * knob],
    [mid + 2.3 * knob, 2.9 * knob],
    [mid + knob, knob * 0.9],
    [mid, -knob * 0.6],
    [mid + 3 * knob, 0],
    [length, 0],
  ];
  return points.map(([along, out]) => [a[0] + ux * along - uy * out * side, a[1] + uy * along + ux * out * side]);
}

/**
 * Break the scene on `canvas` into a jigsaw. `grid` is an svg laid over the canvas: its rect is the
 * outline of the empty picture. `still` is for reduced motion: the pieces
 * start at the bottom and nothing animates. `hover` draws the cursor's effect at a point of the
 * scene (in its CSS pixels) onto a canvas set up in the scene's coordinates. `onClose` runs when
 * the puzzle ends; `solved` tells whether the visitor finished it.
 */
export function openPuzzle(
  canvas: HTMLCanvasElement,
  grid: SVGSVGElement,
  still: boolean,
  hover: (target: CanvasRenderingContext2D, x: number, y: number) => void,
  onClose: (solved: boolean) => void,
): Puzzle {
  const layer = document.createElement("div");
  layer.className = "fixed bottom-0 left-0 z-40 size-0";
  layer.ariaHidden = "true";
  document.body.append(layer);

  let dpr = 1;
  let cell: Spot = { x: 0, y: 0 }; // one piece without its knobs, in CSS pixels
  let size: Spot = { x: 0, y: 0 }; // a piece's canvas, knobs included, in device pixels
  let span = window.innerWidth; // the window's width at the last layout
  let age = 0;
  let top = 0; // z-index of the piece moved last, so it stays above the rest
  let near: { piece: Piece; x: number; y: number } | null = null; // the cursor, on a piece's own canvas
  let placed = new Path2D();

  const pieces: Piece[] = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const el = document.createElement("canvas");
    el.className = "absolute top-0 left-0 cursor-grab touch-none bg-ink select-none will-change-transform active:cursor-grabbing";
    layer.append(el);
    const piece: Piece = {
      col: i % COLS,
      row: Math.floor(i / COLS),
      el,
      ctx: el.getContext("2d")!,
      sx: 0,
      sy: 0,
      shape: "",
      outline: new Path2D(),
      x: 0,
      y: 0,
      turn: 0,
      state: still ? "loose" : "cracking",
      vx: 0,
      vy: 0,
      spin: 0,
      lean: (hash(i + 0.9) - 0.5) * 0.5,
      delay: hash(i + 0.7) * 0.25,
      rest: null,
    };
    pieces.push(piece);
    drag(piece);
  }
  const loose = () => pieces.filter((p) => p.state !== "placed");

  /** A piece's place in the picture, in the layer's coordinates. It moves when the page scrolls. */
  const slot = (p: Piece): Spot => {
    const box = canvas.getBoundingClientRect();
    return { x: box.left + p.sx / dpr, y: box.top + p.sy / dpr - window.innerHeight };
  };

  const move = (p: Piece) => (p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.turn}rad)`);

  /** Keep a spot where its piece can be grabbed: fully inside the window where there's room. */
  const reach = (spot: Spot) => {
    spot.x = Math.max(0, Math.min(window.innerWidth - size.x / dpr, spot.x));
    spot.y = Math.min(-size.y / dpr, Math.max(-window.innerHeight, spot.y));
  };

  /** Show the scene's canvas through the placed pieces only. */
  const reveal = () => {
    const shapes = pieces.filter((p) => p.state === "placed").map((p) => p.shape).join("");
    placed = new Path2D(shapes);
    canvas.style.clipPath = shapes ? `path("${shapes}")` : "inset(100%)";
  };

  /** Size and shape everything for the scene's current size. Runs at the start and on resize. */
  const layout = () => {
    const box = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    cell = { x: box.width / COLS, y: box.height / ROWS };
    const knob = Math.min(cell.x, cell.y) * 0.1;
    const margin = Math.ceil(knob * 2.6) + 2; // room around a piece for its knobs
    size = { x: Math.ceil((cell.x + margin * 2) * dpr), y: Math.ceil((cell.y + margin * 2) * dpr) };

    // The picture's corners are round, like the outline of the empty picture. `onto` moves a point
    // of the top or bottom edge straight down or up onto that outline: the ends of the cuts that
    // meet the edge beside a corner, and the corners themselves, which land where the side's
    // straight part ends. The sides need nothing: a row is taller than the corner's radius.
    const [w, h] = [box.width, box.height];
    const round = Math.min(Number(grid.querySelector("rect")!.getAttribute("rx")), w / 2, h / 2);
    const onto = ([x, y]: Point): Point => {
      const [dx, dy] = [Math.max(0, round - x, x - (w - round)), Math.max(0, round - y, y - (h - round))];
      return dy > round - 0.01 ? [x, y + Math.sign(h / 2 - y) * (round - Math.sqrt(Math.max(0, round ** 2 - dx ** 2)))] : [x, y];
    };

    // A cut is shared by two pieces, so its seed comes from the cut's place in the grid, not the piece.
    const across = (col: number, row: number): Point[] => {
      const [a, b]: Point[] = [[col * cell.x, row * cell.y], [(col + 1) * cell.x, row * cell.y]];
      return row % ROWS ? cut(a, b, knob, row * 31 + col) : [a, b];
    };
    const down = (col: number, row: number): Point[] => {
      const [a, b]: Point[] = [[col * cell.x, row * cell.y], [col * cell.x, (row + 1) * cell.y]];
      return col % COLS ? cut(onto(a), onto(b), knob, 500 + col * 31 + row) : [a, b];
    };
    /** An svg path along `lines`, each starting where the one before ended, moved by (-dx, -dy):
        a knob's three curves along a cut, the rounded outline along the picture's edge. */
    const path = (lines: Point[][], dx = 0, dy = 0) => {
      const at = ([x, y]: Point) => `${(x - dx).toFixed(1)} ${(y - dy).toFixed(1)}`;
      const line = (l: Point[]) => {
        if (l.length > 2) return [1, 4, 7].map((k) => `C${at(l[k])} ${at(l[k + 1])} ${at(l[k + 2])}`).join("");
        const [[xa, y], [xb, yb]] = l;
        if (y !== yb) return `L${at(onto(l[1]))}`; // a side: straight
        // The top or bottom edge: split where the corners' arcs meet its straight part, and
        // follow each stretch as one or the other.
        const stops = [round, w - round].filter((x) => x > Math.min(xa, xb) && x < Math.max(xa, xb));
        let from = xa;
        return [...(xa < xb ? stops : stops.reverse()), xb]
          .map((x) => {
            const middle = (from + x) / 2;
            from = x;
            return `${middle < round || middle > w - round ? `A${round} ${round} 0 0 1 ` : "L"}${at(onto([x, y]))}`;
          })
          .join("");
      };
      return `M${at(onto(lines[0][0]))}${lines.map(line).join("")}`;
    };
    for (const p of pieces) {
      p.sx = Math.round((p.col * cell.x - margin) * dpr);
      p.sy = Math.round((p.row * cell.y - margin) * dpr);
      // Clockwise from the top left corner; the bottom and left cuts run backwards.
      const sides = [across(p.col, p.row), down(p.col + 1, p.row), across(p.col, p.row + 1).reverse(), down(p.col, p.row).reverse()];
      p.shape = `${path(sides)}Z`;
      const own = `${path(sides, p.sx / dpr, p.sy / dpr)}Z`;
      p.outline = new Path2D(own);
      // Only when the size changes: setting it clears the piece, and a window resize that leaves the
      // scene's size alone (a height change) doesn't redraw the scene to paint it again.
      if (p.el.width !== size.x || p.el.height !== size.y) [p.el.width, p.el.height] = [size.x, size.y];
      p.el.style.width = `${size.x / dpr}px`;
      p.el.style.height = `${size.y / dpr}px`;
      p.el.style.clipPath = `path("${own}")`;
      if (p.state === "loose") {
        // Lying pieces keep their share of the window's width, so a narrower window doesn't stack
        // them all against its edge.
        p.x *= window.innerWidth / span;
        reach(p);
        move(p);
      }
    }
    span = window.innerWidth;
    reveal();
  };

  /** Where the pieces come to rest in the first fall: a heap along the bottom of the window, in a
      shuffled order. */
  const heap = () => {
    const [w, h] = [size.x / dpr, size.y / dpr];
    // Neighbours may overlap by up to a fifth: a wide window then fits the heap in one row, which
    // covers less of the page. Rows are filled evenly.
    const fit = Math.max(2, Math.floor((window.innerWidth - w) / (cell.x * 0.8)) + 1);
    const perRow = Math.ceil(pieces.length / Math.ceil(pieces.length / fit));
    const gap = Math.min(cell.x * 1.05, (window.innerWidth - w) / (perRow - 1));
    const order = pieces.map((_, i) => i).sort((a, b) => hash(a * 7.3 + 2) - hash(b * 7.3 + 2));
    order.forEach((i, k) => {
      const row = Math.floor(k / perRow);
      const inRow = Math.min(perRow, pieces.length - row * perRow);
      const rest = {
        x: (window.innerWidth - w) / 2 + ((k % perRow) - (inRow - 1) / 2) * gap + (hash(i + 0.2) - 0.5) * 8,
        y: -h - 4 - row * cell.y * 0.85 - hash(i + 0.4) * 8,
      };
      reach(rest);
      pieces[i].rest = rest;
    });
  };

  /** Where a falling piece lands: on the bottom of the window, or on top of a piece lying under
      it. A piece that is already lower than that passes in front and lands on the bottom. The
      pile grows three pieces high at most, so it never becomes a tower in front of the picture;
      past that a piece lands in front of the top one. */
  const support = (p: Piece) => {
    const bottom = -size.y / dpr - 4;
    let floor = bottom;
    for (const q of pieces) {
      if (q !== p && q.state === "loose" && Math.abs(q.x - p.x) < cell.x * 0.6 && p.y <= q.y - cell.y * 0.75) {
        floor = Math.min(floor, q.y - cell.y * 0.85);
      }
    }
    return Math.max(floor, bottom - cell.y * 0.85 * 2);
  };

  /** Let the visitor drag a piece. Let go near its place it goes in; anywhere else it falls, with
      the speed the pointer had. The cursor's effect follows the pointer over the piece. */
  function drag(p: Piece) {
    let grip: Spot | null = null;
    let trail: [time: number, x: number, y: number][] = []; // where the pointer just was, for the throw
    p.el.addEventListener("pointerdown", (event) => {
      if (p.state === "snapping") return;
      event.preventDefault(); // no text selection while dragging
      p.el.setPointerCapture(event.pointerId);
      grip = { x: event.clientX - p.x, y: event.clientY - p.y };
      trail = [];
      p.state = "held";
      p.rest = null;
      p.el.style.zIndex = String(++top);
      // Straight in the hand: at once without motion, else step() eases it from the nearest angle.
      p.turn = still ? 0 : Math.atan2(Math.sin(p.turn), Math.cos(p.turn));
    });
    p.el.addEventListener("pointermove", (event) => {
      // Without motion the scene doesn't redraw, and the effect would stick where it was last drawn.
      if (!still) near = { piece: p, x: event.offsetX, y: event.offsetY };
      if (!grip) return;
      [p.x, p.y] = [event.clientX - grip.x, event.clientY - grip.y];
      trail = [...trail.filter(([time]) => event.timeStamp - time < 100), [event.timeStamp, event.clientX, event.clientY]];
      move(p);
    });
    p.el.addEventListener("pointerleave", () => {
      if (near?.piece === p) near = null;
    });
    const drop = (event: PointerEvent) => {
      if (!grip) return;
      grip = null;
      const home = slot(p);
      if (Math.hypot(p.x - home.x, p.y - home.y) < Math.max(24, Math.min(cell.x, cell.y) * 0.3)) {
        snap();
        if (still) place(p);
        else p.state = "snapping";
      } else if (still) {
        // Without motion a piece stays where it's let go: calmer than having it jump to the bottom.
        p.state = "loose";
        reach(p);
        move(p);
      } else {
        // Thrown or dropped: the pointer's speed over its last tenth of a second goes to the piece.
        // A pointer that rested before letting go has none, so the piece just drops.
        const recent = trail.filter(([time]) => event.timeStamp - time < 100);
        const [first, last] = [recent[0], recent[recent.length - 1]];
        const time = recent.length > 1 ? (last[0] - first[0]) / 1000 : 0;
        const [vx, vy] = time ? [(last[1] - first[1]) / time, (last[2] - first[2]) / time] : [0, 0];
        const cap = Math.min(1, THROW / Math.hypot(vx, vy));
        Object.assign(p, { state: "falling", vx: vx * cap, vy: vy * cap, spin: Math.max(-6, Math.min(6, vx * cap * 0.004)) });
      }
    };
    p.el.addEventListener("pointerup", drop);
    p.el.addEventListener("pointercancel", drop);
  }

  /** Lock a piece in: its canvas goes, and the scene shows through its shape instead. */
  const place = (p: Piece) => {
    p.state = "placed";
    p.el.remove();
    reveal();
    if (loose().length) return;
    complete();
    close(true);
  };

  const close = (solved = false) => {
    window.removeEventListener("resize", layout);
    layer.remove();
    canvas.style.clipPath = "";
    grid.style.opacity = "";
    // Solved: the outline fades as the picture comes back whole (the scene sends a ring from the middle).
    if (solved && !still) grid.animate([{ opacity: 0.5 }, { opacity: 0 }], { duration: 1100, easing: "ease-out" });
    onClose(solved);
  };

  layout();
  heap();
  for (const p of pieces) {
    if (still) Object.assign(p, p.rest, { turn: p.lean, rest: null });
    else Object.assign(p, slot(p));
    move(p);
  }
  rip(); // the answer to the tap, so it plays without motion too
  grid.style.opacity = "0.5";
  if (!still) grid.animate([{ opacity: 0 }, { opacity: 0.5 }], { duration: CRACK * 1000 });
  window.addEventListener("resize", layout);

  return {
    close,
    placed: () => placed,
    step(dt) {
      age += dt;
      // In the first fall an upper piece can land on its spot before the piece under it has.
      // Until every piece has landed, none counts as hanging in the air.
      const heaping = pieces.some((p) => p.rest);
      for (const p of loose()) {
        if (p.state === "loose") {
          // Lying still, unless what it lay on is gone. A little slack: the heap isn't laid to the pixel.
          if (heaping || p.y > support(p) - 10) continue;
          p.state = "falling";
        }
        if (p.state === "cracking") {
          // Coming apart: every piece steps away from the middle of the picture, so gaps open
          // along the cuts. It follows its place, which moves if the page scrolls meanwhile.
          const home = slot(p);
          const apart = ease(Math.min(1, age / CRACK)) * 7;
          p.x = home.x + (p.col - (COLS - 1) / 2) * apart;
          p.y = home.y + (p.row - (ROWS - 1) / 2) * apart;
          if (age > CRACK + p.delay) {
            // A small hop, then the fall. The flight time follows from the hop and the drop, and
            // sets the sideways speed and the spin that bring the piece to its spot as it lands.
            // Some pieces turn right over on the way.
            const rest = p.rest!;
            p.state = "falling";
            p.vy = -(150 + hash(p.col + p.row * 9.1) * 200);
            const flight = (-p.vy + Math.sqrt(p.vy ** 2 + 2 * GRAVITY * Math.max(0, rest.y - p.y))) / GRAVITY;
            p.vx = (rest.x - p.x) / flight;
            p.spin = (p.lean + Math.round(hash(p.col * 3.3 + p.row) * 2 - 1) * TURN) / flight;
            p.el.style.zIndex = String(++top);
          }
        } else if (p.state === "falling") {
          p.vy += GRAVITY * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.turn += p.spin * dt;
          const upright = Math.round((p.turn - p.lean) / TURN) * TURN + p.lean;
          if (!p.spin) p.turn += (upright - p.turn) * Math.min(1, dt * 14);
          // The sides of the window are walls.
          const inside = Math.max(0, Math.min(window.innerWidth - size.x / dpr, p.x));
          if (inside !== p.x) [p.x, p.vx] = [inside, p.vx * -0.4];
          const floor = p.rest ? p.rest.y : support(p);
          if (p.y >= floor) {
            // Down: it stops spinning and slows (the first fall is aimed at its spot, and stops
            // there), bounces once or twice, and lies still once it's upright.
            p.y = floor;
            p.spin = 0;
            p.vx *= p.rest ? 0 : 0.5;
            if (p.vy > 250) p.vy *= -0.25;
            else {
              p.vy = 0;
              if (Math.abs(upright - p.turn) < 0.02) Object.assign(p, { state: "loose", vx: 0, rest: null });
            }
          }
        } else if (p.state === "held") {
          p.turn *= 1 - Math.min(1, dt * 16); // straighten up in the hand
        } else {
          // Snapping: glide the last few pixels into place.
          const home = slot(p);
          const pull = Math.min(1, dt * 22);
          p.x += (home.x - p.x) * pull;
          p.y += (home.y - p.y) * pull;
          p.turn *= 1 - pull;
          if (Math.hypot(home.x - p.x, home.y - p.y) < 0.5) {
            place(p);
            continue;
          }
        }
        move(p);
      }
    },
    paint(outline) {
      // The outline is brightest as the picture cracks, then settles.
      const flash = still ? 0 : Math.max(0, 1 - age / (CRACK * 2));
      for (const p of loose()) {
        p.ctx.setTransform(1, 0, 0, 1, 0, 0);
        p.ctx.clearRect(0, 0, size.x, size.y);
        p.ctx.drawImage(canvas, p.sx, p.sy, size.x, size.y, 0, 0, size.x, size.y);
        if (near?.piece === p) {
          p.ctx.setTransform(dpr, 0, 0, dpr, -p.sx, -p.sy);
          hover(p.ctx, p.sx / dpr + near.x, p.sy / dpr + near.y);
        }
        // Half of the line falls outside the piece's clipped shape, so one pixel shows.
        p.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        p.ctx.lineWidth = 2;
        p.ctx.strokeStyle = outline;
        p.ctx.globalAlpha = 0.4 + 0.6 * flash;
        p.ctx.stroke(p.outline);
        p.ctx.globalAlpha = 1;
      }
    },
  };
}
