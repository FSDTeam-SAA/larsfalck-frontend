 import Image from "next/image";
export type MusicItem = {
  id: number;
  title: string;
  artist: string;
  year: number;
  type: "Album" | "Single";
  duration: string;
  image: string;
};

interface MusicCardProps {
  item: MusicItem;
}

export default function MusicCard({ item }: MusicCardProps) {
  return (
    <div className=" rounded-2xl overflow-hidden hover:scale-[1.02] transition duration-300 cursor-pointer shadow-lg">
      
      <div className="relative w-full h-48">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-lg">
          {item.title}
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          {item.artist} • {item.year}
        </p>

        <p className="text-gray-500 text-xs mt-2">
          {item.type} • {item.duration}
        </p>
      </div>
    </div>
  );
}