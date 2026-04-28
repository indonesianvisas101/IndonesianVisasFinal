import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";

import { Metadata } from 'next';
import { ShieldCheck } from "lucide-react";

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
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20 overflow-x-hidden">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4 md:px-0">
                    <div className="space-y-2 mb-12">
                        <h4 className="text-primary font-black uppercase tracking-[0.3em] text-xs">Contractual Agreement</h4>
                        <h1 className="text-5xl md:text-8xl font-black mode-aware-text tracking-tighter leading-[0.9]">
                            Terms & <br/>Conditions.
                        </h1>
                    </div>

                    <div className="space-y-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-y border-slate-200 dark:border-white/10">
                            <p className="font-black text-slate-500 uppercase tracking-widest text-[10px]">
                                Version 4.1.2 | Revised April 2026
                            </p>
                            <p className="font-black text-primary uppercase tracking-widest text-[10px]">
                                Governing Law: Republic of Indonesia
                            </p>
                        </div>

                        <div className="bg-slate-900 text-white p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck size={300} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-2xl font-black tracking-tight italic">Corporate Identification</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                    <div className="space-y-1 text-slate-400">
                                        <p className="text-primary uppercase tracking-widest text-[10px] font-black">Contracting Entity</p>
                                        <p className="text-white font-black text-lg">PT Indonesian Visas Agency™</p>
                                        <p>Bali Enterprises Group Ecosystem</p>
                                    </div>
                                    <div className="space-y-1 text-slate-400">
                                        <p className="text-primary uppercase tracking-widest text-[10px] font-black">Registration Authority</p>
                                        <p className="text-white font-black">NIB: 0402260034806</p>
                                        <p>AHU-00065.AH.02.01.TAHUN 2020</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-16 mode-aware-subtext leading-relaxed text-base md:text-lg font-medium">
                            {/* Section 1 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">01</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Scope of Professional Agency</h2>
                                </div>
                                <p>
                                    PT Indonesian Visas Agency™ (the "Agency") acts exclusively as a private administrative facilitator and legal liaison. We provide document preparation, sponsorship guarantees, and logistics for Indonesian immigration processes. We are <strong>not</strong> the visa-issuing authority. The sovereign right to grant or deny entry remains solely with the Indonesian Directorate General of Immigration.
                                </p>
                            </section>

                            {/* Section 2 */}
                            <section className="space-y-6 p-8 md:p-12 bg-amber-500/5 border border-amber-500/20 rounded-[3rem]">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-amber-500/20 italic">02</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Financial Terms & Pricing</h2>
                                </div>
                                <p>
                                    Our service fees are transparent and all-inclusive of <strong>VAT (PPN 11%)</strong> and applicable <strong>PPH 23</strong> corporate taxes. 
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 shrink-0" />
                                        <span className="text-sm"><strong>Price Finality:</strong> All quoted prices on the platform are final at the time of payment.</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 shrink-0" />
                                        <span className="text-sm"><strong>Payment Gateways:</strong> Transaction fees (DOKU/PayPal/Midtrans) are processed as part of the total invoice and are non-refundable.</span>
                                    </li>
                                </ul>
                            </section>

                            {/* Section 3 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">03</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Absolute Document Integrity</h2>
                                </div>
                                <p>
                                    The Client warrants that all information provided—specifically Passport Biometrics and Financial Statements—is authentic and unaltered. The Agency holds <strong>zero liability</strong> for immigration rejections, blacklisting, or legal prosecution resulting from the submission of fraudulent data by the client.
                                </p>
                            </section>

                            {/* Section 4 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">04</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Sponsorship & Legal Conduct</h2>
                                </div>
                                <p>
                                    For KITAS/KITAP residents where the Agency serves as the "Sponsor of Record", the Client must adhere to all local regulations. Any involvement in illegal activities or unauthorized employment gives the Agency the immediate right to <strong>revoke sponsorship</strong> and report the Client to the authorities.
                                </p>
                            </section>

                            {/* Section 5 */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-primary/20 italic">05</span>
                                    <h2 className="text-3xl font-black mode-aware-text tracking-tight">Governing Law & Jurisdiction</h2>
                                </div>
                                <p>
                                    This agreement is governed by the laws of the Republic of Indonesia. Any disputes that cannot be resolved through amicable mediation shall be brought before the <strong>District Court of Denpasar (Pengadilan Negeri Denpasar)</strong>, Bali.
                                </p>
                            </section>
                        </div>

                        {/* Agreement Card */}
                        <div className="relative bg-primary p-12 md:p-20 rounded-[4rem] text-white text-center shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
                            <div className="relative z-10 space-y-8">
                                <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight">Legally <br/>Binding.</h2>
                                <p className="text-lg md:text-2xl font-bold opacity-80 max-w-2xl mx-auto">
                                    By initiating any financial transaction or uploading documentation, you acknowledge full acceptance of these Terms & Conditions without reservation.
                                </p>
                                <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-8">
                                    <div className="text-left border-l-4 border-white/20 pl-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Corporate Seal</p>
                                        <p className="font-black text-lg">Indonesian Visas Agency</p>
                                    </div>
                                    <div className="text-left border-l-4 border-white/20 pl-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Compliance</p>
                                        <p className="font-black text-lg">NIB 0402260034806</p>
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
