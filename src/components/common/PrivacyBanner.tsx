"use client";

import React, { useState, useEffect } from "react";
import { m, AnimatePresence, LazyMotion, domMax } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, X, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { formatNavLink } from "@/utils/seo";

const PrivacyBanner = () => {
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 1. Check if already consented
        const hasConsented = localStorage.getItem("iv_privacy_consent_v1");
        if (hasConsented) return;

        // 2. Delayed appearance (3 seconds) to ensure perfect LCP and user engagement
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleAccept = () => {
        localStorage.setItem("iv_privacy_consent_v1", "true");
        setIsVisible(false);
    };

    const handleDecline = () => {
        setIsVisible(false);
        // We can add logic to disable non-essential tracking here if needed
    };

    return (
        <LazyMotion features={domMax}>
            <AnimatePresence>
                {isVisible && (
                    <m.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="fixed bottom-4 left-4 right-4 z-[9999] flex justify-center pointer-events-none"
                    >
                        <div className="w-full max-w-6xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.2)] rounded-3xl p-5 md:p-3 pointer-events-auto overflow-hidden relative group">
                            {/* Animated Accent Line */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-1">
                                {/* Left Section: Info */}
                                <div className="flex items-center gap-5">
                                    <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center text-primary shrink-0 rotate-3 group-hover:rotate-0 transition-transform">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">Global Privacy & Cache Standard</h4>
                                        <p className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold max-w-xl">
                                            We prioritize your digital safety. We use secure cookies & local caching to ensure 100% data integrity during your application. 
                                            Read our <span className="text-primary italic">International Data Protection Agreement</span> for more info.
                                        </p>
                                    </div>
                                </div>

                                {/* Right Section: Actions */}
                                <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                                    <Link 
                                        href={formatNavLink(locale, "/privacy-policy")}
                                        className="px-4 py-2 text-[10px] font-bold uppercase text-slate-500 hover:text-primary transition-colors"
                                    >
                                        Privacy Policy
                                    </Link>

                                    <button
                                        onClick={handleDecline}
                                        className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                    >
                                        No, Decline
                                    </button>

                                    <button
                                        onClick={handleAccept}
                                        className="group/btn flex items-center gap-3 bg-gray-500 text-white px-8 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-tighter hover:bg-gray-600 hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-gray-500/25 border border-white/10"
                                    >
                                        Accept & Continue <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </LazyMotion>
    );
};

export default PrivacyBanner;
