// Colours. The site has a dark and a light mode (global.css), and a wall theme can replace both by
// overriding the colour tokens on <html>. The inline script in Layout.astro re-applies the saved
// mode and theme before each page paints.

export type Theme = {
  id: string;
  name: string;
  colors: Record<"ink" | "paper" | "ash" | "accent", string>;
  /** Replaces the page's background texture while the theme is on (see global.css). */
  texture?: "dots" | "bricks";
  /** The home page graphic to show while the theme is on; otherwise the mode decides. */
  graphic?: Graphic;
};

/** The home page graphics: the painted map of Escaldes, or a valley in dots. */
export type Graphic = "map" | "dots";

export type Mode = "dark" | "light";

const TOKENS = ["ink", "paper", "ash", "accent"] as const;
const root = document.documentElement;

export function getTheme(): Theme | null {
  try {
    return JSON.parse(localStorage.getItem("theme") ?? "null");
  } catch {
    return null;
  }
}

export const getMode = (): Mode => (root.dataset.mode === "light" ? "light" : "dark");

/** A theme can pick the home page graphic; otherwise the dark mode shows the valley in dots and the
    light mode the painted map. The head script in Layout.astro applies the same rule before paint. */
export const graphicFor = (theme: Theme | null, mode: Mode): Graphic => theme?.graphic ?? (mode === "light" ? "map" : "dots");

/** Changes colours with the same focus-pull as a page switch, then tells the page. */
function change(update: () => void) {
  const run = () => {
    update();
    root.dataset.graphic = graphicFor(getTheme(), getMode());
    const ink = getComputedStyle(root).getPropertyValue("--color-ink").trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", ink);
    document.dispatchEvent(new CustomEvent("themechange"));
  };
  if (document.startViewTransition) document.startViewTransition(run);
  else run();
}

function save(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked: the change still applies to this page.
  }
}

/** Apply a wall theme, or pass null to go back to the dark or light mode. */
export function setTheme(theme: Theme | null) {
  change(() => {
    for (const token of TOKENS) {
      if (theme) root.style.setProperty(`--color-${token}`, theme.colors[token]);
      else root.style.removeProperty(`--color-${token}`);
    }
    if (theme?.texture) root.style.setProperty("--texture", `var(--texture-${theme.texture})`);
    else root.style.removeProperty("--texture");
    root.toggleAttribute("data-themed", Boolean(theme));
    save("theme", theme && JSON.stringify(theme));
  });
}

export function setMode(mode: Mode) {
  change(() => {
    if (mode === "light") root.dataset.mode = "light";
    else delete root.dataset.mode;
    save("mode", mode === "light" ? "light" : null);
  });
}
