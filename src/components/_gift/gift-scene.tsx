import { Namedrop } from "./namedrop";
import { PassportProtection } from "./password-protecton";
import { RevealCard } from "./reveal-card";

export const GiftScene = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <PassportProtection>
        <Namedrop>
          <RevealCard />
        </Namedrop>
      </PassportProtection>
    </div>
  );
};
