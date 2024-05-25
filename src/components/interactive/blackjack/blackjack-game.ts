import type { PlayingCardType, Suit, Value } from "./playing-card.types";

export const getShoe = (rolls: number) => {
  const deck: PlayingCardType[] = [];
  if (rolls < 1) return deck;
  for (let i = 0; i < rolls; i++) {
    for (const suit of ["spades", "hearts", "diamonds", "clubs"] as Suit[]) {
      for (const value of [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A",
      ] as Value[]) {
        deck.push({ suit, value });
      }
    }
  }
  return shuffleDeck(deck);
};

export const getCardValue = (card: PlayingCardType) => {
  if (card.value === "A") return 11;
  if (["K", "Q", "J"].includes(card.value)) return 10;
  return parseInt(card.value);
};

export const isBlackJack = (cards: PlayingCardType[]) => {
  if (cards.length !== 2) return false;
  const [card1, card2] = cards;
  const values = [getCardValue(card1!), getCardValue(card2!)];
  const hasAce = values.includes(11);
  const hasTen = values.includes(10);
  return hasAce && hasTen;
};

export const shuffleDeck = (array: PlayingCardType[]) => {
  const shuffled = [...array];
  shuffled.sort(() => Math.random() - 0.5);
  return shuffled;
};
