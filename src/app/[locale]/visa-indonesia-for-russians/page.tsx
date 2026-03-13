import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Requirements for Russians 2026 – Complete Guide",
        description: "Visa guide for Russian citizens moving to or visiting Indonesia. Compare VoA vs B211A, learn about the 180-day rule, and KITAS opportunities for Russians.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-indonesia-for-russians`,
        }
    };
}

export default async function VisaForRussiansPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Guides", url: `/${locale}/guides` },
        { label: "Visa Guide for Russian Citizens", url: `/${locale}/visa-indonesia-for-russians` }
    ];

    const cta = {
        title: "Secure Your B211A Agency Sponsorship",
        desc: "Moving to Bali? Let our legal team act as your corporate sponsor to unlock the massive 180-day B211A visa securely.",
        buttonText: "Get Sponsored Today",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "requirements",
            title: "1. Visa Rules for Russian Passports 2026",
            content: (
                <div className="space-y-4">
                    <p>Russian citizens are absolutely compelled to hold an authorized visa to enter Indonesia. The landscape for Russian passports in Bali is heavily monitored, meaning absolute strict compliance with visa designations is necessary to avoid harsh immigration deportations.</p>
                </div>
            )
        },
        {
            id: "b211a-vs-voa",
            title: "2. Moving to Bali: B211A vs VoA",
            content: (
                <div className="space-y-4">
                    <p>Bali maintains a massive Russian expat community. If you plan to visit for a month-long holiday, the <strong>Visa on Arrival (VoA)</strong> is completely sufficient. However, if you plan to relocate for the winter or operate remotely, the <strong>B211A Visit Visa</strong> is the sole viable path as a tourist, allowing up to 180 days of continuous presence provided you use an agency sponsor.</p>
                </div>
            )
        },
        {
            id: "evoa-system",
            title: "3. The e-VoA Processing System",
            content: (
                <div className="space-y-4">
                    <p>Russian passports enjoy access to the Molina e-VoA system. Upload your passport bio-page and portrait, and pay the 500,000 IDR fee. Due to current international banking limitations, ensure your payment card is capable of processing international transactions on global networks (Visa/Mastercard) avoiding sanctioned domestic routing.</p>
                </div>
            )
        },
        {
            id: "financial-proof",
            title: "4. Bank Statements and Financial Proof",
            content: (
                <div className="space-y-4">
                    <p>When an agency applies for a B211A on your behalf, immigration strictly requires a bank statement validating substantial financial means to support yourself without illegally taking up jobs in Bali. You must provide a highly legible PDF statement reflecting a minimum balance equivalent to $2,000 USD. Screenshots of crypto wallets are definitively not accepted by the Directorate General.</p>
                </div>
            )
        },
        {
            id: "extending",
            title: "5. Extending Your Stay to 180 Days",
            content: (
                <div className="space-y-4">
                    <p>Holding a B211A is powerful, but requires intense bureaucratic synchronization. The initial visa grants 60 days. You must pay an agency to sponsor your first extension (+60 days) roughly two weeks before the deadline, requiring a short biometric fingerprinting appointment. A final second extension guarantees the final 60 days. Russian citizens cannot exceed 180 days on this visa class.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "6. The Brutality of Overstay Fines",
            content: (
                <div className="space-y-4">
                    <p>Immigration enforcement in Bali has escalated significantly. If a Russian citizen overstays their visa duration by even 24 hours, they are instantly fined 1,000,000 IDR (approx. 6,000 Rubles) per day. If the overstay eclipses 60 days, imprisonment followed by deportation and a multi-year blacklist from Indonesia is guaranteed.</p>
                </div>
            )
        },
        {
            id: "working-kitas",
            title: "7. Working on a KITAS as a Russian",
            content: (
                <div className="space-y-4">
                    <p>Many Russian citizens illegally attempt to work as photographers, surf instructors, or real estate brokers on standard B211A tourist visas. This results in daily deportations. To legally earn IDR revenue from Indonesian soil, a Russian national must act as a director of a PMA and hold an Investor KITAS (C314) or be formally sponsored by an Indonesian company for a highly-taxed Working KITAS (C312).</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. Important FAQ",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can I enter Indonesia if my passport expires in 4 months?</h4>
                        <p className="mode-aware-subtext text-sm">No. You will be denied boarding at your airport of origin. Russian passports must absolutely contain a minimum of 6 full months of validity from the moment the plane lands in Jakarta or Bali.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa Requirements for Russians 2026 – Complete Guide"
            subtitle="The ultimate roadmap for Russian citizens relocating to Bali. Comprehend strict immigration monitoring, B211A sponsorship pathways, and legal KITAS requirements."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
