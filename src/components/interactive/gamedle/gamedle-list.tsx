import { useCallback, useEffect, useMemo, useState } from "react";
import { IconArrowRight, IconLoader, IconRotate } from "@tabler/icons-react";
import { applyFilters, setDefaultFilters } from "~/utils/gamedle/apply-filters";
import type { Game } from "~/utils/gamedle/get-game-info";
import { Filters } from "./filters";
import { useFilters } from "./filters.store";
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    filters.set(() => setDefaultFilters(initial));
  }, []);

  const filtered = useMemo(() => applyFilters(initial, filters), [filters]);

  const showList = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setShowingRev(filters.rev);
      setLoading(false);
    }, 200);
  }, [filters]);

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
          <div className="mt-2 flex items-center justify-center gap-2">
            <Button className="px-2 pl-3" onClick={showList}>
              Show results
              {loading ? (
                <IconLoader stroke={1} className="animate-spin" />
              ) : (
                <IconArrowRight stroke={1} />
              )}
            </Button>
            {filters.rev !== 0 && (
              <Button
                className="p-2"
                onClick={() => {
                  const sure = window.confirm(
                    "Are you sure you want to reset all filters?",
                  );
                  if (!sure) return;
                  filters.set(() => setDefaultFilters(initial));
                }}
              >
                Reset
                <IconRotate stroke={1} className="-m-1 ml-1 rotate-180 p-1" />
              </Button>
            )}
          </div>
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
