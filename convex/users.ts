import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import {
  createSessionToken,
  getSession,
  getSessionExpiration,
  hashPassword,
  hashSessionToken,
  normalizeSlug,
  normalizeUsername,
  verifyPassword,
} from "./auth";

export const roleValidator = v.union(v.literal("owner"), v.literal("friend"));

async function assertNoUserCollision(ctx: any, username: string, publicSlug: string) {
  const existingByUsername = await ctx.db
    .query("users")
    .withIndex("by_username", (query: any) => query.eq("username", username))
    .unique();

  if (existingByUsername) {
    throw new Error("Username already exists.");
  }

  const existingBySlug = await ctx.db
    .query("users")
    .withIndex("by_publicSlug", (query: any) => query.eq("publicSlug", publicSlug))
    .unique();

  if (existingBySlug) {
    throw new Error("Public slug already exists.");
  }
}

export const getPublicOwnerProfile = query({
  args: {},
  handler: async (ctx) => {
    const owner = await ctx.db
      .query("users")
      .filter((query) => query.eq(query.field("role"), "owner"))
      .first();

    if (!owner || !owner.isActive) {
      return null;
    }

    return {
      displayName: owner.displayName,
      publicSlug: owner.publicSlug,
      role: owner.role,
      username: owner.username,
    };
  },
});

export const getViewer = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auth = await getSession(ctx, args.sessionToken);
    if (!auth) {
      return null;
    }

    return {
      displayName: auth.user.displayName,
      publicSlug: auth.user.publicSlug,
      role: auth.user.role,
      userId: auth.user._id,
      username: auth.user.username,
    };
  },
});

export const login = mutation({
  args: {
    password: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const username = normalizeUsername(args.username);

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (query) => query.eq("username", username))
      .unique();

    if (!user || !user.isActive) {
      throw new Error("Invalid credentials.");
    }

    const isValid = await verifyPassword(args.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials.");
    }

    const sessionToken = createSessionToken();
    await ctx.db.insert("authSessions", {
      createdAt: Date.now(),
      expiresAt: getSessionExpiration(),
      tokenHash: await hashSessionToken(sessionToken),
      userId: user._id,
    });

    return {
      sessionToken,
      user: {
        displayName: user.displayName,
        publicSlug: user.publicSlug,
        role: user.role,
        userId: user._id,
        username: user.username,
      },
    };
  },
});

export const logout = mutation({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const tokenHash = await hashSessionToken(args.sessionToken);
    const session = await ctx.db
      .query("authSessions")
      .withIndex("by_tokenHash", (query) => query.eq("tokenHash", tokenHash))
      .unique();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { ok: true };
  },
});

export const seedOwner = internalMutation({
  args: {
    displayName: v.string(),
    password: v.string(),
    publicSlug: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const username = normalizeUsername(args.username);
    const publicSlug = normalizeSlug(args.publicSlug);

    await assertNoUserCollision(ctx, username, publicSlug);

    const userId = await ctx.db.insert("users", {
      displayName: args.displayName.trim(),
      isActive: true,
      passwordHash: await hashPassword(args.password),
      publicSlug,
      role: "owner",
      username,
    });

    return { userId };
  },
});

export const seedFriend = internalMutation({
  args: {
    displayName: v.string(),
    password: v.string(),
    publicSlug: v.string(),
    role: v.optional(roleValidator),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const username = normalizeUsername(args.username);
    const publicSlug = normalizeSlug(args.publicSlug);

    await assertNoUserCollision(ctx, username, publicSlug);

    const userId = await ctx.db.insert("users", {
      displayName: args.displayName.trim(),
      isActive: true,
      passwordHash: await hashPassword(args.password),
      publicSlug,
      role: args.role ?? "friend",
      username,
    });

    return { userId };
  },
});
