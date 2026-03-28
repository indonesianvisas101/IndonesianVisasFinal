import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa for Singapore Citizens 2026: Official Guide",
        description: "Official guide for Singaporeans traveling to Indonesia. e-VoA for tourists, business visa options (B211A), and ferry/flight logistics from SG to Batam and Jakarta.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/singapore`,
        }
    };
}

export default async function SingaporeHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Regional Guides", url: `/${locale}/list-country` },
        { label: "Singapore Guide", url: `/${locale}/singapore` }
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
                    <p>Singapore citizens traveling to Indonesia require a valid visa for entry. The most common choice for short-term stays is the <strong>Electronic Visa on Arrival (e-VoA)</strong>. Whether you are arriving for a weekend in Batam or a business meeting in Jakarta, your visa status is now fully digital and managed via the official immigration portal.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) for Tourist Arrivals",
            content: (
                <div className="space-y-4">
                    <p>The <strong>Electronic Visa on Arrival (e-VoA)</strong> allows Singaporeans to stay for up to 30 days, with the option to extend for another 30 days while in the country. Applying online before your trip from Singapore means you can use the <strong>Autogates</strong> at Batam Ferry Terminal, Denpasar (DPS) and Jakarta (CGK) airports, bypassing the manual immigration counters.</p>
                    <Link href={`/${locale}/apply`} className="text-primary font-bold hover:underline">
                        Apply for Singapore e-VoA →
                    </Link>
                </div>
            )
        },
        {
            id: "business",
            title: "3. Business Visits (B211A)",
            content: (
                <div className="space-y-4">
                    <p>For Singaporeans visiting for business meetings, seminars, or sourcing, the <strong>B211A Business Visa</strong> is the ideal choice. It offers an initial 60-day stay and can be extended twice, providing a total of 180 days in Indonesia. This is a non-working visa, meaning you cannot receive a salary from an Indonesian entity.</p>
                </div>
            )
        },
        {
            id: "ferry-logistics",
            title: "4. Ferry Logistics: SG to Batam/Bintan",
            content: (
                <div className="space-y-4">
                    <p>Ferry services from **HarbourFront and Tanah Merah** terminals connect Singapore with Batam and Bintan almost hourly. Ensure you have your e-VoA ready to show when you check in at the ferry terminal to avoid delays at the Indonesian immigration arrival hall.</p>
                </div>
            )
        },
        {
            id: "passport",
            title: "5. Passport Validity & Requirements",
            content: (
                <div className="space-y-4">
                    <p>Like all international travelers, Singaporeans must have at least <strong>6 months of validity</strong> remaining on their passport from the day they enter Indonesia. Airlines like SIA and Scoot, as well as ferry operators, will strictly enforce this at the check-in counter. Ensure you have at least one blank page for your entry stamp.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "6. Direct Flights & Transit",
            content: (
                <div className="space-y-4">
                    <p>Direct flights from **Changi to Jakarta, Surabaya, and Bali** are frequent, with multiple flights daily. If you are transiting through Singapore to other Indonesian cities, ensure you have your e-VoA ready for your final destination immigration clearance.</p>
                </div>
            )
        },
        {
            id: "levy",
            title: "7. Bali Tourist Levy (IDR 150,000)",
            content: (
                <div className="space-y-4">
                    <p>Singapore citizens traveling to Bali must pay the <strong>Bali Tourist Levy</strong> of IDR 150,000 (approx. $15 SGD) upon arrival in Bali. This is separate from your visa fee. We recommend paying this through the 'Love Bali' app before you depart Singapore to save time at the airport.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "8. Electronic Customs (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>The paper customs forms are a thing of the past. Singaporeans must complete the <strong>Electronic Customs Declaration (e-CD)</strong> within 72 hours of arrival. You will receive a QR code that must be scanned after you collect your luggage at the arrivals hall.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "9. Overstay Fines & Regulations",
            content: (
                <div className="space-y-4">
                    <p>Indonesia takes visa expiry dates seriously. Overstaying your visa will result in a fine of <strong>IDR 1,000,000 per day</strong> (~$100 SGD). If you overstay by more than 60 days, you face detention, deportation, and a potential ban from entering the country for several years.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "10. Travel Insurance for Singaporeans",
            content: (
                <div className="space-y-4">
                    <p>Medical costs in Indonesia can be high for foreigners. We strongly advise Singaporeans to have comprehensive travel insurance (e.g., MSIG or AXA) that includes <strong>medical evacuation back to Singapore</strong> in case of serious illness or injury.</p>
                </div>
            )
        },
        {
            id: "why-us",
            title: "11. Why Singaporeans Trust Our Agency",
            content: (
                <div className="space-y-4">
                    <p>We pride ourselves on providing clear, honest, and efficient visa services for the Singapore community. Our team understands the specific needs of Singaporean travelers, from business executives to weekend holidaymakers, and ensures your legal status in Indonesia is always 100% compliant.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "12. FAQ for Singapore Citizens",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I extend my e-VoA online?</h4>
                        <p className="text-sm opacity-80">Yes, the 30-day e-VoA can be extended for an additional 30 days via the official portal. We can assist with this process if you find the government system difficult to navigate.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa for Singapore Citizens 2026: Official Guide"
            subtitle="Explore essential e-VoA rules, business visa tracks, and travel tips from Singapore to Batam and Jakarta."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
