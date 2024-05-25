import { cn } from "~/utils/clsx";
import { PlayingCard, type PlayingCardProps } from "./playing-card";
import type { PlayingCardType } from "./playing-card.types";

export type PlayingCardStackProps = {
  cards: PlayingCardType[];
  size?: "small" | "large";
  onSelected?: PlayingCardProps["onSelected"];
  collapsed?: boolean;
};

export const PlayingCardStack = ({
  size = "small",
  cards,
  onSelected,
  collapsed = false,
}: PlayingCardStackProps) => {
  const multiplier = size === "large" ? 2 : 1;
  return (
    <div
      className={cn("relative", {
        "[&>*]:absolute [&>*]:left-0": collapsed,
        "flex gap-2": !collapsed,
        "h-48": size === "large",
        "h-24": size === "small",
      })}
      style={{
        width: collapsed
          ? `${(size === "large" ? 8 : 4) + (cards.length - 1) * multiplier}rem`
          : undefined,
      }}
    >
      {cards.map((card, index) => (
        <PlayingCard
          key={index}
          suit={card.suit}
          value={card.value}
          down={!!card.down}
          onSelected={onSelected}
          size={size}
          style={{
            left: collapsed ? `${index * multiplier}rem` : undefined,
          }}
        />
      ))}
    </div>
  );
};
