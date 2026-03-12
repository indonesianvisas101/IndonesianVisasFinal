"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
    Palmtree, 
    MapPin, 
    Compass, 
    TrendingUp, 
    Globe, 
    Plane, 
    Sunset, 
    Camera, 
    Users, 
    Heart, 
    ShoppingBag, 
    Utensils, 
    ShieldCheck, 
    Smartphone, 
    Clock, 
    Waves, 
    Mountain, 
    Wind,
    ArrowRight,
    Building2
} from "lucide-react";
import VisaCatalog from "@/components/visa/VisaCatalog";

const TRAVELER_RANKING = [
    { country: "Australia", growth: "+12%", icon: "🇦🇺" },
    { country: "China", growth: "+45%", icon: "🇨🇳" },
    { country: "India", growth: "+38%", icon: "🇮🇳" },
    { country: "United Kingdom", growth: "+15%", icon: "🇬🇧" },
    { country: "United States", growth: "+22%", icon: "🇺🇸" },
    { country: "France", growth: "+18%", icon: "🇫🇷" },
    { country: "Germany", growth: "+14%", icon: "🇩🇪" },
    { country: "Russia", growth: "+28%", icon: "🇷🇺" },
    { country: "Japan", growth: "+10%", icon: "🇯🇵" },
    { country: "Netherlands", growth: "+12%", icon: "🇳🇱" },
    { country: "Malaysia", growth: "+5%", icon: "🇲🇾" },
    { country: "Singapore", growth: "+7%", icon: "🇸🇬" },
    { country: "South Korea", growth: "+30%", icon: "🇰🇷" },
    { country: "Brazil", growth: "+25%", icon: "🇧🇷" },
    { country: "Canada", growth: "+16%", icon: "🇨🇦" },
    { country: "Spain", growth: "+19%", icon: "🇪🇸" },
    { country: "Italy", growth: "+21%", icon: "🇮🇹" },
    { country: "New Zealand", growth: "+13%", icon: "🇳🇿" },
    { country: "Switzerland", growth: "+9%", icon: "🇨🇭" },
    { country: "Global Visitors", growth: "+25%", icon: "🌍" },
];

