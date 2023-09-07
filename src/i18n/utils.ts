import { ui, defaultLang, Language } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang === undefined) return defaultLang;
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function getPathWithoutLangFromUrl(url: URL) {
  const rest = url.pathname.split("/").slice(2);
  return rest.join("/");
}

type DefaultTranslations = (typeof ui)[Language.en];

export function useTranslations(lang: keyof typeof Language) {
  const _ui = ui as Record<
    keyof typeof Language,
    Record<keyof DefaultTranslations, string>
  >;
  return function t(key: keyof DefaultTranslations) {
    return _ui[lang][key] || _ui[defaultLang][key];
  };
}

export function getStaticPaths() {
  return Object.keys(Language).map((lang) => ({ params: { lang } }));
}
