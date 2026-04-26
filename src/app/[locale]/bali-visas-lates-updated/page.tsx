import React from "react";
import { Metadata } from "next";
import { getMessages } from "@/i18n/getMessages";
import dynamic from "next/dynamic";
import LazySection from "@/components/layout/LazySection";
import Hero from "@/components/hero/Hero";
import Link from "next/link";
import { MapPin, PlaneLanding, Smartphone, Users } from "lucide-react";

const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview"));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
  
  return {
    title: "Bali Visas Latest Updated | Local Bali Immigration News Feed",
    description: "Get the latest updates on Bali specific visa rules, Ngurah Rai airport protocols, and local government policies for 2026-2027. Stay safe with the Bali Help community feed.",
    keywords: ["bali visa update today", "ngurah rai airport news", "bali immigration rules 2026", "bali help community", "bali tourist policy latest"],
    alternates: {
      canonical: `${APP_URL}/${locale}/bali-visas-lates-updated`,
    },
    openGraph: {
      title: "Bali Visa Alert: Latest Local Policy Updates",
      description: "Direct news from our Bali HQ about airport protocols and local island regulations.",
      images: ['/images/BaliHelpCompress.webp'],
    },
    robots: "index, follow"
  };
}

export default async function BaliUpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getMessages(locale);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

  const localNewsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Local Bali Visa & Immigration Updates 2026",
    "description": "Specific news and policy shifts for travelers and expats residing in Bali.",
    "dateModified": new Date().toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "PT Indonesian Visas Agency (Bali Local Office)"
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#030712]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localNewsSchema) }}
      />
      
      {/* 1. Hero Section - Bali Local Context */}
      <Hero dict={dict} />

      {/* 2. Bali Local Briefing - Unique Content */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
           <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <h2 className="text-4xl font-black tracking-tight">Bali Local Intelligence</h2>
                 <p className="text-xl mode-aware-subtext leading-relaxed">
                    Our Bali HQ monitors local Ngurah Rai (DPS) airport protocols and provincial government (Pemprov) circulars in real-time to ensure your stay remains compliant.
                 </p>
                 
                 <div className="space-y-6">
                    <div className="flex gap-6 p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-lg">
                       <PlaneLanding className="text-primary shrink-0" size={32} />
                       <div>
                          <h3 className="font-black text-xl mb-2">Ngurah Rai (DPS) Status</h3>
                          <p className="text-sm mode-aware-subtext">New Autogate lanes are now fully operational for e-Visa holders, reducing wait times to under 15 minutes.</p>
                       </div>
                    </div>
                    <div className="flex gap-6 p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-lg">
                       <Users className="text-accent shrink-0" size={32} />
                       <div>
                          <h3 className="font-black text-xl mb-2">Sponsor Enforcement</h3>
                          <p className="text-sm mode-aware-subtext">Bali Immigration is strictly enforcing the 'Direct Sponsor' rule. PT Indonesian Visas Agency provides verified local sponsorship.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-primary p-12 rounded-[3.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                 <h3 className="text-3xl font-black flex items-center gap-4">
                    <Smartphone />
                    Smart ID Acceptance
                 </h3>
                 <div className="space-y-4">
                    <p className="text-white/80">Current Bali acceptance for Digital Identity verification:</p>
                    <ul className="space-y-4">
                       <li className="flex items-center gap-4 font-bold">
                          <CheckCircle2 size={20} className="text-accent" />
                          Major Hotel Groups (Seminyak/Canggu)
                       </li>
                       <li className="flex items-center gap-4 font-bold">
                          <CheckCircle2 size={20} className="text-accent" />
                          Motorcycle & Car Rentals (Verifiable)
                       </li>
                       <li className="flex items-center gap-4 font-bold">
                          <CheckCircle2 size={20} className="text-accent" />
                          Local Police Verification Support
                       </li>
                    </ul>
                 </div>
                 <div className="pt-4">
                    <Link href="https://balihelp.id" target="_blank" className="inline-block px-8 py-4 bg-white text-primary font-black rounded-xl hover:bg-accent hover:text-white transition-all">
                       Visit Bali Help Community
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Popular Visa Grid - Bali Current */}
      <LazySection minHeight="600px">
        <div className="py-12 bg-white dark:bg-black">
           <div className="container mx-auto px-4 text-center mb-10">
              <h2 className="text-4xl font-black mb-4">Top Visas for Bali Visitors</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400">Availability and processing speed for current Bali arrivals.</p>
           </div>
           <ServicesPreview dict={dict} />
        </div>
      </LazySection>

      {/* 4. Strategic Link Matrix */}
      <section className="py-20 bg-slate-50 dark:bg-white/5">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-black mb-12">Global Context Hubs</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/indonesian-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">National Hub</h3>
                 <p className="text-sm text-slate-400">Roadmap 2026-2027</p>
              </Link>
              <Link href="/bali-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Bali Guide</h3>
                 <p className="text-sm text-slate-400">Tourism & Nomad Hub</p>
              </Link>
              <Link href="/jakarta-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Jakarta Hub</h3>
                 <p className="text-sm text-slate-400">Business & Investment</p>
              </Link>
              <Link href="/indonesian-visas-lates-updated" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">National News</h3>
                 <p className="text-sm text-slate-400">Global Policy Feed</p>
              </Link>
           </div>
        </div>
      </section>

      {/* 5. Contact & Final CTA */}
      <LazySection minHeight="500px">
        <ContactSection dict={dict} />
      </LazySection>

    </main>
  );
}

import { CheckCircle2 } from "lucide-react";
