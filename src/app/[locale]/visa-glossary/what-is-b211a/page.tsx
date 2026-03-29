import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";
import { generateCanonical, formatNavLink } from "@/utils/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "What is B211A Visa? Indonesia Entry Permit Guide | Indonesian Visas",
        description: "Everything you need to know about the B211A Visa for Indonesia. Purpose, 2026 requirements, and extension rules for business and tourism.",
        alternates: {
            canonical: generateCanonical(locale, "/visa-glossary/what-is-b211a"),
        },
    };
}

export default async function WhatIsB211aPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "definition",
            title: "Definition: What is the B211A Visa?",
            content: "The B211A is a Single-Entry Visit Visa designed for foreigners visiting Indonesia for purposes such as tourism, business meetings, government visits, or purchasing goods. Unlike a Visa on Arrival, the B211A must be processed before your arrival through an electronic visa system (e-Visa)."
        },
        {
            id: "purpose",
            title: "B211A Visa Purpose",
            content: "This visa is versatile. It is primarily used by business travelers attending seminars, negotiating deals, or performing quality control, as well as by long-term tourists who wish to stay longer than the 60-day limit of an extended VoA. It is important to note that the B211A does NOT permit employment or receiving a salary from an Indonesian company."
        },
        {
            id: "who-needs-it",
            title: "Who Needs this Visa?",
            content: "Travelers from non-visa-exempt countries, or those from visa-exempt countries who intend to stay longer than 30 or 60 days, should apply for a B211A. It is also the standard choice for foreigners intending to investigate investment opportunities before committing to a KITAS."
        },
        {
            id: "duration",
            title: "Duration and Validity",
            content: "The initial B211A visa is valid for 60 days. It is extendable twice, with each extension granting an additional 60 days, bringing the total potential stay to 180 days. After 180 days, the holder must leave Indonesia or apply for a new onshore visa (if available under current regulations)."
        },
        {
            id: "requirements",
            title: "Requirements for 2026",
            content: "As of 2026, applicants must provide proof of health insurance, a complete vaccination record (if required by updated health protocols), and evidence of sufficient funds (typically USD 2,000). A local Indonesian sponsor (individual or company) is mandatory for the B211A application."
        },
        {
            id: "documents",
            title: "Mandatory Documents",
            content: "You will need: A passport with at least 6 months validity, a color digital photograph, and a bank statement showing your name and the required balance. If you are applying for business purposes, an invitation letter from an Indonesian company is required."
        },
        {
            id: "extensions",
            title: "Extension Rules",
            content: "Extensions must be submitted at least 7-14 days before the current 60-day period expires. The first extension usually requires a trip to the local immigration office for biometrics. The second extension can often be processed without a physical visit if the biometric data is already on file from the first extension."
        },
        {
            id: "cost",
            title: "Processing Cost",
            content: "The official government fee for a B211A is IDR 2,000,000 (standard) or IDR 6,000,000 for a 6-month pre-paid business visa. Agency fees for sponsorship and end-to-end processing typically vary between IDR 3,500,000 to 5,000,000 for the initial 60 days."
        },
        {
            id: "mistakes",
            title: "Common Mistakes",
            content: "The most significant mistake is entering Indonesia on a B211A and then attempting to work for a local company. This is a violation of the Visit Visa terms. Another mistake is forgetting that the visa 'clock' starts the moment you land, not when the visa was issued."
        },
        {
            id: "faq",
            title: "B211A FAQ",
            content: "Q: Can I convert a B211A to a KITAS onshore? A: Yes, many B211A types (Business or Investment) are convertible to a KITAS without leaving the country. Q: Is the B211A multiple entry? A: No, it is a single-entry visa. If you leave Indonesia, the visa is void."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="What is a B211A Visa?"
            subtitle="The complete guide to Indonesia's most popular business and long-term tourism visa."
            breadcrumbs={[
                { label: "Visa Glossary", url: formatNavLink(locale, "/visa-glossary") },
                { label: "What is B211A", url: formatNavLink(locale, "/visa-glossary/what-is-b211a") }
            ]}
            sections={sections}
            cta={{
                title: "Apply for your B211A today",
                desc: "Fast-track your Indonesian e-Visa with our professional sponsorship services.",
                buttonText: "Apply Now",
                link: formatNavLink(locale, "/apply")
            }}
        />
    );
}
