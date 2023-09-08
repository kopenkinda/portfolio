import { useState, type ReactNode } from "react";
import { type IFilters, type TripleFilter, useFilters } from "./filters.store";
import {
  IconSquare,
  IconSquareCheck,
  IconSquareMinus,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { Button } from "../Button";
import { cn } from "~/utils/clsx";

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
  const [set] = useFilters((draft) => [draft.set]);
  const [visible, setVisible] = useState(false);
  const label = _key.split("").reduce((acc, v, idx) => {
    if (idx === 0) return v.toLocaleUpperCase();
    if (v.toLocaleUpperCase() === v) return acc + " " + v;
    return acc + v;
  }, "");
  return (
    <div className="flex flex-col items-start gap-0.5">
      <Button
        onClick={() => setVisible((v) => !v)}
        className="flex w-full items-center justify-center gap-0.5"
      >
        {visible
          ? iconOff || <IconEyeOff stroke={1} />
          : icon || <IconEye stroke={1} />}
        <span>{label}</span>
      </Button>
      {visible ? (
        <>
          {Object.entries(list).map(([item, value]) => (
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
