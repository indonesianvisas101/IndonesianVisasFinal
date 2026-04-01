"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { 
  Globe, ShieldCheck, Heart, Users, Landmark, 
  ChevronRight, HelpCircle, CheckCircle2, Infinity as InfinityIcon, Download,
  Navigation, Languages, Briefcase
} from "lucide-react";
import dynamic from "next/dynamic";
import { linkGCIKeywords } from "@/utils/gciHardening";
import Image from "next/image";

// Dynamic Imports for Instant Page Logic (SSR: false)
const IDivCardModern = dynamic(() => import("@/components/idiv/IDivCardModern"), { ssr: false });
const GCIActivityToast = dynamic(() => import("@/components/gci/GCIActivityToast"), { ssr: false });
const GCIEligibility = dynamic(() => import("./sections/GCIEligibility"), { ssr: false });
const GCIComparisonTable = dynamic(() => import("./sections/GCIComparisonTable"), { ssr: false });
const GCIBenefits = dynamic(() => import("./sections/GCIBenefits"), { ssr: false });
const GCISecurity = dynamic(() => import("./sections/GCISecurity"), { ssr: false });
const GCIFinalCTA = dynamic(() => import("./sections/GCIFinalCTA"), { ssr: false });

// Helper to render rich text with <highlight> and <br />
const renderRichText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(<highlight>.*?<\/highlight>|<br \/>)/g);
  return parts.map((part, i) => {
    if (part.startsWith('<highlight>')) {
      const content = part.replace('<highlight>', '').replace('</highlight>', '');
      return <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-300 to-amber-500 text-glow-blue">{content}</span>;
    }
    if (part === '<br />') return <br key={i} />;
    return part;
  });
};

const GCIHero = ({ dict }: { dict: any }) => {
  const gciHero = dict?.gci?.hero || {};
  return (
    <section className="relative min-h-[90vh] flex items-center bg-slate-950 overflow-hidden pt-20">
      <div className="absolute inset-0">
          <Image 
            src="/Global Citizen of Indonesia (GCI).webp" 
            alt="Global Citizen of Indonesia (GCI) - Lifetime Diaspora Residency Program Official Image" 
            fill 
            priority 
            sizes="100vw"
            quality={90}
            fetchPriority="high"
            className="object-cover opacity-40 grayscale-[20%]"
          />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-blue-950/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl space-y-8">
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs tracking-widest uppercase"
          >
            <InfinityIcon size={16} /> Global Citizen of Indonesia (GCI)
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-black text-white leading-[0.9]"
          >
            {renderRichText(gciHero.title)}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-300 max-w-2xl font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: linkGCIKeywords(gciHero.description || "", 'en') }}
          />
        </div>
      </div>
    </section>
  );
};

export default function GCIContent({ dict }: { dict: any }) {
  const gciCta = dict?.gci?.cta || {};
  const [email, setEmail] = useState('');

  // Performance Hardening: dwell-time tracking for Elite Diaspora Prospects
  useEffect(() => {
    const startTime = Date.now();
    const tracker = setInterval(() => {
      const dwellTime = (Date.now() - startTime) / 1000;
      if (dwellTime > 120) {
        // High interest detected (>2 mins on GCI hub)
        fetch('/api/gci/prospect-alert', {
           method: 'POST',
           body: JSON.stringify({ time: dwellTime, source: 'GCI_HUB_CORE' })
        }).catch(() => {});
        clearInterval(tracker);
      }
    }, 10000);
    return () => clearInterval(tracker);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <GCIHero dict={dict} />
      
      {/* Marquee Section */}
      <div className="py-6 bg-blue-600 overflow-hidden whitespace-nowrap">
        <motion.div 
           animate={{ x: [0, -1000] }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="inline-flex gap-20"
        >
          {[1,2,3,4,5].map(i => (
             <div key={i} className="flex gap-20 text-white font-black uppercase tracking-tighter text-2xl">
               <span>{dict?.gci?.marquee?.item1}</span>
               <InfinityIcon />
               <span>{dict?.gci?.marquee?.item2}</span>
               <InfinityIcon />
               <span>{dict?.gci?.marquee?.item3}</span>
               <InfinityIcon />
               <span>{dict?.gci?.marquee?.item4}</span>
               <InfinityIcon />
             </div>
          ))}
        </motion.div>
      </div>

      <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 dark:bg-white/5" />}>
        <GCIEligibility dict={dict} />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 dark:bg-white/5" />}>
        <GCIComparisonTable dict={dict} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 dark:bg-white/5" />}>
        <GCIBenefits dict={dict} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 dark:bg-white/5" />}>
        <GCISecurity dict={dict} renderRichText={renderRichText} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 dark:bg-white/5" />}>
        <GCIFinalCTA gciCta={gciCta} email={email} setEmail={setEmail} />
      </Suspense>

      <Suspense fallback={null}>
         <GCIActivityToast dict={dict} />
      </Suspense>
    </div>
  );
}
