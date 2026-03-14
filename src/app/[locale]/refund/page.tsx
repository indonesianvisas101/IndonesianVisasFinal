import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Refund Policy | Indonesian Visas Agency",
        description: "Official refund policy for Indonesian Visas. Information on visa application denial, force majeure, and cancellation procedures.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/refund`,
        },
    };
}

export default async function RefundPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);
    const t = dict?.refund_policy_page || {};

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-black mode-aware-text mb-8 tracking-tighter">
                        {t.title || "Refund Policy"}
                    </h1>

                    <div className="space-y-12">
                        <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-slate-100 dark:border-white/10 shadow-sm space-y-4 font-bold mode-aware-subtext text-sm md:text-base">
                            <p className="text-primary uppercase tracking-widest text-xs md:text-sm">Official Entity: PT Indonesian Visas Agency™</p>
                            <p>Ecosystem: <span className="text-primary">Bali Enterprises Indonesia</span></p>
                            <p>NIB (Registration): 0402260034806</p>
                            <p>AHU: AHU-00065.AH.02.01.TAHUN 2020</p>
                        </div>

                        <div className="grid gap-12 mode-aware-subtext leading-relaxed text-lg font-medium">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">1. Separation of Fees</h2>
                                <p>By engaging our services, you acknowledge that your payment consists of two distinct components:</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                        <span><strong>Agency Service Fee:</strong> Covers our administrative, legal, and consultation labor.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                        <span><strong>Government Immigration Fee:</strong> The exact tariff required by Indonesian Immigration (PNBP).</span>
                                    </li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">2. Non-Refundability of Government Fees</h2>
                                <div className="bg-red-50 dark:bg-red-900/10 border-l-8 border-red-500 p-8 rounded-[2rem] shadow-sm">
                                    <p className="font-bold text-red-900 dark:text-red-100">
                                        Once a visa application is submitted to the immigration portal and the PNBP (government tariff) is paid, these funds are strictly non-refundable under Indonesian Ministry of Finance regulations. The Agency has no authority to retrieve these funds.
                                    </p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">3. Agency Service Fee Refunds</h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                        <span><strong>Before Submission:</strong> If you cancel before we submit to immigration, we can refund up to 70% of the Agency Service Fee (minus consultation and bank charges).</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                        <span><strong>After Submission/Rejection:</strong> The Agency Service Fee is non-refundable as the labor for document preparation and submission has been completed.</span>
                                    </li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">4. Force Majeure & Policy Changes</h2>
                                <p>
                                    In the event of sudden governmental policy changes (e.g., border closures, new visa bans), the Agency will allow for a credit-note issuance valid for 12 months, rather than a cash refund, to facilitate your entry once regulations allow.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">5. Refund Timeline</h2>
                                <p>
                                    Approved refunds are processed within 14-30 business days through the original payment method (Bank Transfer or Midtrans/Doku gateway).
                                </p>
                            </section>
                        </div>

                        <div className="p-10 bg-primary/5 dark:bg-primary/20 rounded-[3rem] border border-primary/20">
                            <p className="text-lg font-bold italic mode-aware-text leading-relaxed">
                                Financial Acknowledgment: By completing a payment transaction, you testify that you have read and agreed to this strict fee-separation and refund hierarchy.
                            </p>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
