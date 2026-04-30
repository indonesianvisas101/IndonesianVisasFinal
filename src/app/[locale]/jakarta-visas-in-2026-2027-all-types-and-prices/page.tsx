import React from "react";
import { Metadata } from "next";
import { getMessages } from "@/i18n/getMessages";
import dynamic from "next/dynamic";
import LazySection from "@/components/layout/LazySection";
import Hero from "@/components/hero/Hero";
import Link from "next/link";

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
      
      {/* SEO H1 — Primary Keyword Target */}
      <h1 className="sr-only">Jakarta Visa 2026-2027 — Business & Investor Immigration Hub | Direct Sponsor</h1>

      {/* 1. Hero Section - Corporate Focus */}
      <Hero dict={dict} />

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

      {/* 8. Contact & Final CTA */}
      <LazySection minHeight="500px">
        <ContactSection dict={dict} />
      </LazySection>

    </main>
  );
}
