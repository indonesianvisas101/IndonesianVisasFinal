import React from "react";
import { Metadata } from "next";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Link from "next/link";
import IDivCardModern from "@/components/idiv/IDivCardModern";
import { 
  ShieldCheck, 
  Plane, 
  Users, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Globe, 
  TrendingUp, 
  Lock, 
  BadgeCheck, 
  Info,
  Calendar,
  Shield
} from "lucide-react";
import dynamic from "next/dynamic";

const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview"));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
  
  return {
    title: "Why B211A & C1 Visa is Most Popular | Official Indonesia Guide",
    description: "Discover why the C1 (B211A) Visa is the preferred choice for 2026-2027. Avoid VOA airline issues, secure direct sponsorship, and enjoy 60-180 days of legal stay.",
    keywords: ["b211a visa indonesia", "c1 visa indonesia", "most popular indonesia visa", "bali visa sponsor", "indonesia immigration updates", "voa vs b211a"],
    alternates: {
      canonical: `${APP_URL}/${locale}/why-b211a-or-c1-visa-is-the-most-popular-visa`,
    },
    openGraph: {
      title: "C1 Visa: The Gold Standard for Indonesian Travel 2026-2027",
      description: "Comprehensive guide on why C1 (formerly B211A) is the most secure visa for Indonesia.",
      images: [`${APP_URL}/images/BaliHelpCompress.webp`],
    }
  };
}

