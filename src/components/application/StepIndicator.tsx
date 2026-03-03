"use client";

import React from "react";
import { useApplication } from "./ApplicationContext";
import styles from "./StepIndicator.module.css";
import { Check } from "lucide-react";

const steps = [
    { id: 1, label: "Select Country" },
    { id: 2, label: "Personal Info" },
    { id: 3, label: "Documents" },
    { id: 4, label: "Payment" },
];

const StepIndicator = () => {
    const { currentStep } = useApplication();

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Line Connector */}
                            {index > 0 && (
                                <div
                                    className={`${styles.line} ${currentStep >= step.id ? styles.lineActive : ""
                                        }`}
                                />
                            )}

                            {/* Step Circle */}
                            <div className={styles.stepItem}>
                                <div
                                    className={`${styles.circle} ${isActive ? styles.active : ""} ${isCompleted ? styles.completed : ""
                                        }`}
                                >
                                    {isCompleted ? <Check size={16} /> : step.id}
                                </div>
                                {isActive && <span className={styles.label}>{step.label}</span>}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;
