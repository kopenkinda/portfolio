import { getCollection } from "astro:content";
import { Language } from "~/i18n/language";

export type BlogPosts = Awaited<ReturnType<typeof getCollection>>;

const sortPostsByDate = (a: BlogPosts[number], b: BlogPosts[number]) => {
  return b.data.date.getTime() - a.data.date.getTime();
};

export const getPostsByLanguage = async () => {
  const posts = await getCollection("blog");

  const result = Object.keys(Language).reduce(
    (acc, language) => {
      acc[language as Language] = [];
      return acc;
    },
    {} as Record<Language, BlogPosts>,
  );

  posts.forEach((post) => {
    const language = post.slug.split("/")[0] as Language;
    return result[language].push(post);
  });

  Object.keys(result).forEach((language) => {
    result[language as Language].sort(sortPostsByDate);
  });

  return result;
};

export const getLastNPostsByLanguage = async (amountOfPosts: number) => {
  if (amountOfPosts < 1) {
    throw new Error("n must be greater than 0");
  }

  const posts = await getPostsByLanguage();
  const result = [] as { post: BlogPosts[number]; lang: Language }[];

  while (result.length < amountOfPosts) {
    const validPosts = [] as typeof result;
    Object.keys(Language).forEach((language) => {
      const post = posts[language as Language].pop();
      if (post !== undefined) {
        validPosts.push({ post, lang: language as Language });
      }
    });
    if (validPosts.length === 0) {
      break;
    }
    result.push(...validPosts);
  }

  result.sort((a, b) => {
    return sortPostsByDate(a.post, b.post);
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
