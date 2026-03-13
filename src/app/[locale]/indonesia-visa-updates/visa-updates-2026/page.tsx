import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Updates 2026 | Latest Immigration News | Indonesian Visas",
        description: "Stay informed with the latest Indonesia visa updates for 2026. Changes to VoA, KITAS rules, and new immigration digital systems.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/indonesia-visa-updates/visa-updates-2026`,
        },
    };
}

export default async function VisaUpdates2026Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "overview",
            title: "2026 Immigration Policy Overview",
            content: "As of early 2026, the Indonesian Directorate General of Immigration has accelerated its 'Digital First' initiative. The primary focus is on expanding the e-Visa and e-VoA systems to cover 100+ countries, reducing processing times and increasing transparency through real-time tracking."
        },
        {
            id: "golden-visa",
            title: "Golden Visa Expansion",
            content: "The Golden Visa program has seen new sub-categories introduced for tech talent and AI researchers. Minimum investment thresholds for 5-year and 10-year residency have been adjusted to favor high-growth sectors such as green energy and digital infrastructure."
        },
        {
            id: "remote-worker",
            title: "New Remote Worker (Digital Nomad) Rules",
            content: "The E33G Remote Worker visa is now the standard for digital nomads. This year, the government clarified tax obligations for E33G holders, ensuring that income derived from foreign sources remains tax-exempt as long as the stay is within residency guidelines."
        },
        {
            id: "ai-verification",
            title: "Introduction of AI-Powered Document Verification",
            content: "Immigration checkpoints at Jakarta Soekarno-Hatta and Bali I Gusti Ngurah Rai are now utilizing AI-enhanced facial recognition and document verification. This has significantly reduced clearance times for residents and visa-holders."
        },
        {
            id: "bali-levy",
            title: "Sustainability Fee for Bali Visitors",
            content: "The Bali Provincial Government has updated the 'Tourist Levy' system. All international arrivals in Bali must pay a sustainability fee (approx. USD 10), which is now integrated into the e-VoA payment portal for a seamless entry experience."
        },
        {
            id: "compliance",
            title: "Enhanced KITAS Compliance Monitoring",
            content: "There is now a stricter quarterly reporting requirement for company-sponsored KITAS holders. Companies must submit digital workforce reports through a centralized portal to ensure all foreign employees are working within their designated visa indices."
        },
        {
            id: "fees",
            title: "Visa Fee Adjustments",
            content: "Several visa indices have seen minor fee adjustments due to inflation and administrative upgrades. The B211A Visit Visa fees have slightly increased to support the enhanced security of the digital visa infrastructure."
        },
        {
            id: "visa-free",
            title: "Expansion of Visa-Free Entry (Specific Countries)",
            content: "Speculation continues regarding the expansion of visa-free entry for citizens of additional high-spending tourism markets. Travelers are encouraged to check official lists weekly as diplomatic agreements are finalized."
        },
        {
            id: "offices",
            title: "Relocation of Immigration Offices",
            content: "Several regional immigration offices in Bali and Jakarta have moved to newer, high-capacity facilities to better serve the growing number of long-term foreign residents and investors."
        },
        {
            id: "outlook",
            title: "What to Expect for the Rest of 2026",
            content: "The trend toward longer-term residency permits (5-10 years) is expected to dominate. Foreigners should look into 'Second Home' and 'Investor' categories to secure their long-term future in Indonesia amidst these evolving policies."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="Indonesia Visa Updates 2026"
            subtitle="The definitive source for real-time changes in immigration law, processing fees, and entry requirements."
            breadcrumbs={[
                { label: "Updates Hub", url: `/${locale}/indonesia-visa-updates` },
                { label: "2026 Updates", url: `/${locale}/indonesia-visa-updates/visa-updates-2026` }
            ]}
            sections={sections}
            cta={{
                title: "Stay Ahead of the Rules",
                desc: "Get personalized updates and compliance alerts from our immigration attorneys.",
                buttonText: "Join Newsletter",
                link: `/${locale}/apply`
            }}
        />
    );
}
