import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";

import { Metadata } from 'next';
import { ShieldCheck, Info, Clock, AlertTriangle, CreditCard, CheckCircle2 } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Refund Policy | Indonesian Visas Agency",
        description: "Official refund policy for visa and immigration services in Indonesia. Learn about our terms for cancellations and government denials.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/refund`,
        },
    };
}

export default async function RefundPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);
    
    const refundDetails = [
        {
            icon: <AlertTriangle className="text-amber-500" size={32} />,
            title: "Visa Application Denial",
            content: "If your e-VISA application is not approved by the Indonesian Government, we can provide a refund minus our 10% administration fee and the government Visa Fee."
        },
        {
            icon: <Info className="text-blue-500" size={32} />,
            title: "Force Majeure",
            content: "In the event of unforeseen circumstances beyond our control, such as natural disasters or political unrest, we reserve the right to modify or suspend our refund policy. Changes will be communicated promptly."
        },
        {
            icon: <AlertTriangle className="text-red-500" size={32} />,
            title: "Closure of Borders",
            content: "If regulation changes affect the validity of your e-VISA (e.g., border closures) after approval and the visa expires, we are unable to provide a refund."
        },
        {
            icon: <CheckCircle2 className="text-green-500" size={32} />,
            title: "Approved E-Visa",
            content: "Once your e-VISA has been approved by the authorities, we cannot provide a refund under any circumstances."
        },
        {
            icon: <Clock className="text-primary" size={32} />,
            title: "Processing Status",
            content: "If we have already sent your application to Immigration for processing and have paid the government billing, we cannot provide a refund."
        },
        {
            icon: <CreditCard className="text-purple-500" size={32} />,
            title: "Refund Method",
            content: "Refunds can only be processed back to the original account/method from which the payment was received. Credit card refunds may be processed via direct bank transfer."
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20 overflow-x-hidden">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4 md:px-0">
                    <div className="space-y-2 mb-12">
                        <h4 className="text-primary font-black uppercase tracking-[0.3em] text-xs">Financial Protection Framework</h4>
                        <h1 className="text-5xl md:text-8xl font-black mode-aware-text tracking-tighter leading-[0.9]">
                            Refund <br/>Policy.
                        </h1>
                    </div>

                    <div className="space-y-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-y border-slate-200 dark:border-white/10">
                            <p className="font-black text-slate-500 uppercase tracking-widest text-[10px]">
                                Version 2.5.0 | Revised May 2026
                            </p>
                            <p className="font-black text-primary uppercase tracking-widest text-[10px]">
                                Status: Active & Binding
                            </p>
                        </div>

                        {/* Core Terms Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {refundDetails.map((item, index) => (
                                <div key={index} className="p-8 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] space-y-4 hover:border-primary/30 transition-colors group">
                                    <div className="p-3 bg-white dark:bg-slate-900 w-fit rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-black mode-aware-text">{item.title}</h3>
                                    <p className="text-sm leading-relaxed mode-aware-subtext font-medium italic">
                                        {item.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Detailed Clauses */}
                        <div className="space-y-16 mode-aware-subtext leading-relaxed text-base md:text-lg font-medium">
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">01</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Cancellation Penalties</h2>
                                </div>
                                <p>
                                    If you choose to cancel your application before it is submitted to the Indonesian authorities, a standard <strong>10% administration fee</strong> applies to the total invoice amount. This fee covers human resource allocation and initial document verification work already performed.
                                </p>
                            </section>

                            <section className="space-y-6 p-8 md:p-12 bg-amber-500/5 border border-amber-500/20 rounded-[3rem]">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-amber-500/20 italic">02</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Onshore & Offshore Specifics</h2>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        "Bank transfer refunds will have the bank fee deducted from the final amount (Client bears transfer costs).",
                                        "Refund rates follow the official Indonesian bank currency rate at the time of processing.",
                                        "Refunds are not applicable for change of mind after initial consultation and documentation start."
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 shrink-0" />
                                            <span className="text-sm">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-8 pt-10 border-t border-slate-200 dark:border-white/10">
                                <div className="flex flex-col md:flex-row gap-10 items-start">
                                    <div className="flex-1 space-y-4">
                                        <h2 className="text-3xl font-black mode-aware-text tracking-tight">Refund Timeline</h2>
                                        <p className="text-sm font-bold text-slate-500 leading-relaxed italic">
                                            Refunds are processed within <strong>7-14 business days</strong> upon receipt of all required banking information. Requests must be sent formally via email to:
                                        </p>
                                        <p className="text-xl font-black text-primary hover:underline cursor-pointer">support@indonesianvisas.com</p>
                                    </div>
                                    <div className="w-full md:w-[400px] p-8 bg-slate-900 text-white rounded-[2.5rem] font-medium space-y-4 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <ShieldCheck size={200} />
                                        </div>
                                        <h3 className="text-lg font-black italic">Required Information</h3>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-black uppercase text-slate-400">
                                            <p>Invoice No</p>
                                            <p>Passport No</p>
                                            <p>Full Name</p>
                                            <p>Account Name</p>
                                            <p>Account Number</p>
                                            <p>Bank Swift/IBAN</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Final Consent Card */}
                        <div className="relative bg-slate-900 dark:bg-primary p-12 md:p-24 rounded-[4rem] text-white text-center shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20" />
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                            
                            <div className="relative z-10 space-y-8">
                                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm mb-4">
                                    <ShieldCheck className="text-primary-foreground" size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest">Guaranteed Transparency</span>
                                </div>
                                <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] italic">
                                    Financial <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-white">
                                        Clarity.
                                    </span>
                                </h2>
                                <p className="text-lg md:text-2xl font-bold opacity-80 max-w-2xl mx-auto leading-relaxed">
                                    Our refund policy is designed to be fair while respecting the irreversible nature of government fees and professional administrative labor.
                                </p>
                                <div className="pt-8">
                                    <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
