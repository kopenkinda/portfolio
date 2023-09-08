import {
  type IFilters,
  type TripleFilter,
  modeToLabel,
  perspectiveToLabel,
} from "~/components/interactive/gamedle/filters.store";
import { type Game } from "./get-game-info";

const validNumber = (x: string) => x !== "" && !Number.isNaN(+x);

const selectDisabled = <T>(list: [T, TripleFilter][]): T[] =>
  list.filter(([, value]) => value === "disabled").map(([genre]) => genre);
const selectEnabled = <T>(list: [T, TripleFilter][]): T[] =>
  list.filter(([, value]) => value === "enabled").map(([genre]) => genre);

export const applyFilters = (list: Game[], filters: Omit<IFilters, "set">) => {
  const genres = Object.entries(filters.genres);
  const publishers = Object.entries(filters.publisher);
  const themes = Object.entries(filters.themes);
  const perspectives = Object.entries(filters.perspectives);
  const gameModes = Object.entries(filters.gameModes);

  const doNotShowGenres = selectDisabled(genres);
  const doNotShowPublishers = selectDisabled(publishers);
  const doNotShowThemes = selectDisabled(themes);
  const doNotShowPerspectives = selectDisabled(perspectives);
  const doNotShowGameModes = selectDisabled(gameModes);

  const hasToIncludeGenres = selectEnabled(genres);
  const hasToIncludePublishers = selectEnabled(publishers);
  const hasToIncludeThemes = selectEnabled(themes);
  const hasToIncludePerspectives = selectEnabled(perspectives);
  const hasToIncludeGameModes = selectEnabled(gameModes);

  return list.filter((game) => {
    // Year filter
    if (validNumber(filters.yearExact)) {
      if (game.releaseYear !== filters.yearExact) {
        return false;
      }
    } else {
      if (
        validNumber(filters.yearAfter) &&
        +game.releaseYear <= +filters.yearAfter
      ) {
        return false;
      }
      if (
        validNumber(filters.yearBefore) &&
        +game.releaseYear >= +filters.yearBefore
      ) {
        return false;
      }
    }
    // Genre
    for (const genre of game.genres) {
      if (doNotShowGenres.includes(genre.name)) {
        return false;
      }
    }
    for (const includeGenre of hasToIncludeGenres) {
      if (!game.genres.map((g) => g.name).includes(includeGenre)) {
        return false;
      }
    }
    // Theme
    for (const theme of game.themes) {
      if (doNotShowThemes.includes(theme.name)) {
        return false;
      }
    }
    for (const includeTheme of hasToIncludeThemes) {
      if (!game.themes.map((g) => g.name).includes(includeTheme)) {
        return false;
      }
    }
    // Company
    for (const company of game.involved_companies) {
      if (doNotShowPublishers.includes(company.name)) {
        return false;
      }
    }
    for (const includeCompany of hasToIncludePublishers) {
      if (
        !game.involved_companies.map((g) => g.name).includes(includeCompany)
      ) {
        return false;
      }
    }
    // Perspectives
    for (const perspectiveId of game.player_perspectives) {
      const perspective = perspectiveToLabel(perspectiveId);
      if (doNotShowPerspectives.includes(perspective)) {
        return false;
      }
    }
    for (const perspective of hasToIncludePerspectives) {
      if (
        !game.player_perspectives
          .map((p) => perspectiveToLabel(p))
          .includes(perspective)
      ) {
        return false;
      }
    }
    // Game modes
    for (const gameModeId of game.game_modes) {
      const mode = modeToLabel(gameModeId);
      if (doNotShowGameModes.includes(mode)) {
        return false;
      }
    }
    for (const gameMode of hasToIncludeGameModes) {
      if (!game.game_modes.map((p) => modeToLabel(p)).includes(gameMode)) {
        return false;
      }
    }
    return true;
  });
};

export const setDefaultFilters = (initial: Game[]) => {
  const genres = new Set<string>();
  const publishers = new Set<string>();
  const themes = new Set<string>();
  for (const game of initial) {
    for (const genre of game.genres) {
      genres.add(genre.name);
    }
    for (const publisher of game.involved_companies) {
      publishers.add(publisher.name);
    }
    for (const theme of game.themes) {
      themes.add(theme.name);
    }
  }
  const finalGenres: Record<string, TripleFilter> = {};
  const finalPublishers: Record<string, TripleFilter> = {};
  const finalThemes: Record<string, TripleFilter> = {};
  for (const genre of genres) {
    finalGenres[genre] = "non-selected";
  }
  for (const publisher of publishers) {
    finalPublishers[publisher] = "non-selected";
  }
  for (const theme of themes) {
    finalThemes[theme] = "non-selected";
  }
  return { finalGenres, finalPublishers, finalThemes };
};
