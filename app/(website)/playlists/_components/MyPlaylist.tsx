"use client";

import MusicCard from "@/components/common/MusicCard";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { CreatePlaylistModal } from "./CreatePlaylistModal";
import MyPlaylistSkeleton from "./MyPlaylistSkeleton";
import { getMyPlaylists } from "./playlist-api";

function getPlaylistYear(date: string) {
  const year = new Date(date).getFullYear();

  return Number.isNaN(year) ? undefined : year;
}

function formatSongCount(count: number) {
  return `${count.toLocaleString()} ${count === 1 ? "Song" : "Songs"}`;
}

export function MyPlaylist() {
  const { data: session, status } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)
    ?.accessToken;
  const isAuthenticated = status === "authenticated" && Boolean(token);

  const { data: playlists = [], isPending, error } = useQuery({
    queryKey: ["my-playlists", token],
    queryFn: () => getMyPlaylists(token as string),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  if (status === "loading" || (isAuthenticated && isPending)) {
    return <MyPlaylistSkeleton />;
  }

  return (
    <section className="px-3 py-5 sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center justify-between sm:mb-7">
        <h2 className="text-xl font-semibold text-[#FFFFFF] sm:text-3xl lg:text-4xl">
          Playlists 
        </h2>
        <CreatePlaylistModal />
      </div>

      <h3 className="mb-3 text-xl text-white">My Playlists</h3>

      {!isAuthenticated ? (
        <p className="rounded-lg bg-white/5 px-4 py-8 text-center text-sm text-[#A8A8A8]">
          Please sign in to view your playlists.
        </p>
      ) : error ? (
        <p className="rounded-lg bg-red-500/10 px-4 py-8 text-center text-sm text-red-300">
          {error instanceof Error
            ? error.message
            : "Unable to load playlists. Please try again later."}
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
              year={getPlaylistYear(playlist.createdAt)}
              type="Playlist"
            />
          ))}
        </div>
      ) : (
        <p className="rounded-lg bg-white/5 px-4 py-8 text-center text-sm text-[#A8A8A8]">
          You do not have any playlists yet.
        </p>
      )}
    </section>
  );
}
