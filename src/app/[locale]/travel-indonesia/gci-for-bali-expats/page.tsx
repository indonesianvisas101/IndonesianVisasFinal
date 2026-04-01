"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Palmtree, Navigation, Building2, 
  Sunset, Coffee, MapPin, 
  Infinity, ArrowRight, ShieldCheck,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatNavLink } from "@/utils/seo";

const RegionalHero = () => (
  <section className="relative h-[60vh] flex items-center bg-slate-900 overflow-hidden">
    <div className="absolute inset-0 bg-[url('/images/IndonesianVisas/16K.webp')] bg-cover bg-center opacity-40 grayscale-[20%]" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
    <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-xs tracking-widest uppercase">
          <MapPin size={14} /> Bali & Jakarta Focus
      </div>
      <h1 className="text-5xl md:text-7xl font-black text-white leading-none">
        GCI for Bali <br/><span className="text-blue-500">Expats & Diaspora</span>
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium">
        Re-establish your roots in Indonesia's most vibrant hubs. The Global Citizen program provides the ultimate residency status for returning diaspora in Bali and Jakarta.
      </p>
    </div>
  </section>
);

export default function GCIRegionalPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const sections = [
    {
      title: "Retire in Paradise",
      icon: <Palmtree className="text-amber-500" />,
      body: "Bali is the top choice for GCI holders looking to retire. With 'Unlimited' validity, you no longer need to worry about annual KITAS renewals or bank deposit requirements."
    },
    {
      title: "Business in the Capital",
      icon: <Building2 className="text-blue-500" />,
      body: "Jakarta's booming economy is now more accessible. GCI holders enjoy full work rights and easier business setup compared to standard foreign investors."
    },
    {
      title: "Property Ownership",
      icon: <Navigation className="text-red-500" />,
      body: "Secure your dream villa in Canggu or a penthouse in Jakarta. GCI simplifies the legal path to property for the Indonesian diaspora."
    }
  ];

  return (
    <main className="min-h-screen pb-24 bg-white dark:bg-slate-950">
      <RegionalHero />

      {/* 1. Value Proposition Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          {sections.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-10 bg-slate-50 dark:bg-white/5 rounded-[40px] border border-slate-200 dark:border-white/10 hover:shadow-xl transition-all"
            >
              <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-2xl w-fit shadow-sm">
                {React.cloneElement(s.icon as React.ReactElement<any>, { size: 32 })}
              </div>
              <h3 className="text-2xl font-black mb-4 mode-aware-text">{s.title}</h3>
              <p className="mode-aware-subtext leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. Fast-Open Focus (Regional Highlights) */}
      <section className="py-24 bg-blue-900/5 dark:bg-blue-900/20 border-y border-blue-500/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-10">
              <h2 className="text-4xl md:text-5xl font-black mode-aware-text tracking-tighter leading-none">Why Choose GCI <br/>in Bali/Jakarta?</h2>
              <div className="space-y-6">
                {[
                  "No requirement for expensive 'Immigration Sponsors' annually.",
                  "Full access to local banking and healthcare systems.",
                  "Fast 14-day VITAS-to-ITAP conversion for Diaspora.",
                  "100% Legal Property path via Hak Pakai/Hak Guna Bangunan."
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-xs">{i+1}</div>
                    <p className="mode-aware-text font-bold text-lg">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block w-fit relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-[100px] animate-pulse" />
                <div className="relative p-10 bg-white dark:bg-slate-900 rounded-[50px] border border-blue-500/20 shadow-2xl">
                    <Infinity size={100} className="text-blue-500 animate-[spin_5s_linear_infinite]" />
                    <p className="mt-8 text-center font-black mode-aware-text tracking-widest text-sm italic">UNLIMITED FREEDOM</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA & Hub Link */}
      <section className="py-32 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl font-black mode-aware-text italic">"The Island of Gods is waiting for the children of Indonesia."</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href={formatNavLink(locale, "/gci")} 
              className="px-10 py-5 bg-blue-600 text-white rounded-full font-black text-lg hover:scale-105 transition-transform flex items-center gap-2 justify-center"
            >
              Master Hub (Full Requirements) <ArrowRight size={20} />
            </Link>
            <Link 
              href={formatNavLink(locale, "/apply")} 
              className="px-10 py-5 border-2 border-slate-900 dark:border-white rounded-full mode-aware-text font-black text-lg hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all flex items-center gap-2 justify-center"
            >
              Start GCI Application <ShieldCheck size={20} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
