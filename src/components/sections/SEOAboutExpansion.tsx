"use client";

import React, { useState } from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Button,
    useTheme,
    useMediaQuery
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from '@mui/icons-material/Language';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Network, Server, Globe, MapPin } from 'lucide-react';

const COUNTRY_DOMAINS = [
    "www.europeindonesiavisa.online",
    "www.americaindonesiavisa.online",
    "www.africaindonesiavisa.online",
    "www.australiaindonesiavisa.online",
    "www.rusiaindonesiavisa.online",
    "www.chinaindonesiavisa.online",
    "www.indiaindonesiavisa.online",
    "www.aussieindonesiavisa.online",
    "www.ukindonesiavisa.online",
    "www.usindonesiavisa.online",
    "www.uaeindonesiavisas.agency",
    "www.franceindonesiavisa.online",
    "www.japanindonesiavisa.online",
    "www.southkoreaindonesiavisa.online"
];

const CITY_DOMAINS = [
    "www.balivisa.agency",
    "www.jakartavisa.agency",
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

const SEOAboutExpansion = ({ dict }: { dict?: any }) => {
    const t = dict?.seo_about || {};
    const [openCountry, setOpenCountry] = useState(false);
    const [openCity, setOpenCity] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const DomainList = ({ domains, isCity = false }: { domains: string[], isCity?: boolean }) => (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {domains.map((domain) => (
                <li key={domain}>
                    <a
                        href={`https://${domain}`}
                        className={`hover:underline text-sm font-bold transition-colors break-all flex items-center gap-2 text-gray-400 ${isCity
                            ? "hover:text-amber-600 dark:hover:text-yellow-400"
                            : "hover:text-primary dark:hover:text-purple-300"
                            }`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${isCity ? "bg-yellow-500" : "bg-primary"
                            }`}></span>
                        {domain.replace(/^www\./, '')}
                    </a >
                </li >
            ))}
        </ul >
    );

    return (
        <SectionWrapper id="about-agency-expansion" className="py-12">
            <div className="max-w-7xl mx-auto px-4">

                {/* 1. Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-500 mb-4">
                        {t.title || "Indonesian Visas Agency"}
                    </h2>
                    <p className="text-lg text-slate-700 dark:text-gray-500 max-w-3xl mx-auto font-medium">
                        {t.description || "Operating a unified national service ecosystem to facilitate compliant and efficient immigration processing."}
                    </p>
                </div>

                {/* 2. Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Card 1: Ecosystem Info */}
                    <div className="glass-card p-6 md:p-8 rounded-2xl">
                        <div className="mb-4 inline-flex p-3 rounded-full bg-primary/10 text-primary">
                            <Network size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-gray-500 mb-4">
                            {t.ecosystem_title || "Indonesian Visas Service Ecosystem"}
                        </h3>
                        <p className="text-slate-700 dark:text-gray-500 mb-4 leading-relaxed font-medium">
                            {t.ecosystem_desc1 || "IndonesianVisas.com is the central authority website, operated by Indonesian Visas Agency. We provide a centralized platform for visa facilitation across the entire archipelago."}
                        </p>
                        <p className="text-slate-700 dark:text-gray-500 leading-relaxed font-medium">
                            {t.ecosystem_desc2 || "Our services are supported by an active network of satellite domains—both country-specific and city-based—to ensure localized access and efficiently managed immigration channels."}
                        </p>
                    </div>

                    {/* Card 2: Brand Structure */}
                    <div className="glass-card p-6 md:p-8 rounded-2xl">
                        <div className="mb-4 inline-flex p-3 rounded-full bg-primary/10 text-primary">
                            <Server size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-gray-500 mb-6">
                            {t.structure_title || "Service Formation Structure"}
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-100/80 dark:bg-zinc-700/10 border border-gray-200 dark:border-zinc-400 rounded-xl">
                                <span className="font-bold text-slate-900 dark:text-gray-500 block text-lg mb-1">indonesianvisas.com</span>
                                <span className="text-sm text-slate-700 dark:text-gray-500 font-medium">{t.platform_central || "Central Authority Platform • Global Information"}</span>
                            </div>
                            <div className="p-4 bg-gray-100/80 dark:bg-zinc-700/10 border border-gray-200 dark:border-zinc-400 rounded-xl">
                                <span className="font-bold text-slate-900 dark:text-gray-500 block text-lg mb-1">balivisas.agency</span>
                                <span className="text-sm text-slate-700 dark:text-gray-500 font-medium">{t.platform_bali || "Bali Region Focus • Tourist & Business Services"}</span>
                            </div>
                            <div className="p-4 bg-gray-100/80 dark:bg-zinc-700/10 border border-gray-200 dark:border-zinc-400 rounded-xl">
                                <span className="font-bold text-slate-900 dark:text-gray-500 block text-lg mb-1">jakartavisa.agency</span>
                                <span className="text-sm text-slate-700 dark:text-gray-500 font-medium">{t.platform_jakarta || "Jakarta Region Focus • Corporate & Investor Services"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Country Domains POPUP TRIGGER */}
                    <div
                        className="glass-card p-6 md:p-8 rounded-2xl cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                        onClick={() => setOpenCountry(true)}
                    >
                        <div className="flex items-center mb-4">
                            {/* Primary Brand Color Gradient Icon Background */}
                            <div className="p-3 rounded-full mr-4 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: '#4B0082' }}>
                                <Globe className="text-white w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                                {t.country_services_title || "Country-Based Services"}
                            </h3>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-gray-500 mb-6 font-medium">
                            {t.country_services_desc || "Dedicated channels for specific international markets. Click to view all 13 verified country domains."}
                        </p>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={(e) => { e.stopPropagation(); setOpenCountry(true); }}
                            sx={{
                                background: 'linear-gradient(135deg, #4B0082 0%, #1E005A 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '9999px', // ml-auto rounded-full
                                textTransform: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #3a006b 0%, #150042 100%)',
                                }
                            }}
                        >
                            {t.view_countries || "View Country Domains"}
                        </Button>
                    </div>

                    {/* Card 4: City Domains POPUP TRIGGER */}
                    <div
                        className="glass-card p-6 md:p-8 rounded-2xl cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                        onClick={() => setOpenCity(true)}
                    >
                        <div className="flex items-center mb-4">
                            {/* Secondary Brand Color (Yellow/Gold) Icon Background */}
                            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform shadow-lg">
                                <MapPin className="text-primary-dark w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                                {t.city_services_title || "City-Based Services"}
                            </h3>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-gray-500 mb-6 font-medium">
                            {t.city_services_desc || "Localized access points for major Indonesian destinations. Click to view all 16 verified city domains."}
                        </p>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={(e) => { e.stopPropagation(); setOpenCity(true); }}
                            sx={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
                                color: '#4B0082', // Primary dark text
                                fontWeight: 'bold',
                                borderRadius: '9999px',
                                textTransform: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e6c200 0%, #e0a52b 100%)',
                                }
                            }}
                        >
                            {t.view_cities || "View City Domains"}
                        </Button>
                    </div>

                </div>
            </div>

            {/* Dialogs */}
            <Dialog
                open={openCountry}
                onClose={() => setOpenCountry(false)}
                fullWidth
                maxWidth="md"
                fullScreen={fullScreen}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-dark text-black rounded-full">
                            <Globe className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl text-slate-900">{t.dialog_countries_title || "Country-Based Visa Services"}</span>
                    </div>
                    <IconButton onClick={() => setOpenCountry(false)} aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <p className="mb-4 text-slate-700 font-medium">
                        {t.dialog_countries_desc || "Official satellite domains for specific international regions:"}
                    </p>
                    <DomainList domains={COUNTRY_DOMAINS} />
                </DialogContent>
            </Dialog>

            <Dialog
                open={openCity}
                onClose={() => setOpenCity(false)}
                fullWidth
                maxWidth="md"
                fullScreen={fullScreen}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-400 text-primary-dark rounded-full">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl text-slate-900">{t.dialog_cities_title || "Indonesia City-Based Services"}</span>
                    </div>
                    <IconButton onClick={() => setOpenCity(false)} aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <p className="mb-4 text-slate-700 font-medium">
                        {t.dialog_cities_desc || "Official localized access points for regions across Indonesia:"}
                    </p>
                    <DomainList domains={CITY_DOMAINS} isCity={true} />
                </DialogContent>
            </Dialog>

        </SectionWrapper>
    );
};

export default SEOAboutExpansion;
