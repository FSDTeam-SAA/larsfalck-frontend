// components/player-bar.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  ListMusic,
  Plus,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Track = {
  title: string;
  artist: string;
  image: string;
  src: string;
  duration: number; // seconds, used as fallback before metadata loads
};

const playlist: Track[] = [
  {
    title: "Morning Serenity",
    artist: "Lars Falck • Piano Collection...",
    image: "/songs/morning-serenity.jpg",
    src: "/audio/morning-serenity.mp3",
    duration: 176,
  },
  {
    title: "Ocean Breeze",
    artist: "Daniel Hart • Nature Sounds Coll...",
    image: "/songs/ocean-breeze.jpg",
    src: "/audio/ocean-breeze.mp3",
    duration: 198,
  },
  {
    title: "Zen Journey",
    artist: "Daniel Hart • Meditation Essential...",
    image: "/songs/zen-journey.jpg",
    src: "/audio/zen-journey.mp3",
    duration: 210,
  },
  {
    title: "Sunset Dreams",
    artist: "Sophia Lane • Evening Lounge • 2...",
    image: "/songs/sunset-dreams.jpg",
    src: "/audio/sunset-dreams.mp3",
    duration: 184,
  },
];

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Footer() {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const [trackIndex, setTrackIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(playlist[0].duration);
  const [volume, setVolume] = React.useState(0.8);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isShuffle, setIsShuffle] = React.useState(false);
  const [repeatMode, setRepeatMode] = React.useState<"off" | "all" | "one">("off");
  const [isFavorite, setIsFavorite] = React.useState(false);

  const track = playlist[trackIndex];

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  React.useEffect(() => {
    setCurrentTime(0);
    setIsFavorite(false);
    const audio = audioRef.current;
    if (audio) {
      audio.load();
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    }
  }, [trackIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }

  function playNext() {
    setIsPlaying(true);
    if (isShuffle) {
      const next = Math.floor(Math.random() * playlist.length);
      setTrackIndex(next);
    } else {
      setTrackIndex((i) => (i + 1) % playlist.length);
    }
  }

  function playPrev() {
    setIsPlaying(true);
    setTrackIndex((i) => (i - 1 + playlist.length) % playlist.length);
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  }

  function handleLoadedMetadata() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isFinite(audio.duration)) setDuration(audio.duration);
  }

  function handleEnded() {
    if (repeatMode === "one") {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
      return;
    }
    if (repeatMode === "off" && trackIndex === playlist.length - 1 && !isShuffle) {
      setIsPlaying(false);
      return;
    }
    playNext();
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    const value = Number(e.target.value);
    setCurrentTime(value);
    if (audio) audio.currentTime = value;
  }

  function cycleRepeat() {
    setRepeatMode((m) => (m === "off" ? "all" : m === "all" ? "one" : "off"));
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    setVolume(value);
    if (value > 0 && isMuted) setIsMuted(false);
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/5 bg-[#161616]">
      <audio
        ref={audioRef}
        src={track.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* mobile thin progress bar */}
      <div className="h-0.5 w-full bg-zinc-700 sm:hidden">
        <div
          className="h-full bg-[#1ed760] transition-[width]"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="grid h-[72px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 sm:gap-4 sm:px-4 md:h-20 md:grid-cols-[260px_minmax(0,1fr)_260px] md:px-6 lg:grid-cols-[300px_minmax(0,1fr)_300px]">
        {/* Track info */}
        <div className="flex min-w-0 items-center gap-2 justify-self-stretch md:gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md sm:h-12 sm:w-12 md:h-14 md:w-14">
            <Image src={track.image} alt={track.title} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{track.title}</p>
            <p className="truncate text-xs text-zinc-400">{track.artist}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsFavorite((v) => !v)}
            className={cn(
              "ml-1 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full border text-zinc-400 hover:text-white sm:flex",
              isFavorite
                ? "border-[#1ed760] text-[#1ed760]"
                : "border-zinc-600"
            )}
            aria-label="Add to favorites"
          >
            {isFavorite ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Center controls */}
        <div className="hidden w-full max-w-xl flex-col items-center gap-2 justify-self-center md:flex">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setIsShuffle((v) => !v)}
              className={cn(
                "text-zinc-400 hover:text-white",
                isShuffle && "text-[#1ed760] hover:text-[#1ed760]"
              )}
              aria-label="Shuffle"
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={playPrev}
              className="text-zinc-300 hover:text-white"
              aria-label="Previous"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 hover:bg-white/90"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" fill="currentColor" />
              ) : (
                <Play className="h-4 w-4" fill="currentColor" />
              )}
            </button>
            <button
              type="button"
              onClick={playNext}
              className="text-zinc-300 hover:text-white"
              aria-label="Next"
            >
              <SkipForward className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={cycleRepeat}
              className={cn(
                "text-zinc-400 hover:text-white",
                repeatMode !== "off" && "text-[#1ed760] hover:text-[#1ed760]"
              )}
              aria-label="Repeat"
            >
              <RepeatIcon className="h-4 w-4" />
            </button>
          </div>

          {/* progress bar */}
          <div className="flex w-full max-w-xl items-center gap-2">
            <span className="w-10 text-right text-[11px] text-zinc-400">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-700 accent-[#1ed760]"
              style={{
                background: `linear-gradient(to right, #1ed760 ${progressPct}%, #3f3f46 ${progressPct}%)`,
              }}
              aria-label="Seek"
            />
            <span className="w-10 text-[11px] text-zinc-400">{formatTime(duration)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black justify-self-center md:hidden"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" fill="currentColor" />
          ) : (
            <Play className="h-4 w-4" fill="currentColor" />
          )}
        </button>

        <button
          type="button"
          onClick={playNext}
          className="justify-self-end text-zinc-300 hover:text-white md:hidden"
          aria-label="Next"
        >
          <SkipForward className="h-5 w-5" />
        </button>

        {/* Right: volume + extras */}
        <div className="hidden items-center justify-end gap-3 justify-self-end lg:flex">
          <button
            type="button"
            onClick={() => setIsMuted((v) => !v)}
            className="text-zinc-300 hover:text-white"
            aria-label="Mute"
          >
            <VolumeIcon className="h-4 w-4" />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-zinc-700 accent-[#1ed760]"
            style={{
              background: `linear-gradient(to right, #1ed760 ${
                (isMuted ? 0 : volume) * 100
              }%, #3f3f46 ${(isMuted ? 0 : volume) * 100}%)`,
            }}
            aria-label="Volume"
          />
          <button type="button" className="text-zinc-400 hover:text-white" aria-label="Queue">
            <ListMusic className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="text-zinc-400 hover:text-white"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
