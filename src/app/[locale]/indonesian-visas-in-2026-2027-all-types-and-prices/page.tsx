import React from "react";
import { Metadata } from "next";
import { getMessages } from "@/i18n/getMessages";
import dynamic from "next/dynamic";
import LazySection from "@/components/layout/LazySection";
import Hero from "@/components/hero/Hero";

// Unique Components for SEO Pages
const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview"));
const FAQPreview = dynamic(() => import("@/components/sections/FAQPreview"));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"));
const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
  
  return {
    title: "Indonesian Visas 2026-2027 | Official Guide & Direct Sponsor Prices",
    description: "The definitive guide to Indonesian visas for 2026-2027. Latest B1, C1, D1, E33G, and E28A prices and rules. First-hand direct corporate sponsorship by PT Indonesian Visas Agency.",
    keywords: ["indonesian visa 2026", "visa price 2027", "bali visa guide 2026", "indonesia immigration update", "kitas price 2027"],
    alternates: {
      canonical: `${APP_URL}/${locale}/indonesian-visas-in-2026-2027-all-types-and-prices`,
    },
    openGraph: {
      title: "Complete Guide: Indonesian Visas 2026-2027",
      description: "Everything you need to know about the new 2026-2027 Indonesian visa landscape. Prices, requirements, and direct sponsorship.",
      images: ['/images/BaliHelpCompress.webp'],
    },
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  };
}

export default async function NationalGuide2026({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getMessages(locale);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Indonesian Visas In 2026-2027: All Types and Prices",
    "description": "Comprehensive analysis of the Indonesian visa landscape for 2026 and 2027 including digital transformation and direct sponsorship.",
    "author": {
      "@type": "Person",
      "name": "Bayu Damopolii-Manoppo"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PT Indonesian Visas Agency",
      "logo": { "@type": "ImageObject", "url": `${APP_URL}/Favicon.webp` }
    },
    "datePublished": "2026-04-27",
    "image": `${APP_URL}/images/BaliHelpCompress.webp`
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* 1. Hero Section - National Future Focus */}
      <Hero dict={dict} />

      {/* 2. Educational Intro - Unique Content */}
      <section className="py-20 bg-slate-50 dark:bg-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-black mb-8 tracking-tighter">The 2026-2027 Immigration Roadmap</h2>
          <div className="prose prose-lg dark:prose-invert">
            <p>
              As Indonesia moves towards a fully digitalized immigration system, 2026 and 2027 mark a significant shift in how visas are processed and sponsored. 
              Under the current <strong>Omnibus Law</strong> framework, the emphasis has shifted towards direct corporate accountability and transparent digital tracking.
            </p>
            <p>
              PT Indonesian Visas Agency continues to lead this transformation by providing first-hand sponsorship, eliminating the risks associated with third-party brokers.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Popular Visa Grid - The 9 Cards */}
      <LazySection minHeight="600px">
        <div className="py-12 bg-white dark:bg-black">
           <div className="container mx-auto px-4 text-center mb-10">
              <h2 className="text-4xl font-black mb-4">9 Most Popular Visas for 2026-2027</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400">Curated based on national demand and processing speed.</p>
           </div>
           <ServicesPreview dict={dict} />
        </div>
      </LazySection>

      {/* 4. Strategic Price List Table */}
      <section className="py-20 border-y border-slate-100 dark:border-white/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-black mb-12 text-center">National Price Transparency 2026</h2>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl">
            <table className="w-full text-left border-collapse bg-white dark:bg-white/5">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-6 text-xl">Visa Type</th>
                  <th className="p-6 text-xl">Standard Fee</th>
                  <th className="p-6 text-xl">Priority (Express)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-primary">B1 VOA (30-60 Days)</td>
                  <td className="p-6 font-medium">USD 35 + Service</td>
                  <td className="p-6 text-accent font-bold">1-4 Hours Approval</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-primary">C1/C2 Single Entry</td>
                  <td className="p-6 font-medium">Contact Support</td>
                  <td className="p-6 text-accent font-bold">3 Business Days</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-primary">D1/D2 Multiple Entry</td>
                  <td className="p-6 font-medium">1, 2, or 5 Years</td>
                  <td className="p-6 text-accent font-bold">Strategic Corporate</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-primary">E33G Digital Nomad</td>
                  <td className="p-6 font-medium">Full Tax Benefits</td>
                  <td className="p-6 text-accent font-bold">Priority Processing</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-12 text-center">
             <p className="text-slate-400 text-sm">*Prices are subject to government regulation changes. Direct sponsorship included.</p>
          </div>
        </div>
      </section>

      {/* 5. Smart ID Technology Spotlight */}
      <section className="py-24 relative overflow-hidden bg-primary text-white">
          <div className="container mx-auto px-4 relative z-10">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                      <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold tracking-widest uppercase">Patent-Pending Technology</span>
                      <h2 className="text-5xl font-black tracking-tight leading-tight">Smart ID: The Future of Identity in 2027</h2>
                      <p className="text-xl text-white/80 leading-relaxed">
                          Integrated NFC and QR technology allowing verifiable sponsorship status without carrying your physical passport. 
                          Designed for hotel check-ins, rentals, and government-aligned security protocols.
                      </p>
                      <button className="px-10 py-5 bg-accent text-white font-black rounded-2xl shadow-xl hover:-translate-y-1 transition-all">
                          Get Your Smart ID
                      </button>
                  </div>
                  <div className="bg-white/10 p-8 rounded-[3rem] border border-white/20 backdrop-blur-xl">
                      <div className="space-y-4">
                          <div className="h-4 bg-white/20 rounded-full w-3/4"></div>
                          <div className="h-4 bg-white/20 rounded-full w-1/2"></div>
                          <div className="h-4 bg-white/20 rounded-full w-2/3"></div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 6. Why Choose Us - Authority */}
      <LazySection minHeight="500px">
        <WhyChooseUs dict={dict} />
      </LazySection>

      {/* 7. FAQ Section */}
      <LazySection minHeight="500px">
        <FAQPreview dict={dict} />
      </LazySection>

      {/* 8. Regional Interlinking Hub */}
      <section className="py-20 bg-slate-50 dark:bg-white/5">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-black mb-12">Explore Regional Visa Hubs</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/bali-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Bali Guide 2026</h3>
                 <p className="text-sm text-slate-400">Tourism & Nomad Hub</p>
              </Link>
              <Link href="/jakarta-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Jakarta Guide 2026</h3>
                 <p className="text-sm text-slate-400">Business & Investment</p>
              </Link>
              <Link href="/indonesian-visas-lates-updated" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">National Updates</h3>
                 <p className="text-sm text-slate-400">Latest Policy News</p>
              </Link>
              <Link href="/bali-visas-lates-updated" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Bali Updates</h3>
                 <p className="text-sm text-slate-400">Local Bali News</p>
              </Link>
           </div>
        </div>
      </section>

      {/* 9. Contact & Final CTA */}
      <LazySection minHeight="500px">
        <ContactSection dict={dict} />
      </LazySection>

    </main>
  );
}

import Link from "next/link";
