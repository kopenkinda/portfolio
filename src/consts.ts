// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
import type { AllowedPixelIconType } from "./components/pixel-icon.types";

export const SITE_TITLE = "Kopenkin Dmitrii | Full-Stack AI Developer";
export const SITE_DESCRIPTION = "Welcome to my website!";
export const STARTED_DEVELOPMENT_IN = new Date("2017-01-01");

export const USER = {
  name: "Kopenkin Dmitrii",
  headline: `For ${new Date().getFullYear() - STARTED_DEVELOPMENT_IN.getFullYear()} years I've been stacking TypeScript, React, Next.js, Postgres, and now AI into digital playgrounds - where every click feels inevitable, nothing breaks when you're not looking, and the software sometimes thinks ahead of you.`,
  socials: [
    { icon: "file", label: "cv", href: "/dmitrii-kopenkin-cv.pdf" },
    {
      icon: "github",
      label: "github",
      href: "https://github.com/kopenkinda",
      notracking: true,
    },
    {
      icon: "telegram",
      label: "telegram",
      href: "https://t.me/leroifrancais",
      notracking: true,
    },
    { icon: "mail", label: "mail", href: "mailto:kopenkin.da@gmail.com" },
    {
      icon: "linkedin",
      label: "linkedin",
      href: "https://linkedin.com/in/dmitrii-kopenkin",
      notracking: true,
    },
  ] satisfies SocialLink[],
};

type SocialLink = {
  icon: AllowedPixelIconType;
  label: string;
  href: string;
  notracking?: boolean;
};
