import Image from "next/image";
import Link from "next/link";
import {
  CirclePlus,
  Download,
  MoreHorizontal,
  Play,
  Shuffle,
} from "lucide-react";

import type { AlbumSummary } from "@/lib/albums";

const albumSongs = [
  {
    title: "Morning Serenity",
    plays: "5,141,137",
    duration: "6:15",
    image: "/albam.png",
  },
  {
    title: "Ocean Breeze",
    plays: "5,853,884",
    duration: "11:25",
    image: "/albam2.png",
  },
  {
    title: "Zen Journey",
    plays: "3,189,563",
    duration: "7:25",
    image: "/albam.png",
  },
  {
    title: "Sunset Dreams",
    plays: "1,071,924",
    duration: "8:15",
    image: "/albam2.png",
  },
  {
    title: "Midnight Calm",
    plays: "2,534,116",
    duration: "4:05",
    image: "/albam.png",
  },
  {
    title: "Energy Pulse",
    plays: "2,764,302",
    duration: "7:20",
    image: "/albam2.png",
  },
  {
    title: "Deep Focus Flow",
    plays: "2,288,475",
    duration: "8:25",
    image: "/albam.png",
  },
  {
    title: "Urban Lounge",
    plays: "2,100,148",
    duration: "11:25",
    image: "/albam2.png",
  },
  {
    title: "Silent Forest",
    plays: "1,257,500",
    duration: "10:50",
    image: "/albam.png",
  },
  {
    title: "Golden Horizon",
    plays: "781,240",
    duration: "5:05",
    image: "/albam2.png",
  },
];

const albumArtists = ["Lars Falck", "Emma Rhodes", "Daniel Hart", "Sophia Lane"];

type AlbumDetailsProps = {
  album: AlbumSummary;
};

export function AlbumDetails({ album }: AlbumDetailsProps) {
  return (
    <section className="min-h-full overflow-hidden rounded-xl bg-[#181818] text-white">
      <header className="bg-gradient-to-b from-[#002B0B] via-[#102718] to-[#181818] p-3 sm:p-5 lg:p-6">
        <div className="flex items-end gap-4 sm:gap-5">
          <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded shadow-xl sm:w-32">
            <Image
              src={album.image}
              alt={`${album.title} cover`}
              fill
              priority
              sizes="128px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 pb-1 sm:pb-2">
            <p className="text-xs text-[#D7D7D7] sm:text-sm">Album</p>
            <h1 className="mt-1 break-words text-2xl font-semibold leading-tight text-white sm:mt-2 sm:text-4xl lg:text-5xl">
              {album.title}
            </h1>
            <p className="mt-2 text-xs text-[#A8A8A8] sm:text-sm">
              10 songs · {album.year} · 30 min 55 sec
            </p>
          </div>
        </div>
      </header>

      <div className="px-3 pb-8 pt-5 sm:px-5 sm:pt-7 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`Play ${album.title}`}
            className="inline-flex size-9 items-center justify-center rounded-full bg-[#00EF01] text-black transition hover:scale-105 hover:bg-[#00D801]"
          >
            <Play className="ml-0.5 size-5 fill-current" />
          </button>

          <button
            type="button"
            aria-label={`Shuffle ${album.title}`}
            className="inline-flex size-8 items-center justify-center rounded text-[#D0D0D0] transition hover:bg-white/5 hover:text-white"
          >
            <Shuffle className="size-5" />
          </button>

          <div className="relative aspect-[533/620] w-8 overflow-hidden rounded-sm">
            <Image
              src={album.image}
              alt=""
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>

          <button
            type="button"
            aria-label="Save album"
            className="inline-flex size-8 items-center justify-center rounded text-[#D0D0D0] transition hover:bg-white/5 hover:text-white"
          >
            <CirclePlus className="size-5" />
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold sm:text-2xl">Songs</h2>

          <div className="mt-3 space-y-1">
            {albumSongs.map((song, index) => (
              <div
                key={song.title}
                className="grid grid-cols-[24px_36px_minmax(0,1fr)_24px_44px_24px] items-center gap-2 rounded-md px-1 py-1.5 transition-colors hover:bg-white/5 sm:grid-cols-[30px_40px_minmax(0,1fr)_90px_24px_24px_44px_24px] sm:gap-3"
              >
                <span className="text-center text-xs text-[#D4D4D4]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative aspect-[533/620] w-9 overflow-hidden rounded-sm sm:w-10">
                  <Image
                    src={song.image}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>

                <h3 className="truncate text-sm font-medium text-white sm:text-base">
                  {song.title}
                </h3>

                <span className="hidden text-right text-xs text-[#C7C7C7] sm:block">
                  {song.plays}
                </span>

                <button
                  type="button"
                  aria-label={`Add ${song.title}`}
                  className="inline-flex size-6 items-center justify-center rounded text-[#D0D0D0] transition hover:bg-white/5 hover:text-white"
                >
                  <CirclePlus className="size-4" />
                </button>

                <button
                  type="button"
                  aria-label={`Download ${song.title}`}
                  className="hidden size-6 items-center justify-center rounded text-[#D0D0D0] transition hover:bg-white/5 hover:text-white sm:inline-flex"
                >
                  <Download className="size-4" />
                </button>

                <span className="text-center text-xs text-[#D7D7D7]">
                  {song.duration}
                </span>

                <button
                  type="button"
                  aria-label={`More options for ${song.title}`}
                  className="inline-flex size-6 items-center justify-center rounded text-[#A8A8A8] transition hover:bg-white/5 hover:text-white"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-9">
          <h2 className="text-xl font-semibold sm:text-2xl">
            Artists in this Album
          </h2>

          <div className="mt-4 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {albumArtists.map((artist) => (
              <Link
                key={artist}
                href={`/single-artists/${encodeURIComponent(artist)}`}
                className="group min-w-0 rounded-md p-1 transition-colors hover:bg-white/5"
              >
                <div className="relative aspect-[4/4.2] overflow-hidden rounded-md bg-white/5">
                  <Image
                    src="/artis.png"
                    alt={artist}
                    fill
                    sizes="(min-width: 640px) 140px, 45vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-2 truncate text-center text-sm font-medium text-white">
                  {artist}
                </h3>
                <p className="mt-0.5 text-center text-xs text-[#A8A8A8]">
                  Artist
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
