import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Bali Travel Entry Requirements 2026 – Official Guide",
        description: "Your official 2026 Bali entry roadmap. Review the mandatory steps from the 6-month passport rule to the new SATUSEHAT health protocols and customs forms.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/travel-indonesia/bali-travel-entry-requirements`,
        }
    };
}

export default async function BaliEntryRequirementsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Travel Info", url: `/${locale}/travel-indonesia` },
        { label: "Bali Entry Roadmap", url: `/${locale}/travel-indonesia/bali-travel-entry-requirements` }
    ];

    const cta = {
        title: "Start Your Bali Journey Right",
        desc: "Don't leave your entry to chance. We ensure your e-VoA and B211A documentation is 100% compliant with the latest 2026 Directorate General rules.",
        buttonText: "Apply for Bali e-Visa",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "roadmap",
            title: "1. The 5-Step Bali Entry Roadmap",
            content: (
                <div className="space-y-4">
                    <p>Entering Bali in 2026 is an entirely digital-first process. To avoid delays, follow this exact sequence:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li><strong>Check Passport:</strong> Ensure 6+ months validity.</li>
                        <li><strong>Secure Visa:</strong> Apply for e-VoA or B211A 72 hours before flight.</li>
                        <li><strong>Pay Tourist Levy:</strong> Complete the Rp 150k payment via Love Bali.</li>
                        <li><strong>Fill e-CD:</strong> Complete the Customs form online to get your QR code.</li>
                        <li><strong>Health Protocol:</strong> Check the latest SATUSEHAT app mandates.</li>
                    </ol>
                </div>
            )
        },
        {
            id: "passport-integrity",
            title: "2. Passport Integrity Issues",
            content: (
                <div className="space-y-4">
                    <p>
                        Beyond the 6-month rule, the **physical condition** of your passport is hyper-critical. Bali immigration is famous for rejecting travelers with:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Water damage or blurry ink on any page.</li>
                        <li>Rips or loose threads on the cover binding.</li>
                        <li>Loose or detached bio-data pages.</li>
                    </ul>
                    <p>If your passport looks "damaged," replace it before you fly, or you risk being sent back on the next available plane at your own expense.</p>
                </div>
            )
        },
        {
            id: "visa-selection",
            title: "3. Choosing the Right Visa",
            content: (
                <div className="space-y-4">
                    <p>
                        Don't just default to the VoA at the airport.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Visit &lt; 30 Days:</strong> e-VoA (B1) is the fastest.</li>
                        <li><strong>Visit 30-60 Days:</strong> e-VoA (B1) then extend onshore, or pre-apply for B211A.</li>
                        <li><strong>Social/Business 60+ Days:</strong> B211A is the only legal option for tourists to reach 180 days.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "airport-flow",
            title: "4. The Ngurah Rai Arrival Flow",
            content: (
                <div className="space-y-4">
                    <p>
                        Once you land:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Step A:</strong> Follow 'All Passports' or 'e-Visa/Autogate' signs.</li>
                        <li><strong>Step B:</strong> If you have an e-Visa, go straight to the Autogates. No line, no talk.</li>
                        <li><strong>Step C:</strong> If you need a paper VoA, line up at the Bank counter first to pay 500k, then line up for the officer.</li>
                        <li><strong>Step D:</strong> Collect bags and scan your e-CD Customs QR code.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "tourist-levy-check",
            title: "5. The Tourist Levy Spot Checks",
            content: (
                <div className="space-y-4">
                    <p>
                        While the Rp 150,000 Bali Levy is often paid before arrival, there are spot-check counters at the domestic and international exit of the airport. Keep your 'Love Bali' confirmation email or QR code handy on your phone to show the officers.
                    </p>
                </div>
            )
        },
        {
            id: "health-satusehat",
            title: "6. SATUSEHAT Health Protocols",
            content: (
                <div className="space-y-4">
                    <p>
                        While COVID rules have relaxed, Indonesia uses the **SATUSEHAT** app for health monitoring. During outbreaks of Mpox or other regional health concerns, you may be required to fill out a health declaration within this app before boarding or upon landing to pass the thermal scanners.
                    </p>
                </div>
            )
        },
        {
            id: "customs-prohibitions",
            title: "7. Customs: What NOT to bring",
            content: (
                <div className="space-y-4">
                    <p>
                        Bali Customs is extremely strict on:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Alcohol:</strong> Maximum 1 Liter per adult. Anything more is confiscated and destroyed.</li>
                        <li><strong>Tobacco:</strong> 200 cigarettes or 25 cigars.</li>
                        <li><strong>Vapes:</strong> Generally allowed for personal use, but heavy quantities may be flagged.</li>
                        <li><strong>Narcotics:</strong> ZERO tolerance. Medical marijuana is illegal in Indonesia.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. FAQ",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I enter Bali if I have a criminal record?</h4>
                        <p className="mode-aware-subtext text-sm">Indonesia mostly checks for INTERPOL notices or local blacklists. Standard minor domestic records in your home country usually don't block a tourist visa, but serious offenses can lead to e-Visa denial.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Bali Travel Entry Requirements 2026 – Official Guide"
            subtitle="The definitive guide to crossing the Indonesian border. Ensure 100% document compliance and utilize fast-track digital protocols."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
