import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "What is Investor KITAS? Indonesia Residency Guide | Indonesian Visas",
        description: "Everything you need to know about the Indonesian Investor KITAS (E31/E31A). 2026 benefits, requirements, and corporate compliance rules.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-glossary/what-is-investor-visa`,
        },
    };
}

export default async function WhatIsInvestorVisaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "definition",
            title: "Definition: What is an Investor KITAS?",
            content: "The Investor KITAS is a specific Limited Stay Permit (Index E31 or E31A) designed for foreign investors who hold shares in a PMA (Penanaman Modal Asing) company in Indonesia. It is one of the most prestigious and sought-after residency permits due to its streamlined requirements and long-term benefits."
        },
        {
            id: "purpose",
            title: "Primary Purpose",
            content: "The purpose is to facilitate foreign direct investment (FDI) into the Indonesian economy. By granting a KITAS to individuals who invest significant capital, the government encourages the creation of jobs and the development of local industries."
        },
        {
            id: "benefits",
            title: "Key Benefits",
            content: "Investors with this KITAS benefit from a waiver of the Manpower Fund (DKP-TKA) fee, saving USD 1,200 per year. It also allows for multiple entries into Indonesia and provides a clear pathway to Permanent Residency (KITAP) after several years of continuous holding."
        },
        {
            id: "corporate-reqs",
            title: "Eligibility: Corporate Requirements",
            content: "To be eligible, the PMA company must have a minimum paid-up capital of IDR 10 Billion (as of the latest regulations). The individual investor must hold a minimum share value of IDR 10 Billion and be listed as a Director or Commissioner in the company's Deed (Akta)."
        },
        {
            id: "individual-reqs",
            title: "Individual Requirements",
            content: "The applicant must have a passport valid for at least 18 months, proof of being a shareholder in a qualifying PMA, and personal bank statements. Unlike the work KITAS, the Investor KITAS does not require a complex RPTKA (Manpower Plan) approval."
        },
        {
            id: "duration",
            title: "Duration and Validity",
            content: "The Investor KITAS is typically issued for 1 year or 2 years. It is extendable within Indonesia, and after two consecutive 2-year permits, the holder is eligible to apply for an Investor KITAP, which is valid for 5 years and auto-renewable."
        },
        {
            id: "documents",
            title: "Documents for Application",
            content: "Required documents include the Company's Deed of Establishment (Akta), the NIB (Business Identification Number), the AHU (Ministry of Justice approval), and a High-Definition scan of the investor's passport. A certificate of share ownership is also mandatory."
        },
        {
            id: "costs",
            title: "Associated Costs",
            content: "While the Manpower fee is waived, there are still immigration fees for the ITAS, MERP, and electronic data processing. Total agency processing fees for an Investor KITAS typically range from IDR 15,000,000 to 25,000,000, depending on the validity period."
        },
        {
            id: "compliance",
            title: "Compliance and Reporting",
            content: "Holders must ensure their PMA company remains active and files its LKPM (Investment Activity Report) quarterly. Failure to maintain corporate compliance can lead to the revocation of the Investor KITAS."
        },
        {
            id: "faq",
            title: "Investor Visa FAQ",
            content: "Q: Can I work on an Investor KITAS? A: Yes, but only in the specific company where you are an investor and listed as a Director/Commissioner. Q: Can I bring my family? A: Yes, your spouse and children can apply for Dependent KITAS tied to your Investor permit."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="What is an Investor KITAS?"
            subtitle="The ultimate residency permit for foreign investors in Indonesia."
            breadcrumbs={[
                { label: "Visa Glossary", url: `/${locale}/visa-glossary` },
                { label: "What is Investor Visa", url: `/${locale}/visa-glossary/what-is-investor-visa` }
            ]}
            sections={sections}
            cta={{
                title: "Launch your Investment in Indonesia",
                desc: "Our legal firm specializes in PMA incorporation and Investor KITAS sponsorship.",
                buttonText: "Start Investing",
                link: `/${locale}/company-formation`
            }}
        />
    );
}
