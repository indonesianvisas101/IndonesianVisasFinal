import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Visa on Arrival (VoA/e-VoA) Bali 2026 – Complete Entry Guide",
        description: "Your comprehensive guide to entering Bali and Indonesia with the 30-day Visa on Arrival. Learn about the e-VoA system, costs, eligible countries, and the 60-day extension process.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-types/visa-on-arrival-bali`,
        }
    };
}

export default async function VoAVisaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Visa Types", url: `/${locale}/visa-types` },
        { label: "Visa on Arrival (VoA) Guide", url: `/${locale}/visa-types/visa-on-arrival-bali` }
    ];

    const cta = {
        title: "Need to Extend Your VoA?",
        desc: "Don't ruin your vacation at the immigration office. We handle your 30-day Visa on Arrival extension quickly and legally with our VIP service.",
        buttonText: "Extend Your VoA Now",
        link: `/${locale}/extend`
    };

    const sections = [
        {
            id: "overview",
            title: "1. Overview of the Visa on Arrival (VoA)",
            content: (
                <div className="space-y-4">
                    <p>
                        The Visa on Arrival (VoA)—Index B1—is the cornerstone of Indonesian tourism. It is designed entirely for short-term visitors engaging in holidays, sightseeing, visiting family, or simply transiting through the archipelago. Valid for exactly 30 days starting from the date of touchdown, it is the fastest, cheapest, and most straightforward method for most Western tourists to enter Bali or Jakarta.
                    </p>
                    <p>
                        Crucially, a VoA is <strong>expandable exactly one time</strong>. This means you can extend your stay from 30 days to a total of 60 days. Once the 60 days are exhausted, the VoA holder is legally mandated to exit the Republic of Indonesia.
                    </p>
                </div>
            )
        },
        {
            id: "eligible-nationalities",
            title: "2. Eligible Nationalities List (2026 Update)",
            content: (
                <div className="space-y-4">
                    <p>
                        Not all passports hold the privilege of acquiring a VoA upon landing. Currently, the Directorate General of Immigration grants access to citizens of 97 countries. This list is heavily populated by:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>North America:</strong> United States of America, Canada, Mexico.</li>
                        <li><strong>Europe:</strong> The United Kingdom, Germany, France, Italy, Spain, Netherlands, and the vast majority of the EU bloc.</li>
                        <li><strong>Oceania:</strong> Australia, New Zealand.</li>
                        <li><strong>Asia:</strong> Japan, South Korea, China, India.</li>
                    </ul>
                    <p>
                        If your passport is not on the approved VoA roster, you will be denied boarding at your origin airport unless you present a pre-approved B211A Visit Visa.
                    </p>
                </div>
            )
        },
        {
            id: "evoa-vs-paper",
            title: "3. e-VoA vs Paper VoA Differences",
            content: (
                <div className="space-y-4">
                    <p>Understanding the difference between the traditional piece of paper and the new digital system is critical to saving hours of your vacation time.</p>
                    <h4 className="font-bold text-lg mt-6">The Traditional Paper VoA</h4>
                    <p>
                        Purchased physically at the airport before passing through the immigration desks. You must line up at a banking counter, pay 500,000 IDR (ideally in exact local cash to avoid terrible airport exchange rates), and receive a sticker in your passport. If you wish to extend this visa later, you must undergo three separate physical fingerprinting and stamping appointments at a local immigration office.
                    </p>
                    <h4 className="font-bold text-lg mt-6">The e-VoA (Electronic Visa on Arrival)</h4>
                    <p>
                        Applied and paid for online via the Molina portal before you ever board your flight. Possessing an e-VoA allows you to utilize the biometric <strong>Autogates</strong> at Ngurah Rai (Bali) and Soekarno-Hatta (Jakarta) airports, entirely bypassing manual queues. Furthermore, the 30-day extension can be triggered completely digitally without a single visit to an immigration office.
                    </p>
                </div>
            )
        },
        {
            id: "documents-needed",
            title: "4. Documents Needed for e-VoA",
            content: (
                <div className="space-y-4">
                    <p>Applying for the e-VoA online requires precise digital documentation:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>A high-quality, glare-free photograph of your passport bio-data page. The passport must have <strong>strictly more than 6 months of validity</strong> remaining from the date you land.</li>
                        <li>A digital passport-style photograph (JPEG format, distinct from the passport photo).</li>
                        <li>Confirmed return or onward flight ticket departing Indonesia within the 90-day window (even though the initial visa is 30 days).</li>
                        <li>A valid credit or debit card capable of international transactions.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "application-process",
            title: "5. Step-by-Step e-VoA Application Process",
            content: (
                <div className="space-y-4">
                    <p>We highly recommend completing this process 48 to 72 hours before your flight.</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Access the official Directorate General of Immigration Molina portal. Avoid identical-looking scam websites that charge exhorbitant markup fees.</li>
                        <li>Select "Apply," input your passport nationality, and select "B1 - Tourism Visit Visa."</li>
                        <li>Upload your passport bio-page and portrait photograph. Ensure the MRZ code is autodetected correctly.</li>
                        <li>Input your anticipated arrival date, flight number, and hotel accommodation address in Indonesia.</li>
                        <li>Proceed to the payment gateway to finalize the transaction. The e-VoA PDF will be delivered to your email shortly after.</li>
                    </ol>
                </div>
            )
        },
        {
            id: "costs",
            title: "6. Official Costs and Surcharges",
            content: (
                <div className="space-y-4">
                    <p>
                        The core governmental PNBP fee for the Visa on Arrival is <strong>500,000 Indonesian Rupiah (IDR)</strong>, roughly translating to $35 USD, $50 AUD, or €30 depending on daily market fluctuations.
                    </p>
                    <p>
                        When paying for the e-VoA online via credit card, the payment gateway will attach a small convenience surcharge (usually around 15,000 to 20,000 IDR). If utilizing an agency like PT Indonesian Visas to process the VoA or its extension on your behalf, an additional service facilitation fee will apply to cover labor, priority queuing, and localized document normalization.
                    </p>
                </div>
            )
        },
        {
            id: "extension",
            title: "7. Extending the VoA for 60 Days Total",
            content: (
                <div className="space-y-4">
                    <p>
                        If you fall in love with Bali and decide 30 days is insufficient, your VoA acts as a gateway to 60 days total. The absolute critical rule of extensions is the timeline: <strong>You must initiate the extension at least 10 days before your 30-day limit expires.</strong>
                    </p>
                    <p>If you hold a paper VoA, we strongly urge you to use an agency. We will collect your passport, lodge it with immigration, schedule your mandatory short biometric (fingerprint and photo) visit at the closest Kantor Imigrasi, and return the newly stamped passport to your villa. If you attempt this solo, prepare to lose three full days waiting in un-airconditioned government lobbies.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. Frequently Asked Questions (FAQ)",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I extend my VoA a second time?</h4>
                        <p className="mode-aware-subtext text-sm">Absolutely not. The Visa on Arrival has a hard, unyielding limit of 60 days (one initial 30-day block, plus one 30-day extension). To stay longer, you must exit Indonesia and re-enter, or apply for an onshore B211A via an agency prior to expiration.</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10 mt-4">
                        <h4 className="font-bold text-primary mb-2">Can I pay for a paper VoA at the airport with a credit card?</h4>
                        <p className="mode-aware-subtext text-sm">Yes, major international airports in Jakarta and Bali have implemented EDC credit card terminals at the VoA counters. Be aware that your home bank may charge heavy foreign transaction fees on top of the 500,000 IDR base cost.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Visa on Arrival (VoA/e-VoA) Bali 2026 – Complete Entry Guide"
            subtitle="Understand every detail about Indonesia's most popular tourist visa, including the transition to e-VoA Autogates and crucial extension deadlines."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
