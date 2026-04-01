"use client";

import React from "react";
import { ShieldCheck, Briefcase, Landmark, Navigation } from "lucide-react";

export default function GCIBenefits({ dict }: { dict: any }) {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-500/50 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-black mode-aware-text mb-4">{dict?.gci?.benefits?.stay?.title}</h3>
            <p className="mode-aware-subtext text-sm leading-relaxed">{dict?.gci?.benefits?.stay?.desc}</p>
          </div>
          
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-500/50 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <Briefcase size={28} />
            </div>
            <h3 className="text-xl font-black mode-aware-text mb-4">{dict?.gci?.benefits?.work?.title}</h3>
            <p className="mode-aware-subtext text-sm leading-relaxed">{dict?.gci?.benefits?.work?.desc}</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-500/50 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <Landmark size={28} />
            </div>
            <h3 className="text-xl font-black mode-aware-text mb-4">{dict?.gci?.benefits?.property?.title}</h3>
            <p className="mode-aware-subtext text-sm leading-relaxed">{dict?.gci?.benefits?.property?.desc}</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-500/50 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <Navigation size={28} />
            </div>
            <h3 className="text-xl font-black mode-aware-text mb-4">{dict?.gci?.benefits?.entry?.title}</h3>
            <p className="mode-aware-subtext text-sm leading-relaxed">{dict?.gci?.benefits?.entry?.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
