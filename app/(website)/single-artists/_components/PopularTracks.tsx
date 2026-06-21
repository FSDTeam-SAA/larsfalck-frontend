"use client";

import Image from "next/image";
import { Clock3, MoreHorizontal, Play, Shuffle } from "lucide-react";

const tracks = [
  {
    id: "01",
    title: "Morning Serenity",
    image: "/albam.png",
    plays: "5,141,137",
    duration: "6:15",
  },
  {
    id: "02",
    title: "Ocean Breeze",
    image: "/albam2.png",
    plays: "5,853,884",
    duration: "11:25",
  },
  {
    id: "03",
    title: "Zen Journey",
    image: "/albam3.png",
    plays: "3,189,563",
    duration: "7:25",
  },
  {
    id: "04",
    title: "Sunset Dreams",
    image: "/albam4.png",
    plays: "1,071,924",
    duration: "8:15",
  },
  {
    id: "05",
    title: "Midnight Calm",
    image: "/albam5.png",
    plays: "2,534,116",
    duration: "4:05",
  },
];

export default function PopularTracks() {
  return (
    <section className="w-full py-5 p-6"
      style={{
    background:
      "linear-gradient(360deg, rgba(255,255,255,0.1) 0%, rgba(0,239,1,0.1) 100%)",
  }}
    >
            {/* Actions */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-5 md:px-8">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ED760] text-black transition hover:scale-105">
          <Play className="ml-1 h-6 w-6 fill-current" />
        </button>

        <div className="relative h-10 w-10 overflow-hidden rounded">
          <Image
            src={"/albam.png"}
            alt="Album"
            fill
            className="object-cover"
          />
        </div>

        <button className="text-neutral-300 transition hover:text-white">
          <Shuffle className="ml-1 h-7 w-7 fill-current" />
        </button>

        <button className="text-neutral-300 transition hover:text-white">
          <MoreHorizontal size={28} />
        </button>
      </div>
      <h2 className="mb-6 text-2xl font-bold text-white">Popular</h2>

      <div className="space-y-1">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="grid grid-cols-[28px_44px_minmax(0,1fr)_70px_24px] items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-white/5 md:grid-cols-[40px_52px_minmax(0,1fr)_140px_28px_70px_28px]"
          >
            {/* Number */}
            <span className="text-xs text-neutral-400">{track.id}</span>

            {/* Cover */}
            <div className="relative h-10 w-10 overflow-hidden rounded md:h-12 md:w-12">
              <Image
                src={track.image}
                alt={track.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title */}
            <h3 className="truncate text-sm font-medium text-white md:text-xl">
              {track.title}
            </h3>

            {/* Streams (desktop only) */}
            <p className="hidden text-right text-sm text-neutral-400 md:block">
              {track.plays}
            </p>

            {/* Clock icon (desktop only) */}
            <div className="hidden justify-center md:flex">
              <Clock3 size={14} className="text-neutral-400" />
            </div>

            {/* Duration */}
            <span className="text-right text-xs text-neutral-400 md:text-sm">
              {track.duration}
            </span>

            {/* Menu */}
            <button className="flex justify-end text-neutral-500 hover:text-white">
              <MoreHorizontal size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}