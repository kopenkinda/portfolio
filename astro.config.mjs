// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    // Code colours come from CSS variables in global.css, so they follow the site palette.
    shikiConfig: { theme: "css-variables" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      // Headings
      provider: fontProviders.google(),
      name: "Mona Sans",
      cssVariable: "--font-mona-sans",
      weights: ["200 900"],
      styles: ["normal"],
      fallbacks: ["sans-serif"],
    },
    {
      // Body text
      provider: fontProviders.google(),
      name: "Literata",
      cssVariable: "--font-literata",
      weights: ["200 900"],
      styles: ["normal"],
      fallbacks: ["serif"],
      // Optical size lets the browser tune letterforms to the text size.
      options: { experimental: { variableAxis: { opsz: [[7, 72]] } } },
    },
  ],
});
