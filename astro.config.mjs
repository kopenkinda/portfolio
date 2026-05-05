// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap()],

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Atkinson",
      cssVariable: "--font-atkinson",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/atkinson-regular.woff"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/atkinson-bold.woff"],
            weight: 700,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.google(),
      name: "Doto",
      cssVariable: "--font-doto",
      weights: ["100 900"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
      options: {
        experimental: {
          variableAxis: {
            ROND: [["0", "100"]],
          },
        },
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
