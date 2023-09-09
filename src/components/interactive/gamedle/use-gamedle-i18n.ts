import { createI18nHook } from "~/hooks/create-i18n-hook";
import type { GamedleTranslations } from "~/i18n/translations/projects/gamedle";
export const useI18nGlobal = createI18nHook<GamedleTranslations>();
export const useI18n = () => useI18nGlobal((state) => state.t);
