"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Rocket, MapPin, Globe, ShieldCheck, Zap } from "lucide-react";

export default function InteractiveTimeline() {
    const TIMELINE_DATA = [
        {
            year: "2010",
            title: "The Bali Help Era",
            description: "Started as a dedicated hospitality and tourist assistance agency in Denpasar, helping foreign visitors navigate Bali's local services and initial visa needs.",
            icon: MapPin
        },
        {
            year: "2014",
            title: "CV Tunas Raya Establishment",
            description: "Formal legal entity established as CV Tunas Raya with balihelp.id as the main digital portal, expanding into professional company formation services.",
            icon: Zap
        },
        {
            year: "2020",
            title: "Omnibus Law & PT Transition",
            description: "Strategically evolved into PT Indonesian Visas Agency to comply with Indonesia's Omnibus Law, specializing exclusively in national immigration services.",
            icon: ShieldCheck
        },
        {
            year: "2024 - Present",
            title: "The Global Ecosystem",
            description: "Consolidated under PT Bali Enterprises Group holding, launching a network of over 100 country-based and city-based divisions worldwide.",
            icon: Globe
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-slate-50 dark:bg-[#030712] transition-colors overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                        Heritage & Evolution
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black mode-aware-text tracking-tighter"
                    >
                        A Decade of Industry Leadership
                    </motion.h2>
                    <p className="text-xl mode-aware-subtext font-medium leading-relaxed">
                        From a local Bali assistant to a global multinational visa agency, our journey is defined by compliance and excellence.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-slate-200 dark:via-white/10 to-primary/20 hidden md:block" />

                    <div className="space-y-16 md:space-y-24">
                        {TIMELINE_DATA.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                            >
                                {/* Year Side */}
                                <div className={`w-full md:w-1/2 text-center ${idx % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                                    <h3 className="text-5xl md:text-7xl font-black text-primary/30 hover:text-primary transition-colors cursor-default">{item.year}</h3>
                                </div>

                                {/* Center Dot */}
                                <div className="relative z-10 hidden md:block">
                                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-4 border-primary flex items-center justify-center shadow-xl shadow-primary/20">
                                        <item.icon size={20} className="text-primary" />
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pl-16' : 'md:pr-16'}`}>
                                    <div className="glass-card p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all shadow-xl">
                                        <h4 className="text-2xl font-black mode-aware-text mb-3">{item.title}</h4>
                                        <p className="mode-aware-subtext leading-relaxed font-medium">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
