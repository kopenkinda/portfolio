import { type StoreApi, create } from "zustand";
import type { GamedleTranslations } from "~/i18n/translations/projects/gamedle";

export type TripleFilter = "enabled" | "disabled" | "non-selected";

export type IFilters = {
  yearBefore: string;
  yearAfter: string;
  yearExact: string;
  platforms: Record<string, TripleFilter>;
  genres: Record<string, TripleFilter>;
  themes: Record<string, TripleFilter>;
  publisher: Record<string, TripleFilter>;
  gameModes: Record<string, TripleFilter>;
  perspectives: Record<string, TripleFilter>;
  gameEngines: Record<string, TripleFilter>;
  modified: () => boolean;
  set: StoreApi<Omit<IFilters, "set" | "rev" | "modified">>["setState"];
  rev: number;
};

export const filterKeyToTranslationKey = (
  filterKey: keyof IFilters,
): keyof GamedleTranslations => {
  switch (filterKey) {
    case "gameEngines":
      return "gamedle.game-engines";
    case "gameModes":
      return "gamedle.game-modes";
    case "genres":
      return "gamedle.genres";
    case "perspectives":
      return "gamedle.game-perspectives";
    case "platforms":
      return "gamedle.platforms";
    case "publisher":
      return "gamedle.game-publisher";
    case "themes":
      return "gamedle.themes";
    default: {
      throw new Error("How did we get here?");
    }
  }
};

export const useFilters = create<IFilters>((set, get) => ({
  yearAfter: "",
  yearBefore: "",
  yearExact: "",
  genres: {},
  themes: {},
  publisher: {},
  platforms: {},
  gameModes: {},
  perspectives: {},
  gameEngines: {},
  modified: () => {
    const state = get();
    const values = (item: Record<string, TripleFilter>) => Object.values(item);
    const modified = (values: TripleFilter[]) =>
      values.some((v) => v !== "non-selected");
    const valuesModified = (item: Record<string, TripleFilter>) =>
      modified(values(item));
    return (
      valuesModified(state.gameEngines) ||
      valuesModified(state.gameModes) ||
      valuesModified(state.perspectives) ||
      valuesModified(state.platforms) ||
      valuesModified(state.publisher) ||
      valuesModified(state.themes) ||
      valuesModified(state.genres) ||
      state.yearAfter !== "" ||
      state.yearBefore !== "" ||
      state.yearExact !== ""
    );
  },
  set: (arg) => {
    if (typeof arg === "function") {
      set((state) => ({
        rev: state.rev + 1,
        ...arg(state),
      }));
    } else {
      set((state) => ({
        rev: state.rev + 1,
        ...arg,
      }));
    }
  },
  rev: 0,
}));
