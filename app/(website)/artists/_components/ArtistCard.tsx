import Image from "next/image";
import Link from "next/link";

type ArtistCardProps = {
  name: string;
  image: string;
  albums: number;
  songs: number;
};

export default function ArtistCard({
  name,
  image,
  albums,
  songs,
}: ArtistCardProps) {
  return (
    <Link href={`/single-artists/${name}`}>
    <div className="group cursor-pointer ">
      <div className="relative aspect-[4/4.2] overflow-hidden rounded-xl ">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="pt-3 text-center">
        <h3 className="truncate text-sm font-medium text-white md:text-xl">
          {name}
        </h3>

        <p className="mt-1 text-xs text-[#A8A8A8] md:text-lg">
          {albums} Albums • {songs} Songs
        </p>
      </div>
    </div>
    </Link>
  );
}