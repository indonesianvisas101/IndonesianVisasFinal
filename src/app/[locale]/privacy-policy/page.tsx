import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";
import Link from "next/link";

import { Metadata } from 'next';

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
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-black mode-aware-text mb-8 tracking-tighter">
                        {t.title || "Privacy Policy"}
                    </h1>

                    <div className="space-y-12">
                        <p className="font-black text-primary uppercase tracking-widest text-sm">
                            Last Updated: March 2026 | Version 2.1
                        </p>

                        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-6 rounded-2xl mb-12">
                            <p className="text-sm font-bold text-red-900 dark:text-red-100 uppercase tracking-wider mb-2">Government Non-Affiliation Notice</p>
                            <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed font-medium">
                                PT Indonesian Visas Agency™ is a <strong>privately owned administrative service provider</strong>. We are not the Indonesian Government and are not affiliated with the Directorate General of Immigration. The sole authority for visa issuance is <strong>evisa.imigrasi.go.id</strong>.
                            </p>
                        </div>

                        <div className="space-y-10 mode-aware-subtext leading-relaxed text-lg font-medium">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">1. Oversight & Entity Information</h2>
                                <p>
                                    This Privacy Policy governs the processing of personal data by <strong>PT Indonesian Visas Agency™</strong> (NIB: 0402260034806), hereafter referred to as "the Agency". We operate as a private administrative gateway for visa and stay permit document preparation.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">2. Data Acquisition</h2>
                                <p>To facilitate Indonesian immigration processes, we collect sensitive biometric and personal data including but not limited to:</p>
                                <ul className="space-y-3">
                                    {[
                                        "Passport Scans and Biometric Data",
                                        "National Identity Documents",
                                        "Financial Proof of Solvency Statements",
                                        "Personal Contact Information (Email, Phone, WhatsApp)",
                                        "Travel Itineraries and Accommodation Records"
                                    ].map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">3. Utilization & Legal Basis</h2>
                                <p>Your data is processed strictly for the legal basis of performing a contract with you. This includes:</p>
                                <ul className="space-y-3">
                                    {[
                                        "Preparation of sponsorship documents (Official Immigration Sponsor Status)",
                                        "Submission to governmental portals on your behalf",
                                        "Anti-fraud verification via our internal dashboard",
                                        "Mandatory reporting to local authorities (Police/Immigration) if required by Law No. 6 of 2011"
                                    ].map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">4. Data Retention & Archival</h2>
                                <p>
                                    Under the Agency's internal controls, sensitive passport data is typically purged from active web-accessible storage 90 days after service completion unless long-term sponsorship is active (e.g., KITAS). Encrypted archives are maintained for 5 years to comply with Indonesian Financial & Corporate Law.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">5. Your Rights (GDPR/CCPA Alignment)</h2>
                                <p>
                                    Regardless of your nationality, we provide the right to access, rectify, or request erasure of your data. To exercise these rights, please contact our Legal Compliance Officer.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">6. Official Legal Contact</h2>
                                <p>For all data-related inquiries or formal legal notices:</p>
                                <div className="p-8 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] font-bold space-y-2">
                                    <p className="text-primary uppercase tracking-wider text-sm">PT Indonesian Visas Agency™</p>
                                    <p>Legal & Compliance Department</p>
                                    <p>NIB: 0402260034806 | AHU-00065.AH.02.01.TAHUN 2020</p>
                                    <p>Jl. Tibung Sari No.11C, Denpasar, Bali 80117</p>
                                    <p className="border-t border-divider pt-2 mt-2">Email:</p>
                                    <p>indonesian@visas.agency</p>
                                    <p>contact@indonesianvisas.agency</p>
                                    <p>info@balihelp.id</p>
                                    <p>info@bali.enterprises</p>
                                </div>
                            </section>
                        </div>

                        <div className="bg-primary/5 dark:bg-primary/10 p-10 rounded-[3rem] border border-primary/20">
                            <p className="text-lg font-bold mode-aware-text leading-relaxed">
                                Consent: By initiating an application flow, you provide explicit consent for PT Indonesian Visas Agency™ to act as your administrative representative before Indonesian authorities.
                            </p>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
