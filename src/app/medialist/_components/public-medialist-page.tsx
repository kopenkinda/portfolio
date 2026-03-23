"use client";

import type { EntryStatusFilter, MediaType, PublicMediaEntry } from "@/lib/medialist";
import {
  EmptyState,
  EntryCard,
  MedialistPageIntro,
  StatusFilters,
  TypeTabs,
} from "@/app/medialist/_components/shared";
import { useConvexConfigured } from "@/components/providers/convex-provider";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";

export function PublicMedialistPage() {
  const configured = useConvexConfigured();

  if (!configured) {
    return (
      <main className="mx-auto w-container border">
        <MedialistPageIntro
          description="Add NEXT_PUBLIC_CONVEX_URL and deploy the Convex backend first."
          title="Medialist setup incomplete"
        />
      </main>
    );
  }

  return <PublicMedialistPageInner />;
}

function PublicMedialistPageInner() {
  const [type, setType] = useState<MediaType>("anime");
  const [status, setStatus] = useState<EntryStatusFilter>("all");
  const owner = useQuery(api.users.getPublicOwnerProfile, {});
  const entries = useQuery(
    api.mediaEntries.listPublicByUserSlug,
    owner
      ? {
          slug: owner.publicSlug,
          status: status === "all" ? undefined : status,
          type,
        }
      : "skip",
  ) as PublicMediaEntry[] | undefined;

  return (
    <main className="mx-auto w-container border">
      <MedialistPageIntro
        description="Anime and series I finished, dropped, scored, or just hearted."
        title={owner ? `${owner.displayName}'s medialist` : "Medialist"}
      />

      <section className="space-y-6 px-6 py-8 md:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <TypeTabs onValueChange={setType} value={type} />
          <div className="flex items-center gap-2">
            <Link className="text-sm text-muted-foreground underline-offset-4 hover:underline" href="/medialist/login">
              Edit list
            </Link>
          </div>
        </div>

        <StatusFilters onValueChange={setStatus} value={status} />

        {entries === undefined
          ? (
              <p className="text-sm text-muted-foreground">Loading entries...</p>
            )
          : entries.length === 0
            ? (
                <EmptyState
                  body="Nothing in this slice yet."
                  title="No entries"
                />
              )
            : (
                <div className="grid gap-4">
                  {entries.map((entry) => <EntryCard key={entry._id} entry={entry} />)}
                </div>
              )}
      </section>
    </main>
  );
}
