"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { createContext, useContext, useState } from "react";

const ConvexConfiguredContext = createContext(false);

export function useConvexConfigured() {
  return useContext(ConvexConfiguredContext);
}

export function AppConvexProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line node/prefer-global/process
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const [client] = useState(() => (url ? new ConvexReactClient(url) : null));

  if (!url || !client) {
    return (
      <ConvexConfiguredContext.Provider value={false}>
        {children}
      </ConvexConfiguredContext.Provider>
    );
  }

  return (
    <ConvexConfiguredContext.Provider value>
      <ConvexProvider client={client}>
        {children}
      </ConvexProvider>
    </ConvexConfiguredContext.Provider>
  );
}
