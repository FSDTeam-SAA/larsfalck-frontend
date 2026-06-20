// components/sidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Disc3, ListMusic, Mic2, Plus, Menu, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Your Library", href: "/library", icon: Library },
  { label: "Albums", href: "/albums", icon: Disc3 },
  { label: "Playlists", href: "/playlists", icon: ListMusic },
  { label: "Artists", href: "/artists", icon: Mic2 },
];

const myPlaylists = [
  { label: "My Favorites Mix", href: "/playlists/favorites" },
  { label: "Workout Jams", href: "/playlists/workout" },
];

function SidebarContent() {
  const pathname = usePathname();

  return (
    <ScrollArea className="h-full">
      <div className="mt-5 flex flex-col gap-3 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                className={cn(
                  "h-12 w-full justify-start gap-3 rounded-lg bg-[#FFFFFF0D] text-base font-medium text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#333333] sm:text-lg xl:h-[50px] xl:text-[22px]",
                  active && "bg-[#FFFFFF] text-[#333333]"
                )}
              >
                <item.icon className="!h-6 !w-6" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          My Playlists
        </span>
        <button
          type="button"
          className="flex h-5 w-5 items-center justify-center rounded text-zinc-400 hover:bg-[#2a2a2a] hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-2 pb-3">
        {myPlaylists.map((pl) => {
          const active = pathname === pl.href;
          return (
            <Link key={pl.href} href={pl.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 rounded-lg px-2 text-sm font-normal text-zinc-300 hover:bg-[#2a2a2a] hover:text-white",
                  active && "bg-[#2a2a2a] text-white"
                )}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#1ed760] to-emerald-900">
                  <Music2 className="h-3.5 w-3.5 text-black/70" />
                </span>
                <span className="truncate">{pl.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export function Sidebar() {
  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-3 hidden h-full min-h-0 shrink-0 rounded-[12px] bg-[#FFFFFF1A] md:block md:w-[260px] xl:w-[320px]">
        <SidebarContent />
      </aside>

      {/* Mobile trigger + drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="fixed left-5 top-6 z-50 h-9 w-9 rounded-full text-zinc-300 hover:bg-white/10 hover:text-white md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 border-r border-white/5 bg-[#161616] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
