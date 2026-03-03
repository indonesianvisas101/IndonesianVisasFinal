
import styles from "./Hero.module.css";
import React from "react";
import { HeroGlobeWrapper, HeroCTA, HeroSteps } from "./HeroClient";

// Server Component (No 'use client')
const Hero = ({ dict }: { dict: any }) => {
    // Defensive access to dictionary keys
    const hero = dict?.hero || {};
    const stats = hero.stats || {};
    const steps = hero.steps || {};

    return (
        <section className={styles.hero}>
            {/* Globe is Client-Side Only */}
            <HeroGlobeWrapper />

            <div className="container">
                <div className={styles.content}>
                    <div className={styles.left}>
                        <h1 className={styles.title}>{hero.title || "INDONESIAN VISAS"}</h1>
                        <h2 className={styles.subtitle}>{hero.subtitle || "Your Gateway to Indonesia"}</h2>
                        <p className={styles.description}>
                            {hero.description || "Professional visa services for travelers, businesses, and digital nomads."}
                        </p>

                        {/* Stats - Server Rendered Static Text */}
                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>01</div>
                                <div className={styles.statLabel}>{stats.company || "Visas Company"}</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>10K+</div>
                                <div className={styles.statLabel}>{stats.processed || "Visas Processed"}</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>99%</div>
                                <div className={styles.statLabel}>{stats.success || "Success Rate"}</div>
                            </div>
                        </div>

                        {/* Interactive Client Component */}
                        <HeroCTA
                            label={hero.cta_button || "Select Your Country"}
                            arrivalCardLabel={hero.arrival_card || "Arrival Card"}
                        />
                    </div>

                    <div className={styles.right}>
                        {/* Interactive Client Component - Pass dict if needed, or keep static specific parts */}
                        <HeroSteps
                            title={steps.title || "Simple 4-Step Process"}
                            labels={{
                                step1: steps.step1 || "Select Country",
                                step1_desc: steps.step1_desc || "Choose from 97 eligible countries",
                                step2: steps.step2 || "Choose Your Visa Type",
                                step2_desc: steps.step2_desc || "Select the visa that fits your needs",
                                step3: steps.step3 || "Upload Documents",
                                step3_desc: steps.step3_desc || "Submit passport & required documents",
                                step4: steps.step4 || "Make Payment",
                                step4_desc: steps.step4_desc || "Complete payment via secure methods"
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
