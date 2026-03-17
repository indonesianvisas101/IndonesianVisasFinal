"use client";

import React from "react";
import { FileText, Search, Plane } from "lucide-react";
import styles from "./HowItWorks.module.css";
import { motion } from "framer-motion";
import CentralInfoPopup, { StaticPopupInfo } from "../common/CentralInfoPopup";
import { Info, ListChecks, CheckCircle2, ShieldCheck, Mail, Zap } from "lucide-react";

const HowItWorks = ({ dict }: { dict?: any }) => {
    const [activePopup, setActivePopup] = React.useState<StaticPopupInfo | null>(null);

    const t = dict?.how_it_works || {};
    const pt = t.popups || {};

    const stepPopups: Record<number, StaticPopupInfo> = {
        0: {
            id: 'how-it-works-step-1',
            title: pt.step1?.title || 'Smart Application Intake',
            icon: <FileText size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-blue-600 uppercase tracking-widest">Efficiency & Accuracy</p>
                    <p className="text-base leading-relaxed">
                        {pt.step1?.content || 'Our smart form validates your data in real-time as you type, ensuring no missing fields or common errors delay your submission.'}
                    </p>
                </div>
            )
        },
        1: {
            id: 'how-it-works-step-2',
            title: pt.step2?.title || 'Expert Auditing & Submission',
            icon: <Search size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-amber-600 uppercase tracking-widest">Compliance First</p>
                    <p className="text-base leading-relaxed">
                        {pt.step2?.content || 'Every application is cross-referenced by our legal team against the latest Indonesian Immigration circulars, ensuring 100% compliance.'}
                    </p>
                </div>
            )
        },
        2: {
            id: 'how-it-works-step-3',
            title: pt.step3?.title || 'Digital Delivery & Activation',
            icon: <Plane size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-green-600 uppercase tracking-widest">Instant Results</p>
                    <p className="text-base leading-relaxed">
                        {pt.step3?.content || 'Once approved, your e-Visa is synchronized to your IDIV dashboard and delivered via encrypted email.'}
                    </p>
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-sm text-green-700">
                        <CheckCircle2 size={16} className="inline mr-1" /> Ready for immediate travel.
                    </div>
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
                    {t.title || "How It Works"}
                </motion.h2>

                <CentralInfoPopup isOpen={!!activePopup} onClose={() => setActivePopup(null)} info={activePopup} />
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-16 mode-aware-subtext leading-relaxed"
                >
                    {t.description || "Our streamlined process makes getting your Indonesian visa effortless. With over 16 years of experience, we've helped thousands of travelers and businesses secure their visas with a 98% approval rate."}
                </motion.p>

                <div className={styles.grid}>
                    {[
                        { icon: FileText, title: t.step1_title || "1. Fill Application", desc: t.step1_desc || "Complete our simple online form with your travel details. Our smart form guides you through each step, ensuring you provide all necessary information correctly." },
                        { icon: Search, title: t.step2_title || "2. We Process", desc: t.step2_desc || "Our expert team reviews and submits your application. We handle all communication with immigration authorities and keep you updated every step of the way." },
                        { icon: Plane, title: t.step3_title || "3. Travel Ready", desc: t.step3_desc || "Receive your approved visa via email. Print or save digitally - you're ready to explore Indonesia! We also provide post-approval support if needed." }
                    ].map((step, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            whileHover={{ scale: 1.03 }}
                            onClick={() => setActivePopup(stepPopups[idx])}
                            className={`glass-card ${styles.card} group cursor-help`}
                        >
                            <div className={`${styles.iconWrapper} group-hover:rotate-6 transition-transform duration-500`}>
                                <step.icon size={56} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 mode-aware-text flex items-center justify-between">
                                {step.title}
                                <Info size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-base mode-aware-subtext leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
