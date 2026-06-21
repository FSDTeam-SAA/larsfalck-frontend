import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";

export type PlanTone = "free" | "premium" | "family";

export type SubscriptionPlan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonLabel: string;
  tone: PlanTone;
  isCurrent?: boolean;
  isHighlighted?: boolean;
};

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
    card: "border-[#444444] bg-[#171717]",
    title: "text-white",
    icon: "text-[#BDBDBD]",
    button: "bg-[#8A8A8A] text-[#2A2A2A] hover:bg-[#9A9A9A]",
  },
  premium: {
    card: "border-[#00551B] bg-[#0F2413] shadow-[0_0_24px_rgba(0,239,1,0.05)]",
    title: "text-primary",
    icon: "text-primary",
    button: "bg-primary text-[#1A1A1A] hover:bg-primary/90",
  },
  family: {
    card: "border-[#3C304E] bg-[#281F35]",
    title: "text-[#A96CFF]",
    icon: "text-[#A96CFF]",
    button: "bg-[#A96CFF] text-white hover:bg-[#B57DFF]",
  },
};

const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => {
  const styles = toneStyles[plan.tone];

  return (
    <article
      className={`flex min-h-[424px] flex-col rounded-[10px] border p-5 transition-transform duration-200 hover:-translate-y-0.5 sm:p-6 ${styles.card}`}
    >
      <div>
        <h3
          className={`text-[31px] font-semibold leading-none ${styles.title}`}
        >
          {plan.name}
        </h3>
        <div className="flex items-end gap-1 pt-3">
          <p className="text-[25px] font-medium leading-none text-white">
            {plan.price}
          </p>
          <span className="pb-0.5 text-xs font-normal leading-none text-[#8A8A8A]">
            {plan.period}
          </span>
        </div>
      </div>

      <ul className="space-y-4 pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <CircleCheck className={`size-3.5 shrink-0 ${styles.icon}`} />
            <span className="text-[13px] font-normal leading-[120%] text-white">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        className={`mt-auto h-11 w-full rounded-full text-[10px] font-medium leading-none shadow-none ${styles.button}`}
      >
        {plan.buttonLabel}
      </Button>
    </article>
  );
};

export default PlanCard;
