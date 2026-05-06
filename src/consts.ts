// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
import type { AllowedPixelIconType } from "./components/pixel-icon.types";
import andorraPhoto from "./assets/globe/andorra.jpg";
import yekaterinburgPhoto from "./assets/globe/yekaterinburg.jpg";

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
  globe: {
    intial: {
      phi: -2.259,
      theta: 0.485,
      srDescription: "Some highlights from my personal and professional life",
    },
    locations: [
      {
        id: "andorra",
        label: "andorra",
        description:
          "Where I live now: mountains, quiet focus, and the base I build from.",
        lat: 42.5063,
        lng: 1.5218,
        image: andorraPhoto,
      },
      {
        id: "yekaterinburg",
        label: "yekaterinburg",
        description:
          "Where I started: the city that shaped my engineering habits and early work.",
        lat: 56.8389,
        lng: 60.6057,
        image: yekaterinburgPhoto,
      },
    ] satisfies MapLocation[],
    connections: [
      {
        from: {
          lat: 42.5063,
          lng: 1.5218,
        },
        to: { lat: 56.8389, lng: 60.6057 },
        id: "andorra-yekaterinburg",
        label: "moved in 2016",
        color: [0.18, 1, 0.9],
      },
    ] satisfies MapConnection[],
  },
};

type SocialLink = {
  icon: AllowedPixelIconType;
  label: string;
  href: string;
  notracking?: boolean;
};

type MapLocation = {
  id: string;
  label: string;
  description?: string;
  subtitle?: string;
  lat: number;
  lng: number;
  image?: ImageMetadata;
};

type MapConnection = {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  id: string;
  label?: string;
  color?: [number, number, number];
};
