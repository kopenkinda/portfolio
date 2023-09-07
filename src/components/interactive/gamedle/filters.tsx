import { useFilters } from "./filters.store";
import { MultiFilter } from "./multi-filters";
import { ReleaseDateFilters } from "./year-filters";

export const Filters = () => {
  const filters = useFilters();
  return (
    <div className="grid w-full grid-cols-1 gap-2 rounded-md sm:grid-cols-2 md:grid-cols-3">
      <MultiFilter _key="genres" list={filters.genres} />
      <MultiFilter _key="themes" list={filters.themes} />
      <ReleaseDateFilters />
      <MultiFilter _key="gameModes" list={filters.gameModes} />
      <MultiFilter _key="publisher" list={filters.publisher} />
      <MultiFilter _key="perspectives" list={filters.perspectives} />
    </div>
  );
};
