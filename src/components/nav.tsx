import Logo from "./logo";
import { BrandGithub, BrandLinkedin, BrandTwitch } from "tabler-icons-react";
import type { BreadcrumbsProps } from "./ui/breadcrumbs";
import Breadcrumbs from "./ui/breadcrumbs";

export interface NavProps {
  breadcrumbs: BreadcrumbsProps["breadcrumbs"];
}

export default function Nav({ breadcrumbs }: NavProps) {
  return (
    <nav className="flex items-center p-4">
      <a href="/">
        <Logo />
      </a>
      <div className="ml-4 hidden items-center sm:flex">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className="ml-auto flex items-center gap-1 rounded-xl border border-zinc-300 px-6 py-4 lg:gap-3">
        <a
          href="https://www.twitch.tv/dmitriyk_"
          className="grid h-6 w-6 place-items-center rounded-md transition-colors hover:bg-[#aa70ff] hover:text-white focus:bg-[#aa70ff] focus:text-white"
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
