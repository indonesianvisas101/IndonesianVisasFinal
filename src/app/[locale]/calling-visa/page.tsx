import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { Metadata } from 'next';
import { ShieldAlert } from "lucide-react";

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
        "Afghanistan",
        "Israel",
        "North Korea",
        "Liberia",
        "Nigeria",
        "Somalia"
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-black mode-aware-text mb-4 tracking-tighter">
                        Calling Visa Countries
                    </h1>
                    <p className="text-xl mode-aware-subtext mb-8">
                        Governments or Special Administrative Regions subject to mandatory clearance restrictions.
                    </p>

                    <div className="space-y-8">
                        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-8 rounded-2xl flex gap-4 items-start">
                            <ShieldAlert className="text-red-500 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="text-lg font-black text-red-900 dark:text-red-100 mb-2 uppercase">Important Policy NOTICE</h3>
                                <p className="text-red-800 dark:text-red-200 leading-relaxed font-medium">
                                    Citizens of the countries listed below require a **Calling Visa approval** through a special committee consisting of various ministries. Processing times are longer and sponsorship obligations are strictly scrutinized.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {countries.map((country, idx) => (
                                <div key={idx} className="p-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm hover:border-primary/40 transition-all flex items-center justify-between group">
                                    <span className="font-bold mode-aware-text text-lg">{country}</span>
                                    <div className="w-2 h-2 rounded-full bg-red-500 group-hover:animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
