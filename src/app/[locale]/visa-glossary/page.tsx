import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Glossary | Immigration Terms Defined | Indonesian Visas",
        description: "Official Indonesia Visa Glossary. Definitions and guides for KITAS, KITAP, VoA, e-Visa, Sponsorship, and more. Master Indonesian immigration terminology.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-glossary`,
        },
    };
}

export default async function VisaGlossaryHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "resident-permits",
            title: "Resident Permits (Limited & Permanent)",
            content: (
                <div className="space-y-4">
                    <p>Our comprehensive glossary clarifies the complex terminology of Indonesian stay permits.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong><a href={`/${locale}/visa-glossary/what-is-kitas`} className="text-primary hover:underline">KITAS (Limited Stay Permit)</a></strong>: The most common residency card for foreign workers, investors, and family members.</li>
                        <li><strong>KITAP (Permanent Stay Permit)</strong>: A 5-year residency permit for foreigners who have held a KITAS for several consecutive years.</li>
                        <li><strong>EPO (Exit Permit Only)</strong>: The administrative process required before leaving Indonesia permanently or cancelling a residency permit.</li>
                        <li><strong>ERP (Exit Re-entry Permit)</strong>: A permit that allows KITAS holders to leave and re-enter Indonesia multiple times.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "entry-visas",
            title: "Entry Visas (Visit & Business)",
            content: (
                <div className="space-y-4">
                    <p>Understanding entry permits is critical for short-term and medium-term visitors.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong><a href={`/${locale}/visa-glossary/what-is-voa`} className="text-primary hover:underline">Visa on Arrival (VoA)</a></strong>: A 30-day tourist permit obtained at the airport.</li>
                        <li><strong><a href={`/${locale}/visa-glossary/what-is-b211a`} className="text-primary hover:underline">B211A (Single Entry Visit Visa)</a></strong>: A versatile 60-day visa for business or tourism.</li>
                        <li><strong><a href={`/${locale}/visa-glossary/what-is-business-visa`} className="text-primary hover:underline">Business Visa (Multiple Entry)</a></strong>: A 1-2 year visa for professionals making frequent business trips.</li>
                        <li><strong>e-Visa</strong>: The digital document issued by the Indonesian immigration portal (Molina) that replaces physical visa sticks.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "investor-residency",
            title: "Investor & Specialized Residency",
            content: (
                <div className="space-y-4">
                    <p>High-level permits for capital injection and talent.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong><a href={`/${locale}/visa-glossary/what-is-investor-visa`} className="text-primary hover:underline">Investor KITAS</a></strong>: A stay permit for foreign shareholders in Indonesian PMA companies.</li>
                        <li><strong>Remote Worker Visa (E33G)</strong>: The official 'Digital Nomad' visa introduced for remote professionals.</li>
                        <li><strong>Golden Visa</strong>: A government initiative offering 5-10 year residency for significant economic contributions.</li>
                        <li><strong>Second Home Visa</strong>: For high-net-worth individuals wishing to retire or reside in Indonesia long-term.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "admin-terms",
            title: "Administrative & Legal Terms",
            content: (
                <div className="space-y-4">
                    <p>General terms you will encounter during your application.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Sponsor</strong>: The Indonesian individual or company that assumes legal liability for the foreigner.</li>
                        <li><strong>NIB (Business ID Number)</strong>: Required for all companies acting as visa sponsors.</li>
                        <li><strong>AHU (Justice Ministry Approval)</strong>: The official registration of a company's legal status.</li>
                        <li><strong>Satusehat</strong>: The official health application used for arrival declarations in Indonesia.</li>
                    </ul>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="Indonesia Visa Glossary"
            subtitle="Master the language of Indonesian immigration. We define the acronyms and terms that determine your residency status."
            breadcrumbs={[
                { label: "Home", url: `/${locale}/` },
                { label: "Visa Glossary", url: `/${locale}/visa-glossary` }
            ]}
            sections={sections}
            cta={{
                title: "Still confused by the options?",
                desc: "Our legal experts can simplify the entire process for you.",
                buttonText: "Get a Simplified Quote",
                link: `/${locale}/apply`
            }}
        />
    );
}
