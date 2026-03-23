"use client";

import type {
  EntryScore,
  EntryStatus,
  EntryStatusFilter,
  MediaType,
  PublicMediaEntry,
  SearchResult,
} from "@/lib/medialist";
import {
  EmptyState,
  EntryCard,
  MedialistPageIntro,
  ScoreInput,
  StatusFilters,
  StatusInput,
  TypeTabs,
} from "@/app/medialist/_components/shared";
import { useMedialistAuth } from "@/components/providers/medialist-auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EditorState {
  comment: string;
  hearted: boolean;
  score?: EntryScore;
  status: EntryStatus;
}

function SearchResultCard({
  onSelect,
  result,
}: {
  onSelect: (result: SearchResult) => void;
  result: SearchResult;
}) {
  return (
    <button
      className="grid w-full gap-4 rounded-xl border p-3 text-left transition-colors hover:bg-accent/40 md:grid-cols-[64px_1fr]"
      onClick={() => onSelect(result)}
      type="button"
    >
      <div className="overflow-hidden rounded-lg border bg-muted">
        {result.coverImageUrl
          ? (
              <img
                alt={result.title}
                className="aspect-[2/3] h-full w-full object-cover"
                src={result.coverImageUrl}
              />
            )
          : (
              <div className="flex aspect-[2/3] items-center justify-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                No art
              </div>
            )}
      </div>
      <div className="space-y-1">
        <p className="font-medium">{result.title}</p>
        <p className="text-sm text-muted-foreground">
          {result.releaseYear ?? "Year unknown"}
          {result.originalTitle ? ` · ${result.originalTitle}` : ""}
        </p>
      </div>
    </button>
  );
}

