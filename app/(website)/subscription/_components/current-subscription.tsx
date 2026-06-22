import { Crown } from "lucide-react";

const CurrentSubscription = () => {
  return (
    <div className="flex flex-col gap-4 rounded-[8px] border border-[#004D19] bg-[#102516] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#073F18] text-primary">
          <Crown className="size-5" />
        </div>
        <div>
          <h2 className="text-[13px] font-semibold leading-[120%] text-white sm:text-sm">
            You&apos;re on Beatbox Premium
          </h2>
          <p className="pt-1 text-[11px] font-normal leading-[120%] text-[#BDBDBD] sm:text-xs">
            Next billing on July 1, 2026-$9.99
          </p>
        </div>
      </div>

      <span className="w-fit rounded-full border border-[#8A8A8A] px-4 py-1.5 text-[10px] font-medium leading-none text-[#D8D8D8]">
        On Going
      </span>
    </div>
  );
};

export default CurrentSubscription;
