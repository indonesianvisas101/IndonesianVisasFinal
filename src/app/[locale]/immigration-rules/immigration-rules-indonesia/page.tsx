import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Immigration Rules Indonesia 2026 – Ensure Your Compliance",
        description: "A comprehensive overview of Indonesian immigration laws for 2026. Learn about sponsorship mandates, deportation triggers, and the national blacklist system.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/immigration-rules/immigration-rules-indonesia`,
        }
    };
}

export default async function ImmigrationRulesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Immigration Rules", url: `/${locale}/immigration-rules` },
        { label: "Rules Overview", url: `/${locale}/immigration-rules/immigration-rules-indonesia` }
    ];

    const cta = {
        title: "Facing an Immigration Issue?",
        desc: "Our severe operations division handles missing passports, overstay negotiations, and complex visa conversions. Secure legal counsel immediately.",
        buttonText: "Contact Legal Team",
        link: `/${locale}/contact`
    };

    const sections = [
        {
            id: "overview",
            title: "1. Overview of 2026 Immigration Law",
            content: (
                <div className="space-y-4">
                    <p>
                        The Directorate General of Immigration in Jakarta operates under a mandate of absolute sovereignty. Following significant localized issues in regions like Bali in recent years, the 2026 immigration framework represents a distinct tightening of regulations. The era of casual enforcement is over; digital tracking, immediate fines, and zero-tolerance deportation policies are the new reality for foreign nationals in the Republic of Indonesia.
                    </p>
                </div>
            )
        },
        {
            id: "entry-exit",
            title: "2. Rigid Entry and Exit Protocols",
            content: (
                <div className="space-y-4">
                    <p>To cross into Indonesian territory, regardless of your visa class, four non-negotiable elements must be satisfied:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>A pristine passport carrying precisely a minimum of 6 calendar months of validity.</li>
                        <li>A legally matched Visa index that perfectly aligns with your intended physical activities.</li>
                        <li>A verified departure ticket exiting the archipelago prior to your visa's maximum extendable limit.</li>
                        <li>An approved Electronic Customs Declaration (e-CD) QR code.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "sponsorship",
            title: "3. The Mandatory Sponsorship System",
            content: (
                <div className="space-y-4">
                    <p>
                        Unlike Western nations where visas are often issued directly to the individual on their own merit, Indonesian immigration architecture is deeply reliant on the <strong>Guarantor (Sponsor) System</strong>. 
                    </p>
                    <p>
                        For long-term B211A Visit Visas, Working KITAS, and Investor KITAS permits, an Indonesian corporate entity (or citizen in specific cases) must formally anchor your application. This sponsor holds severe civil and financial liability for your actions. If you violate local laws, your sponsor shares the legal fallout, which is why utilizing a highly vetted corporate agency like PT Indonesian Visas is paramount.
                    </p>
                </div>
            )
        },
        {
            id: "address-reporting",
            title: "4. Address Reporting (SKTT)",
            content: (
                <div className="space-y-4">
                    <p>
                        If you transition from a tourist Visa (VoA/B211A) to a residential KITAS, you are legally mandated by the Capil (Civil Registry) to possess an SKTT (Surat Keterangan Tempat Tinggal) – essentially a local residential ID card. Failing to properly register your localized Bali or Jakarta address with the village head (Kepala Desa) and civil registry violates core residency laws, potentially threatening your KITAS renewal.
                    </p>
                </div>
            )
        },
        {
            id: "digital-tracking",
            title: "5. Digital Tracking and Autogates",
            content: (
                <div className="space-y-4">
                    <p>
                        Inter-island travel within Indonesia is electronically monitored. Domestic flights requiring your passport cross-reference your current visa status against the national immigration mainframe at boarding. If your visa is flagged as expired in the system, you will be intercepted at domestic checkpoints in Bali or Jakarta before you can even board a flight to Lombok or Sumba.
                    </p>
                </div>
            )
        },
        {
            id: "deportation-triggers",
            title: "6. Immediate Deportation Triggers",
            content: (
                <div className="space-y-4">
                    <p>The Directorate General maintains a fast-track deportation division. Actions resulting in swift removal from the country include:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Working Illegally:</strong> The highest offense. Opening a laptop in a cafe and coding for an Indonesian client without a Working KITAS.</li>
                        <li><strong>Disrespecting Symbols:</strong> Posing improperly at Hindu temples in Bali or desecrating absolute national monuments.</li>
                        <li><strong>Overstaying:</strong> Exceeding the 60-day absolute overstay limit threshold without exiting or settling fines.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "blacklist",
            title: "7. The Blacklist System (Penangkalan)",
            content: (
                <div className="space-y-4">
                    <p>
                        Deportation is rarely isolated. It is almost universally accompanied by placement on the National Immigration Blacklist (Daftar Penangkalan). The standard blacklist bans a foreigner from returning to Indonesia for <strong>a minimum of 6 continuous months</strong>. Severe offenses trigger a lifetime ban. This blacklist is shared regionally, complicating your future visa applications to neighboring ASEAN nations like Singapore and Malaysia.
                    </p>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. Frequently Asked Questions",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can my sponsor cancel my visa unilaterally?</h4>
                        <p className="mode-aware-subtext text-sm">Yes. If your corporate sponsor (or local Indonesian spouse) formally withdraws their letter of guarantee at the immigration office, you have exactly 7 days (EPO - Exit Permit Only) to pack up your life and fly out of Indonesia.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Immigration Rules Indonesia 2026 – Ensure Your Compliance"
            subtitle="An authoritative breakdown of the stringent 2026 legal framework governing foreign nationals. Master the sponsorship rules to protect your stay."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
