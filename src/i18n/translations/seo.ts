import { Language } from "../language";

export const seoTranslations = {
  [Language.en]: {
    "seo.default-description": "This webpage has no description provided",
  },
  [Language.fr]: {
    "seo.default-description": "Cette page web n'a pas de description fournie",
  },
  [Language.ru]: {
    "seo.default-description": "Эта веб-страница не имеет описания",
  },
} as const;

export type SeoTranslations = typeof seoTranslations;
