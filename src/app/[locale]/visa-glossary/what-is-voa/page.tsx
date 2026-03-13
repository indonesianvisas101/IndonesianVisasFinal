import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "What is Visa on Arrival (VoA)? Bali Entry Guide | Indonesian Visas",
        description: "Everything you need to know about the Indonesian Visa on Arrival (VoA). Cost, duration, 2026 eligible countries, and extension rules.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-glossary/what-is-voa`,
        },
    };
}

export default async function WhatIsVoaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "definition",
            title: "Definition: What is abbreviated as VoA?",
            content: "VoA stands for Visa on Arrival. It is a type of entry permit issued at specific airports and seaports in Indonesia for citizens of eligible countries. It is primarily intended for short-term tourism, government visits, business meetings, or transit."
        },
        {
            id: "purpose",
            title: "Visa Purpose",
            content: "The VoA is designed for 'spontaneous' travel. It allows tourists to enter Indonesia without applying for a visa at an embassy beforehand. It is perfect for travelers planning to stay in Indonesia for up to 30 or 60 days."
        },
        {
            id: "eligibility",
            title: "Who is Eligible?",
            content: "Citizens of over 90 countries, including Australia, the USA, most European nations, and many Asian countries, are eligible for the VoA. The list is frequently updated by the Indonesian Ministry of Law and Human Rights."
        },
        {
            id: "duration",
            title: "Duration and Extension",
            content: "A VoA is valid for 30 days. It can be extended exactly once for another 30 days at a local immigration office, for a total stay of 60 days. After 60 days, the holder cannot extend further and must leave Indonesia."
        },
        {
            id: "requirements",
            title: "Requirements for 2026",
            content: "Travelers must have a passport valid for at least 6 months, a return or onward ticket out of Indonesia, and pay the visa fee. As of 2026, travelers are increasingly encouraged to use the 'e-VoA' system to pay and apply online before landing to avoid airport queues."
        },
        {
            id: "fees",
            title: "VoA Fees",
            content: "The official fee for a 30-day Visa on Arrival is IDR 500,000 (approximately USD 35). This can be paid in cash (major currencies) or by credit card at the airport, or online via the official Molina portal."
        },
        {
            id: "process",
            title: "Extension Process",
            content: "To extend your VoA, you must visit an immigration office (like those in Jimbaran or Denpasar for visitors in Bali). You will submit your passport, pay the extension fee (IDR 500,000), and undergo a biometric session. The process usually takes 3-5 business days."
        },
        {
            id: "limitations",
            title: "Important Limitations",
            content: "The VoA is strictly non-convertible. You cannot change a VoA into a KITAS or any other visa type while remaining in Indonesia. Furthermore, it is a single-entry visa; leaving the country voids the visa immediately."
        },
        {
            id: "mistakes",
            title: "Common Mistakes",
            content: "Overstaying a VoA is a common mistake that carries a penalty of IDR 1,000,000 per day. Another mistake is assuming the VoA allows for work or volunteering; it is strictly for leisure and limited business functions."
        },
        {
            id: "faq",
            title: "VoA FAQ",
            content: "Q: Can I apply for a VoA online? A: Yes, the e-VoA system allows you to pay and receive your visa digitally before you fly. Q: Is there a fee for the extension? A: Yes, the extension costs the same as the initial visa (IDR 500,000)."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="What is Visa on Arrival (VoA)?"
            subtitle="The simple guide to entering Indonesia for tourism and short business trips."
            breadcrumbs={[
                { label: "Visa Glossary", url: `/${locale}/visa-glossary` },
                { label: "What is VoA", url: `/${locale}/visa-glossary/what-is-voa` }
            ]}
            sections={sections}
            cta={{
                title: "Need to stay longer than 60 days?",
                desc: "If the VoA isn't enough, apply for a 60-day B211A visa that is extendable up to 6 months.",
                buttonText: "See B211A Options",
                link: `/${locale}/visa-types/b211a-visa-indonesia`
            }}
        />
    );
}
