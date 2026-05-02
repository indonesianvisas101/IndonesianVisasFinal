"use client";

import React from "react";
import { UserCheck, Zap, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import SectionWrapper from "@/components/layout/SectionWrapper";

const COUNTRY_DOMAINS = [
    "www.eurpeindonesiavisa.online",
    "www.americaindonesiavisa.online",
    "www.africaindonesiavisa.online",
    "www.australiaindonesiavisa.online",
    "www.rusiaindonesiavisa.online",
    "www.chinaindonesiavisa.online",
    "www.indiaindonesiavisa.online",
    "www.aussieindonesiavisa.online",
    "www.ukindonesiavisa.online",
    "www.usindonesiavisa.online",
    "www.franceindonesiavisa.online",
    "www.japanindonesiavisa.online",
    "www.southkoreaindonesiavisa.online"
];

const CITY_DOMAINS = [
    "www.balivisa.agency",
    "www.jakartavisas.agency",
    "www.lombokvisa.online",
    "www.manadovisa.online",
    "www.surabayavisa.online",
    "www.bandungvisa.online",
    "www.malangvisa.online",
    "www.makasarvisa.online",
    "www.padangvisa.online",
    "www.batamvisa.online",
    "www.jogjavisa.online",
    "www.kalimantanvisa.online",
    "www.malukuvisa.online",
    "www.acehvisa.online",
    "www.papuavisa.online",
    "www.sulawesivisa.online"
];

const AboutFullExpansion = ({ dict }: { dict?: any }) => {
    const t = dict?.about_page || {};

    return (
        <div className="space-y-24">
            {/* Mission Section */}
            <section className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 animate-fade-in-up">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black mode-aware-text leading-tight">
                            {t.mission_title || "Our Mission"}
                        </h2>
                        <p className="text-xl mode-aware-subtext leading-relaxed">
                            {t.mission_p1 || "To simplify Indonesian bureaucracy for the world. We believe that borders should not be barriers to opportunity or exploration."}
                        </p>
                        <p className="text-lg mode-aware-subtext leading-relaxed opacity-80">
                            {t.mission_p2 || "By combining legal expertise with modern technology, we deliver the fastest, most reliable visa services in the archipelago."}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
                            <UserCheck className="text-primary mb-3" size={32} />
                            <h4 className="font-bold mode-aware-text mb-2">Expert Counsel</h4>
                            <p className="text-sm mode-aware-subtext">Certified legal professionals for complex immigration cases.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
                            <Zap className="text-primary mb-3" size={32} />
                            <h4 className="font-bold mode-aware-text mb-2">Express Path</h4>
                            <p className="text-sm mode-aware-subtext">Direct connections to immigration hubs for faster turnaround.</p>
                        </div>
                    </div>
                </div>

                <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group">
                    <Image
                        src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2638&auto=format&fit=crop"
                        alt="Expert Visa Assistance in Indonesia"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                </div>
            </section>

            {/* Satellite Domains Section */}
            <SectionWrapper id="satellite-domains">
                <div className="max-w-4xl mx-auto text-center mb-14">
                    <h2 className="text-3xl font-bold mode-aware-text mb-4">
                        Global & Regional Access Points
                    </h2>
                    <p className="text-slate-700 dark:text-gray-500 text-base">
                        Our verified satellite domains provide region-specific information while routing
                        all applications through a single secure processing system.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                    {/* Country Domains */}
                    <div className="glass-card p-6 md:p-8 rounded-[2rem]">
                        <h3 className="text-xl font-semibold mode-aware-text mb-6 flex items-center gap-3">
                            <Globe className="w-5 h-5 text-primary dark:text-accent" />
                            Country-Based Services
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {COUNTRY_DOMAINS.map((domain) => (
                                <li key={domain}>
                                    <a
                                        href={`https://${domain}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-800 dark:text-gray-400 hover:text-primary dark:hover:text-accent text-sm font-semibold transition-colors break-all"
                                    >
                                        {domain.replace(/^www\./, "")}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* City Domains */}
                    <div className="glass-card p-6 md:p-8 rounded-[2rem]">
                        <h3 className="text-xl font-semibold mode-aware-text mb-6 flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-primary dark:text-accent" />
                            Indonesia City-Based Services
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {CITY_DOMAINS.map((domain) => (
                                <li key={domain}>
                                    <a
                                        href={`https://${domain}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-800 dark:text-gray-400 hover:text-primary dark:hover:text-accent text-sm font-semibold transition-colors break-all"
                                    >
                                        {domain.replace(/^www\./, "")}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
};

export default AboutFullExpansion;
