"use client";

import { ClapperboardIcon } from "lucide-react";
import Link from "next/link";
import { Box } from "./box";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <>
      <div className="before:fixed before:left-0 before:right-0 before:top-0 before:z-[11] before:h-16 before:bg-background md:before:h-20 print:hidden" />
      <Box
        as="nav"
        className="sticky top-4 z-20 mx-auto mt-4 flex h-14 w-container items-center justify-between border-b bg-background p-4 md:top-6 md:mt-6 print:hidden"
        tl
        tr
        bl
        br
      >
        <Link href="/" className="text-lg">
          <b>Kopenkin Dmitrii</b>
        </Link>
        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="outline"
            className="flex h-8 items-center gap-1 px-2"
          >
            <Link href="/medialist">
              <ClapperboardIcon className="size-4" />
              Medialist
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </Box>
    </>
  );
}
