import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";
import { generateCanonical, formatNavLink } from "@/utils/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "What is KITAS? Indonesia Stay Permit Guide | Indonesian Visas",
        description: "Everything you need to know about the Indonesian Limited Stay Permit (KITAS). Definition, types, requirements, and extension rules for 2026.",
        alternates: {
            canonical: generateCanonical(locale, "/visa-glossary/what-is-kitas"),
        },
    };
}

export default async function WhatIsKitasPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "definition",
            title: "Definition: What is abbreviated as KITAS?",
            content: "KITAS stands for Kartu Izin Tinggal Terbatas, which translates to Limited Stay Permit Card. It is the primary immigration document issued by the Indonesian Directorate General of Immigration that allows foreign nationals to reside in Indonesia for a period ranging from 6 months up to 2 years, depending on the specific type of stay permit granted."
        },
        {
            id: "purpose",
            title: "The Purpose of the KITAS",
            content: "The KITAS is designed for foreigners who wish to stay in Indonesia for longer than a typical tourist visit. It serves as both a residency permit and, in some cases, a work permit. Whether you are coming to Indonesia for work, investment, family unification, or retirement, the KITAS is the legal foundation for your long-term stay."
        },
        {
            id: "who-needs-it",
            title: "Who Needs a KITAS?",
            content: "Foregin nationals who fall under the following categories typically require a KITAS: foreign workers (E33 series), foreign investors (E31/E31A), dependents of Indonesian citizens (C317), students (C316), and retirees (E33E). If your objective is to stay beyond 180 days consecutively while maintaining legal residency status, a KITAS is mandatory."
        },
        {
            id: "duration",
            title: "Duration and Validity",
            content: "Standard KITAS validity is usually 1 year or 2 years. Some specific work KITAS (short-term) may only be valid for 6 months. One of the key benefits of a KITAS is that it is renewable (extendable) multiple times before the holder is required to either convert to a KITAP (Permanent Stay Permit) or leave the country."
        },
        {
            id: "eligibility",
            title: "KITAS Eligibility Requirements",
            content: "To be eligible, you must have a valid sponsor. This can be an Indonesian company (for work/investors), an Indonesian spouse (for family), or a registered travel/visa agency (for retirement). Your passport must have at least 18 months of validity remaining for a 1-year KITAS application."
        },
        {
            id: "documents",
            title: "Mandatory Documents",
            content: "Standard documentation includes: A high-quality scan of your passport biography page, personal bank statements showing minimum balance (typically USD 2,000), a passport-sized digital photo with a white background, and sponsor-specific documents such as the NIB and AHU for companies, or a KTP and Marriage Certificate for family-sponsored permits."
        },
        {
            id: "extensions",
            title: "Extension Rules",
            content: "KITAS extensions must be processed at the local Immigration Office (Kantor Imigrasi) at least 30 days before the current permit expires. The extension process usually involves biometric data collection (fingerprints and photo) and a physical interview if it is your first extension on that specific permit."
        },
        {
            id: "costs",
            title: "Associated Costs",
            content: "The cost of a KITAS includes the official immigration fee, the ITAS issuance fee, and the Re-Entry Permit (MERP) fee. For work KITAS, there is an additional DKP-TKA (Manpower Fund) fee of USD 1,200 per year. Professional agency fees for processing and handling typically range between IDR 8,000,000 to 15,000,000 depending on complexity."
        },
        {
            id: "mistakes",
            title: "Common Mistakes to Avoid",
            content: "The most common error is failing to track the expiration date, leading to overstay fines of IDR 1,000,000 per day. Another common mistake is working on a non-work KITAS (such as an Investor or Spouse KITAS without the proper Work Permit/RPTKA), which can lead to deportation and blacklisting."
        },
        {
            id: "faq",
            title: "KITAS FAQ",
            content: "Q: Can I change my sponsor on a KITAS? A: Yes, but it requires a 'Cancellation/EPO' of the old permit and a new application. Q: Does a KITAS allow me to open a bank account? A: Yes, a KITAS is the standard requirement for foreigners to open local IDR and USD bank accounts in Indonesia."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="What is a KITAS?"
            subtitle="The definitive guide to Indonesia's Limited Stay Permit. Learn about types, processes, and residency requirements."
            breadcrumbs={[
                { label: "Visa Glossary", url: formatNavLink(locale, "/visa-glossary") },
                { label: "What is KITAS", url: formatNavLink(locale, "/visa-glossary/what-is-kitas") }
            ]}
            sections={sections}
            cta={{
                title: "Ready to apply for your KITAS?",
                desc: "Our legal experts handle the entire sponsorship and immigration process for you.",
                buttonText: "Consult Now",
                link: formatNavLink(locale, "/apply")
            }}
        />
    );
}
