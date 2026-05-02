"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, ArrowRight, BookOpen, Info, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { VFSPageData } from "@/constants/vfs-guidance";
import VisaCard from "@/components/ui/cards/VisaCard";
import { VISA_DATABASE, POPULAR_VISA_IDS } from "@/constants/visas";
import { formatNavLink } from "@/utils/seo";

interface VFSEducationalTemplateProps {
    data: VFSPageData;
    locale: string;
}

export default function VFSEducationalTemplate({ data, locale }: VFSEducationalTemplateProps) {
    const [activeSection, setActiveSection] = useState("section-0");

    const displayVisaIds = POPULAR_VISA_IDS.slice(0, 9);
    const uniqueMap = new Map();
    VISA_DATABASE
        .filter(v => displayVisaIds.includes(v.id))
        .forEach(v => {
            if (!uniqueMap.has(v.id)) {
                uniqueMap.set(v.id, {
                    ...v,
                    price: typeof v.price === 'string' ? v.price : 'View Details'
                });
            }
        });
    const popularVisas = Array.from(uniqueMap.values());

    useEffect(() => {
        const handleScroll = () => {
            const sectionCount = data.sections.length;
            let current = "section-0";
            
            for (let i = 0; i < sectionCount; i++) {
                const el = document.getElementById(`section-${i}`);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 140) {
                        current = `section-${i}`;
                    }
                }
            }
            setActiveSection(current);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [data.sections]);

    return (
        <PageWrapper className="bg-white dark:bg-[#030712]">
            {/* HERO SECTION */}
            <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-b-[4rem] border-b border-black/5 dark:border-white/5">
                <div className="container relative z-10 mx-auto px-4">
                    {/* BREADCRUMBS */}
                    <div className="flex flex-wrap items-center gap-2 text-sm mb-8 text-gray-500 dark:text-gray-400">
                        <Link href={formatNavLink(locale, "/")} className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight size={14} className="shrink-0" />
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Official Guidance</span>
                    </div>

                    <div className="max-w-4xl animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                            <ShieldCheck size={14} /> Official Education Center
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mode-aware-text tracking-tighter mb-6 leading-tight">
                            {data.heroTitle}
                        </h1>
                        <p className="text-xl md:text-2xl mode-aware-subtext max-w-3xl leading-relaxed font-medium">
                            {data.heroSubtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT + SIDEBAR */}
            <div className="container mx-auto px-4 py-20">
                <div className="flex flex-col lg:flex-row gap-16 max-w-7xl mx-auto">
                    
                    {/* LEFT / CONTENT */}
                    <article className="flex-1 space-y-24 lg:w-2/3">
                        {data.sections.map((section, idx) => (
                            <section key={idx} id={`section-${idx}`} className="scroll-mt-32 group">
                                <div className="flex items-start gap-6">
                                    <div className="hidden sm:flex w-12 h-12 shrink-0 rounded-2xl bg-primary/10 items-center justify-center text-primary font-bold shadow-sm border border-primary/20 group-hover:scale-110 transition-transform">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-3xl md:text-4xl font-black mode-aware-text mb-8 tracking-tight">
                                            {section.title}
                                        </h2>
                                        
                                        <div className="space-y-6 mode-aware-subtext text-lg md:text-xl leading-relaxed">
                                            {typeof section.content === 'string' ? (
                                                <p>{section.content}</p>
                                            ) : (
                                                section.content
                                            )}
                                        </div>

                                        {/* Dynamic UI Elements based on Section Type */}
                                        {section.type === 'comparison' && (
                                            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20">
                                                    <div className="flex items-center gap-2 text-red-500 font-bold mb-4">
                                                        <AlertTriangle size={18} /> Common Misconception
                                                    </div>
                                                    <p className="text-sm opacity-80">Assuming VFS Global handles Indonesian visas due to their role in other countries like Australia or Europe.</p>
                                                </div>
                                                <div className="p-6 rounded-3xl bg-green-500/5 border border-green-500/20">
                                                    <div className="flex items-center gap-2 text-green-500 font-bold mb-4">
                                                        <CheckCircle2 size={18} /> Official Fact
                                                    </div>
                                                    <p className="text-sm opacity-80">Indonesia uses an independent digital system (Molina/eVisa) and authorized local sponsors.</p>
                                                </div>
                                            </div>
                                        )}

                                        {section.type === 'steps' && (
                                            <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                                <div className="flex items-center gap-2 text-primary font-bold mb-6">
                                                    <Info size={18} /> Official Path to Entry
                                                </div>
                                                <div className="space-y-4">
                                                    {["Identify Visa Type (B1, C1, etc.)", "Secure Authorized Sponsorship", "Submit Digital Application", "Receive eVisa Confirmation"].map((step, i) => (
                                                        <div key={i} className="flex items-center gap-4">
                                                            <div className="w-6 h-6 rounded-full bg-primary text-black text-xs flex items-center justify-center font-bold">{i+1}</div>
                                                            <span className="text-sm font-bold">{step}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        ))}

                        {/* LEGAL CLARIFICATION BOX */}
                        <div className="relative p-10 md:p-12 rounded-[3.5rem] bg-slate-900 text-white overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-widest mb-6">
                                    Legal Authority Verification
                                </span>
                                <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Registered Immigration Sponsor Status</h3>
                                <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mb-10">
                                    All visa companies in Indonesia are private entities. PT Indonesian Visas Agency™ (MYVISA) is a fully <strong>Registered & Licensed Immigration Sponsor</strong>. We provide legal sponsorship needed for KITAS, Business, and specialized visas, acting as the verified bridge between foreign nationals and the Indonesian authorities.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/10 text-sm">
                                    <div>
                                        <p className="text-slate-500 uppercase font-black tracking-widest mb-2 text-xs">Registration (NIB)</p>
                                        <p className="font-mono text-lg font-bold">0402260034806</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 uppercase font-black tracking-widest mb-2 text-xs">Immigration License</p>
                                        <p className="font-mono text-lg font-bold">04022610215171007</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* RIGHT / STICKY TABLE OF CONTENTS */}
                    <aside className="lg:w-1/3 hidden lg:block">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 shadow-sm">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/10 pb-4">
                                    Verification Guide
                                </h3>
                                <nav className="flex flex-col gap-4">
                                    {data.sections.map((section, idx) => (
                                        <Link 
                                            key={idx} 
                                            href={`#section-${idx}`}
                                            className={`transition-all text-sm leading-snug ${
                                                activeSection === `section-${idx}` 
                                                ? "font-extrabold text-primary translate-x-1" 
                                                : "mode-aware-subtext opacity-60 hover:opacity-100 hover:text-primary"
                                            }`}
                                        >
                                            {section.title}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-accent/5 border border-accent/20">
                                <HelpCircle className="text-accent mb-4" size={32} />
                                <h4 className="font-black mode-aware-text mb-2">Need Direct Clarity?</h4>
                                <p className="text-xs mode-aware-subtext mb-6">If you are abroad and unsure about the official entry path, our legal team can verify your documents within 24 hours.</p>
                                <Link href={formatNavLink(locale, "/apply")} className="block w-full text-center py-4 bg-primary text-black rounded-2xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform">
                                    Verify My Application
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* VISA CARD SECTION (THE 9 POPULAR VISAS) */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/40 border-t border-black/5 dark:border-white/5 rounded-t-[5rem]">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                        <h2 className="text-4xl md:text-5xl font-black mode-aware-text mb-6 tracking-tight">Ready to Apply for the Correct Visa?</h2>
                        <p className="text-lg mode-aware-subtext">Skip the confusion and choose from the officially recognized visa tracks for Indonesia. We provide full legal sponsorship for all categories listed below.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {popularVisas.map((visa) => (
                            <VisaCard key={visa.id} visa={visa} />
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Link href={formatNavLink(locale, "/apply")} className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-black text-lg rounded-3xl font-black shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all">
                            Start Application Now <ArrowRight size={22} />
                        </Link>
                    </div>
                </div>
            </section>
        </PageWrapper>
    );
}
