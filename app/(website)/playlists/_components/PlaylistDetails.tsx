"use client";

import Image from "next/image";
import {
  CircleCheck,
  Clock3,
  MoreHorizontal,
  Play,
  Search,
  Shuffle,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const recommendedSongs = [
  {
    id: 1,
    title: "Morning Serenity",
    artist: "Emma Rhodes",
    image: "/albam.png",
  },
  {
    id: 2,
    title: "Ocean Breeze",
    artist: "Daniel Hart",
    image: "/albam2.png",
  },
  {
    id: 3,
    title: "Zen Journey",
    artist: "Daniel Hart",
    image: "/albam.png",
  },
  {
    id: 4,
    title: "Sunset Dreams",
    artist: "Sophia Lane",
    image: "/albam2.png",
  },
  {
    id: 5,
    title: "Midnight Calm",
    artist: "Michael Stone",
    image: "/albam.png",
  },
];

const playlistSongs = [
  {
    id: 1,
    title: "Energy Pulse",
    artist: "Emma Rhodes",
    album: "Morning Serenity",
    dateAdded: "6 minutes ago",
    duration: "7:20",
    image: "/albam2.png",
  },
];

type PlaylistDetailsProps = {
  title: string;
  owner?: string;
};

export function PlaylistDetails({
  title,
  owner = "David Park",
}: PlaylistDetailsProps) {
  const [query, setQuery] = useState("");
  const [addedSongIds, setAddedSongIds] = useState<Set<number>>(new Set());

  const filteredSongs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return recommendedSongs;

    return recommendedSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(normalizedQuery) ||
        song.artist.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  function toggleSong(songId: number) {
    setAddedSongIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(songId)) {
        nextIds.delete(songId);
      } else {
        nextIds.add(songId);
      }

      return nextIds;
    });
  }

  return (
    <section className="min-h-full overflow-hidden rounded-xl bg-[#FFFFFF1A]  text-white">
    <header className="bg-[linear-gradient(0deg,_#171917_0%,_#4C4C4C_126.43%)] p-3 sm:p-5 lg:p-6">
        <div className="flex items-end gap-4 sm:gap-5 items-center">
          <div className="relative h-[232px] !w-[232px] shrink-0 overflow-hidden rounded shadow-xl sm:w-32">
            <Image
              src="/albam.png"
              alt={`${title} cover`}
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 pb-1 sm:pb-2">
            <p className="text-xs text-white sm:text-2xl">Public Playlist</p>
            <h1 className="mt-1 break-words text-3xl font-semibold leading-none text-[#00EF01] sm:mt-2 sm:text-7xl">
              {title}
            </h1>
            <p className="mt-3 text-xs text-[#A8A8A8] sm:text-base">
              <span className="font-semibold text-white">{owner}</span>
              <span aria-hidden="true"> · </span>
              1 song, 2 min 39 sec
            </p>
          </div>
        </div>
      </header>

      <div className="px-3 pb-6 pt-5 sm:px-5 sm:pb-8 sm:pt-10 lg:px-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="icon"
            aria-label="Play playlist"
            className="size-9 rounded-full bg-[#00EF01] text-black hover:scale-105 hover:bg-[#00D801]"
          >
            <Play className="ml-0.5 size-5 fill-current" />
          </Button>

          <div className="relative aspect-[533/620] w-8 overflow-hidden rounded-sm">
            <Image
              src="/albam.png"
              alt=""
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Shuffle playlist"
            className="size-8 text-[#D0D0D0] hover:bg-white/5 hover:text-white"
          >
            <Shuffle className="size-5" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="More playlist options"
            className="size-8 text-[#A8A8A8] hover:bg-white/5 hover:text-white"
          >
            <MoreHorizontal className="size-5" />
          </Button>
        </div>

        <div className="mt-4">
          <div className="hidden grid-cols-[32px_minmax(180px,1.4fr)_minmax(120px,1fr)_minmax(110px,0.8fr)_24px_44px_24px] items-center gap-3 border-b border-white/5 px-1 pb-3 text-base text-[#C7C7C7] md:grid ">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span>Date added</span>
            <span />
            <Clock3 className="mx-auto size-4" aria-label="Duration" />
            <span />
          </div>

          {playlistSongs.map((song) => (
            <div
              key={song.id}
              className="grid grid-cols-[24px_minmax(0,1fr)_44px_24px] items-center gap-2 rounded-md px-1 py-3 transition-colors hover:bg-white/5 md:grid-cols-[32px_minmax(180px,1.4fr)_minmax(120px,1fr)_minmax(110px,0.8fr)_24px_44px_24px] md:gap-3"
            >
              <span className="text-center text-sm text-[#C7C7C7]">
                {song.id}
              </span>

              <div className="flex min-w-0 items-center gap-2.5">
                <div className="relative aspect-[533/620] w-9 shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={song.image}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium text-white sm:text-base">
                    {song.title}
                  </h3>
                  <p className="truncate text-xs text-[#A8A8A8]">
                    {song.artist}
                  </p>
                </div>
              </div>

              <p className="hidden truncate text-base text-[#E0E0E0] md:block">
                {song.album}
              </p>
              <p className="hidden truncate text-base text-[#E0E0E0] md:block">
                {song.dateAdded}
              </p>
              <CircleCheck className="hidden size-5 text-[#00EF01] md:block" />
              <span className="text-right text-base text-[#D7D7D7] md:text-center">
                {song.duration}
              </span>
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                aria-label={`More options for ${song.title}`}
                className="text-[#A8A8A8] hover:bg-white/5 hover:text-white"
              >
                <MoreHorizontal className="size-6" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-3 sm:mt-4">
          <h2 className="text-lg font-semibold sm:text-3xl">
            Let&apos;s find something for your playlist
          </h2>

          <div className="relative mt-4 w-full max-w-[290px]">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A8A8A8]"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search recommended songs"
              placeholder="Search for songs..."
              className="h-12 rounded-full w-[500px] border-0 bg-[#333333] pl-9 pr-4 text-sm text-white placeholder:text-[#A8A8A8] focus-visible:ring-[#00EF01]/40 dark:bg-[#393939]"
            />
          </div>

          <div className="mt-5">
            <h2 className="text-xl font-medium sm:text-2xl">Recommended</h2>
            <p className="mt-1 text-xs text-[#8A8A8A] sm:text-sm">
              Based on your listening
            </p>

            <div className="mt-3 space-y-1">
              {filteredSongs.map((song, index) => {
                const isAdded = addedSongIds.has(song.id);

                return (
                  <div
                    key={song.id}
                    className="grid grid-cols-[20px_32px_minmax(0,1fr)_auto] items-center gap-2 rounded-md px-1 py-1.5 transition-colors hover:bg-white/5 sm:grid-cols-[24px_36px_minmax(0,1fr)_auto] sm:gap-2.5"
                  >
                    <span className="text-center text-xs text-[#D4D4D4] sm:text-sm">
                      {index + 1}
                    </span>

                    <div className="relative aspect-[533/620] w-8 overflow-hidden rounded-sm bg-white/5 sm:w-9">
                      <Image
                        src={song.image}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium text-white sm:text-base">
                        {song.title}
                      </h3>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      aria-pressed={isAdded}
                      onClick={() => toggleSong(song.id)}
                      className={cn(
                        "h-7 min-w-14 rounded-full border-white/80 bg-transparent px-3 text-xs text-white hover:border-white hover:bg-white  sm:min-w-16",
                        isAdded &&
                          "border-[#00EF01] bg-[#00EF01] text-black hover:bg-[#00D801]"
                      )}
                    >
                      {isAdded ? "Added" : "Add"}
                    </Button>
                  </div>
                );
              })}

              {filteredSongs.length === 0 && (
                <p className="py-8 text-center text-sm text-[#A8A8A8]">
                  No matching songs found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
