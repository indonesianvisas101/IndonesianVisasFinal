import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Immigration Law References | Official Legal Citations",
        description: "Official legal references for Indonesian immigration. Detailed citations of Law No. 6 of 2011, Government Regulation No. 31 of 2013, and recent ministerial decrees.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/regulations/immigration-law-references`,
        },
    };
}

export default async function ImmigrationLawReferencesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "primary-law",
            title: "Law No. 6 of 2011 on Immigration",
            content: "This is the foundational law for all immigration matters in Indonesia. It defines the sovereignty of the state, the functions of immigration (service, security, and law enforcement), and the basic rights and obligations of foreign nationals within Indonesian territory."
        },
        {
            id: "regulation-31-2013",
            title: "Government Regulation No. 31 of 2013",
            content: "This implementing regulation provide specific details on the execution of Law No. 6 of 2011. It covers the technicalities of visa issuance, stay permit extensions, and the specific duties of immigration officers at various entry points (TPI)."
        },
        {
            id: "permenkumham-2024",
            title: "Ministerial Regulation (Permenkumham) No. 11 of 2024",
            content: "One of the most critical recent updates, this regulation introduces the 'Golden Visa' and other high-priority visa types. It specifies the investment thresholds and requirements for long-term residency permits based on economic contribution."
        },
        {
            id: "article-63",
            title: "Article 63: Corporate Sponsorship",
            content: "Law No. 6 of 2011, Article 63, mandates that every foreigner staying in Indonesia must have a sponsor who is responsible for their presence and activities. Indonesian Visas Agency acts as a legally registered sponsor under this exact article."
        },
        {
            id: "administrative-sanctions",
            title: "Chapter IX: Administrative Sanctions",
            content: "Articles 75 to 78 define the authority of immigration officers to take administrative actions, including deportation, detention, and inclusion in the 'Prevention and Deterrence' list (Pencegahan dan Penangkalan)."
        },
        {
            id: "official-sources",
            title: "Accessing Official Gazettes",
            content: "All official laws and regulations (Lembaran Negara) are publicly accessible through the Indonesian National Legal Documentation and Information Network (JDIH). Our advisors ensure all documentation provided to clients aligns with the latest JDIH updates."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="Immigration Law References"
            subtitle="A technical directory of the specific laws, government regulations, and ministerial decrees that form the basis of Indonesian immigration policy."
            breadcrumbs={[
                { label: "Regulations", url: `/${locale}/regulations` },
                { label: "Law References", url: `/${locale}/regulations/immigration-law-references` }
            ]}
            sections={sections}
            cta={{
                title: "Need a legal review of your case?",
                desc: "Our legal team specializes in navigating the complexities of Law No. 6 of 2011 for complex residency cases.",
                buttonText: "Consult Legal Expert",
                link: `/${locale}/apply`
            }}
        />
    );
}
