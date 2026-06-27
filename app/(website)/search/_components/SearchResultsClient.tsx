"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import MusicCard from "@/components/common/MusicCard";
import {
  buildSearchHref,
  getTags,
  searchMusic,
  type SearchAlbum,
  type SearchArtist,
  type SearchPlaylist,
  type SearchSong,
  type SearchType,
} from "@/lib/search";
import { cn } from "@/lib/utils";

const tabs: Array<{ label: string; value: SearchType }> = [
  { label: "All", value: "all" },
  { label: "Songs", value: "songs" },
  { label: "Artists", value: "artists" },
  { label: "Playlists", value: "playlists" },
  { label: "Albums", value: "albums" },
];

function getSongArtist(song: SearchSong) {
  return song.artists?.map((artist) => artist.name).join(", ") || "Unknown";
}

function getSongType(song: SearchSong) {
  return song.albums?.[0]?.name || song.genres?.[0]?.name || "Song";
}

function getSongImage(song: SearchSong) {
  return song.coverImage || song.albums?.[0]?.coverImage || "/albam.png";
}

function getAlbumArtist(album: SearchAlbum) {
  return album.artists?.map((artist) => artist.name).join(", ") || "Album";
}

function formatPlaylistSongs(playlist: SearchPlaylist) {
  const count = playlist.songs?.length ?? 0;

  return `${count.toLocaleString()} ${count === 1 ? "Song" : "Songs"}`;
}

function SearchGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {children}
    </div>
  );
}

function ResultSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7 first:mt-0">
      <h2 className="mb-4 text-xl font-semibold text-white sm:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const typeParam = searchParams.get("type");
  const type = tabs.some((tab) => tab.value === typeParam)
    ? (typeParam as SearchType)
    : "all";
  const tags = (searchParams.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const isTagSearch = tags.length > 0;
  const enabled = isTagSearch
    ? tags.length > 0
    : Boolean((query || "").trim());
  const searchKey = isTagSearch
    ? ["search", "tags", tags.join(",")]
    : ["search", type, query.trim()];

  const { data, isPending, error } = useQuery({
    queryKey: searchKey,
    queryFn: () =>
      isTagSearch
        ? searchMusic({ tags })
        : searchMusic({
            query,
            type,
          }),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
  const { data: allTags = [], isPending: isTagsPending } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  const songs = data?.songs ?? [];
  const artists = data?.artists ?? [];
  const albums = data?.albums ?? [];
  const playlists = data?.playlists ?? [];
  const totalResults =
    songs.length + artists.length + albums.length + playlists.length;

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-wrap justify-center gap-1.5 ">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={buildSearchHref({ query, type: tab.value })}
              className={cn(
                "rounded-full border border-white/15 px-3 py-1.5 text-xs text-[#CFCFCF] transition hover:border-white/30 hover:text-white",
                !isTagSearch &&
                  type === tab.value &&
                  "border-[#00EF01] bg-[#00EF01] text-black hover:border-[#00EF01] hover:text-black",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {isTagsPending ? (
            <span className="px-3 py-1.5 text-xs text-[#A8A8A8]">
              Loading tags...
            </span>
          ) : allTags.length > 0 ? (
            allTags.map((tag) => {
              const selected = tags.includes(tag.name);

              return (
                <Link
                  key={tag._id}
                  href={buildSearchHref({ query, tags: [tag.name] })}
                  className={cn(
                    "rounded-full border border-white/15 px-3 py-1.5 text-xs text-[#CFCFCF] transition hover:border-white/30 hover:text-white",
                    selected &&
                      "border-[#00EF01] bg-[#00EF01] text-black hover:border-[#00EF01] hover:text-black",
                  )}
                >
                  {tag.name}
                </Link>
              );
            })
          ) : (
            <span className="px-3 py-1.5 text-xs text-[#A8A8A8]">
              No tags found.
            </span>
          )}
        </div>
      </div>

      {!enabled ? (
        <p className="rounded-lg bg-white/5 px-4 py-10 text-center text-sm text-[#A8A8A8]">
          Type a search term in the navbar.
        </p>
      ) : isPending ? (
        <SearchGrid>
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="rounded-lg p-1.5 sm:p-2">
              <div className="aspect-[533/620] rounded-md bg-white/10" />
              <div className="mt-3 h-5 rounded bg-white/10" />
              <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />
            </div>
          ))}
        </SearchGrid>
      ) : error ? (
        <p className="rounded-lg bg-red-500/10 px-4 py-10 text-center text-sm text-red-300">
          {error instanceof Error ? error.message : "Unable to load search."}
        </p>
      ) : totalResults === 0 ? (
        <p className="rounded-lg bg-white/5 px-4 py-10 text-center text-sm text-[#A8A8A8]">
          No results found.
        </p>
      ) : (
        <>
          {(type === "all" || type === "songs" || isTagSearch) &&
            songs.length > 0 && (
              <ResultSection title="Songs">
                <SearchGrid>
                  {songs.map((song) => (
                    <MusicCard
                      key={song._id}
                      href={`/single-song/${encodeURIComponent(song._id)}`}
                      image={getSongImage(song)}
                      title={song.name}
                      artist={getSongArtist(song)}
                      type={getSongType(song)}
                    />
                  ))}
                </SearchGrid>
              </ResultSection>
            )}

          {(type === "all" || type === "artists") &&
            !isTagSearch &&
            artists.length > 0 && (
            <ResultSection title="Artists">
              <SearchGrid>
                {artists.map((artist: SearchArtist) => (
                  <MusicCard
                    key={artist._id}
                    href={`/single-artists/${encodeURIComponent(artist._id)}`}
                    image={artist.image || "/artis.png"}
                    title={artist.name}
                    type="Artist"
                  />
                ))}
              </SearchGrid>
            </ResultSection>
          )}

          {(type === "all" || type === "playlists") &&
            !isTagSearch &&
            playlists.length > 0 && (
            <ResultSection title="Playlists">
              <SearchGrid>
                {playlists.map((playlist) => (
                  <MusicCard
                    key={playlist._id}
                    href={`/playlists/${encodeURIComponent(
                      playlist._id,
                    )}?name=${encodeURIComponent(playlist.name)}`}
                    image={playlist.coverImage || "/albam.png"}
                    title={playlist.name}
                    artist={formatPlaylistSongs(playlist)}
                    type="Playlist"
                  />
                ))}
              </SearchGrid>
            </ResultSection>
          )}

          {(type === "all" || type === "albums") &&
            !isTagSearch &&
            albums.length > 0 && (
            <ResultSection title="Albums">
              <SearchGrid>
                {albums.map((album) => (
                  <MusicCard
                    key={album._id}
                    href={`/albums/${encodeURIComponent(album._id)}`}
                    image={album.coverImage || "/albam.png"}
                    title={album.name}
                    artist={getAlbumArtist(album)}
                    type="Album"
                  />
                ))}
              </SearchGrid>
            </ResultSection>
          )}

        </>
      )}
    </>
  );
}
