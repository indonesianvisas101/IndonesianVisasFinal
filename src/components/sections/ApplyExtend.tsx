

import React from "react";
import Link from "next/link";
import { FileText, RefreshCw } from "lucide-react";
import styles from "./HowItWorks.module.css";

const ApplyExtend = ({ dict }: { dict?: any }) => {
    const t = dict?.apply_extend || {};

    return (
        <section className={`${styles.section} flex justify-center`}>
            <div className="container flex justify-center">
                {/* Modified Grid to 2 Columns customized for Apply/Extend */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl max-w-[1100px] w-full mx-auto items-stretch">

                    {/* Apply Card */}
                    <Link href="/apply" className="group block h-full">
                        <div className={`glass-card ${styles.card} h-full hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-center items-center text-center p-10 min-h-[300px]`}>
                            <div className={styles.iconWrapper}>
                                <FileText size={56} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 mode-aware-text">{t.apply_title || "Apply For a Visa"}</h3>
                            <p className="text-base mode-aware-subtext">
                                {t.apply_desc || "Start your new visa application. Fast, secure, and fully online."}
                            </p>
                            <div className="mt-6 text-primary dark:text-accent font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                {t.apply_cta || "Start Application"} &rarr;
                            </div>
                        </div>
                    </Link>

                    {/* Extend Card */}
                    <Link href="/extend" className="group block h-full">
                        <div className={`glass-card ${styles.card} h-full hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-center items-center text-center p-10 min-h-[300px]`}>
                            <div className={styles.iconWrapper}>
                                <RefreshCw size={56} className="text-primary group-hover:rotate-180 transition-transform duration-700" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 mode-aware-text">{t.extend_title || "Extend Your Visa"}</h3>
                            <p className="text-base mode-aware-subtext">
                                {t.extend_desc || "Extend your stay in Indonesia easily. We handle the documentation for you."}
                            </p>
                            <div className="mt-6 text-primary dark:text-accent font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                {t.extend_cta || "Extend Now"} &rarr;
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default ApplyExtend;
