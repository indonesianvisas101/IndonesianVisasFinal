"use client";

import React from "react";

export default function GCIComparisonTable({ dict }: { dict: any }) {
  const t = dict?.gci?.advantage || {};
  const table = t.table || {};
  const features = [
    { name: table.validity_label, gci: table.unlimited, golden: "5-10 Years", kitas: "1-2 Years" },
    { name: table.investment_label, gci: table.none, golden: "$350k - $5M+", kitas: "Company Setup / Bank Bond" },
    { name: "Blood-Bond Entry", gci: "YES (Unlimited)", golden: "NO", kitas: "NO" },
    { name: "Indonesia Property", gci: "FULL ACCESS", golden: "LIMITED", kitas: "LEASEHOLD" }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-4xl font-black mb-12 mode-aware-text text-center">{t.title}</h2>
        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100 dark:bg-white/5">
                <th className="p-6 font-black mode-aware-text">{table.feature}</th>
                <th className="p-6 font-black text-blue-500">{table.gci}</th>
                <th className="p-6 font-bold mode-aware-text">{table.golden}</th>
                <th className="p-6 font-bold mode-aware-text">{table.kitas}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {features.map((f, i) => (
                <tr key={i}>
                  <td className="p-6 font-bold mode-aware-text">{f.name}</td>
                  <td className="p-6 text-blue-500 font-extrabold">{f.gci}</td>
                  <td className="p-6 mode-aware-subtext">{f.golden}</td>
                  <td className="p-6 mode-aware-subtext">{f.kitas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
