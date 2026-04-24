"use client";

import React, { useState } from "react";
import { useApplication } from "@/components/application/ApplicationContext";
import styles from "./VisaCatalog.module.css";
import { Check, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { POPULAR_VISA_IDS } from "@/constants/visas";
import { calculateVisaTotal } from "@/lib/utils";
import VisaCard from "@/components/visa/VisaCard";

const VisaCatalog = ({ locale, dict }: { locale?: string; dict?: any }) => {
    const { visas, openPanel, updateData, refreshVisas } = useApplication();
    const t = dict?.services_page || {};
    const [selectedCategory, setSelectedCategory] = useState("All Visas");
    const [showAll, setShowAll] = useState(false);

    // Refresh data on mount to ensure latest prices
    React.useEffect(() => {
        refreshVisas();
    }, [refreshVisas]);

    const CATEGORIES = [
        "All Visas",
        "Visitor Visas on Arrival",
        "Single-Entry Visitor Visas",
        "Multiple-Entry Visitor Visas",
        "Work Visas",
        "Investor Visas",
        "Student Visas",
        "Family Visas",
        "Repatriation and Descendant Visas",
        "Special Residency Visas",
        "Working Holiday Visas",
        "Visitor Visa Exemptions"
    ];

    // Map categories to localized titles if needed, or keep logic-keys and show localized labels
    const getCategoryLabel = (cat: string) => {
        if (cat === "All Visas") return dict?.common?.all_visas || "All Visas";
        // You could add full mapping here if desired
        return cat;
    };



    // Filter visas based on category
    const filteredVisas = visas.filter(visa => {
        if (selectedCategory === "All Visas") return true;
        // Robust comparison: handle potential whitespace or casing differences from DB
        return visa.category?.trim() === selectedCategory;
    });

    // Sort visas: Popular ones first (in specific order), then the rest
    const sortedVisas = [...filteredVisas].sort((a, b) => {
        const indexA = POPULAR_VISA_IDS.indexOf(a.id);
        const indexB = POPULAR_VISA_IDS.indexOf(b.id);

        // Both are popular -> sort by index
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // Only A is popular -> A comes first
        if (indexA !== -1) return -1;
        // Only B is popular -> B comes first
        if (indexB !== -1) return 1;
        // Neither popular -> specific order (or keep original)
        return 0;
    });

    const displayVisas = showAll ? sortedVisas : sortedVisas.slice(0, 12);

    return (
        <div className={styles.catalog}>
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setSelectedCategory(cat);
                            setShowAll(false); // Reset show all when switching category
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
                            ${selectedCategory === cat
                                ? "text-white shadow-lg shadow-[#9155FD]/20 scale-105"
                                : "glass-card mode-aware-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#9155FD]"
                            }
                        `}
                        style={selectedCategory === cat ? { backgroundColor: '#9155FD' } : {}}
                    >
                        {getCategoryLabel(cat)}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {displayVisas.map((visa) => (
                    <VisaCard
                        key={visa.id}
                        visa={visa}
                        dict={dict}
                    />
                ))}
                {/* Custom Visa Card */}
                <div className={`
                    relative rounded-[2rem]
                    bg-white dark:bg-zinc-900/50
                    border border-gray-200 dark:border-white/10
                    p-8
                    shadow-xl hover:shadow-2xl
                    transition-all duration-500
                    text-left
                    group
                    ${styles.card}
                `}>
                    <div className={styles.cardHeader}>
                        <span className="text-xs font-black uppercase text-primary tracking-[0.2em]">{dict?.common?.custom_solution || "Custom Solution"}</span>
                        <h3 className="mt-4 text-2xl font-black mode-aware-text">{dict?.common?.custom_visa || "Custom Visa"}</h3>
                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">{dict?.common?.starting_from || "Starting from"}</p>
                            <span className="text-3xl font-black mode-aware-text">{dict?.common?.contact_support || "Contact Support"}</span>
                        </div>
                    </div>
                    <p className="mt-6 text-base mode-aware-subtext leading-relaxed font-medium">
                        {dict?.common?.custom_visa_desc || "Can't find the exact visa you need? Our team can create a tailored solution for your specific requirements."}
                    </p>

                    <div className="mt-auto pt-8">
                        <Link href={`/${locale || 'en'}/contact`} className="
                            w-full flex items-center justify-center gap-3
                            rounded-2xl
                            text-white
                            py-4 font-black text-lg
                            shadow-xl shadow-[#9155FD]/20
                            transition-all active:scale-95 hover:opacity-90
                        " style={{ backgroundColor: '#9155FD' }}>
                            {dict?.common?.contact_support_cta || "Contact Support"} <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>

            {!showAll && filteredVisas.length > 8 && (
                <div className="flex justify-center mt-20">
                    <button
                        onClick={() => setShowAll(true)}
                        className="px-12 py-5 text-white font-black rounded-2xl shadow-xl shadow-[#9155FD]/20 transition-all hover:opacity-90 flex items-center justify-center"
                        style={{ backgroundColor: '#9155FD' }}
                    >
                        {t.view_all || "See All Visa Services"}
                        <ArrowRight size={20} className="ml-2" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default VisaCatalog;
