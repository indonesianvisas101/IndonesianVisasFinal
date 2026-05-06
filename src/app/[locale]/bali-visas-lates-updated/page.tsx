import React from "react";
import { Metadata } from "next";
import { getMessages } from "@/i18n/getMessages";
import dynamic from "next/dynamic";
import LazySection from "@/components/layout/LazySection";
import Hero from "@/components/hero/Hero";
import Link from "next/link";
import { 
  MapPin, 
  PlaneLanding, 
  Smartphone, 
  Users, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  FileText, 
  Anchor, 
  ArrowRight,
  Plane,
  Building2,
  Globe,
  Camera,
  Map
} from "lucide-react";
import IDivCardModern from "@/components/idiv/IDivCardModern";

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${APP_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": "Bali Updates", "item": `${APP_URL}/${locale}/bali-visas-lates-updated` }
    ]
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#030712]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localNewsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* 1. Hero Section - Bali Local Context */}
      <Hero dict={dict} bgImage="/images/BaliHelpCompress.webp" />

      {/* Visual Breadcrumbs - SEO SCRUMB */}
      <div className="bg-slate-50 dark:bg-zinc-900/50 py-4 border-b border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <ArrowRight size={10} />
           <span className="text-slate-900 dark:text-white uppercase tracking-tighter">Bali News Hub</span>
        </div>
      </div>

      {/* 2. Bali Tourism Roadmap 2026-2027 */}
      <section className="py-24 bg-white dark:bg-black overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-20 items-center">
                 <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 rounded-full text-[10px] font-black tracking-widest text-primary uppercase mb-6">
                       <Clock size={12} /> Bali Policy Evolution
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-none mb-8 uppercase">ISLAND <br/><span className="text-primary">INTELLIGENCE</span></h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
                       Bali is evolving into a high-tech residency hub. From <Link href="/visa-types/visa-on-arrival-bali" className="text-primary font-bold underline">e-VOA Autogates</Link> to Smart ID verification, we track the shifts that matter to your lifestyle. <Link href="/point-of-entry-evoa" className="text-slate-400 underline italic text-sm">See Port of Entry List</Link>.
                    </p>
                    <div className="space-y-6">
                       {[
                         { title: "DPS Autogate 2.0", desc: "Biometric gates now process all C1 and D1 visas at Ngurah Rai.", icon: PlaneLanding },
                         { title: "Nomad (E33G) Status", desc: "Simplified offshore application for remote workers in Canggu/Ubud.", icon: Smartphone },
                         { title: "Village Security Sync", desc: "Digital reporting system integrated with local Pecalang security.", icon: ShieldCheck }
                       ].map((item, i) => (
                         <div key={i} className="flex gap-4 group">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                               <item.icon size={24} />
                            </div>
                            <div>
                               <h4 className="font-black italic uppercase text-sm tracking-tight">{item.title}</h4>
                               <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="p-12 bg-slate-950 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                       <Map size={150} />
                    </div>
                    <h3 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">Current Bali Alert Feed</h3>
                    <div className="space-y-8 relative z-10">
                       <div className="p-6 bg-white/5 rounded-3xl border-l-4 border-primary">
                          <span className="text-[10px] font-black uppercase text-primary tracking-widest block mb-2">Immigration Alert</span>
                          <p className="text-sm font-medium leading-relaxed">
                             Strict enforcement of **Direct Sponsorship** rules in the Canggu district. Agencies using second-tier sponsors are under review.
                          </p>
                       </div>
                       <div className="p-6 bg-white/5 rounded-3xl border-l-4 border-accent">
                          <span className="text-[10px] font-black uppercase text-accent tracking-widest block mb-2">Transport News</span>
                          <p className="text-sm font-medium leading-relaxed">
                             New electronic verification for long-term bike rentals in South Bali now requires your <Link href="/smart-id" className="text-accent underline font-bold">Smart ID</Link> for instant police compliance.
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2.5. NEW SECTION: 3D IDiv Bali Lifestyle Showcase */}
      <section className="py-32 bg-slate-50 dark:bg-zinc-900/30 relative overflow-hidden">
          <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-20 items-center">
                  <div className="flex justify-center">
                      <div className="relative">
                          <IDivCardModern mode="SMART" autoRotate={true} />
                          <div className="mt-12 flex flex-col items-center gap-4">
                              <Link href="/smart-id" className="px-12 py-5 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(124,58,237,0.4)] flex items-center gap-3 uppercase italic">
                                  UPGRADE TO BALI SMART ID <ArrowRight size={20} />
                              </Link>
                              <Link href="/id-card-for-foreigner-in-bali" className="text-slate-400 hover:text-primary transition-colors text-sm font-bold underline underline-offset-8 decoration-primary/30 uppercase tracking-widest">
                                  Bali ID Legal Framework
                              </Link>
                          </div>
                      </div>
                  </div>
                  <div className="space-y-10">
                      <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-primary">
                          <Camera size={12} /> Digital Island Life
                      </div>
                      <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-none uppercase">THE <span className="text-primary">ULTIMATE</span><br/>BALI ACCESS</h2>
                      <p className="text-xl text-slate-500 leading-relaxed font-medium">
                          Leave your passport at your villa. Our **Smart ID** is the recognized digital identity for the modern Bali expat. Used by hotels, local authorities, and premium rental services.
                      </p>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <Anchor className="text-primary" size={32} />
                            <h4 className="font-black italic uppercase">Canggu Ready</h4>
                            <p className="text-xs text-slate-400">Instant verification for gym memberships and coworking hubs.</p>
                         </div>
                         <div className="space-y-4">
                            <ShieldCheck className="text-accent" size={32} />
                            <h4 className="font-black italic uppercase">Police Verified</h4>
                            <p className="text-xs text-slate-400">Direct liaison with Bali regional police for document security.</p>
                         </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 3. Bali Infrastructure & Processing Tracker */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="p-12 bg-slate-900 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full translate-x-1/2" />
              <div className="grid md:grid-cols-4 gap-8 text-center relative z-10">
                 {[
                   { label: "Bali Arrivals Weekly", value: "2,800+", sub: "Ngurah Rai Priority" },
                   { label: "Nomad KITAS Issue", value: "650+", sub: "E33G Specialty" },
                   { label: "VOA Ext. Success", value: "99.9%", sub: "Zero Broker Fee" },
                   { label: "Active Bali IDs", value: "12,000+", sub: "Community Trust" }
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

      {/* NEW SECTION 1: Bali Banjar & Pecalang Digital Integration */}
      <section className="py-24 bg-slate-50 dark:bg-white/5 border-y border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1 bg-white dark:bg-black p-12 rounded-[4rem] shadow-xl border border-slate-100 dark:border-white/10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={150} />
                 </div>
                 <h3 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">BANJAR <span className="text-primary">SYNC</span></h3>
                 <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Under the 2027 Bali Provincial protocols, all long-term expats are required to report to their local **Banjar** (village office). Our <Link href="/smart-id" className="text-primary font-bold underline">Smart ID</Link> integrates your <Link href="/id-card-for-foreigner-in-bali" className="text-primary font-bold underline">Bali Identity</Link> directly with the village security database, ensuring a respectful and legal stay in your local community. <Link href="/id-card-for-foreigner-in-indonesia" className="text-primary underline">National ID Guide</Link>.
                 </p>
                 <Link href="/help" className="inline-flex items-center gap-2 font-black text-primary hover:gap-4 transition-all uppercase text-sm">
                    How to Report to Banjar <ArrowRight size={16} />
                 </Link>
              </div>
              <div className="flex-1">
                 <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none mb-8">LOCAL SECURITY <br/><span className="text-primary">ECOSYSTEM</span></h2>
                 <p className="text-xl text-slate-500 font-medium leading-relaxed mb-6">
                    Stay safe with the **Pecalang** (Traditional Security). Our sponsorship includes direct liaison with regional security hubs to protect your residency status.
                 </p>
                 <ul className="space-y-4">
                    <li className="flex items-center gap-3 font-bold text-sm">
                       <CheckCircle2 className="text-primary" size={18} /> Verified Village Domicile Letters
                    </li>
                    <li className="flex items-center gap-3 font-bold text-sm">
                       <CheckCircle2 className="text-primary" size={18} /> Digital Police Report (STM) Integration
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      </section>

      {/* NEW SECTION 2: Canggu vs. Ubud Nomad Strategy */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="text-center mb-16">
              <h2 className="text-5xl font-black tracking-tighter italic uppercase">NOMAD <span className="text-primary">STRATEGY</span></h2>
              <p className="text-xl text-slate-500 font-medium italic">Choosing the right visa for your Bali base.</p>
           </div>
           <div className="grid md:grid-cols-2 gap-12">
              <div className="p-10 bg-slate-50 dark:bg-zinc-900/50 rounded-[3.5rem] border-t-8 border-primary">
                 <h4 className="text-2xl font-black mb-4 italic uppercase">Canggu & Uluwatu</h4>
                 <p className="text-sm text-slate-400 mb-6 font-medium">Fast-paced, lifestyle-heavy areas requiring multi-year stability for property leases. <Link href="/general-information-visa-indonesia" className="text-primary font-bold underline">Area General Info</Link>.</p>
                 <div className="p-6 bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 italic">Recommended Visa:</p>
                    <Link href="/visa-types/kitas-indonesia" className="text-lg font-black hover:underline">E33G Remote Worker KITAS</Link>
                 </div>
              </div>
              <div className="p-10 bg-slate-50 dark:bg-zinc-900/50 rounded-[3.5rem] border-t-8 border-accent">
                 <h4 className="text-2xl font-black mb-4 italic uppercase">Ubud & North Bali</h4>
                 <p className="text-sm text-slate-400 mb-6 font-medium">Wellness and culture hubs where long-term visit visas (C1) are the standard for flexibility.</p>
                 <div className="p-6 bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2 italic">Recommended Visa:</p>
                    <Link href="/visa-types/b211a-visa-indonesia" className="text-lg font-black hover:underline">C1 Tourist (180 Days)</Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* NEW SECTION 3: Bali Medical & Insurance Mandate 2027 */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
           <Anchor className="mx-auto text-primary mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter italic uppercase underline decoration-primary underline-offset-8">MEDICAL <span className="text-primary">MANDATE</span></h2>
           <p className="text-xl text-slate-300 font-medium mb-12">New 2027 health insurance requirements for all long-term residents in Bali. <Link href="/legal" className="text-primary underline font-black">Official Legal Feed</Link>.</p>
           <div className="p-12 bg-white/5 backdrop-blur-xl rounded-[4rem] border border-white/10 text-left">
              <h4 className="text-2xl font-black mb-6 italic uppercase tracking-tight">Compliance Update:</h4>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                 Bali has implemented a provincial decree requiring all KITAS holders to possess health insurance with local hospital network coverage (Canggu/Ubud). Our **Smart ID** holders get direct access to our <Link href="/legal-experts" className="text-primary font-bold underline">Insurance Compliance Desk</Link> to ensure your residency remains valid under this new mandate.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                 <div className="flex gap-4 items-start">
                    <CheckCircle2 className="text-primary shrink-0" size={20} />
                    <p className="text-sm font-medium">BIMC & Siloam Hospital Network Support</p>
                 </div>
                 <div className="flex gap-4 items-start">
                    <CheckCircle2 className="text-primary shrink-0" size={20} />
                    <p className="text-sm font-medium">Automatic Insurance-Visa Synchronization</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

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


