import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Terms & Conditions | Indonesian Visas Agency",
        description: "Official terms and conditions for our visa and immigration services in Indonesia. Understand our service scope and client obligations.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/terms-and-conditions`,
        },
    };
}

export default async function TermsAndConditionsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);
    const t = dict?.terms_conditions_page || {};

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-black mode-aware-text mb-8 tracking-tighter">
                        {t.title || "Terms & Conditions"}
                    </h1>

                    <div className="space-y-12">
                        <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-slate-100 dark:border-white/10 shadow-sm space-y-4 font-bold mode-aware-subtext">
                            <p className="text-primary uppercase tracking-widest text-sm">INDONESIAN VISAS - PT Indonesian Visas Agency™</p>
                            <p>Under the linked company: <span className="text-primary">PT Bali Enterprises Indonesia</span></p>
                            <p>Address: Jl. Tibung Sari No.11C, Padangsambian Kaja, Denpasar Barat, Denpasar, Bali 80117</p>
                            <p>Official Websites : www.indonesianvisas.com | www.balihelp.id | www.indodesign.website</p>
                        </div>

                        <div className="grid gap-12 mode-aware-subtext leading-relaxed text-lg font-medium">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.company_info_title || "Company Information"}</h2>
                                <p>{t.company_info_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.scope_title || "Scope of Services"}</h2>
                                <p>{t.scope_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.approval_title || "Visa Approval"}</h2>
                                <p>{t.approval_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.obligations_title || "Client Obligations"}</h2>
                                <p>{t.obligations_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.payments_title || "Payments & Refunds"}</h2>
                                <p>{t.payments_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.liability_title || "Liability Limitation"}</h2>
                                <p>{t.liability_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.dispute_title || "Dispute Resolution"}</h2>
                                <p>{t.dispute_p1}</p>
                            </section>
                        </div>

                        <div className="p-10 bg-primary/5 dark:bg-primary/20 rounded-[3rem] border border-primary/20">
                            <p className="text-lg font-bold italic mode-aware-text leading-relaxed">
                                {t.ack_italic || "By using our services, you agree to these terms."}
                            </p>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
