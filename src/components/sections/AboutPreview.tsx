"use client";

import React from "react";
import Link from "next/link";
import styles from "./AboutPreview.module.css";
import PhotoCollage from "./PhotoCollage";
import { formatNavLink } from "@/utils/seo";
import { useParams } from "next/navigation";

const AboutPreview = ({ dict }: { dict?: any }) => {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const t = dict?.about_preview || {};

    return (
        <section className={styles.section}>
            <div className="container">
                {/* Unified Card Design - Full Background Image / Slider */}
                <div className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[500px] group`}>

                    {/* Background: Sliding Gallery */}
                    <div className="absolute inset-0">
                        <PhotoCollage />
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-black/40 z-10" />

                    {/* Content Overlay - Centered Card */}
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="p-10 md:p-14 text-center max-w-3xl mx-4 pointer-events-auto">
                            <h2 className={`${styles.heading} text-white mb-6 drop-shadow-xl text-4xl md:text-5xl`}>{t.title || "About Indonesian Visas"}</h2>
                            <p className={`${styles.text} text-white text-lg md:text-xl mb-8 drop-shadow-lg font-medium`}>
                                {t.description || "Your trusted partner for seamless Indonesian visa processing since 2010. We are part of PT Indonesian Visas Agency™ (MYVISA), dedicated to making your Indonesian journey smooth and stress-free."}
                            </p>
                            <Link href={formatNavLink(locale, "/about")} className={`cta-accent ${styles.btn} shadow-2xl hover:scale-105 transition-transform inline-block`}>
                                {t.cta || "Learn More About Us"}
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutPreview;
