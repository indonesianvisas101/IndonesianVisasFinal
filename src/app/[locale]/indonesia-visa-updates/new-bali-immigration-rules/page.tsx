import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "New Bali Immigration Rules 2026 | Essential Visitor Info | Indonesian Visas",
        description: "Stay compliant with the latest Bali-specific immigration and entry rules for 2026. Tourist levy, e-VoA changes, and local enforcement updates.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/indonesia-visa-updates/new-bali-immigration-rules`,
        },
    };
}

export default async function NewBaliRulesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "enforcement",
            title: "Bali-Specific Immigration Enforcement",
            content: "In 2026, Bali has introduced a more rigorous local enforcement initiative (Satpol PP Pariwisata) to monitor tourist behavior and visa compliance. This includes regular checks at popular expat hubs like Canggu, Seminyak, and Ubud."
        },
        {
            id: "levy",
            title: "Updated Tourist Levy System",
            content: "The Bali Tourist Levy is now strictly enforced. All visitors must pay IDR 150,000 (approx. USD 10) per entry. It is highly recommended to pay this online via the 'Love Bali' portal before landing to avoid delays at the airport."
        },
        {
            id: "customs",
            title: "Electronic Customs Declaration",
            content: "A new unified electronic customs declaration (e-CD) is mandatory for all international arrivals in Bali. This can be filled out 2 days before arrival and generates a QR code that must be scanned at the customs exit."
        },
        {
            id: "voa-payment",
            title: "Visa on Arrival (VoA) Online Payment",
            content: "Bali now prioritizes e-VoA holders. While payment counters still exist at Ngurah Rai airport, e-VoA users have access to dedicated gates and automated immigration lanes, reducing wait times from 60 minutes to less than 15 minutes."
        },
        {
            id: "behavior",
            title: "Behavior and Cultural Compliance",
            content: "Immigration has reiterated that visa revocation and deportation are the primary penalties for disrespecting local sacred sites (Temples) or violating Balinese customary laws (Awig-awig). New signage and digital briefings are provided upon visa approval."
        },
        {
            id: "zoning",
            title: "Restricted Residential Zones for Foreigners",
            content: "Local authorities are implementing new zoning regulations to balance tourism growth with residential peace. Foreigners staying on long-term visas are encouraged to check if their accommodation has the correct NIB and permit for residential stays."
        },
        {
            id: "registration",
            title: "Work-from-Bali (Remote Worker) Registration",
            content: "If you are residing in Bali on a Remote Worker Visa (E33G), you are now required to register your local domicile address with the Banjar (local community council) within 30 days of arrival."
        },
        {
            id: "extensions",
            title: "Simplified Extension for Bali Visitors",
            content: "A new 'Bali Fast-Track' system allows for fully digital extensions of B211A visas if the initial application was sponsored by a Bali-based legal agency. This removes the need for multiple trips to the immigration office."
        },
        {
            id: "satellite-offices",
            title: "Immigration Operations in Sanur and North Bali",
            content: "New satellite immigration service points have opened in Sanur and Lovina to alleviate pressure on the Jimbaran and Denpasar offices, making it easier for visitors in those areas to handle simple administrative tasks."
        },
        {
            id: "conclusion",
            title: "Conclusion for Bali Travelers",
            content: "Preparation is key. Ensure all fees are paid, QR codes are saved, and your local sponsor is reachable. Bali remains welcoming, but the move toward a 'Quality Tourism' model means compliance is viewed with higher priority than in previous years."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="New Bali Immigration Rules 2026"
            subtitle="Essential information for every traveler arriving on the Island of the Gods."
            breadcrumbs={[
                { label: "Updates Hub", url: `/${locale}/indonesia-visa-updates` },
                { label: "Bali Rules", url: `/${locale}/indonesia-visa-updates/new-bali-immigration-rules` }
            ]}
            sections={sections}
            cta={{
                title: "Need help staying compliant in Bali?",
                desc: "Our Bali-based team handles all local registrations and visa extensions for you.",
                buttonText: "Bali Support",
                link: `/${locale}/apply`
            }}
        />
    );
}
