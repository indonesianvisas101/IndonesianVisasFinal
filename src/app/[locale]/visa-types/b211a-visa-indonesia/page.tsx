import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "B211A Visa Indonesia 2026 – Complete Application & Extension Guide",
        description: "Everything you need to know about the B211A Tourist & Social Visit Visa in Indonesia. Learn about the 60-day limit, 180-day extensions, costs, and agency sponsorship.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-types/b211a-visa-indonesia`,
        }
    };
}

export default async function B211A_VisaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Visa Types", url: `/${locale}/visa-types` },
        { label: "B211A Visa Guide", url: `/${locale}/visa-types/b211a-visa-indonesia` }
    ];

    const cta = {
        title: "Ready to Apply for Your B211A Visa?",
        desc: "We provide full corporate sponsorship and handle 100% of the Directorate General of Immigration paperwork. Get your e-Visa delivered to your inbox.",
        buttonText: "Start B211A Application",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. Overview of the B211A Visit Visa",
            content: (
                <div className="space-y-4">
                    <p>
                        The B211A Single Entry Visit Visa is arguably the most popular and versatile visa for foreign nationals looking to spend extended time in Indonesia, particularly in digital nomad hubs like Bali, Jakarta, and Lombok. Unlike the Visa on Arrival (VoA) which taps out at 60 days, the B211A provides a pathway for an uninterrupted stay of up to 180 days (approximately 6 months).
                    </p>
                    <p>
                        Categorized as a "Visit Visa", it strictly prohibits the holder from taking up localized employment or generating revenue from Indonesian entities. It is explicitly designed for tourism, social/cultural visits, visiting family/friends, attending non-profit seminars, or engaging in remote work where the employer is headquartered outside of the Republic of Indonesia.
                    </p>
                </div>
            )
        },
        {
            id: "who-needs-this",
            title: "2. Who Should Apply for the B211A?",
            content: (
                <div className="space-y-4">
                    <p>
                        You should opt for the B211A visa over the standard Visa on Arrival if your situation matches any of the following criteria:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Digital Nomads & Remote Workers:</strong> You plan to reside in Indonesia for several months while working for a foreign company.</li>
                        <li><strong>Slow Travelers:</strong> You intend to explore the vast archipelago extensively without the stress of an impending 30-day exit deadline.</li>
                        <li><strong>Retirees:</strong> You wish to spend a long winter season in a tropical climate but aren't ready to commit to a full Retirement KITAS.</li>
                        <li><strong>Ineligible Nationalities:</strong> Your passport is not included in the 97-country Visa on Arrival list, making a pre-approved visa your only legal entry method.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "requirements",
            title: "3. Legal Requirements for B211A",
            content: (
                <div className="space-y-4">
                    <p>
                        The Directorate General of Immigration enforces strict document compliance for all B211A applications. The defining feature of this visa is the <strong>Sponsorship Requirement</strong>. A B211A cannot be applied for independently by a foreign national; it requires a guarantor.
                    </p>
                    <p>
                        The guarantor can be an Indonesian citizen (for Social/Cultural visits) or a registered Indonesian corporate entity (for Tourism/Business). Using an established agency like PT Indonesian Visas Agency as your corporate sponsor is the safest route, as it completely shields you from local bureaucratic liability and guarantees a smooth extension process later on.
                    </p>
                </div>
            )
        },
        {
            id: "documents-needed",
            title: "4. Required Documents Checklist",
            content: (
                <div className="space-y-4">
                    <p>If utilizing PT Indonesian Visas Agency as your sponsor, the documentation is minimal and digital. You only need to provide:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>A high-resolution color scan of your passport's bio-data page. The passport must have a minimum of 6 months validity from your intended date of entry.</li>
                        <li>A recent passport-sized photograph (color, formal attire, any solid background).</li>
                        <li>Proof of onward travel (a flight ticket exiting Indonesia within the 60-day initial period).</li>
                        <li>Bank statements proving sufficient financial means (a minimum balance of $2,000 USD equivalent) to support yourself during your stay without resorting to local labor.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "application-process",
            title: "5. The Application Process (Step-by-Step)",
            content: (
                <div className="space-y-4">
                    <p>
                        The great advantage of the B211A in 2026 is that it is a fully digital e-Visa. You do not need to visit an Indonesian embassy in your home country.
                    </p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li><strong>Submit Documents:</strong> Upload your passport, photo, and bank statement via our secure portal.</li>
                        <li><strong>Payment:</strong> Clear the agency sponsorship fee and government visa levy.</li>
                        <li><strong>Processing:</strong> Our legal team drafts the corporate sponsorship letters and submits the application via the official Molina system to the Immigration Directorate in Jakarta.</li>
                        <li><strong>Issuance:</strong> Within 3 to 7 business days, the approved e-Visa (a PDF document with a verifiable QR code) is emailed directly to you.</li>
                        <li><strong>Entry:</strong> Print the e-Visa or show it on your phone alongside your passport at the immigration clearance desk.</li>
                    </ol>
                </div>
            )
        },
        {
            id: "processing-time",
            title: "6. Processing Time & Expedited Options",
            content: (
                <div className="space-y-4">
                    <p>
                        Standard processing for a B211A e-Visa takes approximately 5 to 7 business days. However, immigration processing does not occur on Indonesian national holidays or weekends.
                    </p>
                    <p>
                        For travelers requiring urgent entry, PT Indonesian Visas Agency offers <strong>VIP Expedited Processing</strong>. Leveraging dedicated agency channels, we can secure e-Visa approval in 24 to 48 hours for an additional premium. This is highly recommended if your flight departs within the week.
                    </p>
                </div>
            )
        },
        {
            id: "costs",
            title: "7. Government Fees and Agency Sponsorship Costs",
            content: (
                <div className="space-y-4">
                    <p>
                        Transparency in pricing is crucial. The raw PNBP (Non-Tax State Revenue) fee set by the Indonesian government for the B211A 60-day visa is 2,000,000 IDR (which includes a 1,500,000 IDR visa fee and a 500,000 IDR verification fee).
                    </p>
                    <p>
                        When utilizing an agency, you are paying for the vital corporate sponsorship, document normalization, and continuous legal support. Total comprehensive packages typically range between 2,800,000 IDR to 3,500,000 IDR. This upfront slightly higher cost guarantees zero embassy visits and seamless processing.
                    </p>
                </div>
            )
        },
        {
            id: "extension-rules",
            title: "8. Extension Rules and the 180-Day Timeline",
            content: (
                <div className="space-y-4">
                    <p>
                        The true power of the B211A lies in its extension capability. Upon landing, you are granted exactly 60 days. You may extend this visa <strong>two times</strong>. Each extension grants an additional 60 days.
                    </p>
                    <p>
                        <strong>Total Calculation:</strong> (Initial 60 Days) + (Extension 1: 60 Days) + (Extension 2: 60 Days) = <strong>180 Days Total Maximum Stay.</strong>
                    </p>
                    <p>
                        <strong>CRITICAL RULE:</strong> You must initiate the extension process with your agency sponsor at least 14 days before your current visa expires. The extension process requires you to physically visit a local Kantor Imigrasi (Immigration Office) once per extension to perform biometric scanning (fingerprints and a digital photograph). Failing to extend on time triggers the devastating 1,000,000 IDR daily overstay fine.
                    </p>
                </div>
            )
        },
        {
            id: "common-mistakes",
            title: "9. Common Mistakes That Lead to Rejection",
            content: (
                <div className="space-y-4">
                    <p>
                        e-Visa rejections are non-refundable. The most frequent errors leading to application denial include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Passport Quality:</strong> Submitting a blurry, heavily compressed, or glare-filled photograph of the passport bio-page. The MRZ code must be perfectly legible.</li>
                        <li><strong>Validity Issues:</strong> Applying with a passport that expires in 5 months. It must be 6 months minimum from the exact date of entry in Indonesia.</li>
                        <li><strong>Blacklist Status:</strong> Attempting to apply shortly after a previous overstay deportation without waiting out the mandatory 6-month Red Notice period.</li>
                        <li><strong>Missing Onward Flight:</strong> Failing to provide a confirmed flight ticket leaving Indonesia within the initial 60-day block.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "faq",
            title: "10. Frequently Asked Questions (FAQ)",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Is the B211A Multiple Entry?</h4>
                        <p className="mode-aware-subtext text-sm">No. It is strictly a Single Entry visa. If you depart Indonesia on day 45 to visit Singapore for the weekend, your B211A is immediately canceled, and you forfeit any remaining days or planned extensions.</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10 mt-4">
                        <h4 className="font-bold text-primary mb-2">Can I work remotely on a B211A?</h4>
                        <p className="mode-aware-subtext text-sm">Yes, long-term remote work is generally permitted so long as your direct employer, client base, and source of revenue are entirely located outside the territory of Indonesia. You cannot sell goods locally or take a salary in Rupiah from an Indonesian company.</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10 mt-4">
                        <h4 className="font-bold text-primary mb-2">Do I need to leave my passport at immigration during extensions?</h4>
                        <p className="mode-aware-subtext text-sm">Yes. Your physical passport is held by the local immigration office for approximately 7 to 10 days while the extension bureaucracy is finalized and the new stamp is applied. Do not book domestic flights during this processing window.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="B211A Visit Visa: The Ultimate Guide for Digital Nomads & Slow Travelers"
            subtitle="Understand every regulation, cost, and strict extension timeline associated with Indonesia’s highest-demand medium-term stay visa for 2026."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
