import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "B211A Visa Extension Guide 2026 – The 180-Day Pathway",
        description: "How to legally extend your 60-day B211A Tourist Visa twice for a maximum stay of 180 days in Indonesia. Required sponsor letters and timelines explained.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-extension/b211a-extension-guide`,
        }
    };
}

export default async function B211AExtensionPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Visa Extensions", url: `/${locale}/visa-extension` },
        { label: "B211A Extension Guide", url: `/${locale}/visa-extension/b211a-extension-guide` }
    ];

    const cta = {
        title: "Approaching Day 60?",
        desc: "Secure your first or second B211A extension with our registered corporate sponsorship to legally continue your stay up to 180 days.",
        buttonText: "Start B211A Extension Now",
        link: `/${locale}/extend`
    };

    const sections = [
        {
            id: "the-180-day-rule",
            title: "1. The Power of the 180-Day Rule",
            content: (
                <div className="space-y-4">
                    <p>The core advantage of entering Indonesia on a B211A Visit Visa is its massive longevity. An initial eVisa grants 60 days. This 60-day block can be subsequently extended while you firmly remain onshore inside the country.</p>
                </div>
            )
        },
        {
            id: "two-extension-limit",
            title: "2. The Two Extension Limit",
            content: (
                <div className="space-y-4">
                    <p>You are legally isolated to a maximum of exactly two extensions.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Base Visa:</strong> 60 Days</li>
                        <li><strong>Extension 1:</strong> +60 Days (Total 120 Days)</li>
                        <li><strong>Extension 2:</strong> +60 Days (Total 180 Days)</li>
                    </ul>
                    <p>Upon reaching day 180, the system hard-locks. You must secure an onshore conversion to a KITAS or fly out of Indonesia.</p>
                </div>
            )
        },
        {
            id: "corporate-sponsor",
            title: "3. The Role of the Corporate Sponsor",
            content: (
                <div className="space-y-4">
                    <p>A B211A extension entirely hinges on your legal sponsor. If your initial eVisa was sponsored by an agency (like PT Indonesian Visas), you MUST use that identical agency to process the extensions. Switching sponsors mid-visa requires a complex "Mutasi Sponsor" process involving severe bureaucratic negotiation.</p>
                </div>
            )
        },
        {
            id: "documentation",
            title: "4. Documentation Needed",
            content: (
                <div className="space-y-4">
                    <p>The required paperwork is heavy, but handled entirely by your sponsor. The local immigration office requires:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Original Passport</li>
                        <li>Sponsor Guarantee Letter with Materai (Official Tax Stamp)</li>
                        <li>Sponsor Corporate Registration Documents</li>
                        <li>Printout of the original eVisa PDF</li>
                    </ul>
                </div>
            )
        },
        {
            id: "pricing",
            title: "5. Pricing Structure",
            content: (
                <div className="space-y-4">
                    <p>Unlike the cheap 500k VoA, the B211A 60-day extension carries a massive governmental PNBP fee of 2,000,000 IDR. Factoring in corporate facilitation, expect to pay around 2,800,000 IDR per extension block.</p>
                </div>
            )
        },
        {
            id: "can-you-leave",
            title: "6. Can You Leave During an Extension?",
            content: (
                <div className="space-y-4">
                    <p><strong>Absolutely NOT.</strong> The B211A is a Single-Entry visa. If you clear immigration to board an international flight while holding a B211A—even if you just paid for an extension and have 50 days left—the visa is instantly canceled when the immigration officer stamps your exit. You will have to buy a new visa to return.</p>
                </div>
            )
        },
        {
            id: "biometric",
            title: "7. The Biometric Process",
            content: (
                <div className="space-y-4">
                    <p>For your primary (first) B211A extension, you must attend the immigration office briefly for photo and fingerprint capture. However, for your second extension (days 120 to 180), biometric capture is generally waived as your data is already locked into the immigration mainframe from the first extension—meaning the second extension is entirely passive on your end.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. Frequently Asked Questions",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">My sponsor is unresponsive. Can I just hire you to extend?</h4>
                        <p className="mode-aware-subtext text-sm">You must acquire a formally drafted, signed, and stamped "Release Letter" from your original sponsor before our agency can legally assume responsibility for your B211A.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="B211A Visa Extension Guide 2026 – The 180-Day Pathway"
            subtitle="Maximize your digital nomad visa legally. Navigate the sponsorship requirements and biometric processes to unlock your full 180-day stay."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
