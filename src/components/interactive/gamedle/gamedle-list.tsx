import { useCallback, useEffect, useMemo, useState } from "react";
import { IconArrowRight, IconLoader, IconRotate } from "@tabler/icons-react";
import { applyFilters, setDefaultFilters } from "~/utils/gamedle/apply-filters";
import type { Game } from "~/utils/gamedle/get-game-info";
import { Filters } from "./filters";
import { useFilters } from "./filters.store";
import GameItem from "./game-item";
import { Button } from "../Button";

const GamedleList = ({ initial }: { initial: Game[] }) => {
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

  const resetFilters = () => {
    const sure = window.confirm("Are you sure you want to reset all filters?");
    if (!sure) return;
    filters.set(() => setDefaultFilters(initial));
  };
  const showingCurrentRev = showingRev === filters.rev;
  const modified = filters.modified();

  return (
    <div className="my-4 w-full space-y-2">
      <Filters />
      <div className="w-full">
        {(!showingCurrentRev || modified) && (
          <div className="my-8 flex items-center justify-center gap-2">
            {!showingCurrentRev && (
              <Button className="px-2 pl-3" onClick={showList}>
                Show {filtered.length} results
                {loading ? (
                  <IconLoader stroke={1} className="animate-spin" />
                ) : (
                  <IconArrowRight stroke={1} />
                )}
              </Button>
            )}
            {modified && (
              <Button className="p-2" onClick={resetFilters}>
                Reset filters
                <IconRotate stroke={1} className="-m-1 ml-1 rotate-180 p-1" />
              </Button>
            )}
          </div>
        )}
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
