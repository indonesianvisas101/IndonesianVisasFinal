"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useApplication } from "./ApplicationContext";
import styles from "./ApplicationPanel.module.css";

import StepIndicator from "./StepIndicator";
import StepCountryVisa from "./StepCountryVisa";
import StepPersonalInfo from "./StepPersonalInfo";
import StepDocuments from "./StepDocuments";
import StepPayment from "./StepPayment";


const ApplicationPanel = () => {
    const { isPanelOpen, closePanel, currentStep } = useApplication();

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
    );
};

export default ApplicationPanel;
