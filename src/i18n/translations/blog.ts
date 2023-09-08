import { Language } from "../language";

export const blogTranslations = {
  [Language.en]: {
    "blog.title": "Blog | Dmitrii Kopenkin",
    "blog.empty": "There are no posts yet",
    "blog.heading": "read my blog",
    "blog.other-languages": "read in other languages:",
  },
  [Language.fr]: {
    "blog.heading": "lire mon blog",
    "blog.empty": "Il est vide pour l'instant :(",
    "blog.other-languages": "lire dans d'autres langues:",
  },
  [Language.ru]: {
    "blog.title": "Блог | Дмитрий Копенкин",
    "blog.empty": "Тут пока что пусто :(",
    "blog.heading": "читать мой блог",
    "blog.other-languages": "читать на других языках:",
  },
} as const;
