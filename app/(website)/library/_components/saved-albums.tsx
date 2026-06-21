import Image from "next/image";

const albums = [
  {
    title: "Deep Focus Sessions",
    artist: "Emma Rhodes",
    image: "/albam.png",
  },
  {
    title: "Ocean Breeze",
    artist: "Daniel Hart",
    image: "/albam2.png",
  },
  {
    title: "Evening Reflections",
    artist: "Michael Stone",
    image: "/albam.png",
  },
];

export function SavedAlbums() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-[repeat(auto-fill,132px)] md:grid-cols-6">
      {albums.map((album) => (
        <article key={album.title} className="min-w-0">
          <div className="relative w-[232px] overflow-hidden rounded">
            <Image
              src={album.image}
              alt={album.title}
             width={1000}
              height={1000}
              className="object-cover"
            />
          </div>
          <h2 className="mt-3 truncate text-xl font-medium leading-tight text-white">
            {album.title}
          </h2>
          <p className="mt-1 truncate text-base leading-tight text-[#8A8A8A]">
            {album.artist} - 2025
          </p>
        </article>
      ))}
    </div>
  );
}
