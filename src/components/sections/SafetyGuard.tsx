"use client";

import React from "react";
import { ShieldCheck, Lock, CheckCircle2, Globe, Zap, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

const SafetyGuard = ({ dict }: { dict?: any }) => {
    const t = dict?.safety_guard || {
        title: "IndonesianVisas.com Safety Guard",
        subtitle: "The Most Advanced Verification System in Indonesia",
        description: "Our proprietary Visa Advance System provides a multi-layer security shield, ensuring your documents are 100% authentic and protected against fraud.",
        features: [
            { icon: ShieldCheck, iconColor: "text-blue-500", title: "Bank-Level Security", desc: "Your sensitive data is encrypted with 256-bit SSL technology." },
            { icon: CheckCircle2, iconColor: "text-green-500", title: "Verified Documents", desc: "Every visa is triple-checked against the official immigration database." },
            { icon: Lock, iconColor: "text-purple-500", title: "Privacy First", desc: "We never share your personal information with 3rd parties." },
            { icon: Globe, iconColor: "text-orange-500", title: "Global Compliance", desc: "Strict adherence to international data protection standards." }
        ]
    };

    return (
        <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-white/5">
            {/* Decortative Blurs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-500/30 mb-2"
                    >
                        <ShieldAlert size={16} /> Advanced Protection System
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black mode-aware-text"
                    >
                        {t.title}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg mode-aware-subtext leading-relaxed font-medium"
                    >
                        {t.description}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {t.features.map((feature: any, idx: number) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-500"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/10 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                <feature.icon size={32} className={feature.iconColor} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 mode-aware-text">{feature.title}</h3>
                            <p className="text-sm mode-aware-subtext leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Proof Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 glass-card p-1 pb-10 rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-600/10 to-primary/10"
                >
                   <div className="bg-white/80 dark:bg-black/80 backdrop-blur-3xl p-8 md:p-12 rounded-[2.9rem] flex flex-col md:flex-row items-center gap-10">
                        <div className="md:w-1/2 space-y-6">
                            <h3 className="text-3xl font-black mode-aware-text">Proven Protection for Thousands</h3>
                            <p className="mode-aware-subtext text-lg">
                                Our verification system has processed over <strong>10,000+</strong> applications without a single data breach. IndonesianVisas.com is the only agency in Bali that offers real-time QR-code verification for every visa issued.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex -space-x-3">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm font-bold mode-aware-text">
                                    <span className="text-primary">+10k</span> Verified travelers already protected
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 relative">
                             <div className="bg-gradient-to-tr from-blue-500 to-primary w-full aspect-video rounded-3xl shadow-2xl flex items-center justify-center text-white relative overflow-hidden p-6 text-center">
                                <div className="absolute inset-0 opacity-20 pointer-events-none">
                                    <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <Zap size={48} className="mx-auto" />
                                    <h4 className="text-2xl font-bold">Visa Advance™</h4>
                                    <p className="opacity-90">Real-time status tracking & database synchronization technology.</p>
                                    <div className="inline-block bg-white/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md border border-white/20">
                                        Active & Protecting
                                    </div>
                                </div>
                             </div>
                        </div>
                   </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SafetyGuard;
