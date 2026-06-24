import { Crown } from "lucide-react";

const CurrentSubscription = () => {
  return (
    <div className="flex justify-between items-center gap-4 rounded-[12px] border border-[#006400] bg-[#1ED7600D] px-2 md:px-3 lg:px-4 py-3 md:py-4 lg:py-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 md:size-10 shrink-0 items-center justify-center rounded-full bg-[#073F18] text-primary">
          <Crown className="size-4 md:size-5" />
        </div>
        <div>
          <h2 className="text-sm md:text-base lg:text-lg font-bold leading-[120%] text-white">
            You&apos;re on Beatbox Premium
          </h2>
          <p className="pt-1 md:pt-2 text-xs md:text-sm font-medium leading-[120%] text-[#8C8C8C]">
            Next billing on July 1, 2026-$9.99
          </p>
        </div>
      </div>

      <span className="w-fit rounded-full border border-[#B0B0B0] px-4 py-1.5 text-xs md:text-sm font-normal leading-[120%] text-[#B0B0B0]">
        On Going
      </span>
    </div>
  );
};

export default CurrentSubscription;
