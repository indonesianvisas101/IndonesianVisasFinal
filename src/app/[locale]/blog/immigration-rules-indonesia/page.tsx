import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Bali Immigration Rules 2026 – A Deep Dive Blog",
        description: "Everything you need to know about Indonesian immigration law in 2026. Review local prohibitions, reporting mandates, and legal expat compliance.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/blog/immigration-rules-indonesia`,
        }
    };
}

export default async function ImmigrationBlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Blog", url: `/${locale}/blog` },
        { label: "Immigration Rules Blog", url: `/${locale}/blog/immigration-rules-indonesia` }
    ];

    const cta = {
        title: "Concerned About Compliance?",
        desc: "Don't gamble with your immigration status. Our legal audit service reviews your current visa and ensures you are 100% compliant with 2026 laws.",
        buttonText: "Request Legal Audit",
        link: `/${locale}/contact`
    };

    const sections = [
        {
            id: "new-era",
            title: "1. A New Era of Enforcement",
            content: (
                <div className="space-y-4">
                    <p>
                        If you haven't visited Indonesia since 2019, you are in for a shock. The "Old Ways" of paying off overstays with a smile and a handshake are finished. In 2026, the Directorate General of Immigration (DITJENIM) is a high-tech, data-driven machine. With facial recognition cameras at every major port and synchronized bank/tax databases, "staying under the radar" is no longer a viable strategy for expats.
                    </p>
                </div>
            )
        },
        {
            id: "sponsorship-mandate",
            title: "2. The Sponsorship Mandate",
            content: (
                <div className="space-y-4">
                    <p>
                        In 2026, the concept of a "Self-Sponsored" tourist visa for long-term stays is practically dead. Every B211A and KITAS requires an Indonesian guarantor. This structure ensures that for every foreigner in the country, there is a local entity accountable for their taxes, behavior, and eventual departure. Choosing a corporate sponsor like PT Indonesian Visas Agency is the safest move for long-term travelers.
                    </p>
                </div>
            )
        },
        {
            id: "activity-zones",
            title: "3. Activity Zones: Working vs. Visiting",
            content: (
                <div className="space-y-4">
                    <p>
                        One of the most common blog queries is: "Can I work in a coworking space on a tourist visa?" Technically, yes, if you are working for a foreign employer. However, the moment your activity impacts the local economy (e.g., selling products, training locals, taking local money), you've crossed into the "Work Zone" which requires a Working KITAS. 2026 raids are focused specifically on identifying this crossover.
                    </p>
                </div>
            )
        },
        {
            id: "reporting-banjar",
            title: "4. The 'Banjar' Reporting Rule",
            content: (
                <div className="space-y-4">
                    <p>
                        Every neighborhood in Bali is governed by a Banjar (local community council). By law, every foreigner staying in a private villa must be reported to the Banjar by the owner or manager. This is recorded in the "Sistem Informasi Manajemen Keimigrasian" (SIMKIM). If you move villas, you must ensure you are reported again at the new location.
                    </p>
                </div>
            )
        },
        {
            id: "deportation-reality",
            title: "5. The Reality of Deportation",
            content: (
                <div className="space-y-4">
                    <p>
                        Deportation in 2026 is a streamlined process. If you are caught violating visa rules, you aren't just given a fine and asked to leave. You are usually detained in Jimbaran or Jakarta, your passport is flagged globally on the ICAO database, and you are forcibly escorted to a flight. You will then be banned from Indonesia for a minimum of 6 months, and often up to 5 years.
                    </p>
                </div>
            )
        },
        {
            id: "kitas-legalities",
            title: "6. KITAS Legalities & Tax IDs",
            content: (
                <div className="space-y-4">
                    <p>
                        Holding a KITAS (Residency Permit) is a privilege that comes with the legal obligation to hold an NPWP (Tax ID). In 2026, immigration and the tax department (DJP) are heavily integrated. Renewing your KITAS often requires proof of your tax filing. If you have been living in Bali for 3 years without paying taxes, expect your residency permit renewal to be blocked.
                    </p>
                </div>
            )
        },
        {
            id: "electronic-tracking",
            title: "7. Electronic Tracking & QR Codes",
            content: (
                <div className="space-y-4">
                    <p>
                        Your visa is no longer just a sticker. It is a QR code in the national database. Police and immigration officers in 2026 carry handheld scanners. During a routine stop, they can scan your visa's QR code (from your phone or passport) and instantly see your sponsor, your registered address, and how many days you have remaining.
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
                        <h4 className="font-bold text-primary mb-2">Can I be deported for a traffic ticket?</h4>
                        <p className="mode-aware-subtext text-sm">Usually no, unless the violation is severe (e.g., drunk driving causing injury) or if it reveals you are riding without a license and proper visa. Repeated criminal behavior of any kind is a valid ground for 'Administrative Departure' (Deportation).</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Bali Immigration Rules 2026 – A Deep Dive Blog"
            subtitle="The 2026 rulebook for expats and long-term tourists. Understand every regulation from Banjar reporting to digital QR tracking."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
