import { Language, type DefaultLanguage } from "../../language";

export const gamedleTranslations = {
  [Language.en]: {
    "gamedle.not-availabe": "Broken after the gamedle site update, sorry!",
    "gamedle.last-updated": "Last updated on ",
    "gamedle.reset-all-filters": "Reset filters",
    "gamedle.confirm.reset-all-filters":
      "Are you sure you want to reset all filters?",
    "gamedle.reset-filter.title": "Reset",
    "gamedle.reset-filter.0": "Are you sure you want to reset the ",
    "gamedle.reset-filter.1": " filter?",
    "gamedle.search": "Search ",
    "gamedle.show-results.0": "Show ",
    "gamedle.show-results.1": " results",
    "gamedle.diselect-other-filter-options": "Diselect all not selected",

    "gamedle.filters.release-year": "Release year",
    "gamedle.filters.released-before": "Released before",
    "gamedle.filters.released-after": "Released after",
    "gamedle.filters.released-exact": "Released on",

    "gamedle.platforms": "Platforms",
    "gamedle.genres": "Genres",
    "gamedle.themes": "Themes",
    "gamedle.game-modes": "Game Modes",
    "gamedle.game-engines": "Game Engines",
    "gamedle.game-publisher": "Involved Companies",
    "gamedle.game-perspectives": "Player Perspectives",
  },
  [Language.fr]: {
    "gamedle.not-availabe":
      "Cassé après la mise à jour du site gamedle, désolé !",
    "gamedle.last-updated": "Dernière mise à jour le ",
    "gamedle.reset-all-filters": "Réinitialiser filters",
    "gamedle.confirm.reset-all-filters":
      "Êtes-vous sûr de vouloir réinitialiser tous les filtres ?",
    "gamedle.reset-filter.title": "Réinitialiser",
    "gamedle.reset-filter.0":
      "Êtes-vous sûr de vouloir réinitialiser le filtre de ",
    "gamedle.reset-filter.1": " ?",
    "gamedle.search": "Rechercher les ",
    "gamedle.show-results.0": "Afficher ",
    "gamedle.show-results.1": " résultats",
    "gamedle.diselect-other-filter-options":
      "Désélectionner tout non sélectionné",

    "gamedle.filters.release-year": "Année de sortie",
    "gamedle.filters.released-before": "Sorti avant",
    "gamedle.filters.released-after": "Sorti après",
    "gamedle.filters.released-exact": "Sorti en",

    "gamedle.platforms": "Plateformes",
    "gamedle.genres": "Genres",
    "gamedle.themes": "Thèmes",
    "gamedle.game-modes": "Modes de jeu",
    "gamedle.game-engines": "Moteurs",
    "gamedle.game-publisher": "Éditeur/Développeur",
    "gamedle.game-perspectives": "Perspectives",
  },
  [Language.ru]: {
    "gamedle.not-availabe": "Сломано после обновления сайта gamedle, извините!",
    "gamedle.last-updated": "Последнее обновление: ",
    "gamedle.reset-all-filters": "Сбросить фильтры",
    "gamedle.confirm.reset-all-filters":
      "Вы уверены, что хотите сбросить все фильтры?",
    "gamedle.reset-filter.title": "Сбросить",
    "gamedle.reset-filter.0": "Вы уверены, что хотите сбросить фильтр ",
    "gamedle.reset-filter.1": " ?",
    "gamedle.search": "Поиск по ",
    "gamedle.show-results.0": "Показать ",
    "gamedle.show-results.1": " результатов",
    "gamedle.diselect-other-filter-options":
      "Снять выделение со всех не выбранных",

    "gamedle.filters.release-year": "Год выхода",
    "gamedle.filters.released-before": "Вышедшие до",
    "gamedle.filters.released-after": "Вышедшие после",
    "gamedle.filters.released-exact": "Вышедшие в",

    "gamedle.platforms": "Платформы",
    "gamedle.genres": "Жанры",
    "gamedle.themes": "Темы",
    "gamedle.game-modes": "Режимы игры",
    "gamedle.game-engines": "Движки",
    "gamedle.game-publisher": "Издатель/Разработчик",
    "gamedle.game-perspectives": "Перспективы",
  },
} as const;

export type GamedleTranslations = (typeof gamedleTranslations)[DefaultLanguage];
