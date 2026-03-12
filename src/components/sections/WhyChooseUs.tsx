"use client";

import React from "react";
import { Zap, ShieldCheck, CheckCircle, PhoneCallIcon } from "lucide-react";
import styles from "./WhyChooseUs.module.css";
import { motion } from "framer-motion";


const WhyChooseUs = ({ dict }: { dict?: any }) => {
    const t = dict?.why_choose_us || {};

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
