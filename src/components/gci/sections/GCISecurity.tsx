"use client";

import React, { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";
import dynamic from "next/dynamic";

const IDivCardModern = dynamic(() => import("@/components/idiv/IDivCardModern"), { ssr: false });

export default function GCISecurity({ dict, renderRichText }: { dict: any, renderRichText: (text: string) => React.ReactNode }) {
  return (
    <section className="py-24 bg-slate-950 overflow-hidden relative">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 relative z-10">
          <h2 className="text-5xl font-black text-white leading-[1.1]">
            {renderRichText(dict?.gci?.security?.title)}
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            {dict?.gci?.security?.desc}
          </p>
          <div className="space-y-4">
            {[dict?.gci?.security?.feature1, dict?.gci?.security?.feature2, dict?.gci?.security?.feature3].map((f, i) => (
              <div key={i} className="flex items-center gap-4 text-white font-bold">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <CheckCircle2 size={16} />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative group cursor-pointer perspective-1000">
           <Suspense fallback={<div className="h-[400px] bg-slate-900 rounded-3xl animate-pulse" />}>
              <IDivCardModern />
           </Suspense>
        </div>
      </div>
    </section>
  );
}
