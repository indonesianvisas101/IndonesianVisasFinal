"use client";

import React from "react";
import { Globe, ChevronRight } from "lucide-react";

export default function GCIFinalCTA({ 
  gciCta, 
  email, 
  setEmail 
}: { 
  gciCta: any, 
  email: string, 
  setEmail: (val: string) => void 
}) {
  return (
    <section className="py-32 bg-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Globe className="w-full h-full scale-150 rotate-12" />
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
          {gciCta.title}
        </h2>
        <p className="text-xl text-blue-100 mb-12 font-bold">
          {gciCta.subtitle}
        </p>
        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
           <input 
             type="email" 
             placeholder={gciCta.placeholder}
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="flex-1 px-8 py-5 rounded-full bg-white text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-400"
           />
           <button className="px-10 py-5 rounded-full bg-slate-950 text-white font-black hover:scale-105 transition-transform flex items-center justify-center gap-2">
             {gciCta.button} <ChevronRight />
           </button>
        </div>
      </div>
    </section>
  );
}
