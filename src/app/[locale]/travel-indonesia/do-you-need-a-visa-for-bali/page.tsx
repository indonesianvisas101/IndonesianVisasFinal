import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Do You Need a Visa for Bali 2026? – Essential Entry FAQ",
        description: "The definitive answer to the most common traveler question. Learn about the 2026 Bali visa-free suspension, VoA eligibility, and cruise ship entry rules.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/travel-indonesia/do-you-need-a-visa-for-bali`,
        }
    };
}

export default async function NeedVisaBaliPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Travel Info", url: `/${locale}/travel-indonesia` },
        { label: "Do I Need a Visa?", url: `/${locale}/travel-indonesia/do-you-need-a-visa-for-bali` }
    ];

    const cta = {
        title: "Landing in Bali Soon?",
        desc: "Don't get stuck in the airport bank queues. Secure your e-VoA or B211A digitally and walk through the Autogates in seconds.",
        buttonText: "Get My Bali Visa",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "the-short-answer",
            title: "1. The Short Answer for 2026",
            content: (
                <div className="space-y-4">
                    <p>
                        <strong>Yes.</strong> Almost every foreign traveler entering Bali in 2026 requires a visa. The days of "free entry" (Visa Exemption) for Western tourists have been officially suspended. Unless you hold an ASEAN passport (e.g., Singapore, Malaysia, Philippines), you absolutely cannot enter Bali without purchasing a Visa on Arrival or holding a pre-approved e-Visa.
                    </p>
                </div>
            )
        },
        {
            id: "asean-exception",
            title: "2. The ASEAN Exception",
            content: (
                <div className="space-y-4">
                    <p>
                        Currently, citizens of the 9 ASEAN member states are the only travelers afforded visa-free entry for tourism purposes. This is restricted to a maximum of 30 days and **cannot** be extended. If you are from Singapore, you stroll through for free. If you are from Australia, the UK, or the USA, you must pay.
                    </p>
                </div>
            )
        },
        {
            id: "visa-on-arrival",
            title: "3. What is the Bali Visa on Arrival (VoA)?",
            content: (
                <div className="space-y-4">
                    <p>
                        The VoA (Index B1) is what 90% of tourists use. It costs 500,000 IDR (approx. $35 USD) and grants 30 days. It is available to citizens of 97 countries. You can buy it at a desk right before the immigration counters at Ngurah Rai International Airport, but we fiercely recommend buying the "e-VoA" online before you fly to utilize the fast-track Autogates.
                    </p>
                </div>
            )
        },
        {
            id: "long-term-bali",
            title: "4. What if I want to stay longer than 30 days?",
            content: (
                <div className="space-y-4">
                    <p>
                        If your Bali trip is 45 or 60 days, you have two options:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Extend your VoA:</strong> Buy a 30-day extension onshore (one time only, totaling 60 days).</li>
                        <li><strong>B211A Visa:</strong> Buy this before you arrive to get an initial 60 days, with the ability to extend up to 180 days total.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "cruise-ships",
            title: "5. Bali Entry for Cruise Ship Passengers",
            content: (
                <div className="space-y-4">
                    <p>
                        If you are arriving in Bali via a cruise ship (Benoa Harbor), you still require a Visa on Arrival. Most premium cruise lines facilitate this for you, but you should always verify if the cost is included in your cabin fare or if you need to carry 500k IDR in cash for the harbor immigration officers.
                    </p>
                </div>
            )
        },
        {
            id: "children-visas",
            title: "6. Do children and babies need visas?",
            content: (
                <div className="space-y-4">
                    <p>
                        <strong>Yes.</strong> Indonesian immigration laws do not exempt minors. Every single person, regardless of age, must possess their own passport and their own individual visa. A baby arriving without a visa will be hit with the same 1,000,000 IDR daily overstay fine as an adult.
                    </p>
                </div>
            )
        },
        {
            id: "passport-validity",
            title: "7. The 6-Month Passport Rule",
            content: (
                <div className="space-y-4">
                    <p>
                        This is the #1 reason travelers are denied entry to Bali. Your passport **must** have at least 6 months of validity left from the day you land. If it has 5 months and 25 days, the airline will not even let you check in at your home airport. There are no exceptions to this rule.
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
                        <h4 className="font-bold text-primary mb-2">Can I enter Bali on a one-way ticket?</h4>
                        <p className="mode-aware-subtext text-sm">Legally, no. Immigration and most airlines require proof of a return or onward flight ticket before you are granted entry. If you don't have one, you may be compelled to buy a "throwaway" ticket at the check-in counter.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Do You Need a Visa for Bali 2026? – Essential Entry FAQ"
            subtitle="Don't get caught at the border. Understand the latest 2026 immigration protocols for Bali, including VoA costs and ASEAN exemptions."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
