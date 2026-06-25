"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronDown,
  Home,
  LogOut,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import LogoutModal from "@/components/modals/LogoutModal";
import { usePlayer } from "@/components/providers/PlayerProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  buildSearchHref,
  getTags,
  type SearchTag,
  type SearchType,
} from "@/lib/search";
import { cn } from "@/lib/utils";

type UserProfile = {
  name?: string;
  email?: string;
  profileImage?: string | null;
};

type UserProfileResponse = {
  success: boolean;
  message: string;
  data: UserProfile;
};

async function getUserProfile(token: string): Promise<UserProfileResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const result = (await response.json()) as UserProfileResponse;

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || "Could not load user profile");
  }

  return result;
}

const searchTabs: Array<{ label: string; value: SearchType }> = [
  { label: "All", value: "all" },
  { label: "Songs", value: "songs" },
  { label: "Artists", value: "artists" },
  { label: "Playlists", value: "playlists" },
  { label: "Albums", value: "albums" },
];

type SearchOptionsPanelProps = {
  activeType: SearchType;
  selectedTags: string[];
  tags: SearchTag[];
  isTagsLoading: boolean;
  onTypeChange: (type: SearchType) => void;
  onTagToggle: (tag: string) => void;
  onSearch: () => void;
};

function SearchOptionsPanel({
  activeType,
  selectedTags,
  tags,
  isTagsLoading,
  onTypeChange,
  onTagToggle,
  onSearch,
}: SearchOptionsPanelProps) {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[70] rounded-xl border border-white/10 bg-[#181818] p-2 shadow-2xl">
      <div className="flex flex-wrap items-center gap-1.5">
        {searchTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTypeChange(tab.value)}
            className={cn(
              "h-7 rounded-full border border-white/15 px-3 text-xs text-[#CFCFCF] transition hover:border-white/30 hover:text-white",
              activeType === tab.value &&
                "border-[#00EF01] bg-[#00EF01] text-black hover:border-[#00EF01] hover:text-black",
            )}
          >
            {tab.label}
          </button>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-full border border-white/15 px-3 text-xs text-[#CFCFCF] transition hover:border-white/30 hover:text-white",
                selectedTags.length > 0 &&
                  "border-[#00EF01] bg-[#00EF01] text-black hover:border-[#00EF01] hover:text-black",
              )}
            >
              Tags{selectedTags.length > 0 ? ` (${selectedTags.length})` : ""}
              <ChevronDown className="size-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="max-h-64 w-56 overflow-y-auto"
          >
            {isTagsLoading ? (
              <DropdownMenuItem disabled>Loading tags...</DropdownMenuItem>
            ) : tags.length > 0 ? (
              tags.map((tag) => {
                const selected = selectedTags.includes(tag.name);

                return (
                  <DropdownMenuItem
                    key={tag._id}
                    onSelect={(event) => {
                      event.preventDefault();
                      onTagToggle(tag.name);
                    }}
                  >
                    <span className="flex size-4 items-center justify-center">
                      {selected && <Check className="size-3" />}
                    </span>
                    {tag.name}
                  </DropdownMenuItem>
                );
              })
            ) : (
              <DropdownMenuItem disabled>No tags found</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={onSearch}
            className="h-7 rounded-full bg-white px-3 text-xs font-medium text-black transition hover:bg-white/90"
          >
            Search tags
          </button>
        )}
      </div>
    </div>
  );
}

