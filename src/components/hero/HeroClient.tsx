"use client";

import React from "react";
import styles from "./Hero.module.css";
import { useApplication } from "../application/ApplicationContext";
import { runWhenIdle } from "@/utils/scheduler";
import dynamic from "next/dynamic";
import Link from "next/link"; 
import { ArrowRight, ShieldCheck, Zap, Info, Copy, Check, X } from "lucide-react"; 
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { formatNavLink } from "@/utils/seo";
import { useParams } from "next/navigation";

const HeroGlobe = dynamic(() => import("./HeroGlobe"), { 
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0" />
});
import CentralInfoPopup, { StaticPopupInfo } from "../common/CentralInfoPopup";
import { getStepPopups, getStatPopups } from "./HeroPopups";
import Portal from "../common/Portal";

export const HeroGlobeWrapper = () => {
    const [isMounted, setIsMounted] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // Higher performance: only load when visible and the thread is IDLE
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Wait for the main thread to be idle, then wait for the user to be engaged
                runWhenIdle(() => {
                    const timer = setTimeout(() => {
                        setIsMounted(true);
                    }, 800); // Faster mounting for better Speed Index
                    return () => clearTimeout(timer);
                });
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none">
            <LazyMotion features={domAnimation}>
                <AnimatePresence>
                    {isMounted && (
                        <m.div
                            id="globe-render-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 4, ease: "easeInOut" }}
                            style={{ 
                                position: 'absolute',
                                inset: 0,
                                zIndex: 10,
                                background: 'transparent'
                            }}
                        >
                            <HeroGlobe />
                        </m.div>
                    )}
                    {!isMounted && (
                        <div className={`absolute inset-0 z-0 flex items-center justify-center`}>
                            <div className={styles.globeSkeleton} />
                        </div>
                    )}
                </AnimatePresence>
            </LazyMotion>
        </div>
    );
};

export const HeroCTA = ({ label, arrivalCardLabel }: { label?: string; arrivalCardLabel?: string }) => {
    const { openPanel } = useApplication();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';

    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start mt-8">

            <button
                onClick={() => openPanel()}
                className="group relative px-8 py-4 bg-[#4B0082] text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all overflow-hidden hover:scale-105 active:scale-95"
                aria-label="Select your country to start visa application"
            >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative flex items-center gap-2">
                    {label || "Select Your Country"} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
            </button>
            <div className={styles.animateSlideUpDelay}>
                <Link
                    href={formatNavLink(locale, "/arrival-card")}
                    prefetch={true}
                    className={`cta-secondary ${styles.ctaBtn} !text-white !no-underline flex items-center justify-center hover:scale-105 transition-transform duration-300`}
                    aria-label="Process your Electronic Customs Declaration or Arrival Card"
                    style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                        boxShadow: '0 8px 30px rgba(251, 191, 36, 0.4)',
                        fontSize: '0.9rem',
                        padding: '0.75rem 1.75rem',
                        border: 'none',
                    }}
                >
                    {arrivalCardLabel || "Arrival Card"}
                </Link>
            </div>
        </div>
    );
};

// ── LEGAL DATA (single source of truth) ────────────────────────────────────
const LEGAL_DATA = {
    legalName:   "PT Indonesian Visas Agency™ (MYVISA)",
    nib:         "0402260034806",
    npwp:        "0100000008117681",
    skt:         "S-04449/SKT-WP-CT/KPP.1701/2026",
    ahu:         "AHU-00065.AH.02.01.TAHUN 2020",
    sponsor:     "Recorded 2010, 2014, 2023, 2024, 2026",
    url:         "https://indonesianvisas.com",
};

