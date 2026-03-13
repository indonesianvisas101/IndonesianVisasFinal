import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Requirements for UK Citizens 2026 – Complete Guide",
        description: "Comprehensive visa guide for British passport holders visiting Indonesia. Learn about the 2026 VoA logic, B211A extensions, and essential UK travel tips.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-indonesia-for-uk-citizens`,
        }
    };
}

export default async function VisaForUKPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Guides", url: `/${locale}/guides` },
        { label: "Visa Guide for UK Citizens", url: `/${locale}/visa-indonesia-for-uk-citizens` }
    ];

    const cta = {
        title: "Escape the British Winter",
        desc: "Secure your 60-day Bali escape legally and securely. We handle all VoA and B211A sponsorship pathways.",
        buttonText: "Start Application Process",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "requirements",
            title: "1. UK Citizen Immigration Rules",
            content: (
                <div className="space-y-4">
                    <p>The post-pandemic border protocols in Indonesia dictate that British citizens (holders of UK Passports) categorically <strong>require a visa</strong> to cross into Indonesian territory. The previous free-entry tourist stamps have been universally revoked.</p>
                </div>
            )
        },
        {
            id: "duration",
            title: "2. Exploring Stay Durations",
            content: (
                <div className="space-y-4">
                    <p>The runway you have in the country scales with the visa you purchase. A standard Visa on Arrival provides a rigid 30-day window, extendable once to 60 days. Comparatively, purchasing a corporate-sponsored B211A before you depart the UK unlocks an initial 60 days with the sheer power to extend up to 180 continuous days.</p>
                </div>
            )
        },
        {
            id: "visa-types",
            title: "3. What Visas Work Best for British Expats?",
            content: (
                <div className="space-y-4">
                    <p>British citizens integrate seamlessly into the Indonesian system across several modalities:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Short Tourism:</strong> B1 Visa on Arrival (VoA/e-VoA).</li>
                        <li><strong>Remote Work & Slow Travel:</strong> B211A Social/Visit Visa.</li>
                        <li><strong>Entrepreneurship:</strong> Forming a PT PMA company to secure an Investor KITAS (C313/C314).</li>
                    </ul>
                </div>
            )
        },
        {
            id: "documents",
            title: "4. UK Passport Requirements",
            content: (
                <div className="space-y-4">
                    <p>When presenting your British passport to either an online portal or an immigration agent in Bali:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>It must boast a minimum of <strong>6 months of remaining validity</strong> from your exact date of entry.</li>
                        <li>It must contain at least one blank page for extension stamping (if you opt for the paper route).</li>
                        <li>You must possess a confirmed, paid flight taking you out of Indonesian airspace prior to the visa expiring.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "application",
            title: "5. Acquiring the e-VoA",
            content: (
                <div className="space-y-4">
                    <p>Skip the grueling queue upon landing after a 17-hour flight from London. Here's the streamlined path:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Access the Molina e-Visa platform.</li>
                        <li>Filter nationality to the United Kingdom and upload your document photography.</li>
                        <li>Clear the ~£25 (500,000 IDR) PNBP fee via Visa/Mastercard.</li>
                        <li>Save the authorized PDF to your phone. At the airport, simply scan your passport on the digital Autogate screen and walk straight to baggage claim.</li>
                    </ol>
                </div>
            )
        },
        {
            id: "extensions",
            title: "6. Rules Surrounding Extensions",
            content: (
                <div className="space-y-4">
                    <p>For British citizens holding a B211A, extensions are heavily bureaucratic. You must use your initial corporate sponsor to file the paperwork roughly 14 days before your block expires. You will be mandated to visit a local immigration block (Kantor Imigrasi) once to scan your fingerprints. Missing this extension window instantly results in a ruthless £50 (1M IDR) fine, calculated daily.</p>
                </div>
            )
        },
        {
            id: "travel-tips",
            title: "7. Regional Travel Nuances for Brits",
            content: (
                <div className="space-y-4">
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Driving:</strong> Similar to the UK, Indonesia drives on the <strong>Left</strong> side of the road, minimizing the learning curve for scooter rentals. However, you absolutely must secure an International Driving Permit (IDP) from the Post Office before leaving the UK to remain legally street compliant.</li>
                        <li><strong>Medical Coverage:</strong> Do not rely on home structures like the NHS. High-tier comprehensive travel insurance that explicitly covers motorcycle incidents is non-negotiable.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. FAQ & Common Traps",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">My passport was stolen in Bali. What do I do?</h4>
                        <p className="mode-aware-subtext text-sm">You must immediately file a Police Report (Surat Keterangan Kehilangan Keberadaan) at the nearest station, present this to the British Consulate in Denpasar to acquire an Emergency Travel Document (ETD), and then execute an immigration transfer to migrate your VoA data onto the new ETD before attempting to leave the country.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa Requirements for UK Citizens 2026 – Complete Guide"
            subtitle="The ultimate roadmap for British passport holders. Bypass the horrific airport queues with an e-VoA and navigate local laws seamlessly."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
