import React from "react";
import SEOPageLayout from "@/components/layout/SEOPageLayout";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Digital Nomad Visa News 2026 | Remote Work Guide | Indonesian Visas",
        description: "The latest news and guide for the Indonesia Digital Nomad Visa (E33G). Discover how to live in Bali legally while working for global companies.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/indonesia-visa-updates/indonesia-digital-nomad-visa-news`,
        },
    };
}

export default async function DigitalNomadNewsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const sections = [
        {
            id: "rise-of-e33g",
            title: "The Rise of the E33G Remote Worker Visa",
            content: "Indonesia has officially solidified the E33G Index as the primary pathway for digital nomads. This visa replaces the previous ambiguity of using B211A 'business' visas for remote work, providing a secure, 1-year residency permit."
        },
        {
            id: "income-reqs",
            title: "2026 Income Requirements",
            content: "To qualify for the E33G, applicants must demonstrate a minimum annual income of USD 60,000 derived from companies or clients located outside of Indonesia. This ensures that nomad residency contributes to the local economy without competing for local jobs."
        },
        {
            id: "tax-residency",
            title: "Tax Residency and Exemptions",
            content: "One of the most significant updates for 2026 is the clarification on tax. E33G holders are generally considered non-tax residents if their income is 100% offshore, allowing them to live in premium hubs like Bali without the burden of global double taxation."
        },
        {
            id: "coworking",
            title: "Co-working Hub Integration",
            content: "The Indonesian Ministry of Tourism is partnering with major co-working spaces in Bali (Uluwatu, Canggu) and Lombok to offer 'Nomad Packages' which include workspace access and simplified local registration for E33G holders."
        },
        {
            id: "family",
            title: "Family Inclusion and Dependents",
            content: "Nomads can now easily bring their families. Dependent permits (C317) can be processed concurrently with the E33G, allowing spouses and children to reside in Indonesia for the same duration as the primary remote worker."
        },
        {
            id: "application",
            title: "Streamlined Digital Application",
            content: "The entire E33G process is now 100% digital. From initial document submission to the issuance of the e-Visa, most nomads receive their approval within 7-10 business days without needing to visit an embassy."
        },
        {
            id: "renewal",
            title: "Renewal and Path to 5 Years",
            content: "While the initial permit is for 1 year, nomads can renew their status onshore. After 5 consecutive years of E33G holding, options for long-term residency under the 'Second Home' category becomes a viable future pathway."
        },
        {
            id: "corridor",
            title: "The Bali-Lombok Corridor",
            content: "New fast-ferry and regional flight subsidies for digital nomads are being discussed to encourage remote workers to explore islands beyond Bali, particularly in the growing tech-hubs of South Lombok (Kuta)."
        },
        {
            id: "networking",
            title: "Community and Networking Events",
            content: "As part of the visa's value-add, the government is hosting monthly 'Nomad Networking Nights' in Bali, facilitating connections between international talent and local Indonesian entrepreneurs to foster knowledge transfer."
        },
        {
            id: "verdict",
            title: "Final Verdict: Is it worth it?",
            content: "For high-earning remote professionals, the E33G is the most stable and legal way to enjoy the Indonesian lifestyle. The clarity on tax and the simplicity of the digital application make 2026 the best year yet to relocate to Indonesia."
        }
    ];

    return (
        <SEOPageLayout
            locale={locale}
            title="Indonesia Digital Nomad Visa News"
            subtitle="Unlock the legal pathway to living and working in paradise."
            breadcrumbs={[
                { label: "Updates Hub", url: `/${locale}/indonesia-visa-updates` },
                { label: "Digital Nomad News", url: `/${locale}/indonesia-visa-updates/indonesia-digital-nomad-visa-news` }
            ]}
            sections={sections}
            cta={{
                title: "Ready to go remote in Bali?",
                desc: "Book a consultation with our specialized Remote Work visa team.",
                buttonText: "E33G Consultation",
                link: `/${locale}/apply`
            }}
        />
    );
}
