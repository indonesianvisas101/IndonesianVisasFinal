import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Investor Visa Indonesia 2026 – PMA & KITAS Setup Guide",
        description: "The complete guide to obtaining an Investor KITAS (C313/C314) in Indonesia. Learn about the 10 Billion IDR capitalization rule, PMA setup, and timeline.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-types/investor-visa-indonesia`,
        }
    };
}

export default async function InvestorVisaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Visa Types", url: `/${locale}/visa-types` },
        { label: "Investor Visa Guide", url: `/${locale}/visa-types/investor-visa-indonesia` }
    ];

    const cta = {
        title: "Ready to Establish Your Indonesian Company?",
        desc: "Skip the bureaucratic red tape. Our corporate legal team perfectly structures your PMA to secure the 2-Year Investor KITAS rapidly and legally.",
        buttonText: "Inquire About Company Registration",
        link: `/${locale}/company-formation`
    };

    const sections = [
        {
            id: "what-is-investor-visa",
            title: "1. What is the Investor KITAS?",
            content: (
                <div className="space-y-4">
                    <p>
                        The Investor KITAS (Kartu Izin Tinggal Terbatas) is the premier residency permit for foreign entrepreneurs, investors, and business founders operating in Indonesia. It allows high-net-worth individuals and corporate directors to legally reside in the country to oversee their foreign-owned enterprise (PMA). 
                    </p>
                    <p>
                        Unlike the standard Working KITAS (C312), the Investor KITAS completely bypasses the grueling Ministry of Manpower (Depnaker) work permit process and exempts the holder from the mandatory $1,200 USD annual DPKK skill-training levy.
                    </p>
                </div>
            )
        },
        {
            id: "pma-requirements",
            title: "2. The PMA Prerequisite",
            content: (
                <div className="space-y-4">
                    <p>
                        To qualify for an Investor KITAS, you cannot simply be a passive stock market investor. You must establish or acquire shares in an Indonesian Foreign Investment Company (Penanaman Modal Asing - PMA). The PMA acts as the legal sponsor for your residency permit.
                    </p>
                    <p>
                        Setting up a PMA requires navigating the OSS (Online Single Submission) system, acquiring a NIB (Business Identification Number), and passing severe capitalization audits. The director structure typically requires a minimum of two individuals (at least one Director and one Commissioner).
                    </p>
                </div>
            )
        },
        {
            id: "capitalization-rules",
            title: "3. The 10 Billion IDR Capitalization Rule",
            content: (
                <div className="space-y-4">
                    <p>
                        In a move to prevent 'shell company' immigration fraud and attract genuine, high-impact foreign direct investment, the Indonesian Investment Coordination Board (BKPM) instituted massive capitalization thresholds. A standard PMA must now declare a minimum paid-up capital of <strong>10 Billion Indonesian Rupiah (approximately $650,000 USD)</strong>.
                    </p>
                    <p>
                        To individually qualify for the Investor KITAS under this corporate structure, the foreign national must hold a personal share valuation within the PMA equal to or exceeding <strong>1 Billion IDR (approx. $65,000 USD)</strong>, OR be legally appointed as a presiding Director or Commissioner on the company deed (Akta Perusahaan).
                    </p>
                </div>
            )
        },
        {
            id: "application-process",
            title: "4. The Application Process",
            content: (
                <div className="space-y-4">
                    <p>Assuming the PMA is fully established and OSS compliant, the visa process occurs in three main stages:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li><strong>Recommendation (BKPM):</strong> Securing authorization from the Investment Board validating your corporate standing and shareholding criteria.</li>
                        <li><strong>VITAS Issuance:</strong> Uploading the corporate deed, tax numbers (NPWP), and bank statements to the Directorate General of Immigration to issue the initial electronic Entry Visa (VITAS - Index C313 or C314).</li>
                        <li><strong>Onshore Conversion:</strong> Landing in Indonesia on the VITAS, submitting the passport to a local immigration office, completing biometrics, and acquiring the physical KITAS and Multiple Exit Re-Entry Permit (MERP).</li>
                    </ol>
                </div>
            )
        },
        {
            id: "benefits-limitations",
            title: "5. Benefits vs. Operational Limitations",
            content: (
                <div className="space-y-4">
                    <p>
                        The Investor KITAS grants profound benefits: a 1 or 2-year timeline without constant visa runs, exemption from the DPKK tax, unlimited international travel, and the ability to sponsor dependent spouses and children.
                    </p>
                    <h4 className="font-bold text-lg mt-4">The Work Restriction</h4>
                    <p>
                        A catastrophic misconception is that the Investor KITAS allows you to work any job within your own company. <strong>This is absolutely false.</strong> As an investor/director, you are legally permitted to oversee capital, sign contracts, dictate macro strategy, and hire employees. You are strictly forbidden from executing daily, operational, manual labor. (e.g., If you own a dive center PMA, you cannot personally instruct dive students; you must hire locals or secure a separate Working KITAS for that specific operational role).
                    </p>
                </div>
            )
        },
        {
            id: "government-fees",
            title: "6. Government Fees and Taxation",
            content: (
                <div className="space-y-4">
                    <p>
                        While you dodge the $1,200 USD DPKK, the issuance of the KITAS carries PNBP government charges. A 1-Year Investor KITAS (C313) incurs approximately 2,500,000 IDR in immigration fees. The 2-Year variant (C314) incurs approximately 3,800,000 IDR. Furthermore, the mandatory MERP (Multiple Exit Permit) adds an additional fee.
                    </p>
                    <p>
                        Beyond the visa cost, holding a PMA subjects your entity to corporate taxation (typically fixed at 22%), and holding an onshore Investor KITAS subjects your globally sourced income to Indonesian personal progressive tax brackets, triggering deep compliance reporting annually.
                    </p>
                </div>
            )
        },
        {
            id: "timeline",
            title: "7. Realistic Implementation Timeline",
            content: (
                <div className="space-y-4">
                    <p>
                        If the PMA currently exists and is fully compliant, the Investor KITAS application takes approximately <strong>14 to 21 working days</strong>.
                    </p>
                    <p>
                        However, if you are starting from scratch (requiring total corporate structuring, notary drafting, OSS registration, and initial capital injection), the timeline expands dramatically to <strong>6 to 8 weeks</strong>. Utilizing premium corporate legal services, like PT Indonesian Visas Agency, is non-negotiable to survive the intense initial auditing phases.
                    </p>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. Frequently Asked Questions (FAQ)",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I transition from a B211A Tourist Visa to an Investor KITAS without leaving?</h4>
                        <p className="mode-aware-subtext text-sm">Yes. In 2026, the government allows onshore conversions from a Visit Visa to a Limited Stay Permit (KITAS) without executing a costly 'visa run' to Singapore or Malaysia. This is a massive logistical benefit for founders currently scouting locations in Bali.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Investor Visa Indonesia 2026 – PMA & KITAS Setup Guide"
            subtitle="The ultimate roadmap for foreign founders. Eliminate work permit bureaucracy by establishing a PMA and securing the elite 2-Year Investor Residency Permit."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
