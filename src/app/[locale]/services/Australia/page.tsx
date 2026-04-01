import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical Strategy: English root always links to /services/Australia
    const canonicalUrl = isDefaultLocale ? `${APP_URL}/services/Australia` : `${APP_URL}/${locale}/services/Australia`;

    return {
        title: "Indonesia Visa for Australians 2026: Official Requirements & Bali Travel Guide",
        description: "Comprehensive guide for Australian citizens traveling to Indonesia. e-VoA at Bali airport, IA-CEPA investment context, Digital Nomad tracks, and KITAS rules for Aussies.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'x-default': `${APP_URL}/services/Australia`,
                'en': `${APP_URL}/services/Australia`,
                'id': `${APP_URL}/id/services/Australia`
            }
        }
    };
}

export default async function AustraliaHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Services", url: `/${locale}/services` },
        { label: "Australia Hub", url: `/${locale}/services/Australia` }
    ];

    const cta = {
        title: "Flying from Sydney or Melbourne?",
        desc: "Don't get stuck in the VoA queue at Ngurah Rai. Our agency processes your e-VoA in under 24 hours so you can use the Autogates and start your holiday instantly.",
        buttonText: "Get Your e-VoA Now",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. The 2026 Visa Landscape for Australians",
            content: (
                <div className="space-y-4">
                    <p>Since the suspension of visa-free travel, <strong>Australian citizens must possess a valid visa</strong> to enter Indonesia. Whether you are flying Jetstar from Darwin or Qantas from Sydney, your entry requirements are now fully digital. The B1 (Tourist) and B2 (Business) visas are the most common entry points for the 1.5 million Australians who visit the archipelago annually.</p>
                </div>
            )
        },
        {
            id: "bilateral",
            title: "2. IA-CEPA & Bilateral Advantages",
            content: (
                <div className="space-y-4">
                    <p>The <strong>Indonesia-Australia Comprehensive Economic Partnership Agreement (IA-CEPA)</strong> has revolutionized how Australians can interact with the Indonesian economy. This bilateral treaty provides specific advantages for Australian investors and professionals, including easier pathways for intra-corporate transferees and contractual service providers entering Indonesia.</p>
                    <p>As an Australian citizen, you benefit from a "priority status" in the eyes of Indonesian Immigration, making you eligible for almost every streamlined visa tier.</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "3. e-VoA (B1) for Tourist Arrivals",
            content: (
                <div className="space-y-4">
                    <p>The <strong>Electronic Visa on Arrival (e-VoA)</strong> is the gold standard for Australian holidaymakers. This 30-day visa (extendable to 60 days) is applied for online before you leave Australia. The primary benefit for Aussies? Access to the <strong>digital Autogates</strong> at Denpasar (DPS) and Jakarta (CGK) airports, allowing you to bypass manual immigration counters entirely.</p>
                    <Link href={`/${locale}/apply`} className="text-primary font-bold hover:underline flex items-center gap-1">
                        Apply for Aussie e-VoA here <ArrowRight size={14} />
                    </Link>
                </div>
            )
        },
        {
            id: "digital-nomad",
            title: "4. The Australian Digital Nomad Cluster",
            content: (
                <div className="space-y-4">
                    <p>Thousands of Australians from the tech and creative sectors now base themselves in Uluwatu, Canggu, and Ubud. If you intend to work remotely for an Australian company while living in Bali, the <strong>B211A (Visit Visa)</strong> is currently the preferred legal track. It allows for a total of 180 days (6 months) within the country.</p>
                    <Link href={`/${locale}/services/Australia/digital-nomad`} className="text-primary font-bold hover:underline">
                        Read our deep-dive on Digital Nomads for Australians →
                    </Link>
                </div>
            )
        },
        {
            id: "investment",
            title: "5. Property & Business Investment (PT PMA)",
            content: (
                <div className="space-y-4">
                    <p>Under IA-CEPA, Australians can own up to 100% of companies in several Indonesian sectors. Many Aussies utilize the <strong>Investor KITAS (Index E31A/E31B)</strong> to establish villas, cafes, or logistics companies. Our legal team specializes in "Aussie-owned" PT PMAs, ensuring your investment is fully compliant with the latest Omnisbus Law revisions.</p>
                </div>
            )
        },
        {
            id: "retirement",
            title: "6. Retirement in the Tropics (E33E)",
            content: (
                <div className="space-y-4">
                    <p>Western Australia and Queensland retirees are increasingly choosing Bali for its lowered cost of living and high-quality private healthcare. The **Retirement KITAS (E33E)** is available to Australians aged 60 and over. It provides a path to permanent residency (KITAP) after several years of consecutive holding.</p>
                </div>
            )
        },
        {
            id: "child-pages",
            title: "7. Specialized Australian Resources",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href={`/${locale}/services/Australia/travel-indonesia`} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 hover:border-primary transition-colors">
                        <h4 className="font-bold mode-aware-text">Travel Tips for Bali</h4>
                        <p className="text-sm opacity-70">Aussie insurance traps and health prep.</p>
                    </Link>
                    <Link href={`/${locale}/services/Australia/kitas-indonesia`} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 hover:border-primary transition-colors">
                        <h4 className="font-bold mode-aware-text">KITAS Residency Guide</h4>
                        <p className="text-sm opacity-70">Long-term living for Australian families.</p>
                    </Link>
                    <Link href={`/${locale}/services/Australia/indonesia-citizenship`} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 hover:border-primary transition-colors">
                        <h4 className="font-bold mode-aware-text">Naturalization Info</h4>
                        <p className="text-sm opacity-70">Pathway to Indonesian Citizenship.</p>
                    </Link>
                </div>
            )
        },
        {
            id: "validity",
            title: "8. The '6-Month Passport' validity Trap",
            content: (
                <div className="space-y-4">
                    <p>This is the most common reason Australians are denied boarding at Sydney or Perth airports. Your Australian passport <strong>must have at least 6 months validity</strong> from your date of arrival in Indonesia. Even if it expires in 5 months and 28 days, Qantas/Jetstar staff are legally obligated to deny you boarding, and Indonesian Immigration will deport you upon arrival.</p>
                </div>
            )
        },
        {
            id: "levy",
            title: "9. Bali's New Tourist Levy (IDR 150,000)",
            content: (
                <div className="space-y-4">
                    <p>Effective 2024, every Australian citizen entering Bali must pay a mandatory one-time **Tourist Levy** of IDR 150,000 (approx. $15 AUD). This is a separate payment from your visa. We recommend paying this through the <em>Love Bali</em> portal before you land to avoid queues.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "10. Electronic Customs Declaration (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>No more paper forms. Australians must fill out the **e-CD** within 72 hours of arrival. You will receive a QR code which will be scanned after you collect your luggage from the carousel.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "11. The 1 Million IDR Overstay Fine",
            content: (
                <div className="space-y-4">
                    <p>Forgot to check your visa expiry? Indonesia charges an administrative fine of <strong>IDR 1,000,000 per day</strong> (~$100 AUD) for overstays under 60 days. If you overstay by more than 60 days, you face detention and a minimum 6-month ban from entering Indonesia.</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "12. Travel Insurance & Scooter Endorsements",
            content: (
                <div className="space-y-4">
                    <p>Most Australian insurance policies (e.g., Cover-More, Southern Cross) require you to have an **Australian Motorcycle License** to be covered for scooter accidents in Bali. An International Driving Permit (IDP) alone is often insufficient if you don't hold the underlying class of license at home.</p>
                </div>
            )
        },
        {
            id: "culture",
            title: "13. Respecting Traditions (The Bali Do's & Don'ts)",
            content: (
                <div className="space-y-4">
                    <p>Bali is a deeply spiritual island. Always wear a sarong when entering temples, avoid climbing sacred trees (which has led to deportations for several Australians), and never use your left hand to give or receive items, as it is considered disrespectful.</p>
                </div>
            )
        },
        {
            id: "safety",
            title: "14. Health & Safety (Bali Belly prevention)",
            content: (
                <div className="space-y-4">
                    <p>Aussies are famous for "Bali Belly." We recommend drinking only bottled water, avoiding ice in rural areas, and perhaps carrying a course of Travelan or charcoal tablets. Most private hospitals in Bali (like BIMC) accept major Australian travel insurance directly.</p>
                </div>
            )
        },
        {
            id: "why-us",
            title: "15. Why Aussies Trust Indonesian Visas Agency",
            content: (
                <div className="space-y-4">
                    <p>We are a registered PT PMA agency with a dedicated team speaking both fluent English and Indonesian. We have successfully processed over <strong>10,000+ visas for Australian families and businesses</strong>. Our presence in both Bali and Jakarta ensures that if laws change while you're in the air, we're the first to know and handle your situation.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. FAQ for Australian Travelers",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I apply for a visa at Denpasar airport?</h4>
                        <p className="text-sm opacity-80">Yes, you can get a physical VoA sticker, but you will have to wait in the 'Payment' queue and then the 'Immigration' queue. e-VoA users skip both and use the Autogates.</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can an Australian stay longer than 60 days on a tourist visa?</h4>
                        <p className="text-sm opacity-80">Not on a standard VoA. You would need to leave and re-enter, or apply for a B211A visa which allows for up to 180 days.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa for Australians 2026: Official Requirements & Bali Travel Guide"
            subtitle="Navigate the latest e-VoA rules, IA-CEPA investment perks, and Bali's digital gate system specially designed for Sydney, Perth, and Melbourne travelers."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}

function ArrowRight({ size }: { size: number }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M5 12h14m-7-7 7 7-7 7"/>
        </svg>
    );
}
