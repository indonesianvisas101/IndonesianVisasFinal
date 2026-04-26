"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Leaf, Waves, Wind } from "lucide-react";

export default function SustainabilityImpact() {
    const CSR_DATA = [
        {
            title: "Beach Cleanups",
            desc: "Preserving Indonesia's pristine coastlines from plastic pollution through consistent community-driven efforts.",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
            icon: Waves,
            color: "blue"
        },
        {
            title: "Forest Restoration",
            desc: "Active reforestation efforts partnering with local NGOs to secure a greener, sustainable future.",
            image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
            icon: Leaf,
            color: "emerald"
        },
        {
            title: "Coral Planting",
            desc: "Rehabilitating underwater ecosystems vital to the archipelago's diverse and fragile marine life.",
            image: "https://images.unsplash.com/photo-1546500840-ae38253aba9b?q=80&w=1200&auto=format&fit=crop",
            icon: Wind,
            color: "cyan"
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    
                    {/* Content Side */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                <Leaf size={14} /> Corporate Social Responsibility
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mode-aware-text tracking-tighter leading-tight">
                                Beyond Business: <br />
                                <span className="text-emerald-500">Protecting the Archipelago</span>
                            </h2>
                        </div>
                        
                        <p className="text-xl mode-aware-subtext leading-relaxed font-medium">
                            A portion of every visa processed through our gateway is directly allocated to real-world conservation and education projects across Indonesia. When you partner with us, you invest in the nation&apos;s future.
                        </p>

                        <div className="pt-4">
                            <a 
                                href="https://balihelp.id/csr" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                View Our CSR Initiatives
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Visual Side */}
                    <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                        {CSR_DATA.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className={`relative rounded-[2rem] overflow-hidden group shadow-2xl ${idx === 0 ? 'col-span-2 aspect-[21/9]' : 'aspect-square'}`}
                            >
                                <Image 
                                    src={item.image} 
                                    alt={item.title} 
                                    fill 
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                                            <item.icon size={18} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest opacity-80">{item.title}</span>
                                    </div>
                                    <h4 className="text-xl font-bold">{item.title}</h4>
                                    {idx === 0 && (
                                        <p className="text-sm text-white/70 max-w-md line-clamp-2">{item.desc}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
