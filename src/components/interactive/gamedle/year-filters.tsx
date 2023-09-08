import { useState } from "react";
import { IconCalendar, IconCalendarOff } from "@tabler/icons-react";

import { useFilters } from "./filters.store";
import { Button } from "../Button";

export const ReleaseDateFilters = () => {
  const [visible, setVisible] = useState(false);
  const filters = useFilters((draft) => ({
    yearBefore: draft.yearBefore,
    yearAfter: draft.yearAfter,
    yearExact: draft.yearExact,
    set: draft.set,
  }));

  return (
    <div>
      <Button
        onClick={() => setVisible((v) => !v)}
        className="flex w-full items-center justify-center gap-0.5"
      >
        {visible ? <IconCalendarOff stroke={1} /> : <IconCalendar stroke={1} />}
        Release year
      </Button>

      {visible ? (
        <>
          <div>
            <label
              htmlFor="input-yearBefore"
              className="text-sm text-neutral-600 dark:text-neutral-400"
            >
              Released before
            </label>
            <input
              id="input-yearBefore"
              className="w-full rounded-md border border-neutral-400 bg-transparent px-2 py-0.5 dark:border-neutral-600"
              type="text"
              value={filters.yearBefore}
              min={-1}
              step={1}
              max={new Date().getFullYear() + 50}
              onChange={(e) =>
                filters.set(() => ({
                  yearBefore: e.currentTarget.value,
                }))
              }
            />
          </div>
          <div>
            <label
              htmlFor="input-yearAfter"
              className="text-sm text-neutral-600 dark:text-neutral-400"
            >
              Released after
            </label>
            <input
              id="input-yearAfter"
              className="w-full rounded-md border border-neutral-400 bg-transparent px-2 py-0.5 dark:border-neutral-600"
              type="text"
              value={filters.yearAfter}
              min={-1}
              step={1}
              max={new Date().getFullYear() + 50}
              onChange={(e) =>
                filters.set(() => ({
                  yearAfter: e.currentTarget.value,
                }))
              }
            />
          </div>
          <div>
            <label
              htmlFor="input-yearExact"
              className="text-sm text-neutral-600 dark:text-neutral-400"
            >
              Released exact
            </label>
            <input
              id="input-yearExact"
              className="w-full rounded-md border border-neutral-400 bg-transparent px-2 py-0.5 dark:border-neutral-600"
              type="text"
              value={filters.yearExact}
              min={-1}
              step={1}
              max={new Date().getFullYear() + 50}
              onChange={(e) =>
                filters.set(() => ({
                  yearExact: e.currentTarget.value,
                }))
              }
            />
          </div>
        </>
      ) : null}
    </div>
  );
};
