import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";
import { ShieldCheck, QrCode, ClipboardCheck, Info, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function VerificationExplainedPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);
    const t = dict?.verification_explained_page || {};

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="inline-block py-1 px-4 rounded-full bg-slate-100 dark:bg-white/5 mode-aware-subtext text-xs font-black tracking-[0.2em] uppercase border border-slate-200 dark:border-white/10">
                        {t.badge || "SYSTEM DOCUMENTATION"}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mode-aware-text tracking-tighter">
                        {t.title || "QR Verification System"}
                    </h1>
                    <p className="text-xl mode-aware-subtext max-w-2xl mx-auto font-medium leading-relaxed font-premium">
                        {t.description || "Explanation of the digital verification process for authorities, partners, and immigration officers."}
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="glass-card p-10 md:p-16 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-2xl space-y-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                    {/* How it Works */}
                    <section className="space-y-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <ShieldCheck size={28} />
                            </div>
                            <h2 className="text-3xl font-black mode-aware-text tracking-tight">{t.how_works_title || "How It Works"}</h2>
                        </div>
                        <p className="text-lg mode-aware-subtext leading-relaxed font-medium">
                            {t.how_works_p1}
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 pt-4">
                            {[
                                { title: t.step1_title || "1. Scan", desc: t.step1_desc, icon: QrCode },
                                { title: t.step2_title || "2. Verify", desc: t.step2_desc, icon: Info },
                                { title: t.step3_title || "3. Confirm", desc: t.step3_desc, icon: ClipboardCheck },
                            ].map((step, i) => (
                                <div key={i} className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] space-y-4 border border-slate-100 dark:border-white/5 group hover:border-primary/50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                        <step.icon size={20} />
                                    </div>
                                    <h3 className="text-xl font-black mode-aware-text">{step.title}</h3>
                                    <p className="text-sm mode-aware-subtext font-bold leading-relaxed opacity-80">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="h-px bg-slate-200 dark:bg-white/10 w-full" />

                    {/* Statuses */}
                    <section className="space-y-8">
                        <h2 className="text-3xl font-black mode-aware-text tracking-tight">{t.statuses_title || "Verification Statuses"}</h2>
                        <div className="grid gap-6">
                            <div className="flex items-start gap-6 p-8 bg-green-50/50 dark:bg-green-900/10 rounded-[2.5rem] border border-green-100 dark:border-green-500/20">
                                <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={32} />
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-green-700 dark:text-green-400 tracking-tight">{t.status_valid_title || "VALID (ACTIVE)"}</h4>
                                    <p className="text-green-900/70 dark:text-green-100/60 font-medium leading-relaxed">{t.status_valid_desc}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 p-8 bg-red-50/50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-500/20">
                                <XCircle className="text-red-500 shrink-0 mt-1" size={32} />
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-red-700 dark:text-red-400 tracking-tight">{t.status_invalid_title || "REVOKED / INVALID"}</h4>
                                    <p className="text-red-900/70 dark:text-red-100/60 font-medium leading-relaxed">{t.status_invalid_desc}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-slate-200 dark:bg-white/10 w-full" />

                    {/* Visibility */}
                    <section className="space-y-8">
                        <h2 className="text-3xl font-black mode-aware-text tracking-tight">{t.data_visibility_title || "Data Visibility"}</h2>
                        <p className="text-lg mode-aware-subtext leading-relaxed font-bold opacity-80">{t.data_visibility_p1}</p>
                        <ul className="grid md:grid-cols-2 gap-4">
                            {(t.data_list || []).map((item: string, i: number) => (
                                <li key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span className="text-sm font-black mode-aware-text uppercase tracking-wide">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="p-6 bg-slate-100 dark:bg-white/5 rounded-2xl border border-dashed border-slate-300 dark:border-white/20">
                            <p className="text-sm font-bold mode-aware-subtext italic opacity-60 text-center uppercase tracking-widest">
                                {t.privacy_note}
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-20 text-center space-y-8 max-w-3xl mx-auto px-4">
                    <div className="space-y-4">
                        <h5 className="text-xs font-black mode-aware-subtext uppercase tracking-[0.3em] opacity-40">{t.disclaimer_title || "LEGAL DISCLAIMER"}</h5>
                        <p className="text-sm font-bold mode-aware-subtext leading-relaxed opacity-60">
                            {t.disclaimer_text}
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mode-aware-text font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs shadow-sm"
                    >
                        <ArrowLeft size={16} />
                        {t.back_home || "Back to Home"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
