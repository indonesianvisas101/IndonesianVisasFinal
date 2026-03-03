import React from "react";
import dynamic from "next/dynamic";
import { CheckCircle, ShieldCheck, PhoneCall as PhoneCallIcon, Globe, Zap, ArrowRight, Building2, Shield, FileText, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";

// Lazy Load Components
const DiscountCard = dynamic(() => import("@/components/ui/cards/DiscountCard"));
const VisaCatalog = dynamic(() => import("@/components/visa/VisaCatalog"));

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getMessages(locale);
  const t = dict?.services_page || {};

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300">
      {/* 1. HERO SECTION - Premium Deep Gradient */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-60" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-bold mode-aware-text">{t.hero_subtitle || "Official Visa Partner"}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 mode-aware-text tracking-tight animate-fade-in-up [animation-delay:200ms]">
              {t.hero_title || "Your Passport to Paradise"}
            </h1>
            <p className="text-xl md:text-2xl mode-aware-subtext max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:400ms]">
              {t.hero_description || "Professional, secure, and expedited visa processing. We handle the bureaucracy so you can focus on your journey."}
            </p>
          </div>
        </div>
      </section>

      {/* 2. STATS & TRUST - Floating Cards */}
      <section className="py-12 relative z-20 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
            {[
              { label: t.hero_stats?.rate || "Success Rate", value: "99%", icon: CheckCircle },
              { label: t.hero_stats?.issued || "Visas Issued", value: "10k+", icon: ShieldCheck },
              { label: t.hero_stats?.support || "Expert Support", value: "24/7", icon: PhoneCallIcon },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl text-center group hover:border-primary/50 transition-all duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon size={28} />
                </div>
                <div className="text-3xl font-black mode-aware-text">{stat.value}</div>
                <div className="text-xs font-bold mode-aware-subtext uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROMO BANNER - Flashy Special Offer */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <DiscountCard dict={dict} />
        </div>
      </section>

      {/* 4. VISA CATALOG - Main Product Section */}
      <section className="py-20" id="catalog">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black mode-aware-text">{t.catalog_title || "Choose Your Visa Type"}</h2>
            <p className="text-xl mode-aware-subtext">
              {t.catalog_description || "Whether you are visiting for tourism, business, or long-term stay, we have the perfect option for you."}
            </p>
          </div>
          <VisaCatalog locale={locale} dict={dict} />
        </div>
      </section>

      {/* 5. FEATURES GRID - Value Propositions */}
      <section className="py-24 bg-white/30 dark:bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#9155FD]/20"
                style={{ backgroundColor: '#9155FD' }}
              >
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-bold mode-aware-text">{t.feature1_title || "Worldwide Coverage"}</h3>
              <p className="mode-aware-subtext leading-relaxed">
                {t.feature1_desc || "Also assistance available for Bali, Jakarta, Surabaya, and all major Indonesian immigration checkpoints."}
              </p>
            </div>
            <div className="space-y-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#FFB400]/20"
                style={{ backgroundColor: '#FFB400' }}
              >
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold mode-aware-text">{t.feature2_title || "Secure Processing"}</h3>
              <p className="mode-aware-subtext leading-relaxed">
                {t.feature2_desc || "Bank-grade encryption for your documents and full compliance with Indonesian immigration laws."}
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-400/20">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mode-aware-text">{t.feature3_title || "Fast-Track Options"}</h3>
              <p className="mode-aware-subtext leading-relaxed">
                {t.feature3_desc || "Need it urgent? Our express lane ensures your visa is processed in record time for last-minute trips."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROCESS STEPS - Visual Roadmap */}
      <section className="py-32">
        <div className="container mx-auto px-4 text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mode-aware-text mb-4">{t.process_title || "Simple 3-Step Process"}</h2>
          <p className="text-xl mode-aware-subtext">{t.process_description || "Getting your Indonesian visa has never been easier."}</p>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 z-0" />

            {[
              { step: "01", title: t.step1_title || "Apply Online", desc: t.step1_desc || "Fill out our simplified secure form in less than 5 minutes.", icon: FileText },
              { step: "02", title: t.step2_title || "We Process", desc: t.step2_desc || "Our team verifies documents and submits strictly to Immigration.", icon: ShieldCheck },
              { step: "03", title: t.step3_title || "Get Visa", desc: t.step3_desc || "Receive your approved e-Visa directly via email and WhatsApp.", icon: CheckCircle },
            ].map((item, i) => (
              <div key={i} className="relative z-10 text-center space-y-6 group">
                <div className="w-24 h-24 bg-white dark:bg-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500 border border-slate-200 dark:border-white/10">
                  <item.icon size={40} className="text-primary" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">{item.step}</span>
                  <h4 className="text-2xl font-bold mode-aware-text">{item.title}</h4>
                  <p className="mode-aware-subtext leading-relaxed px-4">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMPANY FORMATION PROMO */}
      <SectionWrapper id="company-formation-promo" className="py-24">
        <div className="relative overflow-hidden rounded-[4rem] bg-gradient-to-br from-slate-900 to-black p-12 md:p-24 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-black uppercase tracking-widest animate-pulse">
                {t.company_formation_label || "New Service"}
              </div>
              <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                {t.company_formation_title || "Start Your Company in Indonesia"}
              </h2>
              <p className="text-xl text-white/70 leading-relaxed font-medium">
                {t.company_formation_desc || "Full PT PMA Registration service including NIB, Tax ID, and Virtual Office. Invest safely with 100% Foreign Ownership."}
              </p>
              <Link
                href={`/${locale}/company-formation`}
                className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/90 transition-all shadow-2xl hover:shadow-white/10 group"
              >
                {t.company_formation_cta || "Check Company Formation"} <ArrowRight className="transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
            <div className="flex-1 w-full max-w-lg aspect-square lg:aspect-auto lg:h-[450px] relative">
              <div className="absolute inset-0 border-[16px] border-white/5 rounded-[4rem] rotate-6" />
              <div className="absolute inset-0 border-[16px] border-white/5 rounded-[4rem] rotate-3" />
              <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[4rem] p-12 flex flex-col justify-center gap-8 shadow-2xl">
                {[
                  { text: "100% Foreign Ownership", icon: CheckCircle },
                  { text: "Investor KITAS Ready", icon: CheckCircle },
                  { text: "Full Legal Compliance", icon: CheckCircle },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-[#9155FD]/20"
                      style={{ backgroundColor: '#9155FD' }}
                    >
                      <item.icon size={24} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 8. CTA SECTION - FINAL PUSH */}
      <section className="py-40 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-10">
            <h2 className="text-5xl md:text-7xl font-black mode-aware-text tracking-tighter leading-none">
              {t.ready_title || "Ready to Start Your Journey?"}
            </h2>
            <p className="text-xl md:text-2xl mode-aware-subtext font-medium px-4">
              {t.ready_desc || "Join 10,000+ happy travelers who trusted us with their Indonesian visas. Simple process, transparent pricing, guaranteed results."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link
                href={`/${locale}/apply`}
                className="w-full sm:w-auto px-12 py-5 text-white text-xl font-black rounded-2xl shadow-2xl shadow-[#9155FD]/30 transition-all hover:opacity-90 hover:-translate-y-1 active:scale-95"
                style={{ backgroundColor: '#9155FD' }}
              >
                {dict?.apply_extend?.apply_cta || "Start Application"}
              </Link>
              <Link
                href={`/${locale}/faq`}
                className="w-full sm:w-auto px-12 py-5 bg-white dark:bg-white/5 mode-aware-text text-xl font-black rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
              >
                {dict?.header?.faq || "View FAQ"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
