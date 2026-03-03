import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";
import Link from "next/link";

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
                            {t.last_updated || "Last Updated: January 2026"}
                        </p>

                        <div className="space-y-10 mode-aware-subtext leading-relaxed text-lg font-medium">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.intro_title || "1. Introduction"}</h2>
                                <p>{t.intro_p1 || "Indonesian Visas is committed to protecting your privacy."}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.data_collect_title || "2. Data We Collect"}</h2>
                                <p>{t.data_collect_p1 || "We collect personal data necessary for visa processing:"}</p>
                                <ul className="space-y-3">
                                    {(t.data_collect_list || []).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.data_use_title || "3. Use of Your Data"}</h2>
                                <p>{t.data_use_p1 || "Your data is used strictly for:"}</p>
                                <ul className="space-y-3">
                                    {(t.data_use_list || []).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.data_protection_title || "4. Data Protection & Security"}</h2>
                                <p>{t.data_protection_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.rights_title || "5. Your Rights"}</h2>
                                <p>{t.rights_p1}</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black mode-aware-text">{t.contact_title || "6. Contact Us"}</h2>
                                <p>{t.contact_p1}</p>
                                <div className="p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] font-bold">
                                    {t.contact_address?.split('\n').map((line: string, i: number) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="bg-primary/5 dark:bg-primary/10 p-10 rounded-[3rem] border border-primary/20">
                            <p className="text-lg font-bold mode-aware-text leading-relaxed">
                                {t.ack_text || "Acknowledgment: By using our services, you agree to this policy."}
                            </p>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
