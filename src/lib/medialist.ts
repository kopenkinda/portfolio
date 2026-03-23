export const MEDIA_TYPES = ["anime", "series"] as const;
export const ENTRY_STATUSES = ["all", "watched", "dropped"] as const;
export const ENTRY_EDIT_STATUSES = ["watched", "dropped"] as const;
export const ENTRY_SCORES = [1, 2, 3, 4, 5] as const;

export type MediaType = (typeof MEDIA_TYPES)[number];
export type EntryStatus = Exclude<(typeof ENTRY_STATUSES)[number], "all">;
export type EntryStatusFilter = (typeof ENTRY_STATUSES)[number];
export type EntryScore = (typeof ENTRY_SCORES)[number];

export interface SearchResult {
  coverImageUrl?: string;
  episodeCount?: number;
  originalTitle?: string;
  releaseYear?: number;
  source: "anilist" | "tmdb";
  sourceId: string;
  statusText?: string;
  title: string;
  type: MediaType;
}

export interface PublicMediaEntry {
  _id: string;
  comment?: string;
  coverImageUrl?: string;
  hearted: boolean;
  releaseYear?: number;
  score?: EntryScore;
  source: "anilist" | "tmdb";
  status: EntryStatus;
  title: string;
  type: MediaType;
  updatedAt: number;
}

export function formatStatusLabel(status: EntryStatusFilter) {
  if (status === "all") {
    return "All";
  }

  return status.slice(0, 1).toUpperCase() + status.slice(1);
}

export function formatMediaTypeLabel(type: MediaType) {
  return type === "anime" ? "Anime" : "Series";
}

export function isConvexConfigured() {
  // eslint-disable-next-line node/prefer-global/process
  return Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
}
