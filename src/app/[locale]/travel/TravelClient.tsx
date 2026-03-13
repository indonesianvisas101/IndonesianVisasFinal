"use client";

import React, { useState } from "react";
import { 
    Palmtree, MapPin, Compass, Globe, Plane, 
    Sunset, Camera, Users, Heart, ShoppingBag, 
    Utensils, ShieldCheck, Smartphone, Clock, 
    Waves, Mountain, Wind, ArrowRight, Building2,
    Briefcase, Landmark, School, History,
    Navigation, Languages, Wallet, Info, Zap, Scale
} from "lucide-react";
import Image from "next/image";
import DetailModal from "@/components/ui/DetailModal";

export default function TravelClient() {
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

    const DESTINATIONS = [
        { 
            title: "Spiritual Bali", 
            icon: Heart, 
            desc: "The Island of Gods offers unmatched spiritual and wellness experiences.",
            longDesc: "Bali remains the world's premier destination for spiritual growth and holistic wellness. Beyond the beaches, the heart of Bali beats in its temples, sacred water springs, and the deeply rooted Hindu-Dharma traditions that color every sunrise and sunset.",
            details: [
                "Ubud Cultural Heartland",
                "Uluwatu Cliffside Temples",
                "Sacred Monkey Forest Sanctuary",
                "World-class Wellness Retreats"
            ]
        },
        { 
            title: "Business Jakarta", 
            icon: Building2, 
            desc: "The heart of Southeast Asia's economy and business growth.",
            longDesc: "Jakarta is a sprawling metropolis of 30 million people, representing the economic engine of Indonesia. For investors and entrepreneurs, the SCBD (Sudirman Central Business District) offers a high-octane environment for networking and expansion.",
            details: [
                "SCBD Financial District",
                "Luxury Networking Hubs",
                "Strategic Government Proximity",
                "Emerging Tech Startup Ecosystem"
            ]
        },
        { 
            title: "Wild Komodo", 
            icon: Wind, 
            desc: "A prehistoric adventure in the heart of the Flores archipelago.",
            longDesc: "Home to the world's largest lizard, the Komodo Dragon, this National Park is a UNESCO World Heritage site. It offers rugged volcanic terrain and pink sand beaches that feel untouched by time.",
            details: [
                "Dragon Trekking Expeditions",
                "Pink Beach Relaxation",
                "Padar Island Iconic Vistas",
                "Luxury Liveaboard Cruises"
            ]
        },
        { 
            title: "Raja Ampat", 
            icon: Waves, 
            desc: "The world's richest marine biodiversity and diving paradise.",
            longDesc: "Located in West Papua, Raja Ampat is the crown jewel of the Coral Triangle. With over 1,500 islands and thousands of fish species, it is the ultimate frontier for marine conservationists and elite divers.",
            details: [
                "Top-tier Dive Sites",
                "Pristine Karst Formations",
                "Endemic Bird of Paradise",
                "Remote Eco-Resorts"
            ]
        },
        { 
            title: "Mt. Bromo", 
            icon: Mountain, 
            desc: "Witness the most breathtaking sunrise in the volcanic highlands.",
            longDesc: "East Java's volcanic landscape is dominated by the majestic Mt. Bromo. Trekking through the Sea of Sand at dawn to witness the crater's smoke against a purple sky is a bucket-list experience for every traveler.",
            details: [
                "Sunrise Viewpoints (Penanjakan)",
                "Jeep Adventure Across Volcanos",
                "Tenggerese Cultural Heritage",
                "Ijen Crater Acid Lake (Nearby)"
            ]
        },
        { 
            title: "Ancient Java", 
            icon: History, 
            desc: "Connected history meet modern-day digital nomadic lifestyle.",
            longDesc: "Java is the cradle of Indonesian civilization. Explore the ancient Buddhist temple of Borobudur and the Hindu grandeur of Prambanan, while staying connected in the vibrant student and art city of Yogyakarta.",
            details: [
                "Borobudur Sunrise Rituals",
                "Prambanan Temple Complex",
                "Mount Merapi Lava Tours",
                "Yogyakarta Arts & Batik Culture"
            ]
        }
    ];

    const SEO_SECTIONS = [
        {
            id: "bali-etiquette",
            badge: "Local Wisdom",
            title: "Bali Cultural Etiquette",
            desc: "Navigating the Island of the Gods with respect and awareness of local Banjars.",
            content: "Respecting local customs is paramount in Bali. The 'Banjar' (neighborhood council) system manages local affairs. When visiting temples, ensure you wear a sarong and sash, and avoid stepping on daily offerings (Canang Sari) left on the street.",
            icon: Landmark,
            details: [
                "Temple Dress Code Guidelines",
                "Understanding the Banjar System",
                "Ceremony Protocol for Visitors",
                "Nyepi (Silence Day) Regulations"
            ]
        },
        {
            id: "jakarta-investment",
            badge: "Strategic Growth",
            title: "Jakarta Business Hub",
            desc: "The epicenter of Indonesian commerce and FDI opportunities.",
            content: "Jakarta isn't just a destination; it's a strategic move. With millions of potential consumers and a rapidly digitalizing economy, the capital is the prime location for PT PMA (Foreign Investment) company establishment.",
            icon: Briefcase,
            details: [
                "NIB & OSS System Integration",
                "Corporate KITAS Facilitation",
                "SCBD Networking Excellence",
                "Tech Infrastructure & Connectivity"
            ]
        },
        {
            id: "global-connectivity",
            badge: "Archipelago Mobility",
            title: "Indonesia Global Logistics",
            desc: "Seamless travel via high-speed rail and regional air networks.",
            content: "With the new Whoosh High-Speed Rail connecting Jakarta and Bandung, and an ever-expanding regional air network, traversing the 5,000km archipelago has never been more efficient for business or leisure.",
            icon: Navigation,
            details: [
                "Whoosh High-Speed Rail",
                "Regional Terminal Expansion",
                "Island-Hopping Infrastructure",
                "Digital Ticketing Systems"
            ]
        },
        {
            id: "immigration-expertise",
            badge: "Legal Compliance",
            title: "Immigration Protocol Expert",
            desc: "Deep knowledge of the Directorate General of Immigration (Imigrasi).",
            content: "Compliance is the foundation of a stress-free stay. Our agency maintains direct liaisons with the Directorate General of Immigration, ensuring we are the first to know about regulatory shifts and policy updates.",
            icon: Scale,
            details: [
                "Overstay Prevention Strategies",
                "Automatic Extension Logs",
                "Passport Control Protocols",
                "Legal Sponsorship Liability"
            ]
        },
        {
            id: "digital-nomad-hubs",
            badge: "Modern Nomad",
            title: "The Digital Nomad Hubs",
            desc: "Canggu, Uluwatu, and Ubud's world-class coworking ecosystems.",
            content: "Indonesia, specifically Bali, has pioneered the digital nomad lifestyle. With high-speed fiber optics, vibrant maker communities, and the E33G Remote Worker Visa, you can work globally while living locally.",
            icon: Smartphone,
            details: [
                "Canggu Coworking Spaces",
                "Uluwatu Sunset Offices",
                "Ubud Creative Communities",
                "Starlink High-Speed Connectivity"
            ]
        },
        {
            id: "marine-conservation",
            badge: "Blue Frontier",
            title: "Marine Conservation & Tourism",
            desc: "Protecting the world's richest biodiversity in Raja Ampat.",
            content: "Sustainable tourism is vital for Indonesia's future. Our maritime regulations focus on protecting coral reefs and marine life, ensuring that future generations can witness the magic of the Coral Triangle.",
            icon: Waves,
            details: [
                "Marine Protected Areas (MPAs)",
                "Eco-Conscious Diving Rules",
                "Conservation Project Funding",
                "Mangrove Restoration Efforts"
            ]
        },
        {
            id: "healthcare-global",
            badge: "Medical Hub",
            title: "Emerging Medical Tourism",
            desc: "State-of-the-art facilities like the Bali International Hospital.",
            content: "Indonesia is rapidly becoming a destination for medical and wellness tourism. With the development of Special Economic Zones (SEZ) for healthcare, international standards are meeting Balinese hospitality.",
            icon: ShieldCheck,
            details: [
                "Sanur Medical SEZ",
                "Bali International Hospital",
                "Specialized Wellness Facilities",
                "E34 Medical Residency Visa"
            ]
        },
        {
            id: "archipelagic-facts",
            badge: "National Pride",
            title: "The Archipelagic Fact Hub",
            desc: "Insights into the world's largest island nation.",
            content: "Indonesia spans three time zones and contains over 700 spoken languages. It is a nation built on the motto 'Bhinneka Tunggal Ika' (Unity in Diversity), bridging two oceans and two continents.",
            icon: Globe,
            details: [
                "17,508 Islands Total",
                "700+ Local Languages",
                "Biodiversity Hotspot",
                "G20 Member Economy"
            ]
        }
    ];

    return (
        <>
            {/* DESTINATIONS GRID */}
            <section className="py-32 bg-slate-50 dark:bg-slate-900/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {DESTINATIONS.map((item, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => openModal(item.title, item.longDesc, item.details, item.icon)}
                                    className="text-left space-y-6 p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <item.icon size={32} />
                                        </div>
                                        <div className="text-[10px] font-black tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase italic">Discovery Info</div>
                                    </div>
                                    <h3 className="text-2xl font-bold mode-aware-text uppercase tracking-tight italic">{item.title}</h3>
                                    <p className="mode-aware-subtext leading-relaxed line-clamp-2">{item.desc}</p>
                                    <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-primary tracking-widest group-hover:gap-4 transition-all">
                                        LEARN MORE <ArrowRight size={14} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 8 NEW SEO DEPTH SECTIONS */}
            {SEO_SECTIONS.map((section, idx) => (
                <section 
                    key={section.id} 
                    className={`py-32 overflow-hidden ${idx % 2 === 0 ? 'bg-white dark:bg-[#030712]' : 'bg-slate-50 dark:bg-slate-900/40'}`}
                >
                    <div className="container mx-auto px-4">
                        <div className={`grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                            <div className={`space-y-8 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase font-black text-xs tracking-widest italic">
                                    {section.badge}
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black mode-aware-text tracking-tighter uppercase leading-none italic">
                                    {section.title}
                                </h2>
                                <p className="text-xl mode-aware-subtext leading-relaxed font-bold opacity-80">
                                    {section.desc}
                                </p>
                                <p className="text-lg mode-aware-subtext leading-relaxed font-medium">
                                    {section.content}
                                </p>
                                <button 
                                    onClick={() => openModal(section.title, section.content, section.details, section.icon)}
                                    className="inline-flex items-center gap-4 py-4 px-8 bg-slate-100 dark:bg-white/5 rounded-2xl mode-aware-text font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all group"
                                >
                                    Detailed Information
                                    <Zap className="group-hover:animate-pulse" size={16} />
                                </button>
                            </div>
                            
                            <div className={`relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl group ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                                <Image
                                    src={
                                        idx === 0 ? "/images/pages/BaliCultural Etiquette.webp" : 
                                        idx === 1 ? "/images/pages/JakartaBusinessHub.webp" : 
                                        idx === 2 ? "/images/pages/Indonesian Glonal Logistic.webp" :
                                        idx === 3 ? "/images/pages/ImmigratioHub.webp" :
                                        idx === 4 ? "/images/pages/The Digital Nomad.webp" :
                                        idx === 5 ? "/images/pages/Marine Conservation & Tourism.webp" :
                                        idx === 6 ? "/images/pages/Emerging Medical Tourism.webp" :
                                        "/images/pages/The Archipilagic Fact Hub.webp"
                                    }
                                    alt={section.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    unoptimized={true}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-12">
                                    <div className="mt-auto space-y-4">
                                         <div className="flex gap-4">
                                            {section.details.slice(0, 2).map((d, i) => (
                                                <span key={i} className="text-[10px] font-black text-white/80 uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                                    {d}
                                                </span>
                                            ))}
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

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
