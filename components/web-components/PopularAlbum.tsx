import Link from "next/link";

import AlbumCard from "@/components/common/AlbumCard";
import { albumCatalog } from "@/lib/albums";

export function PopularAlbum() {
  return (
    <section className="px-3 py-5 sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center justify-between sm:mb-7">
        <h2 className="text-xl font-semibold text-white sm:text-3xl lg:text-4xl">
          Popular Albums
        </h2>
        <Link
          href="/albums"
          className="text-sm font-medium text-[#A8A8A8] hover:text-white sm:text-lg"
        >
          Show all
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {albumCatalog.slice(0, 5).map((album) => (
          <AlbumCard
            key={album.slug}
            href={`/albums/${album.slug}`}
            image={album.image}
            title={album.title}
            artist={album.artist}
            year={album.year}
            albumType={album.category}
          />
        ))}
      </div>
    </section>
  );
}
