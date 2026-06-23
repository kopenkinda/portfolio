// @ts-check

import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from "@shikijs/transformers";
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import rehypeCodeFrame from "./src/lib/rehype-code-frame.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://kopenkin.tech",
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeCodeFrame],
    }),
    shikiConfig: {
      theme: "css-variables",
      defaultColor: false,
      transformers: [
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
      ],
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      weights: [400, 500, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["monospace"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