export function Navbar() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = React.useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchType, setSearchType] = React.useState<SearchType>("all");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const mobileSearchInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { resetPlayer } = usePlayer();
  const { data: session, status } = useSession();
  const token = session?.user.accessToken;
  const isAuthenticated = status === "authenticated" && Boolean(token);

  const { data: profileResponse } = useQuery({
    queryKey: ["user-me"],
    queryFn: () => getUserProfile(token as string),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
  const { data: tags = [], isPending: isTagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
    enabled: pathname !== "/search" && (isDesktopSearchOpen || isMobileSearchOpen),
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  React.useEffect(() => {
    if (isMobileSearchOpen) mobileSearchInputRef.current?.focus();
  }, [isMobileSearchOpen]);

  function runSearch() {
    if (!searchQuery.trim() && selectedTags.length === 0) return;

    router.push(
      buildSearchHref({
        query: searchQuery,
        type: searchType,
        tags: selectedTags,
      }),
    );
    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch();
  }

  function handleTagToggle(tag: string) {
    setSearchType("all");
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  }

  function handleTypeChange(type: SearchType) {
    setSearchType(type);
    setSelectedTags([]);
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await signOut({ redirect: false });
      resetPlayer();
      queryClient.clear();
      setIsLogoutOpen(false);
      router.replace("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  const profile = profileResponse?.data;
  const avatarImage = profile?.profileImage || "/no-user.jpg";
  const displayName = profile?.name || session?.user.name || "User";
  const avatarFallback = displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <>
      <header className="sticky top-0 z-50 mx-auto mt-3 flex h-16 w-full items-center justify-between gap-3 rounded-xl border-b border-white/5 bg-[#FFFFFF1A] pl-16 pr-3 sm:h-[82px] sm:px-8 lg:h-[94px] lg:px-12">
        <Link
          href="/"
          aria-label="Go to homepage"
          className={cn("shrink-0", isMobileSearchOpen && "hidden md:block")}
        >
          <div className="hidden h-14 w-[157px] lg:block">
            <Image
              src="/logo.png"
              alt="Logo"
              width={157}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="size-8 lg:hidden">
            <Image
              src="/fav.png"
              alt="Logo"
              width={48}
              height={48}
              className="size-full object-contain"
            />
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-3 md:flex">
          <Button
            size="icon"
            asChild
            className="size-11 shrink-0 rounded-full bg-white text-black hover:bg-white/90"
          >
            <Link href="/" aria-label="Home">
              <Home className="size-5" />
            </Link>
          </Button>

          <form
            role="search"
            onSubmit={handleSearchSubmit}
            onFocusCapture={() => {
              if (pathname !== "/search") setIsDesktopSearchOpen(true);
            }}
            className="relative w-full max-w-md"
          >
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              aria-label="Search songs, artists, and albums"
              placeholder="Search songs, artists, albums ..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 rounded-full border-none bg-[#333333] pl-9 pr-9 text-base text-[#A8A8A8] placeholder:text-[#A8A8A8] focus-visible:ring-1 focus-visible:ring-white dark:bg-[#333333]"
            />
            {pathname !== "/search" && (
              <button
                type="button"
                aria-label="Search filters"
                onClick={() => setIsDesktopSearchOpen((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-white"
              >
                <SlidersHorizontal className="size-4" />
              </button>
            )}
            {pathname !== "/search" && isDesktopSearchOpen && (
              <SearchOptionsPanel
                activeType={searchType}
                selectedTags={selectedTags}
                tags={tags}
                isTagsLoading={isTagsLoading}
                onTypeChange={handleTypeChange}
                onTagToggle={handleTagToggle}
                onSearch={runSearch}
              />
            )}
          </form>
        </div>

        {isMobileSearchOpen && (
          <form
            role="search"
            onSubmit={handleSearchSubmit}
            className="flex min-w-0 flex-1 items-center gap-2 md:hidden"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                ref={mobileSearchInputRef}
                type="search"
                aria-label="Search songs, artists, and albums"
                placeholder="Search music..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setIsMobileSearchOpen(false);
                }}
                className="h-10 w-full rounded-full border border-white/10 bg-[#292929] pl-9 pr-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-[#00EF01] focus:ring-2 focus:ring-[#00EF01]/25"
              />
              {pathname !== "/search" && (
                <SearchOptionsPanel
                  activeType={searchType}
                  selectedTags={selectedTags}
                  tags={tags}
                  isTagsLoading={isTagsLoading}
                  onTypeChange={handleTypeChange}
                  onTagToggle={handleTagToggle}
                  onSearch={runSearch}
                />
              )}
            </div>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Close search"
              onClick={() => setIsMobileSearchOpen(false)}
              className="size-10 rounded-full bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <X className="size-5" />
            </Button>
          </form>
        )}

        <div
          className={cn(
            "flex shrink-0 items-center gap-2 sm:gap-3",
            // isMobileSearchOpen && "hidden md:flex",
          )}
        >
          {status === "loading" ? (
            <div
              className="size-9 animate-pulse rounded-full bg-white/10"
              aria-label="Loading account"
            />
          ) : isAuthenticated ? (
            <>
              <Link href="/subscription">
              <Button className=" h-8 rounded-full bg-[#00EF01] px-4 text-sm font-medium text-black hover:bg-[#1ed760]/90 sm:flex sm:h-9 sm:px-5 sm:text-base">
                Explore Premium
              </Button>
              </Link>

              {/* <Button
                size="icon"
                variant="ghost"
                aria-label="Notifications"
                className="size-10 rounded-full bg-[#333333] text-white hover:bg-white/10 hover:text-white sm:size-9"
              >
                <Bell className="size-6" />
              </Button> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#00EF01] focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818]"
                    aria-label="Open account menu"
                  >
                    <Avatar className="size-10 cursor-pointer sm:size-9">
                      <AvatarImage src={avatarImage} alt={displayName} />
                      <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem asChild>
                    <Link href="/profiles">
                      <User />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => setIsLogoutOpen(true)}
                    className="text-red-400 focus:bg-red-500/10 focus:text-red-300"
                  >
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              asChild
              className="h-9 rounded-full bg-[#00EF01] px-5 text-sm font-semibold text-black hover:bg-[#1ed760] sm:text-base"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          )}

          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Open search"
            aria-expanded={isMobileSearchOpen}
            onClick={() => setIsMobileSearchOpen(true)}
            className="size-9 rounded-full bg-[#333333] text-zinc-200 hover:bg-[#00EF01] hover:text-black md:hidden"
          >
            <Search className="size-5" />
          </Button>
        </div>
      </header>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
}
