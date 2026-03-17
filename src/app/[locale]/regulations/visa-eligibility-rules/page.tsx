import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Eligibility Rules | Official Entry Criteria",
        description: "Official eligibility rules for Indonesian visas. Detailed guide on requirements, restrictions, and prohibited activities for foreign nationals in 2026.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/regulations/visa-eligibility-rules`,
        },
    };
}

export default async function VisaEligibilityRulesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "passport-requirements",
            title: "Passport & Identity Rules",
            content: "Every foreigner entering Indonesia must possess a valid passport with at least 6 months of remaining validity for standard entry. For KITAS/KITAP applications, this requirement is often extended to 18-30 months depending on the specific residency permit sought."
        },
        {
            id: "financial-stability",
            title: "Proof of Financial Stability",
            content: "Eligibility rules mandate that applicants must demonstrate sufficient funds for their stay. For standard Visit Visas, this is typically USD 2,000 in a personal bank account. High-priority categories like the 'Golden Visa' require significantly higher investment or deposit amounts."
        },
        {
            id: "good-conduct",
            title: "Good Conduct & Legal Standing",
            content: "Applicants must not be on the international 'wanted' lists or have a criminal record that would pose a threat to Indonesian society. Certain visa types require a 'Police Record Check' (SKCK) or an equivalent document from the applicant's home country."
        },
        {
            id: "prohibited-activities",
            title: "Strictly Prohibited Activities",
            content: "A major rule of eligibility is the 'Purpose of Visit' compliance. Foreigners on tourist or family visas are strictly prohibited from engaging in any form of employment or paid work. Violators face immediate deportation and entry bans ('Prekal' list)."
        },
        {
            id: "exclusion-list",
            title: "The Exclusion List (Prekal)",
            content: "Eligibility is automatically denied to individuals who have previously violated Indonesian immigration laws, those with unpaid overstay fines, or individuals who are currently under a 'Deportation Order'. Being on the Prekal list remains a permanent bar to entry unless a formal appeal is successful."
        },
        {
            id: "health-protocols",
            title: "Health & Vaccination Protocols",
            content: "While many pandemic-era restrictions have been lifted, eligibility may still depend on the submission of certain health declarations or proof of insurance covering medical costs in Indonesia, as specified by current Ministry of Health guidelines."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="Visa Eligibility Rules"
            subtitle="Understand the mandatory requirements, financial thresholds, and legal criteria that determine your eligibility for an Indonesian visa or stay permit."
            breadcrumbs={[
                { label: "Regulations", url: `/${locale}/regulations` },
                { label: "Eligibility Rules", url: `/${locale}/regulations/visa-eligibility-rules` }
            ]}
            sections={sections}
            cta={{
                title: "Not sure if you qualify?",
                desc: "Get an instant eligibility assessment from our senior legal consultants before you apply.",
                buttonText: "Request Review",
                link: `/${locale}/apply`
            }}
        />
    );
}
