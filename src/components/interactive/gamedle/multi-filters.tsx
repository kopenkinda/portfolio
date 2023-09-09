import { useState, type ReactNode } from "react";
import {
  type IFilters,
  type TripleFilter,
  useFilters,
  filterKeyToTranslationKey,
} from "./filters.store";
import {
  IconSquare,
  IconSquareCheck,
  IconSquareMinus,
  IconEye,
  IconEyeOff,
  IconSearch,
  IconFilterMinus,
  IconFilterCancel,
} from "@tabler/icons-react";
import { Button } from "../Button";
import { cn } from "~/utils/clsx";
import { useI18n } from "./use-gamedle-i18n";

export const MultiFilter = ({
  _key,
  list,
  icon,
  iconOff,
}: {
  _key: keyof IFilters;
  list: Record<string, TripleFilter>;
  icon?: ReactNode;
  iconOff?: ReactNode;
}) => {
  const t = useI18n();
  const [search, setSearch] = useState("");
  const [set] = useFilters((draft) => [draft.set]);
  const [visible, setVisible] = useState(false);

  const label = t(filterKeyToTranslationKey(_key));

  const hasSearched = search !== "";

  const _list = Object.entries(list);

  const modifiedCount = _list.filter(
    ([, filter]) => filter !== "non-selected",
  ).length;

  const allFiltersChecked = _list.every(
    ([, filter]) => filter !== "non-selected",
  );

  const visibleItems = !hasSearched
    ? _list
    : _list.filter(([key]) =>
        key.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      );

  return (
    <div className="flex flex-col items-start gap-0.5">
      <Button
        onClick={() => setVisible((v) => !v)}
        className="relative flex w-full items-center justify-center gap-0.5"
      >
        {visible
          ? iconOff || <IconEyeOff stroke={1} />
          : icon || <IconEye stroke={1} />}
        <span>{label}</span>
        {modifiedCount > 0 && (
          <span className="absolute right-0 top-0 h-2 w-2 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-violet-400 dark:bg-violet-600" />
        )}
      </Button>
      {visible ? (
        <>
          <div className="flex w-full items-center gap-1">
            <div className="relative my-2 w-full">
              <IconSearch
                size={16}
                stroke={2}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 text-neutral-200 dark:text-neutral-700"
              />
              <input
                type="text"
                value={search}
                className="w-full rounded-md border border-neutral-200 bg-transparent p-1 pl-6 dark:border-neutral-700"
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  t("gamedle.search") + `"${label.toLocaleLowerCase()}"`
                }
              />
            </div>
            {!hasSearched && !allFiltersChecked && (
              <Button
                className="aspect-square p-2"
                title={t("gamedle.diselect-other-filter-options")}
                onClick={() => {
                  set({
                    [_key]: _list
                      .map(([item, value]) => {
                        if (value !== "enabled")
                          return [item, "disabled"] as const;
                        return [item, "enabled"] as const;
                      })
                      .reduce(
                        (acc, [item, value]) => {
                          acc[item] = value;
                          return acc;
                        },
                        {} as Record<string, TripleFilter>,
                      ),
                  });
                }}
              >
                <IconFilterMinus stroke={1} size={16} />
              </Button>
            )}
            {!hasSearched && allFiltersChecked && (
              <Button
                className="aspect-square p-2"
                title={t("gamedle.reset-filter.title")}
                onClick={() => {
                  const sure = window.confirm(
                    t("gamedle.reset-filter.0") +
                      `"${label}"` +
                      t("gamedle.reset-filter.1"),
                  );
                  if (!sure) return;
                  set({
                    [_key]: _list.reduce(
                      (acc, [item]) => {
                        acc[item] = "non-selected";
                        return acc;
                      },
                      {} as Record<string, TripleFilter>,
                    ),
                  });
                }}
              >
                <IconFilterCancel stroke={1} size={16} />
              </Button>
            )}
          </div>
          {visibleItems.map(([item, value]) => (
            <button
              key={item}
              onClick={() => {
                if (value === "disabled") {
                  set({
                    [_key]: { ...list, [item]: "enabled" },
                  });
                } else if (value === "enabled") {
                  set({
                    [_key]: { ...list, [item]: "non-selected" },
                  });
                } else {
                  set({
                    [_key]: { ...list, [item]: "disabled" },
                  });
                }
              }}
              className={cn(
                "grid grid-cols-[1.5rem_1fr] place-items-center gap-0.5 text-sm",
                {
                  "text-neutral-400 dark:text-neutral-500":
                    value === "disabled",
                  "text-neutral-600 dark:text-neutral-400":
                    value === "non-selected",
                  "text-primary-600 dark:text-primary-400": value === "enabled",
                },
              )}
            >
              {value === "non-selected" ? (
                <IconSquare stroke={1} />
              ) : value === "disabled" ? (
                <IconSquareMinus stroke={1} />
              ) : (
                <IconSquareCheck stroke={1} />
              )}
              {item}
            </button>
          ))}
        </>
      ) : null}
    </div>
  );
};
