import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical Strategy: English root always links to /services/Canada
    const canonicalUrl = isDefaultLocale ? `${APP_URL}/services/Canada` : `${APP_URL}/${locale}/services/Canada`;

    return {
        title: "Indonesia Visa for Canadian Citizens 2026: Official Hub & GCI",
        description: "Comprehensive guide for Canadians traveling to or residing in Indonesia. Official e-VoA for tourists, Digital Nomad tracks, and the GCI diaspora program for former residents.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'x-default': `${APP_URL}/services/Canada`,
                'en': `${APP_URL}/services/Canada`,
                'id': `${APP_URL}/id/services/Canada`
            }
        }
    };
}

export default async function CanadaHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Services", url: `/${locale}/services` },
        { label: "Canada Hub", url: `/${locale}/services/Canada` }
    ];

    const cta = {
        title: "Traveling from Vancouver or Toronto?",
        desc: "Don't let the distance add to your stress. Our official agency handles Canadian visa processing in under 24 hours so you can enjoy the Bali sun immediately.",
        buttonText: "Start My Canadian Application",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. The 2026 Entry Rules for Canadians",
            content: (
                <div className="space-y-4">
                    <p>Canadian citizens entering Indonesia in 2026 require a valid visa. The entry process is fully digitized for 2026. Whether you're visiting for recreation or setting up a long-term base, our legal lab ensures your official entry is secured with maximum security.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) for Canadian Tourists",
            content: (
                <div className="space-y-4">
                    <p>The **Electronic Visa on Arrival (e-VoA)** is valid for 30 days and extendable once for another 30 days. For Canadians, this provides direct access to the **Autogates** at major airports like Jakarta (CGK) and Bali (DPS).</p>
                </div>
            )
        },
        {
            id: "gci-track",
            title: "3. GCI Track for Diaspora in Canada",
            content: (
                <div className="space-y-4">
                    <p>For former Indonesian citizens living in Canada (Toronto, Vancouver, Montreal), the **Global Citizen of Indonesia (GCI)** track offers lifetime residency and full work/ownership rights in Indonesia.</p>
                </div>
            )
        },
        {
            id: "business",
            title: "4. Business & Investment (B211A)",
            content: (
                <div className="space-y-4">
                    <p>Canadian investors and consultants can utilize the **B211A Business Visa** for stays up to 180 days. We provide the mandatory PT PMA sponsorship to ensure your business activities are fully compliant.</p>
                </div>
            )
        },
        {
            id: "passport",
            title: "5. Canadian Passport Requirements",
            content: (
                <div className="space-y-4">
                    <p>Your Canadian passport **must have at least 6 months validity** from your arrival date. Air Canada, WestJet, and partner airlines will strictly enforce this at the departure gate.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "6. Flight Logistics from Canada",
            content: (
                <div className="space-y-4">
                    <p>Most Canadians fly via **Tokyo (ANA/JAL), Seoul (KE), Taipei (EVA), or Hong Kong (CX)**. Ensure your e-visa is linked to your passport before your final leg to Bali or Jakarta.</p>
                </div>
            )
        },
        {
            id: "bali-levy",
            title: "7. Bali Tourist Levy (IDR 150,000)",
            content: (
                <div className="space-y-4">
                    <p>All Canadian citizens visiting Bali must pay a mandatory levy of 150,000 IDR. We recommend paying this through the 'Love Bali' app prior to your departure from Canada.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "8. Electronic Customs (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>Complete the **Electronic Customs Declaration (e-CD)** 72 hours before arrival. You will receive a QR code for a rapid baggage exit upon landing.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "9. Overstay Fines for Canadians",
            content: (
                <div className="space-y-4">
                    <p>Overstaying attracts a fine of **IDR 1,000,000 per day (~$90 CAD)**. Avoid fines and potential bans by monitoring your visa status in our tracking portal.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "10. Health & Travel Insurance",
            content: (
                <div className="space-y-4">
                    <p>It is strongly advised to have comprehensive travel insurance. Most Canadian provincial health plans (e.g. OHIP, BC MSP) do not cover medical costs in Indonesia.</p>
                </div>
            )
        },
        {
            id: "climate",
            title: "11. Cold-to-Tropical Lifestyle",
            content: (
                <div className="space-y-4">
                    <p>Many Canadians choose Bali to escape the northern winter. The **B211A Visit Visa** is the most popular choice for "snowbirds" looking to stay for up to 6 months.</p>
                </div>
            )
        },
        {
            id: "retirement",
            title: "12. Retirement Excellence (E33E)",
            content: (
                <div className="space-y-4">
                    <p>For Canadians aged 60+, the **Retirement KITAS (E33E)** offers a premium residency option. We handle all logistics and sponsorship for your relocation to the archipelago.</p>
                </div>
            )
        },
        {
            id: "digital-nomad",
            title: "13. Digital Nomad Track (Remote Work)",
            content: (
                <div className="space-y-4">
                    <p>Bali is a top hub for Canadian remote workers and tech entrepreneurs. We assist in securing your residency so you can work legally for your Canadian clients while living the island life.</p>
                </div>
            )
        },
        {
            id: "investment",
            title: "14. PT PMA Property Investment",
            content: (
                <div className="space-y-4">
                    <p>Canadian individuals can secure property investments through a **PT PMA (Foreign Owned Company)** structure. Our legal team provides full registration and compliance services.</p>
                </div>
            )
        },
        {
            id: "why-us",
            title: "15. Why Canadian Travelers Trust Us",
            content: (
                <div className="space-y-4">
                    <p>As a registered PT PMA agency with a physical presence in both Bali and Jakarta, we provide 100% security for your Canadian-origin documents and visa applications.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. FAQ for Canadian Citizens",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I extend my e-VoA online?</h4>
                        <p className="text-sm opacity-80">Yes, the 30-day e-VoA can be extended for an additional 30 days via the official portal or through our concierge service.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa for Canadian Citizens 2026: Official Hub"
            subtitle="Explore essential e-VoA rules, GCI diaspora benefits, and retirement solutions specially for Canadian travelers."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
