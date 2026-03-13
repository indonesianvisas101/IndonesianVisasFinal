import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Bali Visa vs Malaysia Visa 2026 – Neighboring Policy Comparison",
        description: "Compare Indonesian (Bali) visa regulations against Malaysia's DE Rantau and MM2H programs. Discover which neighbor offers better long-term residency in 2026.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/comparisons/bali-visa-vs-malaysia-visa`,
        }
    };
}

export default async function BaliVsMalaysiaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Comparisons", url: `/${locale}/comparisons` },
        { label: "Bali vs Malaysia", url: `/${locale}/comparisons/bali-visa-vs-malaysia-visa` }
    ];

    const cta = {
        title: "Ready to Choose Bali?",
        desc: "Don't let Malaysian bureaucracy slow you down. Our Indonesian visa processing is the fastest in the region. Apply for your e-VoA or B211A in minutes.",
        buttonText: "Start My Bali Visa",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "introduction",
            title: "1. Bali vs Malaysia: The Digital Gateway",
            content: (
                <div className="space-y-4">
                    <p>
                        Indonesia and Malaysia share a border, but their immigration philosophies are worlds apart. While Malaysia has leaned heavily into formalized nomad permits like DE Rantau, Indonesia has optimized its B211A "Visit Visa" to act as a pseudo-residency permit for the Bali community. For travelers in 2026, the choice often comes down to the style of living: the raw island energy of Bali or the urban convenience of Kuala Lumpur.
                    </p>
                </div>
            )
        },
        {
            id: "entry-freedom",
            title: "2. Entry Freedom and Visa-Free Access",
            content: (
                <div className="space-y-4">
                    <p><strong>Malaysia:</strong> Traditionally much more open. Most Western nationalities receive a 90-day free entry stamp (Visa Exemption) upon arrival. No payment, no paperwork.</p>
                    <p><strong>Indonesia (Bali):</strong> Requires a paid 30-day Visa on Arrival (VoA) for $35 USD. Malaysia is the clear winner for casual, short-term backpackers who want zero overhead.</p>
                </div>
            )
        },
        {
            id: "digital-nomad-hubs",
            title: "3. Digital Nomad Permits (DE Rantau vs B211A)",
            content: (
                <div className="space-y-4">
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Malaysia DE Rantau:</strong> A dedicated Professional Visit Pass for remote workers. It requires a minimum annual income of $24k USD and is valid for 12 months. It's a high-tier, professionalized permit.</li>
                        <li><strong>Indonesia B211A:</strong> Technically a "Visit Visa" but used by 90% of Bali's nomads. Valid for 60 days, extendable twice (180 total). It doesn't require income proof but does require corporate sponsorship.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "residency",
            title: "4. Retirement & Residency (MM2H vs KITAS)",
            content: (
                <div className="space-y-4">
                    <p>
                        For long-term expats:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Malaysia MM2H:</strong> Has undergone multiple price hikes, now requiring significant fixed deposits and high monthly income. It is effectively a luxury residency program.</li>
                        <li><strong>Indonesia Retirement KITAS:</strong> Accessible to anyone over 60 with a modest pension and local insurance. For retirees, Indonesia (particularly Bali) is much more accessible and affordable than the current MM2H tiers.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "costs-of-stay",
            title: "5. Total Costs of Stay",
            content: (
                <div className="space-y-4">
                    <p>
                        If you are staying for 6 months:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Malaysia:</strong> Free entry (renewed by a 'visa run' to Singapore) or DE Rantau fees.</li>
                        <li><strong>Indonesia:</strong> Initial B211A eVisa (~$180) + two extensions (~$180 each). Total visa cost for 6 months is approx. $540 USD.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "enforcement",
            title: "6. Enforcement and Blacklists",
            content: (
                <div className="space-y-4">
                    <p>
                        Both countries take overstays seriously. Malaysia is known for "cleaning up" visa runners who bounce in and out from Singapore too many times. Indonesia (Bali) and Jakarta immigration are currently hyper-active in raiding coworking spaces and villas to find anyone working without the correct designation. Indonesia's $65/day overstay fine is significantly more punishing than Malaysia's current administrative fines.
                    </p>
                </div>
            )
        },
        {
            id: "banking",
            title: "7. Banking and Infrastructure",
            content: (
                <div className="space-y-4">
                    <p>
                        Malaysia allows nomads on DE Rantau to open local bank accounts relatively easily. In Indonesia, you generally require a KITAS (Residency Permit) to open a full-tier bank account at BCA or Mandiri. Tourists on B211A visas are often restricted to the more limited 'Tourist Accounts'.
                    </p>
                </div>
            )
        },
        {
            id: "verdict",
            title: "8. The 2026 Comparison Verdict",
            content: (
                <div className="space-y-4">
                    <p>
                        <strong>Choose Malaysia if:</strong> You want 90-day free entry, lower bureaucratic overhead, and the convenience of a modern city-state infrastructure.
                    </p>
                    <p>
                        <strong>Choose Bali/Indonesia if:</strong> You seek a deeper cultural immersion, world-class coworking communities, and are willing to pay for the "agency-led" visa ecosystem to secure a longer continuous stay.
                    </p>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Bali Visa vs Malaysia Visa 2026 – Neighboring Policy Comparison"
            subtitle="Understand why Bali's visa system attracts more nomads than Malaysia's DE Rantau. Compare 2026 costs, timelines, and residency options."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
