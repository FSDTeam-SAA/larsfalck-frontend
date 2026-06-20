// components/popular-songs.tsx
import Image from "next/image";
import Link from "next/link";

const songs = [
  {
    title: "Morning Serenity",
    artist: "Emma Rhodes • Piano Collection ...",
    image: "/albam.png",
  },
  {
    title: "Ocean Breeze",
    artist: "Daniel Hart • Nature Sounds Coll...",
    image: "/albam2.png",
  },
  {
    title: "Zen Journey",
    artist: "Daniel Hart • Meditation Essential...",
    image: "/albam.png",
  },
  {
    title: "Sunset Dreams",
    artist: "Sophia Lane • Evening Lounge • 2...",
    image: "/albam2.png",
  },
  {
    title: "Midnight Calm",
    artist: "Michael Stone • Night Ambience...",
    image: "/albam.png",
  },
];

export function Recommended() {
  return (
    <section className="px-3 py-5 sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center justify-between sm:mb-7">
        <h2 className="text-xl font-semibold text-[#FFFFFF] sm:text-3xl lg:text-4xl">
        Recommended for you
        </h2>
        <Link
          href="/songs"
          className="text-sm font-medium text-[#A8A8A8] hover:text-white sm:text-lg"
        >
          Show all
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {songs.map((song) => (
          <Link
            key={song.title}
            href="#"
            className="group flex flex-col gap-2 rounded-lg p-1.5 transition hover:bg-[#212121] sm:p-2"
          >
            <div className="relative overflow-hidden rounded-md">
              <Image
                src={song.image}
                alt={song.title}
                width={1000}
                height={1000}
                className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-2 min-w-0 sm:mt-3">
              <p className="truncate text-sm font-medium text-white sm:text-base lg:text-xl">
                {song.title}
              </p>
              <p className="truncate text-xs text-[#A8A8A8] sm:text-sm lg:text-base">{song.artist}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
