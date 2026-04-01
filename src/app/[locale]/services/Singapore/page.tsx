import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical Strategy: English root always links to /services/Singapore
    const canonicalUrl = isDefaultLocale ? `${APP_URL}/services/Singapore` : `${APP_URL}/${locale}/services/Singapore`;

    return {
        title: "Indonesia Visa for Singapore Citizens 2026: Official Guide",
        description: "Official guide for Singaporeans traveling to Indonesia. e-VoA for tourists, business visa options (B211A), and ferry/flight logistics from SG to Batam and Jakarta.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'x-default': `${APP_URL}/services/Singapore`,
                'en': `${APP_URL}/services/Singapore`,
                'id': `${APP_URL}/id/services/Singapore`
            }
        }
    };
}

export default async function SingaporeHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Services", url: `/${locale}/services` },
        { label: "Singapore Hub", url: `/${locale}/services/Singapore` }
    ];

    const cta = {
        title: "Heading to Batam or Jakarta from SG?",
        desc: "Don't get stuck at the ferry terminal or airport queue. Our 24-hour e-VoA for Singaporeans ensures you can use the Autogates for an instant entry into Indonesia.",
        buttonText: "Get Your Singapore e-VoA",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. The 2026 Entry Rules for Singaporeans",
            content: (
                <div className="space-y-4">
                    <p>Singapore citizens traveling to Indonesia require a valid visa for entry. The most common choice for short-term stays is the <strong>Electronic Visa on Arrival (e-VoA)</strong>. Whether you are arriving for a weekend in Batam or a business meeting in Jakarta, your visa status is now fully digital.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) for Tourist Arrivals",
            content: (
                <div className="space-y-4">
                    <p>The <strong>Electronic Visa on Arrival (e-VoA)</strong> allows Singaporeans to stay for up to 30 days, with the option to extend for another 30 days. Applying online before your trip from Changi or HarbourFront means you can use the <strong>Autogates</strong>.</p>
                </div>
            )
        },
        {
            id: "business",
            title: "3. Business Visits (B211A)",
            content: (
                <div className="space-y-4">
                    <p>For SG-based business meetings or sourcing, the <strong>B211A Business Visa</strong> is the ideal choice. It offers an initial 60-day stay and can be extended twice, providing a total of 180 days in Indonesia.</p>
                </div>
            )
        },
        {
            id: "ferry-logistics",
            title: "4. Ferry Logistics: SG to Batam/Bintan",
            content: (
                <div className="space-y-4">
                    <p>Ferry services from **HarbourFront and Tanah Merah** terminals connect Singapore with Batam and Bintan almost hourly. Secure your e-VoA early to avoid arrival hall queues.</p>
                </div>
            )
        },
        {
            id: "passport",
            title: "5. Passport Validity & Requirements",
            content: (
                <div className="space-y-4">
                    <p>Singaporeans must have at least <strong>6 months of validity</strong> remaining on their passport. Ferry operators and airlines like Scoot/SIA will strictly check this at the SG departure gate.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "6. Direct Flights & Transit",
            content: (
                <div className="space-y-4">
                    <p>Direct flights from Changi to Jakarta and Bali are frequent. Ensure your digital visa is linked to your passport before boarding.</p>
                </div>
            )
        },
        {
            id: "levy",
            title: "7. Bali Tourist Levy (IDR 150,000)",
            content: (
                <div className="space-y-4">
                    <p>Singapore citizens traveling to Bali must pay the IDR 150,000 levy. We recommend paying this through the 'Love Bali' app before you depart SG.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "8. Electronic Customs (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>Complete the <strong>Electronic Customs Declaration (e-CD)</strong> within 72 hours of arrival. You will receive a QR code for instant scanning at baggage exit.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "9. Overstay Fines",
            content: (
                <div className="space-y-4">
                    <p>Overstaying results in a fine of <strong>IDR 1,000,000 per day</strong>. Always monitor your visa expiry date via the IDiv Tracker.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "10. Travel Insurance Advice",
            content: (
                <div className="space-y-4">
                    <p>We strongly advise SG citizens to have comprehensive travel insurance that includes medical evacuation back to Singapore (e.g., MSIG or AXA).</p>
                </div>
            )
        },
        {
            id: "gci-track",
            title: "11. GCI Track for Singaporean Diaspora",
            content: (
                <div className="space-y-4">
                    <p>Former Indonesian citizens now residing in Singapore are highly eligible for the **Global Citizen of Indonesia (GCI)** program, offering unlimited residency and work rights in Indonesia for a lifetime.</p>
                </div>
            )
        },
        {
            id: "tax-residency",
            title: "12. High-Value Tax Residency",
            content: (
                <div className="space-y-4">
                    <p>Singapore-based investors using the GCI or Golden Visa tracks can benefit from specialized Indonesian tax residency regulations, facilitating regional capital flow.</p>
                </div>
            )
        },
        {
            id: "investment",
            title: "13. Direct Investment Channels",
            content: (
                <div className="space-y-4">
                    <p>We facilitate direct investment VISAs for Singaporean entities looking to establish a PT PMA in Jakarta or Bali with 100% foreign ownership.</p>
                </div>
            )
        },
        {
            id: "legacy",
            title: "14. GCI Legacy for Descendants",
            content: (
                <div className="space-y-4">
                    <p>Children of former WNI in Singapore can secure their connection to Indonesia through the GCI 4D track, ensuring they never lose their roots.</p>
                </div>
            )
        },
        {
            id: "why-us",
            title: "15. Why Singaporeans Trust Our Agency",
            content: (
                <div className="space-y-4">
                    <p>We provide clear, honest, and efficient visa services. Our team understands the specific needs of Singaporean travelers and ensures 100% compliance.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. FAQ for Singapore Citizens",
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
            title="Indonesia Visa for Singapore Citizens 2026: Official Guide"
            subtitle="Explore essential e-VoA rules, business visa tracks, and specialized GCI diaspora benefits for Singaporeans."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
