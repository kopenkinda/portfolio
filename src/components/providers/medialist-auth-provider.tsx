"use client";

import { useConvexConfigured } from "@/components/providers/convex-provider";
import { api } from "@convex/_generated/api";
import { useConvex, useQuery } from "convex/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface Viewer {
  displayName: string;
  publicSlug: string;
  role: "owner" | "friend";
  userId: string;
  username: string;
}

interface MedialistAuthContextValue {
  configured: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  login: (values: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  sessionToken: string | null;
  viewer: Viewer | null | undefined;
}

const SESSION_STORAGE_KEY = "medialist.session-token";

const MedialistAuthContext = createContext<MedialistAuthContextValue | null>(null);

function MedialistAuthProviderInner({ children }: { children: React.ReactNode }) {
  const convex = useConvex();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const viewer = useQuery(
    api.users.getViewer,
    hydrated && sessionToken ? { sessionToken } : "skip",
  ) as Viewer | null | undefined;

  useEffect(() => {
    const storedValue = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedValue) {
      setSessionToken(storedValue);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (viewer === null && sessionToken) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      setSessionToken(null);
    }
  }, [hydrated, sessionToken, viewer]);

  const value = useMemo<MedialistAuthContextValue>(() => ({
    configured: true,
    isAuthenticated: Boolean(sessionToken && viewer),
    loading: !hydrated || (Boolean(sessionToken) && viewer === undefined),
    login: async ({ password, username }) => {
      const result = await convex.mutation(api.users.login, { password, username });
      window.localStorage.setItem(SESSION_STORAGE_KEY, result.sessionToken);
      setSessionToken(result.sessionToken);
    },
    logout: async () => {
      if (sessionToken) {
        await convex.mutation(api.users.logout, { sessionToken });
      }
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      setSessionToken(null);
    },
    sessionToken,
    viewer,
  }), [convex, hydrated, sessionToken, viewer]);

  return (
    <MedialistAuthContext.Provider value={value}>
      {children}
    </MedialistAuthContext.Provider>
  );
}

export function MedialistAuthProvider({ children }: { children: React.ReactNode }) {
  const configured = useConvexConfigured();
  const fallbackValue = useMemo<MedialistAuthContextValue>(() => ({
    configured: false,
    isAuthenticated: false,
    loading: false,
    login: async () => {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is missing.");
    },
    logout: async () => {},
    sessionToken: null,
    viewer: null,
  }), []);

  if (!configured) {
    return (
      <MedialistAuthContext.Provider value={fallbackValue}>
        {children}
      </MedialistAuthContext.Provider>
    );
  }

  return <MedialistAuthProviderInner>{children}</MedialistAuthProviderInner>;
}

export function useMedialistAuth() {
  const context = useContext(MedialistAuthContext);
  if (!context) {
    throw new Error("useMedialistAuth must be used inside MedialistAuthProvider.");
  }
  return context;
}
