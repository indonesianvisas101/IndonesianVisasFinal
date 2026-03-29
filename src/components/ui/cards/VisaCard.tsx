"use client";

import React from "react";
import { calculateVisaTotal } from "@/lib/utils";
import { useApplication } from "@/components/application/ApplicationContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatNavLink } from "@/utils/seo";

interface VisaCardProps {
  visa: {
    id: string;
    name: string;
    category: string;
    validity: string;
    price: string;
    description: string;
    extendable: boolean;
    fee?: number | Record<string, number> | any;
  };
}

const VisaCard: React.FC<VisaCardProps> = ({ visa }) => {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const { selectVisa } = useApplication();
  const totalPrice = calculateVisaTotal(visa.price, (visa as any).fee);

  return (
    <div
      className="
        group relative h-full
        rounded-3xl
        !bg-white dark:!bg-white/5
        backdrop-blur-xl
        border border-black/5 dark:border-white/10
        shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)]
        hover:shadow-[0_25px_60px_-15px_rgba(75,0,130,0.35)]
        transition-all duration-300
        flex flex-col
      "
    >
      {/* Category/ID */}
      <div className="px-6 pt-6">
        <span className="inline-block text-xs font-bold tracking-wide uppercase text-primary dark:text-accent">
          ID: {visa.id}
        </span>
      </div>

      {/* Content */}
      <div className="px-6 py-4 flex-grow">
        <h3 className="text-xl font-bold mode-aware-text dark:text-white mb-2">
          {visa.name}
        </h3>

        <p className="text-sm mode-aware-subtext dark:text-slate-300 leading-relaxed mb-4">
          {visa.description}
        </p>

        <div className="flex flex-wrap gap-4 text-sm mode-aware-subtext dark:text-slate-400">
          <span>
            <strong>Validity:</strong> {visa.validity}
          </span>
          <span>
            <strong>Extendable:</strong>{" "}
            {visa.extendable ? "Yes" : "No"}
          </span>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="px-6 pb-6 pt-4 border-t border-black/5 dark:border-white/10">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm mode-aware-subtext dark:text-slate-400">
              Starting from
            </p>
            <p className="text-xl font-extrabold mode-aware-text dark:text-white">
              {typeof totalPrice === 'string' ? totalPrice : <span className="text-lg">View Details</span>}
            </p>
          </div>

          <button
            onClick={() => selectVisa(visa.id)}
            className="
              w-full 
              px-6 py-3
              rounded-full
              font-semibold
              bg-accent text-primary
              hover:bg-[#ffdb0f]
              transition-all
              shadow-md hover:shadow-lg
              whitespace-nowrap
            "
          >
            Apply Now
          </button>

          <Link
            href={formatNavLink(locale, `/services/${visa.id}`)}
            className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Click here to see details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VisaCard;
