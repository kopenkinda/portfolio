import { Language, type DefaultLanguage } from "../language";

export const miscTranslations = {
  [Language.en]: {
    "misc.telegram-channel": "telegram channel",
  },
  [Language.fr]: {
    "misc.telegram-channel": "chaîne telegram",
  },
  [Language.ru]: {
    "misc.telegram-channel": "telegram канал",
  },
} as const;

export type MiscTranslations = (typeof miscTranslations)[DefaultLanguage];
