import { Rocket } from "tabler-icons-react";
import IconLink from "./ui/icon-link";

export default function Footer() {
  return (
    <footer className="mt-auto p-4">
      <div className="flex items-center rounded-xl border border-zinc-300 p-4">
        <span>&copy; {new Date().getFullYear()}</span>
        <span className="mx-4 block h-4 w-px bg-zinc-300"></span>
        <div className="flex items-center">
          <span>Built using</span>
          <IconLink
            text="Astro"
            href="https://astro.build/"
            className="ml-2 translate-y-0 hover:border-[#fe5e01] hover:text-[#fe5e01] focus:border-[#fe5e01] focus:text-[#fe5e01]"
            icon={<Rocket className="w-4 text-[#fe5e01]" />}
            blank
          />
        </div>
      </div>
    </footer>
  );
}
