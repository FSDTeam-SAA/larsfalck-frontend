import ArtistCard from "./_components/ArtistCard";

const artists = [
  {
    name: "Lars Falck",
   image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
  {
    name: "Emma Rhodes",
    image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
  {
    name: "Daniel Hart",
    image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
  {
    name: "Sophia Lane",
    image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
  {
    name: "Michael Stone",
   image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
  {
    name: "Olivia Grace",
   image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
  {
    name: "Ethan Cole",
    image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
  {
    name: "Isabella Moore",
    image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
  {
    name: "Noah Brooks",
   image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
  {
    name: "Alexander Ross",
   image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
  {
    name: "Ava Bennett",
    image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
  {
    name: "Lucas Reed",
   image: "/artis.png" ,
    albums: 12,
    songs: 245,
  },
];

export default function Artists() {
  return (
    <section className="rounded-2xl bg-[#FFFFFF1A] p-4 md:p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">Artists</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {artists.map((artist) => (
          <ArtistCard key={artist.name} {...artist} />
        ))}
      </div>
    </section>
  );
}