export default async function PopularVisaGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Why B211A and C1 Visas Dominate Indonesian Immigration in 2026-2027",
    "description": "An in-depth analysis of the C1 Visa (formerly B211A), explaining its popularity, sponsorship benefits, and how it bypasses common Visa on Arrival (VOA) issues.",
    "author": { "@type": "Organization", "name": "PT Indonesian Visas Agency" },
    "publisher": { "@type": "Organization", "name": "PT Indonesian Visas Agency" },
    "image": `${APP_URL}/images/BaliHelpCompress.webp`,
    "datePublished": "2026-05-04",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${APP_URL}/${locale}/why-b211a-or-c1-visa-is-the-most-popular-visa`
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-slate-900 text-white min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0 opacity-30">
            <img src="/images/BaliHelpCompress.webp" alt="Bali Indonesia" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/30 border border-primary/50 text-white text-sm font-black mb-10 animate-pulse uppercase tracking-[0.2em]">
                <TrendingUp size={16} />
                The 2026-2027 Immigration Leader
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.9] italic">
                DOMINANCE OF <span className="text-primary drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">C1 VISA</span>
            </h1>
            <p className="text-xl md:text-3xl text-slate-200 mb-14 font-medium leading-relaxed max-w-4xl mx-auto">
                Why <span className="text-white font-bold underline decoration-primary underline-offset-4">94% of Digital Nomads</span> choose C1 over the unstable Visa on Arrival.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
                <Link href="/services/C1" className="px-12 py-6 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all flex items-center gap-3 text-xl shadow-[0_20px_50px_rgba(124,58,237,0.4)] border border-white/20">
                    APPLY FOR C1 VISA <ArrowRight size={24} />
                </Link>
                <Link href="/indonesian-visas-in-2026-2027-all-types-and-prices" className="px-12 py-6 bg-white/10 backdrop-blur-xl text-white font-black rounded-2xl hover:bg-white/20 transition-all text-xl border border-white/20 shadow-2xl">
                    2027 PRICE GUIDE
                </Link>
            </div>
        </div>
      </section>

      {/* 2. Executive Summary */}
      <SectionWrapper>
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
                <h2 className="text-5xl font-black mb-8 tracking-tighter text-slate-950 dark:text-white uppercase">The Strategic Choice</h2>
                <div className="space-y-6 text-2xl text-slate-900 dark:text-white font-black leading-loose">
                    <p>
                        In 2026-2027, the <Link href="/services/C1" className="text-primary font-black hover:underline">C1 Visitor Visa</Link> (formerly B211A) is the definitive "Gold Standard." 
                        It provides a level of security that standard entry permits cannot match.
                    </p>
                    <p>
                        The C1 Visa eliminates friction by providing a pre-cleared, sponsored entry permit that protects you from airline check-in holds.
                    </p>
                </div>
            </div>
            <div className="order-1 md:order-2 bg-slate-900 p-12 rounded-[4rem] border-4 border-primary shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-primary rounded-2xl text-white shadow-lg shadow-primary/40">
                        <Lock size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-white italic tracking-tight">Security First</h3>
                </div>
                <ul className="space-y-6">
                    {[
                        "Pre-approved by Jakarta Central",
                        "Direct Corporate Sponsorship",
                        "Bypasses Airline Check-in Holds",
                        "Extendable up to 180 Days Stay"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 font-bold text-white text-lg">
                            <CheckCircle2 size={24} className="text-primary" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </SectionWrapper>

      {/* 3. C1 Visa Deep-Dive (Technical) */}
      <section className="py-24 bg-slate-100 dark:bg-white/5 border-y border-slate-200 dark:border-white/10">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-black mb-4 tracking-tighter text-slate-950 dark:text-white uppercase italic">Technical Specification</h2>
                <div className="w-32 h-2 bg-primary mx-auto rounded-full mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Official 2027 Database Values</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
                {[
                    { label: "Visa Code", value: "C1 (Visitor)", sub: "Formerly B211A", icon: <FileText size={32} /> },
                    { label: "Initial Stay", value: "60 Days", sub: "Fully Pre-Paid", icon: <Calendar size={32} /> },
                    { label: "Maximum Stay", value: "180 Days", sub: "Via Extensions", icon: <BadgeCheck size={32} /> },
                    { label: "Processing", value: "3-5 Days", sub: "Express Available", icon: <Zap size={32} /> },
                ].map((spec, i) => (
                    <div key={i} className="p-10 bg-white dark:bg-black rounded-[3rem] shadow-xl border-b-8 border-primary group hover:-translate-y-2 transition-all duration-500 text-center">
                        <div className="w-16 h-16 bg-slate-950 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary transition-colors">
                            {spec.icon}
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{spec.label}</p>
                        <p className="text-3xl font-black text-slate-950 dark:text-white mb-2">{spec.value}</p>
                        <p className="text-sm text-primary font-black italic">{spec.sub}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 4. The Airline Bypass Advantage */}
      <SectionWrapper>
        <div className="bg-amber-100 dark:bg-amber-900/20 p-12 md:p-20 rounded-[4rem] border-4 border-amber-400 dark:border-amber-500/30 relative overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-3 gap-16 items-center relative z-10">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-6 mb-10">
                        <div className="p-5 bg-amber-500 text-white rounded-[2rem] shadow-xl shadow-amber-500/40">
                            <Plane size={56} className="animate-pulse" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-amber-950 dark:text-amber-100 leading-none">THE AIRLINE <br/>BYPASS</h2>
                    </div>
                    <p className="text-2xl text-amber-950/90 dark:text-amber-200/90 leading-loose font-bold mb-10 max-w-3xl">
                        Airlines use IATA databases to verify entry. If you are not on the VOA list, you <span className="bg-amber-500 text-white px-2 italic">WILL</span> be blocked at check-in.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="p-8 bg-white/60 dark:bg-black/40 rounded-3xl border-2 border-amber-300">
                            <h4 className="font-black text-amber-950 dark:text-amber-100 mb-4 text-xl flex items-center gap-2">
                                <AlertCircle className="text-red-600" /> VOA RISK
                            </h4>
                            <p className="text-slate-700 dark:text-slate-300 font-medium">Unpredictable. High failure rate for non-registered nationalities.</p>
                        </div>
                        <div className="p-8 bg-slate-950 text-white rounded-3xl shadow-2xl border-2 border-primary group/card">
                            <h4 className="font-black mb-4 text-xl text-primary flex items-center gap-2">
                                <ShieldCheck /> C1 SECURITY
                            </h4>
                            <p className="opacity-80 font-medium mb-6">Jakarta Pre-approved. Airline sees active entry permit in the system.</p>
                            <Link href="/services/C1" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-black text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                                Apply for C1 Now <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-white dark:bg-black p-10 rounded-[3rem] shadow-2xl border-b-8 border-amber-500 text-center">
                        <p className="text-6xl font-black text-amber-600 mb-2">99%</p>
                        <p className="text-sm font-black text-slate-500 uppercase tracking-widest italic">Boarding Success</p>
                    </div>
                    <Link href="/calling-visa" className="p-8 bg-red-600 text-white rounded-[2.5rem] font-black text-2xl text-center hover:bg-red-700 hover:scale-105 transition-all shadow-[0_20px_40px_rgba(220,38,38,0.3)] flex items-center justify-center gap-3 italic">
                        CALLING VISA <ArrowRight />
                    </Link>
                </div>
            </div>
        </div>
      </SectionWrapper>

      {/* 5. Sponsorship Power */}
      <SectionWrapper>
        <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-sm mb-8">
                <Users size={20} />
                WHY DIRECT SPONSORSHIP MATTERS
            </div>
            <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter text-slate-950 dark:text-white leading-[0.9] italic">
                LEGAL ANCHOR: <br/><span className="text-primary uppercase">Indonesian Visas Agency</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-10 text-left">
                <div className="p-12 bg-slate-950 text-white rounded-[4rem] relative overflow-hidden group shadow-2xl border-l-8 border-primary">
                    <h3 className="text-3xl font-black mb-6 relative z-10 italic">Corporate Bonding</h3>
                    <p className="text-slate-300 relative z-10 text-lg leading-relaxed font-medium mb-10">
                        We do not use "brokers". We provide *Direct Company Sponsorship* as a registered agent with guarantees and agreements.
                    </p>
                    <Link href="/id-indonesian-visas" className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-transform relative z-10 shadow-lg">
                        VERIFY LEGALITY <ArrowRight size={20} />
                    </Link>
                </div>
                <div className="p-12 bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-[4rem] shadow-xl">
                    <h3 className="text-3xl font-black mb-6 text-slate-950 dark:text-white italic">Regulatory Compliance</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium mb-10">
                        Integrated into the <Link href="/regulations/indonesia-visa-regulations" className="text-primary font-bold hover:underline">Omnibus Law</Link>. Every stay is tracked and protected.
                    </p>
                    <Link href="/why-travelers-need-a-sponsor-id" className="text-primary font-black text-xl flex items-center gap-3 hover:translate-x-4 transition-transform italic underline decoration-primary underline-offset-8">
                        WHY YOU NEED US <ArrowRight size={24} />
                    </Link>
                </div>
            </div>
        </div>
      </SectionWrapper>

      {/* 6. Interactive Comparison Chart */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-5xl md:text-8xl font-black mb-16 text-center tracking-tighter italic">VOA <span className="text-red-600">VS</span> C1 GUIDE</h2>
            <div className="max-w-5xl mx-auto overflow-hidden rounded-[3rem] border-2 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="p-8 font-black uppercase text-xs tracking-[0.3em] text-slate-500">Feature</th>
                            <th className="p-8 font-black uppercase text-xs tracking-[0.3em] text-red-500 bg-red-500/10">Visa on Arrival</th>
                            <th className="p-8 font-black uppercase text-xs tracking-[0.3em] text-primary bg-primary/10">C1 Visitor Visa</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-bold text-lg">
                        {[
                            { f: "Initial Stay", v: "30 Days", c: "60 Days" },
                            { f: "Max Potential", v: "60 Days", c: "180 Days" },
                            { f: "Jakarta Approval", v: "None", c: "Mandatory" },
                            { f: "Airline Safety", v: "Medium/Low", c: "Maximum" },
                            { f: "Agent Support", v: "Zero", c: "24/7 Priority" },
                            { f: "Usage Type", v: "Tourism Only", c: "Tourism & Business" }
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                <td className="p-8 text-slate-400 group-hover:text-white transition-colors uppercase italic text-sm">{row.f}</td>
                                <td className="p-8 text-slate-200">{row.v}</td>
                                <td className="p-8 text-primary italic font-black">{row.c}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </section>

      {/* 7. The VOA Risk Matrix */}
      <SectionWrapper>
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
                <div className="bg-red-50 dark:bg-red-900/10 p-12 rounded-[3.5rem] border-4 border-red-500 shadow-2xl relative">
                    <div className="absolute -top-6 -left-6 bg-red-600 text-white p-4 rounded-2xl font-black animate-bounce shadow-xl">
                        WARNING
                    </div>
                    <h3 className="text-3xl font-black mb-6 text-red-950 dark:text-red-100 uppercase italic">Are You in the Risk Zone?</h3>
                    <p className="text-xl text-red-900/80 dark:text-red-200/80 mb-8 font-bold leading-relaxed">
                        If your country is not on the <Link href="/list-country" className="text-red-600 underline font-black">Official VOA List</Link>, do NOT fly without a C1 Visa.
                    </p>
                    <div className="p-6 bg-white dark:bg-black/40 rounded-2xl border-2 border-red-200 text-red-600 font-black flex gap-4 items-center shadow-lg">
                        <AlertCircle size={32} />
                        Airline refusal is common for non-reg countries.
                    </div>
                </div>
            </div>
            <div className="order-1 md:order-2">
                <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-slate-950 dark:text-white italic leading-tight">THE UNIVERSAL <br/>PASS</h2>
                <p className="text-2xl text-slate-600 dark:text-slate-400 leading-loose font-medium">
                    The C1 Visa is the only "Universal Entry" permit. It provides guaranteed system visibility for 190+ countries.
                </p>
            </div>
        </div>
      </SectionWrapper>

      {/* 8. Sponsor ID Integration - HIGH CONTRAST FIX */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
            <img src="/images/BaliHelpCompress.webp" alt="Bali" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter italic leading-none">DIGITAL <br/><span className="text-primary drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]">SPONSOR ID</span></h2>
                    <div className="space-y-8 text-2xl text-white leading-relaxed font-bold mb-12">
                        <p>
                            When we sponsor your C1 Visa, we issue a <Link href="/idiv-hub/idiv" className="text-primary underline underline-offset-4 decoration-2">Digital Sponsor ID</Link>.
                        </p>
                        <p className="text-slate-300">
                            This ID is verifiable by any authority in Indonesia, proving PT Indonesian Visas Agency is legally accountable for your stay.
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <div className="bg-white/10 p-8 rounded-[2rem] border-2 border-primary/50 shadow-2xl backdrop-blur-md">
                            <p className="text-4xl font-black mb-1 text-primary">IDIV</p>
                            <p className="text-xs uppercase font-black tracking-widest opacity-60">Verified Identity</p>
                        </div>
                        <div className="bg-white/10 p-8 rounded-[2rem] border-2 border-primary/50 shadow-2xl backdrop-blur-md">
                            <p className="text-4xl font-black mb-1 text-primary">QR</p>
                            <p className="text-xs uppercase font-black tracking-widest opacity-60">Instant Validation</p>
                        </div>
                    </div>
                </div>
                <div className="relative group w-full flex justify-center">
                    <IDivCardModern mode="SMART" autoRotate={true} showDownload={false} />
                </div>
            </div>
            {/* Safe CTA Zone */}
            <div className="mt-24 md:mt-8 text-center relative z-30 px-4">
                <Link href="/smart-id" className="inline-flex items-center gap-4 px-10 md:px-16 py-5 md:py-6 bg-primary text-white font-black rounded-full hover:scale-110 transition-all text-xl md:text-2xl shadow-[0_30px_60px_rgba(124,58,237,0.6)] border-2 border-white/20 uppercase italic tracking-tighter">
                    UPGRADE TO SMART ID <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
                </Link>
            </div>
        </div>
      </section>

      {/* 9. Most Popular Visa List */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-black mb-4 text-slate-950 dark:text-white uppercase italic tracking-tighter">THE LEADERBOARD</h2>
                <div className="w-24 h-2 bg-primary mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-10">
                {[
                    { id: "C1", name: "C1 Visitor Visa", popularity: "94%", tag: "THE LEADER", color: "border-primary" },
                    { id: "D1", name: "D1 Multiple Entry", popularity: "88%", tag: "BUSINESS", color: "border-emerald-500" },
                    { id: "E33G", name: "E33G - Remote Worker KITAS", popularity: "82%", tag: "DIGITAL NOMAD", color: "border-amber-500" },
                ].map((visa, i) => (
                    <div key={i} className={`p-12 rounded-[4rem] bg-slate-50 dark:bg-white/5 border-t-[12px] ${visa.color} shadow-2xl hover:scale-105 transition-all group`}>
                        <div className="text-xs font-black text-primary mb-6 tracking-[0.3em] uppercase">{visa.tag}</div>
                        <h4 className="text-3xl font-black mb-6 text-slate-950 dark:text-white leading-tight italic">{visa.name}</h4>
                        <div className="flex items-end gap-2 mb-10">
                            <span className="text-7xl font-black text-slate-950 dark:text-white drop-shadow-sm">{visa.popularity}</span>
                            <span className="text-sm font-black text-slate-400 mb-4 italic uppercase">Usage</span>
                        </div>
                        <Link href={`/services/${visa.id}`} className="w-full py-5 bg-slate-950 text-white dark:bg-white dark:text-black rounded-3xl font-black text-xl text-center block hover:bg-primary transition-colors shadow-xl italic">
                            SELECT VISA
                        </Link>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 10. The Sponsor ID System (Details) */}
      <SectionWrapper>
        <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
                <h2 className="text-5xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter leading-none uppercase italic">TRUST <br/>Sponsorship</h2>
                <p className="text-2xl text-slate-600 dark:text-slate-400 leading-loose font-medium max-w-xl">
                    Indonesian immigration has centralized all sponsorship digitally. Without a valid <Link href="/why-travelers-need-a-sponsor-id" className="text-primary underline font-bold">Sponsor ID</Link>, you are not visible to the system.
                </p>
                <div className="flex gap-6 p-8 bg-slate-950 text-white rounded-[2.5rem] border-l-8 border-primary shadow-2xl">
                    <ShieldCheck size={64} className="text-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-black text-2xl italic mb-2 uppercase">Legally Bonded</h4>
                        <p className="text-lg opacity-70 leading-relaxed font-medium">We are your direct guarantor with the Ministry of Law and Human Rights.</p>
                    </div>
                </div>
            </div>
            <div className="bg-slate-900 p-16 rounded-[5rem] border-4 border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
                <h3 className="text-3xl font-black mb-10 text-white italic uppercase tracking-tighter">Direct Benefits</h3>
                <div className="grid grid-cols-1 gap-6">
                    {[
                        "Police Clearance (Kamtibmas) Verification",
                        "Hassle-free Villa/Hotel Registration",
                        "Priority Lane Support in Bali/Jakarta",
                        "Real-time Extension Monitoring"
                    ].map((benefit, idx) => (
                        <div key={idx} className="flex gap-5 items-center p-6 bg-white/10 rounded-2xl border-2 border-white/20 font-black text-white text-xl hover:bg-primary transition-all duration-300 shadow-lg">
                            <CheckCircle2 className="text-primary group-hover:text-white shrink-0" size={32} />
                            {benefit}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </SectionWrapper>

      {/* 11. Regulatory Framework - HIGH CONTRAST FIX */}
      <section className="py-32 bg-slate-100 dark:bg-white/5 border-y-2 border-slate-200 dark:border-white/10">
        <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-5xl md:text-8xl font-black mb-10 text-slate-950 dark:text-white tracking-tighter uppercase leading-[0.9] italic">COMPLIANCE <br/><span className="text-primary">2027 UPDATES</span></h2>
            <p className="text-2xl text-slate-900 dark:text-white font-black leading-loose mb-16 max-w-3xl mx-auto">
                We synchronize with the <Link href="/indonesia-visa-updates" className="text-primary font-black underline underline-offset-8">Official Immigration Feed</Link>. 
                The C1 is the only permit fully integrated with new clearance protocols.
            </p>
            <div className="p-16 bg-white dark:bg-black rounded-[5rem] shadow-2xl border-4 border-primary/20 flex flex-col items-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                <Globe size={100} className="text-primary mb-10 animate-pulse" />
                <h4 className="text-4xl font-black mb-6 text-slate-950 dark:text-white italic uppercase">Global Standards</h4>
                <p className="text-lg text-slate-500 font-bold mb-12 max-w-2xl">
                    Processing for applicants from 190+ countries while maintaining 100% legal integrity in Jakarta.
                </p>
                <Link href="/help" className="px-14 py-6 bg-slate-950 text-white dark:bg-white dark:text-black font-black rounded-3xl hover:bg-primary hover:text-white transition-all text-2xl shadow-xl italic uppercase tracking-widest">
                    HELP CENTER
                </Link>
            </div>
        </div>
      </section>

      {/* 12. FAQ / Quick Facts */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-black mb-16 text-center tracking-tighter italic uppercase underline decoration-primary decoration-8 underline-offset-[20px]">KNOWLEDGE BASE</h2>
            <div className="space-y-8">
                {[
                    { q: "Is C1 Visa better than VOA for long stays?", a: "Absolutely. VOA is limited to 60 days total. C1 allows up to 180 days with local extensions." },
                    { q: "Can I apply for C1 while I am inside Indonesia?", a: "No, the C1 must be applied for while you are outside of Indonesia (Offshore)." },
                    { q: "Do I need to visit the embassy for C1?", a: "No. Our C1 process is 100% digital via Jakarta Central Immigration." },
                    { q: "What happens if my C1 visa is rejected?", a: "We maintain a 99% success rate. In case of system errors, we offer re-submission at zero cost." }
                ].map((faq, i) => (
                    <div key={i} className="p-10 bg-white dark:bg-white/5 rounded-[3rem] border-2 border-slate-100 dark:border-white/10 shadow-xl hover:border-primary transition-colors group">
                        <h4 className="text-2xl font-black text-slate-950 dark:text-white mb-4 italic group-hover:text-primary transition-colors">Q: {faq.q}</h4>
                        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">A: {faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </SectionWrapper>

      {/* 13. Global Reach */}
      <section className="py-32 bg-slate-950 text-white text-center">
        <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-none italic">TRUSTED IN <br/><span className="text-primary">190+</span> NATIONS</h2>
            <p className="text-2xl text-slate-200 font-black mb-20 max-w-4xl mx-auto italic uppercase tracking-[0.2em]">The direct link to Indonesian soil.</p>
            <div className="flex flex-wrap justify-center gap-16 opacity-30 grayscale group hover:grayscale-0 transition-all duration-700">
                <Shield size={64} className="hover:text-primary hover:scale-110 transition-all" />
                <Globe size={64} className="hover:text-primary hover:scale-110 transition-all" />
                <Users size={64} className="hover:text-primary hover:scale-110 transition-all" />
                <Zap size={64} className="hover:text-primary hover:scale-110 transition-all" />
                <CheckCircle2 size={64} className="hover:text-primary hover:scale-110 transition-all" />
            </div>
        </div>
      </section>

      {/* 14. Final Call to Action */}
      <section className="py-40 relative overflow-hidden bg-white dark:bg-black">
        <div className="absolute inset-0 bg-primary opacity-[0.03]" />
        <div className="container mx-auto px-4 text-center max-w-5xl relative z-10">
            <h2 className="text-7xl md:text-[9rem] font-black mb-10 tracking-tighter text-slate-950 dark:text-white leading-[0.8] italic uppercase">START <br/><span className="text-primary">TODAY</span></h2>
            <p className="text-2xl md:text-4xl text-slate-500 dark:text-slate-400 font-black mb-16 leading-tight max-w-3xl mx-auto italic">
                Secure your 60-180 day visit. <br/>Zero embassy visits. Direct sponsorship.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8">
                <Link href="/services/C1" className="px-16 py-8 bg-slate-950 text-white font-black rounded-3xl hover:scale-105 hover:bg-primary transition-all text-3xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center gap-4 italic uppercase tracking-tighter border-4 border-white/10 group">
                    APPLY NOW <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link href="/contact" className="px-16 py-8 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-black rounded-3xl hover:bg-slate-900 hover:text-white transition-all text-3xl border-4 border-slate-200 dark:border-white/10 italic uppercase tracking-tighter shadow-xl">
                    TALK TO EXPERT
                </Link>
            </div>
            <p className="mt-20 text-lg text-slate-400 font-black uppercase tracking-[0.5em] italic">
                PT Indonesian Visas Agency™ (MYVISA)
            </p>
        </div>
      </section>

      {/* Services Preview (Internal Interlinking) */}
      <ServicesPreview dict={{}} />

    </div>
  );
}
