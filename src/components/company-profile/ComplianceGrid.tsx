"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Building2, FileText, CheckCircle2 } from "lucide-react";

export default function ComplianceGrid() {
    const COMPLIANCE_DATA = [
        {
            icon: Building2,
            title: "Legal Entity",
            value: "PT Indonesian Visas Agency™"
        },
        {
            icon: FileText,
            title: "Business Registration (NIB)",
            value: "0402260034806"
        },
        {
            icon: FileText,
            title: "Tax ID (NPWP)",
            value: "1000000008117681"
        },
        {
            icon: ShieldCheck,
            title: "Registered Certificate (SKT)",
            value: "S-04449/SKT-WP-CT/KPP.1701/2026"
        },
        {
            icon: ShieldCheck,
            title: "Ministry of Law (AHU)",
            value: "AHU-00065.AH.02.01.TAHUN 2020"
        },
        {
            icon: CheckCircle2,
            title: "Immigration Sponsor Status",
            value: "Recorded 2010, 2014, 2023, 2024, 2026"
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-white dark:bg-[#030712] transition-colors">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                        Absolute Governance
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black mode-aware-text tracking-tighter"
                    >
                        Uncompromising Legal Compliance
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl mode-aware-subtext font-medium"
                    >
                        For corporate partners and B2B clients, we operate with 100% transparency. Our credentials are open, verified, and officially registered with the Republic of Indonesia.
                    </motion.p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {COMPLIANCE_DATA.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                                    <item.icon size={24} />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.title}</h4>
                            </div>
                            <p className="text-xl font-black mode-aware-text break-all">{item.value}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <p className="text-xs mode-aware-subtext italic max-w-2xl mx-auto opacity-70">
                        * The trademark INDONESIAN VISAS® is currently undergoing final registration at the Directorate General of Intellectual Property (DJKI) transitioning from (™) to (®).
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
