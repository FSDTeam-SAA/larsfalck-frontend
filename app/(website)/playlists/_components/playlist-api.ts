export type Playlist = {
  _id: string;
  name: string;
  owner: string;
  ownerType: string;
  songs: string[];
  coverImage?: string;
  hasCustomCover: boolean;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type SongArtist = {
  _id: string;
  name: string;
  image?: string;
};

export type SongAlbum = {
  _id: string;
  name: string;
  coverImage?: string;
};

export type Song = {
  _id: string;
  name: string;
  artists: SongArtist[];
  albums: SongAlbum[];
  audioFile?: string;
  coverImage?: string;
  duration?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

type MyPlaylistsData = {
  playlists?: Playlist[];
};

type SongsData = {
  songs?: Song[];
};

type CreatePlaylistData =
  | Playlist
  | {
      playlist?: Playlist;
    };

type PlaylistMutationData =
  | Playlist
  | {
      playlist?: Playlist;
    };

export type CreatePlaylistInput = {
  name: string;
};

function getAuthHeaders(token?: string) {
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;
}

function isPlaylist(data: CreatePlaylistData): data is Playlist {
  return "_id" in data && typeof data._id === "string";
}

export async function getMyPlaylists(token: string): Promise<Playlist[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/playlist/my`,
    {
      headers: getAuthHeaders(token),
    },
  );
  const result = (await response.json()) as ApiResponse<MyPlaylistsData>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Could not load playlists");
  }

  return Array.isArray(result.data?.playlists) ? result.data.playlists : [];
}

export async function getSongs(token?: string): Promise<Song[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/song`, {
    headers: getAuthHeaders(token),
  });
  const result = (await response.json()) as ApiResponse<SongsData>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Could not load songs");
  }

  return Array.isArray(result.data?.songs) ? result.data.songs : [];
}

export async function createPlaylist(
  token: string,
  input: CreatePlaylistInput,
): Promise<Playlist | null> {
  const formData = new FormData();

  formData.append("name", input.name);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/playlist/my`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: formData,
    },
  );
  const result = (await response.json()) as ApiResponse<CreatePlaylistData>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Could not create playlist");
  }

  if (!result.data) return null;

  if ("playlist" in result.data) {
    return result.data.playlist ?? null;
  }

  return isPlaylist(result.data) ? result.data : null;
}

async function updatePlaylistSongs(
  token: string,
  playlistId: string,
  action: "add" | "remove",
  songIds: string[],
): Promise<Playlist | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/playlist/${encodeURIComponent(
      playlistId,
    )}/songs/${action}`,
    {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ songs: songIds }),
    },
  );
  const result = (await response.json()) as ApiResponse<PlaylistMutationData>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || `Could not ${action} song`);
  }

  if (!result.data) return null;

  if ("playlist" in result.data) {
    return result.data.playlist ?? null;
  }

  return isPlaylist(result.data) ? result.data : null;
}

export function addSongsToPlaylist(
  token: string,
  playlistId: string,
  songIds: string[],
) {
  return updatePlaylistSongs(token, playlistId, "add", songIds);
}

export function removeSongsFromPlaylist(
  token: string,
  playlistId: string,
  songIds: string[],
) {
  return updatePlaylistSongs(token, playlistId, "remove", songIds);
}

export function getSongArtists(song: Song) {
  return song.artists.map((artist) => artist.name).join(", ") || "Unknown";
}

export function getSongAlbum(song: Song) {
  return song.albums[0]?.name || "Single";
}

export function formatDuration(duration = 0) {
  const safeDuration = Number.isFinite(duration) ? Math.max(0, duration) : 0;
  const minutes = Math.floor(safeDuration / 60);
  const seconds = Math.floor(safeDuration % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatTotalDuration(duration: number) {
  const safeDuration = Number.isFinite(duration) ? Math.max(0, duration) : 0;
  const minutes = Math.floor(safeDuration / 60);
  const seconds = Math.floor(safeDuration % 60);

  if (minutes === 0) return `${seconds} sec`;

  return `${minutes} min${seconds ? ` ${seconds} sec` : ""}`;
}
