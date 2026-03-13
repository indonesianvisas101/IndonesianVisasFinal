import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Extend VoA Bali 2026 – 30 Day Extension Guide",
        description: "Step-by-step guide to extending your 30-day Visa on Arrival (VoA) in Bali. Digital e-VoA extensions vs Paper VoA processing timelines.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-extension/extend-voa-bali`,
        }
    };
}

export default async function ExtendVoaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Visa Extensions", url: `/${locale}/visa-extension` },
        { label: "Extend VoA Bali", url: `/${locale}/visa-extension/extend-voa-bali` }
    ];

    const cta = {
        title: "30-Day VoA Running Out?",
        desc: "Don't line up at immigration. Hand us your passport, relax by the pool, and let our agents finalize your VoA extension in the background.",
        buttonText: "Start VoA Extension",
        link: `/${locale}/extend`
    };

    const sections = [
        {
            id: "what-is-voa-ext",
            title: "1. What is the VoA Extension?",
            content: (
                <div className="space-y-4">
                    <p>The standard Visa on Arrival affords exactly 30 days of stay. The Indonesian government permits foreigners to purchase one supplementary 30-day block, bringing the total permitted stay to 60 absolute days. After these 60 days, no further VoA extensions are possible.</p>
                </div>
            )
        },
        {
            id: "eligible-visas",
            title: "2. Is Your Visa Actually Eligible?",
            content: (
                <div className="space-y-4">
                    <p>Only the B1 Visa on Arrival can utilize this specific extension. If you carry a B211A, you follow a different track. If your passport stamp explicitly says "VISA EXEMPTION" (common for ASEAN citizens), you are entirely barred from extending and must exit the country by day 30.</p>
                </div>
            )
        },
        {
            id: "evoa-vs-paper",
            title: "3. e-VoA vs. Paper VoA Processing",
            content: (
                <div className="space-y-4">
                    <p><strong>e-VoA:</strong> If you purchased your VoA online prior to flying via the Molina portal, the extension is fully digital. Simply log into the portal and process the 500k IDR fee before the deadline.</p>
                    <p><strong>Paper VoA:</strong> If you paid cash at the airport counter, you must forfeit your physical passport to the immigration office for roughly a week and undergo biometric scanning. This is where agencies save you massive amounts of time.</p>
                </div>
            )
        },
        {
            id: "agency-benefits",
            title: "4. Benefits of Agency Sponsorship",
            content: (
                <div className="space-y-4">
                    <p>For paper VoA holders, an agency eliminates two of the three mandatory immigration visits. An agency representative physically queues at the immigration office before dawn to secure your ticket, files your paperwork, and then escorts you precisely to the biometric camera room an hour later, skipping the standard hundreds-deep tourist queue.</p>
                </div>
            )
        },
        {
            id: "pricing",
            title: "5. Government vs. Agency Costs",
            content: (
                <div className="space-y-4">
                    <p>The raw government PNBP fee is 500,000 IDR. Using PT Indonesian Visas Agency typically costs around 850,000 IDR total. That 350,000 IDR delta covers courier pickup, hours of direct agent labor at the immigration office, and absolute overstay risk protection.</p>
                </div>
            )
        },
        {
            id: "timeline",
            title: "6. The Actual Process Timeline",
            content: (
                <div className="space-y-4">
                    <p>Day 1: Physical passport collected by agency courier.<br/>Day 3-4: Agency submits the passport and queue docket into the immigration system.<br/>Day 6-8: You attend the 10-minute biometric appointment.<br/>Day 10: Passport is retrieved by the agency and delivered to your accommodation.</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "7. Avoiding Overstay Penalties",
            content: (
                <div className="space-y-4">
                    <p>If you hand your passport to an agency 48 hours before it expires, you will almost certainly incur overstay fines (1,000,000 IDR / day) because the passport cannot be mechanically processed into the bureaucratic system fast enough over the weekend. Always initiate extensions at least 10 days out.</p>
                </div>
            )
        },
        {
            id: "checklist",
            title: "8. VoA Extension Checklist",
            content: (
                <div className="space-y-4">
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Passport Original</li>
                        <li>Copy of Onward Flight out of Indonesia</li>
                        <li>Exact Villa/Hotel Address in Bali</li>
                    </ul>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Extend VoA Bali 2026 – 30 Day Extension Guide"
            subtitle="The fast, stress-free guide to maximizing your Bali holiday by officially extending your Visa on Arrival to the absolute 60 day maximum."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
