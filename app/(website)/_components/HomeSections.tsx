"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { FeaturedPlaylist } from "@/components/web-components/FeaturedPlaylist";
import { PopularAlbum } from "@/components/web-components/PopularAlbum";
import type { HomeAlbum } from "@/components/web-components/PopularAlbum";
import { Recommended } from "@/components/web-components/Recommended";
import { PopularArtists } from "@/components/web-components/popular-artists";
import type { HomeArtist } from "@/components/web-components/popular-artists";
import {
  PopularSongs,
  type HomeSong,
} from "@/components/web-components/popular-songs";

import HomeSectionsSkeleton from "./HomeSectionsSkeleton";

export type HomeSectionsData = {
  popularSongs: HomeSong[];
  popularArtists: HomeArtist[];
  popularAlbums: HomeAlbum[];
  recommended: HomeSong[];
};

type HomeSectionsResponse = {
  success: boolean;
  message: string;
  data?: Partial<HomeSectionsData>;
};

const emptySections: HomeSectionsData = {
  popularSongs: [],
  popularArtists: [],
  popularAlbums: [],
  recommended: [],
};

export async function getHomeSections(
  token?: string,
): Promise<HomeSectionsData> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/home/sections`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    },
  );
  const result = (await response.json()) as HomeSectionsResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Could not load homepage sections");
  }

  return {
    popularSongs: Array.isArray(result.data?.popularSongs)
      ? result.data.popularSongs
      : emptySections.popularSongs,
    popularArtists: Array.isArray(result.data?.popularArtists)
      ? result.data.popularArtists
      : emptySections.popularArtists,
    popularAlbums: Array.isArray(result.data?.popularAlbums)
      ? result.data.popularAlbums
      : emptySections.popularAlbums,
    recommended: Array.isArray(result.data?.recommended)
      ? result.data.recommended
      : emptySections.recommended,
  };
}

export default function HomeSections() {
  const { data: session, status } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)
    ?.accessToken;

  const { data, isPending, error } = useQuery({
    queryKey: ["home-sections", token || "public"],
    queryFn: () => getHomeSections(token),
    enabled: status !== "loading",
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  if (status === "loading" || isPending) {
    return <HomeSectionsSkeleton />;
  }

  if (error) {
    return (
      <>
        <section className="px-3 py-5 sm:px-6 sm:py-6">
          <p className="rounded-lg bg-red-500/10 px-4 py-8 text-center text-sm text-red-300">
            {error instanceof Error
              ? error.message
              : "Unable to load homepage sections."}
          </p>
        </section>
        <FeaturedPlaylist />
      </>
    );
  }

  return (
    <>
      <PopularSongs songs={data.popularSongs} />
      <FeaturedPlaylist />
      <PopularArtists artists={data.popularArtists} />
      <Recommended songs={data.recommended} />
      <PopularAlbum albums={data.popularAlbums} />
    </>
  );
}
