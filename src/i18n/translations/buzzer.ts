import { Language } from "../language";

export const buzzerTranslations = {
  [Language.en]: {
    "buzzer.title": "",
  },
  [Language.fr]: {
    "buzzer.title": "",
  },
  [Language.ru]: {
    "buzzer.title": "",
  },
} as const;

export type BuzzerTranslations = typeof buzzerTranslations;
