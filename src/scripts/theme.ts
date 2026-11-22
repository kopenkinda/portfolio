// Site-wide themes from wall entries. A theme overrides the colour tokens on <html>; the inline
// script in Layout.astro re-applies the saved one before each page paints.

export type Theme = {
  id: string;
  name: string;
  colors: Record<"ink" | "paper" | "ash" | "accent", string>;
  /** Replaces the page's background texture while the theme is on (see global.css). */
  texture?: "dots" | "bricks";
};

const KEY = "theme";
const TOKENS = ["ink", "paper", "ash", "accent"] as const;
const DEFAULT_INK = "#0a0a0a";

export function getTheme(): Theme | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "null");
  } catch {
    return null;
  }
}

/** Apply a theme, or pass null to go back to black and white. */
export function setTheme(theme: Theme | null) {
  const update = () => {
    const root = document.documentElement;
    for (const token of TOKENS) {
      if (theme) root.style.setProperty(`--color-${token}`, theme.colors[token]);
      else root.style.removeProperty(`--color-${token}`);
    }
    if (theme?.texture) root.style.setProperty("--texture", `var(--texture-${theme.texture})`);
    else root.style.removeProperty("--texture");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme?.colors.ink ?? DEFAULT_INK);
    try {
      if (theme) localStorage.setItem(KEY, JSON.stringify(theme));
      else localStorage.removeItem(KEY);
    } catch {
      // Storage blocked: the theme still applies to this page.
    }
    document.dispatchEvent(new CustomEvent("themechange"));
  };

  // Same focus-pull as a page switch, where supported.
  if (document.startViewTransition) document.startViewTransition(update);
  else update();
}
