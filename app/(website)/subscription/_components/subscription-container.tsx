import BillingHistory from "./billing-history";
import CurrentSubscription from "./current-subscription";
import PlanCard, { SubscriptionPlan } from "./plan-card";

const plans: SubscriptionPlan[] = [
  {
    name: "Free",
    price: "$0.00",
    period: "/month",
    features: [
      "Ad-supported listening",
      "Suffle play only",
      "Standard audio quality",
      "Mobile only",
    ],
    buttonLabel: "Current Plan",
    tone: "free",
    isCurrent: true,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/month",
    features: [
      "Ad-free music",
      "Play any song",
      "Download 10,000 songs",
      "High quality audio",
      "Offline mode",
      "All devices",
    ],
    buttonLabel: "Current Plan",
    tone: "premium",
    isCurrent: true,
    isHighlighted: true,
  },
  {
    name: "Family",
    price: "$15.99",
    period: "/month",
    features: [
      "6 accounts",
      "All premium features",
      "parental controls",
      "Family mix playlists",
      "Add-free",
    ],
    buttonLabel: "Upgrade to Family",
    tone: "family",
  },
];

const SubscriptionContainer = () => {
  return (
    <section className="min-h-full rounded-[8px] bg-[#171717] p-4 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03)] sm:p-5 lg:p-6">
      <h1 className="text-[28px] font-semibold leading-none text-white sm:text-[32px]">
        Subscription
      </h1>

      <div className="pt-8">
        <CurrentSubscription />
      </div>

      <div className="pt-14">
        <h2 className="text-[21px] font-semibold leading-none text-white sm:text-2xl">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 gap-5 pt-7 md:grid-cols-3 xl:gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>

      <div className="pt-14">
        <BillingHistory />
      </div>
    </section>
  );
};

export default SubscriptionContainer;
