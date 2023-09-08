import {
  type IFilters,
  type TripleFilter,
} from "~/components/interactive/gamedle/filters.store";
import { type Game } from "./get-game-info";

const labelFilters = (map: Record<number, string | undefined>) =>
  Object.fromEntries(
    Object.values(map).map((value) => [value, "non-selected"]),
  );

const modeMap: Record<number, string | undefined> = {
  0: "No data",
  1: "Singleplayer",
  2: "Multiplayer",
  3: "Co-operative",
  4: "Split-screen",
  5: "MMO",
  6: "Battle-Royale",
};

const perspectiveMap: Record<number, string | undefined> = {
  0: "No data",
  1: "First person",
  2: "Third person",
  3: "Isometric",
  4: "Side view",
  5: "Text",
  6: "Auditory",
  7: "Virtual Reality",
};

export const modeToLabel = (x: number) => {
  return modeMap[x] ?? `Not implemented ${x}`;
};

export const perspectiveToLabel = (x: number) => {
  return perspectiveMap[x] ?? `Not implemented ${x}`;
};

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
  const platforms = Object.entries(filters.platforms);
  const engines = Object.entries(filters.gameEngines);

  const doNotShowGenres = selectDisabled(genres);
  const doNotShowPublishers = selectDisabled(publishers);
  const doNotShowThemes = selectDisabled(themes);
  const doNotShowPerspectives = selectDisabled(perspectives);
  const doNotShowGameModes = selectDisabled(gameModes);
  const doNotShowPlatforms = selectDisabled(platforms);
  const doNotShowEngines = selectDisabled(engines);

  const hasToIncludeGenres = selectEnabled(genres);
  const hasToIncludePublishers = selectEnabled(publishers);
  const hasToIncludeThemes = selectEnabled(themes);
  const hasToIncludePerspectives = selectEnabled(perspectives);
  const hasToIncludeGameModes = selectEnabled(gameModes);
  const hasToIncludePlatforms = selectEnabled(platforms);
  const hasToIncludeEngines = selectEnabled(engines);

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
    // Platforms
    for (const platform of game.platforms) {
      if (doNotShowPlatforms.includes(platform.name)) {
        return false;
      }
    }
    for (const platform of hasToIncludePlatforms) {
      if (!game.platforms.map((p) => p.name).includes(platform)) {
        return false;
      }
    }
    // Engines
    for (const engine of game.game_engines) {
      if (doNotShowEngines.includes(engine.name)) {
        return false;
      }
    }
    for (const engine of hasToIncludeEngines) {
      if (!game.game_engines.map((p) => p.name).includes(engine)) {
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
  const platforms = new Set<string>();
  const engines = new Set<string>();
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
    for (const platform of game.platforms) {
      platforms.add(platform.name);
    }
    for (const engine of game.game_engines) {
      engines.add(engine.name);
    }
  }
  const finalGenres: Record<string, TripleFilter> = {};
  const finalPublishers: Record<string, TripleFilter> = {};
  const finalThemes: Record<string, TripleFilter> = {};
  const finalPlatforms: Record<string, TripleFilter> = {};
  const finalEngines: Record<string, TripleFilter> = {};
  for (const genre of genres) {
    finalGenres[genre] = "non-selected";
  }
  for (const publisher of publishers) {
    finalPublishers[publisher] = "non-selected";
  }
  for (const theme of themes) {
    finalThemes[theme] = "non-selected";
  }
  for (const platform of platforms) {
    finalPlatforms[platform] = "non-selected";
  }
  for (const engine of engines) {
    finalEngines[engine] = "non-selected";
  }
  const result: Partial<Omit<IFilters, "set">> = {
    genres: finalGenres,
    publisher: finalPublishers,
    themes: finalThemes,
    platforms: finalPlatforms,
    gameEngines: finalEngines,
    gameModes: labelFilters(modeMap),
    perspectives: labelFilters(perspectiveMap),
    rev: 0,
    yearAfter: "",
    yearBefore: "",
    yearExact: "",
  };
  return result;
};
