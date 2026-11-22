// PROTOTYPE - throwaway variant switcher. Copied from the prototype skill; do not edit,
// do not move into a shared UI library, delete it with the prototype.
//
// A tiny floating pill: [<] B (Sidebar layout) [>]. Drag it anywhere; on release it
// snaps to the nearest corner and remembers that corner across reloads. Arrow keys
// cycle variants. It renders in a shadow root so page styles never touch it and its
// styles never touch the design being judged.
//
// Usage (gate it to dev builds yourself, e.g. `if (import.meta.env.DEV)`):
//   const unmount = mountPrototypeSwitcher({ variants: [{ key: "A", name: "Table" }, "B", "C"] });
//
// By default a switch rewrites `?variant=` with history.replaceState and fires popstate,
// which React Router, Vue Router, TanStack Router and Next.js all react to. If the page
// does not re-render on switch, pass `onChange` and update the param with the router.

type Variant = string | { key: string; name?: string };
type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type PrototypeSwitcherOptions = {
  variants: Variant[];
  /** URL search param that holds the variant key. */
  param?: string;
  /** Called with the new key instead of the default URL update. */
  onChange?: (key: string) => void;
};

const STORAGE_KEY = "prototype-switcher-corner";
const INSET = 12;
const DRAG_THRESHOLD = 4;

const CSS = `
:host { all: initial; }
.pill {
  position: fixed; z-index: 2147483647; display: flex; align-items: center; gap: 2px;
  height: 28px; padding: 0 2px; border-radius: 999px;
  background: #111; color: #fff; box-shadow: 0 2px 8px rgb(0 0 0 / 0.25), 0 0 0 1px rgb(255 255 255 / 0.12);
  font: 500 12px/1 ui-sans-serif, system-ui, sans-serif; font-variant-numeric: tabular-nums;
  cursor: grab; user-select: none; touch-action: none; -webkit-user-select: none;
}
.pill.dragging { cursor: grabbing; }
.pill.snapping { transition: left 160ms cubic-bezier(0.2, 0, 0, 1), top 160ms cubic-bezier(0.2, 0, 0, 1); }
@media (prefers-reduced-motion: reduce) { .pill.snapping { transition: none; } }
button {
  all: unset; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 999px;
  cursor: pointer; color: #fff; opacity: 0.7;
}
button:hover { opacity: 1; background: rgb(255 255 255 / 0.12); }
button:focus-visible { opacity: 1; outline: 2px solid #fff; outline-offset: -2px; }
.label { padding: 0 4px; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.key { font-weight: 700; }
.name { opacity: 0.7; }
`;

const CHEVRON_LEFT = `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2.5 4 6l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CHEVRON_RIGHT = `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5 8 6 4.5 9.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function mountPrototypeSwitcher({
  variants,
  param = "variant",
  onChange,
}: PrototypeSwitcherOptions): () => void {
  const items = variants.map((v) => (typeof v === "string" ? { key: v } : v));
  if (items.length === 0) return () => {};

  const readIndex = () => {
    const key = new URLSearchParams(location.search).get(param);
    const index = items.findIndex((item) => item.key === key);
    return index === -1 ? 0 : index;
  };
  let index = readIndex();

  const host = document.createElement("div");
  host.setAttribute("data-prototype-switcher", "");
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>${CSS}</style>
    <div class="pill" role="toolbar" aria-label="Prototype variants">
      <button class="prev" aria-label="Previous variant">${CHEVRON_LEFT}</button>
      <span class="label" aria-live="polite"></span>
      <button class="next" aria-label="Next variant">${CHEVRON_RIGHT}</button>
    </div>`;
  document.body.appendChild(host);

  const pill = root.querySelector<HTMLDivElement>(".pill")!;
  const label = root.querySelector<HTMLSpanElement>(".label")!;

  const render = () => {
    const item = items[index];
    label.innerHTML = "";
    const key = document.createElement("span");
    key.className = "key";
    key.textContent = item.key;
    label.append(key);
    if (item.name) {
      const name = document.createElement("span");
      name.className = "name";
      name.textContent = ` (${item.name})`;
      label.append(name);
    }
    label.title = item.name ? `${item.key} (${item.name})` : item.key;
    // The label width changes per variant; keep the pill flush with its corner.
    if (!drag) placeAtCorner();
  };

  const select = (next: number) => {
    index = (next + items.length) % items.length;
    render();
    const key = items[index].key;
    if (onChange) return onChange(key);
    const url = new URL(location.href);
    url.searchParams.set(param, key);
    history.replaceState(history.state, "", url);
    dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
  };

  // Corner placement
  const readCorner = (): Corner => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "top-left" || saved === "top-right" || saved === "bottom-left" || saved === "bottom-right") return saved;
    } catch {}
    return "bottom-right";
  };
  let corner = readCorner();

  const cornerPosition = (c: Corner) => {
    const { width, height } = pill.getBoundingClientRect();
    return {
      left: c.endsWith("left") ? INSET : innerWidth - width - INSET,
      top: c.startsWith("top") ? INSET : innerHeight - height - INSET,
    };
  };
  const place = (left: number, top: number) => {
    pill.style.left = `${left}px`;
    pill.style.top = `${top}px`;
  };
  const placeAtCorner = () => {
    const { left, top } = cornerPosition(corner);
    place(left, top);
  };

  // Dragging: a press that moves past the threshold drags; otherwise it is a click.
  let drag: { id: number; startX: number; startY: number; offsetX: number; offsetY: number; moved: boolean } | null = null;

  pill.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const rect = pill.getBoundingClientRect();
    drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, moved: false };
  });
  pill.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    if (!drag.moved) {
      if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < DRAG_THRESHOLD) return;
      drag.moved = true;
      pill.setPointerCapture(drag.id);
      pill.classList.remove("snapping");
      pill.classList.add("dragging");
    }
    place(event.clientX - drag.offsetX, event.clientY - drag.offsetY);
  });
  const endDrag = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    const moved = drag.moved;
    drag = null;
    if (!moved) return;
    pill.classList.remove("dragging");
    const rect = pill.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    corner = `${centerY < innerHeight / 2 ? "top" : "bottom"}-${centerX < innerWidth / 2 ? "left" : "right"}` as Corner;
    try { localStorage.setItem(STORAGE_KEY, corner); } catch {}
    pill.classList.add("snapping");
    placeAtCorner();
    // Swallow the click that follows a drag so it does not switch variants.
    pill.addEventListener("click", (e) => e.stopPropagation(), { capture: true, once: true });
  };
  pill.addEventListener("pointerup", endDrag);
  pill.addEventListener("pointercancel", endDrag);

  root.querySelector(".prev")!.addEventListener("click", () => select(index - 1));
  root.querySelector(".next")!.addEventListener("click", () => select(index + 1));

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.composedPath()[0];
    if (target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select, [contenteditable]"))) return;
    event.preventDefault();
    select(index + (event.key === "ArrowRight" ? 1 : -1));
  };
  // Keep the label in sync when the URL changes from elsewhere (back/forward, links).
  const onPopState = () => {
    index = readIndex();
    render();
  };

  addEventListener("keydown", onKeyDown);
  addEventListener("popstate", onPopState);
  addEventListener("resize", placeAtCorner);
  render();

  return () => {
    removeEventListener("keydown", onKeyDown);
    removeEventListener("popstate", onPopState);
    removeEventListener("resize", placeAtCorner);
    host.remove();
  };
}
