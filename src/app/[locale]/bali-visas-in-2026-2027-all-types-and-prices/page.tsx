import React from "react";
import { Metadata } from "next";
import { getMessages } from "@/i18n/getMessages";
import dynamic from "next/dynamic";
import LazySection from "@/components/layout/LazySection";
import Hero from "@/components/hero/Hero";
import Link from "next/link";

const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview"));
const FAQPreview = dynamic(() => import("@/components/sections/FAQPreview"));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"));
const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
  
  return {
    title: "Bali Visas 2026-2027 | Official Guide & Direct Sponsor in Bali",
    description: "The ultimate guide for Bali Visas in 2026-2027. Special focus on B1 VOA, E33G Nomad Visa, and KITAS for Bali expats. Direct sponsorship by PT Indonesian Visas Agency (Bali HQ).",
    keywords: ["bali visa 2026", "bali nomad visa 2027", "bali visa price", "bali help visas", "indonesia visa bali guide"],
    alternates: {
      canonical: `${APP_URL}/${locale}/bali-visas-in-2026-2027-all-types-and-prices`,
    },
    openGraph: {
      title: "Bali Visa Guide 2026-2027 | Official Prices",
      description: "Plan your Bali journey with the most accurate 2026-2027 visa information. Official prices, requirements, and Smart ID technology.",
      images: ['/images/BaliHelpCompress.webp'],
    },
    robots: "index, follow, max-image-preview:large"
  };
}

export default async function BaliGuide2026({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getMessages(locale);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

  const travelSchema = {
    "@context": "https://schema.org",
    "@type": "Guide",
    "name": "Bali Visas In 2026-2027: All Types and Prices",
    "description": "Specific guide for tourists and expats visiting Bali in 2026 and 2027.",
    "publisher": {
      "@type": "Organization",
      "name": "PT Indonesian Visas Agency (Bali Office)"
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#030712]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(travelSchema) }}
      />
      
      {/* 1. Hero Section - Bali Paradise Focus */}
      <Hero dict={dict} />

      {/* 2. Bali 2027 Outlook - Unique Content */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="text-primary font-bold tracking-widest uppercase mb-4 block italic">Bali Tourism 2027 Roadmap</span>
          <h2 className="text-5xl font-black mb-10 tracking-tight">Evolving the Island of Gods</h2>
          <div className="prose prose-xl mx-auto dark:prose-invert leading-relaxed">
            <p>
              By 2026, Bali is projected to implement more advanced digital screening for travelers. 
              The <strong>Smart ID Ecosystem</strong> developed by PT Indonesian Visas Agency is at the forefront of this change, 
              providing a seamless bridge between immigration compliance and local Bali lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The Bali Advantage - Direct Sponsorship */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-10 rounded-[3rem] border-primary/20 bg-primary/5">
               <h3 className="text-2xl font-black mb-4">Zero Brokers</h3>
               <p className="mode-aware-subtext">Direct sponsorship from our Bali HQ ensures you never pay unnecessary agency markups.</p>
            </div>
            <div className="glass-card p-10 rounded-[3rem] border-accent/20 bg-accent/5">
               <h3 className="text-2xl font-black mb-4">Nomad Hub</h3>
               <p className="mode-aware-subtext">Specialized support for the E33G Remote Worker visa with local tax-free guidance.</p>
            </div>
            <div className="glass-card p-10 rounded-[3rem] border-primary/20 bg-primary/5">
               <h3 className="text-2xl font-black mb-4">NFC Verification</h3>
               <p className="mode-aware-subtext">Use your Smart ID for instant verification at Bali hotels and motorcycle rentals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Visa Grid - The 9 Cards */}
      <LazySection minHeight="600px">
        <div className="py-12 bg-white dark:bg-black">
           <div className="container mx-auto px-4 text-center mb-10">
              <h2 className="text-4xl font-black mb-4">Bali's Top 9 Visa Choices</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400">Specifically selected for the Bali expat and tourist community.</p>
           </div>
           <ServicesPreview dict={dict} />
        </div>
      </LazySection>

      {/* 5. Pricing Section - Bali Specific Table */}
      <section className="py-24 bg-slate-50 dark:bg-white/5">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-black mb-12 text-center tracking-tighter">Bali Service Pricing 2026-2027</h2>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="bg-white dark:bg-black p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-white/10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <span className="w-2 h-8 bg-primary rounded-full"></span>
                   Tourism & Visit
                </h3>
                <ul className="space-y-6">
                   <li className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/10">
                      <span className="font-medium">B1 VOA (Extension)</span>
                      <span className="text-primary font-bold">Contact Support</span>
                   </li>
                   <li className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/10">
                      <span className="font-medium">C1 Tourist (60 Days)</span>
                      <span className="text-primary font-bold">Official Rates</span>
                   </li>
                   <li className="flex justify-between items-center">
                      <span className="font-medium">D1 Multiple Entry</span>
                      <span className="text-primary font-bold">Long-Term Bali</span>
                   </li>
                </ul>
             </div>
             <div className="bg-white dark:bg-black p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-white/10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <span className="w-2 h-8 bg-accent rounded-full"></span>
                   Nomad & Residency
                </h3>
                <ul className="space-y-6">
                   <li className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/10">
                      <span className="font-medium">E33G Remote Worker</span>
                      <span className="text-accent font-bold">Best for Nomads</span>
                   </li>
                   <li className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/10">
                      <span className="font-medium">E28A Investor KITAS</span>
                      <span className="text-accent font-bold">Invest in Bali</span>
                   </li>
                   <li className="flex justify-between items-center">
                      <span className="font-medium">Bali Home Service</span>
                      <span className="text-accent font-bold">Included</span>
                   </li>
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us - Bali Context */}
      <LazySection minHeight="500px">
        <WhyChooseUs dict={dict} />
      </LazySection>

      {/* 7. Regional Interlinking Hub */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-black mb-12">More Strategic Visa Guides</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/indonesian-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">National Guide</h3>
                 <p className="text-sm text-slate-400">All Indonesia Rules</p>
              </Link>
              <Link href="/jakarta-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Jakarta Guide</h3>
                 <p className="text-sm text-slate-400">Business Hub</p>
              </Link>
              <Link href="/indonesian-visas-lates-updated" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">National Updates</h3>
                 <p className="text-sm text-slate-400">Policy News</p>
              </Link>
              <Link href="/bali-visas-lates-updated" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Bali News</h3>
                 <p className="text-sm text-slate-400">Local Bali Rules</p>
              </Link>
           </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <LazySection minHeight="500px">
        <ContactSection dict={dict} />
      </LazySection>

    </main>
  );
}
