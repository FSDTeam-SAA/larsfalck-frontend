// components/navbar.tsx
"use client";

import * as React from "react";
import { Home, Search, SlidersHorizontal, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  return (
    <header className="sticky top-0 !z-50 mt-3 flex h-16 w-full mx-auto rounded-[12px] items-center justify-between gap-3 border-b border-white/5 bg-[#FFFFFF]/10 pl-16 pr-3 sm:h-[82px] sm:px-8 lg:h-[94px] lg:px-12">
      {/* Logo */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1ed760] sm:h-8 sm:w-8">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 text-black sm:h-5 sm:w-5"
          >
            <path
              d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="hidden leading-tight sm:flex sm:flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wide text-white">
            Beatboks<span className="text-[#1ed760]">.com</span>
          </span>
          <span className="text-[8px] uppercase tracking-wider text-zinc-500">
            Soundtrack Your Album
          </span>
        </div>
      </div>

      {/* Center: home + search (desktop) */}
      <div className="hidden flex-1 items-center justify-center gap-3 md:flex">
        <Button
          size="icon"
          className="h-11 w-11 shrink-0 rounded-full bg-white text-black hover:bg-white/90"
        >
          <Home className="!h-5 !w-5" />
        </Button>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search songs, artists, albums ..."
            className="h-[44px] rounded-full border-none bg-[#333333] pl-9 pr-9 text-[#A8A8A8] focus-visible:ring-1 focus-visible:ring-[#FFFFFF] placeholder:text-[#A8A8A8] text-base"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button className="hidden h-8 rounded-full bg-[#00EF01] px-4 text-sm font-medium text-black hover:bg-[#1ed760]/90 sm:flex sm:h-9 sm:px-5 sm:text-base">
          Explore Premium
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full bg-[#333333] text-white hover:bg-white/10 hover:text-white"
        >
          <Bell className="!h-[24px] !w-[24px]" />
        </Button>

        <Avatar className="h-10 w-10 cursor-pointer sm:h-9 sm:w-9">
          <AvatarImage src="/avatar.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        {/* Mobile menu (home + search go here below md) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full text-zinc-300 hover:bg-white/10 hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="bg-[#161616] pt-6">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full bg-white text-black hover:bg-white/90"
              >
                <Home className="h-4 w-4" />
              </Button>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  placeholder="Search songs, artists, albums ..."
                  className="h-9 rounded-full border-none bg-[#2a2a2a] pl-9 pr-9 text-sm text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-[#1ed760]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