const LEGAL_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": LEGAL_DATA.legalName,
    "legalName": LEGAL_DATA.legalName,
    "url": LEGAL_DATA.url,
    "logo": "https://indonesianvisas.com/Favicon.webp",
    "taxID": LEGAL_DATA.npwp,
    "privacyPolicy": "https://indonesianvisas.com/privacy-policy",
    "slogan": "The absolute industry leader in digital visa identity and immigration modernization.",
    "description": "Providing zero-hidden-fee corporate sponsorship. Our proprietary Sponsor ID acts as guaranteed legal accountability, offering clients black-and-white proof of our responsibility for their stay in Indonesia.",
    "knowsAbout": ["GDPR", "Data Privacy", "Indonesian Immigration Regulations", "Legal Sponsor Accountability", "Zero Hidden Fees"],
    "identifier": [
        { "@type": "PropertyValue", "propertyID": "NIB", "value": LEGAL_DATA.nib },
        { "@type": "PropertyValue", "propertyID": "AHU", "value": LEGAL_DATA.ahu },
        { "@type": "PropertyValue", "propertyID": "SKT", "value": LEGAL_DATA.skt },
    ],
    "additionalProperty": [
        { "@type": "PropertyValue", "name": "Immigration Sponsor Status", "value": LEGAL_DATA.sponsor }
    ],
    "sameAs": ["https://companieshouse.id/indonesian-visas-agency?ref=search"],
};

const CopyFeedback = ({ value }: { value: string }) => {
    const [copied, setCopied] = React.useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button 
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-white shadow-sm border border-gray-100 rounded-lg text-gray-400 hover:text-primary transition-all hover:scale-110 active:scale-95"
            title="Copy to clipboard"
        >
            {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
        </button>
    );
};

