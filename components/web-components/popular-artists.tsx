// components/popular-artists.tsx
import Image from "next/image";
import Link from "next/link";

const artists = [
  { name: "Lars Falck", meta: "12 Albums • 245 Songs", image: "/artis.png" },
  { name: "Emma Rhodes", meta: "12 Albums • 245 Songs", image: "/artis.png" },
  { name: "Daniel Hart", meta: "12 Albums • 245 Songs",image: "/artis.png" },
  { name: "Sophia Lane", meta: "12 Albums • 245 Songs", image: "/artis.png" },
  { name: "Michael Stone", meta: "12 Albums • 245 Songs", image: "/artis.png" },
  { name: "Olivia Grace", meta: "12 Albums • 245 Songs", image: "/artis.png" },
  { name: "Ethan Cole", meta: "12 Albums • 245 Songs", image: "/artis.png" },
  { name: "Isabella Moore", meta: "12 Albums • 245 Songs", image: "/artis.png" },
];

export function PopularArtists() {
  return (
    <section className="px-3 py-5 sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center justify-between sm:mb-7">
        <h2 className="text-xl font-semibold text-white sm:text-3xl lg:text-4xl">
          Popular artists
        </h2>
        <Link
          href="/artists"
          className="text-sm font-medium text-[#A8A8A8] hover:text-white sm:text-lg"
        >
          Show all
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {artists.map((artist) => (
          <Link
            key={artist.name}
            href="#"
            className="group flex flex-col gap-2 rounded-lg p-1.5 transition hover:bg-[#212121] sm:p-2"
          >
            <div className="relative overflow-hidden rounded-md">
              <Image
                src={artist.image}
                alt={artist.name}
                width={1000}
                height={1000}
                className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="min-w-0 text-center">
              <p className="truncate text-sm font-semibold text-white sm:text-base lg:text-xl">
                {artist.name}
              </p>
              <p className="truncate text-xs text-[#A8A8A8] sm:text-sm">{artist.meta}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
