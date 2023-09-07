import { getCollection } from "astro:content";
import { Language } from "~/i18n/ui";

export type BlogPosts = Awaited<ReturnType<typeof getCollection>>;

export const getPostsByLanguage = async () => {
  const posts = await getCollection("blog");

  const result = {
    [Language.en]: [] as BlogPosts,
    [Language.fr]: [] as BlogPosts,
    [Language.ru]: [] as BlogPosts,
  };

  posts.forEach((post) => {
    const language = post.slug.split("/")[0] as Language;
    return result[language].push(post);
  });

  return result;
};

export const getOtherAvailableLanguages = (
  currentLanguage: Language,
  posts: Awaited<ReturnType<typeof getPostsByLanguage>>,
) => {
  const otherLanguages = Object.keys(posts).filter(
    (language) => language !== currentLanguage,
  ) as Language[];
  const otherLanguagesWithPosts = otherLanguages
    .filter((language) => posts[language].length > 0)
    .reduce(
      (acc, language) => {
        acc.push({
          lang: language,
          amount: posts[language].length,
        });
        return acc;
      },
      [] as { lang: Language; amount: number }[],
    );
  return otherLanguagesWithPosts;
};
