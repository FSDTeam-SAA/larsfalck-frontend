import Image from "next/image";

interface ArtistHeroProps {
  name: string;
  cover: string;
  monthlyListeners?: string;
  description?: string;
  avatar?: string;
}

export default function ArtistHero({
  name,
  cover,
  monthlyListeners = "12 Albums • 245 Songs",
  description = "Emma Rhodes is a composer and producer creating relaxing instrumental music for wellness, meditation, commercial spaces, and everyday listening.",
  avatar = "/album.png",
}: ArtistHeroProps) {
  return (
    <section className="overflow-hidden rounded-tl-2xl rounded-tr-2xl bg-[#121212]">
      {/* Banner */}
      <div className="relative h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px]">
        <Image
          src={cover}
          alt={name}
          fill
          priority
          className="object-cover"
        />

        {/* Dark overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" /> */}

        {/* Content */}
        <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-8">
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            {name}
          </h1>

          <p className="mt-2 text-sm text-neutral-300 md:text-base">
            {monthlyListeners}
          </p>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-neutral-400 md:text-sm">
            {description}
          </p>
        </div>
      </div>

  
    </section>
  );
}