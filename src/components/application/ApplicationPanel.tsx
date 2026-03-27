"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useApplication } from "./ApplicationContext";
import styles from "./ApplicationPanel.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

import StepIndicator from "./StepIndicator";
import StepCountryVisa from "./StepCountryVisa";
import StepPersonalInfo from "./StepPersonalInfo";
import StepDocuments from "./StepDocuments";
import StepPayment from "./StepPayment";
import { PayPalProvider } from "../payment/PayPalProvider";


const ApplicationPanel = () => {
    const { isPanelOpen, closePanel, currentStep } = useApplication();
    const [isInfoExpanded, setIsInfoExpanded] = React.useState(false);

    // Prevent body scroll when panel is open
    useEffect(() => {
        if (isPanelOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isPanelOpen]);

    if (!isPanelOpen) return null;

    return (
        <PayPalProvider>
            <div className={styles.overlay}>
                {/* Backdrop click to close */}
                <div className={styles.backdrop} onClick={closePanel}></div>

                <div className={`${styles.panel} ${isPanelOpen ? styles.open : ""}`}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Visa Application</h2>
                        <button onClick={closePanel} className={styles.closeBtn}>
                            <X size={24} />
                        </button>
                    </div>

                    {currentStep === 1 && (
                        <div className={styles.infoWrapper}>
                            <button 
                                onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                                className={styles.infoToggle}
                            >
                                <div className="flex items-center gap-2">
                                    <Info size={14} className="text-orange-600" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                                        Visa Type Information
                                    </span>
                                </div>
                                {isInfoExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            <AnimatePresence>
                                {isInfoExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className={styles.infoBox}>
                                            <div className={styles.infoGrid}>
                                                <div className={styles.infoItem}>
                                                    <span className={styles.infoLabel}>Offshore (OfS)</span>
                                                    <span className={styles.infoValue}>Visa Apply from Outside of Indonesia</span>
                                                </div>
                                                <div className={styles.infoItem}>
                                                    <span className={styles.infoLabel}>Onshore (OnS)</span>
                                                    <span className={styles.infoValue}>Visa Apply from Inside of Indonesia</span>
                                                </div>
                                                <div className={styles.infoItem}>
                                                    <span className={styles.infoLabel}>Standard</span>
                                                    <span className={styles.infoValue}>7-14 Work Days Application</span>
                                                </div>
                                                <div className={styles.infoItem}>
                                                    <span className={styles.infoLabel}>Priority</span>
                                                    <span className={styles.infoValue}>5-7 Work Days Application</span>
                                                </div>
                                            </div>
                                            <div className={styles.infoAddOn}>
                                                <span className={styles.infoLabel}>Add-Ons "Express Processing"</span>
                                                <span className={styles.infoValue}>1 Day Submission • 3-5 Work Days Application</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    <StepIndicator />

                    <div className={styles.content}>
                        <div className={styles.stepContainer}>
                            {/* Step Rendering Logic */}
                            {currentStep === 1 && <StepCountryVisa />}
                            {currentStep === 2 && <StepPersonalInfo />}
                            {currentStep === 3 && <StepDocuments />}
                            {currentStep === 4 && <StepPayment />}
                        </div>
                    </div>
                </div>
            </div>
        </PayPalProvider>
    );
};
;

export default ApplicationPanel;
