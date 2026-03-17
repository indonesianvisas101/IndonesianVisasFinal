import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Regulations 2026 | Official Legal Guide",
        description: "Comprehensive guide to Indonesia's current visa regulations. Understand the legal framework, stay limits, and compliance requirements for foreign nationals.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/regulations/indonesia-visa-regulations`,
        },
    };
}

export default async function VisaRegulationsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "overview",
            title: "Regulatory Overview",
            content: "Indonesian visa regulations are governed primarily by the Ministry of Law and Human Rights. The current 2026 framework emphasizes digitalization and simplified entry for investors, digital nomads, and high-net-worth individuals while maintaining strict security protocols."
        },
        {
            id: "legal-framework",
            title: "The Legal Framework",
            content: "The primary legal instrument for immigration is Law No. 6 of 2011 on Immigration. However, specific visa types and procedures are defined by Government Regulation No. 31 of 2013 and various Ministerial Regulations (Permenkumham), which are frequently updated to reflect national economic priorities."
        },
        {
            id: "visa-categories",
            title: "Official Visa Categories",
            content: "Regulations divide visits into four main categories: Visit Visas (B series/single entry), Multiple Entry Visit Visas (D series), Limited Stay Permits (ITAS/KITAS), and Permanent Stay Permits (ITAP/KITAP). Each category has specific activity restrictions defined by the Directorate General of Immigration."
        },
        {
            id: "stay-limit-rules",
            title: "Stay Limit & Extension Rules",
            content: "Most Visit Visas allow a 30 to 60-day stay with possibilities for extension. The regulation mandates that extension applications must be submitted at least 7 to 14 days before the current permit expires. Overstaying is a serious violation subject to daily administrative fines (IDR 1,000,000/day)."
        },
        {
            id: "prohibited-activities",
            title: "Prohibited Activities",
            content: "Under Article 122 of the Immigration Law, foreigners who misuse their stay permit or engage in activities inconsistent with the purpose for which the permit was granted (e.g., working on a tourist visa) face deportation and entry bans."
        },
        {
            id: "digitalization",
            title: "Digital Immigration (E-Visa)",
            content: "Since late 2023, Indonesia has transitioned almost entirely to an E-Visa system. Regulations now require applications to be submitted through official online platforms (Molina or registered agency portals), eliminating the need for physical visits to Indonesian embassies for most nationalities."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="Indonesia Visa Regulations"
            subtitle="The authoritative guide to the legal framework governing entry, stay, and compliance for foreigners in the Republic of Indonesia."
            breadcrumbs={[
                { label: "Regulations", url: `/${locale}/regulations` },
                { label: "Visa Regulations", url: `/${locale}/regulations/indonesia-visa-regulations` }
            ]}
            sections={sections}
            cta={{
                title: "Need legal visa assistance?",
                desc: "Our regulated consultants ensure 100% compliance with current Indonesian immigration laws.",
                buttonText: "Verify Eligibility",
                link: `/${locale}/apply`
            }}
        />
    );
}
