import React from "react";
import Link from "next/link";
import { 
    Home, 
    FileText, 
    ShieldCheck, 
    HelpCircle, 
    Info, 
    CreditCard, 
    Building2, 
    Plane, 
    Shield, 
    Lock, 
    RefreshCcw, 
    Users, 
    Phone,
    ArrowRight,
    Map,
    Search,
    Newspaper,
    BookOpen,
    Globe,
    Briefcase,
    Building,
    Landmark
} from "lucide-react";
import { getMessages } from "@/i18n/getMessages";

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Directory & Sitemap | Indonesian Visas",
        description: "Comprehensive site map of Indonesian Visas services, guides, and legal resources.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/sitemap`,
        },
    };
}

export default async function SitemapPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);

    const SITEMAP_DATA = [
        {
            title: "Core Experience",
            icon: Home,
            links: [
                { name: "Home", href: `/${locale}` },
                { name: "All Services", href: `/${locale}/services` },
                { name: "Company Profile", href: `/${locale}/company-profile` },
                { name: "About Us", href: `/${locale}/about` },
                { name: "Pricing", href: `/${locale}/pricing` }
            ]
        },
        {
            title: "Visa Application",
            icon: FileText,
            links: [
                { name: "Apply Now", href: `/${locale}/apply` },
                { name: "Visa Extensions", href: `/${locale}/extend` },
                { name: "Verification explained", href: `/${locale}/verification-explained` },
                { name: "Reviews", href: `/${locale}/reviews` }
            ]
        },
        {
            title: "Business & Travel",
            icon: Plane,
            links: [
                { name: "Company Registration", href: `/${locale}/company-formation` },
                { name: "Travel Hub", href: `/${locale}/travel` },
                { name: "Affiliate Program", href: `/${locale}/affiliate` }
            ]
        },
        {
            title: "Support & Legal",
            icon: Shield,
            links: [
                { name: "FAQ & Help", href: `/${locale}/faq` },
                { name: "Contact Support", href: "https://wa.me/6285727041992" },
                { name: "Privacy Policy", href: `/${locale}/privacy-policy` },
                { name: "Terms & Conditions", href: `/${locale}/terms-and-conditions` },
                { name: "Refund Policy", href: `/${locale}/refund` },
                { name: "Legal & Compliance", href: `/${locale}/legal` },
                { name: "Sitemap", href: `/${locale}/sitemap` }
            ]
        },
        {
            title: "Identity & Verification",
            icon: ShieldCheck,
            links: [
                { name: "Verification System", href: `/${locale}/verification-explained` },
                { name: "Arrival Card (BCV)", href: `/${locale}/arrival-card` },
                { name: "Traveler Reviews", href: `/${locale}/reviews` },
                { name: "Official Partners", href: `/${locale}/about#ecosystem` }
            ]
        },
        {
            title: "Visa Glossary",
            icon: Search,
            links: [
                { name: "Glossary Hub", href: `/${locale}/visa-glossary` },
                { name: "What is KITAS", href: `/${locale}/visa-glossary/what-is-kitas` },
                { name: "What is B211A", href: `/${locale}/visa-glossary/what-is-b211a` },
                { name: "What is VoA", href: `/${locale}/visa-glossary/what-is-voa` }
            ]
        },
        {
            title: "Knowledge Hub",
            icon: HelpCircle,
            links: [
                { name: "Official Visa Knowledge", href: `/${locale}/visa-knowledge/what-is-b211a` },
                { name: "Visa FAQ Hub", href: `/${locale}/visa-faq` },
                { name: "Immigration Updates", href: `/${locale}/indonesia-visa-updates` },
                { name: "Digital Nomad News", href: `/${locale}/indonesia-visa-updates/indonesia-digital-nomad-visa-news` },
                { name: "Bali Travel Info", href: `/${locale}/travel` }
            ]
        },

        {
            title: "Immigration News",
            icon: Newspaper,
            links: [
                { name: "2026 Visa Updates", href: `/${locale}/indonesia-visa-updates/visa-updates-2026` },
                { name: "New Bali Rules", href: `/${locale}/indonesia-visa-updates/new-bali-immigration-rules` },
                { name: "Investor Visa Guide", href: `/${locale}/visa-glossary/what-is-investor-visa` },
                { name: "Business Visa Guide", href: `/${locale}/visa-glossary/what-is-business-visa` }
            ]
        },
        {
            title: "Account & Secure Hub",
            icon: Lock,
            links: [
                { name: "User Dashboard", href: `/${locale}/dashboard` },
                { name: "Login & Register", href: `/${locale}/login` },
                { name: "Forgot Password", href: `/${locale}/forgot-password` },
                { name: "Update Profile", href: `/${locale}/dashboard` }
            ]
        },
        {
            title: "Trust & Authority",
            icon: ShieldCheck,
            links: [
                { name: "Legal Compliance", href: `/${locale}/trust/legal` },
                { name: "Company Profile", href: `/${locale}/trust/company-profile` },
                { name: "Our Process", href: `/${locale}/trust/our-process` },
                { name: "Why Choose Us", href: `/${locale}/trust/why-choose-us` }
            ]
        },
        {
            title: "Expat Guides",
            icon: Globe,
            links: [
                { name: "Move to Bali", href: `/${locale}/expat-guides/move-to-bali` },
                { name: "Living in Bali", href: `/${locale}/expat-guides/how-to-live-in-bali` },
                { name: "Long-Term Stay Options", href: `/${locale}/expat-guides/how-to-stay-in-bali-long-term` },
                { name: "Digital Nomad Guide", href: `/${locale}/expat-guides/bali-digital-nomad-guide` },
                { name: "Ultimate Expat Guide", href: `/${locale}/expat-guides/expat-guide-indonesia` }
            ]
        },
        {
            title: "Business & Investment",
            icon: Briefcase,
            links: [
                { name: "Start a Company in Bali", href: `/${locale}/business-indonesia/start-company-in-bali` },
                { name: "Business Visa Guide", href: `/${locale}/business-indonesia/business-visa-indonesia-guide` },
                { name: "Invest in Indonesia", href: `/${locale}/business-indonesia/invest-in-indonesia` },
                { name: "Investor Visa Guide", href: `/${locale}/business-indonesia/indonesia-investor-visa-guide` },
                { name: "Bali Business Setup", href: `/${locale}/business-indonesia/bali-business-setup` }
            ]
        },
        {
            title: "Visa Process",
            icon: FileText,
            links: [
                { name: "Processing Times", href: `/${locale}/visa-process/visa-processing-time-indonesia` },
                { name: "Visa Costs", href: `/${locale}/visa-process/visa-cost-indonesia` },
                { name: "Extension Costs", href: `/${locale}/visa-process/visa-extension-cost-bali` },
                { name: "How to Apply", href: `/${locale}/visa-process/how-to-apply-indonesia-visa` }
            ]
        },
        {
            title: "Immigration System",
            icon: Landmark,
            links: [
                { name: "System Overview", href: `/${locale}/immigration-system/indonesia-immigration-system` },
                { name: "Types of Visas", href: `/${locale}/immigration-system/types-of-indonesia-visas` },
                { name: "Bali Entry Requirements", href: `/${locale}/immigration-system/bali-entry-requirements` },
                { name: "Visa Requirements", href: `/${locale}/immigration-system/indonesia-visa-requirements` }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-300">
            {/* Header */}
            <header className="pt-32 pb-16 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 text-primary mb-4 font-black tracking-widest uppercase text-sm italic">
                            <Map size={24} />
                            Site Map
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mode-aware-text tracking-tighter mb-6">Directory</h1>
                        <p className="text-xl mode-aware-subtext max-w-2xl font-medium">
                            Find everything you need with our comprehensive directory of Indonesian Visas services, guides, and legal resources.
                        </p>
                    </div>
                </div>
            </header>

            {/* Sitemap Grid */}
            <main className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
                        {SITEMAP_DATA.map((section, idx) => (
                            <div key={idx} className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <section.icon size={22} />
                                    </div>
                                    <h2 className="text-xl font-black mode-aware-text">{section.title}</h2>
                                </div>
                                <ul className="space-y-4 border-l-2 border-slate-200 dark:border-white/5 pl-6">
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            <Link 
                                                href={link.href}
                                                className="text-lg mode-aware-subtext hover:text-primary transition-colors font-medium flex items-center group"
                                            >
                                                {link.name}
                                                <ArrowRight size={16} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer Note */}
            <section className="py-20 text-center">
                <div className="container mx-auto px-4">
                    <p className="text-sm mode-aware-subtext font-bold uppercase tracking-widest opacity-50">
                        © PT Indonesian Visas Agency™ — Navigation Hub
                    </p>
                </div>
            </section>
        </div>
    );
}
