import React from "react";
import { Shield, CheckCircle, Users, Gavel, FileText, Globe, Scale, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Image from "next/image";

export default function LegalExpertsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = React.use(params);
    return (
        <PageWrapper className="bg-white dark:bg-[#030712] transition-colors duration-300">
            {/* 1. HERO */}
            <section className="relative pt-32 pb-20 overflow-hidden text-center">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
                 <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                            <Gavel size={16} /> Licensed Immigration Attorneys
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mode-aware-text tracking-tighter">
                            Legal Experts and Policy Specialists
                        </h1>
                        <p className="text-xl md:text-2xl mode-aware-subtext max-w-2xl mx-auto leading-relaxed">
                            Ensuring 100% legal compliance for every traveler, investor, and business professional entering the Republic of Indonesia.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. CORE VALUE */}
            <SectionWrapper id="legal-core" className="py-20 text-center">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                    <div className="p-12 rounded-[3rem] bg-slate-900 text-white space-y-6">
                        <Scale size={48} className="text-primary mx-auto mb-4" />
                        <h3 className="text-3xl font-black">Zero-Risk Policy</h3>
                        <p className="text-lg opacity-70 leading-relaxed">We never take shortcuts. Every application is reviewed by a licensed Indonesian advocate to ensure it meets the latest Ministry of Law (Kemenkumham) requirements.</p>
                    </div>
                    <div className="p-12 rounded-[3rem] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 space-y-6">
                        <ShieldCheck size={48} className="text-primary mx-auto mb-4" />
                        <h3 className="text-3xl font-black mode-aware-text">Official Sponsorship</h3>
                        <p className="text-lg mode-aware-subtext leading-relaxed">As a registered PT Indonesian Visas Agency, we provide full legal sponsorship, protecting you from common agent frauds and administrative pitfalls.</p>
                    </div>
                </div>
            </SectionWrapper>

            {/* 3. EXPERIENCE SECTION */}
            <SectionWrapper id="expertise" className="py-24 bg-slate-50 dark:bg-white/5">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-white/10">
                        <Image src="/images/Team.webp" alt="Legal Team" fill className="object-cover" />
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black mode-aware-text">Decades of Regulatory Experience</h2>
                        <p className="text-xl mode-aware-subtext">Our team includes former immigration officers and expert legal analysts who stay ahead of Indonesian bureaucracy.</p>
                        <ul className="grid grid-cols-1 gap-6">
                            {[
                                { title: "Policy Advocacy", desc: "We liaise directly with the Directorate General of Immigration." },
                                { title: "Document Integrity", desc: "Multi-layered verification for all supporting letters and IDs." },
                                { title: "Compliance Audits", desc: "Regular internal audits to maintain our 99% success rate." }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="mt-1"><CheckCircle className="text-primary" size={20} /></div>
                                    <div>
                                        <div className="font-bold mode-aware-text text-lg">{item.title}</div>
                                        <div className="text-sm mode-aware-subtext">{item.desc}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </SectionWrapper>

            {/* 4. SECTORS COVERED */}
            <SectionWrapper id="sectors" className="py-24 text-center">
                <h2 className="text-4xl font-black mode-aware-text mb-16">Global Sectors We Support</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { name: "Tech & Remote", icon: Globe },
                        { name: "Manufacturing", icon: Building2 },
                        { name: "Real Estate", icon: MapPin },
                        { name: "Strategic Investment", icon: ShieldIcon },
                    ].map((sector, i) => (
                        <div key={i} className="space-y-4">
                            <div className="w-20 h-20 mx-auto rounded-3xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20">
                                <sector.icon size={32} />
                            </div>
                            <div className="font-bold mode-aware-text">{sector.name}</div>
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* 5. FAQS FOR LEGAL */}
            <SectionWrapper id="legal-faq" className="py-20 max-w-4xl mx-auto">
                 <h2 className="text-3xl font-black mode-aware-text mb-10 flex items-center gap-2">
                    <HelpCircle className="text-primary" /> Legal Consultation FAQ
                 </h2>
                 <div className="space-y-6">
                    {[
                        { q: "Is your agency officially registered?", a: "Yes, PT Indonesian Visas Agency is a fully licensed entity with NIB: 0402260034806 and official AHU registration." },
                        { q: "Do you handle KITAS for investors?", a: "Yes, we specialize in E28A Investment KITAS and other long-term stay permits with full legal sponsorship." },
                        { q: "What happens if immigration rules change?", a: "Our legal team monitors updates daily. If a policy change affects your pending application, we adapt it immediately at no extra cost." }
                    ].map((faq, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                            <div className="font-black mode-aware-text mb-2">{faq.q}</div>
                            <div className="mode-aware-subtext text-sm leading-relaxed">{faq.a}</div>
                        </div>
                    ))}
                 </div>
            </SectionWrapper>

            {/* 6. CONSTITUTION BOX */}
            <SectionWrapper id="constitution" className="py-24">
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden border border-white/10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[120px]" />
                    <div className="relative z-10 space-y-12">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-black mb-6">Our Legal Constitution</h2>
                            <p className="text-xl text-white/70 leading-relaxed">
                                We operate under a strict internal constitution that prioritizes client safety, regional laws, and professional integrity above all else. This is our promise to every traveler.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-8 justify-center">
                            <Link href={`/${locale}/contact`} className="px-10 py-5 bg-white text-black rounded-2xl font-black hover:scale-105 transition-all flex items-center gap-2">
                                Request Legal Audit <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </PageWrapper>
    );
}

// Reused components from Lucide for simpler code
const Building2 = ({ size }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>;
const MapPin = ({ size }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const ShieldIcon = ({ size }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>;
