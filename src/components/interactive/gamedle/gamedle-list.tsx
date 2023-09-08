import { useEffect, useMemo, useState } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { applyFilters } from "~/utils/gamedle/apply-filters";
import type { Game } from "~/utils/gamedle/get-game-info";
import { Filters } from "./filters";
import { useFilters, type TripleFilter } from "./filters.store";
import GameItem from "./game-item";
import { Button } from "../Button";

const GamedleList = ({
  initial,
  lastUpdated,
}: {
  initial: Game[];
  lastUpdated: Date;
}) => {
  const filters = useFilters();
  const [showingRev, setShowingRev] = useState(-1);
  useEffect(() => {
    const genres = new Set<string>();
    const publishers = new Set<string>();
    const themes = new Set<string>();
    for (const game of initial) {
      for (const genre of game.genres) {
        genres.add(genre.name);
      }
      for (const publisher of game.involved_companies) {
        publishers.add(publisher.name);
      }
      for (const theme of game.themes) {
        themes.add(theme.name);
      }
    }
    const finalGenres: Record<string, TripleFilter> = {};
    const finalPublishers: Record<string, TripleFilter> = {};
    const finalThemes: Record<string, TripleFilter> = {};
    for (const genre of genres) {
      finalGenres[genre] = "non-selected";
    }
    for (const publisher of publishers) {
      finalPublishers[publisher] = "non-selected";
    }
    for (const theme of themes) {
      finalThemes[theme] = "non-selected";
    }
    filters.set(() => ({
      genres: finalGenres,
      publisher: finalPublishers,
      themes: finalThemes,
    }));
  }, []);
  const filtered = useMemo(() => applyFilters(initial, filters), [filters]);
  return (
    <div className="my-4 w-full space-y-2">
      <Filters />
      <div className="w-full">
        <p className="mt-12 text-center">
          <span className="font-bold">{filtered.length}</span> games found |
          Last update:{" "}
          <span className="font-bold">
            {lastUpdated.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
        {filters.rev !== showingRev ? (
          <Button
            className="mx-auto mt-2 flex items-center justify-center gap-0.5 px-2 pl-3"
            onClick={() => {
              setShowingRev(filters.rev);
            }}
          >
            Show results
            <IconArrowRight stroke={1} />
          </Button>
        ) : null}
        {filters.rev === showingRev ? (
          <div className="animate-fade-up">
            {filtered.map((game) => (
              <GameItem game={game} key={game.label} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GamedleList;
