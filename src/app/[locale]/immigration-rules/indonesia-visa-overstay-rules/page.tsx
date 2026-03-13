import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Overstay Rules 2026 – Fines & Deportation",
        description: "Critical guide to the Indonesian overstay laws. Learn about the 1 Million IDR daily fine, airport payment procedures, and the 60-day deportation threshold.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/immigration-rules/indonesia-visa-overstay-rules`,
        }
    };
}

export default async function OverstayRulesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Immigration Rules", url: `/${locale}/immigration-rules` },
        { label: "Overstay Rules", url: `/${locale}/immigration-rules/indonesia-visa-overstay-rules` }
    ];

    const cta = {
        title: "Are you currently Overstayed?",
        desc: "Do not go to the airport unassisted. Our legal team can negotiate your release and facilitate your fine payments directly with the Directorate General.",
        buttonText: "Request Emergency Help",
        link: `/${locale}/contact`
    };

    const sections = [
        {
            id: "what-is-overstay",
            title: "1. What Constitutes an Overstay?",
            content: (
                <div className="space-y-4">
                    <p>
                        An overstay occurs the exact moment your passport stamp or eVisa PDF reaches midnight on its expiration date, and you are still physically situated on Indonesian soil. Immigration calculates this down to the minute. If your visa expires on the 15th, and your flight departs at 2:00 AM on the 16th, you have legally overstayed by one day and will be intercepted at the departure gate.
                    </p>
                </div>
            )
        },
        {
            id: "daily-fine",
            title: "2. The Brutal 1 Million IDR Daily Fine",
            content: (
                <div className="space-y-4">
                    <p>
                        In a move to absolutely deter "slow travelers" who historically abused the relaxed island culture, the government quadrupled the monetary penalty. For every single calendar day you overstay, you owe the state <strong>1,000,000 Indonesian Rupiah (approximately $65 USD / €60 EUR)</strong>.
                    </p>
                    <p>
                        This fine is non-negotiable. If you overstay by 14 days, you owe $910 USD. This fee applies strictly per individual passport; if a visiting family of four overstays by five days, the collective fine is a staggering 20,000,000 IDR.
                    </p>
                </div>
            )
        },
        {
            id: "60-day-threshold",
            title: "3. The 60-Day Critical Threshold",
            content: (
                <div className="space-y-4">
                    <p>
                        Paying the daily fine is the "lucky" outcome, reserved strictly for minor infractions. <strong>60 days is the absolute legal threshold.</strong>
                    </p>
                    <p>
                        If your overstay reaches day 61, the framework shifts from a monetary administrative penalty to a severe criminal immigration offense. You lose the privilege of simply paying the fine at the airport. You will be actively detained, subjected to a formal deportation hearing, involuntarily removed from the country, and placed on the permanent red-notice blacklist.
                    </p>
                </div>
            )
        },
        {
            id: "detention",
            title: "4. Detention and Deportation Logistics",
            content: (
                <div className="space-y-4">
                    <p>
                        If intercepted past the 60-day mark (or earlier if you cannot physically afford to pay your amassed daily fines), you will be transferred to a Rumah Detensi Imigrasi (Immigration Detention Center)—such as the Rudenim in Jimbaran, Bali. You will remain incarcerated here under sparse conditions until your embassy or your family purchases your one-way flight back to your country of origin. The Indonesian government does not pay for your deportation flight.
                    </p>
                </div>
            )
        },
        {
            id: "paying-fines",
            title: "5. Paying the Fine at the Airport",
            content: (
                <div className="space-y-4">
                    <p>
                        If you overstayed by a minor amount (e.g., 1 to 5 days), you pay the fine directly at the airport prior to boarding your outbound flight.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Arrive at Ngurah Rai (DPS) or Soekarno-Hatta (CGK) at least **4 hours** before departure.</li>
                        <li>Proceed to the immigration supervisor's desk located just before the primary passport stamping booths.</li>
                        <li>The officer will calculate your exact days. You must pay. Credit cards are often processed, but the machines frequently break down. <strong>Having the exact fine amount in physical IDR cash is highly recommended to prevent missing your flight.</strong></li>
                    </ul>
                </div>
            )
        },
        {
            id: "appeals",
            title: "6. Appealing an Overstay (Force Majeure)",
            content: (
                <div className="space-y-4">
                    <p>
                        Overstay fines are almost entirely rigid, but the government permits exceptions under severe <em>Force Majeure</em>. For example, if Mt. Agung erupts and Ngurah Rai Airport closes, grounding all flights for three days, affected tourists are not fined.
                    </p>
                    <p>
                        If you suffer a catastrophic medical emergency (e.g., a coma from a scooter accident) and are physically hospitalized in an ICU when your visa expires, the fine can occasionally be waived. However, this requires overwhelming documentation from the hospital's Chief Medical Officer and intense negotiation by a corporate legal sponsor. Minor illnesses like "Bali Belly" do not qualify for waivers.
                    </p>
                </div>
            )
        },
        {
            id: "prevention",
            title: "7. How to Prevent Overstaying",
            content: (
                <div className="space-y-4">
                    <p>Overstays are practically entirely preventable through basic logistical planning:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Track Day 1:</strong> Your arrival date is Day 1, not Day 0. If you arrive at 11:45 PM on a Tuesday, that Tuesday counts as an entire day against your 30-day limit.</li>
                        <li><strong>Extend Early:</strong> If utilizing an agency like PT Indonesian Visas to extend your VoA or B211A, surrender your passport fundamentally 10-14 days before expiration. Waiting until day 28 guarantees a mechanical overlap into overstay status due to weekend government closures.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. FAQ on Overstays",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I just pretend I lost my passport to avoid the fine?</h4>
                        <p className="mode-aware-subtext text-sm">Absolutely not. Your passport’s biometric entry date is permanently logged in the digital Molina mainframe the second you pass the airport Autogate. Reporting it lost simply forces you to pay for an emergency travel document from your embassy, and you will still be fined heavily based on the mainframe's digital entry timestamp.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa Overstay Rules 2026 – Fines & Deportation"
            subtitle="The definitive guide to surviving Indonesian overstay penalties. Learn how the 1,000,000 IDR daily fine is calculated and how to escape the detention threshold."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
