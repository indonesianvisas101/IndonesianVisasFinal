"use client";

import React from "react";
import { ShieldCheck, Lock, CheckCircle2, Globe, Zap, ShieldAlert, ArrowRight, Search } from "lucide-react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import IDivCardModern from "../idiv/IDivCardModern";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QRCodeSVG } from 'qrcode.react';
import CentralInfoPopup, { StaticPopupInfo } from "../common/CentralInfoPopup";
import { Info } from "lucide-react";
import { formatNavLink } from "@/utils/seo";

const SafetyGuard = ({ dict }: { dict?: any }) => {
    const [isFlipped, setIsFlipped] = React.useState(false);
    const [activePopup, setActivePopup] = React.useState<StaticPopupInfo | null>(null);

    const t_explained = dict?.verification_explained_page || {};
    const pt = t_explained.popups || {};

    const featurePopups: Record<number, StaticPopupInfo> = {
        0: {
            id: 'safety-guard-security',
            title: pt.feature1?.title || 'End-to-End Encryption',
            icon: <Lock size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-blue-600 uppercase tracking-widest">Bank-Level Protocol</p>
                    <p className="text-base leading-relaxed">
                        {pt.feature1?.content || 'We use TLS 1.3 and AES-256 encryption at rest.'}
                    </p>
                </div>
            )
        },
        1: {
            id: 'safety-guard-verified',
            title: pt.feature2?.title || 'Official System Integration',
            icon: <CheckCircle2 size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-green-600 uppercase tracking-widest">Database Accuracy</p>
                    <p className="text-base leading-relaxed">
                        {pt.feature2?.content || 'Every visa we process is triple-checked against the live database.'}
                    </p>
                </div>
            )
        },
        2: {
            id: 'safety-guard-privacy',
            title: pt.feature3?.title || 'The 48-Hour Purge',
            icon: <ShieldCheck size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-purple-600 uppercase tracking-widest">Privacy Commitment</p>
                    <p className="text-base leading-relaxed">
                        {pt.feature3?.content || 'Our system automatically and permanently deletes your documents after 48 hours.'}
                    </p>
                </div>
            )
        },
        3: {
            id: 'safety-guard-compliance',
            title: pt.feature4?.title || 'Global Data Standards',
            icon: <Globe size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="font-bold text-sm text-orange-600 uppercase tracking-widest">Regulatory Alignment</p>
                    <p className="text-base leading-relaxed">
                        {pt.feature4?.content || 'We operate in full alignment with GDPR (EU) and PDPA (Indonesia).'}
                    </p>
                </div>
            )
        }
    };

    const params = useParams();
    const locale = (params?.locale as string) || 'en';
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

                    <CentralInfoPopup isOpen={!!activePopup} onClose={() => setActivePopup(null)} info={activePopup} />
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
                            onClick={() => setActivePopup(featurePopups[idx])}
                            className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-500 cursor-help"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/10 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                <feature.icon size={32} className={feature.iconColor} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 mode-aware-text flex items-center justify-center gap-2">
                                {feature.title}
                                <Info size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
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
                        <div className="md:w-1/2 relative perspective-1000 group hidden md:block">
                             <div className="relative w-full aspect-video transform-gpu preserve-3d">
                                 <motion.div 
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    className="relative w-full h-full transform-style-3d cursor-pointer"
                                    onClick={() => setIsFlipped(!isFlipped)}
                                >
                                    {/* Front Side: Visa Advance Branding */}
                                    <div className={`absolute inset-0 backface-hidden bg-gradient-to-tr from-blue-600 to-primary rounded-[2rem] shadow-2xl flex items-center justify-center text-white p-8 text-center overflow-hidden ${isFlipped ? 'pointer-events-none' : ''}`}>
                                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                                            <svg width="100%" height="100%"><pattern id="grid-safety" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid-safety)" /></svg>
                                        </div>
                                        <div className="space-y-4 relative z-10">
                                            <div className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-xl flex items-center justify-center mx-auto mb-6 border border-white/30 shadow-inner">
                                                <Zap size={40} className="text-white animate-pulse" />
                                            </div>
                                            <h4 className="text-3xl font-black tracking-tight">Visa Advance™</h4>
                                            <p className="opacity-80 font-medium">Click to reveal your encrypted verification code.</p>
                                            <div className="inline-flex items-center gap-2 bg-green-400/20 text-green-300 px-4 py-1.5 rounded-full text-xs font-bold border border-green-400/30 mt-4 backdrop-blur-sm">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                                                SYSTEM ACTIVE & SECURED
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back Side: Smart Code / QR */}
                                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center p-8 border-2 border-primary/20">
                                        <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] mb-4 border border-dashed border-primary/30 relative">
                                            <QRCodeSVG 
                                                value="https://indonesianvisas.com/en/verification-explained"
                                                size={160}
                                                level="H"
                                                includeMargin={false}
                                                className="dark:invert"
                                            />
                                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                                                <ShieldCheck size={16} />
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-center">
                                            <div className="inline-flex items-center gap-2 text-primary font-black tracking-tighter text-sm uppercase">
                                                <Lock size={14} /> Encrypted Smart Code
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">UID: IV-AUTO-SECURE-8829</p>
                                        </div>
                                    </div>
                                </motion.div>
                             </div>
                        </div>
                   </div>

                   {/* IDiv Explained Section */}
                   <div className="mt-1 bg-blue-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 p-8 md:p-12 rounded-none flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2 flex justify-center">
                            <div className="scale-90 md:scale-100">
                                <IDivCardModern showDownload={false} shareUrl="https://indonesianvisas.com/id-indonesian-visas" />
                            </div>
                        </div>
                        <div className="md:w-1/2 space-y-6">
                            <h3 className="text-3xl font-black mode-aware-text">ID Indonesian Visas (IDIV)</h3>
                            <p className="mode-aware-subtext text-lg">
                                The official Digital ID Card issued by <strong>IndonesianVisas.com</strong>. This serves as your <strong>Official Verified Sponsor ID</strong>, facilitating smooth interactions with local authorities and travel checkpoints throughout Indonesia.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <Box className="p-4 bg-white dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/10">
                                    <Typography variant="caption" color="primary" fontWeight="bold">NIK / ID NUMBER</Typography>
                                    <Typography variant="body2" fontWeight="bold" className="mode-aware-text">Verified Globally</Typography>
                                </Box>
                                <Box className="p-4 bg-white dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/10">
                                    <Typography variant="caption" color="primary" fontWeight="bold">SMART CODE</Typography>
                                    <Typography variant="body2" fontWeight="bold" className="mode-aware-text">Integrated System</Typography>
                                </Box>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
                                <Link href={formatNavLink(locale, "/id-indonesian-visas")} className="flex-1">
                                    <button className="cta-primary w-full justify-center">
                                        Learn More <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </Link>
                                 <Link href={formatNavLink(locale, "/idiv-search")} className="flex-1">
                                    <button className="w-full justify-center py-4 rounded-full bg-transparent text-black dark:text-white font-black border-2 border-black dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest text-sm">
                                        <Search size={18} /> Search ID
                                    </button>
                                </Link>
                            </div>
                        </div>
                   </div>

                   {/* IDg Explained Section (New) */}
                   <div className="mt-1 bg-purple-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 p-8 md:p-12 rounded-b-[2.9rem] flex flex-col md:flex-row-reverse items-center gap-12">
                        <div className="md:w-1/2 flex justify-center">
                            <div className="scale-90 md:scale-100">
                                <IDivCardModern mode="IDG" variant="purple" showDownload={false} shareUrl="https://indonesianvisas.com/id-guide" />
                            </div>
                        </div>
                        <div className="md:w-1/2 space-y-6">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-200 dark:border-purple-800">
                                NEW: 24/7 SUPPORT COMPANION
                            </div>
                            <h3 className="text-3xl font-black mode-aware-text">Indonesian ID Guide (IDg)</h3>
                            <p className="mode-aware-subtext text-lg">
                                Your **Digital Support Hub** in Indonesia. Designed for short-term visitors and digital nomads who want 24/7 assistance with local rules, disputes, and emergency guidance without requiring a visa sponsor.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <Box className="p-4 bg-white dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/10">
                                    <Typography variant="caption" sx={{ color: '#7c3aed' }} fontWeight="bold">GUIDE SERVICE</Typography>
                                    <Typography variant="body2" fontWeight="bold" className="mode-aware-text">24/7 Live Help</Typography>
                                </Box>
                                <Box className="p-4 bg-white dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/10">
                                    <Typography variant="caption" sx={{ color: '#7c3aed' }} fontWeight="bold">IDG SEARCH</Typography>
                                    <Typography variant="body2" fontWeight="bold" className="mode-aware-text">Traceable System</Typography>
                                </Box>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
                                <Link href={formatNavLink(locale, "/id-guide")} className="flex-1">
                                    <button className="w-full justify-center py-4 rounded-full bg-[#7c3aed] text-white font-black hover:bg-[#6d28d9] transition-all flex items-center gap-2 shadow-lg uppercase tracking-widest text-sm">
                                        Learn More <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </Link>
                                 <Link href={formatNavLink(locale, "/idiv-search")} className="flex-1">
                                    <button className="w-full justify-center py-4 rounded-full bg-transparent text-black dark:text-white font-black border-2 border-black dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest text-sm">
                                        <Search size={18} /> Search ID
                                    </button>
                                </Link>
                            </div>
                        </div>
                   </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SafetyGuard;
