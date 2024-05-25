import { cn } from "~/utils/clsx";
import { PlayingCard } from "./playing-card";
import type { PlayingCardType } from "./playing-card.types";

export type PlayingCardDeckProps = {
  size?: "large" | "small";
  cards: PlayingCardType[];
};

export const PlayingCardDeck = ({
  cards,
  size = "small",
}: PlayingCardDeckProps) => {
  const multiplier = size === "large" ? 0.15 : 0.005;
  return (
    <div
      className={cn("relative [&>*]:absolute [&>*]:left-0", {
        "h-48": size === "large",
        "h-24": size === "small",
      })}
      style={{
        width: `${(size === "large" ? 8 : 4) + (cards.length - 1) * Math.abs(multiplier)}rem`,
      }}
    >
      {cards.map((card, index) => (
        <PlayingCard
          key={index}
          suit={card.suit}
          value={card.value}
          size={size}
          style={{
            left: `${index * multiplier}rem`,
          }}
          down
        />
      ))}
      <span className="!left-auto right-0 top-1/2 z-10 -translate-y-1/2 rounded-bl rounded-tl border bg-green-950 px-2 py-1 text-lg leading-none">
        x{cards.length}
      </span>
    </div>
  );
};
