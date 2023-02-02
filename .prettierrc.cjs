/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  astroAllowShorthand: false,
  tailwindConfig: "./tailwind.config.cjs",
  pluginSearchDirs: false,
};
