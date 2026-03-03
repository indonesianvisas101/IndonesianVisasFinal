"use client";

import React from "react";
import { FileText, Search, Plane } from "lucide-react";
import styles from "./HowItWorks.module.css";

const HowItWorks = ({ dict }: { dict?: any }) => {
    const t = dict?.how_it_works || {};

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 mode-aware-text text-center">{t.title || "How It Works"}</h2>
                <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-16 mode-aware-subtext leading-relaxed">
                    {t.description || "Our streamlined process makes getting your Indonesian visa effortless. With over 16 years of experience, we've helped thousands of travelers and businesses secure their visas with a 98% approval rate."}
                </p>

                <div className={styles.grid}>
                    <div className={`glass-card ${styles.card}`}>
                        <div className={styles.iconWrapper}>
                            <FileText size={56} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 mode-aware-text">{t.step1_title || "1. Fill Application"}</h3>
                        <p className="text-base mode-aware-subtext leading-relaxed">
                            {t.step1_desc || "Complete our simple online form with your travel details. Our smart form guides you through each step, ensuring you provide all necessary information correctly."}
                        </p>
                    </div>

                    <div className={`glass-card ${styles.card}`}>
                        <div className={styles.iconWrapper}>
                            <Search size={56} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 mode-aware-text">{t.step2_title || "2. We Process"}</h3>
                        <p className="text-base mode-aware-subtext leading-relaxed">
                            {t.step2_desc || "Our expert team reviews and submits your application. We handle all communication with immigration authorities and keep you updated every step of the way."}
                        </p>
                    </div>

                    <div className={`glass-card ${styles.card}`}>
                        <div className={styles.iconWrapper}>
                            <Plane size={56} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 mode-aware-text">{t.step3_title || "3. Travel Ready"}</h3>
                        <p className="text-base mode-aware-subtext leading-relaxed">
                            {t.step3_desc || "Receive your approved visa via email. Print or save digitally - you're ready to explore Indonesia! We also provide post-approval support if needed."}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
