import { useState } from "react";
import { IconCalendar, IconCalendarOff } from "@tabler/icons-react";

import { useFilters } from "./filters.store";
import { Button } from "../Button";
import { useI18n } from "./use-gamedle-i18n";

export const ReleaseDateFilters = () => {
  const t = useI18n();
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

  const set = (
    key: Omit<keyof typeof filters, "set">,
    value: string,
    oldValue: string,
  ) => {
    const newValue = parseValue(value);
    if (newValue === oldValue) return;
    filters.set(() => ({ [key as string]: newValue }));
  };

  return (
    <div>
      <Button
        onClick={() => setVisible((v) => !v)}
        className="relative flex w-full items-center justify-center gap-0.5"
      >
        {visible ? <IconCalendarOff stroke={1} /> : <IconCalendar stroke={1} />}
        {t("gamedle.filters.release-year")}
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
              {t("gamedle.filters.released-before")}
            </label>
            <input
              id="input-yearBefore"
              className="w-full rounded-md border border-neutral-400 bg-transparent px-2 py-0.5 dark:border-neutral-600"
              type="text"
              value={filters.yearBefore}
              pattern="[0-9]+"
              max={new Date().getFullYear() + 50}
              onChange={(e) =>
                set("yearBefore", e.currentTarget.value, filters.yearBefore)
              }
            />
          </div>
          <div>
            <label
              htmlFor="input-yearAfter"
              className="text-sm text-neutral-600 dark:text-neutral-400"
            >
              {t("gamedle.filters.released-after")}
            </label>
            <input
              id="input-yearAfter"
              className="w-full rounded-md border border-neutral-400 bg-transparent px-2 py-0.5 dark:border-neutral-600"
              type="text"
              value={filters.yearAfter}
              pattern="[0-9]+"
              max={new Date().getFullYear() + 50}
              onChange={(e) =>
                set("yearAfter", e.currentTarget.value, filters.yearAfter)
              }
            />
          </div>
          <div>
            <label
              htmlFor="input-yearExact"
              className="text-sm text-neutral-600 dark:text-neutral-400"
            >
              {t("gamedle.filters.released-exact")}
            </label>
            <input
              id="input-yearExact"
              className="w-full rounded-md border border-neutral-400 bg-transparent px-2 py-0.5 dark:border-neutral-600"
              type="text"
              value={filters.yearExact}
              pattern="[0-9]+"
              max={new Date().getFullYear() + 50}
              onChange={(e) =>
                set("yearExact", e.currentTarget.value, filters.yearExact)
              }
            />
          </div>
        </>
      ) : null}
    </div>
  );
};
