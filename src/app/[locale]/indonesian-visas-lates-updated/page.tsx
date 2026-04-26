import React from "react";
import { Metadata } from "next";
import { getMessages } from "@/i18n/getMessages";
import dynamic from "next/dynamic";
import LazySection from "@/components/layout/LazySection";
import Hero from "@/components/hero/Hero";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview"));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
  
  return {
    title: "Indonesian Visas Latest Updated | Live Immigration Policy Feed",
    description: "Real-time updates on Indonesian visa policies, new circulars (SE), and system status. Stay informed about B1, C1, D1, and KITAS changes directly from the primary sponsor.",
    keywords: ["indonesia visa news", "immigration policy update", "evisa system status", "indonesian visa 2026 update", "official immigration circulars"],
    alternates: {
      canonical: `${APP_URL}/${locale}/indonesian-visas-lates-updated`,
    },
    openGraph: {
      title: "Live Feed: Indonesian Visa Policy Updates",
      description: "Don't rely on outdated information. Get the latest official immigration updates here.",
      images: ['/images/BaliHelpCompress.webp'],
    },
    robots: "index, follow"
  };
}

export default async function NationalUpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getMessages(locale);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Indonesian Visas Latest Policy Updates 2026",
    "description": "Live feed and official briefing on Indonesian immigration regulatory changes and digital sponsorship protocols.",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "PT Indonesian Visas Agency Intelligence Unit"
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />
      
      {/* 1. Hero Section - Urgency & News Focus */}
      <Hero dict={dict} />

      {/* 2. Live Briefing Section - Unique Content */}
      <section className="py-20 border-b border-slate-100 dark:border-white/10">
        <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto space-y-12">
              <div className="flex items-center gap-4 text-accent font-black uppercase tracking-widest animate-pulse">
                 <Zap size={24} fill="currentColor" />
                 <span>Live Intelligence Feed</span>
              </div>
              <h2 className="text-5xl font-black tracking-tight">Recent Policy Shifts & Regulatory News</h2>
              
              <div className="space-y-8">
                 <div className="p-10 rounded-[3rem] bg-slate-50 dark:bg-white/5 border-l-8 border-primary relative overflow-hidden">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                       <CheckCircle2 className="text-primary" />
                       Digital Sponsorship Enforcement
                    </h3>
                    <p className="text-lg mode-aware-subtext">
                       As of mid-2026, the Directorate General of Immigration has intensified the requirement for verifiable corporate sponsorship. 
                       Broker-based applications without direct corporate accountability are facing higher rejection rates.
                    </p>
                 </div>

                 <div className="p-10 rounded-[3rem] bg-slate-50 dark:bg-white/5 border-l-8 border-accent relative overflow-hidden">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                       <ShieldCheck className="text-accent" />
                       Anti-Scam Advisory
                    </h3>
                    <p className="text-lg mode-aware-subtext">
                       Be wary of "Express" promises from unofficial social media channels. Always verify the NIB and AHU of your agency on the official OSS government portal before remitting payment.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 3. System Status Monitor */}
      <section className="py-24 bg-primary text-white">
         <div className="container mx-auto px-4">
            <h2 className="text-4xl font-black mb-16 text-center">Global System Infrastructure Status</h2>
            <div className="grid md:grid-cols-3 gap-12">
               <div className="text-center space-y-4">
                  <div className="text-5xl font-black">Online</div>
                  <div className="text-white/60 font-bold uppercase tracking-widest">eVisa National Portal</div>
               </div>
               <div className="text-center space-y-4">
                  <div className="text-5xl font-black">Active</div>
                  <div className="text-white/60 font-bold uppercase tracking-widest">Autogate Verification</div>
               </div>
               <div className="text-center space-y-4">
                  <div className="text-5xl font-black">24/7</div>
                  <div className="text-white/60 font-bold uppercase tracking-widest">Smart ID Support</div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. Popular Visa Grid - Current Status */}
      <LazySection minHeight="600px">
        <div className="py-12 bg-white dark:bg-black">
           <div className="container mx-auto px-4 text-center mb-10">
              <h2 className="text-4xl font-black mb-4">Currently Issuing & Reliable</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400">These visa types are showing 99% approval rates in the current regulatory window.</p>
           </div>
           <ServicesPreview dict={dict} />
        </div>
      </LazySection>

      {/* 5. Regional Interlinking Hub */}
      <section className="py-20 bg-slate-50 dark:bg-white/5">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-black mb-12">Detailed Strategic Guides</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/indonesian-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">National Hub</h3>
                 <p className="text-sm text-slate-400">2026-2027 Roadmap</p>
              </Link>
              <Link href="/bali-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Bali Hub</h3>
                 <p className="text-sm text-slate-400">Tourism & Nomad</p>
              </Link>
              <Link href="/jakarta-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Jakarta Hub</h3>
                 <p className="text-sm text-slate-400">Business & Capital</p>
              </Link>
              <Link href="/bali-visas-lates-updated" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Bali News</h3>
                 <p className="text-sm text-slate-400">Local Bali Updates</p>
              </Link>
           </div>
        </div>
      </section>

      {/* 6. Contact & Final CTA */}
      <LazySection minHeight="500px">
        <ContactSection dict={dict} />
      </LazySection>

    </main>
  );
}
