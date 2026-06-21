import Link from "next/link";

import MusicCard from "@/components/common/MusicCard";

const songs = [
  {
    title: "Morning Serenity",
    artist: "Emma Rhodes",
    type: "Piano Collection",
    image: "/albam.png",
  },
  {
    title: "Ocean Breeze",
    artist: "Daniel Hart",
    type: "Nature Sounds Collection",
    image: "/albam2.png",
  },
  {
    title: "Zen Journey",
    artist: "Daniel Hart",
    type: "Meditation Essentials",
    image: "/albam.png",
  },
  {
    title: "Sunset Dreams",
    artist: "Sophia Lane",
    type: "Evening Lounge",
    image: "/albam2.png",
  },
  {
    title: "Midnight Calm",
    artist: "Michael Stone",
    type: "Night Ambience",
    image: "/albam.png",
  },
];

export function PopularSongs() {
  return (
    <section className="px-3 py-5 sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center justify-between sm:mb-7">
        <h2 className="text-xl font-semibold text-[#FFFFFF] sm:text-3xl lg:text-4xl">
          Popular Songs
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
          <MusicCard
            key={song.title}
            href="#"
            image={song.image}
            title={song.title}
            artist={song.artist}
            type={song.type}
          />
        ))}
      </div>
    </section>
  );
}
