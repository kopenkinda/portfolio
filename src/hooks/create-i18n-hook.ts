import { create } from "zustand";

export const createI18nHook = <T extends Record<string, string>>() => {
  return create<{
    _loaded: boolean;
    t: (key: keyof T) => T[keyof T];
    _translations: T;
    _setTranslations: (translations: T) => void;
  }>((set, get) => ({
    _loaded: false,
    _translations: {} as T,
    t: (key: keyof T) => {
      const translations = get()._translations as T | undefined;
      if (translations === undefined) {
        throw new Error(
          "No translations set, did you forget to call _setTranslations()?",
        );
      }
      const result = translations[key] as T[keyof T] | undefined;
      if (result === undefined) {
        throw new Error(
          `Translation for key ${String(
            key,
          )} not found, did you forget to add it to the translations file?`,
        );
      }
      return result;
    },
    _setTranslations: (_translations: T) => {
      set({ _translations, _loaded: true });
    },
  }));
};
