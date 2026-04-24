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
    Landmark,
    CheckCircle2
} from "lucide-react";
import { getMessages } from "@/i18n/getMessages";
import { formatNavLink, generateCanonical } from "@/utils/seo";

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Directory & Sitemap | Indonesian Visas",
        description: "Comprehensive site map of Indonesian Visas services, guides, and legal resources.",
        alternates: {
            canonical: generateCanonical(locale, "/sitemap"),
        },
    };
}

export default async function SitemapPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = await getMessages(locale);

    const SITEMAP_DATA = [
        // SLIDE 1: MAIN HUBS
        {
            title: "Australia Hub Cluster",
            icon: Globe,
            links: [
                { name: "Australia Main Hub", href: formatNavLink(locale, "/australia") },
                { name: "Digital Nomad Guide (Aussie)", href: formatNavLink(locale, "/visa-indonesia-for-australians") },
                { name: "Travel & Safety Guide", href: formatNavLink(locale, "/australia/travel-indonesia") },
                { name: "KITAS Residency Guide", href: formatNavLink(locale, "/australia/kitas") },
                { name: "Indonesia Citizenship", href: formatNavLink(locale, "/australia/citizenship") }
            ]
        },
        {
            title: "VFS Global Education Hub",
            icon: ShieldCheck,
            links: [
                { name: "VFS Indonesia Guide", href: formatNavLink(locale, "/vfs-indonesia") },
                { name: "VFS Global vs. Official", href: formatNavLink(locale, "/vfs-global") },
                { name: "Global VFS Overview", href: formatNavLink(locale, "/vfs-indonesian-visas") },
                { name: "Indonesian Visa Facts", href: formatNavLink(locale, "/visa-process") },
                { name: "Partnership Verification", href: formatNavLink(locale, "/vfs-indonesian-immigration-partnership") }
            ]
        },
        {
            title: "Global Premium Hubs",
            icon: Map,
            links: [
                { name: "Bali Ultimate Hub", href: formatNavLink(locale, "/services/Bali") },
                { name: "Jakarta Business Hub", href: formatNavLink(locale, "/services/Jakarta") },
                { name: "United States (Top)", href: formatNavLink(locale, "/services/United-States") },
                { name: "France (Europe)", href: formatNavLink(locale, "/services/France") },
                { name: "Netherlands", href: formatNavLink(locale, "/services/Netherlands") },
                { name: "Canada", href: formatNavLink(locale, "/services/Canada") },
                { name: "China (Asia)", href: formatNavLink(locale, "/services/China") },
                { name: "Mexico (Americas)", href: formatNavLink(locale, "/services/Mexico") },
                { name: "Singapore", href: formatNavLink(locale, "/services/Singapore") },
                { name: "Australia", href: formatNavLink(locale, "/services/Australia") }
            ]
        },
        {
            title: "Core Experience",
            icon: Home,
            links: [
                { name: "Home", href: formatNavLink(locale, "/") },
                { name: "All Services", href: formatNavLink(locale, "/services") },
                { name: "Company Profile", href: formatNavLink(locale, "/company-profile") },
                { name: "About Us", href: formatNavLink(locale, "/about") },
                { name: "Pricing", href: formatNavLink(locale, "/pricing") }
            ]
        },
        // SLIDE 2: APPLICATIONS & SUPPORT
        {
            title: "Visa Application",
            icon: FileText,
            links: [
                { name: "Apply Now", href: formatNavLink(locale, "/apply") },
                { name: "Visa Extensions", href: formatNavLink(locale, "/visa-extension") },
                { name: "Verification explained", href: formatNavLink(locale, "/verification-explained") },
                { name: "Reviews", href: formatNavLink(locale, "/trust") }
            ]
        },
        {
            title: "Business & Travel",
            icon: Plane,
            links: [
                { name: "Company Registration", href: formatNavLink(locale, "/company-formation") },
                { name: "Travel Hub", href: formatNavLink(locale, "/travel") },
                { name: "Guide Business Bali", href: formatNavLink(locale, "/business-indonesia") },
                { name: "Ultimate Start Business Bali", href: formatNavLink(locale, "/fast-approval") },
                { name: "Affiliate Program", href: formatNavLink(locale, "/affiliate") }
            ]
        },
        {
            title: "Support & Legal",
            icon: Shield,
            links: [
                { name: "FAQ & Help", href: formatNavLink(locale, "/faq") },
                { name: "Contact Support", href: formatNavLink(locale, "/help") },
                { name: "Privacy Policy", href: formatNavLink(locale, "/privacy-policy") },
                { name: "Terms & Conditions", href: formatNavLink(locale, "/terms-and-conditions") },
                { name: "Refund Policy", href: formatNavLink(locale, "/refund") },
                { name: "Legal & Compliance", href: formatNavLink(locale, "/legal") },
                { name: "Sitemap", href: formatNavLink(locale, "/sitemap") }
            ]
        },
        {
            title: "Identity & Verification",
            icon: CheckCircle2,
            links: [
                { name: "Verification System", href: formatNavLink(locale, "/idiv-hub") },
                { name: "IDiv Public Search", href: formatNavLink(locale, "/idiv-search") },
                { name: "Arrival Card (BCV)", href: formatNavLink(locale, "/arrival-card") },
                { name: "Traveler Reviews", href: formatNavLink(locale, "/trust") },
                { name: "Official Partners", href: formatNavLink(locale, "/legal-experts") }
            ]
        },
        {
            title: "Foreigner Identity & Legal ID",
            icon: Building2,
            links: [
                { name: "ID Card Guide Indonesia", href: formatNavLink(locale, "/id-card-for-foreigner-in-indonesia") },
                { name: "KTP for Foreigners", href: formatNavLink(locale, "/ktp-for-foreigner-in-indonesia") },
                { name: "Family Card (KK) Guide", href: formatNavLink(locale, "/family-card-for-foreigner-in-indonesia") },
                { name: "How to Get ID Card", href: formatNavLink(locale, "/how-to-get-id-card-in-indonesia") },
                { name: "Bali ID Specific Guide", href: formatNavLink(locale, "/id-card-for-foreigner-in-bali") }
            ]
        },
        {
            title: "Visa Glossary",
            icon: Search,
            links: [
                { name: "Glossary Hub", href: formatNavLink(locale, "/visa-glossary") },
                { name: "What is KITAS", href: formatNavLink(locale, "/visa-glossary/what-is-kitas") },
                { name: "What is B211A", href: formatNavLink(locale, "/visa-glossary/what-is-b211a") },
                { name: "What is VoA", href: formatNavLink(locale, "/visa-glossary/what-is-voa") }
            ]
        },
        {
            title: "Knowledge Hub",
            icon: HelpCircle,
            links: [
                { name: "Official Visa Knowledge", href: formatNavLink(locale, "/visa-knowledge") },
                { name: "Visa FAQ Hub", href: formatNavLink(locale, "/visa-faq") },
                { name: "Immigration Updates", href: formatNavLink(locale, "/indonesia-visa-updates") },
                { name: "Digital Nomad News", href: formatNavLink(locale, "/blog") },
                { name: "Bali Travel Info", href: formatNavLink(locale, "/travel") }
            ]
        },
        {
            title: "Immigration News",
            icon: Newspaper,
            links: [
                { name: "2026 Visa Updates", href: formatNavLink(locale, "/indonesia-visa-updates") },
                { name: "New Bali Rules", href: formatNavLink(locale, "/indonesian-visa-update") },
                { name: "Investor Visa Guide", href: formatNavLink(locale, "/visa-guides") },
                { name: "Business Visa Guide", href: formatNavLink(locale, "/visa-guides") }
            ]
        },
        {
            title: "Regulation Depth",
            icon: Building2,
            links: [
                { name: "Visa Regulations", href: formatNavLink(locale, "/regulations") },
                { name: "Immigration Law", href: formatNavLink(locale, "/immigration-rules") },
                { name: "Official Policy", href: formatNavLink(locale, "/legal-experts") },
                { name: "Eligibility Rules", href: formatNavLink(locale, "/list-country") }
            ]
        },
        // SLIDE 3: ACCOUNT & PLATFORM
        {
            title: "Account & Secure Hub",
            icon: Lock,
            links: [
                { name: "User Dashboard", href: formatNavLink(locale, "/dashboard") },
                { name: "Login & Register", href: formatNavLink(locale, "/login") },
                { name: "Forgot Password", href: formatNavLink(locale, "/forgot-password") },
                { name: "Update Profile", href: formatNavLink(locale, "/update-password") }
            ]
        },
        {
            title: "Trust & Authority",
            icon: ShieldCheck,
            links: [
                { name: "Legal Compliance", href: formatNavLink(locale, "/legal") },
                { name: "Company Profile", href: formatNavLink(locale, "/company-profile") },
                { name: "Our Process", href: formatNavLink(locale, "/id-guide") },
                { name: "Why Choose Us", href: formatNavLink(locale, "/trust") }
            ]
        },
        {
            title: "Expat Guides",
            icon: Globe,
            links: [
                { name: "Move to Bali", href: formatNavLink(locale, "/guides") },
                { name: "Living in Bali", href: formatNavLink(locale, "/guides") },
                { name: "Long-Term Stay Options", href: formatNavLink(locale, "/guides") },
                { name: "Digital Nomad Guide", href: formatNavLink(locale, "/guides") },
                { name: "Ultimate Expat Guide", href: formatNavLink(locale, "/guides") }
            ]
        },
        {
            title: "Business & Investment",
            icon: Briefcase,
            links: [
                { name: "Start a Company in Bali", href: formatNavLink(locale, "/company-formation") },
                { name: "Business Visa Guide", href: formatNavLink(locale, "/visa-guides") },
                { name: "Invest in Indonesia", href: formatNavLink(locale, "/business-indonesia") },
                { name: "Investor Visa Guide", href: formatNavLink(locale, "/visa-guides") },
                { name: "Bali Business Setup", href: formatNavLink(locale, "/company-formation") }
            ]
        },
        {
            title: "IDIV Platform Docs",
            icon: BookOpen,
            links: [
                { name: "Platform Overview", href: formatNavLink(locale, "/idiv") },
                { name: "Identity Platform Manual", href: formatNavLink(locale, "/Digital-Visa-Identity-Platform") },
                { name: "How the System Works", href: formatNavLink(locale, "/how-the-visa-identity-system-works") },
                { name: "Sponsor ID Card", href: formatNavLink(locale, "/visa-identity-card") },
                { name: "QR Verification Guide", href: formatNavLink(locale, "/qr-verification-system") },
                { name: "Verification Operator Guide", href: formatNavLink(locale, "/online-verification-page") },
                { name: "Identity Security Hub", href: formatNavLink(locale, "/visa-identity-security") }
            ]
        },
        {
            title: "Identity Use Cases",
            icon: Users,
            links: [
                { name: "Villa Rental Guide", href: formatNavLink(locale, "/using-sponsor-id-for-villa-rental") },
                { name: "Vehicle Rental Guide", href: formatNavLink(locale, "/using-sponsor-id-for-vehicle-rentals") },
                { name: "Business Meetings", href: formatNavLink(locale, "/using-sponsor-id-for-business-meetings") },
                { name: "Why You Need a Sponsor ID", href: formatNavLink(locale, "/why-travelers-need-a-sponsor-id") },
                { name: "Visa Sponsor Explained", href: formatNavLink(locale, "/visa-sponsor-system-explained") },
                { name: "Anti-Fraud Protocols", href: formatNavLink(locale, "/how-qr-validation-prevents-fraud") },
                { name: "Validity Rules", href: formatNavLink(locale, "/visa-identity-validity-rules") }
            ]
        },
        {
            title: "Visa Information Guides",
            icon: Info,
            links: [
                { name: "General Information", href: formatNavLink(locale, "/general-information-visa-indonesia") },
                { name: "Calling Visa Countries", href: formatNavLink(locale, "/calling-visa") },
                { name: "Registered Countries", href: formatNavLink(locale, "/list-country") },
                { name: "Point of Entry (e-VoA)", href: formatNavLink(locale, "/point-of-entry-evoa") }
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
            <div className="py-24">
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
            </div>

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
