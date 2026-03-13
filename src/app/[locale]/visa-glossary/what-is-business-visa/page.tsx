import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "What is Business Visa? Indonesia Professional Entry | Indonesian Visas",
        description: "Guide to the Indonesian Business Visa (C2). Learn about single-entry vs multiple-entry options, 2026 rules, and sponsorship requirements.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-glossary/what-is-business-visa`,
        },
    };
}

export default async function WhatIsBusinessVisaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "definition",
            title: "Definition: What is an Indonesian Business Visa?",
            content: "The Business Visa (primarily Index C2) is a visit visa designed for foreign professionals who need to enter Indonesia for non-work business activities. This includes attending conferences, workshops, conducting market research, negotiating contracts, or meeting with local partners."
        },
        {
            id: "types",
            title: "Types: Single vs Multiple Entry",
            content: "There are two main categories: The **Single-Entry Business Visa (B211A Business)**, valid for 60 days and extendable, and the **Multiple-Entry Business Visa (D2)**, which is usually valid for 1 or 2 years and allows multiple trips of up to 60 days each."
        },
        {
            id: "allowed-activities",
            title: "What Activities are Allowed?",
            content: "Allowed activities include: Attending corporate seminars, purchasing goods for export, consulting with Indonesian clients, and auditing local offices. Crucially, you cannot perform 'hands-on' technical work or receive payment from an Indonesian entity under this visa."
        },
        {
            id: "who-should-apply",
            title: "Who Should Apply?",
            content: "CEOs, consultants, export-import managers, and digital nomads who need to interact with the local Indonesian business ecosystem frequently should apply for this visa. It provides much more flexibility than a standard tourist VoA."
        },
        {
            id: "sponsorship",
            title: "Sponsorship Requirements",
            content: "Every Business Visa application requires a local Indonesian sponsor. This sponsor must be a registered company (PT or PMA) that provides an invitation letter and assumes legal responsibility for the visitor during their stay."
        },
        {
            id: "duration",
            title: "Duration and Extension",
            content: "The Single-Entry version starts with 60 days and can be extended twice (total 180 days). The Multiple-Entry version allows you to stay for 60 days per visit, after which you must leave the country and return (a 'visa run') to reset the 60-day clock."
        },
        {
            id: "documents",
            title: "Mandatory Documents",
            content: "Required documents: Passport with 6-18 months validity (depending on visa duration), digital photo, bank statements, company NIB/AHU from the sponsor, and a formal invitation letter on company letterhead."
        },
        {
            id: "costs",
            title: "Costs and Processing",
            content: "The visa fee ranges from IDR 2,000,000 for single entry to IDR 3,000,000 per year for multiple entry. Global agency processing for a 1-year multiple entry business visa typically costs between IDR 6,000,000 to 9,000,000."
        },
        {
            id: "risks",
            title: "Risk of Non-Compliance",
            content: "The most common compliance risk is performing 'productive work' (e.g., coding for a local startup or managing local staff) while on a business visa. If caught, authorities can classify this as a manpower violation, resulting in immediate deportation."
        },
        {
            id: "faq",
            title: "Business Visa FAQ",
            content: "Q: Can I use this visa to work? A: No, it is strictly for non-productive business meetings and negotiations. Q: Is there a minimum bank balance? A: Yes, usually a minimum of USD 2,000 or equivalent must be shown."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="What is a Business Visa?"
            subtitle="The professional's guide to conducting business legally in the Indonesian archipelago."
            breadcrumbs={[
                { label: "Visa Glossary", url: `/${locale}/visa-glossary` },
                { label: "What is Business Visa", url: `/${locale}/visa-glossary/what-is-business-visa` }
            ]}
            sections={sections}
            cta={{
                title: "Need a Multiple-Entry Business Visa?",
                desc: "Get your 1-year or 2-year business D2 visa with our corporate sponsorship packages.",
                buttonText: "Request Quote",
                link: `/${locale}/apply`
            }}
        />
    );
}
