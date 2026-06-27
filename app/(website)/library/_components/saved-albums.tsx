"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import AlbumCard from "@/components/common/AlbumCard";
import {
  favoriteAlbumsQueryKey,
  getFavoriteAlbums,
} from "@/lib/favorite-albums";

import SavedAlbumsSkeleton from "./SavedAlbumsSkeleton";

function getArtists(artists: Array<{ name: string }> | undefined) {
  return artists?.map((artist) => artist.name).join(", ") || "Unknown";
}

function getReleaseYear(date?: string | null) {
  if (!date) return undefined;

  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? undefined : year;
}

export function SavedAlbums() {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const { data: albums = [], isPending, error } = useQuery({
    queryKey: favoriteAlbumsQueryKey(token),
    queryFn: () => getFavoriteAlbums(token as string),
    enabled: status === "authenticated" && Boolean(token),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  if (status === "loading" || (token && isPending)) {
    return <SavedAlbumsSkeleton />;
  }

  if (!token) {
    return (
      <p className="rounded-lg bg-white/5 px-4 py-8 text-center text-sm text-[#A8A8A8]">
        Please sign in to view your saved albums.
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-500/10 px-4 py-8 text-center text-sm text-red-300">
        {error instanceof Error
          ? error.message
          : "Unable to load saved albums."}
      </p>
    );
  }

  if (albums.length === 0) {
    return (
      <p className="rounded-lg bg-white/5 px-4 py-8 text-center text-sm text-[#A8A8A8]">
        No saved albums yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-6">
      {albums.map((album) => (
        <AlbumCard
          key={album._id}
          href={`/albums/${album._id}`}
          image={album.coverImage || "/albam.png"}
          title={album.name}
          artist={getArtists(album.artists)}
          year={getReleaseYear(album.releaseDate)}
        />
      ))}
    </div>
  );
}
