import React from "react";
import { Metadata } from "next";
import { getMessages } from "@/i18n/getMessages";
import dynamic from "next/dynamic";
import LazySection from "@/components/layout/LazySection";
import Hero from "@/components/hero/Hero";
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
  Plane
} from "lucide-react";
import Link from "next/link";
import IDivCardModern from "@/components/idiv/IDivCardModern";

// Unique Components for SEO Pages
const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview"));
const FAQPreview = dynamic(() => import("@/components/sections/FAQPreview"));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"));
const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
  
  return {
    title: "Indonesian Visas 2026-2027 | Official Guide, Prices & Digital Sponsorship",
    description: "The definitive guide to Indonesian Visas in 2026-2027. Explore prices, direct sponsorship requirements, Omnibus Law updates, and the new IDIV digital identity system.",
    keywords: ["indonesian visa 2026", "indonesia visa prices 2027", "bali visa sponsor", "omnibus law indonesia visa", "digital nomad visa indonesia", "calling visa protocol"],
    alternates: {
      canonical: `${APP_URL}/${locale}/indonesian-visas-in-2026-2027-all-types-and-prices`,
    },
    openGraph: {
      title: "Indonesian Visas 2026-2027: The Complete Digital Guide",
      description: "Direct sponsorship and transparent pricing for the 2026-2027 visa season.",
      images: [`${APP_URL}/images/BaliHelpCompress.webp`],
    },
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  };
}

