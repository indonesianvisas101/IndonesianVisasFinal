import React from "react";
import { Metadata } from "next";
import { getMessages } from "@/i18n/getMessages";
import dynamic from "next/dynamic";
import LazySection from "@/components/layout/LazySection";
import Hero from "@/components/hero/Hero";
import Link from "next/link";

import { 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  BookOpen, 
  AlertCircle, 
  HelpCircle, 
  FileCheck, 
  Map as MapIcon, 
  ArrowRight,
  Plane,
  Building2,
  Briefcase
} from "lucide-react";
import IDivCardModern from "@/components/idiv/IDivCardModern";

const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview"));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"));
const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
  
  return {
    title: "Jakarta Visas 2026-2027 | Business & Investor Immigration Hub",
    description: "Comprehensive 2026-2027 guide for Jakarta Visas. Specialized in Investor KITAS (E28A), Business Multiple Entry (D2), and PT PMA formation. Direct corporate sponsorship for professionals.",
    keywords: ["jakarta visa 2026", "investor kitas jakarta", "pt pma jakarta 2027", "business visa indonesia", "jakarta immigration guide"],
    alternates: {
      canonical: `${APP_URL}/${locale}/jakarta-visas-in-2026-2027-all-types-and-prices`,
    },
    openGraph: {
      title: "Jakarta Business Visa Guide 2026-2027",
      description: "Secure your business presence in Indonesia. Trusted Jakarta visa guide for investors and corporate entities.",
      images: ['/images/BaliHelpCompress.webp'],
    },
    robots: "index, follow, max-image-preview:large"
  };
}

