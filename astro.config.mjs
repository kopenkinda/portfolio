// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      // Headings
      provider: fontProviders.google(),
      name: "Encode Sans",
      cssVariable: "--font-encode-sans",
      weights: ["100 900"],
      fallbacks: ["sans-serif"],
    },
    {
      // Body text
      provider: fontProviders.google(),
      name: "Outfit",
      cssVariable: "--font-outfit",
      weights: ["100 900"],
      fallbacks: ["sans-serif"],
    },
  ],
});
