"use client";

import React, { useState } from "react";
import { useApplication } from "./ApplicationContext";
import styles from "./StepPersonalInfo.module.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

const StepPersonalInfo = () => {
    const { personalInfo, updatePersonalInfo, setStep, markStepComplete } = useApplication();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!personalInfo.firstName) newErrors.firstName = "First name is required";
        if (!personalInfo.lastName) newErrors.lastName = "Last name is required";

        // Optional strictness: User said skippable, but maybe we want at least a name?
        // Let's keep it loose for "Skip", but validate for "Continue" button if they choose to use it as 'Submit'.
        // Actually, "Skipable" implies we can move forward without data. 
        // But usually "Continue" implies "I tried to fill it, check it". 
        // Let's assume Continue = Validate, Skip = Just go.

        if (!personalInfo.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) newErrors.email = "Invalid email";

        if (!personalInfo.phone) newErrors.phone = "Phone is required";
        if (!personalInfo.passport) newErrors.passport = "Passport number is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            markStepComplete(2);
            setStep(3);
        }
    };

    const handleSkip = () => {
        // Mark as complete? Or maybe not, since they skipped?
        // User prompt: "Step 1 and Step 2 Skipable". 
        // Decision: Let them proceed but don't mark as "Completed" (glowing) if empty?
        // Or maybe "Skip" just means "I'll do it later", so we move to step 3.
        setStep(3);
    };

    return (
        <div className={styles.container}>
            <button onClick={() => setStep(1)} className={styles.backBtn}>
                <ArrowLeft size={16} className="mr-2" /> Back
            </button>

            <h3 className={styles.heading}>Step 2: Personal Information</h3>

            <form onSubmit={handleContinue} className={styles.form}>
                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>First Name</label>
                        <input
                            type="text"
                            className={`${styles.input} ${errors.firstName ? styles.errorInput : ""}`}
                            value={personalInfo.firstName}
                            onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                        />
                        {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Last Name</label>
                        <input
                            type="text"
                            className={`${styles.input} ${errors.lastName ? styles.errorInput : ""}`}
                            value={personalInfo.lastName}
                            onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                        />
                        {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        className={`${styles.input} ${errors.email ? styles.errorInput : ""}`}
                        value={personalInfo.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Phone (WhatsApp)</label>
                    <input
                        type="tel"
                        className={`${styles.input} ${errors.phone ? styles.errorInput : ""}`}
                        value={personalInfo.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    />
                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Passport Number</label>
                    <input
                        type="text"
                        className={`${styles.input} ${errors.passport ? styles.errorInput : ""}`}
                        value={personalInfo.passport}
                        onChange={(e) => updatePersonalInfo("passport", e.target.value)}
                    />
                    {errors.passport && <span className={styles.errorText}>{errors.passport}</span>}
                </div>

                {/* New DOB Field */}
                <div className={styles.field}>
                    <label className={styles.label}>Date of Birth</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={personalInfo.dob}
                        onChange={(e) => updatePersonalInfo("dob", e.target.value)}
                    />
                </div>

                <div className={styles.btnRow}>
                    <button type="button" onClick={handleSkip} className={`cta-secondary ${styles.skipBtn}`}>
                        Skip for Now
                    </button>
                    <button type="submit" className={`cta-accent ${styles.submitBtn}`}>
                        Continue <ArrowRight size={18} className="ml-2" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StepPersonalInfo;
