import Logo from "./logo";
import { BrandGithub, BrandLinkedin, BrandTwitch } from "tabler-icons-react";

export default function Nav() {
  return (
    <nav className="flex justify-between p-4">
      <div className="flex items-center rounded-xl border border-zinc-300 px-6 py-4">
        <a href="/">
          <Logo />
        </a>
      </div>
      <div className="flex items-center gap-1 rounded-xl border border-zinc-300 px-6 py-4 lg:gap-3">
        <a
          href="https://www.twitch.tv/dmitriyk_"
          className="hidden h-6 w-6 place-items-center rounded-md transition-colors hover:bg-[#aa70ff] hover:text-white focus:bg-[#aa70ff] focus:text-white lg:grid"
        >
          <BrandTwitch className="w-4" />
        </a>
        <a
          href="https://www.linkedin.com/in/dmitrii-kopenkin/"
          className="grid h-6 w-6 place-items-center rounded-md transition-colors hover:bg-[#0966c2] hover:text-white focus:bg-[#0966c2] focus:text-white"
        >
          <BrandLinkedin className="w-4" />
        </a>
        <a
          href="https://github.com/kopenkinda"
          className="grid h-6 w-6 place-items-center rounded-md transition-colors hover:bg-[#171515] hover:text-white focus:bg-[#171515] focus:text-white"
        >
          <BrandGithub className="w-4" />
        </a>
      </div>
    </nav>
  );
}
