import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { Metadata } from 'next';
import { ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Calling Visa Countries | Indonesian Visas Agency",
        description: "List of countries subject to the Indonesian Calling Visa policy requiring special clearance by the Directorate General of Immigration.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/calling-visa`,
        },
    };
}

export default async function CallingVisaPage() {
    const countries = [
        "Afghanistan", "Israel", "North Korea", "Liberia", "Nigeria", "Somalia", "Guinea", "Cameroon"
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-black mode-aware-text mb-4 tracking-tighter">
                        Calling Visa Protocols 2026-2027
                    </h1>
                    <p className="text-xl mode-aware-subtext mb-12">
                        Comprehensive guide for travelers from restricted nations requiring Inter-Agency Security Clearance.
                    </p>

                    <div className="space-y-12">
                        {/* 1. Policy Alert */}
                        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-8 rounded-2xl flex gap-6 items-start">
                            <ShieldAlert className="text-red-500 flex-shrink-0 mt-1" size={32} />
                            <div>
                                <h3 className="text-xl font-black text-red-900 dark:text-red-100 mb-2 uppercase">Critical Submission Policy</h3>
                                <p className="text-red-800 dark:text-red-200 leading-relaxed font-semibold mb-4">
                                    ⚠️ **STRICT NON-REFUNDABLE POLICY:** Calling Visa applications are strictly 100% non-refundable once processing begins. This is due to the significant operational costs of our team traveling back and forth to Jakarta for manual, offline submissions and conducting mandatory physical team interviews with your Indonesian sponsor.
                                </p>
                                <ul className="list-disc list-inside text-red-700 dark:text-red-300 space-y-2 text-sm font-medium">
                                    <li>Applications originate in Bali but require physical submission to Central Immigration.</li>
                                    <li>Final approval must be signed by 3 separate Head Offices in Jakarta.</li>
                                    <li>Processing time is significantly longer than standard 211A/C1 protocols.</li>
                                </ul>
                            </div>
                        </div>

                        {/* 2. Country List */}
                        <div>
                            <h2 className="text-2xl font-black mb-6 mode-aware-text uppercase tracking-widest">Restricted Country Matrix</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {countries.map((country, idx) => (
                                    <div key={idx} className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl shadow-sm flex items-center justify-between group">
                                        <span className="font-bold mode-aware-text">{country}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. The 4-Step Mandatory Procedure */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem]">
                                <h3 className="text-2xl font-black mb-6 mode-aware-text">Mandatory Procedures</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black flex-shrink-0">1</div>
                                        <p className="text-sm mode-aware-subtext"><strong>Physical Submission:</strong> Direct offline application at the Immigration Office with full physical dossiers.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black flex-shrink-0">2</div>
                                        <p className="text-sm mode-aware-subtext"><strong>Central Approval:</strong> Dossiers are submitted from Bali to Central Immigration, requiring approval from 3 Jakarta Head Offices.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black flex-shrink-0">3</div>
                                        <p className="text-sm mode-aware-subtext"><strong>Security Clearance:</strong> Inter-Agency screening is mandatory. Clearance costs are determined by Immigration on a case-by-case basis.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black flex-shrink-0">4</div>
                                        <p className="text-sm mode-aware-subtext"><strong>NDA & Deposit:</strong> Formal NDA with PT Indonesian Visas Agency and a 100% refundable security deposit (equivalent to a return ticket) are required.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
                                <h3 className="text-2xl font-black mb-6 text-primary">Required Dossier (C1/D1)</h3>
                                <ul className="space-y-4 text-sm font-bold mode-aware-text">
                                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Passport (Min. 6 Months Validity)</li>
                                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> High-Resolution Recent Photograph</li>
                                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Comprehensive CV / Resume</li>
                                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Detailed Travel Itinerary</li>
                                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> 3-Month Personal Bank Statements (Min. $2,000 USD)</li>
                                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Proof of Accommodation in Indonesia</li>
                                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Notarized Statement Letters & Agreements</li>
                                    <li className="text-xs opacity-60 mt-4 uppercase">* Special Categories (Highly Recommended): Work contracts outside Calling Visa country, Scholarship cards, or Company ownership documents from 3rd countries.</li>
                                </ul>
                            </div>
                        </div>

                        {/* 4. Financial Transparency */}
                        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <h3 className="text-3xl font-black mb-6 tracking-tighter">Cost & Approval Reality</h3>
                            <div className="grid md:grid-cols-2 gap-12 relative z-10">
                                <div>
                                    <p className="text-slate-400 mb-6 leading-relaxed">
                                        The base application fee is <strong>$500 USD (strictly non-refundable)</strong>. This fee covers our initial manual filing, verification procedures, and multiple offline representation visits. For Calling Countries, 
                                        the **Inter-Agency Security Clearance** is the primary hurdle. Official clearance fees range from **$5,000 to $10,000 USD** depending on nationality and profile depth.
                                    </p>
                                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                        <p className="text-xs uppercase font-black text-primary mb-1">Approval Probability</p>
                                        <p className="text-2xl font-black text-white italic">"Rigorous 50/50 Outcome"</p>
                                        <p className="text-[10px] opacity-60 mt-2">Security Clearance is a government mandate and non-negotiable for restricted nations.</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                        <span className="text-sm opacity-60">Base Visa Fee (Non-Refundable)</span>
                                        <span className="font-bold text-xl">$500</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                        <span className="text-sm opacity-60">Gov. Security Clearance</span>
                                        <span className="font-bold text-sm italic">$5,000 - $10,000</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                        <span className="text-sm opacity-60">Return Ticket Deposit</span>
                                        <span className="font-bold text-sm italic">100% Refundable</span>
                                    </div>
                                    <div className="text-[10px] opacity-40 italic mt-2">
                                       * Security deposit is equivalent to a full return flight cost, held by the sponsor agency.
                                    </div>
                                </div>
                            </div>

                            {/* CTAs Inside Card */}
                            <div className="mt-12 flex flex-col sm:flex-row gap-4 border-t border-white/10 pt-8 relative z-10">
                                <Link 
                                    href="/services/C1" 
                                    className="flex-1 bg-primary text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
                                >
                                    Apply for C1 Visa
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link 
                                    href="/services" 
                                    className="flex-1 bg-white/10 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
                                >
                                    Explore All Services
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
