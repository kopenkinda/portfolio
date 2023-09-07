export enum Language {
  en = "en",
  fr = "fr",
  ru = "ru",
}

export const languages = {
  [Language.en]: "Hello",
  [Language.fr]: "Salut",
  [Language.ru]: "Привет",
} as const;

export const defaultLang: Language = Language.en;

export const ui = {
  [Language.en]: {
    "seo.default-description": "This webpage has no description provided",
    "nav.home": "home",
    "nav.about": "blog",
  },
  [Language.fr]: {
    "seo.default-description": "Cette page web n'a pas de description fournie",
    "nav.home": "accueil",
    "nav.about": "blog",
  },
  [Language.ru]: {
    "seo.default-description": "Данная веб-страница не имеет описания",
    "nav.home": "главная",
    "nav.about": "блог",
  },
} as const;
