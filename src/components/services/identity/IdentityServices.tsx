"use client";

import React from "react";
import Link from "next/link";
import { 
    Zap, 
    ArrowRight, 
    ShieldCheck, 
    CreditCard, 
    UserCheck, 
    Building2, 
    FileText, 
    Briefcase,
    Globe,
    Map
} from "lucide-react";
import ThreeDCardVisual from "./ThreeDCardVisual";
import BaliServiceCard from "./BaliServiceCard";
import IDivCardModern from "@/components/idiv/IDivCardModern";
import { formatNavLink } from "@/utils/seo";
import { useParams } from "next/navigation";

const IdentityServices: React.FC = () => {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';

    return (
        <div className="space-y-32 py-20">
            
            {/* SECTION A: PREMIUM IDENTITY HUB */}
            <section className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em]">
                        Future of Residency
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mode-aware-text tracking-tighter">Global Identity Hub</h2>
                    <p className="text-xl mode-aware-subtext font-medium">Digital-first residency and legal identification for the modern traveler in Indonesia.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    
                    {/* SMART ID */}
                    <Link href={formatNavLink(locale, "/smart-id")} className="group">
                        <div className="glass-card p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all duration-500 flex flex-col items-center gap-10">
                            <div className="w-full max-w-[400px] flex-shrink-0 origin-center scale-90 md:scale-100">
                                <IDivCardModern mode="SMART" showActions={false} />
                            </div>
                            <div className="space-y-4 text-center">
                                <h3 className="text-3xl font-black mode-aware-text">Smart ID</h3>
                                <p className="mode-aware-subtext text-sm leading-relaxed">Integrated KTP-style biometric identity for permanent and long-term residents in Indonesia.</p>
                                <div className="text-primary font-black text-sm uppercase tracking-widest flex items-center gap-2 justify-center">
                                    Learn More <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* IDIV CARD */}
                    <Link href={formatNavLink(locale, "/id-indonesian-visas")} className="group">
                        <div className="glass-card p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all duration-500 flex flex-col items-center gap-10">
                            <div className="w-full max-w-[400px] flex-shrink-0 origin-center scale-90 md:scale-100">
                                <IDivCardModern mode="IDIV" showActions={false} />
                            </div>
                            <div className="space-y-4 text-center">
                                <h3 className="text-3xl font-black mode-aware-text">IDiv Card</h3>
                                <p className="mode-aware-subtext text-sm leading-relaxed">The physical manifestation of your verified residency status. Accepted island-wide in Bali.</p>
                                <div className="text-primary font-black text-sm uppercase tracking-widest flex items-center gap-2 justify-center">
                                    Check Details <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* GUIDE ID & ID CARD FOR FOREIGNER */}
                    <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                        <Link href={formatNavLink(locale, "/id-guide")} className="group bg-purple-50/50 dark:bg-purple-900/10 rounded-[3rem] p-10 mode-aware-text overflow-hidden relative border border-purple-100 dark:border-purple-800/30 shadow-2xl hover:scale-[1.02] hover:border-purple-300 dark:hover:border-purple-500/50 transition-all">
                            <div className="flex flex-col xl:flex-row items-center gap-10 relative z-10">
                                <div className="w-full max-w-[340px] flex-shrink-0 scale-75 md:scale-90 origin-center">
                                    <IDivCardModern mode="IDG" variant="purple" showActions={false} />
                                </div>
                                <div className="space-y-4 text-center xl:text-left">
                                    <div className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-700">
                                        24/7 COMPANION
                                    </div>
                                    <h3 className="text-3xl font-black text-purple-900 dark:text-purple-100">Indonesian ID Guide (IDg)</h3>
                                    <p className="text-purple-800/70 dark:text-purple-200/70 text-sm leading-relaxed font-medium">Your Digital Support Hub for 24/7 assistance with local rules, disputes, and emergency guidance without requiring a visa sponsor.</p>
                                    <div className="text-purple-600 dark:text-purple-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 justify-center xl:justify-start">
                                        Open Guide <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href={formatNavLink(locale, "/id-card-for-foreigner-in-indonesia")} className="group glass-card p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all duration-500 flex flex-col justify-center gap-6">
                            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                                <UserCheck size={28} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black mode-aware-text">Foreigner ID Card</h3>
                                <p className="mode-aware-subtext text-sm leading-relaxed">The essential national identification for foreigners residing in Indonesia. Full administrative support.</p>
                                <div className="text-primary font-black text-sm uppercase tracking-widest pt-4 flex items-center gap-2">
                                    Full Info <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION B: SPECIAL BALI SERVICES */}
            <section className="container mx-auto px-4 bg-slate-50 dark:bg-zinc-900/40 py-32 rounded-[4rem] border border-slate-200 dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 blur-[100px] rounded-full" />
                </div>

                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-black uppercase tracking-[0.2em]">
                        Bali Regional Specialty
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mode-aware-text tracking-tighter">Special Bali Services</h2>
                    <p className="text-xl mode-aware-subtext font-medium">Localized legal documents for Expats in Bali. Fast, efficient, and legally guaranteed.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
                    <BaliServiceCard 
                        title="ID Card (KTP)" 
                        description="National identity card for permanent residents. Full processing at local registry."
                        icon={CreditCard}
                    />
                    <BaliServiceCard 
                        title="Family Card (KK)" 
                        description="Official documentation for households. Essential for marriage and schools."
                        icon={Building2}
                    />
                    <BaliServiceCard 
                        title="Driver Licence (SIM)" 
                        description="Complete Indonesian license for car and motorbike. Accepted in ASEAN."
                        icon={Map}
                    />
                    <BaliServiceCard 
                        title="SKCK Clearance" 
                        description="Police Record Certificate. Mandatory for various job and legal permits."
                        icon={Briefcase}
                    />
                </div>

                <div className="mt-20 text-center">
                    <p className="mode-aware-subtext text-sm font-bold mb-6 italic opacity-70 flex items-center justify-center gap-2">
                        <ShieldCheck size={16} /> All services are processed at official government offices (Disdukcapil/Polda).
                    </p>
                </div>
            </section>
        </div>
    );
};

export default IdentityServices;
