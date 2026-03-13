import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Understanding Indonesia KITAS 2026 – Complete Residence Permit Guide",
        description: "The complete 2026 guide to obtaining an Indonesian KITAS (Kartu Izin Tinggal Terbatas). Explore Working, Investor, Retirement, and Family KITAS regulations.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-types/kitas-indonesia`,
        }
    };
}

export default async function KitasVisaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Visa Types", url: `/${locale}/visa-types` },
        { label: "Indonesia KITAS Guide", url: `/${locale}/visa-types/kitas-indonesia` }
    ];

    const cta = {
        title: "Ready to Become an Indonesian Resident?",
        desc: "Upgrading to a KITAS involves immense bureaucratic coordination. Let our elite legal team handle your employer sponsorship, PMA establishment, or retirement visa seamlessly.",
        buttonText: "Schedule a Consultation",
        link: `/${locale}/contact`
    };

    const sections = [
        {
            id: "what-is-kitas",
            title: "1. What is a KITAS?",
            content: (
                <div className="space-y-4">
                    <p>
                        A KITAS (Kartu Izin Tinggal Terbatas) translates directly to "Limited Stay Permit Card." Earning a KITAS is the primary mechanism by which a foreign national transitions from a temporary visitor traversing on a B211A or VoA into an official, legally recognized resident of the Republic of Indonesia. 
                    </p>
                    <p>
                        A KITAS fundamentally changes your relationship with the state. You depart the realm of immigration oversight solely focusing on tourism and enter the domain of the Ministry of Manpower, local taxation offices (Dirjen Pajak), and civil registries.
                    </p>
                </div>
            )
        },
        {
            id: "categories",
            title: "2. Understanding the Core KITAS Categories",
            content: (
                <div className="space-y-4">
                    <p>The government issues KITAS permits strictly based on distinct legal logic. You cannot simply "buy" a KITAS; you must satisfy a socioeconomic category:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Working KITAS (C312):</strong> Sponsored exclusively by an Indonesian company (PT or PMA). Grants the explicit legal right to earn localized income in IDR.</li>
                        <li><strong>Investor KITAS (C313 / C314):</strong> Restricted to shareholders and directors of a Foreign Investment Company (PMA). Valid for 1 or 2 years, primarily granting oversight and financial management rights without the high corporate taxes associated with a standard work permit.</li>
                        <li><strong>Spouse & Family KITAS (C317):</strong> For foreign nationals legally married to Indonesian citizens, or children joining parents who already possess a valid KITAS/KITAP.</li>
                        <li><strong>Retirement KITAS (C319):</strong> Designed for senior expats (aged 60 and over) possessing verified pension income and substantial local savings. Working is strictly forbidden.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "privileges",
            title: "3. The Privileges of Residency",
            content: (
                <div className="space-y-4">
                    <p>Residing in Indonesia on a KITAS unlocks a dramatically superior lifestyle compared to perpetual 'visa running' or renewing Tourist Visas.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Banking Autonomy:</strong> Overcome the fierce compliance laws blocking tourists and open high-tier local bank accounts, secure credit cards, and transfer vast sums via standard Indonesian banking arteries.</li>
                        <li><strong>Asset Registration:</strong> Purchase and federally register vehicles (cars and motorcycles) legally under your own foreign name without utilizing dangerous local nominee structures.</li>
                        <li><strong>Multiple Re-Entry:</strong> A KITAS acts inherently as a Multiple Entry Permit (MERP). You can fly in and out of Ngurah Rai or Soekarno-Hatta airports at will using digital autogates without paying visa issuance fees.</li>
                        <li><strong>Local Economies:</strong> Qualify for profound local discounts at national parks, premium hospitals, gym memberships, and domestic airlines.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "tax-obligations",
            title: "4. NPWP and Local Tax Obligations",
            content: (
                <div className="space-y-4">
                    <p>
                        Acquiring a KITAS instantly subjects you to the Indonesian fiscal framework. Within a few weeks of your KITAS being issued, you (or your corporate sponsor) must apply for an NPWP (Nomor Pokok Wajib Pajak)—a National Tax ID number.
                    </p>
                    <p>
                        If you hold a Working KITAS (C312), your employer will deduct progressive income tax (PPh 21) from your localized salary, paying it directly to the state. Even if your income is sourced overseas (such as holding a Spouse or Investor KITAS while living passively), remaining in Indonesia for over 183 days within a 12-month sequence legally designates you as an Indonesian Tax Resident, requiring annual tax reporting of global income.
                    </p>
                </div>
            )
        },
        {
            id: "sponsor-requirements",
            title: "5. The Heavy Burden of Sponsorship",
            content: (
                <div className="space-y-4">
                    <p>
                        The Directorate General of Immigration dictates that every single foreign resident must be irrevocably tied to an Indonesian sponsor. This sponsor acts as a legal guarantor, financially and civilly responsible for the foreigner's behavior, taxation, and potential deportation costs.
                    </p>
                    <p>
                        For a Working KITAS, the sponsoring company must wade through heavy Ministry of Manpower (Depnaker) bureaucracy to secure an RPTKA (Expatriate Placement Plan). They must legally prove that the specific skills of the foreigner cannot be fulfilled by a local Indonesian citizen, and pay a mandatory $1,200 USD DPKK skills-training fund levy directly to the government.
                    </p>
                </div>
            )
        },
        {
            id: "timeline",
            title: "6. The Application Timeline",
            content: (
                <div className="space-y-4">
                    <p>Transitioning to a KITAS is not an overnight process. Depending on the complexity of corporate structuring (for Investors or Workers), the timeline is substantial.</p>
                    <p>
                        <strong>Phase 1 (14-30 Days):</strong> Securing authorization from the Ministry of Manpower (for C312) or the Investment Coordination Board BKPM (for C313/C314). <br/>
                        <strong>Phase 2 (5-10 Days):</strong> The issuance of the initial eVisa (VITAS) from the Directorate General of Immigration. <br/>
                        <strong>Phase 3 (7-14 Days):</strong> Entering Indonesia on the VITAS, relinquishing the passport to the local immigration office, completing biometrics, and awaiting the finalized KITAS card.
                    </p>
                </div>
            )
        },
        {
            id: "renewal",
            title: "7. Renewal and the Path to KITAP (Permanent Residency)",
            content: (
                <div className="space-y-4">
                    <p>
                        Most KITAS variants are issued for 12 months. Approaching the end of this year, you must initiate a complex renewal process. Thankfully, unlike tourist visas, you do not need to leave the country; the renewal is performed entirely onshore.
                    </p>
                    <p>
                        The ultimate goal for many is the <strong>KITAP (Kartu Izin Tinggal Tetap)</strong>, valid for 5 years and effectively granting permanent residency. Generally, a foreign national becomes eligible to convert a KITAS into a KITAP after holding the same KITAS sponsor continuously for three to five years, depending heavily on the specific visa category (Spouse KITAS holders enjoy the fastest track to permanent residency).
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
                        <h4 className="font-bold text-primary mb-2">Can I work on an Investor KITAS?</h4>
                        <p className="mode-aware-subtext text-sm">No. The Investor KITAS (C313/C314) allows you to direct the company, monitor capital, and sign contracts at an executive level. It specifically prohibits you from engaging in the operational, daily manual labor of the business. Doing so requires a Working KITAS.</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10 mt-4">
                        <h4 className="font-bold text-primary mb-2">Can my family join me if I hold a Working KITAS?</h4>
                        <p className="mode-aware-subtext text-sm">Yes. Holding a Working or Investor KITAS entitles you to act as the primary sponsor for your legal spouse and children under 18. They will be issued a Dependent KITAS (Index C317) tied directly to the validity of your primary permit.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Understanding Indonesia KITAS 2026 – Complete Residence Permit Guide"
            subtitle="Transition dynamically from a tourist into a fully legally compliant Indonesian resident. Master the differences between Working, Investor, and Family KITAS."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
