export enum Language {
  en = "en",
  fr = "fr",
  ru = "ru",
}

export const defaultLang: Language = Language.en;

export const ui = {
  [Language.en]: {
    WIP: "The website is undergoing a rework, some content might be missing",
    name: "Dmitrii Kopenkin",
    "generic.reading-time": "min",
    "blog.title": "Blog | Dmitrii Kopenkin",
    "blog.empty": "There are no posts yet",
    "blog.heading": "read my blog",
    "blog.other-languages": "read in other languages:",
    "homepage.welcome": "hey, i'm dmitrii 👋",
    "homepage.description.0": "I'm a full-stack web developper working at ",
    "homepage.description.1":
      ", where we help orthopedic surgeons better follow their patients progress throughout their care program.",
    "homepage.projects":
      "In my free time, I like to work on side projects. Most of them are just for fun, but some of them are actually useful.",
    "seo.default-description": "This webpage has no description provided",
    "nav.home": "home",
    "nav.about": "blog",

    "projects.1.title": "Personal todo",
    "projects.1.description":
      "simple todo PWA, that I use to keep track of my personal tasks.",
    "projects.2.title": "Gamedle.wtf assistant",
    "projects.2.description":
      'helps you find a game that you have to guess in the "guess" gamemode',
  },
  [Language.fr]: {
    WIP: "Le site web est en cours de refonte, il se peut que certains contenus soient manquants.",
    "blog.heading": "lire mon blog",
    "blog.empty": "Il est vide pour l'instant :(",
    "blog.other-languages": "lire dans d'autres langues:",
    "homepage.welcome": "salut, je suis dmitrii 👋",
    "homepage.description.0":
      "Je suis un développeur full-stack travaillant chez ",
    "homepage.description.1":
      ", où nous aidons les chirurgiens orthopédiques à mieux suivre les progrès de leurs patients tout au long de leur programme de soins.",
    "homepage.projects":
      "Pendant mon temps libre, j'aime travailler sur des projets secondaires. La plupart d'entre eux sont juste pour le plaisir, mais certains sont réellement utiles.",
    "seo.default-description": "Cette page web n'a pas de description fournie",
    "nav.home": "accueil",
    "nav.about": "blog",

    "projects.1.title": "Personal todo",
    "projects.1.description":
      "simple PWA de tâches, que j'utilise pour suivre mes tâches personnelles.",
    "projects.2.title": "Gamedle.wtf assistant",
    "projects.2.description":
      'vous aide à trouver un jeu que vous devez deviner dans le mode "guess".',
  },
  [Language.ru]: {
    WIP: "Сайт находится в стадии переделки, некоторая информация может отсутствовать",
    name: "Дмитрий Копенкин",
    "generic.reading-time": "мин",
    "blog.title": "Блог | Дмитрий Копенкин",
    "blog.empty": "Тут пока что пусто :(",
    "blog.heading": "читать мой блог",
    "blog.other-languages": "читать на других языках:",
    "homepage.welcome": "привет, я дмитрий 👋",
    "homepage.description.0":
      "Я full-stack веб-разработчик, работающий в компании ",
    "homepage.description.1":
      ", где мы помогаем хирургам-ортопедам лучше отслеживать прогресс своих пациентов на протяжении всей программы лечения.",
    "homepage.projects":
      'В свободное время я люблю работать над "pet-проектами". Большинство из них - это просто развлечение, но некоторые из них действительно полезны.',
    "nav.home": "главная",
    "nav.about": "блог",

    "projects.1.title": "Персональная тудушка",
    "projects.1.description":
      "простое ПВА, которое я использую для отслеживания своих личных задач.",
    "projects.2.title": "Gamedle.wtf помошник",
    "projects.2.description":
      'помогает найти игру, которую нужно угадать в режиме "guess".',
  },
} as const;
