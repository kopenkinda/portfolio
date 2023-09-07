import { forwardRef, type ComponentProps } from "react";
import { cn } from "~/utils/clsx";

export const Button = forwardRef<HTMLButtonElement, ComponentProps<"button">>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center rounded border border-neutral-200 bg-neutral-50 p-1 text-sm leading-4 text-neutral-900 no-underline dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
          className,
        )}
        {...props}
      />
    );
  },
);