export default function TravelPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = React.use(params);

    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300">
            {/* 1. HERO - MASSIVE 16K IMAGE */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <Image
                    src="/images/16K.webp"
                    alt="Wonderful Indonesia - 16K Experience"
                    fill
                    className="object-cover"
                    priority
                    unoptimized={true}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white mb-8">
                        <Palmtree className="text-white animate-bounce" size={20} />
                        <span className="text-sm font-bold tracking-widest uppercase">Explore the Archipelago</span>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none uppercase">
                        Wonderful <br /> Indonesia
                    </h1>
                    <p className="text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
                        Discover 17,000 islands of magic. From the emerald peaks of Bali to the dragon-guarded shores of Komodo.
                    </p>
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
                        <div className="w-1 h-3 bg-white rounded-full" />
                    </div>
                </div>
            </section>

            {/* 2-4. TRAVEL INFORMATION SECTIONS */}
            <section className="py-32 bg-slate-50 dark:bg-slate-900/40">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
                        <div className="space-y-8">
                            <span className="text-primary font-black uppercase tracking-[0.3em] text-sm italic">Travel Guide 2026</span>
                            <h2 className="text-5xl font-black mode-aware-text leading-tight uppercase">Beyond the <br /> Horizon.</h2>
                            <p className="text-xl mode-aware-subtext leading-relaxed">
                                Indonesia is a vast tapestry of cultures, languages, and landscapes. Whether you are seeking spiritual growth, business expansion, or pure relaxation, the archipelago offers infinite possibilities.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <MapPin size={24} />
                                    </div>
                                    <h4 className="font-bold mode-aware-text text-lg">Top Destinations</h4>
                                    <p className="mode-aware-subtext text-sm">Bali, Jakarta, Raja Ampat, Borobudur, and Komodo.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <Compass size={24} />
                                    </div>
                                    <h4 className="font-bold mode-aware-text text-lg">Culture & Traditions</h4>
                                    <p className="mode-aware-subtext text-sm">Thousands of years of heritage across hundreds of ethnicities.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
                            <Image
                                src="/images/IndonesianVisas/indonesia.webp"
                                alt="Wonderful Indonesia Landscape"
                                fill
                                className="object-cover"
                                unoptimized={true}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 5-7. TOP COUNTRIES STRATEGIC LIST SECTION */}
            <section className="py-32 relative overflow-hidden bg-white dark:bg-[#030712]">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-24 space-y-4">
                        <h2 className="text-5xl md:text-7xl font-black mode-aware-text tracking-tighter uppercase">Top 20 Global Explorers</h2>
                        <p className="text-xl mode-aware-subtext">The most frequent travelers visiting Indonesia this year.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {TRAVELER_RANKING.map((item, i) => (
                            <div key={i} className="glass-card p-6 rounded-[2rem] flex items-center justify-between group hover:border-primary/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                        <h4 className="font-bold mode-aware-text">{item.country}</h4>
                                        <span className="text-xs font-black text-emerald-500">{item.growth} Growth</span>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-primary/30 group-hover:text-primary transition-colors italic">#{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8-15. TRAVEL DEPTH SECTIONS (Destinations / Tips / Facts) */}
            <section className="py-32 bg-slate-50 dark:bg-slate-900/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[
                                { title: "Spiritual Bali", icon: Heart, desc: "The Island of Gods offers unmatched spiritual and wellness experiences." },
                                { title: "Business Jakarta", icon: Building2, desc: "The heart of Southeast Asia's economy and business growth." },
                                { title: "Wild Komodo", icon: Wind, desc: "A prehistoric adventure in the heart of the Flores archipelago." },
                                { title: "Raja Ampat", icon: Waves, desc: "The world's richest marine biodiversity and diving paradise." },
                                { title: "Mt. Bromo", icon: Mountain, desc: "Witness the most breathtaking sunrise in the volcanic highlands." },
                                { title: "Ancient Java", icon: Smartphone, desc: "Connected history meet modern-day digital nomadic lifestyle." }
                            ].map((item, i) => (
                                <div key={i} className="space-y-6 p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <item.icon size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mode-aware-text uppercase tracking-tight">{item.title}</h3>
                                    <p className="mode-aware-subtext leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 16-17. INTEGRATED VISA CATALOG - POPULAR PRODUCTS */}
            <section className="py-40 bg-white dark:bg-[#030712] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-900/20" />
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-24 space-y-8">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase font-black text-sm tracking-widest italic">
                            Streamlined Entry
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black mode-aware-text tracking-tighter leading-none uppercase">Ready Your <br /> Documents</h2>
                        <p className="text-xl md:text-2xl mode-aware-subtext max-w-2xl mx-auto font-medium">
                            Don't let bureaucracy slow you down. Select your country and get your Indonesian Visa in record time.
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <VisaCatalog locale={locale} />
                    </div>
                </div>
            </section>

            {/* 18. FINAL TRAVEL CTA SECTION */}
            <section className="py-40 relative">
                 <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 className="text-5xl md:text-7xl font-black mode-aware-text tracking-tighter italic uppercase">The Islands <br /> Are Calling.</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
                            <Link 
                                href="/en/apply" 
                                className="w-full sm:w-auto px-16 py-6 text-white text-2xl font-black rounded-3xl shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
                                style={{ backgroundColor: '#9155FD' }}
                            >
                                Start Application
                            </Link>
                            <Link 
                                href="/en/contact" 
                                className="w-full sm:w-auto px-16 py-6 bg-slate-100 dark:bg-white/5 mode-aware-text text-2xl font-black rounded-3xl border border-slate-200 dark:border-white/10 hover:bg-slate-200 transition-all"
                            >
                                Talk to Agent
                            </Link>
                        </div>
                   </div>
                 </div>
            </section>
        </div>
    );
}
