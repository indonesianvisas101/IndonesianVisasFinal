import React from "react";
import { Metadata } from "next";
import { getMessages } from "@/i18n/getMessages";
import dynamic from "next/dynamic";
import LazySection from "@/components/layout/LazySection";
import Hero from "@/components/hero/Hero";
import Link from "next/link";
import { 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  RefreshCcw,
  Clock, 
  ChevronRight, 
  Globe, 
  Shield, 
  Cpu, 
  FileText, 
  BarChart3, 
  ArrowRight,
  Plane,
  Smartphone,
  Anchor,
  HelpCircle,
  Building2,
  Users
} from "lucide-react";
import IDivCardModern from "@/components/idiv/IDivCardModern";

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${APP_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": "National Updates", "item": `${APP_URL}/${locale}/indonesian-visas-lates-updated` }
    ]
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* 1. Hero Section - Urgency & News Focus */}
      <Hero dict={dict} bgImage="/images/BaliHelpCompress.webp" />

      {/* Visual Breadcrumbs - SEO SCRUMB */}
      <div className="bg-slate-50 dark:bg-zinc-900/50 py-4 border-b border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <ArrowRight size={10} />
           <span className="text-slate-900 dark:text-white uppercase">Immigration Intel Hub</span>
        </div>
      </div>

      {/* 2. Regulatory Roadmap 2026-2027 */}
      <section className="py-24 bg-white dark:bg-black overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-16 items-start">
                 <div className="md:w-1/3 sticky top-32">
                    <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] mb-6 text-sm">
                       <Clock size={20} />
                       <span>Policy Evolution</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-8 uppercase italic">The <span className="text-primary">2027</span> <br/>Roadmap</h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                       Indonesia is transitioning towards a 100% digital-first immigration model. 
                       Stay ahead of the curve with our verified intelligence roadmap.
                    </p>
                 </div>
                 <div className="md:w-2/3 space-y-12">
                    {[
                      { 
                        period: "Q3 2026", 
                        title: "Full Biometric Integration", 
                        desc: "All visit visas (C1/D1) now require biometric enrollment at major entry points. Our Smart ID system bridges this gap for seamless transit.",
                        tag: "Infrastructure",
                        color: "bg-blue-500"
                      },
                      { 
                        period: "Q4 2026", 
                        title: "Investor KITAS E28A Overhaul", 
                        desc: "New minimum investment thresholds in line with BKPM 2027 targets. Mandatory NIB-Residency synchronization enforced.",
                        tag: "Corporate",
                        color: "bg-primary"
                      },
                      { 
                        period: "Q1 2027", 
                        title: "Remote Worker (E33G) Tax Residency", 
                        desc: "Automatic tax ID (NPWP) allocation for long-term nomads. Simplified tax-free income protocols for global tech specialists.",
                        tag: "Lifestyle",
                        color: "bg-accent"
                      },
                      { 
                        period: "Q2 2027", 
                        title: "Golden Visa (E33) Permanent Tier", 
                        desc: "Launch of the 10-year residency track for major shareholders and high-net-worth individuals.",
                        tag: "Residency",
                        color: "bg-amber-500"
                      }
                    ].map((step, idx) => (
                      <div key={idx} className="relative pl-12 group">
                         <div className={`absolute left-0 top-0 w-1 h-full bg-slate-100 dark:bg-white/10 rounded-full group-hover:bg-primary/30 transition-colors`} />
                         <div className={`absolute left-0 top-0 w-1 h-12 ${step.color} rounded-full`} />
                         <span className="text-xs font-black tracking-widest text-slate-400 mb-2 block uppercase">{step.period}</span>
                         <h3 className="text-2xl font-black mb-4 italic uppercase tracking-tight">{step.title}</h3>
                         <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{step.desc}</p>
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            <Zap size={10} className="text-primary" /> {step.tag}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2.5. NEW SECTION: 3D IDiv Intelligence Showcase */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[150px] rounded-full translate-x-1/2" />
          <div className="container mx-auto px-4 relative z-10">
              <div className="grid md:grid-cols-2 gap-20 items-center">
                  <div className="flex justify-center order-2 md:order-1">
                      <div className="relative">
                          <IDivCardModern mode="SMART" autoRotate={true} />
                          <div className="mt-12 flex flex-col items-center gap-4">
                              <Link href="/smart-id" className="px-12 py-5 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(124,58,237,0.4)] flex items-center gap-3 italic">
                                  ACTIVATE SMART ID <ArrowRight size={20} />
                              </Link>
                              <Link href="/id-guide" className="text-white/40 hover:text-white transition-colors text-sm font-bold underline underline-offset-8 decoration-primary/30 uppercase tracking-widest">
                                  Identity Technology Whitepaper
                              </Link>
                          </div>
                      </div>
                  </div>
                  <div className="order-1 md:order-2 space-y-10">
                      <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-black tracking-[0.2em] uppercase text-primary">
                          <Cpu size={12} /> The Digital Pivot
                      </div>
                      <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-none uppercase">THE <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">NEXT-GEN</span><br/>COMPLIANCE</h2>
                      <p className="text-xl text-slate-400 leading-relaxed font-medium">
                          In 2027, your passport is just the beginning. Our **Smart ID Ecosystem** synchronizes your <Link href="/visa-types/kitas-indonesia" className="text-white underline decoration-primary font-bold">KITAS data</Link> with local police (SKLD), 
                          civil registries (KTP-OA), and the biometric <Link href="/verification-explained" className="text-primary font-bold underline">Autogate network</Link>.
                      </p>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <Shield className="text-primary" size={32} />
                            <h4 className="font-black italic uppercase">Anti-Fraud</h4>
                            <p className="text-xs opacity-50">QR-Encrypted verification for all property and vehicle leases. <Link href="/visa-identity-security" className="text-white/40 underline">Read Security Specs</Link>.</p>
                         </div>
                         <div className="space-y-4">
                            <Globe className="text-accent" size={32} />
                            <h4 className="font-black italic uppercase">Global Sync</h4>
                            <p className="text-xs opacity-50">IATA-Compliant data for instant airline boarding clearance.</p>
                         </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 3. Deep Policy Intel: Omnibus & SE Tracker */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid md:grid-cols-2 gap-16">
              <div className="p-12 bg-slate-50 dark:bg-zinc-900/50 rounded-[4rem] border-l-8 border-primary relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <Building2 size={150} />
                 </div>
                 <h3 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">Corporate Synchronization (NIB/OSS)</h3>
                 <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Under the latest SE (Circular Letter) protocols, all <Link href="/visa-types/investor-visa-indonesia" className="text-primary font-bold underline">Investor Visas</Link> are now tied directly to active NIB statuses. 
                    We provide first-hand liaison with the Ministry of Investment to ensure your PT PMA and Residency are in 100% legal alignment.
                 </p>
                 <Link href="/company-formation" className="inline-flex items-center gap-2 font-black text-primary hover:gap-4 transition-all uppercase text-sm">
                    Check PT PMA Compliance <ArrowRight size={16} />
                 </Link>
              </div>
              <div className="p-12 bg-slate-50 dark:bg-zinc-900/50 rounded-[4rem] border-l-8 border-accent relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <Users size={150} />
                 </div>
                 <h3 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">Emergency Circular Letter (SE) Feed</h3>
                 <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    The Directorate General of Immigration often issues rapid-response SEs regarding calling visa countries and port-of-entry restrictions. 
                    Our intelligence unit monitors these feeds 24/7 to protect your <Link href="/vfs-global" className="text-accent font-bold underline">application timeline</Link>.
                 </p>
                 <Link href="/legal-experts" className="inline-flex items-center gap-2 font-black text-accent hover:gap-4 transition-all uppercase text-sm">
                    Consult Legal Intelligence <ArrowRight size={16} />
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Real-time Infrastructure Matrix */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/images/IndonesianVisas/BaliHelp.webp')] bg-cover opacity-5 pointer-events-none" />
         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
               <div className="max-w-2xl">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">GLOBAL SYSTEM <span className="text-primary">STATUS</span></h2>
                  <p className="text-xl text-slate-400 font-medium mt-4">Verified uptime and latency for national immigration infrastructure portals.</p>
               </div>
               <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  <span className="text-sm font-black uppercase tracking-widest italic">All Systems Operational</span>
               </div>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
               {[
                 { label: "eVisa National Portal", status: "Online", sub: "99.9% Uptime", icon: Globe },
                 { label: "Autogate Verification", status: "Active", sub: "1.2s Latency", icon: Cpu },
                 { label: "Smart ID Global Hub", status: "Operational", sub: "Priority Support", icon: Shield },
                 { label: "Circular Feed (SE)", status: "Updated", sub: "Real-time Sync", icon: FileText }
               ].map((item, i) => (
                 <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl group hover:border-primary transition-all">
                    <item.icon size={32} className="text-primary mb-6 group-hover:scale-110 transition-transform" />
                    <div className="text-3xl font-black tracking-tighter mb-1">{item.status}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">{item.label}</div>
                    <p className="text-xs opacity-50 font-medium italic">{item.sub}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* NEW SECTION 1: Official SE (Circular Letter) Intelligence Archive */}
      <section className="py-24 bg-slate-50 dark:bg-white/5 border-y border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tighter italic uppercase">LEGAL <span className="text-primary">ARCHIVE</span></h2>
              <p className="text-lg text-slate-500 font-medium">Tracking the most critical Circular Letters (SE) from the DG of Immigration. <Link href="/regulations" className="text-primary underline">Full Regulation Hub</Link>.</p>
           </div>
           <div className="space-y-4">
              {[
                { no: "SE/01/IMM/2027", title: "Biometric Autogate Mandate", impact: "Mandatory biometric enrollment for all e-VOA and C1 Visit Visa holders upon first entry." },
                { no: "SE/14/IMM/2026", title: "Smart ID Acceptance Framework", impact: "Official recognition of digital sponsor credentials for local identity verification at hotels and rentals." },
                { no: "SE/09/BKPM/2026", title: "KITAS-NIB Synchronization", impact: "Requirement for all Investor KITAS (E28A) to be linked with an active and verified NIB on the OSS portal." }
              ].map((doc, idx) => (
                <div key={idx} className="p-8 bg-white dark:bg-black rounded-3xl flex flex-col md:flex-row gap-6 items-center border border-slate-100 dark:border-white/10 group hover:border-primary transition-colors">
                   <div className="px-4 py-2 bg-primary/10 rounded-xl text-primary font-black text-xs tracking-widest shrink-0 uppercase">{doc.no}</div>
                   <div className="flex-1 text-center md:text-left">
                      <h4 className="text-xl font-bold mb-1 uppercase italic">{doc.title}</h4>
                      <p className="text-sm text-slate-400 font-medium">{doc.impact}</p>
                   </div>
                   <Link href="/legal" className="text-primary hover:underline font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                      View Full SE <FileText size={14} />
                   </Link>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* NEW SECTION 2: Visa-to-KITAS Transition Logic */}
      <section className="py-24 bg-white dark:bg-black overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex flex-col md:flex-row gap-20 items-center">
              <div className="flex-1 order-2 md:order-1">
                 <div className="relative p-12 bg-slate-900 rounded-[4rem] text-white overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                       <RefreshCcw size={150} className="animate-spin-slow" />
                    </div>
                    <h3 className="text-3xl font-black mb-8 italic uppercase tracking-tighter relative z-10">THE 2027 <br/>CONVERSION <span className="text-primary">LOGIC</span></h3>
                    <div className="space-y-8 relative z-10">
                       <div className="flex gap-6">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-black shrink-0 italic">01</div>
                          <div>
                             <h4 className="font-bold uppercase text-sm mb-1">C1 Entry Status</h4>
                             <p className="text-xs text-white/50">Enter with a 60-day visit visa to establish your local presence.</p>
                          </div>
                       </div>
                       <div className="flex gap-6">
                          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-black shrink-0 italic">02</div>
                          <div>
                             <h4 className="font-bold uppercase text-sm mb-1">Local Application</h4>
                             <p className="text-xs text-white/50">Apply for KITAS (Remote Worker or Investor) while still in Indonesia.</p>
                          </div>
                       </div>
                       <div className="flex gap-6">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-black shrink-0 italic">03</div>
                          <div>
                             <h4 className="font-bold uppercase text-sm mb-1">ITAS Issuance</h4>
                             <p className="text-xs text-white/50">Your passport is updated digitally—no visa run required.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                 <h2 className="text-5xl font-black tracking-tighter italic uppercase leading-none mb-8">NO MORE <br/><span className="text-primary">VISA RUNS</span></h2>
                 <p className="text-xl text-slate-500 font-medium leading-relaxed mb-8">
                    The 2027 immigration shift focuses on **Internal Transition**. If you enter on a <Link href="/visa-types/b211a-visa-indonesia" className="text-primary font-bold underline">C1/B211A Visa</Link>, our direct sponsorship allows you to convert to a long-term <Link href="/visa-types/kitas-indonesia" className="text-primary font-bold underline">KITAS residency</Link> without ever boarding an international flight.
                 </p>
                 <Link href="/extend" className="inline-flex items-center gap-2 font-black text-primary hover:gap-4 transition-all uppercase italic text-lg">
                    Check Transition Eligibility <ArrowRight size={20} />
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* NEW SECTION 3: National Anti-Fraud Compliance Checklist */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full translate-y-1/2" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
           <ShieldCheck className="mx-auto text-primary mb-8" size={64} />
           <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter italic uppercase">ANTI-FRAUD <span className="text-primary">COMPLIANCE</span></h2>
           <p className="text-xl text-slate-300 font-medium mb-12">Don't be a victim of broker scams. Verify every agent before you pay.</p>
           <div className="grid sm:grid-cols-3 gap-8 text-left">
              {[
                { title: "NIB Verification", desc: "Always ask for the agency's Business Identification Number (NIB) and verify it on the official OSS portal. Link to our Company Formation guide for NIB lookup support." },
                { title: "Direct Sponsor", desc: "Ensure your visa is sponsored by a corporate entity, not an individual. Check the AHU legalization." },
                { title: "Smart ID Receipt", desc: "Official applications through IndonesianVisas.com always issue an encrypted Smart ID for verification." }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 hover:border-primary transition-colors">
                   <CheckCircle2 className="text-primary mb-4" size={24} />
                   <h4 className="text-xl font-black mb-2 italic uppercase">{item.title}</h4>
                   <p className="text-xs opacity-60 leading-relaxed">{item.desc} <Link href="/company-formation" className="text-primary underline font-bold">Verify NIB Now</Link>.</p>
                </div>
              ))}
           </div>
           <div className="mt-16">
              <Link href="/legal-experts" className="text-primary font-black uppercase text-sm tracking-widest hover:underline decoration-primary underline-offset-8">
                 Consult with Our Verified Legal Experts
              </Link>
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
