"use client";

import { useQuery } from "@tanstack/react-query";
import { Crown } from "lucide-react";
import { useSession } from "next-auth/react";
import type { BillingHistoryApiResponse } from "./billing-history-data-type";

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "N/A";

const formatPrice = (price?: number) =>
  typeof price === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
    : "N/A";

async function getCurrentSubscription(
  token: string,
): Promise<BillingHistoryApiResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription/me`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const result = (await response.json()) as BillingHistoryApiResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load subscription");
  }

  return result;
}

const CurrentSubscription = () => {
  const { data: session, status } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;
  const { data, isLoading, isError } = useQuery<BillingHistoryApiResponse>({
    queryKey: ["subscription-billing-history"],
    queryFn: () => getCurrentSubscription(token as string),
    enabled: status === "authenticated" && !!token,
    staleTime: 1000 * 60 * 5,
  });
  const subscription = data?.data?.subscription;
  const title = isLoading
    ? "Loading subscription..."
    : isError
      ? "Unable to load subscription"
      : subscription
        ? `You're on Beatbox ${subscription?.planId?.name}`
        : "No active subscription";
  const billingDetails = subscription
    ? `Last billing on ${formatDate(subscription?.startDate)} - ${formatPrice(subscription?.planId?.price)}`
    : "Choose a plan to get started";
  const subscriptionStatus = isLoading
    ? "Loading"
    : subscription?.status === "active"
      ? "On Going"
      : subscription?.status || "Inactive";

  return (
    <div className="flex justify-between items-center gap-2 md:gap-4 rounded-[12px] border border-[#006400] bg-[#1ED7600D] px-2 md:px-3 lg:px-4 py-3 md:py-4 lg:py-5">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex size-9 md:size-10 shrink-0 items-center justify-center rounded-full bg-[#073F18] text-primary">
          <Crown className="size-4 md:size-5" />
        </div>
        <div>
          <h2 className="text-xs md:text-base lg:text-lg font-bold leading-[120%] text-white">
            {title}
          </h2>
          <p className="pt-1 md:pt-2 text-xs md:text-sm font-medium leading-[120%] text-[#8C8C8C]">
            {billingDetails}
          </p>
        </div>
      </div>

      <span className="w-fit rounded-full border border-[#B0B0B0] px-2 md:px-3 lg:px-4 py-1.5 text-[8px] md:text-sm font-normal leading-[120%] text-[#B0B0B0]">
        {subscriptionStatus}
      </span>
    </div>
  );
};

export default CurrentSubscription;
