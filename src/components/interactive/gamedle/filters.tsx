import { useFilters } from "./filters.store";
import { MultiFilter } from "./multi-filters";
import { ReleaseDateFilters } from "./year-filters";

import {
  IconBooks,
  IconBooksOff,
  IconBrandAppleArcade,
  IconBrush,
  IconBrushOff,
  IconBuildingSkyscraper,
  IconPerspective,
  IconPerspectiveOff,
} from "@tabler/icons-react";

export const Filters = () => {
  const filters = useFilters();
  return (
    <div className="grid w-full grid-cols-1 gap-2 rounded-md sm:grid-cols-2 md:grid-cols-3">
      <MultiFilter
        icon={<IconBooks stroke={1} />}
        iconOff={<IconBooksOff stroke={1} />}
        _key="genres"
        list={filters.genres}
      />
      <MultiFilter
        icon={<IconBrush stroke={1} />}
        iconOff={<IconBrushOff stroke={1} />}
        _key="themes"
        list={filters.themes}
      />
      <ReleaseDateFilters />
      <MultiFilter
        icon={<IconBrandAppleArcade stroke={1} />}
        _key="gameModes"
        list={filters.gameModes}
      />
      <MultiFilter
        icon={<IconBuildingSkyscraper stroke={1} />}
        _key="publisher"
        list={filters.publisher}
      />
      <MultiFilter
        icon={<IconPerspective stroke={1} />}
        iconOff={<IconPerspectiveOff stroke={1} />}
        _key="perspectives"
        list={filters.perspectives}
      />
    </div>
  );
};
