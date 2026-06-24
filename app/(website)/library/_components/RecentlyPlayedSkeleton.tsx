import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ROW_COUNT = 4;

export default function RecentlyPlayedSkeleton() {
  return (
    <div
      className="w-full"
      aria-label="Loading recently played"
      aria-busy="true"
    >
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[40px_52px_minmax(220px,1fr)_minmax(180px,280px)_40px_60px_30px] items-center gap-4 px-3 py-3"
        >
          <Skeleton className="h-4 w-5 bg-white/10" />
          <Skeleton className="size-12 rounded-md bg-white/10" />
          <div className="min-w-0">
            <Skeleton className="h-6 w-3/4 bg-white/10" />
            <Skeleton className="mt-2 h-4 w-1/2 bg-white/10" />
          </div>
          <Skeleton className="h-5 w-3/4 bg-white/10" />
          <Skeleton className="size-5 bg-white/10" />
          <Skeleton className="h-4 w-10 bg-white/10" />
          <Skeleton className="size-5 bg-white/10" />
        </div>
      ))}
    </div>
  );
}
