import { type StoreApi, create } from "zustand";

const modeMap = {
  0: "No data",
  1: "Singleplayer",
  2: "Multiplayer",
  3: "Co-operative",
  4: "Split-screen",
  5: "MMO",
  6: "Battle-Royale",
};

const perspectiveMap = {
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

export type TripleFilter = "enabled" | "disabled" | "non-selected";

export type IFilters = {
  yearBefore: string;
  yearAfter: string;
  yearExact: string;
  genres: Record<string, TripleFilter>;
  themes: Record<string, TripleFilter>;
  publisher: Record<string, TripleFilter>;
  gameModes: Record<string, TripleFilter>;
  perspectives: Record<string, TripleFilter>;
  set: StoreApi<Omit<IFilters, "set" | "rev">>["setState"];
  rev: number;
};

export const useFilters = create<IFilters>((set) => ({
  yearAfter: "",
  yearBefore: "",
  yearExact: "",
  genres: {},
  themes: {},
  publisher: {},
  gameModes: Object.fromEntries(
    Object.values(modeMap).map((mode) => [mode, "non-selected"]),
  ),
  perspectives: Object.fromEntries(
    Object.values(perspectiveMap).map((perspective) => [
      perspective,
      "non-selected",
    ]),
  ),
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
