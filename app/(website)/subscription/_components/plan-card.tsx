"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  CheckoutApiResponse,
  PlanTone,
  SubscriptionPlanCardData,
} from "./plan-data-type";

const toneStyles: Record<
  PlanTone,
  {
    card: string;
    title: string;
    icon: string;
    button: string;
  }
> = {
  free: {
    card: "border-[#595959] bg-[#171717]",
    title: "text-white",
    icon: "text-[#7D7D7D]",
    button: "bg-[#7D7D7D] text-[#333333] hover:bg-[#9A9A9A]",
  },
  premium: {
    card: "border-[#006400] bg-[#00EF010D]",
    title: "text-primary",
    icon: "text-primary",
    button: "bg-primary text-[#333333] hover:bg-primary/90",
  },
  family: {
    card: "border-[#B27BFF4D] bg-[#B27BFF1A]",
    title: "text-[#B27BFF]",
    icon: "text-[#B27BFF]",
    button: "bg-[#B27BFF] text-white hover:bg-[#B57DFF]",
  },
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

const PlanCard = ({ plan }: { plan: SubscriptionPlanCardData }) => {
  const styles = toneStyles[plan.tone];
  const { data: session, status } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!plan?.id) return;

    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ planId: plan?.id }),
        },
      );
      const result = (await response.json()) as CheckoutApiResponse;

      if (!response.ok || !result.success || !result.data?.checkoutUrl) {
        throw new Error(result.message || "Checkout failed");
      }

      window.location.href = result?.data?.checkoutUrl;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article
      className={`flex min-h-[424px] flex-col rounded-[16px] border p-5 md:p-6  transition-transform duration-200 hover:-translate-y-0.5 ${styles.card}`}
    >
      <div>
        <h3
          className={`text-2xl md:text-3xl lg:text-4xl font-semibold leading-[120%] ${styles.title}`}
        >
          {plan?.name || "N/A"}
        </h3>
        <div className="flex items-end gap-1 pt-3">
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold leading-[120%] text-white">
            {formatPrice(plan?.price || 0)}
          </p>
          <span className="text-base md:text-lg font-semibold leading-[120%] text-[#E8E8F0]">
            /{plan.billingCycle}
          </span>
        </div>
      </div>

      <ul className="space-y-4 pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <CircleCheck className={`size-4 shrink-0 ${styles.icon}`} />
            <span className="text-sm md:text-base font-normal leading-[120%] text-white">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading || status === "loading"}
        className={`mt-auto h-12 w-full rounded-full text-sm md:text-base font-medium leading-[120%] shadow-none ${styles.button}`}
      >
        {isLoading ? "Processing..." : plan?.buttonLabel}
      </Button>
    </article>
  );
};

export default PlanCard;
