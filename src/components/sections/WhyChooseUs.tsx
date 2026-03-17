"use client";

import React from "react";
import styles from "./WhyChooseUs.module.css";
import { motion } from "framer-motion";
import CentralInfoPopup, { StaticPopupInfo } from "../common/CentralInfoPopup";
import { Info, ShieldCheck, CheckCircle, Zap, PhoneCallIcon, Clock, Star } from "lucide-react";

const WhyChooseUs = ({ dict }: { dict?: any }) => {
    const [activePopup, setActivePopup] = React.useState<StaticPopupInfo | null>(null);

    const t = dict?.why_choose_us || {};
    const pt = t.popups || {};

    const featurePopups: Record<number, StaticPopupInfo> = {
        0: {
            id: 'why-choose-us-fast',
            title: pt.feature1?.title || 'Express Processing Lane',
            icon: <Zap size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-amber-600 uppercase tracking-widest">Speed & Priority</p>
                    <p className="text-base leading-relaxed">
                        {pt.feature1?.content || 'We offer 1-4 hour turnaround times for eligible applications.'}
                    </p>
                </div>
            )
        },
        1: {
            id: 'why-choose-us-secure',
            title: pt.feature2?.title || 'Bank-Level Protection',
            icon: <ShieldCheck size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-blue-600 uppercase tracking-widest">AES-256 Encryption</p>
                    <p className="text-base leading-relaxed">
                        {pt.feature2?.content || 'Your data is protected by the same security standards used by global financial institutions.'}
                    </p>
                </div>
            )
        },
        2: {
            id: 'why-choose-us-success',
            title: pt.feature3?.title || 'The Draft System™',
            icon: <CheckCircle size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-green-600 uppercase tracking-widest">99% Approval Rate</p>
                    <p className="text-base leading-relaxed">
                        {pt.feature3?.content || 'We maintain an industry-leading success rate by pre-verifying every application.'}
                    </p>
                </div>
            )
        },
        3: {
            id: 'why-choose-us-support',
            title: pt.feature4?.title || 'Multi-Lingual Experts',
            icon: <PhoneCallIcon size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-blue-600 uppercase tracking-widest">24/7 Global Support</p>
                    <p className="text-base leading-relaxed">
                        {pt.feature4?.content || 'Access our dedicated support team via WhatsApp, Telegram, or Email around the clock.'}
                    </p>
                </div>
            )
        }
    };


    return (
        <section className={styles.section}>
            <div className="container">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-extrabold mb-6 mode-aware-text text-center"
                >
                    {t.title || "Why Choose Us?"}
                </motion.h2>

                <CentralInfoPopup isOpen={!!activePopup} onClose={() => setActivePopup(null)} info={activePopup} />
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
                            onClick={() => setActivePopup(featurePopups[idx])}
                            className={`glass-card ${styles.featureCard} group cursor-help`}
                        >
                            <div className="text-primary mb-4 mx-auto group-hover:scale-110 transition-transform duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 mode-aware-text flex items-center justify-between gap-2">
                                {feature.title}
                                <Info size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-sm mode-aware-subtext leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default WhyChooseUs;
