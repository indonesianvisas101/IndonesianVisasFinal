"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, ArrowRight, BookOpen } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { formatNavLink } from "@/utils/seo";

interface Section {
    id: string;
    title: string;
    content: React.ReactNode;
}

interface SEOPageLayoutProps {
    title: string;
    description?: string;
    subtitle?: string;
    breadcrumbs?: { label: string; url: string }[];
    sections?: Section[];
    locale?: string;
    cta?: { title: string; desc: string; buttonText: string; link: string };
    children?: React.ReactNode;
}

export default function SEOPageLayout({ 
    title, 
    subtitle, 
    breadcrumbs = [], 
    sections = [], 
    locale = 'en', 
    cta,
    children 
}: SEOPageLayoutProps) {
    const [activeSection, setActiveSection] = useState(sections[0]?.id || "");

    useEffect(() => {
        const handleScroll = () => {
            let current = sections[0]?.id || "";
            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // Offset for header height
                    if (rect.top <= 140) {
                        current = section.id;
                    }
                }
            }
            setActiveSection(current);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [sections]);

    return (
        <PageWrapper className="bg-white dark:bg-[#030712]">
            {/* HERO SECTION */}
            <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-accent/5 rounded-b-[3rem]">
                <div className="container relative z-10 mx-auto px-4">
                    {/* BREADCRUMBS */}
                    <div className="flex flex-wrap items-center gap-2 text-sm mb-8 text-gray-500 dark:text-gray-400">
                        <Link href={formatNavLink(locale, "/")} className="hover:text-primary transition-colors">Home</Link>
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                <ChevronRight size={14} className="shrink-0" />
                                {idx === breadcrumbs.length - 1 ? (
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{crumb.label}</span>
                                ) : (
                                    <Link href={crumb.url} className="hover:text-primary transition-colors">{crumb.label}</Link>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="max-w-4xl animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mode-aware-text tracking-tight mb-6 leading-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-lg md:text-xl mode-aware-subtext max-w-3xl leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT + SIDEBAR */}
            <div className="container mx-auto px-4 py-16">
                {children ? (
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
                        
                        {/* LEFT / CONTENT */}
                        <article className="flex-1 space-y-16 lg:w-2/3 max-w-full">
                            {sections.map((section) => (
                                <section key={section.id} id={section.id} className="scroll-mt-32">
                                    <h2 className="text-2xl md:text-3xl font-black mode-aware-text mb-6 flex items-center gap-3">
                                        <span className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl shadow-sm">
                                            <BookOpen size={20} />
                                        </span>
                                        {section.title}
                                    </h2>
                                    <div className="space-y-4 mode-aware-subtext text-lg leading-relaxed">
                                        {section.content}
                                    </div>
                                </section>
                            ))}

                            {/* CTA BLOCK */}
                            <div className="glass-card p-8 md:p-10 rounded-[2rem] mt-16 border border-primary/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black mode-aware-text mb-3">{cta?.title || "Ready to apply for your Indonesia Visa?"}</h3>
                                    <p className="mode-aware-subtext mb-8 text-lg">{cta?.desc || "Let our experts handle the bureaucracy while you focus on your journey. 100% legal, secure, and fast."}</p>
                                    <Link 
                                        href={formatNavLink(locale, cta?.link || "/apply")} 
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-black rounded-xl font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform"
                                    >
                                        {cta?.buttonText || "Start Application Now"}
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>

                            {/* LEGAL DISCLAIMER */}
                            <div className="mt-12 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm mode-aware-subtext flex flex-col sm:flex-row items-start gap-4">
                                <ShieldCheck className="text-gray-400 shrink-0 mt-1" size={24} />
                                <div>
                                    <p className="font-bold mb-1 text-gray-700 dark:text-gray-300">Legal Notice & Disclaimer</p>
                                    <p className="opacity-80 leading-relaxed text-[13px]">
                                        The information provided in this guide is for educational and informational purposes only and does not constitute official legal advice. Immigration rules in Indonesia are subject to sudden changes by the government. PT Indonesian Visas Agency provides premium administrative assistance and consulting services. Final immigration approval and entry authority remain solely with the Indonesian Directorate General of Immigration. Always consult with a registered consultant for your specific situation.
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* RIGHT / TABLE OF CONTENTS */}
                        <aside className="lg:w-1/3 hidden lg:block">
                            <div className="sticky top-28 bg-white/50 dark:bg-black/20 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide">
                                <h3 className="text-lg font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                    Table of Contents
                                </h3>
                                <nav className="flex flex-col gap-3">
                                    {sections.map((section) => (
                                        <Link 
                                            key={section.id} 
                                            href={`#${section.id}`}
                                            className={`transition-all border-l-2 pl-4 py-1 ${
                                                activeSection === section.id 
                                                ? "font-bold text-primary border-primary translate-x-1" 
                                                : "mode-aware-subtext border-transparent hover:text-primary hover:border-primary/50"
                                            }`}
                                        >
                                            <span className="text-sm leading-tight block">{section.title}</span>
                                        </Link>
                                    ))}
                                </nav>

                                <div className="mt-10 pt-8 border-t border-slate-200 dark:border-white/10">
                                    <p className="text-xs font-bold uppercase tracking-wider mode-aware-subtext mb-4">Verified Registered Sponsor</p>
                                    <div className="flex items-center gap-3 opacity-80">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                            <ShieldCheck size={18} className="text-primary" />
                                        </div>
                                        <div className="text-[11px] font-mono mode-aware-subtext leading-relaxed">
                                            <p className="font-bold text-gray-800 dark:text-gray-200">PT Indonesian Visas Agency</p>
                                            <p>NIB: 0402260034806</p>
                                            <p>Lic: 04022610215171007</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </PageWrapper>
    );    
}
