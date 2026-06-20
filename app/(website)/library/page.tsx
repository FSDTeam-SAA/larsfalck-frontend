// components/your-library.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Check, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type Track = {
  id: string;
  title: string;
  artist: string;
  year: number;
  album: string;
  duration: string; // mm:ss
  image: string;
  type: "song" | "playlist";
};

const initialTracks: Track[] = [
  {
    id: "1",
    title: "Morning Serenity",
    artist: "Emma Rhodes",
    year: 2025,
    album: "Piano Collection",
    duration: "6:15",
    image: "/songs/morning-serenity.jpg",
    type: "song",
  },
  {
    id: "2",
    title: "Ocean Breeze",
    artist: "Daniel Hart",
    year: 2025,
    album: "Nature Sounds Collection",
    duration: "11:25",
    image: "/songs/ocean-breeze.jpg",
    type: "song",
  },
  {
    id: "3",
    title: "Zen Journey",
    artist: "Daniel Hart",
    year: 2025,
    album: "Meditation Essentials",
    duration: "7:25",
    image: "/songs/zen-journey.jpg",
    type: "song",
  },
  {
    id: "4",
    title: "Sunset Dreams",
    artist: "Sophia Lane",
    year: 2025,
    album: "Evening Lounge",
    duration: "8:15",
    image: "/songs/sunset-dreams.jpg",
    type: "song",
  },
  {
    id: "5",
    title: "Midnight Calm",
    artist: "Michael Stone",
    year: 2025,
    album: "Night Ambience",
    duration: "4:05",
    image: "/songs/midnight-calm.jpg",
    type: "playlist",
  },
];

const tabs = ["Recently Played", "Favorites", "Saved Albums", "Playlists"] as const;
type Tab = (typeof tabs)[number];

export default function YourLibrary() {
  const [activeTab, setActiveTab] = React.useState<Tab>("Recently Played");
  const [favorites, setFavorites] = React.useState<Set<string>>(
    new Set(["1", "2", "3", "4", "5"])
  );
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const visibleTracks = React.useMemo(() => {
    switch (activeTab) {
      case "Favorites":
        return initialTracks.filter((t) => favorites.has(t.id));
      case "Saved Albums":
        return initialTracks.filter((t) => t.type === "song");
      case "Playlists":
        return initialTracks.filter((t) => t.type === "playlist");
      default:
        return initialTracks;
    }
  }, [activeTab, favorites]);

  const favoriteCount = favorites.size;
  const albumCount = new Set(initialTracks.map((t) => t.album)).size;
  const playlistCount = initialTracks.filter((t) => t.type === "playlist").length;

  return (
    <div className="rounded-2xl bg-[#161616] p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Your Library</h1>
      <p className="mt-1 text-sm text-zinc-400">
        {favoriteCount} favorites · {albumCount} albums · {playlistCount} playlists
      </p>

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-2 sm:mt-6">
        {tabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                active
                  ? "border-[#1ed760] bg-[#1ed760] text-black"
                  : "border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:text-white"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="mt-6">
        {visibleTracks.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500">
            Nothing here yet.
          </p>
        ) : (
          visibleTracks.map((track, index) => {
            const isFav = favorites.has(track.id);
            return (
              <div
                key={track.id}
                className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 sm:gap-4 sm:px-3"
              >
                <span className="w-5 shrink-0 text-sm text-zinc-500 sm:w-6">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md sm:h-12 sm:w-12">
                  <Image
                    src={track.image}
                    alt={track.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white sm:text-base">
                    {track.title}
                  </p>
                  <p className="truncate text-xs text-zinc-400">
                    {track.artist} • {track.year}
                  </p>
                </div>

                <span className="hidden w-44 truncate text-sm text-zinc-400 md:block">
                  {track.album}
                </span>

                <button
                  type="button"
                  onClick={() => toggleFavorite(track.id)}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition",
                    isFav
                      ? "border-[#1ed760] text-[#1ed760]"
                      : "border-zinc-500 text-zinc-400 hover:border-white hover:text-white"
                  )}
                  aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFav ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                </button>

                <span className="hidden w-10 shrink-0 text-right text-sm text-zinc-400 sm:block">
                  {track.duration}
                </span>

                <div className="relative hidden shrink-0 sm:block">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId((id) => (id === track.id ? null : track.id))
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {openMenuId === track.id && (
                    <div className="absolute right-0 top-9 z-10 w-44 overflow-hidden rounded-lg border border-white/10 bg-[#212121] py-1 shadow-xl">
                      <button
                        type="button"
                        onClick={() => {
                          toggleFavorite(track.id);
                          setOpenMenuId(null);
                        }}
                        className="block w-full px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
                      >
                        {isFav ? "Remove from favorites" : "Add to favorites"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(null)}
                        className="block w-full px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
                      >
                        Add to playlist
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(null)}
                        className="block w-full px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
                      >
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}