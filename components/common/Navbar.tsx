"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Home, Search, SlidersHorizontal, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const mobileSearchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isMobileSearchOpen) mobileSearchInputRef.current?.focus();
  }, [isMobileSearchOpen]);

  function handleMobileSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mobileSearchInputRef.current?.focus();
  }

  return (
    <header className="sticky top-0 z-50 mx-auto mt-3 flex h-16 w-full items-center justify-between gap-3 rounded-xl border-b border-white/5 bg-[#FFFFFF1A] pl-16 pr-3 sm:h-[82px] sm:px-8 lg:h-[94px] lg:px-12">
      <Link
        href="/"
        aria-label="Go to homepage"
        className={cn("shrink-0", isMobileSearchOpen && "hidden md:block")}
      >
        <div className="hidden h-14 w-[157px] lg:block">
          <Image
            src="/logo.png"
            alt="Logo"
            width={157}
            height={56}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="h-8 w-8 lg:hidden">
          <Image
            src="/fav.png"
            alt="Logo"
            width={48}
            height={48}
            className="h-full w-full object-contain"
          />
        </div>
      </Link>

      {/* Desktop search */}
      <div className="hidden flex-1 items-center justify-center gap-3 md:flex">
        <Button
          size="icon"
          aria-label="Home"
          className="h-11 w-11 shrink-0 rounded-full bg-white text-black hover:bg-white/90"
        >
          <Home className="size-5" />
        </Button>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="search"
            aria-label="Search songs, artists, and albums"
            placeholder="Search songs, artists, albums ..."
            className="h-11 rounded-full border-none bg-[#333333] pl-9 pr-9 text-base text-[#A8A8A8] placeholder:text-[#A8A8A8] focus-visible:ring-1 focus-visible:ring-white dark:bg-[#333333]"
          />
          <button
            type="button"
            aria-label="Search filters"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-white"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>
      </div>

      {/* Expanded mobile search */}
      {isMobileSearchOpen && (
        <form
          role="search"
          onSubmit={handleMobileSearch}
          className="flex min-w-0 flex-1 items-center gap-2 md:hidden"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              ref={mobileSearchInputRef}
              type="search"
              aria-label="Search songs, artists, and albums"
              placeholder="Search music..."
              onKeyDown={(event) => {
                if (event.key === "Escape") setIsMobileSearchOpen(false);
              }}
              className="h-10 w-full rounded-full border border-white/10 bg-[#292929] pl-9 pr-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-[#00EF01] focus:ring-2 focus:ring-[#00EF01]/25"
            />
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Close search"
            onClick={() => setIsMobileSearchOpen(false)}
            className="size-10 rounded-full bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" />
          </Button>
        </form>
      )}

      {/* Right actions */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 sm:gap-3",
          isMobileSearchOpen && "hidden md:flex"
        )}
      >
        <Button className="hidden h-8 rounded-full bg-[#00EF01] px-4 text-sm font-medium text-black hover:bg-[#1ed760]/90 sm:flex sm:h-9 sm:px-5 sm:text-base">
          Explore Premium
        </Button>

        <Button
          size="icon"
          variant="ghost"
          aria-label="Notifications"
          className="size-10 rounded-full bg-[#333333] text-white hover:bg-white/10 hover:text-white sm:size-9"
        >
          <Bell className="size-6" />
        </Button>

        <Link href="/profiles">
        <Avatar className="h-10 w-10 cursor-pointer sm:h-9 sm:w-9">
          <AvatarImage src="/avatar.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        </Link>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Open search"
          aria-expanded={isMobileSearchOpen}
          onClick={() => setIsMobileSearchOpen(true)}
          className="size-9 rounded-full bg-[#333333] text-zinc-200 hover:bg-[#00EF01] hover:text-black md:hidden"
        >
          <Search className="size-5" />
        </Button>
      </div>
    </header>
  );
}
