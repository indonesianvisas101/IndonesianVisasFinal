"use client";

import React, { useState } from "react";

export default function GCIEligibility({ dict }: { dict: any }) {
  const t = dict?.gci?.eligibility || {};
  const [active, setActive] = useState('4C');
  const details = {
    '4C': { title: t['4C']?.title, desc: t['4C']?.desc },
    '4D': { title: t['4D']?.title, desc: t['4D']?.desc },
    '4H': { title: t['4H']?.title, desc: t['4H']?.desc }
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black mode-aware-text">{t.title}</h2>
          <p className="mode-aware-subtext">{t.subtitle}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto mb-12">
          {Object.keys(details).map(key => (
            <button 
              key={key}
              onClick={() => setActive(key)}
              className={`flex-1 p-8 rounded-3xl transition-all duration-500 text-left border-2 ${active === key ? 'bg-blue-600 border-blue-600 shadow-2xl scale-105' : 'bg-transparent border-slate-200 dark:border-white/10'}`}
            >
              <div className={`text-3xl font-black mb-4 ${active === key ? 'text-white' : 'mode-aware-text'}`}>{key}</div>
              <h3 className={`font-bold mb-2 ${active === key ? 'text-white' : 'mode-aware-text'}`}>{details[key as keyof typeof details].title}</h3>
              <p className={`text-sm ${active === key ? 'text-slate-100' : 'mode-aware-subtext'}`}>{details[key as keyof typeof details].desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
