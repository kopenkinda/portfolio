import { Language } from "./language";

import { uiElementsTranslations } from "./translations/ui";
import { blogTranslations } from "./translations/blog";
import { homepageTranslations } from "./translations/homepage";
import { miscTranslations } from "./translations/misc";
import { seoTranslations } from "./translations/seo";
import { buzzerTranslations } from "./translations/buzzer";

export const ui = {
  [Language.en]: {
    ...uiElementsTranslations.en,
    ...blogTranslations.en,
    ...homepageTranslations.en,
    ...miscTranslations.en,
    ...seoTranslations.en,
    ...buzzerTranslations.en,
  },
  [Language.fr]: {
    ...uiElementsTranslations.fr,
    ...blogTranslations.fr,
    ...homepageTranslations.fr,
    ...miscTranslations.fr,
    ...seoTranslations.fr,
    ...buzzerTranslations.fr,
  },
  [Language.ru]: {
    ...uiElementsTranslations.ru,
    ...blogTranslations.ru,
    ...homepageTranslations.ru,
    ...miscTranslations.ru,
    ...seoTranslations.ru,
    ...buzzerTranslations.ru,
  },
} as const;
