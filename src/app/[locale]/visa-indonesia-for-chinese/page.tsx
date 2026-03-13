import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Requirements for Chinese Citizens 2026 – Complete Guide",
        description: "Official 2026 visa guide for Chinese passport holders visiting Indonesia. Master the e-VoA system, B211A applications, and extension rules.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-indonesia-for-chinese`,
        }
    };
}

export default async function VisaForChinesePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Guides", url: `/${locale}/guides` },
        { label: "Visa Guide for Chinese Citizens", url: `/${locale}/visa-indonesia-for-chinese` }
    ];

    const cta = {
        title: "Expert Visa Support for Chinese Nationals",
        desc: "Need an onshore extension or a long-term corporate B211A? Our legal team guarantees seamless immigration processing for Chinese passports.",
        buttonText: "Start Application Today",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "requirements",
            title: "1. Visa Requirements for Chinese Citizens",
            content: (
                <div className="space-y-4">
                    <p>Chinese citizens (PRC passport holders) are rigidly required to hold a valid visa to legally cross Indonesian borders. The previous free-entry policy has been definitively eliminated.</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "2. Direct Flights and Airport Autogates",
            content: (
                <div className="space-y-4">
                    <p>With massive daily flight volume from Shanghai, Beijing, and Guangzhou directly into Bali (DPS) and Jakarta (CGK), Indonesian immigration has heavily optimized processing for Chinese nationals. By holding an electronic e-VoA or an e-B211A, Chinese travelers can completely bypass manual immigration counters and utilize the facial-recognition Autogates for entry in roughly 30 seconds.</p>
                </div>
            )
        },
        {
            id: "30-day-limit",
            title: "3. The 30-Day VoA Limit",
            content: (
                <div className="space-y-4">
                    <p>The standard Visa on Arrival provides an initial stay of exactly 30 days. If you plan to tour Java, cruise to Komodo, and stay in Bali longer than a month, you must actively apply for an onshore extension. The VoA cannot be physically extended past 60 total days.</p>
                </div>
            )
        },
        {
            id: "documents",
            title: "4. Exact Document Checklist",
            content: (
                <div className="space-y-4">
                    <p>Chinese visa approvals hinge on precise documentation:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Passport:</strong> Minimum 6 full months of validity. Heavily worn or damaged pages will trigger deportation.</li>
                        <li><strong>Return Flight:</strong> Mandatory. You must show the airline in China a confirmed ticket out of Indonesia.</li>
                        <li><strong>Financial Means:</strong> While rare for VoA, immigration may request proof of $2,000 USD (or equivalent RMB) in your online banking app if you attempt to apply for B211A visas dynamically.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "evoa-tutorial",
            title: "5. e-VoA Application Tutorial",
            content: (
                <div className="space-y-4">
                    <p>Applying online is the singular most efficient pathway. Navigate to the immigration Molina portal prior to leaving China. Upload your passport photo data. Pay the 500,000 IDR PNBP fee instantly using an international credit network capable card (Visa/Mastercard routing usually required over proprietary domestic Chinese gateways). Keep the final PDF strictly saved on your WeChat or phone storage.</p>
                </div>
            )
        },
        {
            id: "extending",
            title: "6. Extending in Indonesia",
            content: (
                <div className="space-y-4">
                    <p>If you fail to extend your Visa on Arrival and remain in Indonesia past day 30, you will be struck with a devastating 1,000,000 IDR (approx. 450 RMB) fine for every single day you overstay. Using our registered agency ensures your passport is couriered securely, legally stamped at the Kantor Imigrasi, and returned to your resort flawlessly without penalty.</p>
                </div>
            )
        },
        {
            id: "financial",
            title: "7. Financial Requirements & KITAS",
            content: (
                <div className="space-y-4">
                    <p>Chinese investors building factories in Java, or opening massive restaurant groups in Bali, dominate the Investor KITAS (C313/C314) demographics. To secure this highly privileged 2-year residency permit, a Chinese national must establish a PT PMA (Foreign Investment Company) and prove a minimum personal shareholding of 1 Billion IDR within a 10 Billion IDR corporate structure.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. Frequently Asked Questions",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can Chinese citizens apply for the multiple entry business visa?</h4>
                        <p className="mode-aware-subtext text-sm">Yes, the D212 Multiple Entry visa is available to Chinese passports for attending trade exhibitions and corporate negotiations, but it requires heavy sponsorship documentation from a registered Indonesian corporation.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa Requirements for Chinese Citizens 2026 – Complete Guide"
            subtitle="Navigate Indonesian visa procurement flawlessly. Learn the e-VoA autogate protocols and how Chinese nationals obtain the Investor KITAS."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
