import { useState } from "react";
import { Meteors } from "./meteors";
import { IconBrandGithubCopilot } from "@tabler/icons-react";

export const RevealCard = () => {
  const [visible, setVisible] = useState(false);
  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      >
        Узнать подарок
      </button>
    );
  }
  return (
    <>
      <div className="w-[318px] animate-fade-up">
        <div className="relative w-full max-w-xs">
          <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-zinc-700 px-4 py-8 shadow-xl backdrop-blur-sm">
            <div className="z-10 mx-auto flex flex-col items-center">
              <IconBrandGithubCopilot size={64} className="stroke-white" />
              <span className="mb-0.5 mt-2 text-lg font-bold text-white">
                Github Copilot
              </span>
              <span className="mb-2 text-sm text-white/50">1 year access</span>
              <p className="mb-0.5 text-center">
                Небольшой ассистент, который поможет тогда, когда я недоступен
              </p>
              <p className="text-sm text-white/50">PS: меня он не заменит ❤️</p>
            </div>
            <Meteors number={20} />
          </div>
        </div>
      </div>
    </>
  );
};
