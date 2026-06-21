import { notFound } from "next/navigation";

import { getAlbumBySlug } from "@/lib/albums";
import { AlbumDetails } from "../_components/AlbumDetails";

type AlbumPageProps = {
  params: {
    id: string;
  };
};

export default function AlbumPage({ params }: AlbumPageProps) {
  const album = getAlbumBySlug(params.id);

  if (!album) notFound();

  return <AlbumDetails album={album} />;
}
