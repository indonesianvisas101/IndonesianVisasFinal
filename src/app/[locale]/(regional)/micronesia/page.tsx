import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa for Micronesia (FSM) Citizens 2026: Official Guide",
        description: "Official entry requirements for citizens of the Federated States of Micronesia traveling to Indonesia. B211A visit visa details, passport rules, and transit info.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/micronesia`,
        }
    };
}

export default async function MicronesiaHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Regional Guides", url: `/${locale}/list-country` },
        { label: "Micronesia Guide", url: `/${locale}/micronesia` }
    ];

    const cta = {
        title: "Planning your trip from Micronesia?",
        desc: "Micronesian citizens are currently not eligible for e-VoA. You must apply for a B211A Visit Visa before arrival. Our agency handles the sponsorship for a smooth entry.",
        buttonText: "Start My B211A Application",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. The 2026 Entry Rules for Micronesians",
            content: (
                <div className="space-y-4">
                    <p>Citizens of the <strong>Federated States of Micronesia (FSM)</strong> currently do not have access to the Visa-on-Arrival (VoA) or e-VoA systems in Indonesia. To enter for tourism, business, or family visits, you must obtain a <strong>B211A Visit Visa</strong> before your flight departs for Indonesia.</p>
                </div>
            )
        },
        {
            id: "b211a",
            title: "2. The B211A Visit Visa",
            content: (
                <div className="space-y-4">
                    <p>The <strong>B211A Visit Visa</strong> is the standard entry permit for Micronesians. It allows for an initial stay of 60 days and can be extended twice for 60 days each, totalling 180 days. This visa is sponsored by our agency, ensuring that your application is processed through the official Jakarta immigration portal without needing to visit an embassy.</p>
                    <Link href={`/${locale}/apply`} className="text-primary font-bold hover:underline">
                        Apply for Micronesia B211A Visa →
                    </Link>
                </div>
            )
        },
        {
            id: "passport",
            title: "3. Passport Validity & Requirements",
            content: (
                <div className="space-y-4">
                    <p>Your Micronesian passport must be valid for at least <strong>6 months</strong> from your date of arrival in Indonesia. You also need proof of a return flight ticket or an onward ticket to another country. Failure to have these documents will result in being denied boarding by your airline.</p>
                </div>
            )
        },
        {
            id: "transit",
            title: "4. Transit via Guam or Honolulu",
            content: (
                <div className="space-y-4">
                    <p>Most Micronesians transit through <strong>Guam, Honolulu, or Manila</strong> to reach Indonesia. Ensure you have the necessary transit visas for these locations. Once you arrive at an Indonesian international airport (like Jakarta CGK or Bali DPS), you will clear immigration using your pre-approved B211A visa.</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "5. Electronic Customs (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>All travelers to Indonesia must complete the <strong>Electronic Customs Declaration (e-CD)</strong>. You should do this online within 72 hours before your arrival. You will receive a QR code which you must present to the customs officers after collecting your bags.</p>
                </div>
            )
        },
        {
            id: "levy",
            title: "6. Bali Tourist Levy (IDR 150,000)",
            content: (
                <div className="space-y-4">
                    <p>If your destination is Bali, you must pay the <strong>Bali Tourist Levy</strong> of IDR 150,000 (~$10 USD). This is a mandatory fee for all international visitors to the island, separate from your visa cost. We recommend paying this through the 'Love Bali' portal before you land.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "7. Overstay Fines & Regulations",
            content: (
                <div className="space-y-4">
                    <p>Be very careful not to overstay your 60-day visa. The fine is <strong>IDR 1,000,000 per day</strong> (~$65 USD). If you overstay by more than 60 days, you face detention, deportation, and a potential ban from re-entering Indonesia for many years.</p>
                </div>
            )
        },
        {
            id: "health",
            title: "8. Health & Safety Prep",
            content: (
                <div className="space-y-4">
                    <p>While no specific vaccinations are currently mandatory for Micronesians, we recommend being up-to-date with standard boosters. Comprehensive travel insurance is highly recommended, as private medical care in cities like Jakarta or Bali can be expensive for those without coverage.</p>
                </div>
            )
        },
        {
            id: "why-us",
            title: "9. Why Micronesians Choose Our Agency",
            content: (
                <div className="space-y-4">
                    <p>Our agency specializes in handling visa applications for nations that require pre-arrival processing. We provide secure payment options, transparent tracking of your application, and local expertise in Jakarta to ensure your B211A is issued promptly and correctly.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "10. FAQ for Micronesian Citizens",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can Micronesians apply for a visa at the airport?</h4>
                        <p className="text-sm opacity-80">No, citizens of Micronesia (FSM) are not currently on the list for Visa-on-Arrival. You must have your B211A visa approved before you arrive in Indonesia.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa for Micronesia (FSM) Citizens 2026: Official Guide"
            subtitle="Navigate pre-arrival B211A requirements, transit paths, and Bali entry protocols for Micronesian travelers."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
