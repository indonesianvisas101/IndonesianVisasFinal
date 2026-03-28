"use client";
// forcing recompile

import React from "react";
import styles from "./Hero.module.css";
import { useApplication } from "../application/ApplicationContext";
import { runWhenIdle } from "@/utils/scheduler";
import dynamic from "next/dynamic";
import Link from "next/link"; 
import { ArrowRight, ShieldCheck, RefreshCcw, Globe, Clock, Star, ListChecks, Mail, Zap, Lock, Info } from "lucide-react"; 
import { Box, Typography } from "@mui/material";

const HeroGlobe = dynamic(() => import("./HeroGlobe"), { 
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0" />
});
import CentralInfoPopup, { StaticPopupInfo } from "../common/CentralInfoPopup";

import { motion, AnimatePresence } from "framer-motion";

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
                    }, 2500); // Dynamic delay after idle 
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
            <AnimatePresence>
                {isMounted && (
                    <motion.div
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
                    </motion.div>
                )}
                {!isMounted && (
                    <div className="absolute inset-0 z-0 bg-transparent flex items-center justify-center">
                        {/* 
                            Light placeholder (could be a blurred shape).
                            Helps in giving a "loading" structure without weight.
                        */}
                        <div className="w-[600px] h-[600px] rounded-full border border-primary/5 opacity-10 animate-pulse" />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// 2. The CTA Button (Client)
export const HeroCTA = ({ label, arrivalCardLabel }: { label?: string; arrivalCardLabel?: string }) => {
    const { openPanel } = useApplication();

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
                    href="/arrival-card"
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

export const HeroBadge = () => (
    <div className={`inline-flex items-center gap-2 bg-gray-500 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6 ${styles.animateSlideUp}`}>
        <div className="bg-green-500 rounded-full p-1 text-white">
            <ShieldCheck size={14} />
        </div>
        <span className="text-white text-xs font-bold tracking-wider uppercase">Registered Company</span>
    </div>
);

export const HeroStats = ({ company, processed, success }: { company: string; processed: string; success: string }) => {
    const [popup, setPopup] = React.useState<{ isOpen: boolean; info: StaticPopupInfo | null }>({ isOpen: false, info: null });

    const openStatPopup = (id: string) => {
        let info: StaticPopupInfo | null = null;
        if (id === 'company') {
            info = {
                id: 'stat-company',
                title: 'No. 1 Visa Agency',
                icon: <Globe size={32} />,
                content: (
                    <div className="space-y-4">
                        <p className="font-bold text-sm text-blue-600 uppercase tracking-widest">Industry Leadership</p>
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                            IndonesianVisas.com is recognized as a leader in digital visa facilitation. Since 2010, we have pioneered smooth immigration pathways for global travelers.
                        </Typography>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <p className="text-sm">
                                We utilize an **Advanced Verification System** integrated with dedicated legal support to ensure absolute document accuracy and speed.
                            </p>
                        </div>
                        <p className="text-xs text-slate-400 italic">Your Registered Legal Gateway to Indonesia - Built for Trust.</p>
                    </div>
                )
            };
        } else if (id === 'processed') {
            info = {
                id: 'stat-processed',
                title: '10K+ Applications',
                icon: <Clock size={32} />,
                content: (
                    <div className="space-y-4">
                        <p className="font-bold text-sm text-amber-600 uppercase tracking-widest">Deep Experience</p>
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                            With over **16 years of experience** (2010-2026), we've seen it all. Our journey through the industry's evolution allows us to navigate complex regulatory changes with ease.
                        </Typography>
                        <p className="text-sm">
                            We've processed tens of thousands of visas, learning from every uniquely challenging case to provide you with the most reliable path to Indonesia.
                        </p>
                    </div>
                )
            };
        } else if (id === 'success') {
            info = {
                id: 'stat-success',
                title: '99% Success Rate',
                icon: <Star size={32} />,
                content: (
                    <div className="space-y-4">
                        <p className="font-bold text-sm text-green-600 uppercase tracking-widest">The Draft System™</p>
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                            Our proprietary **Draft System** and **Dual-Review Cycle** ensure the highest success rates in the industry.
                        </Typography>
                        <Box sx={{ p: 3, bgcolor: 'rgba(34, 197, 94, 0.05)', borderRadius: 4, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                            <ul className="space-y-2 text-sm">
                                <li className="flex gap-2"><strong>1.</strong> We work directly within the Immigration system draft layer.</li>
                                <li className="flex gap-2"><strong>2.</strong> Your application is submitted as a pre-verified draft.</li>
                                <li className="flex gap-2"><strong>3.</strong> If the system flags an issue, our agent resolve it *immediately*.</li>
                                <li className="flex gap-2"><strong>4.</strong> We only proceed to official submission once approval is verified.</li>
                            </ul>
                        </Box>
                        <p className="text-sm font-medium">This methodology ensures zero financial loss for our clients and a 99% guaranteed result.</p>
                    </div>
                )
            };
        }
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
    const { completedSteps } = useApplication();
    const [activeIdleStep, setActiveIdleStep] = React.useState<number>(0);
    const [isInitialAnimation, setIsInitialAnimation] = React.useState(true);
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);

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

    const t = dict?.hero?.steps || {};
    const pt = t.popups || {};

    const stepPopups: Record<number, StaticPopupInfo> = {
        1: {
            id: 'step-1-info',
            title: pt.step1?.title || 'Global Eligibility & Filtering',
            icon: <Globe size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-blue-600 uppercase tracking-widest">{pt.step1?.subtitle || 'Step 1: Universal Access'}</p>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {pt.step1?.content || 'We support travelers from over **97 countries**. Our system automatically filters the latest immigration regulations based on your nationality and travel purpose.'}
                    </Typography>
                </div>
            )
        },
        2: {
            id: 'step-2-info',
            title: pt.step2?.title || 'Secure Data Handling',
            icon: <Lock size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-purple-600 uppercase tracking-widest">{pt.step2?.subtitle || 'Step 2: Privacy First'}</p>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {pt.step2?.content || 'Your personal information is protected by industry-standard **AES-256 bit encryption**. We collect only what is legally required for your visa sponsorship.'}
                    </Typography>
                </div>
            )
        },
        3: {
            id: 'step-3-info',
            title: pt.step3?.title || 'AI Pre-Verification',
            icon: <RefreshCcw size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-amber-600 uppercase tracking-widest">{pt.step3?.subtitle || 'Step 3: Document Accuracy'}</p>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {pt.step3?.content || 'Once uploaded, our **AI Agent** perform a pre-screening of your passport and documents to ensure 100% compliance with Indonesian Immigration standards.'}
                    </Typography>
                </div>
            )
        },
        4: {
            id: 'step-4-info',
            title: pt.step4?.title || 'Payment & ID Activation',
            icon: <Zap size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-green-600 uppercase tracking-widest">{pt.step4?.subtitle || 'Step 4: Final Confirmation'}</p>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {pt.step4?.content || 'Complete your transaction via world-class secure payment gateways. The moment payment is verified, your **ID Tracker** is activated.'}
                    </Typography>
                    <Box sx={{ p: 3, bgcolor: 'rgba(34, 197, 94, 0.05)', borderRadius: 4, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-2"><strong>+</strong> Receive Your email Confirmation</li>
                            <li className="flex gap-2"><strong>+</strong> Unique ID Tracker Order Activation</li>
                            <li className="flex gap-2"><strong>+</strong> Official Sponsor Guarantee</li>
                        </ul>
                    </Box>
                </div>
            )
        }
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
                    onClick={() => setActivePopup(stepPopups[1])}
                    className={`${styles.stepItem} cursor-help ${isStepActive(1) ? styles.stepGlow : ''} ${completedSteps.includes(1) ? styles.stepDone : ''}`}
                >
                    <div className={styles.stepCircle}>1</div>
                    <div>
                        <h4 className={styles.stepHeading}>{labels?.step1 || "Select Country"}</h4>
                        <p className={styles.stepDesc}>{labels?.step1_desc || "Choose from 97 eligible countries"}</p>
                    </div>
                </div>
                <div 
                    onClick={() => setActivePopup(stepPopups[2])}
                    className={`${styles.stepItem} cursor-help ${isStepActive(2) ? styles.stepGlow : ''} ${completedSteps.includes(2) ? styles.stepDone : ''}`}
                >
                    <div className={styles.stepCircle}>2</div>
                    <div>
                        <h4 className={styles.stepHeading}>{labels?.step2 || "Input Personal Info"}</h4>
                        <p className={styles.stepDesc}>{labels?.step2_desc || "Input your data here, save and secured"}</p>
                    </div>
                </div>
                <div 
                    onClick={() => setActivePopup(stepPopups[3])}
                    className={`${styles.stepItem} cursor-help ${isStepActive(3) ? styles.stepGlow : ''} ${completedSteps.includes(3) ? styles.stepDone : ''}`}
                >
                    <div className={styles.stepCircle}>3</div>
                    <div>
                        <h4 className={styles.stepHeading}>{labels?.step3 || "Upload Documents"}</h4>
                        <p className={styles.stepDesc}>{labels?.step3_desc || "Submit passport & required documents"}</p>
                    </div>
                </div>
                <div 
                    onClick={() => setActivePopup(stepPopups[4])}
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
                    href="/check-status" 
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
