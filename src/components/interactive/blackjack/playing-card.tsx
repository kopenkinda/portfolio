import {
  IconClubs,
  IconClubsFilled,
  IconDiamonds,
  IconDiamondsFilled,
  IconHeart,
  IconHeartFilled,
  IconSpade,
  IconSpadeFilled,
} from "@tabler/icons-react";
import { cva } from "class-variance-authority";
import { cn } from "~/utils/clsx";
import type { Suit, Value } from "./playing-card.types";
import type { ComponentProps } from "react";

export type PlayingCardProps = {
  onSelected?:
    | ((data: Pick<PlayingCardProps, "suit" | "value">) => void)
    | undefined;
  size?: "large" | "small";
  suit: Suit;
  value: Value;
  down?: boolean;
};

const cardStyles = cva(
  "relative border border-black bg-white ring-inset focus:outline-none focus:ring-2",
  {
    variants: {
      size: {
        small: "h-24 w-16 rounded",
        large: "h-48 w-32 rounded-md",
      },
      suit: {
        spades: "text-black focus:ring-black/70",
        hearts: "text-red-500 focus:ring-red-500/70",
        diamonds: "text-orange-500 focus:ring-orange-500/70",
        clubs: "text-blue-800 focus:ring-blue-800/70",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

const outlineIconStyles = cva(
  "absolute font-black flex flex-col items-center leading-none",
  {
    variants: {
      position: {
        top: "",
        bottom: "flex-col-reverse",
      },
      size: {
        small: "text-xs",
        large: "text-lg",
      },
    },
    compoundVariants: [
      {
        position: "top",
        size: "small",
        className: "left-0.5 top-0.5",
      },
      {
        position: "top",
        size: "large",
        className: "left-2 top-2 gap-1",
      },
      {
        position: "bottom",
        size: "small",
        className: "bottom-0.5 right-0.5",
      },
      {
        position: "bottom",
        size: "large",
        className: "bottom-2 right-2 gap-1",
      },
    ],
  },
);

const suitIcons = {
  spades: {
    outline: IconSpade,
    filled: IconSpadeFilled,
  },
  hearts: {
    outline: IconHeart,
    filled: IconHeartFilled,
  },
  diamonds: {
    outline: IconDiamonds,
    filled: IconDiamondsFilled,
  },
  clubs: {
    outline: IconClubs,
    filled: IconClubsFilled,
  },
};

export const PlayingCard = ({
  onSelected,
  size = "small",
  suit,
  value,
  down = false,
  ...rest
}: PlayingCardProps & ComponentProps<"button">) => {
  const Icon = suitIcons[suit];
  const normalIcon = <Icon.outline size={size === "small" ? 12 : 18} />;
  const disabled = onSelected === undefined || down;
  return (
    <button
      {...rest}
      disabled={disabled}
      className={cn(
        cardStyles({ size, suit }),
        {
          "transition-transform hover:-translate-y-2 focus:-translate-y-2":
            !disabled,
          "bg-gradient-to-tr from-yellow-500 via-amber-600 to-orange-700 ring-4 ring-white":
            down,
        },
        rest.className,
      )}
      onClick={() => onSelected?.({ suit, value })}
    >
      {down ? null : (
        <>
          {" "}
          <span className={outlineIconStyles({ position: "top", size })}>
            {value}
            {normalIcon}
          </span>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Icon.filled size={size === "small" ? 32 : 72} stroke={0} />
          </span>
          <span className={outlineIconStyles({ position: "bottom", size })}>
            {value}
            {normalIcon}
          </span>
        </>
      )}
    </button>
  );
};
