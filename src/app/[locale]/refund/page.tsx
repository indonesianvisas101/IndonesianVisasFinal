import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";

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
                            <p className="text-primary uppercase tracking-widest text-xs md:text-sm">INDONESIAN VISAS - PT Indonesian Visas Agency™</p>
                            <p>Under the linked company: <span className="text-primary">PT Bali Enterprises Indonesia</span></p>
                            <p>Address: Jl. Tibung Sari No.11C, Padangsambian Kaja, Denpasar Barat, Denpasar, Bali 80117</p>
                            <p>Official Websites : www.indonesianvisas.com | www.balihelp.id | www.indodesign.website</p>
                        </div>

                        <div className="grid gap-12 mode-aware-subtext leading-relaxed text-lg font-medium">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.denial_title || "Visa Application Denial"}</h2>
                                <p>{t.denial_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.force_majeure_title || "Force Majeure"}</h2>
                                <p>{t.force_majeure_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.approved_title || "Approved Visa"}</h2>
                                <p>{t.approved_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text text-red-600 dark:text-red-400">{t.submission_title || "Submission to Immigration"}</h2>
                                <div className="bg-red-50 dark:bg-red-900/10 border-l-8 border-red-500 p-8 rounded-[2rem] shadow-sm">
                                    <p className="font-bold text-red-900 dark:text-red-100">{t.submission_p1}</p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.cancellation_title || "Cancellation Policy"}</h2>
                                <p>{t.cancellation_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.method_title || "Refund Method & Timeline"}</h2>
                                <p>{t.method_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.exclusions_title || "Refund Exclusions"}</h2>
                                <p>{t.exclusions_p1}</p>
                            </section>
                        </div>

                        <div className="p-10 bg-primary/5 dark:bg-primary/20 rounded-[3rem] border border-primary/20">
                            <p className="text-lg font-bold italic mode-aware-text leading-relaxed">
                                By using our services, clients acknowledge that they have read and agreed to this policy.
                            </p>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
