import {
  At,
  BrandNextjs,
  BrandTailwind,
  FileCertificate,
} from "tabler-icons-react";
import IconLink from "../ui/icon-link";
import Typescript from "../ui/missing-icons/typescript";
import VSCode from "../ui/missing-icons/vscode";

export default function AboutMe() {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <img
        src="/dk-memoji.png"
        className="h-40 w-40 rounded-lg lg:h-56 lg:w-56"
        alt=""
      />
      <div className="max-w-prose">
        <p>👨🏻‍🎓 Senior Student Mentor at YNOV Toulouse.</p>
        <p>In 😍 with all things web</p>
        <p className="mb-4"></p>
        <p></p>
        <p>I build stuff using these tools:</p>
        <div className="mt-2 mb-3 grid grid-cols-2 gap-2">
          <IconLink
            className={[
              "hover:border-[#3178c6]",
              "focus:border-[#3178c6]",
              "hover:bg-[#3178c6]",
              "focus:bg-[#3178c6]",
              "hover:text-white",
              "focus:text-white",
            ].join(" ")}
            href="https://www.typescriptlang.org/"
            icon={<Typescript className="h-4 w-4 border border-white" />}
            text="TypeScript"
            blank
          />
          <IconLink
            className={[
              "hover:border-black",
              "focus:border-black",
              "hover:bg-black",
              "focus:bg-black",
              "hover:text-white",
              "focus:text-white",
            ].join(" ")}
            href="https://nextjs.org/"
            icon={<BrandNextjs className="h-4 w-4" />}
            text="Next.js"
            blank
          />
          <IconLink
            className={[
              "group",
              "hover:border-[#36bdf9]",
              "hover:bg-[#36bdf9]",
              "focus:border-[#36bdf9]",
              "focus:bg-[#36bdf9]",
              "hover:text-white",
              "focus:text-white",
            ].join(" ")}
            href="https://tailwindcss.com/"
            icon={
              <BrandTailwind className="h-4 w-4 text-[#36bdf9] transition-colors group-hover:text-white" />
            }
            text="Tailwind"
            blank
          />
          <IconLink
            className={[
              "hover:border-white",
              "focus:border-white",
              "hover:bg-white",
              "focus:bg-white",
              "hover:text-[#1e9cf0]",
              "focus:text-[#1e9cf0]",
            ].join(" ")}
            href="https://code.visualstudio.com/"
            icon={<VSCode className="h-4 w-4" />}
            text="VSCode"
            blank
          />
        </div>
        <p>
          If you want more details, you can{" "}
          <IconLink
            icon={<FileCertificate className="w-4" />}
            text="read my CV"
            href="/cv-dmitrii_kopenkin.pdf"
            className="translate-y-1.5 hover:border-zinc-500 focus:border-zinc-500"
            blank
          />
        </p>
        <p>
          Alternatively, you can{" "}
          <IconLink
            icon={<At className="w-4" />}
            text="send me an email"
            href="mailto:hi@kopenkin.tech?subject=Hi, I want to hire you 🚀"
            className="translate-y-1.5 hover:border-zinc-500 focus:border-zinc-500"
          />
        </p>
      </div>
    </div>
  );
}
