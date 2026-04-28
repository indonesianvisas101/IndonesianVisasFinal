import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";
import Link from "next/link";

import { Metadata } from 'next';
import { ShieldCheck } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Privacy Policy | Indonesian Visas",
        description: "Official privacy policy for Indonesian Visas. Learn how we protect your personal data and documents during the visa application process.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/privacy-policy`,
        },
    };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);
    const t = dict?.privacy_policy_page || {};

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20 overflow-x-hidden">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4 md:px-0">
                    <div className="space-y-2 mb-12">
                        <h4 className="text-primary font-black uppercase tracking-[0.3em] text-xs">Legal Transparency Framework</h4>
                        <h1 className="text-5xl md:text-8xl font-black mode-aware-text tracking-tighter leading-[0.9]">
                            Privacy <br/>Policy.
                        </h1>
                    </div>

                    <div className="space-y-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-y border-slate-200 dark:border-white/10">
                            <p className="font-black text-slate-500 uppercase tracking-widest text-[10px]">
                                Version 3.0.4 | Effective April 2026
                            </p>
                            <p className="font-black text-primary uppercase tracking-widest text-[10px]">
                                Fully Compliant with Indonesian Law No. 27/2022 (PDP)
                            </p>
                        </div>

                        {/* Professional Disclaimer */}
                        <div className="relative p-8 md:p-10 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShieldCheck size={120} className="text-red-500" />
                            </div>
                            <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-4">Official Regulatory Disclosure</p>
                            <p className="text-sm md:text-base text-red-900/80 dark:text-red-100/70 leading-relaxed font-bold italic">
                                PT Indonesian Visas Agency™ is a private administrative gateway. We are not a government body. We operate under Indonesian Corporate Law to facilitate document preparation for submission to the Directorate General of Immigration (evisa.imigrasi.go.id). Usage of our platform constitutes agreement that we act as your legal administrative representative.
                            </p>
                        </div>

                        <div className="space-y-16 mode-aware-subtext leading-relaxed text-base md:text-lg font-medium">
                            {/* Section 1 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">01</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Scope of Data Protection</h2>
                                </div>
                                <p>
                                    Under the Global Privacy Standards, we define "Personal Data" as any information that identifies you as a unique individual. Our infrastructure is built on the principle of <strong>Data Minimization</strong>—we only collect what is strictly necessary for Indonesian Immigration approval.
                                </p>
                            </section>

                            {/* Section 2: Cookies & Cache (New Detailed Section) */}
                            <section className="space-y-6 p-8 md:p-12 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-200 dark:border-white/10">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">02</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Cookies & Cache Infrastructure</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <h3 className="font-black text-primary uppercase text-xs tracking-widest">A. Functional Caching</h3>
                                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                            We utilize browser <strong>Local Storage</strong> to save your application progress. This ensures that in the event of a network failure, your uploaded passport scans and biometric data remain secure and retrievable without re-uploading.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="font-black text-primary uppercase text-xs tracking-widest">B. Persistent Cookies</h3>
                                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                            Our system uses secure session cookies to verify your identity across our dashboard. These are encrypted tokens that prevent unauthorized access to your visa documents during the active processing phase.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">03</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Data Acquisition Framework</h2>
                                    </div>
                                <p>To facilitate sovereign immigration processes, we process:</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "High-Resolution Biometric Passport Scans",
                                        "Bank Statement Liquidity Proofs",
                                        "National Health/Vaccination Records",
                                        "Official Domicile & Travel Itineraries",
                                        "Criminal Record Clearances (where applicable)"
                                    ].map((item: string, i: number) => (
                                        <li key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            <span className="text-sm font-bold">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Section 4 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">04</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Security & Encryption Standards</h2>
                                </div>
                                <p>
                                    Your data is protected by <strong>AES-256 Bit Encryption</strong> at rest and <strong>TLS 1.3</strong> during transit. Our servers are hosted on sovereign-compliant cloud infrastructure with strict access controls. Only authorized Legal Officers of PT Indonesian Visas Agency™ with specific security clearance can access your biometric files.
                                </p>
                            </section>

                            {/* Section 5 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">05</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Your Rights (GDPR & PDP Law)</h2>
                                </div>
                                <p>
                                    We uphold the highest global standards for data sovereignty. You have the permanent right to:
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {["Right to Access", "Right to Rectify", "Right to Erase", "Right to Portability"].map((right, i) => (
                                        <div key={i} className="p-4 bg-primary/5 border border-primary/10 rounded-2xl text-center">
                                            <p className="text-[10px] font-black uppercase text-primary">{right}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Official Contact */}
                            <section className="space-y-8 pt-10 border-t border-slate-200 dark:border-white/10">
                                <div className="flex flex-col md:flex-row gap-10 items-start">
                                    <div className="flex-1 space-y-4">
                                        <h2 className="text-3xl font-black mode-aware-text tracking-tight">Legal Liaison</h2>
                                        <p className="text-sm font-bold text-slate-500">
                                            Our Data Protection Officer (DPO) is available for formal inquiries regarding your personal information sovereignty.
                                        </p>
                                    </div>
                                    <div className="w-full md:w-[400px] p-8 bg-slate-900 text-white rounded-[2.5rem] font-medium space-y-4 shadow-2xl">
                                        <div className="space-y-1">
                                            <p className="text-primary uppercase tracking-[0.2em] text-[10px] font-black">Data Controller Entity</p>
                                            <p className="text-xl font-black">PT Indonesian Visas Agency™</p>
                                        </div>
                                        <div className="text-sm text-slate-400 space-y-1">
                                            <p>NIB: 0402260034806</p>
                                            <p>AHU: AHU-00065.AH.02.01.TAHUN 2020</p>
                                            <p>Bali Headquarters: Denpasar, 80117</p>
                                        </div>
                                        <div className="pt-4 border-t border-white/10 space-y-2">
                                            <p className="text-primary uppercase tracking-[0.2em] text-[10px] font-black">Secure Inquiries</p>
                                            <p className="text-sm font-bold hover:text-primary transition-colors cursor-pointer underline">legal@indonesianvisas.com</p>
                                            <p className="text-sm font-bold hover:text-primary transition-colors cursor-pointer underline">contact@indonesianvisas.agency</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Final Consent Card */}
                        <div className="relative bg-gradient-to-br from-primary to-indigo-600 p-1 md:p-1.5 rounded-[3.5rem] shadow-2xl">
                            <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] text-center space-y-6">
                                <h2 className="text-3xl md:text-5xl font-black mode-aware-text tracking-tighter">Agreement to Process.</h2>
                                <p className="text-base md:text-xl font-bold mode-aware-subtext leading-relaxed max-w-2xl mx-auto">
                                    By proceeding with any visa application service, you grant PT Indonesian Visas Agency™ a limited power of attorney to process your personal data for official government submission.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
