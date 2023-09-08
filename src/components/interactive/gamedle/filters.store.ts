import { type StoreApi, create } from "zustand";

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
  platforms: {},
  gameModes: {},
  perspectives: {},
  gameEngines: {},
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
