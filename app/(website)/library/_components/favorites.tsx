import { CircleCheckBig } from "lucide-react";
import Image from "next/image";

const tracks = [
  {
    title: "Morning Serenity",
    artist: "Emma Rhodes",
    album: "Piano Collection",
    duration: "6:15",
    image: "/albam.png",
  },
  {
    title: "Ocean Breeze",
    artist: "Daniel Hart",
    album: "Nature Sounds Collection",
    duration: "11:25",
    image: "/albam2.png",
  },
  {
    title: "Zen Journey",
    artist: "Daniel Hart",
    album: "Meditation Essentials",
    duration: "7:25",
    image: "/albam.png",
  },
  {
    title: "Sunset Dreams",
    artist: "Sophia Lane",
    album: "Evening Lounge",
    duration: "8:15",
    image: "/albam2.png",
  },
];

export function Favorites() {
  return (
  <div className="w-full ">
  {tracks.map((track, index) => (
    <div
      key={track.title}
      className="grid grid-cols-[40px_52px_minmax(220px,1fr)_minmax(180px,280px)_40px_60px_30px] items-center gap-4 px-3 py-3 hover:bg-white/5 transition-colors"
    >
      {/* Number */}
      <span className="text-sm text-white/80">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Cover */}
      <div className="relative h-12 w-12 overflow-hidden rounded-md">
        <Image
          src={track.image}
          alt={track.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Title + Artist */}
      <div className="min-w-0">
        <h3 className="truncate text-[24px] font-medium text-white">
          {track.title}
        </h3>
        <p className="truncate text-[15px] text-[#8A8A8A]">
          {track.artist} • 2025
        </p>
      </div>

      {/* Album */}
      <p className="truncate text-[18px] text-[#A0A0A0]">
        {track.album}
      </p>

      {/* Plus */}
      <button className="text-white/70 hover:text-white text-lg">
          <CircleCheckBig className="text-[#00EF01]" />
      </button>

      {/* Duration */}
      <span className="text-l6 text-white/80">
        {track.duration}
      </span>

      {/* Menu */}
      <button className="text-white/60 hover:text-white">
        ⋯
      </button>
    </div>
  ))}
</div>
  );
}
