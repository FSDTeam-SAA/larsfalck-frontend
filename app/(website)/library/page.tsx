"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Favorites } from "./_components/favorites";
import { Playlists } from "./_components/playlists";
import { RecentlyPlayed } from "./_components/recently-played";
import { SavedAlbums } from "./_components/saved-albums";

const tabs = [
  { label: "Recently Played", Component: RecentlyPlayed },
  { label: "Favorites", Component: Favorites },
  { label: "Saved Albums", Component: SavedAlbums },
  { label: "Playlists", Component: Playlists },
] as const;

type Tab = (typeof tabs)[number]["label"];

export default function YourLibrary() {
  const [activeTab, setActiveTab] = React.useState<Tab>("Recently Played");
  const ActiveComponent =
    tabs.find((tab) => tab.label === activeTab)?.Component ?? RecentlyPlayed;

  return (
    <section className="min-h-full rounded-[12px] bg-[#FFFFFF1A] px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
      <h1 className="text-2xl font-semibold leading-none text-white sm:text-3xl">
        Your Library
      </h1>
      <p className="mt-2 text-sm leading-none text-[#8A8A8A]">
        4 favorites · 3 albums · 2 playlists
      </p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const active = activeTab === tab.label;

          return (
            <button
              key={tab.label}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveTab(tab.label)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-[16px] font-medium leading-none transition",
                active
                  ? "border-[#00EF01] bg-[#00EF01] text-[#000000]"
                  : "border-[#8A8A8A] text-[#C7C7C7] hover:border-white hover:text-white"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <ActiveComponent />
      </div>
    </section>
  );
}
