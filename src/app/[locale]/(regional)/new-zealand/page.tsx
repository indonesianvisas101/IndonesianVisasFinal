import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa for New Zealand Citizens 2026: Official Guide",
        description: "Official entry requirements for New Zealanders traveling to Indonesia. e-VoA for tourists, business visa options (B211A), and Kiwi-specific travel prep.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/new-zealand`,
        }
    };
}

export default async function NewZealandHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Regional Guides", url: `/${locale}/list-country` },
        { label: "New Zealand Guide", url: `/${locale}/new-zealand` }
    ];

    const cta = {
        title: "Flying from Auckland or Christchurch?",
        desc: "Don't queue at Bali arrivals. Our 24-hour e-VoA processing for New Zealanders gets you through the digital gates and onto the beach faster.",
        buttonText: "Get Your Kiwi e-VoA",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. The 2026 Entry Rules for Kiwis",
            content: (
                <div className="space-y-4">
                    <p>New Zealand citizens traveling to Indonesia require a valid visa for entry. The most common choice for short-term stays is the <strong>Electronic Visa on Arrival (e-VoA)</strong>. Whether you are arriving for a surf trip in Mentawai or a business meeting in Jakarta, your visa status is now fully digital and managed via the official immigration portal.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) for Tourist Arrivals",
            content: (
                <div className="space-y-4">
                    <p>The <strong>Electronic Visa on Arrival (e-VoA)</strong> allows New Zealanders to stay for up to 30 days, with the option to extend for another 30 days while in the country. Applying online before your flight from Auckland means you can use the <strong>Autogates</strong> at Denpasar (DPS) and Jakarta (CGK) airports, bypassing the manual immigration counters.</p>
                    <Link href={`/${locale}/apply`} className="text-primary font-bold hover:underline">
                        Apply for New Zealand e-VoA →
                    </Link>
                </div>
            )
        },
        {
            id: "business",
            title: "3. Business Visits (B211A)",
            content: (
                <div className="space-y-4">
                    <p>For New Zealanders visiting for business meetings, seminars, or sourcing, the <strong>B211A Business Visa</strong> is the ideal choice. It offers an initial 60-day stay and can be extended twice, providing a total of 180 days in Indonesia. This is a non-working visa, meaning you cannot receive a salary from an Indonesian entity.</p>
                </div>
            )
        },
        {
            id: "retirement",
            title: "4. Retirement in Bali for New Zealanders",
            content: (
                <div className="space-y-4">
                    <p>The <strong>Retirement KITAS (E33E)</strong> is available for Kiwi citizens aged 60 and above. It provides a path to long-term residency (1-2 years per term) and eventually permanent residency (KITAP). This allows you to enjoy the tropical lifestyle of Bali or Lombok while maintaining your New Zealand citizenship.</p>
                </div>
            )
        },
        {
            id: "passport",
            title: "5. Passport Validity & Requirements",
            content: (
                <div className="space-y-4">
                    <p>Like all international travelers, Kiwis must have at least <strong>6 months of validity</strong> remaining on their passport from the day they enter Indonesia. Airlines like Air New Zealand and Jetstar will strictly enforce this at the check-in counter. Ensure you have at least one blank page for your entry stamp.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "6. Direct Flights & Transit",
            content: (
                <div className="space-y-4">
                    <p>Direct flights from **Auckland to Denpasar** are seasonal, often handled by Air New Zealand. Many Kiwis also transit through Australia (Sydney/Melbourne) or Singapore. If transiting, ensure you have your e-VoA ready to show at your final boarding gate.</p>
                </div>
            )
        },
        {
            id: "levy",
            title: "7. Bali Tourist Levy (IDR 150,000)",
            content: (
                <div className="space-y-4">
                    <p>New Zealand citizens must pay the <strong>Bali Tourist Levy</strong> of IDR 150,000 (approx. $15 NZD) upon arrival in Bali. This is separate from your visa fee. We recommend paying this through the 'Love Bali' app before you depart Auckland to save time at the airport.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "8. Electronic Customs (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>The paper customs forms are a thing of the past. New Zealanders must complete the <strong>Electronic Customs Declaration (e-CD)</strong> within 72 hours of arrival. You will receive a QR code that must be scanned after you collect your luggage at the arrivals hall.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "9. Overstay Fines & Regulations",
            content: (
                <div className="space-y-4">
                    <p>Indonesia takes visa expiry dates seriously. Overstaying your visa will result in a fine of <strong>IDR 1,000,000 per day</strong> (~$100 NZD). If you overstay by more than 60 days, you face detention, deportation, and a potential ban from entering the country for several years.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "10. Travel Insurance for Kiwis",
            content: (
                <div className="space-y-4">
                    <p>Medical costs in Indonesia can be high for foreigners. We strongly advise New Zealanders to have comprehensive travel insurance (e.g., Southern Cross or Allianz) that includes <strong>medical evacuation back to NZ</strong> in case of serious illness or injury.</p>
                </div>
            )
        },
        {
            id: "why-us",
            title: "11. Why Kiwis Trust Our Agency",
            content: (
                <div className="space-y-4">
                    <p>We pride ourselves on providing clear, honest, and efficient visa services for the New Zealand community. Our team understands the specific needs of Kiwi travelers, from surfers to retirees, and ensures your legal status in Indonesia is always 100% compliant.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "12. FAQ for Kiwi Citizens",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I extend my e-VoA online?</h4>
                        <p className="text-sm opacity-80">Yes, the 30-day e-VoA can be extended for an additional 30 days via the official portal. We can assist with this process if you find the government system difficult to navigate.</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Do I need a visa if I'm just transiting through Jakarta?</h4>
                        <p className="text-sm opacity-80">If you are transiting through Jakarta to an international destination and staying within the transit hall, you generally do not need a visa. However, if you need to clear immigration to collect bags or change terminals, you will need a VoA.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa for New Zealand Citizens 2026: Official Guide"
            subtitle="Explore essential e-VoA rules, business visa tracks, and travel tips from Auckland to Bali for New Zealanders."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
