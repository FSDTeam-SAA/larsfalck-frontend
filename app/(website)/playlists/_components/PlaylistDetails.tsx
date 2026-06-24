"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CircleCheck,
  Clock3,
  MoreHorizontal,
  Pause,
  Play,
  Search,
  Shuffle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type PlayerTrack,
  usePlayer,
} from "@/components/providers/PlayerProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import PlaylistDetailsSkeleton from "./PlaylistDetailsSkeleton";
import {
  addSongsToPlaylist,
  formatDuration,
  formatTotalDuration,
  getMyPlaylists,
  getPlaylistDetails,
  getSongAlbum,
  getSongArtists,
  getSongs,
  removeSongsFromPlaylist,
  type Playlist,
  type PlaylistOwner,
  type Song,
} from "./playlist-api";

type PlaylistDetailsProps = {
  playlistId: string;
  title: string;
  owner?: string;
};

type SongMutationVariables = {
  songId: string;
  action: "add" | "remove";
};

function formatDate(date?: string) {
  if (!date) return "Added";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Added";

  return parsedDate.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function updatePlaylistSongIds(
  playlists: Playlist[] | undefined,
  playlistId: string,
  songId: string,
  action: "add" | "remove",
) {
  return playlists?.map((playlist) => {
    if (playlist._id !== playlistId) return playlist;

    const hasSong = playlist.songs.includes(songId);
    const songs =
      action === "add"
        ? hasSong
          ? playlist.songs
          : [...playlist.songs, songId]
        : playlist.songs.filter((id) => id !== songId);

    return {
      ...playlist,
      songs,
    };
  });
}

function isSong(value: string | Song): value is Song {
  return typeof value !== "string";
}

function getOwnerId(owner: PlaylistOwner | undefined) {
  return typeof owner === "string" ? owner : owner?._id;
}

function getOwnerName(owner: PlaylistOwner | undefined, fallback: string) {
  return typeof owner === "object" && owner.name ? owner.name : fallback;
}

export function PlaylistDetails({
  playlistId,
  title,
  owner = "David Park",
}: PlaylistDetailsProps) {
  const [query, setQuery] = useState("");
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { currentTrack, isPlaying, isShuffle, playQueue, togglePlay } =
    usePlayer();
  const token = (session?.user as { accessToken?: string } | undefined)
    ?.accessToken;
  const isAuthenticated = status === "authenticated" && Boolean(token);
  const playlistsQueryKey = ["my-playlists", token] as const;
  const playlistQueryKey = ["playlist", playlistId, token || "public"] as const;

  const { data: playlists = [] } = useQuery({
    queryKey: playlistsQueryKey,
    queryFn: () => getMyPlaylists(token as string),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: playlistDetails,
    isPending: isPlaylistPending,
    error: playlistError,
  } = useQuery({
    queryKey: playlistQueryKey,
    queryFn: () => getPlaylistDetails(playlistId, token),
    enabled: status !== "loading",
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: songs = [],
    isPending: isSongsPending,
    error: songsError,
  } = useQuery({
    queryKey: ["songs", token],
    queryFn: () => getSongs(token),
    enabled: status !== "loading",
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const fallbackPlaylist = useMemo(
    () => playlists.find((item) => item._id === playlistId),
    [playlistId, playlists],
  );
  const playlist = playlistDetails ?? fallbackPlaylist;
  const playlistSongsData = playlist?.songs ?? [];
  const embeddedPlaylistSongs = useMemo(
    () => playlistSongsData.filter(isSong),
    [playlistSongsData],
  );
  const hasEmbeddedSongs = embeddedPlaylistSongs.length > 0;
  const playlistSongIds = useMemo(
    () =>
      playlistSongsData.map((song) =>
        typeof song === "string" ? song : song._id,
      ),
    [playlistSongsData],
  );
  const canEditPlaylist =
    isAuthenticated && getOwnerId(playlist?.owner) === session?.user?.id;

  const songsById = useMemo(() => {
    return new Map(
      [...songs, ...embeddedPlaylistSongs].map((song) => [song._id, song]),
    );
  }, [embeddedPlaylistSongs, songs]);

  const playlistSongs = useMemo(
    () =>
      playlistSongIds
        .map((songId) => songsById.get(songId))
        .filter((song): song is NonNullable<typeof song> => Boolean(song)),
    [playlistSongIds, songsById],
  );

  const filteredSongs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return songs;

    return songs.filter((song) => {
      const artists = getSongArtists(song).toLowerCase();
      const album = getSongAlbum(song).toLowerCase();

      return (
        song.name.toLowerCase().includes(normalizedQuery) ||
        artists.includes(normalizedQuery) ||
        album.includes(normalizedQuery)
      );
    });
  }, [query, songs]);

  const playerTracks = useMemo<PlayerTrack[]>(
    () =>
      playlistSongs.map((song) => ({
        id: song._id,
        title: song.name,
        artist: getSongArtists(song),
        image: song.coverImage || "/albam.png",
        audioUrl: song.audioFile || "",
        duration: song.duration || 0,
        albumId: `playlist:${playlistId}`,
      })),
    [playlistId, playlistSongs],
  );
  const isCurrentPlaylist = currentTrack?.albumId === `playlist:${playlistId}`;
  const isPlaylistPlaying = isCurrentPlaylist && isPlaying;
  const playableTrackCount = playerTracks.filter((track) =>
    Boolean(track.audioUrl),
  ).length;
  const coverImage =
    playlist?.coverImage ||
    playlistSongs[0]?.coverImage ||
    songs[0]?.coverImage ||
    "/albam.png";
  const totalDuration = playlistSongs.reduce(
    (total, song) => total + (song.duration || 0),
    0,
  );
  const metadata = `${playlistSongIds.length.toLocaleString()} ${
    playlistSongIds.length === 1 ? "song" : "songs"
  }${
    playlistSongs.length > 0 ? `, ${formatTotalDuration(totalDuration)}` : ""
  }`;

  const songMutation = useMutation({
    mutationFn: ({ songId, action }: SongMutationVariables) =>
      action === "add"
        ? addSongsToPlaylist(token as string, playlistId, [songId])
        : removeSongsFromPlaylist(token as string, playlistId, [songId]),
    onMutate: async ({ songId, action }) => {
      await queryClient.cancelQueries({ queryKey: playlistsQueryKey });

      const previousPlaylists =
        queryClient.getQueryData<Playlist[]>(playlistsQueryKey);

      queryClient.setQueryData<Playlist[]>(playlistsQueryKey, (current) =>
        updatePlaylistSongIds(current, playlistId, songId, action),
      );

      return { previousPlaylists };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(playlistsQueryKey, context?.previousPlaylists);
    },
    onSuccess: (updatedPlaylist) => {
      if (!updatedPlaylist) return;

      queryClient.setQueryData<Playlist[]>(playlistsQueryKey, (current) =>
        current?.map((item) =>
          item._id === updatedPlaylist._id ? updatedPlaylist : item,
        ),
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: playlistsQueryKey });
      void queryClient.invalidateQueries({ queryKey: playlistQueryKey });
    },
  });

  function handlePlayPlaylist() {
    if (isCurrentPlaylist) {
      togglePlay();
      return;
    }

    playQueue(playerTracks);
  }

  function handleShufflePlaylist() {
    playQueue(playerTracks, { shuffle: true });
  }

  function handleSongAction(songId: string, isAdded: boolean) {
    if (!isAuthenticated || songMutation.isPending) return;

    songMutation.mutate({
      songId,
      action: isAdded ? "remove" : "add",
    });
  }

  if (
    status === "loading" ||
    isPlaylistPending ||
    (isSongsPending && !hasEmbeddedSongs)
  ) {
    return <PlaylistDetailsSkeleton />;
  }

  if (playlistError || (songsError && !hasEmbeddedSongs)) {
    const error = playlistError || songsError;

    return (
      <section className="rounded-xl bg-[#FFFFFF1A] px-4 py-16 text-center text-white">
        <h1 className="text-xl font-semibold">Unable to load playlist</h1>
        <p className="mt-2 text-sm text-[#A8A8A8]">
          {error instanceof Error ? error.message : "Please try again later."}
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-full overflow-hidden rounded-xl bg-[#FFFFFF1A] text-white">
      <header className="bg-[linear-gradient(0deg,_#171917_0%,_#4C4C4C_126.43%)] p-3 sm:p-5 lg:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="relative aspect-square w-full max-w-[232px] shrink-0 overflow-hidden rounded shadow-xl sm:w-[232px]">
            <Image
              src={coverImage}
              alt={`${title} cover`}
              fill
              priority
              sizes="232px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 pb-1 sm:pb-2">
            <p className="text-xs text-white sm:text-2xl">Public Playlist</p>
            <h1 className="mt-1 break-words text-3xl font-semibold leading-none text-[#00EF01] sm:mt-2 sm:text-7xl">
              {playlist?.name || title}
            </h1>
            <p className="mt-3 text-xs text-[#A8A8A8] sm:text-base">
              <span className="font-semibold text-white">
                {getOwnerName(playlist?.owner, session?.user?.name || owner)}
              </span>
              <span aria-hidden="true"> · </span>
              {metadata}
            </p>
          </div>
        </div>
      </header>

      <div className="px-3 pb-6 pt-5 sm:px-5 sm:pb-8 sm:pt-10 lg:px-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="icon"
            aria-label={isPlaylistPlaying ? "Pause playlist" : "Play playlist"}
            onClick={handlePlayPlaylist}
            disabled={playableTrackCount === 0}
            className="size-9 rounded-full bg-[#00EF01] text-black hover:scale-105 hover:bg-[#00D801] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPlaylistPlaying ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="ml-0.5 size-5 fill-current" />
            )}
          </Button>

          <div className="relative aspect-[533/620] w-8 overflow-hidden rounded-sm">
            <Image
              src={coverImage}
              alt=""
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Shuffle playlist"
            onClick={handleShufflePlaylist}
            disabled={playableTrackCount === 0}
            className={cn(
              "size-8 text-[#D0D0D0] hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40",
              isCurrentPlaylist && isShuffle && "text-[#00EF01]",
            )}
          >
            <Shuffle className="size-5" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="More playlist options"
            className="size-8 text-[#A8A8A8] hover:bg-white/5 hover:text-white"
          >
            <MoreHorizontal className="size-5" />
          </Button>
        </div>

        <div className="mt-4">
          <div className="hidden grid-cols-[32px_minmax(180px,1.4fr)_minmax(120px,1fr)_minmax(110px,0.8fr)_24px_44px_24px] items-center gap-3 border-b border-white/5 px-1 pb-3 text-base text-[#C7C7C7] md:grid">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span>Date added</span>
            <span />
            <Clock3 className="mx-auto size-4" aria-label="Duration" />
            <span />
          </div>

          {playlistSongs.length > 0 ? (
            playlistSongs.map((song, index) => (
              <div
                key={song._id}
                className="grid grid-cols-[24px_minmax(0,1fr)_44px_24px] items-center gap-2 rounded-md px-1 py-3 transition-colors hover:bg-white/5 md:grid-cols-[32px_minmax(180px,1.4fr)_minmax(120px,1fr)_minmax(110px,0.8fr)_24px_44px_24px] md:gap-3"
              >
                <span className="text-center text-sm text-[#C7C7C7]">
                  {index + 1}
                </span>

                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="relative aspect-[533/620] w-9 shrink-0 overflow-hidden rounded-sm bg-white/5">
                    <Image
                      src={song.coverImage || "/albam.png"}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={cn(
                        "truncate text-sm font-medium text-white sm:text-base",
                        currentTrack?.id === song._id && "text-[#00EF01]",
                      )}
                    >
                      {song.name}
                    </h3>
                    <p className="truncate text-xs text-[#A8A8A8]">
                      {getSongArtists(song)}
                    </p>
                  </div>
                </div>

                <p className="hidden truncate text-base text-[#E0E0E0] md:block">
                  {getSongAlbum(song)}
                </p>
                <p className="hidden truncate text-base text-[#E0E0E0] md:block">
                  {formatDate(song.createdAt)}
                </p>
                <CircleCheck className="hidden size-5 text-[#00EF01] md:block" />
                <span className="text-right text-base text-[#D7D7D7] md:text-center">
                  {formatDuration(song.duration)}
                </span>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label={`More options for ${song.name}`}
                  className="text-[#A8A8A8] hover:bg-white/5 hover:text-white"
                >
                  <MoreHorizontal className="size-6" />
                </Button>
              </div>
            ))
          ) : (
            <p className="rounded-md bg-white/5 px-4 py-8 text-center text-sm text-[#A8A8A8]">
              No songs added to this playlist yet.
            </p>
          )}
        </div>

        {canEditPlaylist && (
          <div className="mt-5 sm:mt-7">
            <h2 className="text-lg font-semibold sm:text-3xl">
              Let&apos;s find something for your playlist
            </h2>

            <div className="relative mt-4 w-full max-w-[500px]">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A8A8A8]"
              />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search songs"
                placeholder="Search for songs..."
                className="h-12 rounded-full border-0 bg-[#333333] pl-9 pr-4 text-sm text-white placeholder:text-[#A8A8A8] focus-visible:ring-[#00EF01]/40 dark:bg-[#393939]"
              />
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-medium sm:text-2xl">Recommended</h2>
              <p className="mt-1 text-xs text-[#8A8A8A] sm:text-sm">
                Based on your listening
              </p>

              <div className="mt-3 space-y-1">
                {filteredSongs.map((song, index) => {
                  const isAdded = playlistSongIds.includes(song._id);
                  const isSaving =
                    songMutation.isPending &&
                    songMutation.variables?.songId === song._id;

                  return (
                    <div
                      key={song._id}
                      className="grid grid-cols-[20px_32px_minmax(0,1fr)_auto] items-center gap-2 rounded-md px-1 py-1.5 transition-colors hover:bg-white/5 sm:grid-cols-[24px_36px_minmax(0,1fr)_auto] sm:gap-2.5"
                    >
                      <span className="text-center text-xs text-[#D4D4D4] sm:text-sm">
                        {index + 1}
                      </span>

                      <div className="relative aspect-[533/620] w-8 overflow-hidden rounded-sm bg-white/5 sm:w-9">
                        <Image
                          src={song.coverImage || "/albam.png"}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-white sm:text-base">
                          {song.name}
                        </h3>
                        <p className="truncate text-xs text-[#A8A8A8]">
                          {getSongArtists(song)}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        aria-pressed={isAdded}
                        disabled={songMutation.isPending}
                        onClick={() => handleSongAction(song._id, isAdded)}
                        className={cn(
                          "h-7 min-w-16 rounded-full border-white/80 bg-transparent px-3 text-xs text-white hover:border-white hover:bg-white sm:min-w-20",
                          isAdded &&
                            "border-red-500 text-red-500 bg-transparent hover:border-red-600 hover:text-red-600 hover:bg-red-500/10",
                        )}
                      >
                        {isSaving ? "Saving..." : isAdded ? "Remove" : "Add"}
                      </Button>
                    </div>
                  );
                })}

                {filteredSongs.length === 0 && (
                  <p className="py-8 text-center text-sm text-[#A8A8A8]">
                    No matching songs found.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