export const HeroBadge = () => {
    const [open, setOpen] = React.useState(false);
    const [showMiniTip, setShowMiniTip] = React.useState(false);

    // Mini Tip Timer: Appear after 4s, stay for 4s, then gone forever
    React.useEffect(() => {
        const timerIn = setTimeout(() => setShowMiniTip(true), 4000);
        const timerOut = setTimeout(() => setShowMiniTip(false), 8000);
        return () => { clearTimeout(timerIn); clearTimeout(timerOut); };
    }, []);

    // ESC key to close popup
    React.useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    const gridRows: [string, string][] = [
        ["Legal Entity",             LEGAL_DATA.legalName],
        ["Business ID (NIB)",        LEGAL_DATA.nib],
        ["Tax ID (NPWP)",            LEGAL_DATA.npwp],
        ["Registered Certificate",   LEGAL_DATA.skt],
        ["Legal Registration (AHU)", LEGAL_DATA.ahu],
        ["Sponsor Status",           LEGAL_DATA.sponsor],
    ];

    const buttons = [
        { label: "Check Company Name", href: "https://www.ahu.go.id/pencarian/profil-pt" },
        { label: "Verify NIB",          href: "https://www.badanperizinan.co.id/nib.html" },
        { label: "Public Listing",      href: "https://companieshouse.id/indonesian-visas-agency?ref=search" },
        { label: "Company Profile",     href: "https://indonesianvisas.com/company-profile" },
    ];

    return (
        <LazyMotion features={domAnimation}>
            {/* ── JSON-LD: Organization schema (SEO / machine-readable) ── */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(LEGAL_JSON_LD) }}
            />

            {/* ── Hidden machine-readable data (search engines / scrapers) ── */}
            <div style={{ display: 'none' }} aria-hidden="true" data-legal-entity="pt-indonesian-visas-agency">
                {JSON.stringify({ company: LEGAL_DATA.legalName, nib: LEGAL_DATA.nib, npwp: LEGAL_DATA.npwp, ahu: LEGAL_DATA.ahu, skt: LEGAL_DATA.skt, sponsor_status: LEGAL_DATA.sponsor })}
            </div>

            {/* ── TRIGGER: "Registered Company" badge ── */}
            <div className="relative inline-block">
                <AnimatePresence>
                    {showMiniTip && !open && (
                        <m.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 md:top-auto md:bottom-full md:mt-0 md:mb-3 z-[100] whitespace-nowrap pointer-events-none"
                        >
                            <div className="bg-[#4B0082] text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2">
                                <Zap size={12} className="text-amber-400" />
                                CHECK LEGALITY HERE
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-[#4B0082] md:bottom-auto md:top-full md:border-b-transparent md:border-t-[#4B0082]" />
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
                
                <button
                    onClick={() => { setOpen(true); setShowMiniTip(false); }}
                    className={`inline-flex items-center gap-2 bg-gray-500 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6 cursor-pointer hover:bg-gray-600 transition-colors ${styles.animateSlideUp}`}
                    aria-label="Check company legality"
                    aria-haspopup="dialog"
                >
                    <div className="bg-green-500 rounded-full p-1 text-white">
                        <ShieldCheck size={14} />
                    </div>
                    <span className="text-white text-xs font-bold tracking-wider uppercase">Registered Company</span>
                    <Info size={12} className="text-white/60" />
                </button>
            </div>

            {/* ── POPUP (Using Portal to break out of transform containers) ── */}
            <AnimatePresence>
                {open && (
                    <Portal>
                        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-5 md:p-6">
                            {/* Backdrop */}
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                                onClick={() => setOpen(false)}
                            />

                            {/* Modal card */}
                            <m.div
                                initial={{ opacity: 0, scale: 0.95, y: 100 }}
                                animate={{ opacity: 1, scale: 1, y: 60 }}
                                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                                className="bg-white rounded-[32px] w-full overflow-hidden relative z-10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/20"
                                style={{ maxWidth: 460 }}
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-500 rounded-full p-1.5 text-white shadow-lg shadow-green-200">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Check Legality</h3>
                                    </div>
                                    <button 
                                        onClick={() => setOpen(false)}
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Body (Scrollable) */}
                                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                                    <p className="text-[12px] text-gray-500 mb-6 leading-relaxed">
                                        PT Indonesian Visas Agency™ (MYVISA) is a fully registered legal entity in Indonesia. Verify our official credentials via government portals below.
                                    </p>

                                    {/* Data grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {gridRows.map(([label, value]) => {
                                            const canCopy = label.includes("Entity") || label.includes("NIB");
                                            return (
                                                <div key={label} className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 group relative hover:bg-white hover:shadow-md transition-all">
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</div>
                                                    <div className="text-[12px] font-black text-gray-800 break-words leading-tight">{value}</div>
                                                    
                                                    {canCopy && (
                                                        <CopyFeedback value={value} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-100 my-6" />

                                    {/* Action buttons */}
                                    <div className="flex flex-wrap gap-3 md:gap-4 mb-2">
                                        {buttons.map(btn => (
                                            <a
                                                key={btn.href}
                                                href={btn.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] font-black text-white bg-slate-900 hover:bg-primary px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm"
                                            >
                                                {btn.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-5 bg-slate-50/80 border-t border-gray-100">
                                    <p className="text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-tighter">
                                        Verified Indonesian Government Portals (AHU & OSS)
                                    </p>
                                    <p className="text-[10px] text-slate-400 leading-tight">
                                        Copy the unique identifiers above and paste them into the respective search bar on official portals for real-time status verification.
                                    </p>
                                </div>
                            </m.div>
                        </div>
                    </Portal>
                )}
            </AnimatePresence>
        </LazyMotion>
    );
};


export const HeroStats = ({ company, processed, success }: { company: string; processed: string; success: string }) => {
    const [popup, setPopup] = React.useState<{ isOpen: boolean; info: StaticPopupInfo | null }>({ isOpen: false, info: null });

    const openStatPopup = (id: string) => {
        const statPopups = getStatPopups();
        const info = statPopups[id as keyof typeof statPopups] || null;
        setPopup({ isOpen: true, info });
    };

    return (
        <>
            <div className={styles.statsRow}>
                <div className={`${styles.statItem} cursor-pointer group`} onClick={() => openStatPopup('company')}>
                    <div className={`${styles.statNumber} group-hover:scale-110 transition-transform`}>01</div>
                    <div className={`${styles.statLabel} group-hover:text-primary transition-colors`}>{company || "Visas Company"}</div>
                </div>
                <div className={`${styles.statItem} cursor-pointer group`} onClick={() => openStatPopup('processed')}>
                    <div className={`${styles.statNumber} group-hover:scale-110 transition-transform`}>10K+</div>
                    <div className={`${styles.statLabel} group-hover:text-primary transition-colors`}>{processed || "Visas Processed"}</div>
                </div>
                <div className={`${styles.statItem} cursor-pointer group`} onClick={() => openStatPopup('success')}>
                    <div className={`${styles.statNumber} group-hover:scale-110 transition-transform`}>99%</div>
                    <div className={`${styles.statLabel} group-hover:text-primary transition-colors`}>{success || "Success Rate"}</div>
                </div>
            </div>
            <CentralInfoPopup 
                isOpen={popup.isOpen} 
                onClose={() => setPopup({ ...popup, isOpen: false })} 
                info={popup.info} 
            />
        </>
    );
};

// 3. The Rights Steps Card (Client)
interface HeroStepsProps {
    title: string;
    onQuickApply?: () => void;
    dict?: any;
    labels?: {
        step1: string;
        step1_desc: string;
        step2: string;
        step2_desc: string;
        step3: string;
        step3_desc: string;
        step4: string;
        step4_desc: string;
    }
}

const QuickApplicationModal = dynamic(() => import("../application/QuickApplicationModal"), { ssr: false });

export const HeroSteps = ({ title, labels, dict, onQuickApply }: HeroStepsProps) => {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const { completedSteps, openPanel } = useApplication();
    const [activeIdleStep, setActiveIdleStep] = React.useState<number>(0);
    const [isInitialAnimation, setIsInitialAnimation] = React.useState(true);

    React.useEffect(() => {
        // Run initial idle glow for 24 seconds total (6s per box: 3s stay + 3s transition)
        let count = 0;
        const interval = setInterval(() => {
            count++;
            if (count > 4) {
                setActiveIdleStep(0);
                setIsInitialAnimation(false);
                clearInterval(interval);
                return;
            }
            setActiveIdleStep(count);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    const isStepActive = (step: number) => {
        if (isInitialAnimation && activeIdleStep === step) return true;
        return completedSteps.includes(step);
    };

    const [activePopup, setActivePopup] = React.useState<StaticPopupInfo | null>(null);

    const handleStepClick = (step: number) => {
        const stepPopups = getStepPopups(dict?.hero?.steps || {});
        const info = stepPopups[step as keyof typeof stepPopups] || null;
        setActivePopup(info);
    };

    return (
        <div className={`glass-card ${styles.card} group`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className={styles.cardTitle}>{title || "Simple 4-Step Process"}</h3>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); if (onQuickApply) onQuickApply(); }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black rounded-full transition-all hover:scale-105 active:scale-95 uppercase tracking-wider shadow-sm"
                    >
                        Quick Apply
                    </button>
                    <div className="p-1.5 bg-slate-100 dark:bg-white/10 rounded-full text-slate-400 group-hover:text-primary transition-colors">
                        <Info size={12} />
                    </div>
                </div>
            </div>

            <div className={styles.stepList}>
                <div 
                    onClick={() => handleStepClick(1)}
                    className={`${styles.stepItem} cursor-help ${isStepActive(1) ? styles.stepGlow : ''} ${completedSteps.includes(1) ? styles.stepDone : ''}`}
                >
                    <div className={styles.stepCircle}>1</div>
                    <div>
                        <h4 className={styles.stepHeading}>{labels?.step1 || "Select Country"}</h4>
                        <p className={styles.stepDesc}>{labels?.step1_desc || "Choose from 97 eligible countries"}</p>
                    </div>
                </div>
                <div 
                    onClick={() => handleStepClick(2)}
                    className={`${styles.stepItem} cursor-help ${isStepActive(2) ? styles.stepGlow : ''} ${completedSteps.includes(2) ? styles.stepDone : ''}`}
                >
                    <div className={styles.stepCircle}>2</div>
                    <div>
                        <h4 className={styles.stepHeading}>{labels?.step2 || "Input Personal Info"}</h4>
                        <p className={styles.stepDesc}>{labels?.step2_desc || "Input your data here, save and secured"}</p>
                    </div>
                </div>
                <div 
                    onClick={() => handleStepClick(3)}
                    className={`${styles.stepItem} cursor-help ${isStepActive(3) ? styles.stepGlow : ''} ${completedSteps.includes(3) ? styles.stepDone : ''}`}
                >
                    <div className={styles.stepCircle}>3</div>
                    <div>
                        <h4 className={styles.stepHeading}>{labels?.step3 || "Upload Documents"}</h4>
                        <p className={styles.stepDesc}>{labels?.step3_desc || "Submit passport & required documents"}</p>
                    </div>
                </div>
                <div 
                    onClick={() => handleStepClick(4)}
                    className={`${styles.stepItem} cursor-help ${isStepActive(4) ? styles.stepGlow : ''} ${completedSteps.includes(4) ? styles.stepDone : ''}`}
                >
                    <div className={styles.stepCircle}>4</div>
                    <div>
                        <h4 className={styles.stepHeading}>{labels?.step4 || "Final Confirmation"}</h4>
                        <p className={styles.stepDesc}>{labels?.step4_desc || "Review details and complete your application"}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 flex flex-row gap-2">
                <Link 
                    href={formatNavLink(locale, "/check-status")} 
                    prefetch={true}
                    className="flex-1 flex items-center justify-center px-3 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/20 rounded-xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Check Order</span>
                </Link>

                <Link 
                    href={formatNavLink(locale, "/idiv-search")} 
                    prefetch={true}
                    className="flex-1 flex items-center justify-center px-3 py-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="text-[10px] font-black text-primary uppercase tracking-wider">Search IDIV</span>
                </Link>
            </div>

            <CentralInfoPopup 
                isOpen={!!activePopup} 
                onClose={() => setActivePopup(null)} 
                info={activePopup} 
            />
        </div>
    );
};

// 4. Main Hero Client Entry
export default function HeroClient({ title, subtitle, description, steps, stats, dict }: any) {
    const [isQuickApplyOpen, setIsQuickApplyOpen] = React.useState(false);

    return (
        <section className={styles.hero}>
            <HeroGlobeWrapper />
            <div className="container mx-auto px-4 relative z-10">
                <div className={styles.content}>
                    <div className={styles.animateSlideUp}>
                        <HeroBadge />
                        <h1 className={styles.title}>{title || "Immigration Assistance"}</h1>
                        <h2 className={styles.subtitle}>{subtitle || "Bali & Indonesia"}</h2>
                        <p className={styles.description}>{description || "Professional services for all your visa and stay permit needs."}</p>
                        
                        <HeroStats 
                            company={stats?.company}
                            processed={stats?.processed}
                            success={stats?.success}
                        />
                        
                        <HeroCTA 
                            label={dict?.hero?.cta}
                            arrivalCardLabel={dict?.hero?.arrival_card}
                        />
                    </div>

                    <div className={styles.animateSlideUpDelay}>
                        <HeroSteps 
                            title={steps?.title} 
                            labels={steps?.labels}
                            dict={dict}
                            onQuickApply={() => setIsQuickApplyOpen(true)}
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isQuickApplyOpen && (
                    <QuickApplicationModal 
                        isOpen={isQuickApplyOpen} 
                        onClose={() => setIsQuickApplyOpen(false)} 
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
