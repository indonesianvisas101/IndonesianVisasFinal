"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Linkedin, Award, ShieldCheck, Zap } from "lucide-react";

export default function LeadershipProfile() {
    return (
        <section className="py-24 md:py-32 bg-slate-950 text-white overflow-hidden relative">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                    
                    {/* Image Side */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                            <Image
                                src="/images/bayu-ceo.webp"
                                alt="Bayu Damopolii - Founder"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                            
                            {/* Floating Stats on Image */}
                            <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Experience</p>
                                        <p className="text-2xl font-black">16+ Years</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                        <Award size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative Rings */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-primary/20 rounded-full animate-pulse" />
                        <div className="absolute -bottom-10 -right-10 w-60 h-60 border-2 border-accent/20 rounded-full animate-pulse [animation-delay:1000ms]" />
                    </motion.div>

                    {/* Content Side */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                                <ShieldCheck size={14} /> Key Leadership
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
                                Bayu Damopolii<span className="text-primary">-</span>Manoppo
                            </h2>
                            <p className="text-2xl font-bold text-slate-400">Founder & Managing Director</p>
                        </div>

                        <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-medium">
                            <p>
                                As the driving force behind <span className="text-white font-bold tracking-tight">PT Indonesian Visas Agency™</span>, Bayu brings a vision to revolutionize immigration and business legalities in Indonesia. 
                            </p>
                            <p>
                                Under his strategic leadership, the company has transformed from a boutique local consultancy into a national authority trusted by global corporations, diplomats, and international investors.
                            </p>
                        </div>

                        {/* Value Points */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                { title: "Legal Authority", desc: "Expert in Indonesian Law", icon: ShieldCheck },
                                { title: "Strategic Vision", desc: "Digital-first mobility", icon: Zap }
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-white">{item.title}</p>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8">
                            <a 
                                href="https://www.linkedin.com/in/bayu-damopolii-887ab883/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Linkedin size={20} />
                                Connect on LinkedIn
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
