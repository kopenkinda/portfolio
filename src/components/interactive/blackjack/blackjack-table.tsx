import { Button } from "../Button";
import { useBlackjack } from "./blackjack.state";
import { PlayingCardDeck } from "./playing-card-deck";
import { PlayingCardStack } from "./playing-card-stack";

export const BlackJackTable = () => {
  const deck = useBlackjack((state) => state.deck);
  const dealerHand = useBlackjack((state) => state.dealerHand);
  const dealerHit = useBlackjack((state) => state.dealerHit);
  const playerHand = useBlackjack((state) => state.playerHand);
  const isPlaying = useBlackjack((state) => state.isPlaying);
  const playerHit = useBlackjack((state) => state.hit);
  const isPlayerBusted = useBlackjack((state) => state.busted);
  const clearHands = useBlackjack((state) => state.clearHands);

  return (
    <div className="flex aspect-square h-full w-full flex-col rounded bg-green-950 p-2">
      <div className="flex justify-end">
        <PlayingCardStack cards={dealerHand} size="large" />
        <div className="mx-auto" />
        <PlayingCardDeck cards={deck} size="small" />
      </div>
      <div className="mt-auto flex">
        <PlayingCardStack cards={playerHand} size="large" collapsed />
        <div className="mx-auto" />
        <div className="flex w-24 flex-col justify-end gap-2">
          {isPlaying() && !isPlayerBusted() ? (
            <>
              <Button className="flex items-center justify-center">Stay</Button>
              <Button
                className="flex items-center justify-center"
                onClick={() => playerHit()}
              >
                Hit
              </Button>
            </>
          ) : (
            <Button
              className="flex items-center justify-center"
              onClick={() => {
                clearHands();
                dealerHit();
                dealerHit(false);
                playerHit();
              }}
            >
              New round
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
