"use client";

import React from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionWrapper from "@/components/layout/SectionWrapper";
import VisaCatalog from "@/components/visa/VisaCatalog";
import Image from "next/image";
import Link from "next/link";
import { 
    Truck, 
    MapPin, 
    CheckCircle, 
    Clock, 
    Calendar, 
    Users, 
    ShieldCheck, 
    Headphones, 
    ArrowRight,
    ShieldAlert,
    Phone
} from "lucide-react";

export default function ExtendPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = React.use(params);
    return (
        <PageWrapper className="transition-colors">
            {/* Hero */}
            <SectionWrapper id="extend-intro">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-600 mb-4">
                        Extend Your Visa
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Don't let your adventure end. Easy, secure, and fast visa extension services for all visa types.
                    </p>
                </div>

                {/* Unified Filter and Catalog */}
                <VisaCatalog />
            </SectionWrapper>

            {/* NEW SECTIONS FOR EXPANSION */}

            {/* 1. Pickup Service Visualization */}
            <SectionWrapper id="pickup-service" className="py-20 bg-slate-50 dark:bg-white/5 shadow-inner">
                <div className="grid md:grid-cols-2 gap-16 items-center container mx-auto px-4">
                    <div className="space-y-8">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                            <Truck size={32} />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mode-aware-text">Visa Pickup & Delivery</h2>
                        <p className="text-xl mode-aware-subtext leading-relaxed">
                            Stay at home or in your hotel. Our professional couriers will safely pick up your passport and deliver it back to you once the extension is finalized. 
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: "Free Pickup", icon: MapPin },
                                { label: "Secure Transport", icon: CheckCircle },
                                { label: "Real-time Tracking", icon: Clock },
                                { label: "Island-wide Coverage", icon: Calendar },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 font-bold mode-aware-text text-sm">
                                    <item.icon size={18} className="text-accent" /> {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl border-8 border-white dark:border-white/10">
                        <Image 
                            src="/images/pages/indonesian-global-logistics.webp" 
                            alt="Passport Logistics" 
                            fill 
                            className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    </div>
                </div>
            </SectionWrapper>

            {/* 2. Biometric Hub */}
            <SectionWrapper id="biometrics" className="py-24">
                <div className="text-center max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                        <Users size={16} /> Fast-Track Processing
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mode-aware-text">VIP Biometric Scheduling</h2>
                    <p className="text-xl mode-aware-subtext">
                        Some extensions require a visit to immigration for photos and fingerprints. We schedule VIP slots to ensure you spend less than 15 minutes at the office.
                    </p>
                </div>
            </SectionWrapper>

            {/* 3. Extension Timeline Visualizer */}
            <SectionWrapper id="timeline" className="py-20">
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                    <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black leading-tight">Zero-Stress Extension Timeline</h2>
                            <p className="text-xl text-white/70">
                                Avoid overstay fines and blacklisting. We manage your extension calendar and notify you 14 days before your current visa expires.
                            </p>
                            <div className="flex flex-col gap-4">
                                {[
                                    { day: "Day 01", label: "Document Collection", icon: Calendar },
                                    { day: "Day 03", label: "Immigration Submission", icon: Clock },
                                    { day: "Day 07", label: "Biometric Appointment", icon: Users },
                                    { day: "Day 10", label: "Visa Approval & Return", icon: CheckCircle },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all">
                                        <div className="text-primary font-black text-lg w-16">{item.day}</div>
                                        <div className="flex-1 font-bold">{item.label}</div>
                                        <item.icon size={20} className="text-accent" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative h-full min-h-[400px]">
                             <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
                             <div className="relative z-10 p-12 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xl font-bold">Extension Tracker</h4>
                                    <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-bold uppercase tracking-widest">In Progress</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-accent w-[75%] animate-pulse" />
                                    </div>
                                    <div className="flex justify-between text-xs opacity-60 font-mono">
                                        <span>SUBMITTED</span>
                                        <span>75% COMPLETE</span>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                        <ShieldAlert className="text-accent" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-bold">Next Milestone</div>
                                        <div className="opacity-60 text-xs">Biometrics Appointment: tomorrow at 10:00 AM</div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            {/* 4. Coverage Locations */}
            <SectionWrapper id="locations" className="py-24 text-center">
                <div className="space-y-12">
                   <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black mode-aware-text tracking-tight">Across the Archipelago</h2>
                        <p className="text-xl mode-aware-subtext max-w-2xl mx-auto">Wherever you choose to stay, Indonesian Visas Agency is there to facilitate your extension.</p>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
                        {["Bali (HQ)", "Jakarta", "Lombok", "Surabaya", "Batam"].map((city, i) => (
                            <div key={i} className="py-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm font-bold mode-aware-text flex items-center justify-center gap-2 group hover:bg-primary/5 transition-all">
                                <MapPin size={18} className="text-primary group-hover:scale-125 transition-transform" /> {city}
                            </div>
                        ))}
                   </div>
                </div>
            </SectionWrapper>

            {/* 5. Support Section */}
            <SectionWrapper id="support" className="py-20">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
                   <div className="p-12 rounded-[3rem] bg-slate-900 text-white space-y-6">
                        <h3 className="text-3xl font-black">Need Direct Help?</h3>
                        <p className="text-lg opacity-70">Our immigration officers are available on WhatsApp for instant consultations regarding complex cases.</p>
                        <a href="https://wa.me/6285727041992" target="_blank" className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] rounded-2xl font-bold hover:scale-105 transition-all">
                            <Phone size={20} /> Chat on WhatsApp
                        </a>
                   </div>
                   <div className="p-12 rounded-[3rem] border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md space-y-6">
                        <h3 className="text-3xl font-black mode-aware-text">Browse Resources</h3>
                        <p className="text-lg mode-aware-subtext">Check our comprehensive guides for specific visa extension rules and required documents.</p>
                        <Link href={`/${locale}/faq`} className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-black rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20">
                            Knowledge Center <ArrowRight size={20} />
                        </Link>
                   </div>
                </div>
            </SectionWrapper>
        </PageWrapper>
    );
}
