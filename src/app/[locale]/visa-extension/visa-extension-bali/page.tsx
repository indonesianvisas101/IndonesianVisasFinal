import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Bali Visa Extension 2026 – Stop Overstaying, Extend Legally",
        description: "Your ultimate guide to extending any visa in Bali. Understand biometric appointments, the crucial 14-day rule, and how to avoid the 1 Million IDR daily overstay fine.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-extension/visa-extension-bali`,
        }
    };
}

export default async function VisaExtensionBaliPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Visa Extensions", url: `/${locale}/visa-extension` },
        { label: "General Extension Guide", url: `/${locale}/visa-extension/visa-extension-bali` }
    ];

    const cta = {
        title: "Need Assitance With Your Extension?",
        desc: "We pick up your passport anywhere in Bali, handle the immigration queuing, and return it safely to your villa. 100% legal compliance.",
        buttonText: "Request Agent Pickup",
        link: `/${locale}/extend`
    };

    const sections = [
        {
            id: "why-extend",
            title: "1. The Reality of Extending Visas in Bali",
            content: (
                <div className="space-y-4">
                    <p>Bali operates under immense bureaucratic strain. With millions of foreign tourists entering Ngurah Rai International Airport annually, the local immigration offices (Kantor Imigrasi) are operating at maximum capacity. Extending a visa is not a casual afterthought; it is a rigid legal procedure involving multiple government checkpoints.</p>
                </div>
            )
        },
        {
            id: "understanding-categories",
            title: "2. Understanding Extendable Visa Categories",
            content: (
                <div className="space-y-4">
                    <p>Not all visas can be extended. Ensure you hold one of the following:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Visa on Arrival (VoA):</strong> Extendable 1 time for 30 days.</li>
                        <li><strong>B211A Tourist/Social Visa:</strong> Extendable 2 times, each for 60 days.</li>
                    </ul>
                    <p>If you entered using the ASEAN Visa Exemption, you cannot extend your stay under any circumstances.</p>
                </div>
            )
        },
        {
            id: "the-overstay-danger",
            title: "3. The Overstay Danger Zone",
            content: (
                <div className="space-y-4">
                    <p>Overstaying in Indonesia incurs a brutal fine of <strong>1,000,000 IDR (approx. $65 USD) per day, per person.</strong> If you miss your extension window and overstay past 60 days, you face immediate deportation and placement on the immigration blacklist.</p>
                </div>
            )
        },
        {
            id: "required-docs",
            title: "4. Required Documentation",
            content: (
                <div className="space-y-4">
                    <p>Regardless of relying on an agency or self-processing, you absolutely need:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Your original physical passport.</li>
                        <li>A printed copy of your outbound flight ticket (leaving the country within the new visa limit).</li>
                        <li>For B211A Visas, formal sponsorship letters from your corporate guarantor.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "the-14-day-rule",
            title: "5. The 14-Day Lead Time Rule",
            content: (
                <div className="space-y-4">
                    <p>You must initiate the agency extension process roughly <strong>14 days prior to your visa expiration date</strong>. The immigration system drops applications taking less than 5 days, automatically thrusting you into overstay status.</p>
                </div>
            )
        },
        {
            id: "diy-vs-agency",
            title: "6. DIY vs Using a Visa Agency",
            content: (
                <div className="space-y-4">
                    <p>Doing it yourself requires three entirely separate visits to the immigration office: Document Drop-off, Biometric Scanning, and Passport Retrieval. Expect to lose roughly 15-20 hours of your holiday sitting in plastic chairs. Using a premium agency condenses this into one simple biometric visit.</p>
                </div>
            )
        },
        {
            id: "biometric",
            title: "7. The Mandatory Biometric Appointment",
            content: (
                <div className="space-y-4">
                    <p>For paper VoA and all onshore B211A extensions, the applicant must physically appear at immigration (Denpasar, Jimbaran, or Singaraja) for exactly ten minutes to have ten fingerprints scanned and a high-resolution photograph taken. Our agents escort you past the standard queues for this step.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. Frequently Asked Questions (FAQ)",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">My passport is running out of pages. Can I extend?</h4>
                        <p className="mode-aware-subtext text-sm">Every extension requires physical stamps taking up roughly half a page. If your passport lacks blank pages, immigration will reject the extension.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Bali Visa Extension 2026 – Stop Overstaying, Extend Legally"
            subtitle="Understand the strict mechanics of onshore extensions in Bali to protect yourself from severe fines and immigration holding cells."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
