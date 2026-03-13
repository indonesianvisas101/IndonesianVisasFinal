import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa Requirements for Indians 2026 – Complete Guide",
        description: "Everything Indian citizens need to know about traveling to Indonesia. e-VoA processing, B211A sponsorship, and critical immigration warnings for Indian passports.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/visa-indonesia-for-indians`,
        }
    };
}

export default async function VisaForIndiansPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Guides", url: `/${locale}/guides` },
        { label: "Visa Guide for Indian Citizens", url: `/${locale}/visa-indonesia-for-indians` }
    ];

    const cta = {
        title: "Secure Your Entry from India",
        desc: "Whether you need a quick 30-day tourism VoA or a 6-month corporate B211A, we handle 100% of the documentation for Indian passports.",
        buttonText: "Apply For Your Visa Now",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "requirements",
            title: "1. Do Indian Citizens Need a Visa for Indonesia?",
            content: (
                <div className="space-y-4">
                    <p><strong>Yes.</strong> The old visa-exemption rules have been abolished. Indian passport holders seeking entry into Bali, Jakarta, or any other Indonesian port must secure an official visa before or upon landing.</p>
                </div>
            )
        },
        {
            id: "b211a-vs-voa",
            title: "2. B211A vs. VoA for Indian Passports",
            content: (
                <div className="space-y-4">
                    <p>Indian citizens fall beautifully onto the approved Visa on Arrival (VoA) list, unlocking two primary pathways:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>The 30-Day VoA:</strong> Ideal for typical honeymoons or short vacations. It can be purchased electronically (e-VoA) or at the airport terminal. It is renewable once for a total of 60 days.</li>
                        <li><strong>The 180-Day B211A:</strong> The prime choice for remote workers or slow-traveling families wanting to stay for several months. Requires corporate sponsorship from an agency like PT Indonesian Visas.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "evoa-steps",
            title: "3. e-VoA Steps and Requirements",
            content: (
                <div className="space-y-4">
                    <p>The electronic Visa on Arrival entirely removes the need to queue at Denpasar Airport's immigration halls.</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Access Molina (the official immigration portal).</li>
                        <li>Upload a flawless, reflection-free photo of your Indian Passport bio-data page (minimum 6 months validity).</li>
                        <li>Upload a formal passport-style portrait photo.</li>
                        <li>Pay 500,000 IDR (roughly ₹2,700 INR) via international credit card.</li>
                        <li>The approved eVisa PDF will hit your inbox, allowing you immediate access to airport Autogates upon landing.</li>
                    </ol>
                </div>
            )
        },
        {
            id: "extension-limits",
            title: "4. Extension Limits and Rules",
            content: (
                <div className="space-y-4">
                    <p>Both primary visa types can be extended onshore without returning to India. A VoA extends once (+30 days). A B211A extends twice (+60 days each). Crucially, the extension process MUST begin 14 days before your current visa expires. Late extensions instantly result in overstay classification.</p>
                </div>
            )
        },
        {
            id: "corporate",
            title: "5. Corporate Sponsorship (B211A)",
            content: (
                <div className="space-y-4">
                    <p>If purchasing a B211A to stay up to 6 months, Indian citizens are strictly prohibited from sponsoring themselves. The Directorate General of Immigration mandates a registered Indonesian company file a formal letter of guarantee containing the Indian traveler's name, declaring full responsibility for their behavior and financial viability while inside the country.</p>
                </div>
            )
        },
        {
            id: "scams",
            title: "6. Scams and Agent Frauds Targeting Indians",
            content: (
                <div className="space-y-4">
                    <p>Unfortunately, the Indian market is frequently targeted by fake visa 'agents' operating exclusively via WhatsApp. These scammers charge ₹25,000 for a B211A and simply vanish or provide forged PDF documents that result in your immediate deportation upon arrival. Only use verified agencies like PT Indonesian Visas Agency with established corporate credentials (NIB, AHU).</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "7. Medical & Travel Insurance Needs",
            content: (
                <div className="space-y-4">
                    <p>While COVID-19 insurance mandates are gone, riding scooters in Bali is inherently risky. We fiercely recommend securing comprehensive Indian travel insurance (like TATA AIG or Bajaj Allianz) that specifically covers two-wheeler accidents. Healthcare in Bali for uninsured foreigners is catastrophically expensive.</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "8. FAQ for Indian Travelers",
            content: (
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10">
                        <h4 className="font-bold text-primary mb-2">Can Indian citizens get a Multiple Entry Visa?</h4>
                        <p className="mode-aware-subtext text-sm">Yes, the D212 Multiple Entry Business Visa is available for Indian citizens engaging in corporate negotiations or factory inspections, though it strictly prohibits localized IDR employment.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa Requirements for Indians 2026 – Complete Guide"
            subtitle="Understand every regulation governing Indian passports in Indonesia. Prevent devastating visa scams and securely apply for your e-VoA or B211A."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