export default async function NationalGuide2026({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getMessages(locale);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "headline": "Indonesian Visas In 2026-2027: All Types and Prices",
        "description": "Comprehensive analysis of the Indonesian visa landscape for 2026 and 2027 including digital transformation and direct sponsorship.",
        "author": { "@type": "Person", "name": "Bayu Damopolii-Manoppo" },
        "publisher": { 
          "@type": "Organization", 
          "name": "PT Indonesian Visas Agency",
          "logo": { "@type": "ImageObject", "url": `${APP_URL}/Favicon.webp` }
        },
        "image": `${APP_URL}/images/BaliHelpCompress.webp`,
        "datePublished": "2026-04-27",
        "dateModified": "2026-05-04"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the most popular visa for 2026?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The C1/C2 Single Entry Visa remains the most popular due to its flexibility and first-hand sponsorship availability."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need a sponsor for Indonesian Visas in 2027?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, direct corporate sponsorship is a legal requirement for most visit and long-stay visas under current regulations."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${APP_URL}/${locale}` },
          { "@type": "ListItem", "position": 2, "name": "Visas 2026-2027", "item": `${APP_URL}/${locale}/indonesian-visas-in-2026-2027-all-types-and-prices` }
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. Hero Section - National Future Focus */}
      <Hero 
        dict={dict} 
        bgImage="/images/BaliHelpCompress.webp"
        title="INDONESIAN VISAS 2026-2027"
        subtitle="The Official Digital Identity & Pricing Guide"
      />

      {/* Visual Breadcrumbs - SEO SCRUMB */}
      <div className="bg-slate-50 dark:bg-zinc-900/50 py-4 border-b border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <ArrowRight size={10} />
           <span className="text-slate-900 dark:text-white">Visas 2026-2027</span>
        </div>
      </div>

      {/* 2. Educational Intro - Strategic Positioning */}
      <section className="py-24 bg-slate-50 dark:bg-white/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-black uppercase tracking-[0.2em] text-sm mb-4 block">Strategic Roadmap</span>
              <h2 className="text-5xl font-black mb-8 tracking-tighter leading-tight text-slate-900 dark:text-white">The 2026-2027 Immigration Shift</h2>
              <div className="prose prose-lg dark:prose-invert text-slate-800 dark:text-slate-200">
                <p>
                  As Indonesia moves towards a fully digitalized immigration system, 2026 and 2027 mark a significant shift in how visas are processed and sponsored. 
                  Under the current <strong>Omnibus Law</strong> framework, the emphasis has shifted towards direct corporate accountability and transparent digital tracking.
                </p>
                <p className="font-bold text-primary">
                  PT Indonesian Visas Agency continues to lead this transformation by providing first-hand sponsorship, eliminating the risks associated with third-party brokers.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="glass-card p-8 rounded-[2.5rem] shadow-2xl bg-white backdrop-blur-xl border-white">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                     <Shield size={24} />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-slate-900">Legal Accountability</h4>
                  <p className="text-xs text-slate-500">Black-and-white proof of sponsor responsibility.</p>
               </div>
               <div className="glass-card p-8 rounded-[2.5rem] shadow-2xl bg-white backdrop-blur-xl border-white mt-8">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                     <Zap size={24} />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-slate-900">Zero Hidden Fees</h4>
                  <p className="text-xs text-slate-500">Fixed national pricing with zero surprises.</p>
               </div>
               <div className="glass-card p-8 rounded-[2.5rem] shadow-2xl bg-white backdrop-blur-xl border-white">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                     <Globe size={24} />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-slate-900">IDIV Ready</h4>
                  <p className="text-xs text-slate-500">Integrated Digital Visa Identity for 2027.</p>
               </div>
               <div className="glass-card p-8 rounded-[2.5rem] shadow-2xl bg-white backdrop-blur-xl border-white mt-8">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                     <Users size={24} />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-slate-900">Direct Sponsor</h4>
                  <p className="text-xs text-slate-500">No agents, no brokers, first-hand service.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Airline Safety & IATA Integration */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1">
                 <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/20 rounded-full border border-primary/30 text-xs font-bold text-primary mb-6">
                    <Zap size={14} /> AIRLINE BOARDING GUARANTEE
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter italic uppercase">THE AIRLINE <span className="text-primary">BYPASS</span></h2>
                 <p className="text-xl text-slate-300 leading-relaxed font-medium mb-8">
                    In 2026-2027, airlines use the centralized <Link href="/vfs-global" className="text-white underline decoration-primary">IATA Timatic</Link> system to verify entry eligibility. 
                    If you arrive with a standard entry permit, you risk boarding denial. Our Digital Sponsorship ensures your permit is pre-cleared in the national database.
                 </p>
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 italic">
                       <Plane className="text-primary" /> 
                       <span>Automatic integration with <Link href="/fast-approval" className="text-primary font-bold hover:underline">Fast-Track Approval</Link> systems.</span>
                    </div>
                 </div>
              </div>
              <div className="flex-1 relative">
                 <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full" />
                 <img src="/images/BaliHelpCompress.webp" alt="Airline Safety" className="relative rounded-[3rem] shadow-2xl border-4 border-white/10 grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
           </div>
        </div>
      </section>

      {/* 3. NEW SECTION: Legal Framework & Omnibus Law */}
      <section className="py-24 bg-white dark:bg-black overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
           <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                 <div className="flex items-center gap-4 mb-6">
                    <BookOpen className="text-primary" size={32} />
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">The 2026 Legal Framework</h2>
                 </div>
                 <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-400">
                    <p>
                       The Indonesian visa landscape for 2026-2027 is strictly governed by the updated <strong>Omnibus Law on Job Creation</strong> and the <strong>Strategic Immigration Policy Decree</strong>. 
                       These regulations mandate that all foreign visitors must have a verifiable legal anchor within the country.
                    </p>
                    <p>
                       Understanding these shifts is crucial for avoiding entry denials or legal complications during your stay.
                    </p>
                    <Link href="/regulations/indonesia-visa-regulations" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                       Explore Full Visa Regulations <ArrowRight size={18} />
                    </Link>
                 </div>
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-white/5 p-10 rounded-[3rem] border border-slate-100 dark:border-white/10">
                 <h4 className="font-black text-xl mb-6 text-primary">Key Compliance Pillars:</h4>
                 <ul className="space-y-4">
                    <li className="flex gap-3 text-sm font-medium">
                       <FileCheck className="text-green-500 shrink-0" size={20} />
                       <span>Direct Corporate Sponsorship Requirement</span>
                    </li>
                    <li className="flex gap-3 text-sm font-medium">
                       <FileCheck className="text-green-500 shrink-0" size={20} />
                       <span>Biometric Digital Identity Synchronization</span>
                    </li>
                    <li className="flex gap-3 text-sm font-medium">
                       <FileCheck className="text-green-500 shrink-0" size={20} />
                       <span>Real-time Financial Solvency Verification</span>
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Popular Visa Grid - The 9 Cards */}
      <LazySection minHeight="600px">
        <div className="py-24 bg-white dark:bg-black">
           <div className="container mx-auto px-4 text-center mb-16">
              <h2 className="text-5xl font-black mb-6 tracking-tighter">9 Most Popular Visas for 2026-2027</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Curated based on national demand and processing speed for the upcoming tourism seasons.</p>
           </div>
           <ServicesPreview dict={dict} />
        </div>
      </LazySection>

      {/* NEW SECTION: The KITAS Roadmap 2027 */}
      <section className="py-24 bg-slate-50 dark:bg-zinc-900/30 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter italic mb-4 uppercase">THE KITAS <span className="text-primary">ROADMAP</span></h2>
              <p className="text-xl text-slate-500 font-medium italic">Transition from Visitor to Resident in 3 Strategic Steps.</p>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "C1 Entry", desc: "Start with a 60-180 day visit visa to stabilize your local presence.", link: "/visa-types/b211a-visa-indonesia" },
                { step: "02", title: "E33G Remote", desc: "Upgrade to the Remote Worker KITAS for multi-year tax-efficient stay.", link: "/visa-types/kitas-indonesia" },
                { step: "03", title: "Investor ITAP", desc: "The final tier: Permanent residency with 5-10 year validity.", link: "/visa-types/investor-visa-indonesia" }
              ].map((item, idx) => (
                <div key={idx} className="p-10 bg-white dark:bg-black rounded-[3rem] shadow-xl border-b-8 border-primary group hover:-translate-y-2 transition-all duration-500">
                   <span className="text-6xl font-black text-slate-100 dark:text-white/5 block mb-6 group-hover:text-primary/20 transition-colors tracking-tighter italic">{item.step}</span>
                   <h3 className="text-2xl font-black mb-4 italic uppercase">{item.title}</h3>
                   <p className="text-slate-500 mb-8 font-medium">{item.desc}</p>
                   <Link href={item.link} className="inline-flex items-center gap-2 font-black text-primary hover:gap-4 transition-all uppercase text-sm">
                      Explore Requirements <ArrowRight size={16} />
                   </Link>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. NEW SECTION: Strategic Calling Visa Protocols */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="bg-amber-50 dark:bg-amber-900/10 p-12 rounded-[3rem] border border-amber-200 dark:border-amber-900/30">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div>
                    <div className="flex items-center gap-4 mb-6">
                       <AlertCircle className="text-amber-600" size={32} />
                       <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Calling Visa Protocols</h2>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                       Travelers from restricted nations require **Inter-Agency Security Clearance**. 
                       In 2027, these applications are strictly **Offline-Only** and require physical submission to Central Immigration via Bali with final clearance from 3 Jakarta Head Offices.
                    </p>
                    <Link href="/calling-visa" className="px-10 py-5 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 transition-all shadow-xl hover:shadow-amber-500/20 inline-block text-lg">
                       Check Calling Visa Requirements
                    </Link>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white dark:bg-black/40 p-6 rounded-2xl shadow-sm border border-amber-100 dark:border-white/5">
                       <h5 className="font-bold text-amber-700 mb-1">Central Jakarta Clearance</h5>
                       <p className="text-xs opacity-60 italic">Requires approval from 3 separate ministerial head offices.</p>
                    </div>
                    <div className="bg-white dark:bg-black/40 p-6 rounded-2xl shadow-sm border border-amber-100 dark:border-white/5">
                       <h5 className="font-bold text-amber-700 mb-1">50/50 Approval Success</h5>
                       <p className="text-xs opacity-60">Rigorous screening with no guarantee of approval for restricted countries.</p>
                    </div>
                 </div>
              </div>
        </div>
        </div>
      </section>

      {/* 6. NEW SECTION: Global Country List & Eligibility */}
      <section className="py-24 bg-slate-50 dark:bg-white/5">
        <div className="container mx-auto px-4 text-center max-w-4xl">
           <MapIcon className="mx-auto text-primary mb-6" size={48} />
           <h2 className="text-4xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white">Global Eligibility Matrix</h2>
           <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
              Visa eligibility in 2027 is dynamic and based on reciprocal diplomatic agreements. 
              Our real-time matrix allows you to check your country's specific status instantly.
           </p>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {['United States', 'United Kingdom', 'Australia', 'China', 'Russia', 'Germany'].map((country) => (
                 <div key={country} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 font-bold text-slate-900 dark:text-white">
                    {country}
                 </div>
              ))}
           </div>
           <Link href="/list-country" className="inline-flex items-center gap-3 text-2xl font-black text-primary hover:gap-5 transition-all">
              View Full Country List 2026 <ArrowRight size={28} />
           </Link>
        </div>
      </section>

      {/* 7. Strategic Price List Table - Forced Dark Theme for WOW factor */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#0f172a', color: 'white' }}>
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-white">National Price Transparency 2026</h2>
            <p className="text-white/60">Fixed pricing for 2026-2027 under PT Indonesian Visas Agency sponsorship.</p>
          </div>
          <div className="overflow-x-auto rounded-[3rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.4)] backdrop-blur-3xl bg-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/10 text-white uppercase tracking-widest text-xs">
                  <th className="p-8">Visa Type</th>
                  <th className="p-8">Standard Fee</th>
                  <th className="p-8 text-right">Processing Authority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="p-8">
                    <div className="font-black text-xl text-white group-hover:text-amber-400 transition-colors">B1 VOA (30-60 Days)</div>
                    <div className="text-xs text-white/40 mt-1">Tourism & Short Meetings</div>
                  </td>
                  <td className="p-8">
                    <div className="text-2xl font-bold text-white">USD 35 <span className="text-xs text-white/30">+ Service</span></div>
                  </td>
                  <td className="p-8 text-right">
                    <span className="px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20">1-4 Hours Approval</span>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="p-8">
                    <div className="font-black text-xl text-white group-hover:text-amber-400 transition-colors">C1/C2 Single Entry</div>
                    <div className="text-xs text-white/40 mt-1">Social, Business & Visit</div>
                  </td>
                  <td className="p-8">
                    <div className="text-2xl font-bold text-white">Fixed Quote</div>
                  </td>
                  <td className="p-8 text-right">
                    <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">3 Business Days</span>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="p-8">
                    <div className="font-black text-xl text-white group-hover:text-amber-400 transition-colors">D1/D2 Multiple Entry</div>
                    <div className="text-xs text-white/40 mt-1">Corporate & Frequent Travel</div>
                  </td>
                  <td className="p-8">
                    <div className="text-2xl font-bold text-white">1, 2, or 5 Years</div>
                  </td>
                  <td className="p-8 text-right">
                    <span className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold border border-purple-500/20">Strategic Corporate</span>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="p-8">
                    <div className="font-black text-xl text-white group-hover:text-amber-400 transition-colors">E33G Digital Nomad</div>
                    <div className="text-xs text-white/40 mt-1">Remote Work & Tax Benefits</div>
                  </td>
                  <td className="p-8">
                    <div className="text-2xl font-bold text-white">Full Expat Pkg</div>
                  </td>
                  <td className="p-8 text-right">
                    <span className="px-4 py-2 bg-amber-500/10 text-amber-400 rounded-full text-xs font-bold border border-amber-500/20">Priority Processing</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-12 text-center">
             <p className="text-white/30 text-xs italic tracking-wide uppercase">All applications processed via PT Indonesian Visas Agency secure cloud portal.</p>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Compliance & Deportation Avoidance */}
      <section className="py-24 bg-red-50 dark:bg-red-950/10 border-y border-red-100 dark:border-red-900/20">
        <div className="container mx-auto px-4 max-w-5xl">
           <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-20 h-20 bg-red-600 text-white rounded-[2rem] flex items-center justify-center shrink-0 shadow-xl shadow-red-600/30">
                 <AlertCircle size={40} />
              </div>
              <div>
                 <h2 className="text-4xl font-black text-red-950 dark:text-red-100 tracking-tighter italic mb-4 uppercase">Compliance Alert: Deportation Protocols</h2>
                 <p className="text-xl text-red-900/80 dark:text-red-200/80 leading-relaxed font-medium mb-8">
                    In 2027, the <Link href="/immigration-rules/immigration-rules-indonesia" className="font-bold underline">Indonesian Immigration Task Force</Link> has increased spot-checks for sponsorship validity. 
                    If your sponsor is not a registered legal entity with first-hand accountability, your visa may be revoked instantly.
                 </p>
                 <Link href="/legal-experts" className="px-10 py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl inline-block italic">
                    Verify Your Sponsorship Legality
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* 8. NEW SECTION: The Sponsorship Advantage */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                 <div className="relative group">
                    <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl group-hover:bg-primary/30 transition-all"></div>
                    <img src="/images/IndonesianVisas/BaliHelp.webp" alt="Visa Support" className="relative rounded-[3rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" />
                 </div>
              </div>
              <div className="order-1 md:order-2">
                 <h2 className="text-5xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white leading-[0.9]">Why Direct Sponsorship Matters</h2>
                 <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400">
                    <p>
                       In 2026, the Indonesian government has cracked down on third-party visa brokers. 
                       By using <strong>PT Indonesian Visas Agency</strong>, you are secured by a direct sponsor ID.
                    </p>
                    <ul className="space-y-4">
                       <li className="flex gap-4">
                          <Link href="/id-indonesian-visas" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shrink-0">1</Link>
                          <span><strong>Verified Paper Trail:</strong> Black-and-white proof of legality.</span>
                       </li>
                       <li className="flex gap-4">
                          <Link href="/why-travelers-need-a-sponsor-id" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shrink-0">2</Link>
                          <span><strong>Zero Liability:</strong> We take full responsibility for your stay.</span>
                       </li>
                    </ul>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 9. Smart ID Technology Spotlight - Forced Brand Theme */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#4B0082', color: 'white' }}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/images/IndonesianVisas/Lombok.webp')] bg-cover bg-center" />
          <div className="container mx-auto px-4 relative z-20">
              <div className="grid md:grid-cols-2 gap-20 items-center">
                  <div className="space-y-10">
                      <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                         <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                         <span className="text-[10px] font-black tracking-widest uppercase">Proprietary Tech 2027</span>
                      </div>
                      <h2 className="text-6xl font-black tracking-tighter leading-[0.9]">Smart ID:<br/><span className="text-amber-400">The Future</span> of Identity</h2>
                      <p className="text-xl text-white/70 leading-relaxed max-w-xl">
                          Integrated NFC and QR technology allowing verifiable sponsorship status without carrying your physical passport. 
                          Designed for hotel check-ins, rentals, and government-aligned security protocols in Bali and beyond.
                      </p>
                      <Link href="/smart-id" className="px-12 py-6 bg-white text-primary font-black rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all inline-block uppercase tracking-wider text-sm">
                          Explore Smart ID System
                      </Link>
                  </div>
                  <div className="relative">
                      <div className="absolute -inset-10 bg-amber-400/20 blur-[100px] rounded-full" />
                      <div className="relative flex justify-center">
                          <IDivCardModern mode="SMART" autoRotate={true} />
                      </div>
                      <div className="mt-12 flex flex-col items-center gap-6">
                          <Link href="/smart-id" className="px-10 py-5 bg-amber-400 text-slate-900 font-black rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center gap-3">
                              UPGRADE TO SMART ID <ArrowRight size={20} />
                          </Link>
                          <Link href="/why-travelers-need-a-sponsor-id" className="text-white/60 hover:text-white transition-colors text-sm font-bold underline underline-offset-8 decoration-amber-400/30">
                              Learn Why You Need a Digital Sponsor ID
                          </Link>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 10. NEW SECTION: 2026 Policy Live Updates */}
      <section className="py-24 bg-slate-50 dark:bg-white/5">
        <div className="container mx-auto px-4 text-center max-w-4xl">
           <h2 className="text-4xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white">Live Policy Updates 2026</h2>
           <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
              Immigration policies in Indonesia can change overnight. Stay ahead of the curve with our direct feed from the Ministry.
           </p>
           <Link href="/indonesia-visa-updates" className="group px-12 py-5 bg-white dark:bg-black border-2 border-primary text-primary font-black rounded-2xl hover:bg-primary hover:text-white transition-all inline-flex items-center gap-4">
              Access Latest Updates <ArrowRight className="group-hover:translate-x-2 transition-transform" />
           </Link>
        </div>
      </section>

      {/* NEW SECTION: Real-time Processing Matrix */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="p-12 bg-slate-900 rounded-[4rem] text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
              <div className="grid md:grid-cols-4 gap-8 text-center relative z-10">
                 {[
                   { label: "Daily Applications", value: "850+", sub: "Verified Processing" },
                   { label: "Success Rate", value: "99.2%", sub: "Legal Integrity" },
                   { label: "Avg. Processing", value: "3 Days", sub: "Priority Express" },
                   { label: "Active Sponsors", value: "15,000+", sub: "Trust Network" }
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <p className="text-xs font-black tracking-widest text-primary uppercase">{stat.label}</p>
                      <p className="text-5xl font-black tracking-tighter italic">{stat.value}</p>
                      <p className="text-[10px] opacity-40 uppercase tracking-widest">{stat.sub}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 11. NEW SECTION: Help Center Integration */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-5xl text-center">
           <div className="p-16 rounded-[4rem] bg-primary/5 border border-primary/10 relative overflow-hidden">
              <HelpCircle className="mx-auto text-primary mb-8" size={64} />
              <h2 className="text-5xl font-black mb-6 text-slate-900 dark:text-white tracking-tighter">Need Immediate Assistance?</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                 Our 24/7 Priority Support is available for urgent applications, calling visa issues, or regulatory questions.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
                 <Link href="/help" className="text-3xl font-black text-primary hover:underline transition-all underline decoration-primary underline-offset-8">
                    Visit Official Help Center
                 </Link>
                 <span className="hidden md:block text-slate-300">|</span>
                 <Link href="/idiv-search" className="text-xl font-bold text-primary underline">
                    IDIV Search Portal
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* 12. Why Choose Us - Authority */}
      <LazySection minHeight="500px">
        <WhyChooseUs dict={dict} />
      </LazySection>

      {/* 7. FAQ Section */}
      <LazySection minHeight="500px">
        <FAQPreview dict={dict} />
      </LazySection>

      {/* 8. Regional Interlinking Hub */}
      <section className="py-24 bg-slate-50 dark:bg-white/5">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-4xl font-black mb-16 tracking-tighter">Explore Regional Visa Hubs</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link href="/bali-visas-in-2026-2027-all-types-and-prices" className="glass-card group p-10 rounded-[3rem] hover:border-primary transition-all bg-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-colors" />
                 <h3 className="font-bold text-2xl mb-3 relative z-10">Bali Guide</h3>
                 <p className="text-sm text-slate-400 relative z-10">Tourism & Nomad Hub</p>
              </Link>
              <Link href="/jakarta-visas-in-2026-2027-all-types-and-prices" className="glass-card group p-10 rounded-[3rem] hover:border-primary transition-all bg-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-colors" />
                 <h3 className="font-bold text-2xl mb-3 relative z-10">Jakarta Guide</h3>
                 <p className="text-sm text-slate-400 relative z-10">Business & Investment</p>
              </Link>
              <Link href="/indonesian-visas-lates-updated" className="glass-card group p-10 rounded-[3rem] hover:border-primary transition-all bg-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-colors" />
                 <h3 className="font-bold text-2xl mb-3 relative z-10">National Updates</h3>
                 <p className="text-sm text-slate-400 relative z-10">Latest Policy News</p>
              </Link>
              <Link href="/bali-visas-lates-updated" className="glass-card group p-10 rounded-[3rem] hover:border-primary transition-all bg-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-colors" />
                 <h3 className="font-bold text-2xl mb-3 relative z-10">Bali Updates</h3>
                 <p className="text-sm text-slate-400 relative z-10">Local Bali News</p>
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


