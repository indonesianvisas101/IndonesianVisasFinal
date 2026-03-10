"use client";

import React, { useState } from "react";
import { useApplication } from "./ApplicationContext";
import styles from "./StepPersonalInfo.module.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

const StepPersonalInfo = () => {
    const { personalInfo, updatePersonalInfo, setStep, markStepComplete, numPeople, travelers, updateTraveler } = useApplication();
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

        for (let i = 0; i < numPeople - 1; i++) {
            const t = travelers[i] || {};
            if (!t.firstName) newErrors[`t_${i}_firstName`] = "Required";
            if (!t.lastName) newErrors[`t_${i}_lastName`] = "Required";
            if (!t.passport) newErrors[`t_${i}_passport`] = "Required";
        }

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
                {numPeople > 1 && <h4 className="font-bold text-lg mb-4 text-primary">Traveler 1 (Primary Contact)</h4>}
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

                {/* Additional Travelers */}
                {Array.from({ length: Math.max(0, numPeople - 1) }).map((_, i) => {
                    const t = travelers[i] || { firstName: "", lastName: "", passport: "", dob: "" };
                    return (
                        <div key={i} className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="font-bold text-lg mb-4 text-primary">Traveler {i + 2}</h4>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label className={styles.label}>First Name</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors[`t_${i}_firstName`] ? styles.errorInput : ""}`}
                                        value={t.firstName || ""}
                                        onChange={(e) => updateTraveler(i, "firstName", e.target.value)}
                                    />
                                    {errors[`t_${i}_firstName`] && <span className={styles.errorText}>{errors[`t_${i}_firstName`]}</span>}
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Last Name</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${errors[`t_${i}_lastName`] ? styles.errorInput : ""}`}
                                        value={t.lastName || ""}
                                        onChange={(e) => updateTraveler(i, "lastName", e.target.value)}
                                    />
                                    {errors[`t_${i}_lastName`] && <span className={styles.errorText}>{errors[`t_${i}_lastName`]}</span>}
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Passport Number</label>
                                <input
                                    type="text"
                                    className={`${styles.input} ${errors[`t_${i}_passport`] ? styles.errorInput : ""}`}
                                    value={t.passport || ""}
                                    onChange={(e) => updateTraveler(i, "passport", e.target.value)}
                                />
                                {errors[`t_${i}_passport`] && <span className={styles.errorText}>{errors[`t_${i}_passport`]}</span>}
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Date of Birth</label>
                                <input
                                    type="date"
                                    className={styles.input}
                                    value={t.dob || ""}
                                    onChange={(e) => updateTraveler(i, "dob", e.target.value)}
                                />
                            </div>
                        </div>
                    );
                })}

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
