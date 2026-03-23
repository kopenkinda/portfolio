"use node";

import process from "node:process";
import { makeFunctionReference } from "convex/server";
import { v } from "convex/values";
import { action } from "./_generated/server";

const seedOwnerMutation = makeFunctionReference<"mutation">("users:seedOwner");
const seedFriendMutation = makeFunctionReference<"mutation">("users:seedFriend");

function assertSeedSecret(seedSecret: string) {
  const expectedSecret = process.env.ADMIN_SEED_SECRET;
  if (!expectedSecret || seedSecret !== expectedSecret) {
    throw new Error("Invalid seed secret.");
  }
}

export const seedOwner = action({
  args: {
    displayName: v.string(),
    password: v.string(),
    publicSlug: v.string(),
    seedSecret: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    assertSeedSecret(args.seedSecret);

    return ctx.runMutation(seedOwnerMutation, {
      displayName: args.displayName,
      password: args.password,
      publicSlug: args.publicSlug,
      username: args.username,
    });
  },
});

export const seedFriend = action({
  args: {
    displayName: v.string(),
    password: v.string(),
    publicSlug: v.string(),
    role: v.optional(v.union(v.literal("owner"), v.literal("friend"))),
    seedSecret: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    assertSeedSecret(args.seedSecret);

    return ctx.runMutation(seedFriendMutation, {
      displayName: args.displayName,
      password: args.password,
      publicSlug: args.publicSlug,
      role: args.role,
      username: args.username,
    });
  },
});
