import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";

import { Metadata } from 'next';
import { ShieldCheck } from "lucide-react";

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
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20 overflow-x-hidden">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4 md:px-0">
                    <div className="space-y-2 mb-12">
                        <h4 className="text-primary font-black uppercase tracking-[0.3em] text-xs">Financial Sovereignty</h4>
                        <h1 className="text-5xl md:text-8xl font-black mode-aware-text tracking-tighter leading-[0.9]">
                            Refund <br/>Policy.
                        </h1>
                    </div>

                    <div className="space-y-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-y border-slate-200 dark:border-white/10">
                            <p className="font-black text-slate-500 uppercase tracking-widest text-[10px]">
                                Version 2.4.0 | Revised April 2026
                            </p>
                            <p className="font-black text-primary uppercase tracking-widest text-[10px]">
                                Financial Entity: PT Indonesian Visas Agency™
                            </p>
                        </div>

                        {/* Crucial Financial Notice */}
                        <div className="relative p-10 md:p-14 bg-slate-900 text-white rounded-[3rem] overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck size={180} />
                            </div>
                            <h3 className="text-2xl font-black mb-6 tracking-tight italic">Fee Separation Protocol</h3>
                            <p className="text-slate-400 leading-relaxed font-medium mb-8">
                                Payments made to PT Indonesian Visas Agency™ are split into two distinct financial categories:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                    <h4 className="text-primary uppercase tracking-widest text-[10px] font-black mb-2">01. Government Tariff (PNBP)</h4>
                                    <p className="text-sm">Mandatory immigration fees paid directly to the Indonesian Ministry of Finance. Strictly non-refundable once processed.</p>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                    <h4 className="text-primary uppercase tracking-widest text-[10px] font-black mb-2">02. Agency Professional Fee</h4>
                                    <p className="text-sm">Fees for administrative labor, legal sponsorship, and digital logistics. Subject to partial refundability based on service status.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-16 mode-aware-subtext leading-relaxed text-base md:text-lg font-medium">
                            {/* Section 1 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">01</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Non-Refundable Government Assets</h2>
                                </div>
                                <div className="bg-red-500/5 border-l-4 border-red-500 p-8 rounded-2xl">
                                    <p className="text-red-900/80 dark:text-red-200/80 font-bold">
                                        Per Indonesian Ministry of Finance (Kemenkeu) regulations, government visa fees (PNBP) submitted to the sovereign portal are non-retrievable. The Agency holds no authority to initiate refunds for these government-held assets.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">02</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Agency Fee Refund Hierarchy</h2>
                                    </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 border border-slate-200 dark:border-white/10 rounded-[2rem] space-y-4">
                                        <h3 className="text-xl font-black mode-aware-text">Pre-Submission</h3>
                                        <p className="text-sm opacity-80">Cancellations before document submission to government portals are eligible for a <strong>70% refund</strong> of the Agency Service Fee.</p>
                                    </div>
                                    <div className="p-8 border border-slate-200 dark:border-white/10 rounded-[2rem] bg-slate-50 dark:bg-white/5 space-y-4">
                                        <h3 className="text-xl font-black mode-aware-text">Post-Submission</h3>
                                        <p className="text-sm opacity-80">Once documents are submitted or rejected by immigration, the Agency Service Fee is <strong>100% non-refundable</strong> due to completed administrative labor.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">03</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Transaction & Gateway Deductions</h2>
                                </div>
                                <p>
                                    All approved refunds are subject to deductions of third-party transaction fees. This includes but is not limited to <strong>DOKU, PayPal, and Midtrans</strong> gateway charges (typically 2.9% - 5% + fixed fee), which are non-retrievable from the financial processors.
                                </p>
                            </section>

                            {/* Section 4 */}
                            <section className="space-y-6 p-8 md:p-12 bg-red-600 text-white rounded-[3rem] shadow-2xl">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-white/20 italic">04</span>
                                    <h2 className="text-3xl font-black tracking-tight">Fraud & Chargeback Warning</h2>
                                </div>
                                <p className="text-white/80 font-bold italic">
                                    Attempting a "friendly fraud" chargeback through your bank after service initiation or visa issuance will result in immediate termination of sponsorship and a formal report to the Indonesian Immigration Intelligence Directorate. This may lead to permanent entry bans and legal prosecution under Indonesian Electronic Transaction Law (UU ITE).
                                </p>
                            </section>

                            {/* Section 5 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">05</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Force Majeure Credit Notes</h2>
                                </div>
                                <p>
                                    In scenarios of pandemic-related border closures or sudden legislative changes, the Agency may issue a <strong>12-Month Credit Note</strong> in lieu of a cash refund, ensuring your service value remains protected for future use.
                                </p>
                            </section>
                        </div>

                        {/* Final Policy Acceptance Card */}
                        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-12 md:p-20 rounded-[4rem] text-white text-center shadow-2xl">
                            <div className="space-y-8 relative z-10">
                                <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight italic">Finality of <br/>Payment.</h2>
                                <p className="text-lg md:text-2xl font-bold opacity-80 max-w-2xl mx-auto">
                                    Completing a payment on this platform constitutes a legally binding signature that you have read, understood, and accepted this Refund Policy in its entirety.
                                </p>
                                <div className="flex justify-center pt-8">
                                    <div className="px-8 py-3 bg-white/10 border border-white/20 rounded-2xl">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Financial Compliance Dept.</p>
                                        <p className="font-bold">PT Indonesian Visas Agency™</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
