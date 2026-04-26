"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateVisaTotal } from "@/lib/utils";
import { useApplication } from "@/components/application/ApplicationContext";
import { ChevronDown, ChevronUp, Clock, CheckCircle, ArrowRight, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VisaCard({ visa, dict }: { visa: any, dict?: any }) {
  const { quickApply, openPanel } = useApplication();
  const [showPrices, setShowPrices] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const commonT = dict?.common || {};

  const totalPrice = calculateVisaTotal(visa.price, visa.fee);
  const hasMultiplePrices = typeof totalPrice === 'object' && totalPrice !== null;

  return (
    <div
      className="
        relative rounded-[2.5rem]
        bg-white dark:bg-slate-900/60
        dark:backdrop-blur-xl
        border border-gray-200 dark:border-white/10
        p-7 md:p-8
        shadow-sm hover:shadow-2xl
        transition-all duration-500
        text-left group flex flex-col h-full
        hover:border-primary/30
      "
    >
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-3 py-1 rounded-full tracking-[0.2em] border border-primary/10">
          ID: {visa.id}
        </span>
        {visa.category.includes("Visitor") && (
            <Tag size={14} className="text-primary/40" />
        )}
      </div>

      {/* TITLE & DESC */}
      <div className="flex-1">
        <h3 className="text-2xl font-black mode-aware-text group-hover:text-primary transition-colors tracking-tight leading-tight">
          {visa.name}
        </h3>

        <p className="mt-3 text-sm mode-aware-subtext line-clamp-2 leading-relaxed font-medium opacity-80">
          {visa.description}
        </p>

        {/* COMPACT META */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Clock size={14} className="text-primary/60" />
            <span className="mode-aware-text font-bold">{visa.validity}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle size={14} className="text-emerald-500/60" />
            <span className="mode-aware-text font-bold">{visa.extendable ? (commonT.extendable || "Extendable") : (commonT.no_extension || "No Extension")}</span>
          </div>
        </div>
      </div>

      {/* PRICE SECTION - COMPACT & EXPANDABLE */}
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-1">
             <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{commonT.pricing || "Pricing"}</p>
             {typeof totalPrice === 'string' ? (
                <div className="text-2xl font-black mode-aware-text">{totalPrice}</div>
             ) : (
                <div className="text-2xl font-black mode-aware-text">
                    {Object.values(totalPrice)[0]}
                    <span className="text-[10px] ml-1 opacity-40 font-bold tracking-normal italic uppercase">/ {Object.keys(totalPrice)[0]}</span>
                </div>
             )}
          </div>
          
          {hasMultiplePrices && (
             <button 
                onClick={() => setShowPrices(!showPrices)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-black mode-aware-text hover:bg-primary/10 hover:text-primary transition-all"
             >
                {showPrices ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showPrices ? "Hide" : "Prices"}
             </button>
          )}
        </div>

        {/* EXPANDABLE PRICES */}
        <AnimatePresence>
            {showPrices && hasMultiplePrices && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6"
                >
                    <div className="space-y-2 pt-2">
                        {Object.entries(totalPrice).map(([label, price]: [string, any]) => (
                            <button 
                                key={label} 
                                type="button"
                                onClick={() => {
                                    setSelectedTier(label);
                                    setIsShaking(false);
                                }}
                                className={`w-full flex justify-between items-center p-3 rounded-2xl border transition-all ${selectedTier === label ? 'bg-primary/10 border-primary shadow-sm' : 'bg-slate-50 dark:bg-white/5 border-transparent hover:border-primary/20'}`}
                            >
                                <span className={`text-[10px] font-black uppercase tracking-tight ${selectedTier === label ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
                                <span className="font-black text-sm mode-aware-text">{price}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* CTA ACTION */}
        <div className="flex flex-col gap-3">
            <motion.div
                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                onAnimationComplete={() => setIsShaking(false)}
            >
                <button
                    onClick={() => {
                        if (hasMultiplePrices && !selectedTier) {
                            setIsShaking(true);
                            setShowPrices(true);
                        } else {
                            openPanel({
                                visaId: visa.id,
                                priceTier: selectedTier || (typeof totalPrice === 'string' ? 'Standard' : Object.keys(totalPrice)[0]),
                                isLocked: true
                            });
                        }
                    }}
                    className="
                        w-full flex items-center justify-center gap-2
                        rounded-2xl
                        bg-[#9155FD] hover:bg-[#804bdf]
                        text-white font-black text-base
                        py-4 text-center
                        shadow-xl shadow-[#9155FD]/20
                        transition-all duration-300
                        hover:-translate-y-1 active:scale-95
                    "
                >
                    {commonT.apply_now || "Apply Now"} <ArrowRight size={18} />
                </button>
            </motion.div>
            <div className="text-center">
                <Link href={`/services/${visa.id}`} className="text-xs font-bold text-gray-400 hover:text-primary transition-colors underline decoration-dotted underline-offset-4">
                {commonT.see_details || "See details"}
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
