
import styles from "./Hero.module.css";
import React from "react";
import { HeroGlobeWrapper, HeroCTA, HeroSteps, HeroBadge, HeroStats } from "./HeroClient";

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
                        <HeroBadge />
                        <h1 className={styles.title}>{hero.title || "INDONESIAN VISAS"}</h1>
                        <h2 className={styles.subtitle}>{hero.subtitle || "Legal & Registered Immigration Sponsor"}</h2>
                        <p className={styles.description}>
                            {hero.description || "Professional visa services for travelers, businesses, and digital nomads."}
                        </p>

                        {/* Stats - Interactive Client Component */}
                        <HeroStats 
                            company={stats.company}
                            processed={stats.processed}
                            success={stats.success}
                        />

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