export default async function JakartaGuide2026({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getMessages(locale);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

  const jakartaLocalSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${APP_URL}/jakarta-visas-in-2026-2027-all-types-and-prices/#local-business`,
    "name": "Jakarta Visa Agency — Official Division of PT Indonesian Visas Agency",
    "url": `${APP_URL}/${locale}/jakarta-visas-in-2026-2027-all-types-and-prices`,
    "description": "The trusted Jakarta division specializing in Investor KITAS (E28A), Business Multiple Entry Visas (D2/D12), PT PMA formation, and corporate immigration. Direct legal sponsor — zero intermediaries.",
    "telephone": "+62-857-2704-1992",
    "email": "contact@indonesianvisas.agency",
    "areaServed": ["Jakarta", "South Jakarta", "Central Jakarta", "North Jakarta", "West Jakarta", "East Jakarta", "Tangerang", "Bekasi", "Depok", "IKN Nusantara"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Tibungsari No.11C, Padangsambian Kaja",
      "addressLocality": "Denpasar Barat, Denpasar",
      "addressRegion": "Bali",
      "postalCode": "80117",
      "addressCountry": "ID"
    },
    "parentOrganization": {
      "@type": "Corporation",
      "@id": `${APP_URL}/#organization`,
      "name": "PT Indonesian Visas Agency",
      "taxID": "0100000008117681"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Jakarta Visa & Corporate Services 2026-2027",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E28A Investor KITAS Jakarta — 1 and 2 Years" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "D2 Business Multiple Entry Visa — 1, 2, and 5 Years" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "D12 Pre-Investment Multiple Entry Visa Jakarta" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "PT PMA Full Incorporation — 100% Foreign Ownership" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corporate Smart ID Pro — Executive Security Identity" } }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "200",
      "bestRating": "5"
    },
    "sameAs": [
      "https://jakartavisas.agency",
      `${APP_URL}`,
      "https://maps.app.goo.gl/p6t9JSd5CGCDf7jZA"
    ]
  };

  const jakartaFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I get a business visa for Jakarta?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Apply through IndonesianVisas.com for a D2 Business Multiple Entry Visa (1-5 years validity) or D12 Pre-Investment Visa. We are a direct legal sponsor with corporate expertise in Jakarta — no intermediary agents."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best visa for investors in Jakarta?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The E28A Investor KITAS is the best option for foreign investors in Jakarta. It provides 1-2 year residency, legal work and business authorization, and is ideal for PT PMA company directors and shareholders."
        }
      },
      {
        "@type": "Question",
        "name": "How do I set up a PT PMA company in Jakarta?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PT Indonesian Visas Agency provides full PT PMA incorporation service including company name registration, AHU approval, NIB acquisition, KBLI selection, and domicile address setup. 100% foreign ownership is available under the latest Omnibus Law regulations."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get a Jakarta visa from outside Indonesia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our Jakarta division processes offshore visa applications. You can apply for D2 Business Visa, E28A Investor KITAS, and C12 Pre-Investment Visa from anywhere in the world through our online platform at IndonesianVisas.com."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${APP_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": "Jakarta Business Guide 2026", "item": `${APP_URL}/${locale}/jakarta-visas-in-2026-2027-all-types-and-prices` }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jakartaLocalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jakartaFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* SEO H1 — Primary Keyword Target */}
      <h1 className="sr-only">Jakarta Visa 2026-2027 — Business & Investor Immigration Hub | Direct Sponsor</h1>

      {/* 1. Hero Section - Corporate Focus */}
      <Hero dict={dict} bgImage="/images/BaliHelpCompress.webp" />

      {/* Visual Breadcrumbs - SEO SCRUMB */}
      <div className="bg-slate-50 dark:bg-zinc-900/50 py-4 border-b border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <ArrowRight size={10} />
           <span className="text-slate-900 dark:text-white">Jakarta Guide 2026</span>
        </div>
      </div>

      {/* 2. Jakarta Business Outlook - Unique Content */}
      <section className="py-20 bg-white dark:bg-white/5 shadow-inner">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-primary/5 p-12 rounded-[3rem] border border-primary/10">
            <h2 className="text-4xl font-black mb-8 tracking-tighter text-primary">Jakarta: The Global Business Gateway</h2>
            <div className="prose prose-lg dark:prose-invert">
              <p>
                In 2026, Jakarta remains the financial heart of Indonesia. As the nation transitions to the new capital (IKN), 
                Jakarta continues to serve as the primary legal and corporate hub for foreign investment.
              </p>
              <p>
                We provide specialized <strong>PT PMA Formation</strong> and <strong>Investor KITAS (E28A)</strong> services 
                to ensure your business is fully compliant with the latest Ministry of Investment (BKPM) regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Corporate Service Matrix */}
      <section className="py-24">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-black mb-16 text-center">Executive Immigration Solutions</h2>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:shadow-2xl transition-all">
                 <div className="text-4xl mb-4">💼</div>
                 <h3 className="font-bold mb-2">PT PMA Setup</h3>
                 <p className="text-sm text-slate-500">100% Foreign Ownership</p>
              </div>
              <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:shadow-2xl transition-all">
                 <div className="text-4xl mb-4">📈</div>
                 <h3 className="font-bold mb-2">Investor KITAS</h3>
                 <p className="text-sm text-slate-500">2-Year Duration (E28A)</p>
              </div>
              <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:shadow-2xl transition-all">
                 <div className="text-4xl mb-4">🏛️</div>
                 <h3 className="font-bold mb-2">Legal Docs</h3>
                 <p className="text-sm text-slate-500">KTP-OA & SKCK Service</p>
              </div>
              <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:shadow-2xl transition-all">
                 <div className="text-4xl mb-4">🛡️</div>
                 <h3 className="font-bold mb-2">Smart ID Pro</h3>
                 <p className="text-sm text-slate-500">Corporate Security</p>
              </div>
           </div>
        </div>
      </section>

      {/* NEW SECTION: 3D IDiv Corporate Showcase */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2" />
          <div className="container mx-auto px-4 relative z-10">
              <div className="grid md:grid-cols-2 gap-20 items-center">
                  <div className="space-y-8">
                      <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/20 rounded-full border border-primary/30 text-[10px] font-black tracking-[0.2em] uppercase text-primary">
                          <Building2 size={12} /> Executive Identity Protocol
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-none uppercase">THE <span className="text-primary">CORPORATE</span><br/>SMART-ID</h2>
                      <p className="text-xl text-slate-400 leading-relaxed font-medium">
                          The executive's essential for 2027. Verifiable sponsorship status for high-level business meetings, financial transactions, and secure travel across the archipelago.
                      </p>
                      <div className="flex flex-col gap-4">
                         <div className="flex items-center gap-3 font-bold text-slate-200 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <Shield className="text-primary" size={20} />
                            <span>Encrypted Security for Company Directors</span>
                         </div>
                      </div>
                      <Link href="/smart-id" className="px-12 py-6 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(124,58,237,0.4)] inline-flex items-center gap-3 uppercase italic">
                          Activate Smart ID Pro <ArrowRight size={20} />
                      </Link>
                  </div>
                  <div className="flex justify-center">
                      <div className="relative">
                          <IDivCardModern mode="SMART" autoRotate={true} />
                          <div className="mt-12 text-center">
                              <Link href="/why-travelers-need-a-sponsor-id" className="text-white/40 hover:text-white transition-colors text-sm font-bold underline underline-offset-8 decoration-primary/30 uppercase tracking-widest">
                                  Jakarta Corporate Verification Guide
                              </Link>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* NEW SECTION: CGK Executive Arrival (Soekarno-Hatta) */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1 bg-slate-50 dark:bg-white/5 p-12 rounded-[4rem] border-r-8 border-primary relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Plane size={120} />
                 </div>
                 <h4 className="font-black text-2xl mb-6 italic uppercase">CGK Arrival Protocol:</h4>
                 <div className="space-y-6 relative z-10">
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                       Time is equity. Our **Jakarta Corporate Arrival** service ensures your <Link href="/visa-types/business-visa-indonesia" className="text-primary font-bold underline">D2 Business Visa</Link> is prioritized at Soekarno-Hatta's Executive Terminal.
                    </p>
                    <ul className="space-y-4">
                       <li className="flex gap-3 text-sm font-bold">
                          <FileCheck className="text-green-500" size={18} /> Zero Queue Processing
                       </li>
                       <li className="flex gap-3 text-sm font-bold">
                          <FileCheck className="text-green-500" size={18} /> Direct Liaison with Soetta Immigration
                       </li>
                    </ul>
                 </div>
              </div>
              <div className="flex-1">
                 <div className="inline-flex items-center gap-2 px-4 py-1 bg-slate-100 dark:bg-white/10 rounded-full text-xs font-bold mb-6">
                    <Zap size={14} className="text-primary" /> RAPID DEPLOYMENT 2027
                 </div>
                 <h2 className="text-5xl font-black mb-8 tracking-tighter italic uppercase">BUSINESS <span className="text-primary">FIRST</span></h2>
                 <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-10">
                    Entering Jakarta on business requires more than just a permit; it requires a **Legal Anchor**. As a first-hand corporate sponsor, we bridge the gap between international commerce and local immigration laws.
                 </p>
                 <Link href="/fast-approval" className="inline-flex items-center gap-2 font-black text-primary hover:gap-4 transition-all uppercase italic text-lg">
                    Check Executive Clearance <ArrowRight size={20} />
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Popular Visa Grid - The 9 Cards */}
      <LazySection minHeight="600px">
        <div className="py-12 bg-slate-50 dark:bg-black">
           <div className="container mx-auto px-4 text-center mb-10">
              <h2 className="text-4xl font-black mb-4">Jakarta's Essential Visas</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400">Professional-grade immigration solutions for the Capital district.</p>
           </div>
           <ServicesPreview dict={dict} />
        </div>
      </LazySection>

      {/* 5. Business Price List */}
      <section className="py-20 bg-white dark:bg-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
           <h2 className="text-3xl font-black mb-12 text-center">Corporate Fee Schedule 2026</h2>
           <div className="glass-card overflow-hidden rounded-[2.5rem] border-slate-200">
              <div className="p-8 bg-slate-50 dark:bg-white/10 border-b border-slate-200 flex justify-between font-bold italic">
                 <span>Service Category</span>
                 <span>Jakarta Professional Rate</span>
              </div>
              <div className="p-8 space-y-4">
                 <div className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-white/10">
                    <span className="font-bold">D2 Business Multi-Entry (1 Year)</span>
                    <span className="text-primary font-black">Strategic Quote</span>
                 </div>
                 <div className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-white/10">
                    <span className="font-bold">D12 Pre-Investment Multi-Entry</span>
                    <span className="text-primary font-black">Official Service</span>
                 </div>
                 <div className="flex justify-between items-center py-4">
                    <span className="font-bold">PT PMA Full Incorporation</span>
                    <span className="text-primary font-black">Contact Legal Team</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 6. Why Choose Us - Authority */}
      <LazySection minHeight="500px">
        <WhyChooseUs dict={dict} />
      </LazySection>

      {/* 7. Regional Interlinking Hub */}
      <section className="py-20 bg-slate-50 dark:bg-black">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-black mb-12">Related Legal Ecosystems</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/indonesian-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">National Hub</h3>
                 <p className="text-sm text-slate-400">National Policy Guide</p>
              </Link>
              <Link href="/bali-visas-in-2026-2027-all-types-and-prices" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Bali Hub</h3>
                 <p className="text-sm text-slate-400">Lifestyle & Nomad</p>
              </Link>
              <Link href="/indonesian-visas-lates-updated" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">National News</h3>
                 <p className="text-sm text-slate-400">Immigration Briefs</p>
              </Link>
              <Link href="/bali-visas-lates-updated" className="glass-card p-8 rounded-3xl hover:border-primary transition-all">
                 <h3 className="font-bold text-xl mb-2">Bali News</h3>
                 <p className="text-sm text-slate-400">Local Bali Updates</p>
              </Link>
           </div>
        </div>
      </section>

      {/* NEW SECTION: Investment Synergy & PT PMA Hub */}
      <section className="py-24 bg-slate-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter italic mb-4 uppercase">INVESTMENT <span className="text-primary">SYNERGY</span></h2>
              <p className="text-xl text-slate-500 font-medium italic">Synchronizing Your Business License with Your Residency.</p>
           </div>
           <div className="grid md:grid-cols-2 gap-8">
              <div className="p-12 bg-white dark:bg-black rounded-[4rem] shadow-xl border border-slate-100 dark:border-white/10">
                 <Briefcase className="text-primary mb-6" size={48} />
                 <h3 className="text-3xl font-black mb-4 italic uppercase">PT PMA INCORPORATION</h3>
                 <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    100% Foreign Ownership under the **Omnibus Law**. We handle the full OSS (Online Single Submission) process, NIB registration, and BKPM compliance.
                 </p>
                 <Link href="/company-formation" className="font-black text-primary uppercase text-sm hover:underline">Explore Formation <ArrowRight size={14} className="inline ml-1" /></Link>
              </div>
              <div className="p-12 bg-white dark:bg-black rounded-[4rem] shadow-xl border border-slate-100 dark:border-white/10">
                 <Globe className="text-primary mb-6" size={48} />
                 <h3 className="text-3xl font-black mb-4 italic uppercase">INVESTOR KITAS (E28A)</h3>
                 <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    The golden standard for Jakarta residents. Secure a 2-year permit with unlimited entry and full director-level legal rights in Indonesia.
                 </p>
                 <Link href="/visa-types/investor-visa-indonesia" className="font-black text-primary uppercase text-sm hover:underline">Explore Investor Visa <ArrowRight size={14} className="inline ml-1" /></Link>
              </div>
           </div>
        </div>
      </section>

      {/* NEW SECTION: Real-time Jakarta Processing Stats */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="p-12 bg-slate-900 rounded-[4rem] text-white relative overflow-hidden">
              <div className="grid md:grid-cols-4 gap-8 text-center relative z-10">
                 {[
                   { label: "Corporate Permits", value: "1,200+", sub: "Monthly Volume" },
                   { label: "PMA Success", value: "100%", sub: "Regulatory Clean" },
                   { label: "Processing Speed", value: "48h", sub: "Executive Priority" },
                   { label: "Active Investors", value: "5,800+", sub: "Direct Sponsored" }
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <p className="text-[10px] font-black tracking-widest text-primary uppercase">{stat.label}</p>
                      <p className="text-4xl font-black tracking-tighter italic">{stat.value}</p>
                      <p className="text-[8px] opacity-40 uppercase tracking-widest">{stat.sub}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 8. Contact & Final CTA */}
      <LazySection minHeight="500px">
        <ContactSection dict={dict} />
      </LazySection>

    </main>
  );
}
