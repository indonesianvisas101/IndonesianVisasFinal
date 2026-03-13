import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Requirements for US Citizens 2026 – Complete Guide",
        description: "Everything American travelers need to know about Indonesian visas. Discover e-VoA regulations, B211A requirements for digital nomads, and passport rules.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-indonesia-for-americans`,
        }
    };
}

export default async function VisaForAmericansPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Guides", url: `/${locale}/guides` },
        { label: "Visa Guide for US Citizens", url: `/${locale}/visa-indonesia-for-americans` }
    ];

    const cta = {
        title: "Flying from the USA soon?",
        desc: "Secure your entry to Indonesia digitally. Skip the chaotic arrival lines with a pre-approved Visa on Arrival or a 6-month B211A Digital Nomad Visa.",
        buttonText: "Get Your Visa Now",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "requirements",
            title: "1. Do US Citizens Need a Bali Visa?",
            content: (
                <div className="space-y-4">
                    <p><strong>Yes.</strong> US passport holders are not afforded visa-free entry into Indonesia. Before landing in Bali (DPS) or Jakarta (CGK), American citizens must either secure an electronic Visa on Arrival (e-VoA) or be prepared to purchase a paper Visa on Arrival directly at the airport terminal.</p>
                </div>
            )
        },
        {
            id: "duration",
            title: "2. Permitted Stay Durations",
            content: (
                <div className="space-y-4">
                    <p>The standard Visa on Arrival for Americans provides a maximum initial continuous stay of exactly 30 days. Day 1 starts the moment the immigration officer stamps your passport. The visa can be extended one single time, enabling an absolute maximum trip duration of 60 days before you must leave the Republic of Indonesia.</p>
                </div>
            )
        },
        {
            id: "visa-types",
            title: "3. Best Visa Types for Americans",
            content: (
                <div className="space-y-4">
                    <p>Americans generally utilize two core visa pathways depending on their trip parameters:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Visa on Arrival (VoA):</strong> The standard tool for 30-to-60 day tropical vacations, honeymooners, and short business reconnaissance.</li>
                        <li><strong>B211A Visit Visa:</strong> Widely adopted by American 'digital nomads' flooding into Canggu and Ubud. Sponsored by an agency, it permits sequential extensions up to a massive 180 continuous days without leaving the island.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "documents",
            title: "4. Exact Required Documents",
            content: (
                <div className="space-y-4">
                    <p>American travelers continually make critical mistakes involving their passports. Ensure you possess:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Your blue US Passport. It must visibly have <strong>6 complete months of validity remaining</strong> from the day you land in Indonesia. 5.5 months will trigger immediate boarding denial by Delta, Qatar, Emirates, or any outbound carrier.</li>
                        <li>Zero rips, severe water damage, or tears on the bio-data page. Indonesian border control is notoriously strict regarding passport physical degradation.</li>
                        <li>A verified flight leaving Indonesia within your visa expiration window.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "application",
            title: "5. Application Flow",
            content: (
                <div className="space-y-4">
                    <p>We adamantly recommend securing the e-VoA before you leave American soil.</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Visit the official Indonesian immigration portal (Molina).</li>
                        <li>Upload your high-definition passport scan and a digital headshot.</li>
                        <li>Fill out your final destination (villa/hotel address) and flight details.</li>
                        <li>Pay the 500,000 IDR PNBP fee using an American credit card (Visa/Mastercard).</li>
                        <li>Download the resultant PDF. You can now use the automated e-gates upon arrival in Bali.</li>
                    </ol>
                </div>
            )
        },
        {
            id: "extensions",
            title: "6. Extension Logistics",
            content: (
                <div className="space-y-4">
                    <p>Extending a paper VoA is an archaic, physically demanding process necessitating three distinct trips to a local immigration office. Conversely, extending your e-VoA is achieved in three clicks on the Molina website. Always aim for the electronic route if possible. If you are extending a 6-month B211A, your corporate agency sponsor will dictate exactly when you must arrive for your lone biometric scanning appointment.</p>
                </div>
            )
        },
        {
            id: "travel-tips",
            title: "7. Crucial Travel Tips for US Citizens",
            content: (
                <div className="space-y-4">
                    <p>The transition from American infrastructure to Indonesian reality requires tactical adjustments.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Cash Dominance:</strong> The US is cashless; Indonesia is not. Upon arrival, withdraw Rp 1,000,000 to Rp 2,000,000 in small denominations from a BCA or Mandiri ATM to pay for local food (Warungs), scooter parking, and tips.</li>
                        <li><strong>Power Adapters:</strong> Ensure you bring a European two-pin plug adapter (Type C or Type F) for all your US chargers. Your American flat-pin plugs will not work.</li>
                        <li><strong>Electronic Customs (e-CD):</strong> Fill out the digital Customs Declaration on your phone during your layover to immediately exit the baggage hall.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. FAQ",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can an individual US passport hold two visas at once?</h4>
                        <p className="mode-aware-subtext text-sm">No. If you possess an active B211A eVisa, you must declare it at the border. You cannot elect to 'switch' to a Visa on Arrival on a whim without formally canceling your primary permit.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa Requirements for US Citizens 2026 – Complete Guide"
            subtitle="Navigate Indonesian entry complexities specifically tailored for US passports. Avoid the devastating 6-month validity trap and master extensions."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
