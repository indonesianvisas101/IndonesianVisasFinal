import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Bali Visa Requirements 2026 – Documents, Costs & Rules",
        description: "The complete checklist for Bali entry in 2026. Review passport validity rules, e-VoA procedures, customs declarations, and the Bali Tourist Levy.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/travel-indonesia/bali-visa-requirements-2026`,
        }
    };
}

export default async function BaliVisaRequirementsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Travel Info", url: `/${locale}/travel-indonesia` },
        { label: "Bali Entry Checklist", url: `/${locale}/travel-indonesia/bali-visa-requirements-2026` }
    ];

    const cta = {
        title: "Is Your Passport Ready?",
        desc: "Ensure 100% compliance before you fly. We process e-VoAs and B211A visas for travelers from over 100 countries.",
        buttonText: "Check Visa Eligibility",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "checklist",
            title: "1. The 2026 Bali Entry Checklist",
            content: (
                <div className="space-y-4">
                    <p>To pass through Ngurah Rai International Airport without hitches, you must have four distinct digital or physical items ready for inspection:</p>
                    <ul className="list-decimal pl-6 space-y-2">
                        <li><strong>Valid Passport:</strong> Minimum 6 months validity and 1 blank page.</li>
                        <li><strong>Valid Visa:</strong> Either an e-VoA, a physical VoA sticker, or a B211A eVisa.</li>
                        <li><strong>e-CD:</strong> The Electronic Customs Declaration QR code.</li>
                        <li><strong>Bali Tourist Levy:</strong> Proof of payment for the Rp 150,000 provincial tax.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "bali-levy",
            title: "2. The Bali Tourist Levy (Rp 150,000)",
            content: (
                <div className="space-y-4">
                    <p>
                        Introduced in 2024 and strictly enforced in 2026, the Bali Tourist Levy is a provincial tax of 150,000 IDR (approx. $10 USD) applied to every foreign visitor entering the island. This is **separate** from your visa fee. You should pay this online via the official 'Love Bali' portal before you arrive to avoid queuing at the dedicated tax desk in the arrival hall.
                    </p>
                </div>
            )
        },
        {
            id: "voa-requirements",
            title: "3. Visa on Arrival (VoA) Specifics",
            content: (
                <div className="space-y-4">
                    <p>
                        The VoA is the most common entry method.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Cost:</strong> 500,000 IDR.</li>
                        <li><strong>Duration:</strong> 30 days.</li>
                        <li><strong>Extensions:</strong> One time (additional 30 days).</li>
                        <li><strong>Eligible Countries:</strong> 97 nationalities including the US, most of Europe, Australia, and India.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "customs-ecd",
            title: "4. Electronic Customs Declaration (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>
                        Indonesia has abolished paper customs forms. You **must** fill out the e-CD online (usually within 72 hours of your flight). Once completed, you'll receive a QR code. After collecting your luggage, you will scan this QR code at the Customs exit. If you don't have it, you'll be forced to stand at a kiosk in the baggage hall and fill it out on a slow public computer.
                    </p>
                </div>
            )
        },
        {
            id: "onward-ticket",
            title: "5. Proof of Onward Travel",
            content: (
                <div className="space-y-4">
                    <p>
                        Indonesian law requires all visitors to hold a ticket proving they are leaving the country. While airport immigration rarely asks to see it, the **airlines** at your departure city will almost certainly ask. If you cannot provide a confirmed outbound flight within your visa's stay period, they may deny you boarding.
                    </p>
                </div>
            )
        },
        {
            id: "vaccinations",
            title: "6. Vaccination & Health Rules",
            content: (
                <div className="space-y-4">
                    <p>
                        As of early 2026, COVID-19 vaccination certificates are no longer a mandatory entry requirement for most travelers. However, if you are arriving from certain regions in South America or Africa, you may be required to show proof of a Yellow Fever vaccination. Always check the latest SATUSEHAT health app updates if traveling from high-risk medical zones.
                    </p>
                </div>
            )
        },
        {
            id: "criminal-record",
            title: "7. Criminal Record and Blacklists",
            content: (
                <div className="space-y-4">
                    <p>
                        Indonesia reserves the right to deny entry to anyone with a serious criminal record or anyone who has been previously deported from the country. If you have any previous "Red Notice" or immigration violations in Indonesia, your eVisa application will likely be auto-rejected by the Molina system.
                    </p>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. FAQ",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I pay for my VoA in USD or AUD?</h4>
                        <p className="mode-aware-subtext text-sm">Yes, the airport payment counters accept major foreign currencies. However, they use their own (often poor) exchange rates and will provide your change in IDR. It is always cheaper to pay with a credit card or exact IDR cash.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Bali Visa Requirements 2026 – Documents, Costs & Rules"
            subtitle="Your essential 2026 checklist for a smooth arrival in Bali. Master the e-VoA process, Customs QR codes, and the new Bali Tourist Levy."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
