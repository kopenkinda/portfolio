import { Language, type DefaultLanguage } from "../language";

export const buzzerTranslations = {
  [Language.en]: {
    "buzzer.title": "Buzzer (UVB-76)",
    "buzzer.placeholder": "Put your text here",
    "buzzer.result": "The result will be here",
    "buzzer.support":
      "Please note that Buzzer only supports Russian and English alphabet (for now).",
  },
  [Language.fr]: {
    "buzzer.placeholder": "Votre texte ici",
    "buzzer.result": "Le résultat sera ici",
    "buzzer.support":
      "Veuillez noter que Buzzer ne prend en charge que l'alphabet Russe et Anglais (pour le moment).",
  },
  [Language.ru]: {
    "buzzer.title": "Жужжалка (УВБ-76)",
    "buzzer.placeholder": "Ваш текст здесь",
    "buzzer.result": "Результат будет здесь",
    "buzzer.support":
      "Обратите внимание, что Жужжалка поддерживает только Русский и Английский алфавит (на данный момент).",
  },
} as const;

export type BuzzerTranslations = (typeof buzzerTranslations)[DefaultLanguage];
