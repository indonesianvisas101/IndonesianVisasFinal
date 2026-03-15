"use client";

import React, { useState } from "react";
import { 
    ShieldCheck, QrCode, ClipboardCheck, 
    CheckCircle2, Zap, Lock, Globe, 
    Server, Smartphone, Fingerprint, 
    Eye, Verified, ArrowRight,
    Rotate3d, Sparkles, Layers,
    ShieldAlert, Database, Scale,
    Building2, Gavel, Network
} from "lucide-react";
import { Box, Typography, Grid, Paper, Container } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import IDivCardModern from "@/components/idiv/IDivCardModern";
import SectionWrapper from "@/components/layout/SectionWrapper";

export default function VerificationClient({ t }: { t: any }) {
    const [hoveredSection, setHoveredSection] = useState<number | null>(null);

    const SECTIONS = [
        {
            title: "Smart QR Integration",
            desc: "Every card features a cryptographic Smart QR Code that links directly to our real-time verification database. Unlike static barcodes, ours uses dynamic session tokens for enhanced security.",
            icon: QrCode,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "3D Secure Visualization",
            desc: "The IDiv Digital Twin technology renders a perfect 3D copy of your physical card, allowing authorities to verify visual markers and holographic elements instantly from any device.",
            icon: Rotate3d,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Visa Advance™ Engine",
            desc: "Powered by our proprietary engine, every verification request is processed across a global network of 12+ nodes ensuring sub-second response times and 99.9% availability.",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            title: "Biometric Handshake",
            desc: "Our systems perform a cryptographic handshake with your passport data during registration, creating an immutable bond between your physical ID and digital record.",
            icon: Fingerprint,
            color: "text-red-500",
            bg: "bg-red-500/10"
        },
        {
            title: "Cloud Database Sync",
            desc: "Real-time synchronization with Indonesian immigration batch updates ensures your visa status is always up-to-date, from the moment of issuance to expiry.",
            icon: Database,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Encryption Protocol 256",
            desc: "We use bank-level AES-256 encryption to protect your data at rest and in transit. Your personal information is accessible only to you and authorized verification parties.",
            icon: Lock,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            title: "Officer Liaison Support",
            desc: "The digital portal includes a direct line to our 24/7 Bali-based legal team, providing officer assistance during document checks or local authority interactions.",
            icon: Scale,
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        },
        {
            title: "Physical Integrity Check",
            desc: "Our high-definition card printing process includes embedded security micro-textures that can be verified against the digital twin patterns shown in the portal.",
            icon: Sparkles,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            title: "Corporate Guarantee",
            desc: "Backed by PT Indonesian Visas Agency, the IDiv represents an official sponsorship guarantee that facilitates smooth travel and residency throughout the archipelago.",
            icon: Building2,
            color: "text-teal-500",
            bg: "bg-teal-500/10"
        },
        {
            title: "Global CDN Edge",
            desc: "Whether you are in Bali, Jakarta, or overseas, our verification gateway is accessible via a high-performance Content Delivery Network (CDN) with zero downtime.",
            icon: Globe,
            color: "text-cyan-500",
            bg: "bg-cyan-500/10"
        },
        {
            title: "Audit Trail Logging",
            desc: "Every verification scan generates a secure audit trail, providing a digital history of interactions that can be used for legal or insurance purposes if required.",
            icon: ClipboardCheck,
            color: "text-slate-500",
            bg: "bg-slate-500/10"
        },
        {
            title: "Universal Compatibility",
            desc: "The Smart Code is compatible with all modern smartphone scanners and specialized immigration hardware, requiring no additional apps to function.",
            icon: Smartphone,
            color: "text-sky-500",
            bg: "bg-sky-500/10"
        }
    ];

    return (
        <div className="space-y-32">
            {/* Phase 1: Interactive 3D Card Showcase */}
            <section className="relative py-20 overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black tracking-widest uppercase italic">
                            <Rotate3d size={16} /> 3D Digital Twin Technology
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black mode-aware-text tracking-tighter leading-none uppercase italic">
                            Your Visa, <br /> Evolutionized.
                        </h2>
                        <p className="text-xl mode-aware-subtext font-medium leading-relaxed">
                            The IDiv (Identity Indonesian Visas) is not just a plastic card. It is a secure gateway to our **Visa Advance™** ecosystem. 
                            Hover over or rotate the card to see the high-definition security layers.
                        </p>
                        <div className="flex gap-4">
                            <Box className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 flex-1">
                                <Typography className="text-primary font-black text-2xl mb-1">100%</Typography>
                                <Typography className="text-xs font-bold mode-aware-subtext uppercase tracking-widest">Fraud Protection</Typography>
                            </Box>
                            <Box className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 flex-1">
                                <Typography className="text-primary font-black text-2xl mb-1">&lt;1s</Typography>
                                <Typography className="text-xs font-bold mode-aware-subtext uppercase tracking-widest">Verify Speed</Typography>
                            </Box>
                        </div>
                    </motion.div>

                    <div className="relative group perspective-1000">
                        <div className="absolute inset-x-0 inset-y-0 bg-primary/20 blur-[120px] rounded-full scale-125 -z-10 group-hover:bg-primary/30 transition-all duration-700" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", damping: 20 }}
                            className="relative z-10"
                        >
                            <IDivCardModern autoRotate={true} />
                        </motion.div>
                        
                        {/* Interactive Tooltips */}
                        <div className="absolute -right-4 top-1/4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 max-w-[180px] hidden md:block animate-bounce-slow">
                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Verification QR</div>
                            <div className="text-[11px] font-medium mode-aware-subtext">Scanned for instant data validation.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Phase 2: Core Infographic Sections (12 Detailed Modules) */}
            <section className="space-y-16">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black mode-aware-text tracking-tight uppercase italic leading-none">The 12 Pillars of IDiv Integration</h2>
                    <p className="mode-aware-subtext font-medium text-lg leading-relaxed">
                        Explore the advanced technical and legal layers that make our verification system the most trusted in Indonesia.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SECTIONS.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (idx % 3) * 0.1 }}
                            onMouseEnter={() => setHoveredSection(idx)}
                            onMouseLeave={() => setHoveredSection(null)}
                            className="glass-card p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 hover:border-primary/20 transition-all duration-500 group flex flex-col h-full"
                        >
                            <div className={`w-16 h-16 ${section.bg} ${section.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                                <section.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black mode-aware-text tracking-tight uppercase italic mb-4">{section.title}</h3>
                            <p className="mode-aware-subtext font-medium leading-relaxed group-hover:mode-aware-text transition-colors flex-1">
                                {section.desc}
                            </p>
                            <div className="mt-8 h-1 w-12 bg-primary/20 rounded-full group-hover:w-full transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Phase 3: Authority Liaison (Final CTA & Social Proof) */}
            <section className="bg-slate-900 py-24 px-12 md:px-20 rounded-[5rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -ml-48 -mb-48" />
                
                <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="bg-primary px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase inline-block">Official Partner Support</div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                            Legal Protection <br /> 24/7 Verified
                        </h2>
                        <p className="text-lg text-white/60 font-medium leading-relaxed">
                            Every IDiv card scan provides immigration officers and local authorities with **Legal Context**. 
                            We don't just show data; we provide a corporate guarantee from **PT Indonesian Visas Agency**, stating your sponsorship status and our direct responsibility for your stay.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <div className="text-primary font-black text-3xl">15k+</div>
                                <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Active Members</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-primary font-black text-3xl">0.0%</div>
                                <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Breach Record</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-1 w-full aspect-video bg-gradient-to-br from-white/20 to-transparent rounded-[3rem] overflow-hidden">
                        <div className="w-full h-full bg-slate-950/80 backdrop-blur-xl rounded-[2.9rem] p-10 flex flex-col justify-center gap-6 relative">
                            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                                <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center animate-pulse">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <div className="text-xs font-black uppercase tracking-widest text-green-500">Officer Portal Active</div>
                                    <div className="text-sm font-bold">Authenticated Authority Session</div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="h-6 bg-white/5 rounded-full w-3/4 animate-pulse" />
                                <div className="h-6 bg-white/5 rounded-full w-1/2 animate-pulse" />
                                <div className="h-6 bg-white/5 rounded-full w-2/3 animate-pulse" />
                            </div>

                            <button className="mt-6 w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all">
                                Access Sample Portal v4.0
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
