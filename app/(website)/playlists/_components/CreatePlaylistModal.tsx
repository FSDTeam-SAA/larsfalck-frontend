"use client";

import { type FormEvent, useState } from "react";
import { CirclePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreatePlaylistModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) setPlaylistName("");
  }

  function closeModal() {
    handleOpenChange(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = playlistName.trim();

    if (!name) return;

    // The playlist API can be connected here when it is available.
    closeModal();
    router.push(`/playlists/3?name=${encodeURIComponent(name)}`);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 gap-2 rounded-full px-3 text-sm text-black sm:h-12 sm:px-4 sm:text-base">
          <CirclePlus className="size-4 sm:size-5" />
          <span className="whitespace-nowrap">Create Playlist</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/80 backdrop-blur-[2px]"
        className="w-[calc(100%-1.5rem)] !max-w-[640px] gap-0 rounded-xl border border-white/5 bg-[#1D1D1D] p-4 text-white shadow-2xl ring-0 sm:p-6"
      >
        <DialogClose asChild>
          <Button
            type="button"
            size="icon"
            aria-label="Close create playlist dialog"
            className="absolute right-0 top-0 size-10 rounded-bl-xl rounded-br-none rounded-tl-none rounded-tr-xl bg-[#00EF01] text-black hover:bg-[#00D801]"
          >
            <X className="size-6" />
          </Button>
        </DialogClose>

        <DialogHeader className="pr-10 text-left">
          <DialogTitle className="text-xl font-semibold leading-tight text-white sm:text-3xl">
            Create Playlist
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter a name to create a new playlist.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="space-y-2">
            <Label
              htmlFor="playlist-name"
              className="text-xs font-medium text-white sm:text-xl"
            >
              Playlist Name
            </Label>
            <Input
              id="playlist-name"
              value={playlistName}
              onChange={(event) => setPlaylistName(event.target.value)}
              placeholder="Enter playlist name"
              autoComplete="off"
              autoFocus
              required
              className="h-11 rounded-md border-transparent bg-[#292929] px-3 text-sm text-white placeholder:text-[#A8A8A8] focus-visible:border-[#00EF01] focus-visible:ring-[#00EF01]/30 dark:bg-[#292929] sm:h-12"
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
            <Button
              type="button"
              onClick={closeModal}
              className="h-10 rounded-full bg-[#505050] px-3 text-xs font-medium text-white hover:bg-[#606060] sm:h-11 sm:text-sm"
            >
              Discard
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-full bg-[#00EF01] px-3 text-xs font-medium text-black hover:bg-[#00D801] sm:h-11 sm:text-sm"
            >
              Add Song
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
