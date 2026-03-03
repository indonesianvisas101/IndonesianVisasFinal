"use client";

import React from "react";
import { Zap, ShieldCheck, CheckCircle, Star, MapPin, PhoneCallIcon } from "lucide-react";
import styles from "./WhyChooseUs.module.css";


const WhyChooseUs = ({ dict }: { dict?: any }) => {
    const t = dict?.why_choose_us || {};

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 mode-aware-text text-center">{t.title || "Why Choose Us?"}</h2>
                <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-16 mode-aware-subtext leading-relaxed">
                    {t.description || "We're your trusted partner with proven expertise. Since 2010, we've been Indonesia's leading visa service provider, trusted by individuals and corporations worldwide."}
                </p>

                <div className={styles.featuresGrid}>
                    <div className={`glass-card ${styles.featureCard}`}>
                        <Zap size={48} className="text-primary mb-4 mx-auto" />
                        <h3 className="text-xl font-bold mb-2 mode-aware-text">{t.feature1_title || "Lightning Fast"}</h3>
                        <p className="text-sm mode-aware-subtext leading-relaxed">{t.feature1_desc || "Express processing available - get your visa in as little as 1-4 hours"}</p>
                    </div>
                    <div className={`glass-card ${styles.featureCard}`}>
                        <ShieldCheck size={48} className="text-primary mb-4 mx-auto" />
                        <h3 className="text-xl font-bold mb-2 mode-aware-text">{t.feature2_title || "100% Secure"}</h3>
                        <p className="text-sm mode-aware-subtext leading-relaxed">{t.feature2_desc || "Bank-level encryption protects your personal and payment information"}</p>
                    </div>
                    <div className={`glass-card ${styles.featureCard}`}>
                        <CheckCircle size={48} className="text-primary mb-4 mx-auto" />
                        <h3 className="text-xl font-bold mb-2 mode-aware-text">{t.feature3_title || "99% Approval"}</h3>
                        <p className="text-sm mode-aware-subtext leading-relaxed">{t.feature3_desc || "Industry-leading success rate with thousands of satisfied clients"}</p>
                    </div>
                    <div className={`glass-card ${styles.featureCard}`}>
                        <PhoneCallIcon size={48} className="text-primary mb-4 mx-auto" />
                        <h3 className="text-xl font-bold mb-2 mode-aware-text">{t.feature4_title || "24/7 Support"}</h3>
                        <p className="text-sm mode-aware-subtext leading-relaxed">{t.feature4_desc || "Always available via WhatsApp, email, or phone in multiple languages"}</p>
                    </div>
                </div>


            </div>
        </section>
    );
};

export default WhyChooseUs;
