"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import MusicCard from "@/components/common/MusicCard";

import FeaturedPlaylistSkeleton from "./FeaturedPlaylistSkeleton";

type PublicPlaylist = {
  _id: string;
  name: string;
  songs: string[];
  coverImage?: string;
  createdAt: string;
};

type PublicPlaylistsResponse = {
  success: boolean;
  message: string;
  data?: {
    playlists?: PublicPlaylist[];
  };
};

async function getPublicPlaylists() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/playlist/public`,
  );
  const result = (await response.json()) as PublicPlaylistsResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Could not load featured playlists");
  }

  return Array.isArray(result.data?.playlists) ? result.data.playlists : [];
}

function formatSongCount(count: number) {
  return `${count.toLocaleString()} ${count === 1 ? "Song" : "Songs"}`;
}

export function FeaturedPlaylist() {
  const { data: playlists = [], isPending, error } = useQuery({
    queryKey: ["public-playlists"],
    queryFn: getPublicPlaylists,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  if (isPending) {
    return <FeaturedPlaylistSkeleton />;
  }

  return (
    <section className="px-3 py-5 sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center justify-between sm:mb-7">
        <h2 className="text-xl font-semibold text-[#FFFFFF] sm:text-3xl lg:text-4xl">
          Featured Playlists
        </h2>
        <Link
          href="/songs"
          className="text-sm font-medium text-[#A8A8A8] hover:text-white sm:text-lg"
        >
          Show all
        </Link>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-500/10 px-4 py-8 text-center text-sm text-red-300">
          {error instanceof Error
            ? error.message
            : "Unable to load featured playlists."}
        </p>
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {playlists.map((playlist) => (
            <MusicCard
              key={playlist._id}
              href={`/playlists/${playlist._id}?name=${encodeURIComponent(
                playlist.name,
              )}`}
              image={playlist.coverImage || "/albam.png"}
              title={playlist.name}
              artist={formatSongCount(playlist.songs.length)}
              type="Playlist"
            />
          ))}
        </div>
      ) : (
        <p className="rounded-lg bg-white/5 px-4 py-8 text-center text-sm text-[#A8A8A8]">
          No featured playlists found.
        </p>
      )}
    </section>
  );
}
