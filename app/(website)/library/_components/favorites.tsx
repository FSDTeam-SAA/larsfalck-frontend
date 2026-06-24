"use client";

import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { FavoriteSongButton } from "@/components/common/FavoriteSongButton";
import {
  favoriteSongsQueryKey,
  getFavoriteSongs,
} from "@/lib/favorite-songs";

import {
  formatDuration,
  getSongAlbum,
  getSongArtists,
} from "../../playlists/_components/playlist-api";

import FavoritesSkeleton from "./FavoritesSkeleton";

export function Favorites() {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const { data: songs = [], isPending, error } = useQuery({
    queryKey: favoriteSongsQueryKey(token),
    queryFn: () => getFavoriteSongs(token as string),
    enabled: status === "authenticated" && Boolean(token),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  if (status === "loading" || (token && isPending)) {
    return <FavoritesSkeleton />;
  }

  if (!token) {
    return (
      <p className="rounded-lg bg-white/5 px-4 py-8 text-center text-sm text-[#A8A8A8]">
        Please sign in to view your favorite songs.
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-500/10 px-4 py-8 text-center text-sm text-red-300">
        {error instanceof Error
          ? error.message
          : "Unable to load favorite songs."}
      </p>
    );
  }

  if (songs.length === 0) {
    return (
      <p className="rounded-lg bg-white/5 px-4 py-8 text-center text-sm text-[#A8A8A8]">
        No favorite songs yet.
      </p>
    );
  }

  return (
    <div className="w-full">
      {songs.map((song, index) => (
        <div
          key={song._id}
          className="grid grid-cols-[40px_52px_minmax(220px,1fr)_minmax(180px,280px)_40px_60px_30px] items-center gap-4 px-3 py-3 transition-colors hover:bg-white/5"
        >
          <span className="text-sm text-white/80">
            {String(index + 1).padStart(2, "0")}
          </span>

          <Link
            href={`/single-song/${song._id}`}
            className="relative h-12 w-12 overflow-hidden rounded-md bg-white/5"
          >
            <Image
              src={song.coverImage || "/albam.png"}
              alt={song.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </Link>

          <div className="min-w-0">
            <Link
              href={`/single-song/${song._id}`}
              className="block truncate text-[18px] font-medium text-white hover:underline"
            >
              {song.name}
            </Link>
            <p className="truncate text-[15px] text-[#8A8A8A]">
              {getSongArtists(song)}
            </p>
          </div>

          <p className="truncate text-[18px] text-[#A0A0A0]">
            {getSongAlbum(song)}
          </p>

          <FavoriteSongButton
            songId={song._id}
            songName={song.name}
            isFavorite
            iconClassName="text-[#00EF01]"
          />

          <span className="text-l6 text-white/80">
            {formatDuration(song.duration)}
          </span>

          <button
            type="button"
            aria-label={`More options for ${song.name}`}
            className="text-white/60 hover:text-white"
          >
            <MoreHorizontal className="size-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
