import React from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { Metadata } from 'next';
import { Globe2 } from "lucide-react";
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Registered Countries | Indonesian Visas Agency",
        description: "A-Z List of countries registered within the Indonesian Immigration Database for Visa Applications.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/list-country`,
        },
    };
}

export default async function ListCountryPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const countries = [
        "South Africa", "Albania", "United States", "Andorra", "Saudi Arabia", "Argentina", "Armenia", "Australia", 
        "Austria", "Azerbaijan", "Bahrain", "Netherlands", "Belarus", "Belgium", "Brazil", "Brunei Darussalam", 
        "Bosnia and Herzegovina", "Bulgaria", "Czech Republic", "Chile", "Denmark", "Ecuador", "Estonia", 
        "Philippines", "Finland", "Guatemala", "Hong Kong", "Hungary", "India", "United Kingdom", "Ireland", 
        "Italy", "Iceland", "Japan", "Germany", "Cambodia", "Canada", "Kazakhstan", "Kenya", "Colombia", 
        "South Korea", "Croatia", "Kuwait", "Laos", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", 
        "Maldives", "Malaysia", "Malta", "Morocco", "Mauritius", "Mexico", "Egypt", "Monaco", "Mongolia", 
        "Mozambique", "Myanmar", "Norway", "Oman", "Palestine", "Papua New Guinea", "France", "Peru", "Poland", 
        "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "New Zealand", "Serbia", "Seychelles", "Singapore", 
        "Cyprus", "Slovakia", "Slovenia", "Spain", "Suriname", "Sweden", "Switzerland", "Taiwan", "Tanzania", 
        "Thailand", "Timor-Leste", "China", "Tunisia", "Turkey", "United Arab Emirates", "Uzbekistan", "Ukraine", 
        "Vatican", "Venezuela", "Vietnam", "Jordan", "Greece"
    ];

    // Alphabetical sort just in case
    const sortedCountries = [...countries].sort();

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 pt-32 pb-20">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe2 className="text-primary" size={32} />
                        <h1 className="text-4xl md:text-6xl font-black mode-aware-text tracking-tighter">
                            Registered Countries
                        </h1>
                    </div>
                    <p className="text-xl mode-aware-subtext mb-8">
                        List of countries recognized and indexed on the Indonesian Immigration Database dashboard.
                    </p>

                    <div className="bg-white dark:bg-white/3 border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {sortedCountries.map((country, idx) => {
                                const hardenedHubs = [
                                    "United States", "France", "China", "Mexico", "Netherlands", 
                                    "Canada", "Poland", "Brazil", "Singapore", "Sweden", "Australia"
                                ];
                                const isHardened = hardenedHubs.includes(country);
                                const hubPath = country.replace(/\s+/g, '-');

                                return (
                                    <div key={idx} className="group">
                                        {isHardened ? (
                                            <Link 
                                                href={`/${locale}/services/${hubPath}`}
                                                className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 hover:border-primary transition-all duration-300"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 animate-pulse" />
                                                <span className="text-sm font-black text-primary italic uppercase tracking-tighter">{country}</span>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors opacity-60">
                                                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 flex-shrink-0" />
                                                <span className="text-sm font-semibold mode-aware-text">{country}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
}
