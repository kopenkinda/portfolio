import { Language } from "../language";

export const uiElementsTranslations = {
  [Language.en]: {
    "ui.name": "Dmitrii Kopenkin",
    "ui.work-in-progress":
      "The website is undergoing a rework, some content might be missing",
    "ui.reading-time": "min",
    "ui.nav.home": "home",
    "ui.nav.blog": "blog",
  },
  [Language.fr]: {
    "ui.work-in-progress":
      "Le site web est en cours de refonte, il se peut que certains contenus soient manquants.",
    "ui.nav.home": "accueil",
  },
  [Language.ru]: {
    "ui.name": "Дмитрий Копенкин",
    "ui.work-in-progress":
      "Сайт находится в стадии переделки, некоторая информация может отсутствовать",
    "ui.reading-time": "мин",
    "ui.nav.home": "главная",
    "ui.nav.blog": "блог",
  },
} as const;
