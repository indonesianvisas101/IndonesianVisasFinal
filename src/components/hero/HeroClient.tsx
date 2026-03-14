"use client";
// forcing recompile

import React from "react";
import styles from "./Hero.module.css";
import { useApplication } from "../application/ApplicationContext";
import { runWhenIdle } from "@/utils/scheduler";
import dynamic from "next/dynamic";
import Link from "next/link"; // Added Link
import { ArrowRight, ShieldCheck } from "lucide-react"; 

// Dynamic Globe here to keep it out of Server Component
const HeroGlobe = dynamic(() => import("./HeroGlobe"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0" />
});

// 1. The Globe Wrapper (Client)
export const HeroGlobeWrapper = () => {
    const [shouldRenderGlobe, setShouldRenderGlobe] = React.useState(false);
    const [opacity, setOpacity] = React.useState(0);

    React.useEffect(() => {
        // Only render globe on larger screens to improve mobile LCP
        // and delay it to ensure Main LCP (Text) is painted first
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            runWhenIdle(() => {
                setShouldRenderGlobe(true);
                // Trigger fade in after mount
                requestAnimationFrame(() => setOpacity(1));
            });
        }
    }, []);

    if (!shouldRenderGlobe) return null;

    return (
        <div style={{ opacity: opacity, transition: 'opacity 5s ease-in-out' }}>
            <HeroGlobe />
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
    <div className={`inline-flex items-center gap-2 bg-gray-400 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6 ${styles.animateSlideUp}`}>
        <div className="bg-green-500 rounded-full p-1 text-white">
            <ShieldCheck size={14} />
        </div>
        <span className="text-white text-xs font-bold tracking-wider uppercase">Registered Company</span>
    </div>
);

// 3. The Rights Steps Card (Client)
interface HeroStepsProps {
    title: string;
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

export const HeroSteps = ({ title, labels }: HeroStepsProps) => {
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
        // 1. If we are in the initial 5sec intro, glow based on idle rotation
        if (isInitialAnimation && activeIdleStep === step) return true;
        // 2. Otherwise, glow if the step is actually completed/active in the flow
        return completedSteps.includes(step);
    };

    return (
        <div className={`glass-card ${styles.card}`}>
            <h3 className={styles.cardTitle}>{title || "Simple 4-Step Process"}</h3>

            <div className={styles.stepList}>
                <div className={`${styles.stepItem} ${isStepActive(1) ? styles.stepGlow : ''} ${completedSteps.includes(1) ? styles.stepDone : ''}`}>
                    <div className={styles.stepCircle}>1</div>
                    <div>
                        <h4 className={styles.stepHeading}>{labels?.step1 || "Select Country"}</h4>
                        <p className={styles.stepDesc}>{labels?.step1_desc || "Choose from 97 eligible countries"}</p>
                    </div>
                </div>
                <div className={`${styles.stepItem} ${isStepActive(2) ? styles.stepGlow : ''} ${completedSteps.includes(2) ? styles.stepDone : ''}`}>
                    <div className={styles.stepCircle}>2</div>
                    <div>
                        <h4 className={styles.stepHeading}>{labels?.step2 || "Choose Your Visa Type"}</h4>
                        <p className={styles.stepDesc}>{labels?.step2_desc || "Select the visa that fits your needs"}</p>
                    </div>
                </div>
                <div className={`${styles.stepItem} ${isStepActive(3) ? styles.stepGlow : ''} ${completedSteps.includes(3) ? styles.stepDone : ''}`}>
                    <div className={styles.stepCircle}>3</div>
                    <div>
                        <h4 className={styles.stepHeading}>{labels?.step3 || "Upload Documents"}</h4>
                        <p className={styles.stepDesc}>{labels?.step3_desc || "Submit passport & required documents"}</p>
                    </div>
                </div>
                <div className={`${styles.stepItem} ${isStepActive(4) ? styles.stepGlow : ''} ${completedSteps.includes(4) ? styles.stepDone : ''}`}>
                    <div className={styles.stepCircle}>4</div>
                    <div>
                        <h4 className={styles.stepHeading}>{labels?.step4 || "Make Payment"}</h4>
                        <p className={styles.stepDesc}>{labels?.step4_desc || "Complete payment via secure methods"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
