import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Business Visa Indonesia 2026 – Single & Multiple Entry Guide",
        description: "Your expert guide to the Indonesian Business Visa (B211B / D212). Learn about permitted commercial activities, corporate sponsorship, and multiple entry rules.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-types/business-visa-indonesia`,
        }
    };
}

export default async function BusinessVisaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Visa Types", url: `/${locale}/visa-types` },
        { label: "Business Visa Guide", url: `/${locale}/visa-types/business-visa-indonesia` }
    ];

    const cta = {
        title: "Secure Your B211B Business Visa",
        desc: "Need to attend a conference or inspect a factory? Let our corporate agency act as your official legal sponsor in Indonesia. Fast, secure eVisa processing.",
        buttonText: "Apply With Corporate Sponsorship",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "what-is-business-visa",
            title: "1. What is the Indonesian Business Visa?",
            content: (
                <div className="space-y-4">
                    <p>
                        The Indonesian Business Visa is an official entry permit for foreign nationals conducting commercial activities that do not involve taking up localized employment or generating direct revenue from an Indonesian entity. It bridges the gap between a standard tourist visa and a full corporate working residency.
                    </p>
                    <p>
                        This visa allows executives, delegates, buyers, and international consultants to legally operate within the Indonesian business theater without the staggering tax consequences or bureaucratic hurdles of a full Working KITAS.
                    </p>
                </div>
            )
        },
        {
            id: "single-vs-multiple",
            title: "2. Single vs Multiple Entry (B211B vs. D212)",
            content: (
                <div className="space-y-4">
                    <p>The Business Visa is distinctly split into two major indices, dictated entirely by your travel frequency requirements:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Index B211B (Single Entry):</strong> Structurally identical to the Tourist B211A, it grants 60 days upon landing and allows for two extensions onshore (yielding a max of 180 continuous days). If you leave the country, the visa instantly voids.</li>
                        <li><strong>Index D212 (Multiple Entry):</strong> Functionally designed for regional executives flying in and out of Jakarta. Valid for 1 to 5 years (depending on immigration approval). You can enter Indonesia an unlimited number of times within that year, BUT each individual stay is restricted strictly to a maximum of 60 days. You must leave the country on day 60.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "permitted-activities",
            title: "3. Permitted Business Activities",
            content: (
                <div className="space-y-4">
                    <p>With a verified Business Visa, you are legally shielded to perform the following commercial actions:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Attend corporate meetings, board seminars, and executive training sessions.</li>
                        <li>Conduct quality control inspections at Indonesian factories (e.g., assessing a garment manufacturer in Java).</li>
                        <li>Negotiate and sign contracts on behalf of a foreign employer.</li>
                        <li>Attend multi-day international conferences or professional trade exhibitions.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "prohibited-activities",
            title: "4. Danger Zone: Prohibited Activities",
            content: (
                <div className="space-y-4">
                    <p>
                        Immigration enforcement surrounding the Business Visa is extremely strict. A Business Visa is NOT a workaround for a Working KITAS. Disguising illegal employment under a business visa is the fastest route to an immigration raid and deportation. You cannot:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Accept a salary, commission, or regular payment derived from Indonesian territory in IDR.</li>
                        <li>Engage in daily, operational labor (e.g., you cannot supervise an active construction site, build software at a local desk, or train staff in a prolonged capacity).</li>
                        <li>Offer direct consulting services to local clients and invoice them directly.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "sponsorship",
            title: "5. The Absolute Sponsorship Requirement",
            content: (
                <div className="space-y-4">
                    <p>
                        A foreign national cannot self-sponsor a Business Visa. The Directorate General of Immigration mandates that a registered domestic entity mathematically 'invites' and vouches for the foreign professional. The sponsor assumes full liability for the applicant while inside Indonesian borders.
                    </p>
                    <p>
                        If you are meeting a local factory, they can draft an invitation letter to act as your sponsor. However, if you are attending a broad conference or lack a dedicated local partner, you must hire a verified corporate guarantor like PT Indonesian Visas Agency to legally sponsor your B211B entry.
                    </p>
                </div>
            )
        },
        {
            id: "documents",
            title: "6. Required Documentation",
            content: (
                <div className="space-y-4">
                    <p>Application requires profound corporate transparency. A standard B211B or D212 corporate application includes:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Foreign National's Passport (Minimum 6 to 18 months validity depending on Single vs Multiple Entry).</li>
                        <li>A formal Guarantee Letter and Invitation Letter drafted on official company letterhead by the Indonesian Sponsor.</li>
                        <li>High-resolution scans of the Sponsor's Corporate Legalities (NIB, SIUP, NPWP, and Director's ID Card).</li>
                        <li>Bank statements proving financial viability (typically holding a minimum of $2,000 USD).</li>
                        <li>Return or onward flight tickets.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "process",
            title: "7. Application Workflow and Extensions",
            content: (
                <div className="space-y-4">
                    <p>
                        The initial application is processed fully online via the Molina eVisa system by the sponsoring entity. Approval takes exactly 5 to 7 business days, resulting in an eVisa PDF.
                    </p>
                    <p>
                        If you arrive on a B211B Single Entry and require an onshore extension at day 50, your sponsor must lodge the extension paperwork with the local Kantor Imigrasi. As the applicant, you must be physically present for one brief biometric processing appointment per 60-day extension block. If you arrive on a D212 Multiple Entry, you cannot extend onshore; you absolutely must board an international flight before your 60-day perimeter collapses.
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
                        <h4 className="font-bold text-primary mb-2">Can an individual act as my Business Visa sponsor?</h4>
                        <p className="mode-aware-subtext text-sm">No. A B211B explicitly requires a corporate entity (PT or PMA). Only the B211A Social/Cultural visa permits an individual citizen sponsor.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Business Visa Indonesia 2026 – Single & Multiple Entry Guide"
            subtitle="Navigate Indonesian commercial regulations legally. Master the critical differences between the B211B and D212 business permutations."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
