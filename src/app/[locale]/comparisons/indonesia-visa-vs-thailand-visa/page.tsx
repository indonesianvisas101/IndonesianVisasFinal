import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Indonesia Visa vs Thailand Visa 2026 – Which is Better for Nomads?",
        description: "A head-to-head comparison of Indonesia (B211A/KITAS) and Thailand (DTV/LTR) visa programs. Compare costs, stay limits, and ease of application for 2026.",
        alternates: {
            canonical: `https://indonesianvisas.com/${locale}/comparisons/indonesia-visa-vs-thailand-visa`,
        }
    };
}

export default async function IndonesiaVsThailandPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Comparisons", url: `/${locale}/comparisons` },
        { label: "Indonesia vs Thailand", url: `/${locale}/comparisons/indonesia-visa-vs-thailand-visa` }
    ];

    const cta = {
        title: "Decided on Indonesia?",
        desc: "We provide the most robust B211A corporate sponsorship in the archipelago. Get your 180-day digital nomad stay secured today.",
        buttonText: "Apply for Indonesian B211A",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "the-great-debate",
            title: "1. The 2026 Nomad Debate: Bali or Bangkok?",
            content: (
                <div className="space-y-4">
                    <p>
                        For a decade, Southeast Asian digital nomads have oscillated between Bali and Thailand. As we move into 2026, both governments have dramatically overhauled their entry protocols. Choosing between an Indonesian B211A and a Thai DTV (Destination Thailand Visa) requires a granular understanding of costs, residency rights, and long-term security.
                    </p>
                </div>
            )
        },
        {
            id: "short-term",
            title: "2. Short-Term Comparison (30-60 Days)",
            content: (
                <div className="space-y-4">
                    <p><strong>Thailand:</strong> Currently offers a 60-day visa exemption for many Western countries, which is incredibly convenient and free.</p>
                    <p><strong>Indonesia:</strong> Requires a 500,000 IDR (approx. $32 USD) Visa on Arrival for 30 days, extendable to 60. While Indonesia is slightly more expensive for short trips, its Autogate system currently outperforms Thai airport arrival speeds for e-Visa holders.</p>
                </div>
            )
        },
        {
            id: "nomad-visas",
            title: "3. Digital Nomad Specific Programs",
            content: (
                <div className="space-y-4">
                    <p>This is where the two nations diverge most sharply:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Thailand DTV:</strong> A 5-year multiple-entry visa allowing 180 days per entry. It requires proof of 500k THB in savings and has a relatively low application fee.</li>
                        <li><strong>Indonesia B211A:</strong> A single-entry visa yielding up to 180 continuous days. While it requires corporate sponsorship (unlike the DTV), it provides more direct legal protection through the agency-government link.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "bureaucracy",
            title: "4. Ease of Application",
            content: (
                <div className="space-y-4">
                    <p>
                        Thailand's E-Visa system is robust but can be pedantic regarding document formatting. Indonesia's Molina system is streamlined but heavily dependent on having a high-quality scan of your passport's MRZ code. If you use an agency like PT Indonesian Visas, the Indonesian process is arguably the "laziest" for the traveler, as we handle everything from sponsorship to the final PDF issuance.
                    </p>
                </div>
            )
        },
        {
            id: "extensions",
            title: "5. Onshore Extensions",
            content: (
                <div className="space-y-4">
                    <p>
                        Extending in Thailand often requires a trip to the chaotic Chaeng Watthana in Bangkok or similarly busy provincial offices. Indonesia (Bali) is transitioning many extensions to digital-only formats for e-VoA holders. However, for B211A extensions, the mandatory biometric visit to one of Bali's three immigration offices is still a requirement—one that agencies help expedite significantly.
                    </p>
                </div>
            )
        },
        {
            id: "long-term",
            title: "6. Long-Term Residency (KITAS vs LTR)",
            content: (
                <div className="space-y-4">
                    <p>
                        For those looking to stay 1-2 years:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Indonesia Investor KITAS:</strong> Requires establishing a PMA company ($650k+ capitalization). It's a serious business commitment but offers full residency rights.</li>
                        <li><strong>Thailand LTR:</strong> Targets high-net-worth individuals or "wealthy pensioners" with $80k+ annual income. It's harder to attain than an Investor KITAS if you are a mid-level entrepreneur.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "taxation",
            title: "7. Taxation Considerations",
            content: (
                <div className="space-y-4">
                    <p>
                        Both countries are tightening the net on foreign income. Thailand recently pivoted to taxing foreign-sourced income if brought into the country within the same tax year. Indonesia legally taxes global income for any resident staying over 183 days, though enforcement for remote workers on B211A visas remains focused on local compliance rather than global audits.
                    </p>
                </div>
            )
        },
        {
            id: "verdict",
            title: "8. The 2026 Verdict",
            content: (
                <div className="space-y-4">
                    <p>
                        <strong>Choose Thailand if:</strong> You want a "set and forget" 5-year multi-entry pass (DTV) and don't mind the 180-day border runs.
                    </p>
                    <p>
                        <strong>Choose Indonesia if:</strong> You want the absolute maximum continuous stay (180 days) without leaving your villa, and you prefer having a local corporate agency handle your legal standing.
                    </p>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="Indonesia Visa vs Thailand Visa 2026 – Which is Better for Nomads?"
            subtitle="An objective, data-driven comparison of the two most popular Southeast Asian nomad hubs. Master the DTV vs B211A debate."
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
