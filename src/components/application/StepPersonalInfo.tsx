"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useApplication } from "./ApplicationContext";
import styles from "./StepPersonalInfo.module.css";
import { ArrowLeft, ArrowRight, Search, ChevronDown } from "lucide-react";
import { PHONE_CODES } from "@/constants/phoneCodes";

const StepPersonalInfo = () => {
    const { personalInfo, updatePersonalInfo, setStep, markStepComplete, numPeople, travelers, updateTraveler, country } = useApplication();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isCodeOpen, setIsCodeOpen] = useState(false);
    const [searchCode, setSearchCode] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Auto-detect country code from Step 1 selection
    useEffect(() => {
        if (!personalInfo.phone && country) {
            const detected = PHONE_CODES.find(p => p.name.toLowerCase() === country.toLowerCase());
            if (detected) {
                updatePersonalInfo("phone", detected.dialCode + " ");
            }
        }
    }, [country, personalInfo.phone, updatePersonalInfo]);

    // Force focus when dropdown opens
    useEffect(() => {
        if (isCodeOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isCodeOpen]);

    const filteredCodes = useMemo(() => {
        return PHONE_CODES.filter(p => 
            p.name.toLowerCase().includes(searchCode.toLowerCase()) || 
            p.initial.toLowerCase().includes(searchCode.toLowerCase()) ||
            p.dialCode.includes(searchCode)
        );
    }, [searchCode]);

    // Safety splitting for the phone number
    const phoneValue = personalInfo.phone || "";
    const currentDialCode = phoneValue.includes(" ") ? phoneValue.split(" ")[0] : (phoneValue.startsWith("+") ? phoneValue : "+62");
    const currentNumber = phoneValue.includes(" ") ? phoneValue.split(" ").slice(1).join(" ") : "";

    const handleCodeSelect = (dialCode: string) => {
        updatePersonalInfo("phone", dialCode + " " + currentNumber);
        setIsCodeOpen(false);
        setSearchCode("");
    };

    const handleNumberChange = (val: string) => {
        updatePersonalInfo("phone", currentDialCode + " " + val);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!personalInfo.firstName) newErrors.firstName = "First name is required";
        if (!personalInfo.lastName) newErrors.lastName = "Last name is required";

        if (!personalInfo.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) newErrors.email = "Invalid email";

        if (!currentNumber || currentNumber.length < 5) newErrors.phone = "Valid phone number is required";
        if (!personalInfo.passport) newErrors.passport = "Passport number is required";

        for (let i = 0; i < numPeople - 1; i++) {
            const t = travelers[i] || {};
            if (!t.firstName) newErrors[`t_${i}_firstName`] = "Required";
            if (!t.lastName) newErrors[`t_${i}_lastName`] = "Required";
            if (!t.email) newErrors[`t_${i}_email`] = "Required";
            else if (!/\S+@\S+\.\S+/.test(t.email)) newErrors[`t_${i}_email`] = "Invalid";
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
                
                {/* 1. NAME ROW */}
                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>First Name</label>
                        <input
                            type="text"
                            placeholder="e.g. John"
                            className={`${styles.input} ${errors.firstName ? styles.errorInput : ""}`}
                            value={personalInfo.firstName || ""}
                            onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                        />
                        {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Last Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Doe"
                            className={`${styles.input} ${errors.lastName ? styles.errorInput : ""}`}
                            value={personalInfo.lastName || ""}
                            onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                        />
                        {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                    </div>
                </div>

                {/* 2. EMAIL FIELD */}
                <div className={styles.field}>
                    <label className={styles.label}>Email Address</label>
                    <input
                        type="email"
                        placeholder="john.doe@example.com"
                        className={`${styles.input} ${errors.email ? styles.errorInput : ""}`}
                        value={personalInfo.email || ""}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                {/* 3. WHATSAPP FIELD WITH COUNTRY SELECTOR */}
                <div className={styles.field}>
                    <label className={styles.label}>WhatsApp Number</label>
                    <p className="text-[10px] text-gray-400 mb-2 font-medium italic">Please select your country area code for WhatsApp</p>
                    <div className={styles.phoneWrapper}>
                        <div className={styles.codeSelector}>
                            <button 
                                type="button" 
                                className={styles.codeBtn}
                                onClick={() => setIsCodeOpen(!isCodeOpen)}
                            >
                                {(() => {
                                    const c = PHONE_CODES.find(p => p.dialCode === currentDialCode);
                                    return (
                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                            {c && (
                                                <>
                                                    <img 
                                                        src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} 
                                                        width="18" height="12" alt={c.name} 
                                                        className="rounded-[2px] shrink-0"
                                                    />
                                                    <span className="font-black text-[11px] opacity-80">{c.initial}</span>
                                                </>
                                            )}
                                            <span className="truncate">{currentDialCode}</span>
                                        </div>
                                    );
                                })()}
                                <ChevronDown size={12} className="ml-0.5 opacity-50 shrink-0" />
                            </button>

                            {isCodeOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsCodeOpen(false)}></div>
                                    <div className={styles.codeDropdown}>
                                        <div className={styles.codeSearch}>
                                            <Search size={14} className="text-gray-400" />
                                            <input 
                                                ref={searchInputRef}
                                                placeholder="Search by country or code..." 
                                                value={searchCode}
                                                onChange={(e) => setSearchCode(e.target.value)}
                                                className={styles.codeSearchInput}
                                            />
                                        </div>
                                        <ul className={styles.codeList}>
                                            {filteredCodes.map(c => (
                                                <li key={c.code}>
                                                    <button 
                                                        type="button" 
                                                        className={styles.codeItem}
                                                        onClick={() => handleCodeSelect(c.dialCode)}
                                                    >
                                                        <img 
                                                            src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} 
                                                            width="20" height="15" alt={c.name} 
                                                            className="rounded-sm shrink-0"
                                                        />
                                                        <span className="font-bold text-[14px]">{c.dialCode}</span>
                                                        <span className="text-[10px] opacity-40 uppercase ml-auto">{c.initial}</span>
                                                    </button>
                                                </li>
                                            ))}
                                            {filteredCodes.length === 0 && (
                                                <div className="p-4 text-center text-xs text-gray-400">No matches found</div>
                                            )}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                        <input
                            type="tel"
                            placeholder="812 3456 7890"
                            className={`${styles.input} ${styles.phoneInput} ${errors.phone ? styles.errorInput : ""}`}
                            value={currentNumber}
                            onChange={(e) => handleNumberChange(e.target.value)}
                        />
                    </div>
                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </div>

                {/* 4. PASSPORT FIELD */}
                <div className={styles.field}>
                    <label className={styles.label}>Passport Number</label>
                    <input
                        type="text"
                        placeholder="A1234567"
                        className={`${styles.input} ${errors.passport ? styles.errorInput : ""}`}
                        value={personalInfo.passport || ""}
                        onChange={(e) => updatePersonalInfo("passport", e.target.value)}
                    />
                    {errors.passport && <span className={styles.errorText}>{errors.passport}</span>}
                </div>

                {/* 5. DOB FIELD */}
                <div className={styles.field}>
                    <label className={styles.label}>Date of Birth</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={personalInfo.dob || ""}
                        onChange={(e) => updatePersonalInfo("dob", e.target.value)}
                    />
                </div>

                {/* Additional Travelers */}
                {Array.from({ length: Math.max(0, numPeople - 1) }).map((_, i) => {
                    const t = travelers[i] || { firstName: "", lastName: "", email: "", passport: "", dob: "" };
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
                                <label className={styles.label}>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Traveler's official email"
                                    className={`${styles.input} ${errors[`t_${i}_email`] ? styles.errorInput : ""}`}
                                    value={t.email || ""}
                                    onChange={(e) => updateTraveler(i, "email", e.target.value)}
                                />
                                {errors[`t_${i}_email`] && <span className={styles.errorText}>{errors[`t_${i}_email`]}</span>}
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
                    <button type="button" onClick={handleSkip} className={`px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors`}>
                        Skip for Now (Consult with Agent)
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
