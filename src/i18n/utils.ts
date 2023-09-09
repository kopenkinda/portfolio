import { ui } from "./translations";
import { Language, defaultLang } from "./language";

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
type TranslationsObject = Record<
  keyof typeof Language,
  Record<keyof DefaultTranslations, string>
>;

export function useAllTranslations<Cast = DefaultTranslations>(
  lang: keyof typeof Language,
) {
  const _ui = ui as TranslationsObject;
  return _ui[lang] as Cast;
}

export function useTranslations(lang: keyof typeof Language) {
  const _ui = ui as TranslationsObject;
  return function t(key: keyof DefaultTranslations) {
    const result = _ui[lang][key] || _ui[defaultLang][key];
    return result || "This key is missing from all the translations";
  };
}

export function getStaticPaths() {
  return Object.keys(Language).map((lang) => ({ params: { lang } }));
}

export const getLocalisedBlogLink = (slug: string) => {
  const [lang, ..._slug] = slug.split("/");
  return `/${lang}/blog/${_slug.join("/")}`;
};
