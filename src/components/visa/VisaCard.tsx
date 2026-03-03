"use client";

import Link from "next/link";
import { calculateVisaTotal } from "@/lib/utils";
import { useApplication } from "@/components/application/ApplicationContext";

export default function VisaCard({ visa, dict }: { visa: any, dict?: any }) {
  const { selectVisa } = useApplication();
  const commonT = dict?.common || {};

  return (
    <div
      className="
        relative rounded-[2rem]
        bg-white dark:bg-slate-800/50
        dark:backdrop-blur-md
        border border-gray-200 dark:border-white/10
        p-8
        shadow-sm hover:shadow-2xl
        transition-all duration-500
        text-left group
      "
    >
      {/* TAG */}
      <span className="text-xs font-black uppercase text-gray-400 tracking-[0.2em]">
        ID: {visa.id}
      </span>

      {/* TITLE */}
      <h3 className="mt-4 text-2xl font-black mode-aware-text group-hover:text-primary transition-colors tracking-tight">
        {visa.name}
      </h3>

      {/* DESC */}
      <p className="mt-3 text-base mode-aware-subtext line-clamp-3 leading-relaxed font-medium">
        {visa.description}
      </p>

      {/* META */}
      <div className="mt-6 text-sm flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span className="mode-aware-subtext">{commonT.validity || "Validity"}:</span>
          <span className="mode-aware-text font-bold">{visa.validity}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span className="mode-aware-subtext">{commonT.extendable || "Extendable"}:</span>
          <span className="mode-aware-text font-bold">{visa.extendable ? (commonT.yes || "Yes") : (commonT.no || "No")}</span>
        </div>
      </div>

      {/* PRICE */}
      <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">{commonT.starting_from || "Starting from"}</p>
        <div className="mode-aware-text">
          {(() => {
            const totalPrice = calculateVisaTotal(visa.price, visa.fee);

            if (typeof totalPrice === 'string') {
              return <div className="text-3xl font-black">{totalPrice}</div>;
            } else {
              return (
                <div className="flex flex-col gap-2">
                  {Object.entries(totalPrice).map(([label, price]: [string, any]) => (
                    <div key={label} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                      <span className="opacity-70 font-bold uppercase tracking-tighter">{label}</span>
                      <span className="font-black text-lg">{price}</span>
                    </div>
                  ))}
                </div>
              );
            }
          })()}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => selectVisa(visa.id)}
        className="
          mt-8 w-full
          rounded-2xl
          bg-[#9155FD] hover:bg-[#804bdf]
          text-white font-black text-lg
          py-4 text-center
          shadow-xl shadow-[#9155FD]/20
          transition-all duration-300
          hover:-translate-y-1 active:scale-95
        "
      >
        {commonT.apply_now || "Apply Now"}
      </button>

      <div className="mt-4 text-center">
        <Link href={`/services/${visa.id}`} className="text-sm font-bold text-[#9155FD] hover:text-[#804bdf] transition-colors underline decoration-dotted underline-offset-4">
          {commonT.see_details || "See details"}
        </Link>
      </div>
    </div>
  );
}
