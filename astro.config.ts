import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  site: "https://kopenkin.tech",
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    prefetch(),
    // @ts-expect-error
    image({}),
  ],
});
