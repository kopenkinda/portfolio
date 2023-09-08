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

  const modified =
    filters.yearBefore !== "" ||
    filters.yearAfter !== "" ||
    filters.yearExact !== "";

  const parseValue = (value: string) => {
    const parsed = parseInt(value);
    return (isNaN(parsed) ? "" : parsed) + "";
  };
  return (
    <div>
      <Button
        onClick={() => setVisible((v) => !v)}
        className="relative flex w-full items-center justify-center gap-0.5"
      >
        {visible ? <IconCalendarOff stroke={1} /> : <IconCalendar stroke={1} />}
        Release year
        {modified && (
          <span className="absolute right-0 top-0 h-2 w-2 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-violet-400 dark:bg-violet-600" />
        )}
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
              pattern="[0-9]+"
              max={new Date().getFullYear() + 50}
              onChange={(e) =>
                filters.set(() => ({
                  yearBefore: parseValue(e.currentTarget.value),
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
              pattern="[0-9]+"
              max={new Date().getFullYear() + 50}
              onChange={(e) =>
                filters.set(() => ({
                  yearAfter: parseValue(e.currentTarget.value),
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
              pattern="[0-9]+"
              max={new Date().getFullYear() + 50}
              onChange={(e) =>
                filters.set(() => ({
                  yearExact: parseValue(e.currentTarget.value),
                }))
              }
            />
          </div>
        </>
      ) : null}
    </div>
  );
};
