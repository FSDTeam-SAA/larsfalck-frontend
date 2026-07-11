"use client";

import { useQuery } from "@tanstack/react-query";

import ArtistCard from "./ArtistCard";
import ArtistsSkeleton from "./ArtistsSkeleton";

type Artist = {
  _id: string;
  name: string;
  description: string;
  image?: string;
  imageKey?: string;
  coverImage?: string;
  coverImageKey?: string;
  status: string;
  songCount: number;
  albumCount: number;
};

type ArtistsResponse = {
  success: boolean;
  message: string;
  data: {
    artists: Artist[];
  };
};

async function getArtists(): Promise<ArtistsResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/artist`,
  );
  const result = (await response.json()) as ArtistsResponse;

  if (!response.ok || !result.success || !Array.isArray(result.data?.artists)) {
    throw new Error(result.message || "Could not load artists");
  }

  return result;
}

const mediaBaseUrl = "https://larsfalck-media.s3.ap-south-1.amazonaws.com";

function getDirectMediaUrl(url?: string) {
  return url?.trim() || undefined;
}

function getMediaKeyUrl(key?: string) {
  const cleanKey = key?.trim().replace(/^\/+/, "");

  return cleanKey ? `${mediaBaseUrl}/${cleanKey}` : undefined;
}

function getArtistImageFallbacks(artist: Artist) {
  return [
    getMediaKeyUrl(artist.imageKey),
    getDirectMediaUrl(artist.coverImage),
    getMediaKeyUrl(artist.coverImageKey),
    "/artis.png",
  ].filter((source): source is string => Boolean(source));
}

function getArtistImage(artist: Artist) {
  return (
    getDirectMediaUrl(artist.image) ||
    getMediaKeyUrl(artist.imageKey) ||
    getDirectMediaUrl(artist.coverImage) ||
    getMediaKeyUrl(artist.coverImageKey) ||
    "/artis.png"
  );
}

export default function ArtistsList() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
    staleTime: 1000 * 60 * 5,
  });

  if (isPending) {
    return <ArtistsSkeleton />;
  }

  if (isError) {
    return (
      <p className="rounded-lg bg-red-500/10 px-4 py-8 text-center text-sm text-red-300">
        Unable to load artists. Please try again later.
      </p>
    );
  }

  const artists = data.data.artists;

  if (artists.length === 0) {
    return (
      <p className="rounded-lg bg-white/5 px-4 py-8 text-center text-sm text-[#A8A8A8]">
        No artists found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {artists.map((artist) => (
        <ArtistCard
          key={artist._id}
          id={artist._id}
          name={artist.name}
          image={getArtistImage(artist)}
          fallbackImages={getArtistImageFallbacks(artist)}
          albums={artist.albumCount}
          songs={artist.songCount}
        />
      ))}
    </div>
  );
}
