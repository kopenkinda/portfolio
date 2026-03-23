import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authSessions: defineTable({
    createdAt: v.number(),
    expiresAt: v.number(),
    tokenHash: v.string(),
    userId: v.id("users"),
  })
    .index("by_tokenHash", ["tokenHash"])
    .index("by_userId", ["userId"]),

  media: defineTable({
    coverImageUrl: v.optional(v.string()),
    episodeCount: v.optional(v.number()),
    originalTitle: v.optional(v.string()),
    releaseYear: v.optional(v.number()),
    searchText: v.string(),
    source: v.union(v.literal("anilist"), v.literal("tmdb")),
    sourceId: v.string(),
    statusText: v.optional(v.string()),
    title: v.string(),
    type: v.union(v.literal("anime"), v.literal("series")),
  })
    .index("by_source_sourceId", ["source", "sourceId"])
    .index("by_type_title", ["type", "title"]),

  mediaEntries: defineTable({
    comment: v.optional(v.string()),
    createdAt: v.number(),
    finishedAt: v.optional(v.number()),
    hearted: v.boolean(),
    mediaId: v.id("media"),
    mediaType: v.union(v.literal("anime"), v.literal("series")),
    score: v.optional(v.union(
      v.literal(1),
      v.literal(2),
      v.literal(3),
      v.literal(4),
      v.literal(5),
    )),
    startedAt: v.optional(v.number()),
    status: v.union(v.literal("watched"), v.literal("dropped")),
    updatedAt: v.number(),
    userId: v.id("users"),
  })
    .index("by_userId_updatedAt", ["userId", "updatedAt"])
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_mediaId", ["userId", "mediaId"])
    .index("by_userId_mediaType_status", ["userId", "mediaType", "status"])
    .index("by_userId_mediaType_updatedAt", ["userId", "mediaType", "updatedAt"]),

  users: defineTable({
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    displayName: v.string(),
    isActive: v.boolean(),
    passwordHash: v.string(),
    publicSlug: v.string(),
    role: v.union(v.literal("owner"), v.literal("friend")),
    username: v.string(),
  })
    .index("by_username", ["username"])
    .index("by_publicSlug", ["publicSlug"]),
});
