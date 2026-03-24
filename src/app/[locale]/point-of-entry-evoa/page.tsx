import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { Metadata } from 'next';
import { Navigation } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Point of Entry (e-VoA) | Indonesian Visas Agency",
        description: "Authorized Checkpoints (Airports, Seaports, and Cross-Border Posts) for entry using the electronic Visa on Arrival (e-VoA).",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/point-of-entry-evoa`,
        },
    };
}

export default async function PointOfEntryPage() {
    const airports = ["Juanda (East Java)", "Kualanamu (North Sumatra)", "Ngurah Rai (Bali)", "Sam Ratulangi (North Sulawesi)", "Soekarno-Hatta (Jakarta)", "Yogyakarta", "Zainuddin Abdul Madjid (NTB)"];
    
    const borders = ["Aruk (West Kalimantan)", "Entikong (West Kalimantan)", "Mota'ain (NTT)", "Motamasin (NTT)", "Skouw (Papua)", "Sota (Papua)", "Tunon Taka (North Kalimantan)", "Wini (NTT)"];

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-4">
                        <Navigation className="text-primary rotate-45" size={32} />
                        <h1 className="text-4xl md:text-6xl font-black mode-aware-text tracking-tighter">
                            Authorized Entry Checkpoints
                        </h1>
                    </div>
                    <p className="text-xl mode-aware-subtext mb-8">
                        Authorized ports for entering Indonesian Territory using an electronic Visa on Arrival (e-VoA).
                    </p>

                    <div className="space-y-12">
                        {/* 1. AIRPORTS */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black mode-aware-text text-primary">✈️ Airports (Bandar Udara)</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {airports.map((port, i) => (
                                    <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl">
                                        <div className="font-bold mode-aware-text">{port}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. SEAPORTS */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black mode-aware-text text-primary">🚢 Seaports (Pelabuhan Laut)</h2>
                            <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-3xl">
                                <p className="text-base mode-aware-subtext">
                                    Authorized standard entry ports for watercraft routes connecting directly with Singapore, Malaysia, or International Cruises. Includes over 40 listed ports such as:
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 text-sm mode-aware-text font-medium opacity-80">
                                    <div>• Lembar (NTB)</div>
                                    <div>• Batam Center (Riau)</div>
                                    <div>• Marina Ancol (JKT)</div>
                                    <div>• Nongsa Terminal</div>
                                    <div>• Lhokseumawe (Aceh)</div>
                                    <div>• and many more...</div>
                                </div>
                            </div>
                        </section>

                        {/* 3. CROSS BORDER */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black mode-aware-text text-primary">🚗 Cross-Border Posts (PLBN)</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {borders.map((port, i) => (
                                    <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl">
                                        <div className="font-bold mode-aware-text">{port}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
