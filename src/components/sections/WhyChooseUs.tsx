"use client";

import React from "react";
import styles from "./WhyChooseUs.module.css";
import { motion } from "framer-motion";
import CentralInfoPopup, { StaticPopupInfo } from "../common/CentralInfoPopup";
import { Info, ShieldCheck, CheckCircle, Zap, PhoneCallIcon, Clock, Star } from "lucide-react";

const WhyChooseUs = ({ dict }: { dict?: any }) => {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);

    const whyChooseUsInfo: StaticPopupInfo = {
        id: 'why-choose-us-info',
        title: 'Why We Are Number 1',
        icon: <Star size={32} />,
        content: (
            <div className="space-y-4">
                <p className="font-bold text-sm text-blue-600 uppercase tracking-widest">16 Years of Excellence</p>
                <p className="text-base leading-relaxed">
                    IndonesianVisas.com stands apart through a combination of proprietary technology and deep local expertise.
                </p>
                <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                        <Clock size={24} className="text-amber-600 shrink-0" />
                        <div>
                            <p className="text-sm font-bold">Unrivaled Experience</p>
                            <p className="text-xs text-slate-500">Founded in 2010, we've navigated every policy shift in Indonesian immigration history.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex gap-3">
                        <CheckCircle size={24} className="text-green-600 shrink-0" />
                        <div>
                            <p className="text-sm font-bold">The 99% Promise</p>
                            <p className="text-xs text-slate-500">We don't just submit; we pre-screen and draft to guarantee your approval before final submission.</p>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-slate-400 italic">Trusted by 10,000+ digital nomads, families, and corporations worldwide.</p>
            </div>
        )
    };

    const t = dict?.why_choose_us || {};

    return (
        <section className={styles.section}>
            <div className="container">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-extrabold mb-6 mode-aware-text text-center cursor-help flex items-center justify-center gap-3 group"
                    onClick={() => setIsPopupOpen(true)}
                >
                    {t.title || "Why Choose Us?"} <Info size={24} className="text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                </motion.h2>

                <CentralInfoPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} info={whyChooseUsInfo} />
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-16 mode-aware-subtext leading-relaxed"
                >
                    {t.description || "We're your trusted partner with proven expertise. Since 2010, we've been Indonesia's leading visa service provider, trusted by individuals and corporations worldwide."}
                </motion.p>

                <div className={styles.featuresGrid}>
                    {[
                        { icon: <Zap size={48} />, title: t.feature1_title || "Lightning Fast", desc: t.feature1_desc || "Express processing available - get your visa in as little as 1-4 hours" },
                        { icon: <ShieldCheck size={48} />, title: t.feature2_title || "100% Secure", desc: t.feature2_desc || "Bank-level encryption protects your personal and payment information" },
                        { icon: <CheckCircle size={48} />, title: t.feature3_title || "99% Approval", desc: t.feature3_desc || "Industry-leading success rate with thousands of satisfied clients" },
                        { icon: <PhoneCallIcon size={48} />, title: t.feature4_title || "24/7 Support", desc: t.feature4_desc || "Always available via WhatsApp, email, or phone in multiple languages" }
                    ].map((feature, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            whileHover={{ y: -12, scale: 1.02 }}
                            className={`glass-card ${styles.featureCard} group`}
                        >
                            <div className="text-primary mb-4 mx-auto group-hover:scale-110 transition-transform duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 mode-aware-text">{feature.title}</h3>
                            <p className="text-sm mode-aware-subtext leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default WhyChooseUs;
