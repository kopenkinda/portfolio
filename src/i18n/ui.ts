export enum Language {
  en = "en",
  fr = "fr",
  ru = "ru",
}

export const defaultLang: Language = Language.en;

export const ui = {
  [Language.en]: {
    name: "Dmitrii Kopenkin",
    "blog.title": "Blog",
    "homepage.welcome": "hey, i'm dmitrii 👋",
    "homepage.description.0": "I'm a full-stack web developper working at ",
    "homepage.description.1":
      ", where we help orthopedic surgeons better follow their patients progress throughout their care program.",
    "seo.default-description": "This webpage has no description provided",
    "nav.home": "home",
    "nav.about": "blog",
  },
  [Language.fr]: {
    "homepage.welcome": "salut, je suis dmitrii 👋",
    "homepage.description.0":
      "Je suis un développeur full-stack travaillant chez ",
    "homepage.description.1":
      ", où nous aidons les chirurgiens orthopédiques à mieux suivre les progrès de leurs patients tout au long de leur programme de soins.",
    "seo.default-description": "Cette page web n'a pas de description fournie",
    "nav.home": "accueil",
    "nav.about": "blog",
  },
  [Language.ru]: {
    name: "Дмитрий Копенкин",
    "blog.title": "Блог",
    "homepage.welcome": "привет, я дмитрий 👋",
    "homepage.description.0":
      "Я full-stack веб-разработчик, работающий в компании ",
    "homepage.description.1":
      ", где мы помогаем хирургам-ортопедам лучше отслеживать прогресс своих пациентов на протяжении всей программы лечения.",
    "nav.home": "главная",
    "nav.about": "блог",
  },
} as const;
