import MusicCard from "@/components/common/MusicCard";

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

export function Playlists() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-6">
      {albums.map((album) => (
        <MusicCard
          key={album.title}
          image={album.image}
          title={album.title}
          artist={album.artist}
          year={2025}
          type="Playlist"
        />
      ))}
    </div>
  );
}
