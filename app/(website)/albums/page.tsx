import AlbumCard from "@/components/common/AlbumCard";
import { albumCatalog } from "@/lib/albums";

export default function AlbumsPage() {
  return (
    <section className="rounded-xl bg-[#FFFFFF1A] px-3 py-5 sm:px-6 sm:py-6">
      <h1 className="mb-4 text-xl font-semibold text-white sm:mb-7 sm:text-3xl lg:text-4xl">
        Albums
      </h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {albumCatalog.slice(0, 10).map((album) => (
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
