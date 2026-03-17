import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Official Indonesia Immigration Policy | Strategic Entry Update",
        description: "Official policy updates from the Indonesian Directorate General of Immigration. Strategic vision for 2026, including 'Golden Visa', digitalization, and specialized entry protocols.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/regulations/official-immigration-policy`,
        },
    };
}

export default async function OfficialImmigrationPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "strategic-vision",
            title: "2026 Strategic Vision",
            content: "The Indonesian Directorate General of Immigration has launched a 'Golden Visa' policy as part of a national strategy to attract global talent and high-value investment. This policy aims to position Indonesia as a premier destination for business and retirement through long-term residency certainty."
        },
        {
            id: "digital-first",
            title: "The Digital-First Policy",
            content: "Immigration policy now prioritizes the 'Molina' (Module of Online Application) system, which allows for fully remote application and issuance of visas. This shift is designed to reduce bureaucracy, increase transparency, and provide a seamless experience for foreign travelers."
        },
        {
            id: "selective-policy",
            title: "Selective Immigration Policy",
            content: "Indonesia follows a 'Selective Policy' (Kebijakan Selektif), meaning that only foreign nationals who provide benefits to Indonesia and do not disrupt public order or state security are allowed entry. This policy is the basis for all individual visa approvals."
        },
        {
            id: "golden-visa-intro",
            title: "The Golden Visa Implementation",
            content: "The introduction of the Golden Visa (long-term 5 to 10-year residency) represents a landmark shift in policy. It is geared towards foreign investors, both individuals and corporate entities, that make a significant capital commitment to Indonesia's development."
        },
        {
            id: "security-compliance",
            title: "Security & Compliance Policy",
            content: "Modern policy includes rigorous background checks integrated with international law enforcement databases. Compliance is monitored through the QR-based Digital Visa Identity (IDIV) system, which provides real-time verification at various checkpoints."
        },
        {
            id: "border-management",
            title: "Smart Border Management",
            content: "As part of the smart border initiative, major airports like Soekarno-Hatta (Jakarta) and Ngurah Rai (Bali) have implemented autogates for foreign nationals holding electronic passports from eligible countries, further streamlining the entry process under official policy guidelines."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="Official Immigration Policy"
            subtitle="Understand the strategic vision and administrative policies that shape Indonesian immigration, entry protocols, and residency permits for 2026."
            breadcrumbs={[
                { label: "Regulations", url: `/${locale}/regulations` },
                { label: "Official Policy", url: `/${locale}/regulations/official-immigration-policy` }
            ]}
            sections={sections}
            cta={{
                title: "Need policy-specific advice?",
                desc: "Our strategic advisors can clarify how current immigration policies affect your business or personal residency goals.",
                buttonText: "Request Briefing",
                link: `/${locale}/apply`
            }}
        />
    );
}
