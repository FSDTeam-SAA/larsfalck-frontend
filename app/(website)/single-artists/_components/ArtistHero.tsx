import Image from "next/image";

import type { ArtistStats, ArtistSummary } from "./ArtistDetailsClient";

type ArtistHeroProps = {
  artist: ArtistSummary;
  stats: ArtistStats;
};

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count.toLocaleString()} ${count === 1 ? singular : plural}`;
}

export default function ArtistHero({ artist, stats }: ArtistHeroProps) {
  const coverImage = artist.image || "/banner.png";
  const metadata = [
    pluralize(stats.totalAlbums, "Album"),
    pluralize(stats.totalSongs, "Song"),
    stats.totalPlays > 0 ? pluralize(stats.totalPlays, "Play") : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <section className="overflow-hidden rounded-tl-2xl rounded-tr-2xl bg-[#121212]">
      <div className="relative h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px]">
        <Image
          src={coverImage}
          alt={artist.name}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/45 to-transparent" />

        <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-8">
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            {artist.name}
          </h1>

          <p className="mt-2 text-sm text-neutral-300 md:text-base">
            {metadata}
          </p>

          {artist.description && (
            <p className="mt-2 max-w-2xl text-xs leading-5 text-neutral-300 md:text-sm">
              {artist.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
