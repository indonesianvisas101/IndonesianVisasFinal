import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { getMessages } from "@/i18n/getMessages";
import { ShieldCheck, QrCode, ClipboardCheck, Info, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import VerificationClient from "./VerificationClient";

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

                    {/* Main Interactive Content */}
                    <VerificationClient t={t} />

                    <div className="h-px bg-slate-200 dark:bg-white/10 w-full" />

                    <section className="space-y-8">
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
