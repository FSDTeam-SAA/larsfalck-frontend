import { Download } from "lucide-react";

const billingHistory = [
  {
    plan: "Premium Plan",
    date: "Jun 1, 2026",
    price: "$9.99",
    status: "Paid",
  },
  {
    plan: "Premium Plan",
    date: "May 1, 2026",
    price: "$9.99",
    status: "Paid",
  },
  {
    plan: "Premium Plan",
    date: "Apr 1, 2026",
    price: "$9.99",
    status: "Paid",
  },
  {
    plan: "Premium Plan",
    date: "Mar 1, 2026",
    price: "$9.99",
    status: "Paid",
  },
];

const BillingHistory = () => {
  return (
    <section>
      <h2 className="text-[21px] font-semibold leading-none text-white sm:text-2xl">
        Billing History
      </h2>

      <div className="mt-7 overflow-hidden rounded-[8px] border border-[#2B2B2B] bg-[#171717]">
        {billingHistory.map((item) => (
          <div
            key={item.date}
            className="grid grid-cols-1 gap-3 border-b border-[#2B2B2B] px-4 py-4 transition-colors last:border-b-0 hover:bg-[#1E1E1E] sm:min-h-[58px] sm:grid-cols-[1.45fr_1fr_1fr_auto] sm:items-center"
          >
            <div>
              <p className="text-[11px] font-medium leading-[120%] text-white sm:text-xs">
                {item.plan}
              </p>
              <p className="pt-1 text-[10px] font-normal leading-[120%] text-[#8A8A8A] sm:text-[11px]">
                {item.date}
              </p>
            </div>

            <p className="text-xs font-medium leading-[120%] text-white">
              {item.price}
            </p>

            <span className="w-fit rounded-full border border-primary bg-[#073D0A] px-3 py-1 text-[10px] font-medium leading-none text-primary shadow-[0_0_10px_rgba(0,239,1,0.12)]">
              {item.status}
            </span>

            <button
              type="button"
              className="flex w-fit items-center gap-1 text-[10px] font-normal leading-none text-[#8A8A8A] transition-colors hover:text-white sm:text-xs"
            >
              <Download className="size-3" />
              Invoice
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BillingHistory;
