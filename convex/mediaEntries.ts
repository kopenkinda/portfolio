import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getSession } from "./auth";

const mediaTypeValidator = v.union(v.literal("anime"), v.literal("series"));
const sourceValidator = v.union(v.literal("anilist"), v.literal("tmdb"));
const statusValidator = v.union(v.literal("watched"), v.literal("dropped"));
const scoreValidator = v.optional(v.union(
  v.literal(1),
  v.literal(2),
  v.literal(3),
  v.literal(4),
  v.literal(5),
));

interface JoinedEntry {
  _id: string;
  comment?: string;
  coverImageUrl?: string;
  hearted: boolean;
  releaseYear?: number;
  score?: 1 | 2 | 3 | 4 | 5;
  source: "anilist" | "tmdb";
  status: "watched" | "dropped";
  title: string;
  type: "anime" | "series";
  updatedAt: number;
}

async function buildEntries(ctx: any, entries: any[]): Promise<JoinedEntry[]> {
  const joined: JoinedEntry[] = [];

  for (const entry of entries) {
    const media = await ctx.db.get(entry.mediaId);
    if (!media) {
      continue;
    }

    joined.push({
      _id: entry._id,
      comment: entry.comment,
      coverImageUrl: media.coverImageUrl,
      hearted: entry.hearted,
      releaseYear: media.releaseYear,
      score: entry.score,
      source: media.source,
      status: entry.status,
      title: media.title,
      type: entry.mediaType,
      updatedAt: entry.updatedAt,
    });
  }

  return joined.sort((left, right) => right.updatedAt - left.updatedAt);
}

async function getUserBySlug(ctx: any, slug: string) {
  return ctx.db
    .query("users")
    .withIndex("by_publicSlug", (query: any) => query.eq("publicSlug", slug))
    .unique();
}

async function getOrCreateMedia(ctx: any, args: {
  providerPayload: {
    coverImageUrl?: string;
    episodeCount?: number;
    originalTitle?: string;
    releaseYear?: number;
    statusText?: string;
    title: string;
  };
  source: "anilist" | "tmdb";
  sourceId: string;
  type: "anime" | "series";
}) {
  const existing = await ctx.db
    .query("media")
    .withIndex("by_source_sourceId", (query: any) =>
      query.eq("source", args.source).eq("sourceId", args.sourceId),
    )
    .unique();

  if (existing) {
    return existing._id;
  }

  return ctx.db.insert("media", {
    coverImageUrl: args.providerPayload.coverImageUrl,
    episodeCount: args.providerPayload.episodeCount,
    originalTitle: args.providerPayload.originalTitle,
    releaseYear: args.providerPayload.releaseYear,
    searchText: args.providerPayload.title.trim().toLowerCase(),
    source: args.source,
    sourceId: args.sourceId,
    statusText: args.providerPayload.statusText,
    title: args.providerPayload.title.trim(),
    type: args.type,
  });
}

export const listPublicByUserSlug = query({
  args: {
    slug: v.string(),
    status: v.optional(statusValidator),
    type: mediaTypeValidator,
  },
  handler: async (ctx, args) => {
    const user = await getUserBySlug(ctx, args.slug);
    if (!user || !user.isActive || user.role !== "owner") {
      return [];
    }

    const entries = args.status
      ? await ctx.db
          .query("mediaEntries")
          .withIndex("by_userId_mediaType_status", (query) =>
            query.eq("userId", user._id).eq("mediaType", args.type).eq("status", args.status!),
          )
          .collect()
      : await ctx.db
          .query("mediaEntries")
          .withIndex("by_userId_mediaType_updatedAt", (query) =>
            query.eq("userId", user._id).eq("mediaType", args.type),
          )
          .collect();

    return buildEntries(ctx, entries);
  },
});

export const listMyEntries = query({
  args: {
    sessionToken: v.string(),
    status: v.optional(statusValidator),
    type: mediaTypeValidator,
  },
  handler: async (ctx, args) => {
    const auth = await getSession(ctx, args.sessionToken);
    if (!auth) {
      throw new Error("Unauthorized.");
    }

    const entries = args.status
      ? await ctx.db
          .query("mediaEntries")
          .withIndex("by_userId_mediaType_status", (query) =>
            query.eq("userId", auth.user._id).eq("mediaType", args.type).eq("status", args.status!),
          )
          .collect()
      : await ctx.db
          .query("mediaEntries")
          .withIndex("by_userId_mediaType_updatedAt", (query) =>
            query.eq("userId", auth.user._id).eq("mediaType", args.type),
          )
          .collect();

    return buildEntries(ctx, entries);
  },
});

export const createFromSourceResult = mutation({
  args: {
    comment: v.optional(v.string()),
    hearted: v.boolean(),
    providerPayload: v.object({
      coverImageUrl: v.optional(v.string()),
      episodeCount: v.optional(v.number()),
      originalTitle: v.optional(v.string()),
      releaseYear: v.optional(v.number()),
      statusText: v.optional(v.string()),
      title: v.string(),
    }),
    score: scoreValidator,
    sessionToken: v.string(),
    source: sourceValidator,
    sourceId: v.string(),
    status: statusValidator,
    type: mediaTypeValidator,
  },
  handler: async (ctx, args) => {
    const auth = await getSession(ctx, args.sessionToken);
    if (!auth) {
      throw new Error("Unauthorized.");
    }

    const mediaId = await getOrCreateMedia(ctx, args);
    const existingEntry = await ctx.db
      .query("mediaEntries")
      .withIndex("by_userId_mediaId", (query) =>
        query.eq("userId", auth.user._id).eq("mediaId", mediaId),
      )
      .unique();

    const now = Date.now();
    if (existingEntry) {
      await ctx.db.patch(existingEntry._id, {
        comment: args.comment?.trim() || undefined,
        hearted: args.hearted,
        score: args.score,
        status: args.status,
        updatedAt: now,
      });

      return { entryId: existingEntry._id, mode: "updated" as const };
    }

    const entryId = await ctx.db.insert("mediaEntries", {
      comment: args.comment?.trim() || undefined,
      createdAt: now,
      hearted: args.hearted,
      mediaId,
      mediaType: args.type,
      score: args.score,
      status: args.status,
      updatedAt: now,
      userId: auth.user._id,
    });

    return { entryId, mode: "created" as const };
  },
});

export const update = mutation({
  args: {
    comment: v.optional(v.string()),
    entryId: v.id("mediaEntries"),
    hearted: v.boolean(),
    score: scoreValidator,
    sessionToken: v.string(),
    status: statusValidator,
  },
  handler: async (ctx, args) => {
    const auth = await getSession(ctx, args.sessionToken);
    if (!auth) {
      throw new Error("Unauthorized.");
    }

    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== auth.user._id) {
      throw new Error("Entry not found.");
    }

    await ctx.db.patch(entry._id, {
      comment: args.comment?.trim() || undefined,
      hearted: args.hearted,
      score: args.score,
      status: args.status,
      updatedAt: Date.now(),
    });

    return { ok: true };
  },
});

export const remove = mutation({
  args: {
    entryId: v.id("mediaEntries"),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await getSession(ctx, args.sessionToken);
    if (!auth) {
      throw new Error("Unauthorized.");
    }

    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== auth.user._id) {
      throw new Error("Entry not found.");
    }

    await ctx.db.delete(entry._id);
    return { ok: true };
  },
});
