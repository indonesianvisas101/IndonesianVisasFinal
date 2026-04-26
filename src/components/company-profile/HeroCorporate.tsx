"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Award, Globe, ArrowDown } from "lucide-react";

const StatItem = ({ value, label, icon: Icon, delay }: { value: string, label: string, icon: any, delay: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="flex flex-col items-center text-center p-8 bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-xl hover:border-primary/40 transition-colors group"
    >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <Icon size={32} strokeWidth={1.5} />
        </div>
        <div className="text-4xl font-black mode-aware-text tracking-tighter mb-2">{value}</div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
            {label.split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}
        </div>
    </motion.div>
);

export default function HeroCorporate() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-40 overflow-hidden bg-slate-950">
            {/* Visual Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full opacity-50" />
                <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-accent/10 blur-[150px] rounded-full opacity-30" />
                {/* Animated Grid Lines or Dots could go here */}
                <div className="absolute inset-0 bg-[url('/images/hero-corporate-placeholder.jpg')] bg-cover bg-center opacity-20 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto text-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-primary text-sm font-black uppercase tracking-[0.3em]"
                    >
                        <ShieldCheck size={16} /> Corporate Identity
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[1.1]"
                    >
                        Your Trusted Legal <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary/80">Gateway to Indonesia</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium"
                    >
                        More than just an agency, we are your certified legal partner for living, working, and thriving in Indonesia. Combining international governance standards with seamless local execution.
                    </motion.p>

                    {/* Scroll Indicator */}
                    <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="pt-12 flex flex-col items-center gap-2 text-slate-500"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest">Scroll to Explore</span>
                        <ArrowDown size={16} />
                    </motion.div>
                </div>

                {/* Stats Grid Overlay */}
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 grid md:grid-cols-3 gap-6">
                    <StatItem 
                        value="16+" 
                        label="Years of Excellence\n(Since 2010)" 
                        icon={Award} 
                        delay={0.6}
                    />
                    <StatItem 
                        value="10,000+" 
                        label="Visas Successfully\nProcessed" 
                        icon={Globe} 
                        delay={0.7}
                    />
                    <StatItem 
                        value="99%" 
                        label="Industry-Leading\nApproval Rate" 
                        icon={ShieldCheck} 
                        delay={0.8}
                    />
                </div>
            </div>
        </section>
    );
}
