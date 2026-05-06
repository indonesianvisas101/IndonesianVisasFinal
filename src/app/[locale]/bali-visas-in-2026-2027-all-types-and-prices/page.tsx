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
  Smartphone,
  Anchor
} from "lucide-react";
import IDivCardModern from "@/components/idiv/IDivCardModern";

const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview"));
const FAQPreview = dynamic(() => import("@/components/sections/FAQPreview"));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"));
const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
  
  return {
    title: "Bali Visas 2026-2027 | Comprehensive Guide & Direct Sponsor in Bali",
    description: "The ultimate guide for Bali Visas in 2026-2027. Special focus on B1 VOA, E33G Nomad Visa, and KITAS for Bali expats. Direct sponsorship by PT Indonesian Visas Agency (Bali HQ).",
    keywords: ["bali visa 2026", "bali nomad visa 2027", "bali visa price", "bali help visas", "indonesia visa bali guide"],
    alternates: {
      canonical: `${APP_URL}/${locale}/bali-visas-in-2026-2027-all-types-and-prices`,
    },
    openGraph: {
      title: "Bali Visa Guide 2026-2027 | Official Prices",
      description: "Plan your Bali journey with the most accurate 2026-2027 visa information. Verified prices, requirements, and Smart ID technology.",
      images: ['/images/BaliHelpCompress.webp'],
    },
    robots: "index, follow, max-image-preview:large"
  };
}

