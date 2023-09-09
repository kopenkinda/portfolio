import { IconArrowRight, IconLoader, IconRotate } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { GamedleTranslations } from "~/i18n/translations/projects/gamedle";
import { applyFilters, setDefaultFilters } from "~/utils/gamedle/apply-filters";
import type { Game } from "~/utils/gamedle/get-game-info";
import { Button } from "../Button";
import { Filters } from "./filters";
import { useFilters } from "./filters.store";
import GameItem from "./game-item";
import { useI18n, useI18nGlobal } from "./use-gamedle-i18n";

const GamedleList = ({
  initial,
  translations,
}: {
  initial: Game[];
  translations: GamedleTranslations;
}) => {
  const [translationsLoaded, setTranslations] = useI18nGlobal((state) => [
    state._loaded,
    state._setTranslations,
  ]);
  const t = useI18n();
  const filters = useFilters();
  const [showingRev, setShowingRev] = useState(-1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTranslations(translations);
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
    const sure = window.confirm(t("gamedle.confirm.reset-all-filters"));
    if (!sure) return;
    filters.set(() => setDefaultFilters(initial));
  };
  const showingCurrentRev = showingRev === filters.rev;
  const modified = filters.modified();

  if (!translationsLoaded) return null;

  return (
    <div className="my-4 w-full space-y-2">
      <Filters />
      <div className="w-full">
        {(!showingCurrentRev || modified) && (
          <div className="my-8 flex items-center justify-center gap-2">
            {!showingCurrentRev && (
              <Button className="px-2 pl-3" onClick={showList}>
                {t("gamedle.show-results.0")}
                {filtered.length}
                {t("gamedle.show-results.1")}
                {loading ? (
                  <IconLoader stroke={1} className="animate-spin" />
                ) : (
                  <IconArrowRight stroke={1} />
                )}
              </Button>
            )}
            {modified && (
              <Button className="p-2" onClick={resetFilters}>
                {t("gamedle.reset-all-filters")}
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
