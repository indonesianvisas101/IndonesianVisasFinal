"use client";


import React, { useState, useRef, useEffect } from "react";
import { useApplication } from "./ApplicationContext";
import Image from "next/image";
import styles from "./StepCountryVisa.module.css";
import { COUNTRY_DATA } from "@/constants/countries";
import { VisaType, POPULAR_VISA_IDS } from "@/constants/visas";
import { Search, Users, Calendar, ArrowRight, CheckCircle, Flag, Info, AlertCircle } from "lucide-react";
import { calculateVisaTotal } from "@/lib/utils";
import { Typography } from "@mui/material";
import IDivCardModern from "@/components/idiv/IDivCardModern";


const StepCountryVisa = () => {
    const { 
        country, 
        updateData, 
        setStep, 
        numPeople, 
        arrivalDate, 
        visaType, 
        priceTier,
        markStepComplete, 
        visas,
        upsells,
        toggleUpsell
    } = useApplication();
    const [searchTerm, setSearchTerm] = useState("");
    const [customVisa, setCustomVisa] = useState("");
    const [showAllVisas, setShowAllVisas] = useState(false);
    const visaSectionRef = useRef<HTMLDivElement>(null);
    const actionAreaRef = useRef<HTMLDivElement>(null);

    const handleCountrySelect = (selectedCountry: string) => {
        updateData("country", selectedCountry);
        setTimeout(() => {
            visaSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleVisaSelect = (visaName: string) => {
        updateData("visaType", visaName);
        updateData("priceTier", null); // Reset tier selection when visa changes
        // Auto-scroll to CTA
        setTimeout(() => {
            actionAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    };

    const handleTierSelect = (tierName: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Avoid re-triggering handleVisaSelect
        updateData("priceTier", tierName);
    };

    const handlePeopleChange = (change: number) => {
        const newVal = Math.max(1, Math.min(20, numPeople + change));
        updateData("numPeople", newVal);
    };

    const handleContinue = () => {
        // Validation: If visa has multiple tiers, one must be selected
        const selectedVisa = visas.find(v => v.name === visaType);
        if (selectedVisa && typeof calculateVisaTotal(selectedVisa.price, selectedVisa.fee) === 'object') {
            if (!priceTier) {
                alert("Please select a visa duration/tier first");
                return;
            }
        }

        markStepComplete(1);
        setStep(2);
    };

    const filteredCountries = React.useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return COUNTRY_DATA.filter((c) =>
            c.name.toLowerCase().includes(lowerSearch)
        );
    }, [searchTerm]);

    // Visa Display Logic
    // Sort logic to put popular ones first in the general list too, or just separate them?
    // Current logic separates "Popular" vs "Other" based on ID inclusion
    const popularVisas = visas
        .filter(v => POPULAR_VISA_IDS.includes(v.id))
        .sort((a, b) => POPULAR_VISA_IDS.indexOf(a.id) - POPULAR_VISA_IDS.indexOf(b.id));

    const otherVisas = visas.filter(v => !POPULAR_VISA_IDS.includes(v.id));
    const displayedVisas = showAllVisas ? [...popularVisas, ...otherVisas] : popularVisas;

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>Step 1: Trip Details</h3>

            {/* Top Row: People & Arrival Date */}
            <div className={styles.topRow}>
                <div className={`glass-card ${styles.inputCard}`}>
                    <label className={styles.label}>Number of Travelers</label>
                    <div className={styles.counterControl}>
                        <button
                            onClick={() => handlePeopleChange(-1)}
                            className={styles.counterBtn}
                            disabled={numPeople <= 1}
                        >-</button>
                        <div className={styles.countDisplay}>
                            <Users size={18} className="text-primary dark:text-gray-300 mr-2" />
                            <span>{numPeople}</span>
                        </div>
                        <button
                            onClick={() => handlePeopleChange(1)}
                            className={styles.counterBtn}
                            disabled={numPeople >= 20}
                        >+</button>
                    </div>
                </div>

                <div className={`glass-card ${styles.inputCard} ${styles.highlightField}`}>
                    <label className={styles.label}>Arrival Date</label>
                    <div className={styles.dateInputWrapper}>
                        <Calendar size={20} className={styles.dateIcon} />
                        <input
                            type="date"
                            className={styles.dateInput}
                            value={arrivalDate}
                            onChange={(e) => updateData("arrivalDate", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Country Selection */}
            <div className={styles.sectionHeader}>
                <h4 className={styles.subHeading}>Select Your Country</h4>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.countryListContainer}>
                <div className={styles.countryGrid}>
                    {filteredCountries.map((c: any) => (
                        <button
                            key={`${c.code}-${c.name}`}
                            onClick={() => handleCountrySelect(c.name)}
                            className={`${styles.countryBtn} ${country === c.name ? styles.selected : ""}`}
                        >
                            <Image
                                src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                                alt={c.name}
                                className={styles.flagImg}
                                width={20}
                                height={15}
                            />
                            <span className={styles.countryName}>{c.name}</span>
                            {country === c.name && <CheckCircle size={16} className={styles.checkIcon} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Visa Selection */}
            <div className={styles.visaSection} ref={visaSectionRef}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h4 className={styles.subHeading}>Choose Your Visa Type</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Select the visa that fits your needs</p>
                    </div>
                    <button
                        onClick={() => setShowAllVisas(!showAllVisas)}
                        className="btn btn-sm text-primary font-bold border border-primary/20 hover:bg-primary/5 px-4 py-2 rounded-full transition-all"
                    >
                        {showAllVisas ? "Show Popular" : "See All Visas"}
                    </button>
                </div>

                {/* Special Country Warning */
                (() => {
                    const c = COUNTRY_DATA.find(x => x.name === country);
                    if (!c) return null;
                    if (c.isSpecial) {
                        return (
                            <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl animate-fade-in">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-full shrink-0">
                                        <Info size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-amber-800 mb-2">Special Visa Requirements Apply</h4>
                                        <div className="text-amber-700 text-sm leading-relaxed space-y-2">
                                            <p>Citizens of <strong>{country}</strong> are subject to <strong>Calling Visa</strong> regulations (Special Treatment).</p>
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Additional processing time is required (approx. 2-3 months).</li>
                                                <li>Must obtain approval from the Director General of Immigration.</li>
                                                <li>A specialized clearing house process is involved.</li>
                                            </ul>
                                            <p className="mt-2 text-xs font-bold uppercase tracking-wider">Please contact our support team for specialized assistance.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    if (c.isUnregistered) {
                        return (
                            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl animate-fade-in">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-full shrink-0">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-red-800 mb-2">Unregistered / Special Treatment Country</h4>
                                        <div className="text-red-700 text-sm leading-relaxed space-y-2">
                                            <p>Citizens of <strong>{country}</strong> are currently categorized as Special Treatment in our system.</p>
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Your visa might require custom clearing or sponsorship.</li>
                                                <li>Pricing and validity will be customized based on immigration policies.</li>
                                            </ul>
                                            <p className="mt-2 text-xs font-bold uppercase tracking-wider">Please proceed, and our agent will contact you shortly to verify your eligibility.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}

                <div className={styles.visaGrid}>
                    {displayedVisas.map((visa) => (
                        <div
                            key={visa.id}
                            className={`${styles.visaCard} ${visaType === visa.name ? styles.visaSelected : ''}`}
                            onClick={() => handleVisaSelect(visa.name)}
                        >
                            <div className={styles.visaHeader}>
                                <span className={styles.visaId}>{visa.id}</span>
                                <h5 className={styles.visaTitle}>{visa.name}</h5>
                                {visaType === visa.name && <div className={styles.checkboxSelected}><CheckCircle size={16} /></div>}
                            </div>
                            <p className={styles.visaDesc}>{visa.description}</p>
                            <div className={styles.visaFooter}>
                                <div className={styles.visaPrice}>
                                    {(() => {
                                        const totalData = calculateVisaTotal(visa.price, visa.fee);
                                        if (typeof totalData === 'string') {
                                            return totalData;
                                        } else {
                                            const tiers = Object.entries(totalData);
                                            return (
                                                <div className="flex flex-col gap-3 items-center w-full">
                                                    {/* Selected/Default Price Display */}
                                                    <div className="text-xl font-black text-amber-500">
                                                        {priceTier && totalData[priceTier] ? totalData[priceTier] : "Select Tier"}
                                                    </div>
                                                    
                                                    {/* Tier Selection Buttons */}
                                                    <div className={styles.tierSelection}>
                                                        {tiers.map(([tier, price]) => (
                                                            <button
                                                                key={tier}
                                                                onClick={(e) => handleTierSelect(tier, e)}
                                                                className={`${styles.tierBtn} ${priceTier === tier ? styles.tierBtnActive : ''}`}
                                                            >
                                                                <div className="opacity-70 text-[10px] uppercase font-bold">{tier}</div>
                                                                <div>{price}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                                <span className={styles.visaValidity}>{visa.validity}</span>

                                <div className="mt-4 w-full">
                                    <button className="cta-primary w-full justify-center text-sm py-2">
                                        Apply Now <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Custom Visa Option - Always visible at end of list */}
                    <div
                        className={`${styles.visaCard} ${styles.customVisaCard} ${visaType === customVisa && customVisa !== '' ? styles.visaSelected : ''}`}
                    >
                        <h5 className={styles.visaTitle}>Custom Visa</h5>
                        <p className={styles.visaDesc}>Don't see your visa?</p>
                        <input
                            type="text"
                            placeholder="Type visa name..."
                            className={styles.customVisaInput}
                            value={customVisa}
                            onChange={(e) => {
                                setCustomVisa(e.target.value);
                                handleVisaSelect(e.target.value);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* IDIV PREMIUM ADD-ON (NEW) */}
            <div className="mt-10 mb-6">
                <div 
                    className={`glass-card p-6 border-2 transition-all cursor-pointer relative overflow-hidden group ${upsells.idiv ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-slate-200 dark:border-white/10'}`}
                    onClick={() => toggleUpsell('idiv')}
                >
                    {/* Highlight Effect */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-start gap-4">
                            <div className={`p-4 rounded-2xl transition-colors ${upsells.idiv ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
                                <Users size={28} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h5 className="text-xl font-bold">ID Indonesian Visas (IDIV)</h5>
                                    <span className="bg-amber-100 text-amber-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter">Premium Add-on</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                                    Get your dedicated Digital ID Card. This acts as a verified sponsor ID for travelers and has proven to help a lot of travelers during their stay in Indonesia.
                                </p>
                                
                                <div className="mt-3 flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-success-main">
                                        <CheckCircle size={14} /> Official Verified Sponsor ID
                                    </div>
                                    <div className="group/note relative inline-block">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary cursor-help">
                                            <Info size={14} /> Proven Results
                                        </div>
                                        {/* Hover Notification */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover/note:opacity-100 transition-opacity pointer-events-none text-center shadow-xl">
                                            Has proven help a lot of travelers
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-right flex flex-col items-end gap-2">
                            {upsells.idiv && (
                                <div className="scale-75 origin-right mb-[-40px] mt-[-20px] hidden md:block">
                                    <IDivCardModern autoRotate={false} showActions={false} />
                                </div>
                            )}
                            <Typography variant="h5" fontWeight="900" className="text-primary">$20.00</Typography>
                            <Typography variant="caption" className="text-gray-400">One-time fee • Per Person</Typography>
                            <div className="mt-3">
                                <button className={`btn btn-sm px-6 py-2 rounded-xl border-2 font-bold transition-all ${upsells.idiv ? 'bg-primary text-white border-primary' : 'border-primary text-primary hover:bg-primary/5'}`}>
                                    {upsells.idiv ? "Included in Order" : "Add to Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Area */}
            <div className={styles.actionArea} ref={actionAreaRef}>
                <button
                    className={`cta-accent ${styles.continueBtn} w-full justify-center`}
                    onClick={handleContinue}
                >
                    Continue to Personal Info <ArrowRight size={18} className="ml-2" />
                </button>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">You can fill partial details and continue.</p>
            </div>
        </div>
    );
};

export default StepCountryVisa;