export default async function BaliGuide2026({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getMessages(locale);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

  const baliLocalSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${APP_URL}/bali-visas-in-2026-2027-all-types-and-prices/#local-business`,
    "name": "Bali Visa Agency — Official Division of PT Indonesian Visas Agency",
    "url": `${APP_URL}/${locale}/bali-visas-in-2026-2027-all-types-and-prices`,
    "description": "The trusted Bali division for visa services including B1 VOA, C1 Tourist Visa, E33G Digital Nomad KITAS, and Investor KITAS. First-hand direct legal sponsor based in Bali — zero intermediaries.",
    "telephone": "+62-857-2704-1992",
    "email": "contact@indonesianvisas.agency",
    "areaServed": ["Bali", "Uluwatu", "Canggu", "Ubud", "Seminyak", "Denpasar", "Sanur", "Nusa Dua"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Tibungsari No.11C, Padangsambian Kaja",
      "addressLocality": "Denpasar Barat, Denpasar",
      "addressRegion": "Bali",
      "postalCode": "80117",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -8.6441,
      "longitude": 115.1789
    },
    "parentOrganization": {
      "@type": "Corporation",
      "@id": `${APP_URL}/#organization`,
      "name": "PT Indonesian Visas Agency",
      "taxID": "0100000008117681"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Bali Visa Services 2026-2027",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "B1 VOA (Visa on Arrival) Extension — 30 to 60 Days in Bali" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "C1 Tourist Visa Bali — 60 to 180 Days" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E33G Remote Worker / Digital Nomad KITAS Bali — 1 Year" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E28A Investor KITAS Bali — 1 and 2 Years" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "D1 Multiple Entry Visit Visa — 1, 2, and 5 Years" } }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "200",
      "bestRating": "5"
    },
    "sameAs": [
      "https://balivisa.agency",
      `${APP_URL}`,
      "https://maps.app.goo.gl/p6t9JSd5CGCDf7jZA"
    ]
  };

  const baliFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I get a visa for Bali in 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can get a Bali visa through IndonesianVisas.com. Options include B1 Visa on Arrival (30-60 days), C1 Tourist Visa (60-180 days), and E33G Digital Nomad KITAS (1 year). We are a first-hand direct legal sponsor based in Bali — no intermediaries."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best visa for digital nomads in Bali?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The E33G Remote Worker KITAS is the best visa for digital nomads in Bali. It provides 1-year residency, legal work authorization, and access to our Smart ID ecosystem for seamless verification at hotels, coworking spaces, and vehicle rentals across Bali."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a Bali visa cost in 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bali visa costs vary by type: B1 VOA extension starts from IDR 500,000, C1 Tourist Visa from IDR 3,500,000, and E33G Nomad KITAS from IDR 15,000,000. Contact our Bali office for the latest official rates with zero agency markup."
        }
      },
      {
        "@type": "Question",
        "name": "Can I extend my visa in Bali?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! B1 VOA can be extended once for an additional 30 days directly in Bali. C1 Tourist Visa can be extended up to 180 days. Our Bali office handles all extensions with direct immigration liaison — no brokers involved."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${APP_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": "Bali Guide 2026", "item": `${APP_URL}/${locale}/bali-visas-in-2026-2027-all-types-and-prices` }
    ]
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#030712]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(baliLocalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(baliFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* SEO H1 — Primary Keyword Target */}
      <h1 className="sr-only">Bali Visa 2026-2027 — Trusted Guide, All Types & Prices | Direct Sponsor in Bali</h1>

      {/* 1. Hero Section - Bali Paradise Focus */}
      <Hero dict={dict} bgImage="/images/BaliHelpCompress.webp" />

      {/* Visual Breadcrumbs - SEO SCRUMB */}
      <div className="bg-slate-50 dark:bg-zinc-900/50 py-4 border-b border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <ArrowRight size={10} />
           <span className="text-slate-900 dark:text-white">Bali Guide 2026</span>
        </div>
      </div>

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

      {/* NEW SECTION: 3D IDiv Premium Showcase */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full translate-x-1/2" />
          <div className="container mx-auto px-4 relative z-10">
              <div className="grid md:grid-cols-2 gap-20 items-center">
                  <div className="order-2 md:order-1 flex justify-center">
                      <div className="relative">
                          <IDivCardModern mode="SMART" autoRotate={true} />
                          <div className="mt-12 flex flex-col items-center gap-4">
                              <Link href="/smart-id" className="px-10 py-5 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(124,58,237,0.4)] flex items-center gap-3">
                                  UPGRADE TO SMART ID <ArrowRight size={20} />
                              </Link>
                              <Link href="/why-travelers-need-a-sponsor-id" className="text-white/40 hover:text-white transition-colors text-sm font-bold underline underline-offset-8 decoration-primary/30">
                                  Bali Sponsor Verification Guide
                              </Link>
                          </div>
                      </div>
                  </div>
                  <div className="order-1 md:order-2 space-y-8">
                      <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-black tracking-[0.2em] uppercase">
                          <Smartphone size={12} className="text-primary" /> Integrated Bali Lifestyle
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-none">DIGITAL <br/><span className="text-primary">BALI IDENTITY</span></h2>
                      <p className="text-xl text-slate-400 leading-relaxed font-medium">
                          Leave your passport in the villa safe. Our **Smart ID** is recognized by local authorities, hotels, and rentals across the island. 
                          It's the ultimate tool for the modern Bali expat.
                      </p>
                      <ul className="space-y-4">
                         <li className="flex items-center gap-3 font-bold text-slate-200">
                            <FileCheck className="text-primary" size={20} />
                            <span>Instant Hotel & Villa Check-in</span>
                         </li>
                         <li className="flex items-center gap-3 font-bold text-slate-200">
                            <FileCheck className="text-primary" size={20} />
                            <span>Legal Bike & Car Rental Verification</span>
                         </li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      {/* NEW SECTION: Ngurah Rai (DPS) Fast-Track Protocols */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1">
                 <div className="flex items-center gap-4 mb-6">
                    <Plane className="text-primary" size={40} />
                    <h2 className="text-4xl font-black tracking-tighter italic">DPS FAST-TRACK 2027</h2>
                 </div>
                 <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-8">
                    Skip the 2-hour immigration queues at Ngurah Rai. Our **Bali Priority Entry** system integrates your <Link href="/visa-types/visa-on-arrival-bali" className="text-primary font-bold underline">e-VOA</Link> or C1 Visa directly with the biometric gates. 
                    Arrival is no longer a hurdle, it's a seamless transition to paradise.
                 </p>
                 <Link href="/fast-approval" className="inline-flex items-center gap-2 font-black text-primary hover:gap-4 transition-all uppercase italic text-lg">
                    Check Bali Arrival Clearance <ArrowRight size={20} />
                 </Link>
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-white/5 p-12 rounded-[4rem] border-l-8 border-primary">
                 <h4 className="font-black text-2xl mb-6 italic uppercase">Bali Entry Advantage:</h4>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 font-black italic">A</div>
                       <p className="text-sm font-medium">Pre-cleared status for <Link href="/visa-indonesia-for-australians" className="text-primary font-bold">Australian</Link> & <Link href="/visa-indonesia-for-americans" className="text-primary font-bold">US</Link> nationals.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 font-black italic">B</div>
                       <p className="text-sm font-medium">Direct liaison with Denpasar Immigration HQ.</p>
                    </div>
                 </div>
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

      {/* NEW SECTION: Nomad Lifestyle Compliance */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('/images/IndonesianVisas/BaliHelp.webp')] bg-cover bg-fixed" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
           <Anchor className="mx-auto text-primary mb-8" size={64} />
           <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter italic">NOMAD <span className="text-primary">STABILITY</span></h2>
           <p className="text-2xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl mx-auto">
              Canggu, Ubud, or Uluwatu? Wherever you base yourself, our <Link href="/visa-types/kitas-indonesia" className="text-white underline font-bold">E33G Remote Worker KITAS</Link> ensures you are legally tax-compliant and 100% authorized to work for your overseas company.
           </p>
           <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
                 <h4 className="text-xl font-black mb-4 italic">Coworking Access</h4>
                 <p className="text-sm opacity-60">Verified identity for seamless membership at Bali's top coworking hubs.</p>
              </div>
              <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
                 <h4 className="text-xl font-black mb-4 italic">Local Residency</h4>
                 <p className="text-sm opacity-60">Open local bank accounts and secure long-term villa leases with ease.</p>
              </div>
           </div>
        </div>
      </section>

      {/* NEW SECTION: Real-time Bali Processing Tracker */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="p-12 bg-primary/5 rounded-[4rem] border-2 border-primary/10">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                 {[
                   { label: "Bali Arrivals Weekly", value: "2,400+", sub: "Ngurah Rai Priority" },
                   { label: "Nomad KITAS Issued", value: "450+", sub: "E33G Specialist" },
                   { label: "Avg. VOA Extension", value: "24h", sub: "Fast-Track Service" },
                   { label: "Bali Success Rate", value: "99.8%", sub: "Direct Sponsorship" }
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <p className="text-[10px] font-black tracking-widest text-primary uppercase">{stat.label}</p>
                      <p className="text-4xl font-black tracking-tighter italic text-slate-900 dark:text-white">{stat.value}</p>
                      <p className="text-[8px] opacity-40 uppercase tracking-widest">{stat.sub}</p>
                   </div>
                 ))}
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
