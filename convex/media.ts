"use node";

import process from "node:process";
import { v } from "convex/values";
import { action } from "./_generated/server";

interface SearchResult {
  coverImageUrl?: string;
  episodeCount?: number;
  originalTitle?: string;
  releaseYear?: number;
  source: "anilist" | "tmdb";
  sourceId: string;
  statusText?: string;
  title: string;
  type: "anime" | "series";
}

function normalizeQuery(query: string) {
  return query.trim();
}

function getTmdbAuthHeadersAndParams(rawCredential: string) {
  const credential = rawCredential.trim();

  // TMDB supports either a v3 api_key query param or a v4/v3 read access token
  // sent as a Bearer token. Many people store the latter under a generic env name.
  if (credential.includes(".")) {
    return {
      headers: {
        Authorization: `Bearer ${credential}`,
        accept: "application/json",
      } as Record<string, string>,
      searchParams: {} as Record<string, string>,
    };
  }

  return {
    headers: {
      accept: "application/json",
    } as Record<string, string>,
    searchParams: {
      api_key: credential,
    },
  };
}

export const searchAnime = action({
  args: {
    query: v.string(),
  },
  handler: async (_ctx, args): Promise<SearchResult[]> => {
    const query = normalizeQuery(args.query);
    if (!query) {
      return [];
    }

    const response = await fetch("https://graphql.anilist.co", {
      body: JSON.stringify({
        query: `
          query SearchAnime($search: String!) {
            Page(page: 1, perPage: 10) {
              media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
                id
                episodes
                status
                title {
                  english
                  native
                  romaji
                }
                coverImage {
                  large
                }
                startDate {
                  year
                }
              }
            }
          }
        `,
        variables: { search: query },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("AniList search failed.");
    }

    const payload = await response.json();
    const media = payload?.data?.Page?.media ?? [];

    return media.map((item: any) => ({
      coverImageUrl: item.coverImage?.large ?? undefined,
      episodeCount: item.episodes ?? undefined,
      originalTitle: item.title?.native ?? undefined,
      releaseYear: item.startDate?.year ?? undefined,
      source: "anilist" as const,
      sourceId: String(item.id),
      statusText: item.status ?? undefined,
      title: item.title?.english || item.title?.romaji || item.title?.native || "Untitled",
      type: "anime" as const,
    }));
  },
});

export const searchSeries = action({
  args: {
    query: v.string(),
  },
  handler: async (_ctx, args): Promise<SearchResult[]> => {
    const query = normalizeQuery(args.query);
    if (!query) {
      return [];
    }

    const credential = process.env.TMDB_API_KEY;
    if (!credential) {
      throw new Error("TMDB_API_KEY is missing.");
    }

    const auth = getTmdbAuthHeadersAndParams(credential);

    const url = new URL("https://api.themoviedb.org/3/search/tv");
    Object.entries(auth.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    url.searchParams.set("include_adult", "false");
    url.searchParams.set("language", "en-US");
    url.searchParams.set("query", query);
    url.searchParams.set("page", "1");

    const response = await fetch(url.toString(), {
      headers: auth.headers,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TMDB search failed (${response.status}): ${errorText}`);
    }

    const payload = await response.json();
    const results = payload?.results ?? [];

    return results.slice(0, 10).map((item: any) => ({
      coverImageUrl: item.poster_path
        ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
        : undefined,
      episodeCount: undefined,
      originalTitle: item.original_name ?? undefined,
      releaseYear: item.first_air_date ? Number(String(item.first_air_date).slice(0, 4)) : undefined,
      source: "tmdb" as const,
      sourceId: String(item.id),
      statusText: item.overview ? "overview available" : undefined,
      title: item.name || item.original_name || "Untitled",
      type: "series" as const,
    }));
  },
});
