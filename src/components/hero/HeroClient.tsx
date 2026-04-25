"use client";
// forcing recompile

import React from "react";
import styles from "./Hero.module.css";
import { useApplication } from "../application/ApplicationContext";
import { runWhenIdle } from "@/utils/scheduler";
import dynamic from "next/dynamic";
import Link from "next/link"; 
import { ArrowRight, ShieldCheck, RefreshCcw, Globe, Clock, Star, Zap, Lock, Info } from "lucide-react"; 
import { LazyMotion, domMax, m, AnimatePresence } from "framer-motion";
import { formatNavLink } from "@/utils/seo";
import { useParams } from "next/navigation";

const HeroGlobe = dynamic(() => import("./HeroGlobe"), { 
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0" />
});
import CentralInfoPopup, { StaticPopupInfo } from "../common/CentralInfoPopup";
import { getStepPopups, getStatPopups } from "./HeroPopups";

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
            <LazyMotion features={domMax}>
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
                onClick={openPanel}
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
                    className={`cta-secondary ${styles.ctaBtn} !text-white !no-underline flex items-center justify-center hover:scale-105 transition-transform duration-300`}
                    style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                        boxShadow: '0 8px 30px rgba(251, 191, 36, 0.4)',
                        fontSize: '0.9rem',
                        padding: '0.75rem 1.75rem',
                        border: 'none',
                    }}
                    aria-label="Submit Arrival Card"
                >
                    {arrivalCardLabel || "Arrival Card"}
                </Link>
            </div>
        </div>
    );
};

// ── LEGAL DATA (single source of truth) ────────────────────────────────────
const LEGAL_DATA = {
    legalName:   "PT Indonesian Visas Agency",
    nib:         "0402260034806",
    npwp:        "100000008117681",
    skt:         "S-04449/SKT-WP-C/KT/KPP.1701/2026",
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
    "taxID": LEGAL_DATA.npwp,
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

export const HeroBadge = () => {
    const [open, setOpen] = React.useState(false);

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
        { label: "Check Company (AHU)", href: "https://www.ahu.go.id/pencarian/profil-pt" },
        { label: "Verify NIB",          href: "https://www.badanperizinan.co.id/nib.html" },
        { label: "Public Listing",      href: "https://companieshouse.id/indonesian-visas-agency?ref=search" },
        { label: "Company Profile",     href: "https://indonesianvisas.com/company-profile" },
    ];

    return (
        <>
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
            <button
                onClick={() => setOpen(true)}
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

            {/* ── POPUP (lazy — zero LCP impact, only rendered when open) ── */}
            {open && (
                // Overlay — click outside closes
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Check Legality"
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.55)' }}
                    onClick={() => setOpen(false)}
                >
                    {/* Modal card */}
                    <div
                        className="bg-white rounded-2xl w-full overflow-hidden"
                        style={{ maxWidth: 420, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-green-600" />
                                <span className="font-black text-sm text-gray-800 tracking-wide uppercase">Check Legality</span>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-700 text-xl leading-none font-bold"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5">
                            <p className="text-[11px] text-gray-500 mb-4">
                                PT Indonesian Visas Agency is a fully registered legal entity in Indonesia. Verify via official government portals below.
                            </p>

                            {/* Data grid — 2 columns, 3 rows */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: 12 }}>
                                {gridRows.map(([label, value]) => (
                                    <div key={label} className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</div>
                                        <div className="text-[11px] font-bold text-gray-800 break-words leading-tight">{value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-100 my-4" />

                            {/* Action buttons */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {buttons.map(btn => (
                                    <a
                                        key={btn.href}
                                        href={btn.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-bold text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        {btn.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 pb-4 text-center">
                            <p className="text-[10px] text-gray-400">All links open official government portals in a new tab.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
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

export const HeroSteps = ({ title, labels, dict }: HeroStepsProps) => {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const { completedSteps } = useApplication();
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
                <div className="p-1.5 bg-slate-100 dark:bg-white/10 rounded-full text-slate-400 group-hover:text-primary transition-colors">
                    <Info size={16} />
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

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                <Link 
                    href={formatNavLink(locale, "/check-status")} 
                    className="flex items-center justify-between w-full px-6 py-4 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/20 rounded-2xl transition-all group"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-500 rounded-lg group-hover:scale-110 transition-transform">
                            <RefreshCcw size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Check Order Status</p>
                            <p className="text-[10px] text-slate-500 dark:text-gray-400">Track your application real-time</p>
                        </div>
                    </div>
                    <ArrowRight className="text-slate-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-white group-hover:translate-x-1 transition-all" size={18} />
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
