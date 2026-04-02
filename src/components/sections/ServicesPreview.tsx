"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Umbrella, Briefcase, Globe, FileText, ArrowRight, Layers, CreditCard } from "lucide-react";
import styles from "./ServicesPreview.module.css";
import Link from "next/link";
import { useApplication } from "@/components/application/ApplicationContext";
const VisaListModal = dynamic(() => import("@/components/visa/VisaListModal"), { ssr: false });
import { formatNavLink } from "@/utils/seo";
import { useParams } from "next/navigation";

const ServicesPreview = ({ dict }: { dict?: any }) => {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const t = dict?.services_preview || {};
    const { visas, popularVisaIds } = useApplication();
    const [isMounted, setIsMounted] = React.useState(false);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<{
        type: "visit" | "single" | "multiple" | "kitas";
        title: string;
        description: string;
    } | null>(null);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleCardClick = (type: "visit" | "single" | "multiple" | "kitas", title: string, description: string) => {
        setSelectedFilter({ type, title, description });
        setModalOpen(true);
    };

    if (!isMounted) return null;

    return (
        <section className={`${styles.section} flex justify-center`}>
            <div className="container flex flex-col items-center text-center">

                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 mode-aware-text">{t.title || "Our Services"}</h2>
                <p className="text-lg mb-12 max-w-2xl mode-aware-subtext">
                    {t.description || "We offer comprehensive Indonesian visa solutions tailored to your needs, whether you're a tourist, business professional, or looking for long-term residency."}
                </p>

                {/* FILTER CARDS GRID */}
                <div className={`${styles.grid} max-w-6xl w-full mx-auto`}>

                    {/* CARD 1: Visit / Tourist Visa */}
                    <button
                        onClick={() => handleCardClick("visit", t.visit_title || "Visit / Tourist Visas", t.visit_desc || "Short-term stay options including Visa Exemptions and Visa on Arrival (VOA). Perfect for holidays and brief visits.")}
                        className={`glass-card ${styles.card} cursor-pointer hover:border-primary/50 transition-all duration-300 group text-left w-full`}
                        aria-label="Filter Visit and Tourist Visas"
                    >
                        <div className={`${styles.iconWrapper} group-hover:bg-primary/10 group-hover:text-primary transition-colors`}>
                            <Umbrella size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 mode-aware-text">{t.visit_title || "Visit / Tourist Visa"}</h3>
                        <p className="text-base mode-aware-subtext">
                            {t.visit_desc || "Short-term stay options including Visa Exemptions and Visa on Arrival (VOA)."}
                        </p>
                    </button>

                    {/* CARD 2: Single-Entry Visa */}
                    <button
                        onClick={() => handleCardClick("single", t.single_title || "Single-Entry Visas", t.single_desc || "Visas valid for 60 days (extendable) for tourism, business, or social visits. Valid for one entry only.")}
                        className={`glass-card ${styles.card} cursor-pointer hover:border-primary/50 transition-all duration-300 group text-left w-full`}
                        aria-label="Filter Single Entry Visas"
                    >
                        <div className={`${styles.iconWrapper} group-hover:bg-primary/10 group-hover:text-primary transition-colors`}>
                            <FileText size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 mode-aware-text">{t.single_title || "Single-Entry Visa"}</h3>
                        <p className="text-base mode-aware-subtext">
                            {t.single_desc || "Longer stays (60-180 days) for tourism, business, pre-investment, or social visits."}
                        </p>
                    </button>

                    {/* CARD 3: Multiple-Entry Visa */}
                    <button
                        onClick={() => handleCardClick("multiple", t.multiple_title || "Multiple-Entry Visas", t.multiple_desc || "Frequent traveler? These visas allow you to enter and exit Indonesia multiple times over 1-2 years.")}
                        className={`glass-card ${styles.card} cursor-pointer hover:border-primary/50 transition-all duration-300 group text-left w-full`}
                        aria-label="Filter Multiple Entry Visas"
                    >
                        <div className={`${styles.iconWrapper} group-hover:bg-primary/10 group-hover:text-primary transition-colors`}>
                            <Globe size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 mode-aware-text">{t.multiple_title || "Multiple-Entry Visa"}</h3>
                        <p className="text-base mode-aware-subtext">
                            {t.multiple_desc || "1, 2, or 5-year validities for business or tourism. Enter and exit freely."}
                        </p>
                    </button>

                    {/* CARD 4: KITAS / KITAP */}
                    <button
                        onClick={() => handleCardClick("kitas", t.kitas_title || "KITAS / KITAP (Long Term)", t.kitas_desc || "Limited Stay Permits for Work, Investment, Retirement, Family, and Digital Nomads.")}
                        className={`glass-card ${styles.card} cursor-pointer hover:border-primary/50 transition-all duration-300 group text-left w-full`}
                        aria-label="Filter KITAS and KITAP Visas"
                    >
                        <div className={`${styles.iconWrapper} group-hover:bg-primary/10 group-hover:text-primary transition-colors`}>
                            <Layers size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 mode-aware-text">{t.kitas_title || "KITAS / KITAP"}</h3>
                        <p className="text-base mode-aware-subtext">
                            {t.kitas_desc || "Work, Investor, Family, and Retirement residency permits (1-5 years)."}
                        </p>
                    </button>

                </div>

                {/* Popular Visas Section */}
                <div className={styles.popularSection}>
                    <h3 className="text-2xl font-bold mb-8 mode-aware-text text-left w-full max-w-6xl mx-auto">{t.popular_title || "Most Popular Visas"}</h3>
                    <div className={styles.miniGrid}>
                        {visas
                            .filter(v => popularVisaIds.includes(v.id))
                            .sort((a, b) => popularVisaIds.indexOf(a.id) - popularVisaIds.indexOf(b.id))
                            .map((visa) => {
                                const visaT = t.visas?.[visa.id] || {};
                                return (
                                    <Link href={formatNavLink(locale, `/services/${visa.id}`)} key={visa.id} className={`glass-card ${styles.miniCard}`}>
                                        <div className={styles.miniCardHeader}>
                                            <span className={`${styles.miniCardId} mode-aware-subtext`}>{visa.id}</span>
                                        </div>
                                        <h4 className="text-lg font-bold mb-2 mode-aware-text">{visaT.name || visa.name}</h4>

                                        <div className={styles.miniCardMeta}>
                                            <div className={styles.metaItem}>
                                                <span className="text-xs font-bold uppercase tracking-wider mode-aware-subtext">{t.category_label || "Category"}</span>
                                                <span className="text-sm font-bold mode-aware-text">{visaT.category || visa.category}</span>
                                            </div>
                                            <div className={styles.metaItem}>
                                                <span className="text-xs font-bold uppercase tracking-wider mode-aware-subtext">{t.validity_label || "Validity"}</span>
                                                <span className="text-sm font-bold mode-aware-text">{visaT.validity || visa.validity}</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>

                    <div className={`${styles.servicesFooter} flex justify-center w-full mt-12`}>
                        <Link href={formatNavLink(locale, "/services")} className={`cta-accent ${styles.ctaBtn}`}>
                            {t.view_all || "View All Visa Services"} <ArrowRight size={20} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* POPUP VISA LIST MODAL */}
            {selectedFilter && (
                <VisaListModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={selectedFilter.title}
                    description={selectedFilter.description}
                    filterType={selectedFilter.type}
                />
            )}
        </section>
    );
};

export default ServicesPreview;
