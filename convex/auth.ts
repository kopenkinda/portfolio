import type { MutationCtx, QueryCtx } from "./_generated/server";
import bcrypt from "bcryptjs";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export async function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compareSync(password, passwordHash);
}

export async function hashSessionToken(token: string) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export function createSessionToken() {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
}

export async function getSession(ctx: QueryCtx | MutationCtx, sessionToken?: string | null) {
  if (!sessionToken) {
    return null;
  }

  const tokenHash = await hashSessionToken(sessionToken);
  const session = await ctx.db
    .query("authSessions")
    .withIndex("by_tokenHash", (query) => query.eq("tokenHash", tokenHash))
    .unique();

  if (!session || session.expiresAt < Date.now()) {
    return null;
  }

  const user = await ctx.db.get(session.userId);
  if (!user || !user.isActive) {
    return null;
  }

  return { session, user };
}

export function getSessionExpiration() {
  return Date.now() + SESSION_TTL_MS;
}
