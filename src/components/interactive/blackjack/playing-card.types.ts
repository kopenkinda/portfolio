export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type Value =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

export type PlayingCardType = {
  suit: Suit;
  value: Value;
  down?: boolean;
};