function EntryEditor({
  onCancel,
  onConfirm,
  pending,
  title,
  values,
}: {
  onCancel: () => void;
  onConfirm: (values: EditorState) => Promise<void>;
  pending: boolean;
  title: string;
  values: EditorState;
}) {
  const [state, setState] = useState(values);

  useEffect(() => {
    setState(values);
  }, [values]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Set status, score, heart, optional comment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Status</p>
          <StatusInput
            onChange={(status) => setState((current) => ({ ...current, status }))}
            value={state.status}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Score</p>
          <ScoreInput
            onChange={(score) => setState((current) => ({ ...current, score }))}
            value={state.score}
          />
        </div>

        <button
          className={cn(
            "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
            state.hearted && "border-rose-500 text-rose-500",
          )}
          onClick={() => setState((current) => ({ ...current, hearted: !current.hearted }))}
          type="button"
        >
          <Heart className={cn("size-4", state.hearted && "fill-current")} />
          {state.hearted ? "Heart left" : "Leave heart"}
        </button>

        <label className="grid gap-2 text-sm">
          <span>Comment</span>
          <textarea
            className="min-h-24 rounded-md border bg-background px-3 py-2"
            onChange={(event) => setState((current) => ({ ...current, comment: event.target.value }))}
            placeholder="Optional note"
            value={state.comment}
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <Button disabled={pending} onClick={() => onConfirm(state)} type="button">
            {pending ? "Saving..." : "Save"}
          </Button>
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ManageMedialistPage() {
  const configured = useMedialistAuth().configured;

  if (!configured) {
    return (
      <main className="mx-auto w-container border">
        <MedialistPageIntro
          description="Add Convex env vars first."
          title="Medialist manage unavailable"
        />
      </main>
    );
  }

  return <ManageMedialistPageInner />;
}

function ManageMedialistPageInner() {
  const router = useRouter();
  const { isAuthenticated, loading, logout, sessionToken, viewer } = useMedialistAuth();
  const [type, setType] = useState<MediaType>("anime");
  const [status, setStatus] = useState<EntryStatusFilter>("all");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchPending, setSearchPending] = useState(false);
  const [draftResult, setDraftResult] = useState<SearchResult | null>(null);
  const [editingEntry, setEditingEntry] = useState<PublicMediaEntry | null>(null);
  const [savePending, setSavePending] = useState(false);

  const entries = useQuery(
    api.mediaEntries.listMyEntries,
    sessionToken
      ? {
          sessionToken,
          status: status === "all" ? undefined : status,
          type,
        }
      : "skip",
  ) as PublicMediaEntry[] | undefined;

  const createEntry = useMutation(api.mediaEntries.createFromSourceResult);
  const updateEntry = useMutation(api.mediaEntries.update);
  const removeEntry = useMutation(api.mediaEntries.remove);
  const searchAnime = useAction(api.media.searchAnime);
  const searchSeries = useAction(api.media.searchSeries);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/medialist/login");
    }
  }, [isAuthenticated, loading, router]);

  return (
    <main className="mx-auto w-container border">
      <MedialistPageIntro
        description="Search AniList or TMDB, add entries, then keep status/score/comments current."
        title={viewer ? `${viewer.displayName}'s edit desk` : "Manage medialist"}
      />

      <section className="space-y-8 px-6 py-8 md:px-10">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TypeTabs
              onValueChange={(nextType) => {
                setType(nextType);
                setSearchResults([]);
                setSearchError(null);
              }}
              value={type}
            />
            <Button onClick={() => logout().then(() => router.replace("/medialist"))} type="button" variant="outline">
              Sign out
            </Button>
          </div>

          <form
            className="flex flex-col gap-3 md:flex-row"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!sessionToken) {
                return;
              }

              const formData = new FormData(event.currentTarget);
              const query = String(formData.get("query") ?? "").trim();
              if (!query) {
                setSearchResults([]);
                return;
              }

              setSearchPending(true);
              setSearchError(null);

              try {
                const results = type === "anime"
                  ? await searchAnime({ query })
                  : await searchSeries({ query });
                setSearchResults(results as SearchResult[]);
              } catch (caughtError) {
                setSearchError(caughtError instanceof Error ? caughtError.message : "Search failed.");
              } finally {
                setSearchPending(false);
              }
            }}
          >
            <input
              className="h-11 flex-1 rounded-md border bg-background px-4"
              name="query"
              placeholder={type === "anime" ? "Search AniList anime" : "Search TMDB series"}
              type="text"
            />
            <Button disabled={searchPending} type="submit">
              {searchPending ? "Searching..." : "Search"}
            </Button>
          </form>

          {searchError && <p className="text-sm text-destructive">{searchError}</p>}

          {searchResults.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {searchResults.map((result) => (
                <SearchResultCard
                  key={`${result.source}-${result.sourceId}`}
                  onSelect={setDraftResult}
                  result={result}
                />
              ))}
            </div>
          )}
        </div>

        {draftResult && sessionToken && (
          <EntryEditor
            onCancel={() => setDraftResult(null)}
            onConfirm={async (values) => {
              setSavePending(true);
              try {
                await createEntry({
                  comment: values.comment.trim() || undefined,
                  hearted: values.hearted,
                  providerPayload: {
                    coverImageUrl: draftResult.coverImageUrl,
                    episodeCount: draftResult.episodeCount,
                    originalTitle: draftResult.originalTitle,
                    releaseYear: draftResult.releaseYear,
                    statusText: draftResult.statusText,
                    title: draftResult.title,
                  },
                  score: values.score,
                  sessionToken,
                  source: draftResult.source,
                  sourceId: draftResult.sourceId,
                  status: values.status,
                  type: draftResult.type,
                });
                setDraftResult(null);
              } finally {
                setSavePending(false);
              }
            }}
            pending={savePending}
            title={`Add ${draftResult.title}`}
            values={{ comment: "", hearted: false, score: undefined, status: "watched" }}
          />
        )}

        {editingEntry && sessionToken && (
          <EntryEditor
            onCancel={() => setEditingEntry(null)}
            onConfirm={async (values) => {
              setSavePending(true);
              try {
                await updateEntry({
                  comment: values.comment.trim() || undefined,
                  entryId: editingEntry._id as any,
                  hearted: values.hearted,
                  score: values.score,
                  sessionToken,
                  status: values.status,
                });
                setEditingEntry(null);
              } finally {
                setSavePending(false);
              }
            }}
            pending={savePending}
            title={`Edit ${editingEntry.title}`}
            values={{
              comment: editingEntry.comment ?? "",
              hearted: editingEntry.hearted,
              score: editingEntry.score,
              status: editingEntry.status,
            }}
          />
        )}

        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold">Your entries</h2>
            <StatusFilters onValueChange={setStatus} value={status} />
          </div>

          {entries === undefined
            ? (
                <p className="text-sm text-muted-foreground">Loading entries...</p>
              )
            : entries.length === 0
              ? (
                  <EmptyState
                    body="Search above and add the first item."
                    title="No entries yet"
                  />
                )
              : (
                  <div className="grid gap-4">
                    {entries.map((entry) => (
                      <EntryCard
                        key={entry._id}
                        action={(
                          <div className="flex gap-2">
                            <Button onClick={() => setEditingEntry(entry)} size="sm" type="button" variant="outline">
                              <Pencil className="size-4" />
                              Edit
                            </Button>
                            <Button
                              onClick={async () => {
                                if (!sessionToken) {
                                  return;
                                }
                                await removeEntry({ entryId: entry._id as any, sessionToken });
                                if (editingEntry?._id === entry._id) {
                                  setEditingEntry(null);
                                }
                              }}
                              size="sm"
                              type="button"
                              variant="outline"
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </Button>
                          </div>
                        )}
                        entry={entry}
                      />
                    ))}
                  </div>
                )}
        </div>
      </section>
    </main>
  );
}
