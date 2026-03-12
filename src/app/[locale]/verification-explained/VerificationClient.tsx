"use client";

import React, { useState } from "react";
import { 
    ShieldCheck, QrCode, Info, ClipboardCheck, 
    CheckCircle2, XCircle, Zap, Lock, Globe, 
    Users, Heart, Scale, Building2, Gavel,
    FileSearch, Database, Server, Smartphone,
    Fingerprint, Eye, Verified, ArrowRight
} from "lucide-react";
import DetailModal from "@/components/ui/DetailModal";

interface VerificationClientProps {
    t: any;
}

export default function VerificationClient({ t }: VerificationClientProps) {
    const [modalData, setModalData] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        details: string[];
        icon: React.ElementType;
    }>({
        isOpen: false,
        title: "",
        description: "",
        details: [],
        icon: Info
    });

    const openModal = (title: string, description: string, details: string[], icon: React.ElementType) => {
        setModalData({ isOpen: true, title, description, details, icon });
    };

    const closeModal = () => setModalData(prev => ({ ...prev, isOpen: false }));

    const FEATURE_CARDS = [
        { 
            title: t.step1_title || "1. Scan", 
            desc: t.step1_desc || "Authorized agents scan your unique QR code.", 
            icon: QrCode,
            longDesc: "Our QR codes are cryptographically signed and unique to each visa holder. When scanned, they don't just open a web link; they initiate a secure, handshaked request to our central verification engine.",
            details: [
                "Dynamic QR code generation",
                "Encrypted data transmission",
                "Instant officer recognition",
                "Tamper-proof physical stickers"
            ]
        },
        { 
            title: t.step2_title || "2. Verify", 
            desc: t.step2_desc || "System checks real-time visa status.", 
            icon: Info,
            longDesc: "The verification engine communicates directly with the PT Indonesian Visas database and periodically syncs with the Imigrasi (Immigration) portal to ensure stay permits are currently in force.",
            details: [
                "Real-time database Query",
                "Immigration portal cross-check",
                "Automatic expiry detection",
                "Multi-layer data integrity"
            ]
        },
        { 
            title: t.step3_title || "3. Confirm", 
            desc: t.step3_desc || "Authorities receive immediate approval.", 
            icon: ClipboardCheck,
            longDesc: "The final output is an easy-to-read, high-contrast dashboard displaying your personal data, visa details, and official sponsorship information, presented in a format designed for law enforcement.",
            details: [
                "Officer-ready display format",
                "Sponsor legal guarantee",
                "Emergency contact links",
                "Audit log recording"
            ]
        },
    ];

    const SAFETY_GUARDS = [
        {
            title: "Bank-Grade Encryption",
            desc: "All personal data is encrypted using AES-256 standards both at rest and in transit.",
            icon: Lock,
            longDesc: "We take your privacy seriously. Your sensitive documents, including passport copies and personal information, are protected by the same encryption standards used by global financial institutions.",
            details: [
                "AES-256 Encryption at rest",
                "TLS 1.3 for data in transit",
                "Regular security audits",
                "Isolated data storage"
            ]
        },
        {
            title: "Legal Accountability",
            desc: "Backed by PT Indonesian Visas Agency™ with full corporate responsibility.",
            icon: Scale,
            longDesc: "Unlike unofficial agents, we are a fully registered Indonesian company (PT). This means we have legal standing and accountability for your sponsorship, providing you with a rock-solid legal shield.",
            details: [
                "Official NIB Registration",
                "MOH Law & Human Rights Approval",
                "Corporate Guarantee Liability",
                "Bail and Legal Representation"
            ]
        },
        {
            title: "24/7 Global Safeguard",
            desc: "Active monitoring and human support available for verification queries.",
            icon: ShieldCheck,
            longDesc: "If an official has trouble scanning your code or questions your stay status, our 24/7 emergency team is just a tap away. We provide direct intervention with immigration officers if required.",
            details: [
                "24/7 Priority Support",
                "Direct Imigrasi Liaison",
                "Emergency Translation Support",
                "Lost Document Recovery Plan"
            ]
        }
    ];

    return (
        <>
            {/* How it Works Cards */}
            <div className="grid md:grid-cols-3 gap-6 pt-4">
                {FEATURE_CARDS.map((step, i) => (
                    <button 
                        key={i} 
                        onClick={() => openModal(step.title, step.longDesc, step.details, step.icon)}
                        className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] space-y-4 border border-slate-100 dark:border-white/5 group hover:border-primary/50 transition-all text-left hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                <step.icon size={20} />
                            </div>
                            <div className="text-[10px] font-black tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">MORE INFO</div>
                        </div>
                        <h3 className="text-xl font-black mode-aware-text tracking-tight uppercase italic">{step.title}</h3>
                        <p className="text-sm mode-aware-subtext font-bold leading-relaxed opacity-70">{step.desc}</p>
                    </button>
                ))}
            </div>

            <div className="h-px bg-slate-200 dark:bg-white/10 w-full my-20" />

            {/* Safety Guard Section */}
            <section className="space-y-12">
                <div className="space-y-4">
                    <span className="text-primary font-black tracking-[0.2em] text-xs uppercase italic">Protected Ecosystem</span>
                    <h2 className="text-4xl md:text-5xl font-black mode-aware-text tracking-tighter uppercase leading-none">Safety Guard of <br /> IndonesianVisas.com</h2>
                    <p className="text-lg mode-aware-subtext font-medium leading-relaxed max-w-2xl">
                        Our verification system is audited and hardened against fraud, providing a multi-layered shield for every traveler under our sponsorship.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {SAFETY_GUARDS.map((guard, i) => (
                        <div 
                            key={i} 
                            onClick={() => openModal(guard.title, guard.longDesc, guard.details, guard.icon)}
                            className="group cursor-pointer space-y-6"
                        >
                            <div className="w-16 h-16 rounded-[2rem] bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 group-hover:scale-110 group-hover:bg-primary dark:group-hover:bg-primary dark:group-hover:text-white transition-all shadow-xl">
                                <guard.icon size={28} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black mode-aware-text tracking-tight uppercase italic">{guard.title}</h4>
                                <p className="text-sm mode-aware-subtext font-bold leading-relaxed opacity-60 line-clamp-2">
                                    {guard.desc}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-primary tracking-widest group-hover:gap-4 transition-all">
                                EXPLORE SECURITY <ArrowRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-px bg-slate-200 dark:bg-white/10 w-full my-20" />

            {/* Advanced System Info */}
            <section className="space-y-12">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black mode-aware-text tracking-tight uppercase italic">Advanced System Integrity</h2>
                            <p className="mode-aware-subtext leading-relaxed font-medium">
                                The IndonesianVisas.com verification engine is built on modern microservices architecture, ensuring high availability and instant response times even in low-bandwidth areas of the archipelago.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { title: "Latency", value: "< 200ms", sub: "Global Response" },
                                { title: "Uptime", value: "99.99%", sub: "Service Reliability" },
                                { title: "Verified", value: "15k+", sub: "Travelers Protected" },
                                { title: "Audit", value: "Daily", sub: "System Integrity" }
                            ].map((stat, i) => (
                                <div key={i} className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 space-y-1">
                                    <div className="text-2xl font-black text-primary">{stat.value}</div>
                                    <div className="text-[10px] font-black mode-aware-subtext uppercase tracking-widest">{stat.title}</div>
                                    <div className="text-[9px] font-medium mode-aware-subtext opacity-50 uppercase">{stat.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-10 bg-slate-900 dark:bg-white/10 rounded-[3rem] text-white space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-125 transition-transform duration-500" />
                        
                        <div className="space-y-4 relative z-10">
                            <Zap className="text-primary mb-2" size={32} />
                            <h3 className="text-2xl font-black tracking-tight uppercase italic underline decoration-primary decoration-4 underline-offset-8">Authority Liaison</h3>
                            <p className="text-white/70 font-medium leading-relaxed">
                                Our system generates a **High-Priority Liaison Token** during authority scans. This token alerts our legal representatives in the region, putting them on standby should the officer require further verbal confirmation of your legal status.
                            </p>
                        </div>

                        <div className="pt-4 flex items-center gap-4 relative z-10">
                            <div className="flex -space-x-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-primary text-xs font-black">
                                        LV
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest">
                                Legal Team <br /> On Standby
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <DetailModal 
                isOpen={modalData.isOpen}
                onClose={closeModal}
                title={modalData.title}
                description={modalData.description}
                details={modalData.details}
                icon={modalData.icon}
            />
        </>
    );
}
