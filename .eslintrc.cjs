module.exports = {
  extends: [
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-strict",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {
        "astro/prefer-object-class-list": "error",
      },
    },
  ],
};
