"use client";

import * as React from "react";
import Image from "next/image";
import {
  Check,
  Music2,
  Pause,
  Play,
  Plus,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";

import { usePlayer } from "@/components/providers/PlayerProvider";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = Math.floor(safeSeconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function Footer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    setIsFavorite(false);
  }, [currentTrack?.id]);

  const safeDuration = Math.max(duration, 0);
  const safeCurrentTime =
    safeDuration > 0 ? Math.min(currentTime, safeDuration) : 0;
  const progressPercentage =
    safeDuration > 0 ? (safeCurrentTime / safeDuration) * 100 : 0;
  const volumePercentage = (isMuted ? 0 : volume) * 100;
  const VolumeIcon =
    isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;
  const hasTrack = Boolean(currentTrack);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/5 bg-[#161616]">
      <div className="grid min-h-[132px] grid-rows-[auto_auto_auto] gap-2 px-3 py-2 md:h-20 md:min-h-0 md:grid-cols-[260px_minmax(0,1fr)_260px] md:grid-rows-none md:items-center md:px-6 md:py-0 lg:grid-cols-[300px_minmax(0,1fr)_300px]">
        <div className="flex min-w-0 items-center gap-2 justify-self-stretch md:gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/5 sm:size-12 md:size-14">
            {currentTrack ? (
              <Image
                src={currentTrack.image || "/albam.png"}
                alt={currentTrack.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <Music2 className="size-5 text-zinc-500" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white sm:text-base">
              {currentTrack?.title || "Choose a song"}
            </p>
            <p className="truncate text-xs text-[#A8A8A8]">
              {currentTrack?.artist || "Nothing is playing"}
            </p>
          </div>

          {currentTrack && (
            <button
              type="button"
              onClick={() => setIsFavorite((favorite) => !favorite)}
              className={cn(
                "ml-1 hidden size-6 shrink-0 items-center justify-center rounded-full border text-zinc-400 transition hover:text-white sm:flex",
                isFavorite
                  ? "border-[#1ed760] text-[#1ed760]"
                  : "border-zinc-600",
              )}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorite ? (
                <Check className="size-3.5" />
              ) : (
                <Plus className="size-3.5" />
              )}
            </button>
          )}
        </div>

        <div className="flex w-full items-center gap-2 md:hidden">
          <span className="w-9 text-right text-[10px] text-zinc-400">
            {formatTime(safeCurrentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={safeDuration || 0}
            step={0.1}
            value={safeCurrentTime}
            onChange={(event) => seek(Number(event.target.value))}
            disabled={!hasTrack || safeDuration === 0}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-700 accent-[#1ed760] disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #1ed760 ${progressPercentage}%, #3f3f46 ${progressPercentage}%)`,
            }}
            aria-label="Seek through track"
          />
          <span className="w-9 text-[10px] text-zinc-400">
            {formatTime(safeDuration)}
          </span>
        </div>

        <div className="flex items-center justify-center gap-5 md:hidden">
          <button
            type="button"
            onClick={toggleShuffle}
            disabled={!hasTrack}
            className={cn(
              "text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30",
              isShuffle && "text-[#1ed760] hover:text-[#1ed760]",
            )}
            aria-label={isShuffle ? "Disable shuffle" : "Enable shuffle"}
            aria-pressed={isShuffle}
          >
            <Shuffle className="size-4" />
          </button>

          <button
            type="button"
            onClick={playPrevious}
            disabled={!hasTrack}
            className="text-zinc-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous track"
          >
            <SkipBack className="size-5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            disabled={!hasTrack}
            className="flex size-10 items-center justify-center rounded-full bg-white text-black disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="size-4 fill-current" />
            ) : (
              <Play className="size-4 fill-current" />
            )}
          </button>

          <button
            type="button"
            onClick={playNext}
            disabled={!hasTrack}
            className="text-zinc-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next track"
          >
            <SkipForward className="size-5" />
          </button>

          <button
            type="button"
            onClick={cycleRepeat}
            disabled={!hasTrack}
            className={cn(
              "text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30",
              repeatMode !== "off" && "text-[#1ed760] hover:text-[#1ed760]",
            )}
            aria-label={`Repeat ${repeatMode}`}
          >
            <RepeatIcon className="size-4" />
          </button>
        </div>

        <div className="hidden w-full max-w-xl flex-col items-center gap-2 justify-self-center md:flex">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={toggleShuffle}
              disabled={!hasTrack}
              className={cn(
                "text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30",
                isShuffle && "text-[#1ed760] hover:text-[#1ed760]",
              )}
              aria-label={isShuffle ? "Disable shuffle" : "Enable shuffle"}
              aria-pressed={isShuffle}
            >
              <Shuffle className="size-4" />
            </button>

            <button
              type="button"
              onClick={playPrevious}
              disabled={!hasTrack}
              className="text-zinc-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Previous track"
            >
              <SkipBack className="size-4" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              disabled={!hasTrack}
              className="flex size-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="size-4 fill-current" />
              )}
            </button>

            <button
              type="button"
              onClick={playNext}
              disabled={!hasTrack}
              className="text-zinc-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Next track"
            >
              <SkipForward className="size-4" />
            </button>

            <button
              type="button"
              onClick={cycleRepeat}
              disabled={!hasTrack}
              className={cn(
                "text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30",
                repeatMode !== "off" &&
                  "text-[#1ed760] hover:text-[#1ed760]",
              )}
              aria-label={`Repeat ${repeatMode}`}
            >
              <RepeatIcon className="size-4" />
            </button>
          </div>

          <div className="flex w-full max-w-xl items-center gap-2">
            <span className="w-10 text-right text-[11px] text-zinc-400">
              {formatTime(safeCurrentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={safeDuration || 0}
              step={0.1}
              value={safeCurrentTime}
              onChange={(event) => seek(Number(event.target.value))}
              disabled={!hasTrack || safeDuration === 0}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-700 accent-[#1ed760] disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #1ed760 ${progressPercentage}%, #3f3f46 ${progressPercentage}%)`,
              }}
              aria-label="Seek through track"
            />
            <span className="w-10 text-[11px] text-zinc-400">
              {formatTime(safeDuration)}
            </span>
          </div>
        </div>

        <div className="hidden items-center justify-end gap-3 justify-self-end lg:flex">
          <button
            type="button"
            onClick={toggleMute}
            disabled={!hasTrack}
            className="text-zinc-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            <VolumeIcon className="size-4" />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            disabled={!hasTrack}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-zinc-700 accent-[#1ed760] disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #1ed760 ${volumePercentage}%, #3f3f46 ${volumePercentage}%)`,
            }}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
