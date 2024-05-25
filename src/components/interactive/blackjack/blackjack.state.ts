import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PlayingCardType } from "./playing-card.types";
import { getCardValue, getShoe } from "./blackjack-game";

export type BlackjackState = {
  deck: PlayingCardType[];
  dealerHand: PlayingCardType[];
  playerHand: PlayingCardType[];
  setDeck: (deck: PlayingCardType[]) => void;
  setDealerHand: (dealerHand: PlayingCardType[]) => void;
  setPlayerHand: (playerHand: PlayingCardType[]) => void;
  dealerHit: (open?: boolean) => void;
  dealerBusted: () => boolean;
  dealerStop: () => boolean;
  reset: () => void;
  hit: () => void;
  busted: () => boolean;
  isPlaying: () => boolean;
  clearHands: () => void;
};

export const useBlackjack = create(
  persist<BlackjackState>(
    (set, get) => ({
      deck: getShoe(5),
      dealerHand: [],
      playerHand: [],
      setDeck: (deck) => set({ deck }),
      setDealerHand: (dealerHand) => set({ dealerHand }),
      setPlayerHand: (playerHand) => set({ playerHand }),
      reset: () => set({ deck: getShoe(5), dealerHand: [], playerHand: [] }),
      hit: () => {
        const { playerHand, deck } = get();
        const card = deck.pop();
        if (!card) throw new Error("No more cards in the deck");
        return set({ playerHand: [...playerHand, card], deck });
      },
      busted: () => {
        const { playerHand } = get();
        return (
          playerHand.reduce((acc, card) => acc + getCardValue(card), 0) > 21
        );
      },
      dealerHit: (open = true) => {
        const { deck, dealerHand } = get();
        const card = deck.pop();
        if (!card) throw new Error("No more cards in the deck");
        card.down = !open;
        return set({
          dealerHand: [...dealerHand, card],
          deck,
        });
      },
      dealerBusted() {
        const { dealerHand } = get();
        return (
          dealerHand.reduce((acc, card) => acc + getCardValue(card), 0) > 21
        );
      },
      dealerStop: () => {
        const { dealerHand } = get();
        return (
          dealerHand.reduce((acc, card) => acc + getCardValue(card), 0) >= 17
        );
      },
      isPlaying: () => {
        const { playerHand, dealerHand } = get();
        return playerHand.length > 0 && dealerHand.length > 0;
      },
      clearHands: () => set({ dealerHand: [], playerHand: [] }),
    }),
    {
      name: "blackjack",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
