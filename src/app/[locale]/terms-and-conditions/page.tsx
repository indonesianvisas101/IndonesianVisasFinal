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
                            <p className="text-primary uppercase tracking-widest text-sm">Official Entity: PT Indonesian Visas Agency™</p>
                            <p>Parent Ecosystem: <span className="text-primary">Bali Enterprises Group</span></p>
                            <p>NIB (Registration): 0402260034806</p>
                            <p>AHU (Justice Min): AHU-00065.AH.02.01.TAHUN 2020</p>
                            <p>Address: Jl. Tibung Sari No.11C, Denpasar, Bali 80117</p>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-8 rounded-[2rem]">
                            <h3 className="text-xl font-black text-amber-900 dark:text-amber-100 mb-2 uppercase">Strict Legal Disclaimer</h3>
                            <p className="text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                                We are a private administrative agency. We <strong>cannot guarantee</strong> visa approval as all final decisions are made by the Indonesian Directorate General of Immigration. We operate as your representative to bridge the administrative gap.
                            </p>
                        </div>

                        <div className="grid gap-12 mode-aware-subtext leading-relaxed text-lg font-medium">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">1. Scope of Private Agency Services</h2>
                                <p>
                                    PT Indonesian Visas Agency™ provides document preparation, legal consultation, and sponsorship facilitation. By using this service, you acknowledge that you are hiring a <strong>third-party logistics and legal provider</strong>, not dealing directly with the government via this portal.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">2. Absolute Data Accuracy</h2>
                                <p>
                                    Clients are solely responsible for the authenticity of the documents provided. Any rejection based on falsified data or documentation is the sole liability of the client. The Agency shall not be held liable for immigration bans resulting from client misinformation.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">3. Rejection & Discretionary Delays</h2>
                                <p>
                                    Visa processing times are estimates provided by the government. The Agency is not responsible for "System Maintenances" at the Immigration level or discretionary delays caused by governmental scrutiny. We do not provide "guaranteed processing speed" as we do not control the final issuance.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">4. Sponsorship Obligations</h2>
                                <p>
                                    For KITAS/KITAP clients where the Agency acts as the official sponsor, the client agrees to maintain strict compliance with Indonesian law. Failure to report address changes or engage in illegal work allows the Agency to unilaterally report and cancel sponsored stay permits.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">5. Limitation of Liability</h2>
                                <p>
                                    In no event shall PT Indonesian Visas Agency™ be liable for any indirect, incidental, or consequential damages (including missed flights or business losses) arising out of visa rejections or processing delays. Our liability is limited to the service fee paid to the Agency.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">6. Governing Law & Dispute</h2>
                                <p>
                                    These terms are governed by the laws of the Republic of Indonesia. Any disputes arising from these terms shall be settled via the Denpasar District Court, Bali.
                                </p>
                            </section>
                        </div>

                        <div className="p-10 bg-primary/5 dark:bg-primary/20 rounded-[3rem] border border-primary/20">
                            <p className="text-lg font-bold italic mode-aware-text leading-relaxed">
                                Binding Agreement: By making a payment or initiating a document upload, you legally bind yourself to these Terms & Conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
