"use client";

import { Button } from "@/components/ui/button";
import {
  ENTRY_EDIT_STATUSES,
  ENTRY_SCORES,
  ENTRY_STATUSES,
  type EntryScore,
  type EntryStatus,
  type EntryStatusFilter,
  formatMediaTypeLabel,
  formatStatusLabel,
  type MediaType,
  type PublicMediaEntry,
} from "@/lib/medialist";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Heart, Star } from "lucide-react";

export function MedialistPageIntro({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <section className="space-y-3 border-b px-6 py-10 md:px-10">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Medialist
      </p>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
        {description}
      </p>
    </section>
  );
}

export function TypeTabs({
  onValueChange,
  value,
}: {
  onValueChange: (value: MediaType) => void;
  value: MediaType;
}) {
  return (
    <div className="flex gap-2">
      {(["anime", "series"] as const).map((type) => (
        <Button
          key={type}
          onClick={() => onValueChange(type)}
          size="sm"
          type="button"
          variant={value === type ? "default" : "outline"}
        >
          {formatMediaTypeLabel(type)}
        </Button>
      ))}
    </div>
  );
}

export function StatusFilters({
  onValueChange,
  value,
}: {
  onValueChange: (value: EntryStatusFilter) => void;
  value: EntryStatusFilter;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ENTRY_STATUSES.map((status) => (
        <Button
          key={status}
          onClick={() => onValueChange(status)}
          size="sm"
          type="button"
          variant={value === status ? "secondary" : "outline"}
        >
          {formatStatusLabel(status)}
        </Button>
      ))}
    </div>
  );
}

export function ScoreInput({
  onChange,
  value,
}: {
  onChange: (value?: EntryScore) => void;
  value?: EntryScore;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => onChange(undefined)}
        size="sm"
        type="button"
        variant={!value ? "secondary" : "outline"}
      >
        None
      </Button>
      {ENTRY_SCORES.map((score) => (
        <Button
          key={score}
          onClick={() => onChange(score)}
          size="sm"
          type="button"
          variant={value === score ? "default" : "outline"}
        >
          {score}
        </Button>
      ))}
    </div>
  );
}

export function StatusInput({
  onChange,
  value,
}: {
  onChange: (value: EntryStatus) => void;
  value: EntryStatus;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ENTRY_EDIT_STATUSES.map((status) => (
        <Button
          key={status}
          onClick={() => onChange(status)}
          size="sm"
          type="button"
          variant={value === status ? "default" : "outline"}
        >
          {formatStatusLabel(status)}
        </Button>
      ))}
    </div>
  );
}

export function HeartsAndScore({
  hearted,
  score,
}: {
  hearted: boolean;
  score?: EntryScore;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <Heart className={cn("size-4", hearted && "fill-current text-rose-500")} />
        {hearted ? "Loved" : "No heart"}
      </span>
      <span className="inline-flex items-center gap-1">
        {ENTRY_SCORES.map((value) => (
          <Star
            key={value}
            className={cn(
              "size-4",
              score && value <= score
                ? "fill-current text-amber-500"
                : "text-muted-foreground/30",
            )}
          />
        ))}
      </span>
    </div>
  );
}

export function EntryCard({
  action,
  entry,
}: {
  action?: React.ReactNode;
  entry: PublicMediaEntry;
}) {
  return (
    <article className="grid gap-4 rounded-2xl border bg-card/70 p-4 md:grid-cols-[96px_1fr]">
      <div className="overflow-hidden rounded-xl border bg-muted">
        {entry.coverImageUrl
          ? (
              <img
                alt={entry.title}
                className="aspect-[2/3] h-full w-full object-cover"
                src={entry.coverImageUrl}
              />
            )
          : (
              <div className="flex aspect-[2/3] items-center justify-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                No art
              </div>
            )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{entry.title}</h3>
              <span className="rounded-full border px-2 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {entry.status}
              </span>
              <span className="rounded-full border px-2 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {entry.source}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {entry.releaseYear ?? "Year unknown"} · updated{" "}
              {formatDistanceToNow(entry.updatedAt, { addSuffix: true })}
            </p>
          </div>
          {action}
        </div>

        <HeartsAndScore hearted={entry.hearted} score={entry.score} />

        {entry.comment && (
          <p className="rounded-xl border border-dashed p-3 text-sm leading-6 text-muted-foreground">
            {entry.comment}
          </p>
        )}
      </div>
    </article>
  );
}

export function EmptyState({
  body,
  title,
}: {
  body: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed px-6 py-12 text-center">
      <p className="text-lg font-medium">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
