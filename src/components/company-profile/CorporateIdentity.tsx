"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Leaf, Lock, ShieldCheck } from "lucide-react";

export default function CorporateIdentity() {
    const values = [
        {
            icon: Lock,
            title: "Bank-Level Security",
            desc: "Absolute data privacy controls. Corporate documents and passports are encrypted using enterprise-grade protocols.",
            color: "slate"
        },
        {
            icon: ShieldCheck,
            title: "Zero-Tolerance Policy",
            desc: "We operate strictly by the book. No bribery, no hidden fees, and absolute compliance with Indonesian Immigration Law.",
            color: "primary"
        },
        {
            icon: Leaf,
            title: "Transparent Ecosystem",
            desc: "As a key subsidiary of Bali Enterprises, our pricing structure is 100% transparent with itemized government levies.",
            color: "accent"
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden transition-colors">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em]"
                    >
                        Corporate Identity
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black mode-aware-text tracking-tighter"
                    >
                        The Bali Enterprises Ecosystem
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl mode-aware-subtext font-medium italic"
                    >
                        &quot;To simplify Indonesian bureaucracy for the world. We believe that borders should not be barriers to opportunity.&quot;
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {values.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * idx }}
                            className="glass-card p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all duration-500 group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black mode-aware-text mb-4">{item.title}</h3>
                            <p className="mode-aware-subtext leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
